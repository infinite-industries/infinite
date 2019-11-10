'use strict';
module.exports = (sequelize, DataTypes) => {
  var dev_key = sequelize.define('dev_key', {
    organization: DataTypes.STRING,
    user_name: DataTypes.STRING
  }, {});
  dev_key.associate = function(models) {
    // associations can be defined here
  };
  return dev_key;
};