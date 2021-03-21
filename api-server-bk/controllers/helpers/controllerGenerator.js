const async = require('async');
const { logger } = require(__dirname + '/../../utils/loggers')

module.exports = DefaultController;

function DefaultController(modelName) {
    return {
        findById: function(db, id, callback) {
            logger.debug('findById: ' + id);
            db[modelName].findByPk(id)
              .then(model => callback(null, model))
              .catch(err => callback(err))
        },

        all: function(db, callback, query, filter_field) {
            logger.debug('all');
			      query = query || {};

            /*if (filter_field) {
              query[opts.filter_field] = true;
            }*/

            db[modelName].findAll(query)
              .then(models => {
                  callback(null, models)
              })
              .catch(err => {
                  callback(err)
              })
        },
        findOrCreate: function(db, defaults, where) {
          logger.debug('findOrCreate: ' + JSON.stringify(defaults, null, 4))

          return db[modelName].findOrCreate({
            where,
            defaults
          })
        },
        create: function(db, data, callback) {
            logger.debug('create: ' + JSON.stringify(data, null, 4));
            db[modelName].create(data, callback)
              .then((result) => callback(null, result))
              .catch(err => callback(err));
        },
        delete: (db, id, callback) => {
            logger.debug(`delete event "${id}"`)
            db[modelName].destroy({ where: { id } })
              .then(() => callback())
              .catch(err => callback(err))
        },
        update: function(db, id, data, callback) {
            db[modelName].update(data, { where: { id }})
              .then(() => callback())
              .catch(err => callback(err))
        },
    };
}

DefaultController.findAndMerge = function(Model1, Model2, keys, query, complete) {
	async.waterfall([
		function _getEventLists(_nextTask) {
			Model1.find(query, _nextTask);
		},
		function _gatherEvents(model1Coll, _nextTask) {
			if (!model1Coll || model1Coll.length === 0)
				return _nextTask(null, [], []);

			/*
				gets all ids stored under each of the keys we will merge,
					at this point we simplify things by assuming all
					fields being merged all point to the same type of
					nested model as is the case with lists_my and lists_follow
			 */
			let ids = [];
			keys.forEach(key => {
				ids = ids.concat(model1Coll.map(list => list[key]).reduce((acc, v) =>  acc.concat(v)));
			});

			Model2.find({ id: { $in: ids } }, function(err, model2Coll) {
				_nextTask(err, model1Coll, model2Coll);
			});
		},
		function _mergeEventsIntoLists(model1Coll, model2Coll, _nextTask) {
			if (!model1Coll || model1Coll.length === 0)
					return _nextTask(null, []);


			let mergedList = model1Coll.map(list => {
				keys.forEach(key => {
                    if (!list[key])
                        return; // empty key nothing to fill in

                    list[key] = list[key].map(mdlID => {
                        const entry = model2Coll.find(_e => _e.id === mdlID);
                        if (!entry) {
                          logger.warn(`could not find ${key} id ${mdlID} for ${Model1.modelName}`);
                        }

                        return entry;
                    });
				});

                return list;
            });

			_nextTask(null, mergedList);
		}
	], function(err, mergedList) {
		if (err)
			logger.warn(err);

		complete(err, mergedList);
	});
};
