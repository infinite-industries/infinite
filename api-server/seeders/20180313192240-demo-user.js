const fs = require('fs')

const fileLocation = `${__dirname}/data/mock_users.json`
module.exports = {
    up: (queryInterface, Sequelize) => {
        const str = fs.readFileSync(fileLocation)
        const user = JSON.parse(str)
        const { lists_my, lists_follow, ...user_base } = user // split out relations from base model
        user_base.settings = JSON.stringify(user_base.settings || {})
        user_base.permissions_edit_lists = JSON.stringify(user_base.permissions_edit_lists || {})
        user_base.permissions_post_as_venues = JSON.stringify(user_base.permissions_post_as_venues || {})
        const user_list_ownership_following = lists_follow.map(event_list_id => {
            return { event_list_id, user_id: user.id }
        })

        const user_list_ownership_entries = lists_my.map(event_list_id => {
            return { event_list_id, user_id: user.id }
        })

        return new Promise((resolve, reject) => {
            queryInterface.bulkInsert('users', [user_base], {})
              .then(() => {
                  queryInterface.bulkInsert('user_list_ownerships', user_list_ownership_entries, {})
                    .then(() => {
                        queryInterface.bulkInsert('user_list_followings', user_list_ownership_following, {})
                          .then(() => resolve())
                          .catch(err => reject(err))
                    })
                    .catch(err=> reject(err))
              })
              .catch(err => reject(err))
        })
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('Person', null, {});
        */
    }
};
