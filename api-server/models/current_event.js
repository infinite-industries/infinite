const { getEventBase } = require('./eventBase')
module.exports = (sequelize, DataType) => {
  const current_event = sequelize.define('current_event', {
    ...getEventBase(DataType),
    start_time: DataType.DATE,
    end_time: DataType.DATE
  }, {});
  return current_event;
};