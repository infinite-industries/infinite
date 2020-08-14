module.exports = getIncludesForAdditionalEmbeddedChildModels

function getIncludesForAdditionalEmbeddedChildModels(embeds, db) {
  return embeds
    .map(embedStr => {
      return { model: db[embedStr] }
    })
    .filter(entry => entry !== null)
}
