const { getEventBase } = require('./eventBase')
module.exports = (sequelize, DataType) => {
  const current_event = sequelize.define('current_event', {
    ...getEventBase(DataType),
    first_day_start_time: DataType.DATE,
    last_day_end_time: DataType.DATE
  }, {});
  return current_event;
};
