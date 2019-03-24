const express = require('express')
const bodyParser = require('body-parser')
const jwtAuthenticator = require(__dirname + '/utils/jwtAuthenticator')
const router = express.Router()
const { makeAPICall } = require('./utils/requestHelper')

router.use(bodyParser.json())

router.use(bodyParser.urlencoded({
  extended: true
}))

router.get('/:id', [jwtAuthenticator()], function(req, res){
  // get the list
  const id = req.params.id
  console.info('getting user_list: ' +  id)
  makeAPICall('get', 'event-lists/' + id, {}, null, req.token, (err, resAPI) => {
    if (err) {
      console.warn(err)
    } else {
      res.json(resAPI.data)
    }
  })
})

router.post('/create-new', [jwtAuthenticator()], function(req, res){
  console.log(req.body)

  let newList = { eventList: req.body }

  makeAPICall('post', 'event-lists/', newList, process.env.API_KEY, req.token, (err, resAPI) => {
    if (err) {
      console.warn(err)
    } else {

      const list_id = resAPI.data.id

      makeAPICall('put', 'users/addList/' + '99af7550-f3e6-11e7-8279-f30c6795f584' + '/' + list_id, {}, process.env.API_KEY, req.token, (err, resAPI) => {
        if (err) {
          console.warn(err)
        } else {
          res.json({status:'success', id:list_id})
        }
      })
    }
  })
})

// router.post('/create-new', function(req, res){
//     console.log(req.body)
//
//     res.json({"status":"success","id":uuid()})
// })


module.exports = router
