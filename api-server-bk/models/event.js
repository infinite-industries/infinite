const { getEventBase } = require('./eventBase')
module.exports = (sequelize, DataType) => {
  const event = sequelize.define('event', getEventBase(DataType), {});

  return event;
};