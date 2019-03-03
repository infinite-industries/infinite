const uuidv4 = require('uuid/v4')
const slack = require('./slackNotify')

module.exports = {
  notify: function (event, env) {
    console.log("sending notification to slack: " + env);
    // apply some formatting before sending to slack
    if(event.hasOwnProperty('organizer_contact')){
      this.organizer_contact = event.organizer_contact
    }
    else{
      this.organizer_contact = "no organizers :("
    }

    // Optional info
    if(event.hasOwnProperty('ticket_link')){
      if(event.ticket_link === ""){
        this.ticket_link = "none"
      }
      else{
        this.ticket_link = event.ticket_link
      }
    }

    if(event.hasOwnProperty('fb_event_link')){
      if(event.fb_event_link === ""){
        this.fb_event_link = "none"
      }
      else{
        this.fb_event_link = event.fb_event_link
      }
    }

    if(event.hasOwnProperty('eventbrite_link')){
      if(event.eventbrite_link === ""){
        this.eventbrite_link = "none"
      }
      else{
        this.eventbrite_link = event.eventbrite_link
      }
    }

    if(event.hasOwnProperty('website_link')){
      if(event.website_link === ""){
        this.website_link = "none"
      }
      else{
        this.website_link = event.website_link
      }
    }

    var event_payload = JSON.stringify(event, null, "\t")



    let slack_channel = env == 'prod' ? 'submission' : 'test'
    slack.Notify(slack_channel, "Review Me. Copy Me. Paste Me. Deploy Me.\n" + event_payload + "\n Contact: " + this.organizer_contact);
  }
}
