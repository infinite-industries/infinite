const DefaultController = require('./helpers/controllerGenerator');
const _ = require('lodash');

module.exports = _.extend(DefaultController('event_list'), {
	allAndMergeWithEvents: function(db, callback) {
		// includes events in the event list  selection
	    db.event_list.findAll({ include: { model: db.event, through: { attributes: [] } } })
          .then(data => callback(null, data))
          .catch(err => callback(err))
	},
	findByIDAndMergeWithEvents: function(db, id, callback) {
		db.event_list.findById(id, { include: { model: db.event, through: { attributes: [] } } })
		  .then(data => callback(null, data))
		  .catch(err => callback(err))
	},
	addEvent: function(db, event_list_id, event_id, callback) {
		db.event_list_membership.create({ event_list_id, event_id })
		  .then(() => callback())
		  .catch(err => callback(err))
	},
	removeEvent: function(db, event_list_id, event_id, callback) {
		db.event_list_membership.destroy({ where: { event_list_id, event_id }})
		  .then(() => callback())
		  .catch(err => callback(err))
	}
});
