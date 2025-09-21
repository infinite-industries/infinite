'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users_partners_mappings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      partner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Add a composite unique constraint to prevent duplicate user-partner mappings
    await queryInterface.addConstraint('users_partners_mappings', {
      fields: ['user_id', 'partner_id'],
      type: 'unique',
      name: 'unique_user_partner_mapping'
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('users_partners_mappings', {
      fields: ['user_id'],
      name: 'idx_users_partners_mappings_user_id'
    });

    await queryInterface.addIndex('users_partners_mappings', {
      fields: ['partner_id'],
      name: 'idx_users_partners_mappings_partner_id'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users_partners_mappings');
  }
};
