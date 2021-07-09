'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TABLE events
    ADD COLUMN accessibility character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[];
    `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TABLE events
    DROP COLUMN accessibility;
    `)
  }
};
