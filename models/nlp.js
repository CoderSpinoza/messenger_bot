var nlp = {};
var url = "https://seconds-messenger.herokuapp.com/webhook";
var Wit = require('node-wit').Wit;
var request = require('request');
var access_token = "EAAYms5aM4SoBAMAZCN2rFtE7oZArXwG6jyv0jIWIbrue4zmvhNW75HF4xNuK7V2uCBPPZBZA94wZAjdAR595wDtRhNcCSZCbtVXd9XIZAXVcPnNceDSBdaPMZCHbc3SBTpcyFBT49WkaBv7HLjWUP7f6MtlZC29OuEuutdcRoMUFrDQZDZD";

var firstEntityValue = function(entities, entity) {
  var val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

var fbMessage = function(recipientId, msg, cb) {
  console.log("recipientId: " + recipientId);
  var form = {
    "recipient": {
      "id": recipientId
    },
    "message": {
      "text": msg
    }
  };

  return request.post({url: "https://graph.facebook.com/v2.6/me/messages?access_token=" + access_token, form: form}, function(err, res, body) {
    if (cb) {
      return cb(err || body.error && body.error.message, body);
    }
  });
};

var fbStructuredMessage = function(recipientId, cb) {
  var template = buildStructured(recipientId);
  return request.post({url: "https://graph.facebook.com/v2.6/me/messages?access_token=" + access_token, form: template}, function(err, res, body) {
    if (cb) {
      return cb(err || body.error && body.error.message, body);
    }
  });
}

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
    var loc = firstEntityValue(entities, 'location');
    var cloth_type = firstEntityValue(entities, 'cloth_type');
    if (loc) {
      context.loc = loc;
    }

    if (cloth_type) context.cloth_type = cloth_type;
    return cb(context);
  },
  error: function(sessonId, context, err) {
    console.log(err.message);
  },
  'fetch-weather': function(sessionId, context, cb) {
    context.forecast = 'sunny';
    return cb(context);
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

nlp.buildStructured = function(userId) {
  return {
    "recipient":{
      "id": userId
    },
    "message": {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "list",
              "elements": [
                  {
                      "title": "Classic T-Shirt Collection",
                      "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
                      "subtitle": "See all our colors",
                      "default_action": {
                          "type": "web_url",
                          "url": "https://peterssendreceiveapp.ngrok.io/shop_collection",
                          "messenger_extensions": true,
                          "webview_height_ratio": "tall",
                          "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                      },
                      "buttons": [
                          {
                              "title": "View",
                              "type": "web_url",
                              "url": "https://peterssendreceiveapp.ngrok.io/collection",
                              "messenger_extensions": true,
                              "webview_height_ratio": "tall",
                              "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                          }
                      ]
                  },
                  {
                      "title": "Classic White T-Shirt",
                      "image_url": "https://peterssendreceiveapp.ngrok.io/img/white-t-shirt.png",
                      "subtitle": "100% Cotton, 200% Comfortable",
                      "default_action": {
                          "type": "web_url",
                          "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                          "messenger_extensions": true,
                          "webview_height_ratio": "tall",
                          "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                      },
                      "buttons": [
                          {
                              "title": "Shop Now",
                              "type": "web_url",
                              "url": "https://peterssendreceiveapp.ngrok.io/shop?item=100",
                              "messenger_extensions": true,
                              "webview_height_ratio": "tall",
                              "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                          }
                      ]
                  },
                  {
                      "title": "Classic Blue T-Shirt",
                      "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
                      "subtitle": "100% Cotton, 200% Comfortable",
                      "default_action": {
                          "type": "web_url",
                          "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
                          "messenger_extensions": true,
                          "webview_height_ratio": "tall",
                          "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                      },
                      "buttons": [
                          {
                              "title": "Shop Now",
                              "type": "web_url",
                              "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                              "messenger_extensions": true,
                              "webview_height_ratio": "tall",
                              "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                          }
                      ]
                  },
                  {
                      "title": "Classic Black T-Shirt",
                      "image_url": "https://peterssendreceiveapp.ngrok.io/img/black-t-shirt.png",
                      "subtitle": "100% Cotton, 200% Comfortable",
                      "default_action": {
                          "type": "web_url",
                          "url": "https://peterssendreceiveapp.ngrok.io/view?item=102",
                          "messenger_extensions": true,
                          "webview_height_ratio": "tall",
                          "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                      },
                      "buttons": [
                          {
                              "title": "Shop Now",
                              "type": "web_url",
                              "url": "https://peterssendreceiveapp.ngrok.io/shop?item=102",
                              "messenger_extensions": true,
                              "webview_height_ratio": "tall",
                              "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                          }
                      ]
                  }
              ],
               "buttons": [
                  {
                      "title": "View More",
                      "type": "postback",
                      "payload": "payload"
                  }
              ]
          }
      }
    }
  }
};

nlp.buildSimple = function(userId, text) {

};

nlp.processText = function(sessionId, msg, atts, context, cb) {
  if (msg == "list") {
    console.log("returning list");
    fbStructuredMessage(sessionId, function(err, data) {
      return cb(err, context);
    });
  } else {
    wit.runActions(sessionId, msg, context, function(err, context) {
      return cb(err, context);
    });
  }
};

module.exports = nlp;
