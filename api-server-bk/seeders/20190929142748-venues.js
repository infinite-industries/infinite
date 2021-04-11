const VenueFaker = require('../models/fakers/venue.faker')
const numVenues = 10;

module.exports = {
  up: (queryInterface) => {
    let venues = []

    for (let i = 0; i < numVenues; i++) {
      venues = [...venues, VenueFaker.venue()]
    }

    return queryInterface.bulkInsert('venues', venues, {})
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
