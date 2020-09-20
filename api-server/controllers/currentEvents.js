const getDefaultController = require('./helpers/controllerGenerator');

const CurrentEventsController = {
  ...getDefaultController('current_event'),
  allAndMergeWithVenues: function(db, callback) {
    // includes venue info in the event selection
    db.event.findAll({ include: { model: db.venue }})
      .then(data => callback(null, data))
      .catch(err => callback(err))
  },
  findByIDAndMergeWithVenues: function(db, id, callback) {
    db.event.findByPk(id, { include: { model: db.venue } })
      .then(data => callback(null, data))
      .catch(err => callback(err))
  },
}

module.exports = CurrentEventsController
