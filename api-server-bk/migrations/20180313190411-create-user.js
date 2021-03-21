'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nickname: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      identifier: {
        type: Sequelize.STRING
      },
      settings: {
        type: Sequelize.JSONB
      },
      permissions_post_as_venues: {
        type: Sequelize.JSONB
      },
      permissions_edit_lists: {
        type: Sequelize.JSONB
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};