'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE venues
      ADD COLUMN IF NOT EXISTS gps_lat FLOAT,
      ADD COLUMN IF NOT EXISTS gps_long FLOAT,
      ADD COLUMN IF NOT EXISTS gps_alt FLOAT;
    `)
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE venues
      DROP COLUMN IF EXISTS gps_lat,
      DROP COLUMN IF EXISTS gps_long,
      DROP COLUMN IF EXISTS gps_alt;
    `)
  }
};
