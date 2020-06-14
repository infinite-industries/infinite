#!/usr/bin/env node

require('dotenv').config()

const fs = require('fs')
const sequelize = require('../utils/connection')()

;(async function main() {
  console.log('finding venues')

  const venues = await sequelize.venue.findAll()

  console.log('finding events')

  const events = await sequelize.event.findAll()

  console.log('writing data')
  fs.writeFileSync(`venues-${Date.now()}.json`, JSON.stringify(venues, null, 4))
  fs.writeFileSync(`events-${Date.now()}.json`, JSON.stringify(events, null, 4))

  console.log('done')
})()
