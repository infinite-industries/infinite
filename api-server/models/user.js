'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    identifier: DataTypes.STRING,
    nickname: DataTypes.STRING,
    name: DataTypes.STRING,
    picture: DataTypes.STRING,
    settings: DataTypes.JSONB,
    permissions_post_as_venues: DataTypes.JSONB,
    permissions_edit_lists: DataTypes.JSONB
  }, {});

  return user;
};
