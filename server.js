// init project
var express = require('express');
var app = express();
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var axios = require('axios');
var dotenv = require('dotenv');

dotenv.load(); //get configuration file from .env

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/event-listings', function(req, res){
  axios.get(process.env.SITE_URL+'/event-listings.json')
    .then(function(response){

      res.json({"status":"success", "events":response.data});
      // console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({"error": "error retreiving events: " + error})
    });
})

app.get("/event/:id", function(req, res){
    console.log("got it");
    var self = this;
    axios.get(process.env.SITE_URL+'/event-listings.json')
    .then(function (response) {
      // console.log("yoooooo ",response.data);
      //self.events = response.data;
       var event = response.data.find(function(event){
        return event.id === req.params.id;
       })

       // let event = response.data;
       // console.log(event);
       // errors!!!! handle them

        res.send(nunjucks.render(
          'views/event.html',
          {id:req.params.id, event: event, site_url:process.env.SITE_URL}
        ));

    })
    .catch(function (error) {
      console.log(error);
    });
})


// app.get('/event-listings', function(req, res){
//   axios.get(process.env.API_URL+'/events?sort_field=time_start&verified=true')
//   .then(function (response) {
//     // JSON.stringify.map(obj){
//     //   console.log(obj.title);
//     // }
//     console.log(response.data);
//
//     res.json(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//     res.status(500).json({"error": "error retreiving events: " + error})
//   });
// })


// app.get("/event/:id", function(req, res){
//     console.log("got it");
//     var self = this;
//     axios.get(process.env.API_URL+'/events/find/'+req.params.id+"?apikey="+process.env.API_KEY)
//     .then(function (response) {
//       // console.log("yoooooo ",response.data);
//       // //self.events = response.data;
//       //  var event = response.data.find(function(event){
//       //   return event.id === req.params.id;
//       //  })
//
//        let event = response.data;
//        // console.log(event);
//        //errors!!!! handle them
//
//         res.send(nunjucks.render(
//           'views/event.html',
//           {id:req.params.id, event: event, site_url:process.env.SITE_URL}
//         ));
//
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// })

var appPort = process.env.PORT || '7779';

app.listen(appPort, function () {
    console.log("Magic on port %d", appPort);
});
