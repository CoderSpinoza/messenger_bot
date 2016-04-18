var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.query['hub.verify_token'] === 'coderspinoza_validation_token') {
    return res.send(req.query['hub.challenge']);
  }
  return res.send('Error, wrong validation token');
});

router.post('/', function(req, res, next) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.loog(text);
      // Handle a text message from this sender
    }
  }
  res.sendStatus(200);
});
module.exports = router;
