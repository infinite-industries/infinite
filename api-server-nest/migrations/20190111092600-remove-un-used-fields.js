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

      ALTER TABLE events
        DROP COLUMN time_start;
  
      ALTER TABLE events
        DROP COLUMN time_end;
        
      ALTER TABLE events
        DROP COLUMN additional_dates;

      CREATE VIEW current_events AS
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
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
        ALTER TABLE events
            ADD COLUMN time_start timestamp with time zone;

        ALTER TABLE events
            ADD COLUMN time_end timestamp with time zone;

        ALTER TABLE events
            ADD COLUMN additional_dates jsonb;

        DROP VIEW current_events;

        CREATE VIEW current_events AS
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
