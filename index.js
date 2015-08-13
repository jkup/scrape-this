var express    = require('express');
var request    = require('request');
var cheerio    = require('cheerio');
var nodemailer = require('nodemailer');
var CronJob    = require('cron').CronJob;
var fs         = require('fs');
var app        = express();

// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'YOUR_SERVICE',
    auth: {
        user: 'YOUR_EMAIL_ACCOUNT',
        pass: 'YOUR_PASSWORD'
    }
});

app.get('/scrape', function(req, res){

  var $, scraped_data, url;
  url = "YOUR_URL";

  request(url, function(error, response, html) {
    
    if(!error) {

      $ = cheerio.load(html);

      scraped_data = $('YOUR_SELECTOR').text();

      // Send an email
      var mailOptions = {
          from: 'YOUR_SENDER',
          to: 'YOUR_RECIPIENT',
          subject: 'YOUR_SUBJECT',
          text: 'YOUR_MESSAGE' + scraped_data
      };

      // send mail with defined transport object 
      transporter.sendMail(mailOptions, function(error, info){
        if(error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      }); 
    }
  });
});

// How frequently should the job run
new CronJob('0 0 * * *', function(){
      request.get('YOUR_HOST/scrape')
}, null, true, "America/Los_Angeles");

app.listen('8081')
console.log('Listening on port 8081');

exports = module.exports = app;
