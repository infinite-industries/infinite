'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface
        .createTable('announcements',{
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()')
          },
          message: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('now()')
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('now()')
          }
        })
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
