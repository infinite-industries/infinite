'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the new light_logo_url column
    await queryInterface.addColumn('partners', 'light_logo_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add the new dark_logo_url column
    await queryInterface.addColumn('partners', 'dark_logo_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Copy existing logo_url values to both new columns
    await queryInterface.sequelize.query(`
      UPDATE partners
      SET light_logo_url = logo_url,
          dark_logo_url = logo_url
      WHERE logo_url IS NOT NULL;
    `);

    // Remove the old logo_url column
    await queryInterface.removeColumn('partners', 'logo_url');
  },

  async down(queryInterface, Sequelize) {
    // Add back the logo_url column
    await queryInterface.addColumn('partners', 'logo_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Copy light_logo_url back to logo_url (prefer light over dark)
    await queryInterface.sequelize.query(`
      UPDATE partners
      SET logo_url = COALESCE(light_logo_url, dark_logo_url)
      WHERE light_logo_url IS NOT NULL OR dark_logo_url IS NOT NULL;
    `);

    // Remove the new columns
    await queryInterface.removeColumn('partners', 'light_logo_url');
    await queryInterface.removeColumn('partners', 'dark_logo_url');
  },
};
