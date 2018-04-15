const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    console.log(`found token for ${req.url}`)
    jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
      if (err) {
        console.warn(`token invalid: ${err}`)
        res.status(403).json({
          status: 'fail',
          message: 'failed to authenticate token'
        });
      } else {
        // now we have decoded token for ref in future route handlers
        req.decoded = decoded;
        req.isInfiniteAdmin = decoded['https://infinite.industries.com/isInfiniteAdmin']
        if (req.isInfiniteAdmin) {
          console.log(`processing request for admin user: ${req.decoded.nickname}@${req.url}`)
          next();
        } else {
          console.warn(`user is authenticated but is not an admin (${req.decoded.nickname})`)
          res.status(403).json({
            status: 'fail',
            message: 'admin permission required'
          });
        }

      }
    });
  } else {
    res.status(403).json({
      status: 'fail',
      message: 'no token'
    });
  }
}