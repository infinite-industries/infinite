'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
      'venues',
      'street',
      {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      }
    ),
      queryInterface.addColumn(
      'venues',
      'city',
      {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      }
    ),
      queryInterface.addColumn(
      'venues',
      'state',
      {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      }
    ),
      queryInterface.addColumn(
      'venues',
      'zip',
      {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      }
    ),
      queryInterface.addColumn(
      'venues',
      'neighborhood',
      {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      }
    )
  ]
},

down: async (queryInterface, Sequelize) => {
  return [
    queryInterface.removeColumn('venues', 'street'),
    queryInterface.removeColumn('venues', 'city'),
    queryInterface.removeColumn('venues', 'state'),
    queryInterface.removeColumn('venues', 'zip'),
    queryInterface.removeColumn('venues', 'neighborhood')
    ]
  }
};
