'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`

    /* add mode tags */

    UPDATE events
    SET tags = array_append(tags, 'mode:in-person')
    WHERE (not 'remote' = any (tags)) 
    AND (not 'online-resource' = any (tags))
    AND venue_id is not null;
    
    UPDATE events
    SET tags = array_append(tags, 'mode:remote')
    WHERE 'remote' = any (tags)
    AND venue_id is null;

    UPDATE events
    SET tags = array_append(tags, 'mode:hybrid')
    WHERE 'remote' = any (tags)
    AND venue_id is not null;

    
    /* add category tags */

    UPDATE events
    SET tags = array_append(tags, 'category:single-day-event')
    WHERE id IN
      (SELECT event_id FROM
        (SELECT count(*) AS days, event_id, date(start_time)
        FROM datetime_venue
        GROUP BY event_id, date(start_time)) day_counts
      WHERE days = 1);

    UPDATE events
    SET tags = array_append(tags, 'category:multi-day-event')
    WHERE id IN
      (SELECT event_id FROM
        (SELECT count(*) AS days, event_id, date(start_time)
        FROM datetime_venue
        GROUP BY event_id, date(start_time)) day_counts
      WHERE days > 1);

    UPDATE events
    SET tags = array_append(tags, 'category:gallery-show')
    WHERE 'gallery' = any (tags);

    UPDATE events
    SET tags = array_append(tags, 'category:online-resource')
    WHERE 'online-resource' = any (tags);

    UPDATE events
    SET tags = array_append(tags, 'category:online-resource')
    WHERE 'archived-online-resource' = any (tags);

    UPDATE events
    SET tags = array_append(tags, 'category:call-for-entry')
    WHERE 'artist-call' = any (tags);

    UPDATE events
    SET tags = array_append(tags, 'category:call-for-entry')
    WHERE 'call-to-artists' = any (tags);

    UPDATE events
    SET tags = array_append(tags, 'category:call-for-entry')
    WHERE 'call' = any (tags);
      `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    UPDATE events
    SET tags = array_remove(tags, 'mode:in-person')
    WHERE 'mode:in-person' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'mode:remote')
    WHERE 'mode:remote' = any (tags);

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
    SET tags = array_remove(tags, 'category:online-resource')
    WHERE 'category:online-resource' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'category:call-for-entry')
    WHERE 'category:call-for-entry' = any (tags);
    `)
  }
};
