'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
          optional_title
          FROM datetime_venue
          WHERE end_time >= (now() - '2:00:00'::interval)
      ) times) agg
      GROUP BY event_id;
      `)
  }
};
