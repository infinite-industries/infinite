const DefaultController = require('./helpers/controllerGenerator');
const _ = require('lodash');
const userController = DefaultController('user')

module.exports = _.extend(userController, {
    allAndMergeWithEventLists: function (db, callback) {
        db.user.findAll({include: [
            { model: db.event_list, as: 'lists_my', through: { attributes: [] } },
            { model: db.event_list, as: 'lists_follow', through: { attributes: [] } },
          ]
        })
          .then((data) => {
          		console.log('GRR')
              callback(null, data)
          })
          .catch(err => callback(err))
    },
    findByIDAndMergeWithEventLists: function(db, id, callback) {
       db.user.findById(id, {include: [
               { model: db.event_list, as: 'lists_my', through: { attributes: [] } },
               { model: db.event_list, as: 'lists_follow', through: { attributes: [] } },
           ]
       })
         .then(data => {
           callback(null, data)
         })
         .catch(err => {
           callback(err)
         })
    },
    addList: function (db, user_id, event_list_id, callback) {
        db.user_list_ownership.create({ user_id, event_list_id })
          .then(() => callback())
          .catch(err => callback(err))
    },
    ensureByName: (db, token, callback) => {
      const name = token.name

      db.user.findAll({ where: { name } })
        .then(users => {
          if (!users || users.length === 0) {
            userController.create(db, token, err => {
              if (err) {
                return callback(err)
              }

             db.user.findAll({ where: { name }})
               .then(users => {
                 callback(null, users && users[0])
               })
               .catch(err => callback(err))
            })
          } else {
            callback(null, users[0])
          }
        }).catch(err => {
          callback(err)
        })
    }
});
