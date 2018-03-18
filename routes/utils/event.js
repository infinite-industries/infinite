const uuidv4 = require('uuid/v4')
const slack = require('./slackNotify')
const moment = require('moment')

const Event = function(init_obj){

  console.log(init_obj)
  //required attributes
  this.id = uuidv4()
  this.title = init_obj.title
  this.slug = this.title.toLowerCase().replace(/ /g,"-")

  if(init_obj.hasOwnProperty('description')){
    this.description = init_obj.description
  }
  if(init_obj.hasOwnProperty('brief_description')){
    this.brief_description = init_obj.brief_description
  }
  if(init_obj.hasOwnProperty('admission_fee')){
    this.admission_fee = init_obj.admission_fee
  }

  this.date = init_obj.date
  this.time_start = init_obj.time_start
  this.time_end = init_obj.time_end

  this.when = moment(this.date).format('dddd, MMMM Do, YYYY') +" <br /> "+ moment(this.time_start).format('h:mma') +" - "+ moment(this.time_end).format('h:mma')


  //venue specific attributes
  if(init_obj.hasOwnProperty('address')){
    this.address = init_obj.address
  }
  if(init_obj.hasOwnProperty('map_link')){
    this.map_link = init_obj.map_link
  }
  if(init_obj.hasOwnProperty('venue_id')){
    this.venue_id = init_obj.venue_id
  }

  // Organizer info -- will add more for venue submitting own event case
  if(init_obj.hasOwnProperty('organizers')){
    this.organizers = init_obj.organizers
  }
  if(init_obj.hasOwnProperty('organizer_contact')){
    this.organizer_contact = init_obj.organizer_contact
  }
  else{
    this.organizer_contact = "no organizers :("
  }

  // Optional info
  if(init_obj.hasOwnProperty('ticket_link')){
    if(init_obj.ticket_link === ""){
      this.ticket_link = "none"
    }
    else{
      this.ticket_link = init_obj.ticket_link
    }
  }

  if(init_obj.hasOwnProperty('fb_event_link')){
    if(init_obj.fb_event_link === ""){
      this.fb_event_link = "none"
    }
    else{
      this.fb_event_link = init_obj.fb_event_link
    }
  }

  /*
    TODO (CAW) Seems like this would be better handled in display logic,
     persisting none as a string can complicate query logic down the road,
     better to just leave it empty
   */
  if(init_obj.hasOwnProperty('eventbrite_link')){
    if(init_obj.eventbrite_link === ""){
      this.eventbrite_link = "none"
    }
    else{
      this.eventbrite_link = init_obj.eventbrite_link
    }
  }

  if(init_obj.hasOwnProperty('website_link')){
    if(init_obj.website_link === ""){
      this.website_link = "none"
    }
    else{
      this.website_link = init_obj.website_link
    }
  }

}

Event.prototype.Notify = function(){
  // TODO (CAW) Why copy all this over to a string like this, can we just use stringify?
  var event_payload = `\n\{
        "id":"${this.id}",
        "title":"${this.title}",
        "slug":"${this.slug}",
        "when":"${this.when}",
        "time_start":"${this.time_start}",
        "time_end": "${this.time_end}",
        "website_link": "${this.website_link}",
        "image":"${this.image}",
        "social_image":"${this.social_image}",
        "venues":["${this.venues}"],
        "admission_fee": "${this.admission_fee}",
        "address": "${this.address}",
        "organizers":["${this.organizers}"],
        "map_link":"${this.map_link}",
        "brief_description":"${this.brief_description}",
        "description":"${this.description}",
        "links":["none"],
        "ticket_link":"${this.ticket_link}",
        "fb_event_link":"${this.fb_event_link}",
        "eventbrite_link":"${this.eventbrite_link}",
        "bitly_link":"${this.bitly_link}",
        "tags":["not-yet-implemented"]
      \}`;

      slack.Notify("test","Review Me. Copy Me. Paste Me. Deploy Me." + event_payload + "\n Contact: "+this.organizer_contact);
}


// Event.prototype.AddSocialImage = function(id, server_url, bucket_url){
//   this.social_image = server_url + bucket_url + "/uploads/social/" + id + "_social.jpg";
// }
//
// Event.prototype.AddHeroImage = function(id, server_url, bucket_url){
//   this.image = server_url + bucket_url + "/uploads/" + id + ".jpg";
// }



module.exports = Event
