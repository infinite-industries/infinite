'use strict';
module.exports = (sequelize, DataTypes) => {
  var event_list_membership = sequelize.define('event_list_membership', {
    event_id: DataTypes.UUIDV4,
    event_list_id: DataTypes.UUIDV4
  }, {});
  event_list_membership.associate = function(models) {
    // associations can be defined here
  };
  return event_list_membership;
};