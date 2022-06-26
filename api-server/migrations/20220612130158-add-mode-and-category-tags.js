'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`

    /* update controls tags on existing online resources */
    UPDATE events
    SET tags = array_remove(array_remove(
      array_append(array_append(tags, 'mode:online'), 'category:online-resource'),
      'remote'), 'online-resource')
    WHERE 'online-resource' = any (tags);

    /* update control tags on existing remote events */
    UPDATE events
    SET tags = array_remove(array_append(tags, 'mode:online'), 'remote')
    WHERE 'remote' = any (tags)
    AND NOT 'mode:online' = any (tags); /* avoid double-tagging an online resource also flagged as remote */
    `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    UPDATE events
    SET tags = array_remove(tags, 'mode:in-person')
    WHERE 'mode:in-person' = any (tags);

    /* replace mode:online with remote for truly remote events, but not online resources */
    UPDATE events
    SET tags = array_append(array_remove(tags, 'mode:online'), 'remote')
    WHERE 'mode:online' = any (tags)
      AND (not 'category:online-resource' = any (tags));

    /* remove mode:online for online resources */
    UPDATE events
    SET tags = array_remove(tags, 'mode:online')
    WHERE 'mode:online' = any (tags)
      AND 'category:online-resource' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'mode:hybrid')
    WHERE 'mode:hybrid' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'category:single-day-event')
    WHERE 'category:single-day-event' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'category:multi-day-event')
    WHERE 'category:multi-day-event' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'category:gallery-show')
    WHERE 'category:gallery-show' = any (tags);

    UPDATE events
    SET tags = array_append(array_remove(tags, 'category:online-resource'), 'online-resource')
    WHERE 'category:online-resource' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'category:call-for-entry')
    WHERE 'category:call-for-entry' = any (tags);
    `)
  }
};
