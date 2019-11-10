module.exports = (sequelize, DataTypes) => {
    var user_list_following = sequelize.define('user_list_following', {
        user_id: DataTypes.UUID,
        event_list_id: DataTypes.UUID
    }, {})

    sequelize.user.belongsToMany(sequelize.event_list, {
        through: user_list_following,
        foreignKey: 'user_id',
        otherKey: 'event_list_id',
        as: 'lists_follow'
    })

    return user_list_following;
}
