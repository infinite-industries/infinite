module.exports = getPostBodyChecker

/**
 * Returns middleware that will look for an object to use to use to perform an updated on req body
 *
 *  If it does not find it will short circuit the request returning a 422
 *  Otherwise it will attach the object from the request body to req.postJSON
 *
 * @param routerNameSingular
 * @returns {function(...[*]=)}
 */
function getPostBodyChecker(routerNameSingular) {
  return (req, res, next) => {
    const postJSON= req.body[routerNameSingular];

    if (!postJSON)
      return res.status(422).json({ status: routerNameSingular + ' parameter is required' });

    req.postJSON = postJSON

    next()
  }
}
