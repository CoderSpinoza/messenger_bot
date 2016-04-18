var express = require('express');
var router = express.Router();
var request = require('request');
var nlp = require('../models/nlp');

var access_token = "CAADk55E4jhUBADAlNpoZCthS4VA20NmXiD4ZBmbZCy9vk1I9SRt4KzUsaAHzd8F8zMw2YwQfATcis64ePJNI6JKH7Fp7fuTbWTuFdwVNZBkbWUEIWx45FMPFahdo16grmTYqfnUzOvEMZAid6ONUF4eT9DcKY2ZBPGNyXxOnBwo71ohXJFVqnrUYwl2sZAPb1wZD";

router.get('/', function(req, res, next) {
  if (req.query['hub.verify_token'] === 'coderspinoza_validation_token') {
    return res.send(req.query['hub.challenge']);
  }
  return res.send('Error, wrong validation token');
});

router.post('/', function(req, res, next) {
  if (!req.body.entry || req.body.entry.length == 0) {
    console.log("message entry is empty...");
    return res.sendStatus(500);
  }
  messaging_events = req.body.entry[0].messaging;
  console.log("message length: " + messaging_events.length);
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    console.log("sender: " + sender);
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender

      nlp.processText(sender, text, function(err, message) {
        request.post({url: "https://graph.facebook.com/v2.6/me/messages?access_token=" + access_token,
        form: {recipient: {id: sender}, message: message}}, function(err, res, body) {
          if (err) {
            console.log(err);
          } else {
            console.log(body);
          }
        });
      });
    }
  }
  res.sendStatus(200);
});
module.exports = router;
