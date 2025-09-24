'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('events', 'owning_partner_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'partners',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('events', 'owning_partner_id');
  }
};
