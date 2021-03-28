const faker = require('faker')
const uuidv1 = require('uuid/v1')

module.exports = {
  event
}

function event(venue_id, verified, date_times) {
  return {
    id: uuidv1(),
    venue_id,
    verified,
    title: faker.company.companyName(),
    slug: faker.lorem.slug(),
    multi_day: false,
    date_times,
    image: faker.internet.url(),
    social_image: faker.internet.url(),
    admission_fee: faker.commerce.price(),
    address: faker.address.streetAddress() + faker.address.streetName(),
    organizer_contact: faker.internet.email(),
    map_link: faker.internet.url(),
    brief_description: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    links: [],
    website_link: faker.internet.url(),
    ticket_link: faker.internet.url(),
    fb_event_link: faker.internet.url(),
    eventbrite_link: faker.internet.url(),
    bitly_link: faker.internet.url(),
    tags: [],
    reviewed_by_org: faker.company.companyName()
  }
}
