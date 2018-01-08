const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get("/:id", function(req, res){
    console.log("got it");
    const self = this;
    axios.get(process.env.SITE_URL+'/event-listings.json')
    .then(function (response) {
      // console.log("yoooooo ",response.data);
      //self.events = response.data;
       let event = response.data.find(function(event){
        return event.id === req.params.id;
       })

       // let event = response.data;
       // console.log(event);
       // errors!!!! handle them

        res.render(
          'event',
          {id:req.params.id, event: event, site_url:process.env.SITE_URL}
        );

    })
    .catch(function (error) {
      console.log(error);
    });
})

router.post("/add", function(req,res){
  res.json({"got":"it"})
})



module.exports = router;
