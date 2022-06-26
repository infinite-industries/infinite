'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // TODO: consider restricting the effect of this to
    // - current events and events from the very recent past
    // - online resource (things w/ no datetimes)
    return queryInterface.sequelize.query(`

    /* add mode tags */

    UPDATE events
    SET tags = array_append(tags, 'mode:in-person')
    WHERE (not 'remote' = any (tags)) 
    AND (not 'online-resource' = any (tags))
    AND (not 'archived-online-resource' = any (tags))
    AND venue_id is not null;

    UPDATE events
    SET tags = array_append(array_append(tags, 'mode:online'), 'category:online-resource')
    WHERE 'online-resource' = any (tags);

    UPDATE events
    SET tags = array_append(tags, 'mode:online') /* TODO: can we also remove 'remote'? */
    WHERE 'remote' = any (tags)
    AND NOT 'mode:online' = any (tags);

    /* add category tags */

    UPDATE events
    SET tags = array_append(tags, 'category:single-day-event')
    WHERE id IN
      (SELECT event_id FROM
        (SELECT count(distinct date(start_time)) AS days, event_id
        FROM datetime_venue
        GROUP BY event_id) day_counts
      WHERE days = 1)
      AND (not 'gallery' = any (tags));

    UPDATE events
    SET tags = array_append(tags, 'category:multi-day-event')
    WHERE id IN
      (SELECT event_id FROM
        (SELECT count(distinct date(start_time)) AS days, event_id
        FROM datetime_venue
        GROUP BY event_id) day_counts
      WHERE days > 1)
      AND (not 'gallery' = any (tags));

    UPDATE events
    SET tags = array_append(tags, 'category:gallery-show')
    WHERE 'gallery' = any (tags);

    UPDATE events
    SET tags = array_append(tags, 'category:call-for-entry')
    WHERE 'artist-call' = any (tags)
       OR 'call-to-artists' = any (tags)
       OR 'call' = any (tags);
    `)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    UPDATE events
    SET tags = array_remove(tags, 'mode:in-person')
    WHERE 'mode:in-person' = any (tags);

    UPDATE events
    SET tags = array_remove(tags, 'mode:online')
    WHERE 'mode:online' = any (tags);

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
