require('dotenv').config()

export default function getEnvironment(req, res) {
  console.log('!!! calling endpoint')

  res.statusCode = 200
  res.end(`(function() {
    console.log('!!! processed source file')
    APP_URL = ${process.env.APP_URL};
    API_URL = ${process.env.API_URL};
  })()`)
}
// https://stackoverflow.com/a/67969518