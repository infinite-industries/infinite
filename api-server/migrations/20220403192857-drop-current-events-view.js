'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    DROP VIEW current_events;
    DROP VIEW current_date_times_jsonb;
      `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE OR REPLACE VIEW current_date_times_jsonb AS
    SELECT event_id, jsonb_agg(date_times ORDER BY date_times->'start_time') as date_times
    FROM (
      SELECT event_id, to_jsonb(times) #- '{event_id}' AS date_times
      FROM (
        SELECT
          event_id,
          start_time::timestamptz,
          end_time::timestamptz,
          venue_id,
          timezone,
          optional_title
          FROM datetime_venue
          WHERE end_time >= (now() - '2:00:00'::interval)
      ) times) agg
      GROUP BY event_id;

      CREATE OR REPLACE VIEW current_events AS
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
        current_date_times_jsonb.date_times,
        (current_date_times_jsonb.date_times#>>'{0,start_time}')::timestamptz as first_day_start_time,
        (current_date_times_jsonb.date_times#>>'{-1,end_time}')::timestamptz as last_day_end_time
      FROM events
      JOIN current_date_times_jsonb ON id = event_id;

      `)
  }
};
