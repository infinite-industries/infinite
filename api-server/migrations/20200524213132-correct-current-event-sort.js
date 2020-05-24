'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    -- View 1 - Split multi-day events out into spearate rows
    create or replace view current_events_transform_1 as
    SELECT *,
      ((jsonb_array_elements(events_2.date_times) ->> 'start_time'::text))::timestamp without time zone AS timestamp_start,
      ((jsonb_array_elements(events_2.date_times) ->> 'end_time'::text))::timestamp without time zone   AS timestamp_end,
      (jsonb_array_elements(events_2.date_times) ->> 'start_time'::text)                                AS timestamp_start_text,
      (jsonb_array_elements(events_2.date_times) ->> 'end_time'::text)                                  AS timestamp_end_text
    FROM events events_2;

    -- View 2 - Aggregate the results back together sorting on start_time during re-aggregation
    create or replace view current_events_transform_2 as
    SELECT id,
      json_agg(
        json_build_object('start_time', timestamp_start_text,
          'end_time', timestamp_end_text)
    ORDER BY timestamp_start_text)  AS date_times
    FROM current_events_transform_1
    WHERE (timestamp_end >= (now() - '24:00:00'::interval))
    GROUP BY id;

    -- Final View - Merge back into the events data producing single rows with correctly sorted aggregate event columns and expose the first index as first_day_start_time
    create or replace view current_events as
    SELECT
    events.id,
      events.title,
      events.slug,
      events.multi_day,
      events.image,
      events.social_image,
      events.venue_id,
      events.admission_fee,
      events.address,
      events.organizer_contact,
      events.map_link,
      events.brief_description,
      events.description,
      events.links,
      events.website_link,
      events.ticket_link,
      events.fb_event_link,
      events.eventbrite_link,
      events.bitly_link,
      events.tags,
      events.verified,
      events."createdAt",
      events."updatedAt",
      events.reviewed_by_org,
      sub.date_times,
      (((sub.date_times -> 0) ->> 'start_time'::text))::timestamptz AS first_day_start_time,
      (((sub.date_times -> (json_array_length(sub.date_times) - 1)) ->> 'end_time'::text))::timestamptz AS last_day_end_time
    FROM current_events_transform_2 sub
    JOIN events on sub.id = events.id;
    `)
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
