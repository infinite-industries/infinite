'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('events', 'address'),
      queryInterface.removeColumn('events', 'map_link')
    ]
  },

  async down (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'events',
        'address',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'events',
        'map_link',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ]
  }
};
