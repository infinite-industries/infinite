module.exports = (sequelize, DataTypes) => {
    var user_list_ownership = sequelize.define('user_list_ownership', {
        user_id: DataTypes.UUID,
        event_list_id: DataTypes.UUID
    }, {});

    sequelize.user.belongsToMany(sequelize.event_list, {
        through: { model: user_list_ownership },
        foreignKey: 'user_id',
        otherKey: 'event_list_id',
        as: 'lists_my'
    })

    return user_list_ownership;
}
