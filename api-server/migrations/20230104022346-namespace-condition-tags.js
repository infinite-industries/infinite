'use strict';

/**
 * Special behavior was added to the web portal for events tagged with
 * "postponed" and "cancelled" in 2020.
 * This migration brings these tags in line with the newer "control" tags
 * for "mode" and "category", prefixing them with "condition:"
 */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
    UPDATE events
    SET tags = array_remove(array_append(tags, 'condition:postponed'), 'postponed')
    WHERE 'postponed' = any (tags);

    UPDATE events
    SET tags = array_remove(array_append(tags, 'condition:cancelled'), 'cancelled')
    WHERE 'cancelled' = any (tags);
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
    UPDATE events
    SET tags = array_remove(array_append(tags, 'postponed'), 'condition:postponed')
    WHERE 'condition:postponed' = any (tags);

    UPDATE events
    SET tags = array_remove(array_append(tags, 'cancelled'), 'condition:cancelled')
    WHERE 'condition:cancelled' = any (tags);
    `)
  }
};
