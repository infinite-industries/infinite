require('dotenv').config();
const axios = require('axios');
const asyncjs = require('async');
const VenueController = require('../controllers/venues');
const EventController = require('../controllers/events');
const sequelize = require('../utils/connection')();

const urlVenueJSON =
  'https://raw.githubusercontent.com/infinite-industries/front_end_infinite/master/public/venue-list.json';
const urlEventsJSON =
  'https://raw.githubusercontent.com/infinite-industries/front_end_infinite/master/public/event-listings.json';

const errors = [];

(async function () {
  let venueResults = null;
  let eventsResults = null;
  let venueJSON = null;
  let eventsJSON = null;

  try {
    venueResults = await axios.get(urlVenueJSON);
    eventsResults = await axios.get(urlEventsJSON);
  } catch(ex) {
    console.error(`error getting data from github: "${ex}"`);
    process.exit(1);
  }

  venueJSON = venueResults.data;
  eventsJSON = eventsResults.data;

  asyncjs.series([
    (nextTask) => {
      asyncjs.map(venueJSON, (venueEntry, nextEntry) => {
        VenueController.create(sequelize, venueEntry, (error) => {
          if (error) {
            errors.push({ error, entry: venueEntry  })
          }

          // continue on error
          nextEntry();
        });
      }, nextTask);
    },
    (nextTask) => {

      console.log("VENUES ADDED");
      asyncjs.map(eventsJSON, (eventEntry, nextEntry) => {
        if (eventEntry.type !== 'calendar_event') // for now only include original style events
          return nextEntry();

        // everything coming from this file has been verified
        eventEntry.verified = true;

        // map old time_start, time_end values to date_time array
        eventEntry.date_times = [
          { start_time: eventEntry.time_start, end_time: eventEntry.time_end }
        ]
        console.log(`creating ${eventEntry.id}`)
        EventController.create(sequelize, eventEntry, (error) => {
          if (error) {
            errors.push({ error, entry: eventEntry  })

            // continue on error
            nextEntry();
          } else {
            console.log(`created ${eventEntry.id}`)
            nextEntry();
          }
        });
      }, nextTask);
    },
  ], (err) => {
    if (err) {
      console.error(`error persisting data: "${err}"`);
      process.exit(1);
    }

    if (errors.length > 0) {
      console.error(`${errors.length} errors occurred:\n`)
      errors.forEach(errObj => {
        console.log(`error: "${errObj.error}"`)
        console.log(`processing entry: ${JSON.stringify(errObj.entry)}`)
      })
      process.exit(1)
    }

    console.log('success');
    process.exit(0);
  })
})();
