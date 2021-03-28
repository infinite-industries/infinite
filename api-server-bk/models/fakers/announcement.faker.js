const faker = require('faker')

module.exports = {
  announcement
}

function announcement() {
  return {
    message: faker.lorem.paragraph()
  }
}
