'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false
        },
        time_start: { // delete when front end is updated to use dates
          allowNull: true,
          type: Sequelize.DATE
        },
        time_end: { // delete when front end is updated to use dates
          allowNull: true,
          type: Sequelize.DATE
        },
        multi_day: {
            allowNull: true,
            type: Sequelize.BOOLEAN
        },
        date_times: {
            allowNull: true,
            type: Sequelize.JSONB
        },
        additional_dates: { // delete when front end is updated to use dates
            allowNull: true,
            type: Sequelize.JSONB
        },
        image: Sequelize.STRING,
        social_image: Sequelize.STRING,
        venue_id: {
            type: Sequelize.UUID,
            references: {
                model: 'venues',
                key: 'id'
            },
        },
        admission_fee: Sequelize.STRING,
        address: Sequelize.STRING,
        organizer_contact: {
            type: Sequelize.STRING,
            allowNull: true
        },

        map_link: Sequelize.STRING,
        brief_description: Sequelize.TEXT,
        description: Sequelize.TEXT,
        links: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
            defaultValue: []
        },
        website_link: Sequelize.TEXT,
        ticket_link: Sequelize.TEXT,
        fb_event_link: Sequelize.STRING,
        eventbrite_link: Sequelize.STRING,
        bitly_link: Sequelize.STRING,
        tags: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
            defaultValue: []
        },
        verified: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: false
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
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};
