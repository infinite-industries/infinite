'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'datetime_venue',
          'category',
          {
            type: Sequelize.STRING,
            allowNull: true
          }, { transaction: t }),
        queryInterface.addColumn(
          'events',
          'category',
          {
            type: Sequelize.STRING,
            allowNull: true
          }, { transaction: t }),
        queryInterface.addColumn(
          'events',
          'condition',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
            defaultValue: []
          }, { transaction: t }),
        queryInterface.addColumn(
          'events',
          'mode',
          {
            type: Sequelize.STRING,
            allowNull: true
          }, { transaction: t })]).then(queryInterface.sequelize.query(`
      /* move category labels from events.tags to events.category */

        UPDATE events
        SET category = replace(tag, 'category:', '')
        FROM (SELECT id, unnest(tags) AS tag FROM events) AS unnested
        WHERE tag LIKE 'category:%' AND events.id = unnested.id;

        WITH category_removed AS(
          SELECT id, ARRAY_AGG(tag) as tags FROM (SELECT id, UNNEST(tags) AS tag FROM events) unnested
          WHERE tag NOT LIKE 'category:%'
          GROUP BY id
        )
        UPDATE events
        SET tags = category_removed.tags
        FROM category_removed
        WHERE events.id = category_removed.id;

        /* move condition labels from events.tags to events.condition */

        UPDATE events
        SET condition = ARRAY[replace(tag, 'condition:', '')]
        FROM (SELECT id, unnest(tags) AS tag FROM events) AS unnested
        WHERE tag LIKE 'condition:%' AND events.id = unnested.id;

        WITH condition_removed AS(
          SELECT id, ARRAY_AGG(tag) as tags FROM (SELECT id, UNNEST(tags) AS tag FROM events) unnested
          WHERE tag NOT LIKE 'condition:%'
          GROUP BY id
        )
        UPDATE events
        SET tags = condition_removed.tags
        FROM condition_removed
        WHERE events.id = condition_removed.id;

        /* move mode labels from events.tags to events.mode */

        UPDATE events
        SET mode = replace(tag, 'mode:', '')
        FROM (SELECT id, unnest(tags) AS tag FROM events) AS unnested
        WHERE tag LIKE 'mode:%' AND events.id = unnested.id;

        WITH mode_removed AS(
          SELECT id, ARRAY_AGG(tag) as tags FROM (SELECT id, UNNEST(tags) AS tag FROM events) unnested
          WHERE tag NOT LIKE 'mode:%'
          GROUP BY id
        )
        UPDATE events
        SET tags = mode_removed.tags
        FROM mode_removed
        WHERE events.id = mode_removed.id;

        /* remove remaining category, condition, and mode labels that were */
        /* missed by above updates because they leave behind an empty array */

        WITH old_tags_removed AS(
          SELECT * FROM (SELECT id, UNNEST(tags) AS tag FROM events) unnested
          WHERE (tag LIKE 'mode:%' OR tag LIKE 'category:%' OR tag LIKE 'condition:%')
        )
        UPDATE events
        SET tags = ARRAY[]::character varying[]::character varying(255)[]
        FROM old_tags_removed
        WHERE events.id = old_tags_removed.id;
    `, { transaction: t })
    )})
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.sequelize.query(`
        UPDATE events
        SET tags = tags || CONCAT('category:', category)::VARCHAR(255)
        WHERE category IS NOT NULL;

        UPDATE events
        SET tags = tags || agg FROM
        (SELECT id, ARRAY_AGG(conditions) AS agg FROM
        (SELECT id, CONCAT('condition:', UNNEST(condition))::VARCHAR(255) AS conditions
        FROM events
        ) AS unnested GROUP BY id) AS renested
        WHERE condition IS NOT NULL
        AND events.id = renested.id;

        UPDATE events
        SET tags = tags || CONCAT('mode:', mode)::VARCHAR(255)
        WHERE mode IS NOT NULL;
      `, { transaction: t }).then(Promise.all([
        queryInterface.removeColumn('events', 'category', { transaction: t }),
        queryInterface.removeColumn('events', 'condition', { transaction: t }),
        queryInterface.removeColumn('events', 'mode', { transaction: t }),
        queryInterface.removeColumn('datetime_venue', 'category', { transaction: t })
      ]))
    })
  }
};
