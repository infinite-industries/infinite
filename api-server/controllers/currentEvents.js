const getDefaultController = require('./helpers/controllerGenerator');
module.exports = {
  ...getDefaultController('current_event'),
  allAndMergeWithVenues: function(db, callback) {
    // includes venue info in the event selection
    db.event.findAll({ include: { model: db.venue }})
      .then(data => callback(null, data))
      .catch(err => callback(err))
  },
  findByIDAndMergeWithVenues: function(db, id, callback) {
    db.event.findById(id, { include: { model: db.venue } })
      .then(data => callback(null, data))
      .catch(err => callback(err))
  },
}