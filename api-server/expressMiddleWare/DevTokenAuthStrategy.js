const passport = require('passport');
const LocalAPIKeyStrategy = require('passport-localapikey').Strategy;
const DevKeyController = require('../controllers/devKeys.js');

module.exports = function getAPIKeyStrategy(sequelize) {
	return new LocalAPIKeyStrategy(
		function (apikey, done) {
			DevKeyController.findById(sequelize, apikey, function(err, key) {
				// error retrieving keys
				if (err)
					return done(err);

				// key not found
				if (!apikey)
					return done(null, false);

				// success
				done(null, key);
			});
		}
	);
}