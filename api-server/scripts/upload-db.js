#!/usr/bin/env node

require('dotenv').config()

const fs = require('fs')
const sequelize = require('../utils/connection')()

;(async function main() {
  const argVenueFileName = process.argv[2]
  const argEventFileName = process.argv[3]

  console.log(`reading files "${argVenueFileName}" and "${argEventFileName}"`)
  console.log(fs.readFileSync(argVenueFileName).toString())
  const venues = JSON.parse(fs.readFileSync(argVenueFileName).toString())
  const events = JSON.parse(fs.readFileSync(argEventFileName).toString())

  console.log(`writing ${venues.length} venues`)
  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i]
    await sequelize.venue.create(venue)
  }

  console.log(`writing ${events.length} events`)
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    await sequelize.event.create(event)
  }

  await sequelize.close()
  console.log('done')
})()
