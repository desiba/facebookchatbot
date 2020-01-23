var express = require('express');
var router = express.Router();
var http = require('http');
var axios = require('axios');

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const FB_TEXT_LIMIT = 640;
const PAGE_ID = process.env.PAGE_ID;


/* GET home page. */
router.get('/', (req, res, next) => {
  let referer = req.get('Referer');

  console.log(referer);

  if (referer) {
    if (referer.indexOf('www.messenger.com') >= 0) {
        res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
    } else if (referer.indexOf('www.facebook.com') >= 0) {
        res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
    }
      res.render('popups', {name : req.body});
  }
});


router.get('/options', (req, res, next) => {
  let referer = req.get('Referer');

  console.log(referer);

  if (referer) {
      if (referer.indexOf('www.messenger.com') >= 0) {
          res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
      } else if (referer.indexOf('www.facebook.com') >= 0) {
          res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
      }
      res.render('popups', {name : req.body});
      //res.sendFile('../views/popups.html', {root: __dirname});
  }
});


router.get('/optionspostback', (req, res) => {

  let body = req.query;
  let response = {
      "text": `your email is ${body.email} and your password ia ${body.password} and your user-id is ${body.psid} .`
  };

  res.status(200).send('Please close this window to return to the conversation thread.');
  callSendAPI(body.psid, response);
});



router.post('/login', async (req, res) => {
  
  let email = req.body.email;
  let password = req.body.password;
       console.log(email);
       console.log(password);

       await axios.post(`https://investor-portal-backend.herokuapp.com/api/login`, {
          email,
          password
        })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        const errMsg = error.response.data.message ? error.response.data.message : error.response.data;

        let login_response = {
          fulfillmentText: {
                "platform": "FACEBOOK",
                "card": {
                  "title": "Title: this is a title",
                  "subtitle": "This is an subtitle.  Text can include unicode characters including emoji 📱.",
                  "imageUri": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                  "buttons": [
                    {
                      "text": "This is a button",
                      "postback": "https://assistant.google.com/"
                    }
                  ]
                }
              }
            }
        res.json(login_response);

        console.log({errMsg});
      });
     


    
});

//router.post('/getform', () => {

//});

router.get('/getlocation', function(req, res, next){
  loanservices.total_users_joined_today(req, res);
});

router.post('/hello', (req, res) => {
   console.log(req.body);

  //const dateToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';

 res.setHeader('Content-Type', 'application/json');
 //var speech = req.body.result && req.body.result.parameters;

return res.status(200).json({
    speech: "hello from webhook",
    displayText: "hello from webhook",
    source: "hello world from webhook"
 });
 
});


router.post('/webhook', (req, res) => {

    var data = req.body;
    console.log(JSON.stringify(data));
      
});


// Adds support for GET requests to our webhook
router.get('/webhook', (req, res) => {
 
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

          // Responds with the challenge token from the request
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);

      } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
      }
  }
});


const handlePostback = (sender_psid, received_postback) => {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  if(payload === 'GET_STARTED'){
      response = askTemplate('Are you a Cat or Dog Person?');
      callSendAPI(sender_psid, response);
  }
}


const askTemplate = (text) => {
  return {
      "attachment":{
          "type":"template",
          "payload":{
              "template_type":"button",
              "text": text,
              "buttons":[
                  {
                      "type":"postback",
                      "title":"Cats",
                      "payload":"CAT_PICS"
                  },
                  {
                      "type":"postback",
                      "title":"Dogs",
                      "payload":"DOG_PICS"
                  }
              ]
          }
      }
  }
}

function handleDialogFlowResponse(sender, response) {
  let responseText = response.fulfillmentMessages.fulfillmentText;

  let messages = response.fulfillmentMessages;
  let action = response.action;
  let contexts = response.outputContexts;
  let parameters = response.parameters;

  //sendTypingOff(sender);

  if (isDefined(messages)) {
      handleMessages(messages, sender);
  } else if (isDefined(responseText)) {
    sendTextMessage(sender, responseText);
  }
}

function handleMessages(message, sender) {
  switch (message.message) {
      case "text": //text
          message.text.text.forEach((text) => {
              if (text !== '') {
                  sendTextMessage(sender, text);
              }
          });
          break;
  }
}

function sendTextMessage(recipientId, text) {
  var messageData = {
      recipient: {
          id: recipientId
      },
      message: {
          text: text
      }
  }
  callSendAPI(messageData);
}


function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
      "recipient": {
          "id": sender_psid
      },
      "message": response
  };
  console.log(request_body);
  // Send the HTTP request to the Messenger Platform
  request({
      "uri": "https://graph.facebook.com/v5.0/me/messages",
      "qs": {"access_token": PAGE_ACCESS_TOKEN},
      "method": "POST",
      "json": request_body
  }, (err, res, body) => {
      if (!err) {
          console.log('message sent!')
      } else {
          console.error("Unable to send message:" + err);
      }
  });
}


module.exports = router;
