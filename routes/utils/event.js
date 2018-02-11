const axios = require('axios');


const Event = function(init_obj){
  //required attributes
  this.id = init_obj.id
  this.title = init_obj.title
  this.slug = init_obj.slug
  this.start_time_string = "sample start time"
  this.end_time_string = "sample end time"
  this.when = "Verbose time description"  // a verbose desciption of time and date of the event

  //optional attributes
  if(init_obj.hasOwnProperty('address')){
    this.address = init_obj.address
  }
  if(init_obj.hasOwnProperty('map_link')){
    this.map_link = init_obj.map_link
  }
  if(init_obj.hasOwnProperty('organizers')){
    this.organizers = init_obj.organizers
  }
  if(init_obj.hasOwnProperty('venues')){
    this.venues = init_obj.venues
  }
  if(init_obj.hasOwnProperty('brief_description')){
    this.brief_description = init_obj.brief_description
  }
  if(init_obj.hasOwnProperty('organizer_contact')){
    this.organizer_contact = init_obj.organizer_contact
  }
  if(init_obj.hasOwnProperty('admission_fee')){
    this.admission_fee = init_obj.admission_fee
  }
  if(init_obj.hasOwnProperty('description')){
    this.description = init_obj.description
  }
  if(init_obj.hasOwnProperty('ticket_link')){
    this.ticket_link = init_obj.ticket_link
  }
  if(init_obj.hasOwnProperty('fb_event_link')){
    this.fb_event_link = init_obj.fb_event_link
  }
  if(init_obj.hasOwnProperty('eventbrite_link')){
    this.eventbrite_link = init_obj.eventbrite_link
  }
  if(init_obj.hasOwnProperty('website')){
    this.website = init_obj.website
  }
}

Event.prototype.AddSocialImage = function(id, server_url, bucket_url){
  this.social_image = server_url + bucket_url + "/uploads/social/" + id + "_social.jpg";
}

Event.prototype.AddHeroImage = function(id, server_url, bucket_url){
  this.image = server_url + bucket_url + "/uploads/" + id + ".jpg";
}

Event.prototype.AddBitlyLink = function(id, bitly_token, site_url ){
  const bitly_query_url ="https://api-ssl.bitly.com/v3/shorten?access_token=" + bitly_token + "&longUrl=" + encodeURI(site_url+'/event/'+id)
  const self = this

  axios.get(bitly_query_url)
  .then(function (_response) {
    //console.log(_response.data.data.url);
    self.bitly_link = _response.data.data.url
  })
  .catch(function (error) {
    console.log(error)
  })
}


module.exports = Event
