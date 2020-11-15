'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
     'DROP VIEW current_events;' +
     'CREATE VIEW current_events AS\n' +
      'SELECT' +
      ' *,\n' +
      ' CAST(events.date_times->0->>\'start_time\' AS TIMESTAMP) AS start_time,\n' +
      ' CAST(events.date_times->0->>\'end_time\' AS TIMESTAMP) AS end_time\n' +
      'FROM events\n' +
      '   WHERE id IN(SELECT DISTINCT (events_with_times.id)\n' +
      '               FROM (SELECT events.*,\n' +
      '                            CAST(jsonb_array_elements(events.date_times)->>\'end_time\' AS TIMESTAMP) AS end_timestamp\n' +
      '                     FROM events\n' +
      '                     WHERE date_times IS NOT NULL) AS events_with_times\n' +
      '               WHERE events_with_times.end_timestamp >= now()- interval \'24 hour\');')
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
