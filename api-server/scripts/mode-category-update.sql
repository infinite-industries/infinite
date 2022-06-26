/**
 * Manually update all events in the DB to use the new tag-based classification
 * system.
 * Extracted from early drafts of the add-mode-and-category-tags migration; we
 * decided to avoid making any changes not strictly necessary to update the UI.
 */

/* add mode tags */

UPDATE events
SET tags = array_append(tags, 'mode:in-person')
WHERE (not 'remote' = any (tags)) 
AND (not 'online-resource' = any (tags))
AND (not 'archived-online-resource' = any (tags))
AND venue_id is not null;

UPDATE events
SET tags = array_remove(array_remove(
    array_append(array_append(tags, 'mode:online'), 'category:online-resource'),
    'remote'), 'online-resource')
WHERE 'online-resource' = any (tags);

UPDATE events
SET tags = array_remove(array_append(tags, 'mode:online'), 'remote')
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
