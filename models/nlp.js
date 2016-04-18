var nlp = {};
var url = "https://seconds-messenger.herokuapp.com/webhook";
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

nlp.processText = function(userId, text, cb) {
  return cb(null, this.buildStructured(userId, categoryText, categoryButtons));
};

module.exports = nlp;
