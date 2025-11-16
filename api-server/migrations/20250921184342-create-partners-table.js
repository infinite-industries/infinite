'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('partners', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      logo_url: {
        type: Sequelize.STRING,
        allowNull: true
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

    // Add a unique index on the name column with case-insensitivity
    await queryInterface.addIndex('partners', {
      fields: [Sequelize.fn('lower', Sequelize.col('name'))],
      unique: true,
      name: 'partners_name_lowercase_unique'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('partners');
  }
};
