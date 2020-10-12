require('dotenv')

const EventController = require(__dirname + '/../controllers/events')
const sequelize = require(__dirname + '/../utils/connection')()

export function createEvent (event) {
  return new Promise((resolve, reject) => {
    EventController.create(sequelize, event, (error, result) => {
      if (error) {
        return reject(error)
      } else {
        return resolve(result)
      }
    })
  })
}

export function deleteAllEvents() {
  return sequelize.event
    .findAll({})
    .then(events => Promise.all(
      events
        .map(event => sequelize.event.destroy({ where: { id: event.id } }))))
}