const Sequelize = require('sequelize')
require('dotenv').config()

let cache = null

module.exports = function getConnection() {
    if (cache !== null) {
        return  cache
    }

    const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PW, {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        operatorsAliases: false,
        /*ssl: {
          key: cKey,
          cert: cCert,
          ca: cCA
        },*/
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    })

    sequelize.event = sequelize.import(__dirname + '/../models/event');
    sequelize.current_event = sequelize.import(__dirname + '/../models/current_event')
    sequelize.event_list_membership = sequelize.import(__dirname + '/../models/event_list_membership')
    sequelize.event_list = sequelize.import(__dirname + '/../models/event_list')
    sequelize.dev_key = sequelize.import(__dirname + '/../models/dev_key')
    sequelize.venue = sequelize.import(__dirname + '/../models/venue')
    sequelize.user = sequelize.import(__dirname + '/../models/user')
    sequelize.user_list_ownership = sequelize.import(__dirname + '/../models/user_list_ownership')
    sequelize.user_list_following = sequelize.import(__dirname + '/../models/user_list_following')
    sequelize.announcement = sequelize.import(__dirname + '/../models/announcement')

    cache = sequelize

    return sequelize
};
