'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'datetime_venue',
        'type',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'events',
        'mode',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'events',
        'category',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'events',
        'condition',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ]
  },

  async down(queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('datetime_venue', 'type'),
      queryInterface.removeColumn('events', 'mode'),
      queryInterface.removeColumn('events', 'category'),
      queryInterface.removeColumn('events', 'condition')
    ]
  }
};
