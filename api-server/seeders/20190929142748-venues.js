// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');
const numVenues = 10;
const uuidv4 = require('uuid').v4;

module.exports = {
  up: (queryInterface) => {
    let venues = [];

    for (let i = 0; i < numVenues; i++) {
      const venue ={
        id: uuidv4(),
        name: faker.company.companyName(),
        slug: faker.lorem.slug(),
        address: faker.address.streetAddress(),
        g_map_link: faker.internet.url()
      };

      venues = [...venues, venue];
    }

    return queryInterface.bulkInsert('venues', venues, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
