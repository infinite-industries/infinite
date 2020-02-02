#!/usr/bin/env node

require('dotenv').config()

const fs = require('fs')
const sequelize = require('../utils/connection')()

;(async function main() {
  const venues = await sequelize.venue.findAll()
  const events = await sequelize.event.findAll()

  fs.writeFileSync(`venues-${Date.now()}.json`, JSON.stringify(venues, null, 4))
  fs.writeFileSync(`events-${Date.now()}.json`, JSON.stringify(events, null, 4))
})()
