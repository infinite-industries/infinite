require('dotenv')

const VenueController = require(__dirname + '/../controllers/venues')
const sequelize = require(__dirname + '/../utils/connection')()

module.exports = {
  createVenue,
  deleteAllVenues
}

function createVenue (venue) {
  return new Promise((resolve, reject) => {
    VenueController.create(sequelize, venue, (error, result) => {
      if (error) {
        return reject(error)
      } else {
        return resolve(result)
      }
    })
  })
}

function deleteAllVenues() {
  return sequelize.venue.findAll({})
    .then(venues => Promise.all(
      venues.map(
        venue => sequelize.venue.destroy({ where: { id: venue.id } })
      )
    ))
}
