const express = require('express')
const { handleRequestForEventsBySingleTag } = require('../../helpers')
const JWTAuthenticator = require('../../../../utils/JWTAuthenticator')
const ParseEmbed = require('../../../middleware/parseEmbeds')

const router = express.Router({ mergeParams: true })

router.use([
  ParseEmbed,
  getVerifiedEventsBySingleTag
])

function getVerifiedEventsBySingleTag (req, res) {
  handleRequestForEventsBySingleTag(req, res, true)
}

module.exports = router
