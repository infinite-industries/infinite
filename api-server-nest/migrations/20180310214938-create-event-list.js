module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('event_lists', {
      id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },

      // TODO (CAW) -- just normalize to title for all models
      list_name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      attrs: {
        type: Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('now()')
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('event_lists');
  }
}
