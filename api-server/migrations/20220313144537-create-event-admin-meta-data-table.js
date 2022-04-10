'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS event_admin_metadata(
       event_id UUID UNIQUE NOT NULL CONSTRAINT event_admin_metadata_event_id primary key REFERENCES events ON DELETE CASCADE,
       is_problem boolean,
       "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP TABLE IF NOT EXISTS event_admin_metadata`)
  }
};
