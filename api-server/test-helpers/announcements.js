require('dotenv')

const AnnouncementController = require(__dirname + '/../controllers/announcements')
const sequelize = require(__dirname + '/../utils/connection')()

module.exports = {
  createAnnouncement,
  deleteAllAnnouncements
}

function createAnnouncement (announcment) {
  return new Promise((resolve, reject) => {
    AnnouncementController.create(sequelize, announcment, (error, result) => {
      if (error) {
        return reject(error)
      } else {
        return resolve(result)
      }
    })
  })
}

function deleteAllAnnouncements() {
  return sequelize.announcement
    .findAll({})
    .then(announcements => Promise.all(
      announcements
        .map(announcement => sequelize.announcement.destroy({ where: { id: announcement.id } }))))
}