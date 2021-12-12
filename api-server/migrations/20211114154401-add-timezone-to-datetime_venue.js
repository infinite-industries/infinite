'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'datetime_venue',
      'timezone',
      {
        type: Sequelize.STRING,
        defaultValue: 'America/New_York',
        allowNull: false
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'datetime_venue',
      'timezone'
    )
  }
};
