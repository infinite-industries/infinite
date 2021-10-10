'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('events', 'date_times');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE events
      ADD COLUMN date_times jsonb;

      UPDATE events
      SET date_times = date_times_agg
      FROM
      (SELECT
        event_id,
        jsonb_agg(
          json_build_object('start_time', start_time, 'end_time', end_time, 'optional_title', optional_title)
          ORDER BY start_time)
        AS date_times_agg
        FROM datetime_venue
        GROUP BY event_id
        ) agg
      WHERE events.id = agg.event_id;
    `)
  }
};
