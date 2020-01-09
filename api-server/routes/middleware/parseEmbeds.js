/**
 * parseEmbeds
 *
 * Looks for embed in the query strings and parses this out to an array of requested entities to embed
 *
 */

module.exports = ParseEmbed

const allowableEmbed = {
  venue: true
}

const maxEmbedCount = 5

// middleware
function ParseEmbed(req, res, next) {
  const embed = req.query.embed

  if (typeof embed === 'string') {
    // validate the string
    if (!allowableEmbed[embed]) {
      return res.status(422).send({ status: 'failure', error_message: `"${embed}" is not an allowable embed` })
    }

    // attach the embed
    req.embed = [embed]
  } else if (Array.isArray(embed)) {
    // validate the array
    if (embed.length > 5) {
      return res.status(422).send(
        { status: 'failure', error_message: `embed arrays may not be longer than ${maxEmbedCount}` })
    }

    const includedEmbeds = {}

    for (let i = 0; i < embed.length; i++) {
      const embedValue = embed[i]

      if (includedEmbeds[embedValue]) {
        return res.status(422).send({ status: 'failure', error_message: `"${embedValue}" may only be embedded once` })
      }

      includedEmbeds[embedValue] = true

      if (!allowableEmbed[embedValue]) {
        return res.status(422).send({ status: 'failure', error_message: `"${embedValue}" is not an allowable embed` })
      }
    }

    // attach the embed
    req.embed = embed
  } else {
    req.embed = []
  }

  next()
}
