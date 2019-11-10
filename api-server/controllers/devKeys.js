const debug = require('debug')('controllers:devKeys');
const getDefaultController = require('./helpers/controllerGenerator');
module.exports = getDefaultController('dev_key');
