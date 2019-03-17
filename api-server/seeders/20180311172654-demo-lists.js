const async = require('async')
const fs = require('fs')
const fileLocation = __dirname + '/data/mock_event_lists.json'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return new Promise((resolve, reject) => {
            async.waterfall([
                _nextTask => {
                    fs.readFile(fileLocation, (err, contents) => {
                        if (err) {
                            return _nextTask(err)
                        }

                        let json = null
                        try {
                            json = JSON.parse(contents.toString())
                        } catch (ex) {
                            return _nextTask(err)
                        }

                        _nextTask(null, json)
                    })
                },
                (event_lists, _nextTask) => {
                  const listsToInsert = event_lists.map(l => {
                    return { id: l.id, list_name: l.list_name, description: l.description }
                  })
                  const membership = []
                  event_lists.forEach(l => {
                    if (l.events) {
                      l.events.forEach(e => {
                        membership.push({event_list_id: l.id, event_id: e})
                      })
                    }
                  })

                  _nextTask(null, listsToInsert, membership)
                },
                (listsToInsert, membership, _nextTask) => {
                    queryInterface.bulkInsert('event_lists', listsToInsert, {})
                      .then(() => _nextTask(null, membership))
                      .catch(err => _nextTask(`error inserting event_lists: "${err}"`))
                },
                (membership, _nextTask) => {
                    if (membership.length === 0)
                      return _nextTask()
                    queryInterface.bulkInsert('event_list_memberships', membership, {})
                      .then(() => _nextTask())
                      .catch(err => _nextTask(`error inserting event_list_memberships: "${err}"`))
                }
            ], (err) => {
              if (err) {
                return reject(err)
              }

              resolve()
            })
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
