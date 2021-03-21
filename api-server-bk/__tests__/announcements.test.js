const frisby = require('frisby')
const announcementFaker = require('../models/fakers/announcement.faker')
const sequelize = require(__dirname + '/../utils/connection')()
const { createAnnouncement, deleteAllAnnouncements } = require('../test-helpers/announcements')

const apiUrl = 'http://localhost:3003'

afterAll(() => {
  sequelize.close()
})

beforeEach(async () => {
  await deleteAllAnnouncements()
})

it('can query all announcements', async function () {
  const announcement1 = await createAnnouncement(announcementFaker.announcement())
  const announcement2 = await createAnnouncement(announcementFaker.announcement())

  return frisby.get(apiUrl +'/announcements')
    .expect('status', 200)
    .then(async (response) => {
      // should only get back 2 of the three events
      expect(response.json.announcements.length).toEqual(2)

      expect(response.json.announcements[0].message).toEqual(announcement1.message)
      expect(response.json.announcements[1].message).toEqual(announcement2.message)
    })
})
