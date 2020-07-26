const express = require('express')

const { handleRequestForEventsBySingleTag } = require('../../helpers')
const JWTAuthenticator = require('../../../../utils/JWTAuthenticator')
const ParseEmbed = require('../../../middleware/parseEmbeds')

const router = express.Router({ mergeParams: true })

router.use([
  JWTAuthenticator(true),
  ParseEmbed,
  getAllEventsBySingleTag
])

async function getAllEventsBySingleTag (req, res) {
  handleRequestForEventsBySingleTag(req, res, null)
}

module.exports = router
