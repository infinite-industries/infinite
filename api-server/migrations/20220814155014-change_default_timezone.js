'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE datetime_venue
      ALTER COLUMN timezone
      SET DEFAULT 'US/Eastern';

      UPDATE datetime_venue
      SET timezone = 'US/Eastern'
      WHERE timezone = 'America/New_York';
    `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE datetime_venue
      ALTER COLUMN timezone
      SET DEFAULT 'America/New_York';

      UPDATE datetime_venue
      SET timezone = 'America/New_York'
      WHERE timezone = 'US/Eastern';
    `)
  }
};
