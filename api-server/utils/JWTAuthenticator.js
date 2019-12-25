/*
  This assumes that JWTParser precedes this in the middleware chain
 */
const { logger } = require(__dirname + '/loggers')

module.exports = (requiresAdmin = true) => {
  return (req, res, next ) => {
    if (req.token && requiresAdmin && !req.isInfiniteAdmin) {
      // not an admin
      logger.warn(`user is authenticated but is not an admin (${req.decoded.nickname})`)
      res.status(403).json({
        status: 'fail',
        message: 'admin permission required'
      });
    } else if (!req.token) {
      // no token found
      logger.warn(`no valid token found (${req.url})`
        + (req.tokenParseError ? `: "${req.tokenParseError}"` : ''))
      res.status(403).json({
        status: 'fail',
        message: 'failed to authenticate token'
      });
    } else {
      // success
      next()
    }
  }
}