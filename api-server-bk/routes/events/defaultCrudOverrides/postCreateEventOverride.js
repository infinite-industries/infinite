const axios = require('axios')
const uuidv1 = require('uuid/v1')

const slack = require('../../../utils/slackNotify')
const EventController = require('../../../controllers/events')
const { logger } = require('../../../utils/loggers')

const BITLY_URI ='https://api-ssl.bitly.com/v4/shorten'
const BITLY_TOKEN = process.env.BITLY_TOKEN
const BITLY_BASE = process.env.APP_URL || 'https://infinite.industries'
const env = process.env.ENV || 'dev'

module.exports = postCreateEventOverride

async function postCreateEventOverride(req, res) {
  if (!req.body.event)
    return res.status(422).json({ status: 'event parameter is required' })

  try {
    const id = uuidv1()

    const bitlyLink = await _createBitlyLink(`${BITLY_BASE}/events/${id}`)
    const slug = _getSlug(req.body.event.title)

    const postJSON = {
      ...req.body.event,
      id,
      bitly_link: bitlyLink,
      slug
    }

    EventController.create(req.app.get('db'), postJSON, async (err) => {
      if (err) {
        const msg = 'error creating "event": ' + err
        logger.error(msg)

        return res.status(500).json({ status: msg })
      }

      res.status(200).json({ status: 'success', id: postJSON.id })

      try {
        slack.Notify('event-submit', `(${env}) Review Me. Copy Me. Paste Me. Deploy Me. Love Me.:\n` +
          JSON.stringify({...postJSON}, null, 4))
      } catch (exSlack) {
        logger.error(`error notifying slack of new event: ${exSlack}`)
      }
    });
  } catch (ex) {
    logger.warn('error calling link shortener: ', ex)
    res.status(500).json({ status: 'error calling link shortener' })
  }
}

async function _createBitlyLink(infiniteUrl) {
  const headers = {
    Authorization: `Bearer ${BITLY_TOKEN}`,
    // this is important; Bitly returns 406 if not explicitly set
    'Content-Type': 'application/json'
  }

  try {
    const response = await axios.post(BITLY_URI, { long_url: infiniteUrl }, { headers })
    return response.data && response.data.link ? response.data.link : null
  } catch (ex) {
    const errors = ex.response && ex.response.data
      ? (ex.response.data.length ? ex.response.data.map(e => e.message).join(', ') : ex.response.data.message)
      : 'n/a'
    logger.error(`Link shortener failed (${ex.response && ex.response.status}: ${errors})`)
    throw new Error('Link shortener failed')
  }
}

function _getSlug(title) {
  if (!title) {
    return 'missing-title'
  }

  return title.toLowerCase().replace(/ /g,'-')
}
