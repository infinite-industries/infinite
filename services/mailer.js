var dotenv = require('dotenv');
dotenv.load();   //get cofiguration file from .env

var mailgun = require('mailgun.js');
var mg = mailgun.client({username: 'api', key: process.env.LIVE_MAILGUN_API_KEY});
var mail_domain = process.env.LIVE_MAILGUN_DOMAIN;

module.exports = {

  sendEmail: function(requested_action, cb){
    var mail_content = {};
    mail_content.from = 'INFINITE.INDUSTRIES <info@infinite.industries>';
    mail_content.to = requested_action.email;
    mail_content.subject = requested_action.subject;
    // mail_content.text = requested_action.text;
    mail_content.html = requested_action.html;
    mail_content['h:Reply-To'] = requested_action.reply_to;

    // console.log(mail_content);
    mg.messages.create(mail_domain, mail_content)
      .then(msg => {
        //console.log(msg);

        cb(false, msg);
      })
      .catch(err => {
        //console.log(err);

        cb(true, err);
      });

  }
}
