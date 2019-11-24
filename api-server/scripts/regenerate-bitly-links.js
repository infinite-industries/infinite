/**
 * this script will back fill bitly links. This was created to address an issues where these were incorrectly generated
 *
 * We will likely not need to re-run this, but I am leaving it here for reference in case we change link shortners
 * or site structure again
 *
 * To Run: execute the script from the root of the api-server directory `node ./scripts/regenerate-bitly-links.js`
 *
 */

require('dotenv')
const axios = require('axios')

const BITLY_URI ='https://api-ssl.bitly.com/v3/shorten'
const sequelize = require('../utils/connection')()
const EventController = require('../controllers/events')
const BITLY_TOKEN = process.env.BITLY_TOKEN
const BITLY_BASE = process.env.APP_URL || 'https://infinite.industries'

EventController.all(sequelize, async (error, results) => {
  if (error) {
    console.error(`error reading events: ${error}`)
    process.exit(1)
  } else {
    results = results || []
    for (let i = 0; i < results.length; i++) {
      try {
        const result = results[i]
        const newLink = await _createBitlyLink(`${BITLY_BASE}/events/${result.id}`)
        console.log(`${result.id}: ${result.bitly_link} => ${newLink}`)
        await _updateEntry(result, newLink)

	// pause between requests due to bilty rate limiting
	console.log('taking a nap')
	await _throttle(1000)
      } catch (ex) {
	console.error(`error on ${results[i].id}: ${ex}`)
      }
    }
    console.log('done')
    sequelize.close()
  }
})

async function _createBitlyLink(infiniteUrl) {
  const requestUrl = `${BITLY_URI}?access_token=${BITLY_TOKEN}&longUrl=${encodeURI(infiniteUrl)}`

  const { data } = await axios.get(requestUrl)

  if (data.status_code != 200) {
    throw new Error(`Status ${ data.status_code } returned from link shortener`)
  } else {
    return data.data.url
  }
}

function _updateEntry(result, newLink) {
  return new Promise((resolve, reject) => {
    EventController.update(sequelize, result.id, { bitly_link: newLink}, (err) => {
      if (err) {
        reject(new Error(`error updating entry: ${error}`))
      } else {
        resolve()
      }
    })
  })
}

function _throttle(sleepMs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), sleepMs)
  })
}
