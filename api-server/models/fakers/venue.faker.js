const faker = require('faker')

module.exports = {
  venue
}

function venue() {
  return {
    name: faker.company.companyName(),
    slug: faker.lorem.slug(),
    address: faker.address.streetAddress(),
    g_map_link: faker.internet.url()
  }
}
