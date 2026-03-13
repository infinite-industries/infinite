'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('venues_partners_mappings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      venue_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'venues',
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

    await queryInterface.addConstraint('venues_partners_mappings', {
      fields: ['venue_id', 'partner_id'],
      type: 'unique',
      name: 'unique_venue_partner_mapping'
    });

    await queryInterface.addIndex('venues_partners_mappings', {
      fields: ['venue_id'],
      name: 'idx_venues_partners_mappings_venue_id'
    });

    await queryInterface.addIndex('venues_partners_mappings', {
      fields: ['partner_id'],
      name: 'idx_venues_partners_mappings_partner_id'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('venues_partners_mappings');
  }
};
