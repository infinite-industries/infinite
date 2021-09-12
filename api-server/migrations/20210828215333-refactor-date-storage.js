'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE if NOT EXISTS datetime_venue(
         id UUID NOT NULL
          CONSTRAINT datetime_venue_pkey primary key,
         event_id UUID NOT NULL
          CONSTRAINT datetime_venue_event_id REFERENCES events,
         venue_id UUID
          CONSTRAINT datetime_venue_venue_id REFERENCES venues,
         start_time timestamp with time zone NOT NULL,
         end_time timestamp with time zone NOT NULL,
         optional_title VARCHAR(255)
      );

      INSERT INTO datetime_venue (id, event_id, venue_id, start_time, end_time, optional_title)
          SELECT
              public.uuid_generate_v4() as id,
              events.id as event_id,
              events.venue_id,
              start_time,
              end_time,
              optional_title
          FROM
               events,
               jsonb_to_recordset(events.date_times) AS dates(start_time timestamp, end_time timestamp, optional_title character varying(255));

      CREATE VIEW current_date_times_jsonb AS
      SELECT event_id, jsonb_agg(date_times ORDER BY date_times->'start_time') as date_times
      FROM (
        SELECT event_id, to_jsonb(times) #- '{event_id}' AS date_times
        FROM (
          SELECT
            event_id,
            start_time::timestamptz,
            end_time::timestamptz,
            optional_title
            FROM datetime_venue
            WHERE end_time >= (now() - '24:00:00'::interval)
        ) times) agg
        GROUP BY event_id;

      DROP VIEW current_events;

      CREATE VIEW current_events AS
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

      DROP VIEW current_events_transform_2;

      DROP VIEW current_events_transform_1;
    `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE VIEW current_events_transform_1 AS
    SELECT *,
      ((jsonb_array_elements(events_2.date_times) ->> 'start_time'::text))::timestamp without time zone AS timestamp_start,
      ((jsonb_array_elements(events_2.date_times) ->> 'end_time'::text))::timestamp without time zone   AS timestamp_end,
      (jsonb_array_elements(events_2.date_times) ->> 'start_time'::text) AS timestamp_start_text,
      (jsonb_array_elements(events_2.date_times) ->> 'end_time'::text) AS timestamp_end_text
    FROM events events_2;

    CREATE VIEW current_events_transform_2 AS
    SELECT id,
      json_agg(
        json_build_object('start_time', timestamp_start_text,
          'end_time', timestamp_end_text)
    ORDER BY timestamp_start_text)  AS date_times
    FROM current_events_transform_1
    WHERE (timestamp_end >= (now() - '24:00:00'::interval))
    GROUP BY id;

    DROP VIEW current_events;

    CREATE VIEW current_events AS
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
        events.accessibility,
        sub.date_times,
        (((sub.date_times -> 0) ->> 'start_time'::text))::timestamptz AS first_day_start_time,
        (((sub.date_times -> (json_array_length(sub.date_times) - 1)) ->> 'end_time'::text))::timestamptz AS last_day_end_time
      FROM events
      JOIN (
        SELECT id, json_agg(json_build_object('start_time', timestamp_start_text, 'end_time', timestamp_end_text)) AS date_times FROM (
          SELECT
            *,
            ((jsonb_array_elements(date_times) ->> 'start_time'::text))::timestamp without time zone AS timestamp_start,
            ((jsonb_array_elements(date_times) ->> 'end_time'::text))::timestamp without time zone AS timestamp_end,
            ((jsonb_array_elements(date_times) ->> 'start_time'::text)) AS timestamp_start_text,
            ((jsonb_array_elements(date_times) ->> 'end_time'::text)) AS timestamp_end_text
          FROM events
          ORDER BY timestamp_start
        ) events_1
      WHERE timestamp_end >= now() - '24:00:00'::interval
      GROUP BY (events_1.id)
      ) sub ON events.id = sub.id;

      DROP VIEW current_date_times_jsonb;
      
      DROP TABLE datetime_venue;
      `)
  }
};
