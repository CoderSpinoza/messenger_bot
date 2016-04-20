var express = require('express');
var router = express.Router();
var request = require('request');
var nlp = require('../models/nlp');

var sessions = {};
var access_token = "CAADk55E4jhUBADAlNpoZCthS4VA20NmXiD4ZBmbZCy9vk1I9SRt4KzUsaAHzd8F8zMw2YwQfATcis64ePJNI6JKH7Fp7fuTbWTuFdwVNZBkbWUEIWx45FMPFahdo16grmTYqfnUzOvEMZAid6ONUF4eT9DcKY2ZBPGNyXxOnBwo71ohXJFVqnrUYwl2sZAPb1wZD";

var getFirstMessagingEntry = function(body) {
  var val = body.object == 'page' && body.entry &&
  Array.isArray(body.entry) && body.entry.length > 0 && body.entry[0] &&
  body.entry[0].messaging && Array.isArray(body.entry[0].messaging) &&
  body.entry[0].messaging.length > 0 && body.entry[0].messaging[0];
  return val || null;
};

var findOrCreateSession = function(fbId) {
  var sessionId;
  Object.keys(sessions).forEach(function(k) {
    if (sessions[k].fbId == fbId) {
      sessionId = k;
    }
  });

  if (!sessionId) {
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbId: fbId, context: {}};
  }
  return sessionId;
};

router.get('/', function(req, res, next) {
  if (req.query['hub.verify_token'] === 'coderspinoza_validation_token') {
    return res.send(req.query['hub.challenge']);
  }
  return res.send('Error, wrong validation token');
});

router.post('/', function(req, res, next) {
  var messaging = getFirstMessagingEntry(req.body);

  if (messaging && messaging.message) {
    var sender = messaging.sender.id;
    var sessionId = findOrCreateSession(sender);

    var msg = messaging.message.text;
    var atts = messaging.message.attachments;

    if (msg) {
      nlp.processText(sender, msg, atts, sessions[sessionId].context, function(err, context) {
        if (err) {
          console.log("Error with nlp engine..");
          return res.status(500).send();
        }

        sessions[sessionId].context = context;
      });
    }
  }
  return res.status(200).send();
});
module.exports = router;
