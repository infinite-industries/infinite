function ParseEmbed(req, res, next) {
  const tagsInQuery = req.query.tags

  if(Array.isArray(tagsInQuery)) {
    req.tags = tagsInQuery
  } else if (typeof tagsInQuery === 'string') {
    req.tags = [tagsInQuery]
  } else {
    req.tags = []
  }
}
