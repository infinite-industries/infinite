/**
 * Drops the columns 	time_start timestamp with time zone
 *
 * It drops and re-creates the view to allow dropping the columns
 *
 * @type {{up: (function(*): *), down: down}}
 */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
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
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        DROP VIEW current_events;

        CREATE OR REPLACE VIEW current_events AS
        SELECT *,
               CAST(events.date_times->0->>'start_time' AS TIMESTAMP) AS start_time,
               CAST(events.date_times->0->>'end_time' AS TIMESTAMP) AS end_time
        FROM events
        WHERE id IN(SELECT DISTINCT (events_with_times.id)
                    FROM (SELECT events.*,
                                 CAST(jsonb_array_elements(events.date_times)->>'end_time' AS TIMESTAMP) AS end_timestamp
                          FROM events
                          WHERE date_times IS NOT NULL) AS events_with_times
                    WHERE events_with_times.end_timestamp >= now()- interval '24 hour');
    `)
  }
}
