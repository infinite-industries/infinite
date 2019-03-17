/*
  This will parse the token and extract user info, but does not restrict access
 */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next ) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    console.log(`found token for ${req.url}`)

    // check the token
    jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
      if (err) {
        // stash the error for later output if needed
        req.tokenParseError = err

        // token is not valid or expired, nothing to do
        return next()
      } else {
        // valid decoded token, pass this info along for the duration of this request
        req.token = token
        req.decoded = decoded;
        req.isInfiniteAdmin = decoded['https://infinite.industries.com/isInfiniteAdmin']
        req.venueIDs = decoded['https://infinite.industries.com/venueIDs']

        // got a user
        next()
      }
    });
  } else {
    // nothing to do, no token provided
    next()
  }
}
