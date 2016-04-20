var nlp = {};
var url = "https://seconds-messenger.herokuapp.com/webhook";
var Wit = require('node-wit').Wit;
var request = require('request');

var fbRequest = request.defaults({
  uri: 'https://graph.facebook.com/me/messages',
  method: 'POST',
  json: true,
  qs: {access_token: 'CAADk55E4jhUBADAlNpoZCthS4VA20NmXiD4ZBmbZCy9vk1I9SRt4KzUsaAHzd8F8zMw2YwQfATcis64ePJNI6JKH7Fp7fuTbWTuFdwVNZBkbWUEIWx45FMPFahdo16grmTYqfnUzOvEMZAid6ONUF4eT9DcKY2ZBPGNyXxOnBwo71ohXJFVqnrUYwl2sZAPb1wZD'},
  headers: {'Content-Type': 'application/json'}
});

var fbMessage = function(recipientId, msg, cb) {
  var opts = {
    form: {
      recipient: {
        id: recipientId
      },
      message: {
        text: msg
      }
    }
  };

  return fbRequest(opts, function(err, res, body) {
    if (cb) {
      console.log("sent request...");
      return cb(err || body.error && body.error.message, body);
    }
  });
};

var actions = {
  say: function(recipientId, context, message, cb) {
    fbMessage(recipientId, message, function(err, data) {
      if (err) {
        console.log(err);
        return cb();
      }
      console.log("sent fb message!");
      return cb();
    });
  },
  merge: function(sessionId, context, entities, message, cb) {
    console.log("merge merge");
    return cb(context);
  },
  error: function(sessonId, context, err) {
    console.log(err.message);
  }
};

var wit = new Wit("LXNHVZ3WWZLTL74FRYRSDQOURQFNQBSX", actions);
/* button should be in the following format.
"buttons":[
  {
    "type":"web_url",
    "url":"https://petersapparel.parseapp.com",
    "title":"Show Website"
  },
  {
    "type":"postback",
    "title":"Start Chatting",
    "payload":"USER_DEFINED_PAYLOAD"
  }
]
*/

var categoryText = "어떤 카테고리를 보시고 싶으세요?";

var categoryButtons = [
  {
    type: "postback",
    "title": "상의",
    "payload": url + "/top"
  },
  {
    type: "postback",
    "title": "하의",
    "payload": url + "/bottom"
  },
  {
    type: "postback",
    "title": "신발",
    "payload": url + "/shoes"
  }
];

nlp.buildStructured = function(userId, text, buttons) {
  return {
    "recipient":{
      "id": userId
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text": text,
          "buttons": buttons
        }
      }
    }
  }
};

nlp.buildSimple = function(userId, text) {

};

nlp.processText = function(sessionId, msg, atts, context, cb) {
  wit.runActions(sessionId, msg, context, function(err, context) {
    return cb(err);
  });
};

module.exports = nlp;
