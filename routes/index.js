var express = require('express');
var router = express.Router();
var http = require('http');
var axios = require('axios');
var request = require('request');

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const FB_TEXT_LIMIT = 640;
const PAGE_ID = process.env.PAGE_ID;
let token = '';
let psid = '';


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
  //let resp = login(email, password);
  //console.log(resp);
  let response = {
      "text": `your email is ${body.email} and your password ia ${body.password} and your user-id is ${body.psid}.`
  };

  psid = body.psid;

  //res.status(200).send('Please close this window to return to the conversation thread.');

  //callSendAPI(body.psid, response);
  login(body.email, body.password, body.psid);
  //sendTextMessage(body.psid, response);
});



router.post('/login', async (req, res) => {
  
  let email = req.body.email;
  let password = req.body.password;
       console.log(email);
       console.log(password);

      
    
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


async function login(email, password, psid){

  await axios.post(`https://investor-portal-backend.herokuapp.com/api/login`, {
    email,
    password
  }).then(function (response) {
    token = response.data.token;


    sendMenuMessage(psid);

  }).catch(function (error) {

    //let response = {
      //"text": `your email is ${body.email} and your password ia ${body.password} and your user-id is ${body.psid}.`
    //};

    const errMsg = error.response.data.message ? error.response.data.message : error.response.data;

    sendTextMessage(psid, {"text": errMsg});

    
});




}


// Adds support for GET requests to our webhook
router.get('/webhook', (req, res) => {
 
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

router.post('/webhook', async (req, res) => {

 

  const action = req.body.queryResult.action;
  let parameters = req.body.queryResult.parameters;

  console.log(req.body);

      switch(action) {


        case "input.total_investments":

        console.log(token);
        console.log(psid);


          
              await axios.get(`https://investor-portal-backend.herokuapp.com/api/investment/total`, {
                headers: {
                  "Content-Type": "application/json",
                  "authorization" : `Bearer ${token}`
                }
              }).then(function (response) {

                //console.log(response.data.total);
                sendTextMessage(psid, {"text": response.data.total});
            
            
              }).catch(function (error) {
            
                const errMsg = error.response.data.message ? error.response.data.message : error.response.data;

                console.log(psid);
               
                if(errMsg){

                  let request_body = {
                    "messaging_type": 'RESPONSE',
                    "recipient": {
                      "id": psid
                    },
                      "message": {
                      
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "button",
                            "text": "Please login or check general info ?",
                            "buttons": [
                              {
                                "type": "web_url",
                                "url": "https://fb-dgflow-chatbot.herokuapp.com",
                                "title": "Login",
                                "webview_height_ratio": "compact",
                                "messenger_extensions": true
                              },
                              {
                                "type": "postback",
                                "payload": "General Information",
                                "title": "general info"
                              }
                            ]
                          }
                        }
                      }
                  };

                  callSendAPI(request_body);
                   
                }

           
              });

        break;
       
      }

      

  
});


function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }  
  
  // Sends the response message
  callSendAPI(sender_psid, response);    
}


const handlePostback = (sender_psid, received_postback) => {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  if(payload === 'GET_STARTED'){
      response = askTemplate('Are you a Cat or Dog Person?');
      callSendAPI(sender_psid, response);
  }
}



function verifyRequestSignature(req, res, buf) {
	let signature = req.headers["x-hub-signature"];

	if (!signature) {
		throw new Error('Couldn\'t validate the signature.');
	} else {
		let elements = signature.split('=');
		let method = elements[0];
		let signatureHash = elements[1];

		let expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
}


function sendMenuMessage(psid){

  let message = {
   
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "What would you like to know?",
          "buttons": [
            {
              "type": "postback",
              "payload": "Total Investments",
              "title": "total investments"
            },
            {
              "type": "postback",
              "payload": "Wallet Balance",
              "title": "wallet balance"
            },
            {
              "type": "postback",
              "payload": "Daily Interest",
              "title": "daily interest"
            }
          ]
        }
      }
  };

  let request_body = {
    "messaging_type": 'RESPONSE',
    "recipient": {
      "id": psid
    },
      "message": message
    };

  callSendAPI(request_body);
}

function sendTextMessage(sender_psid, message){
   // Construct the message body
   let request_body = {
    "messaging_type": 'RESPONSE',
    "recipient": {
      "id": sender_psid
    },
      "message": message
    };

    callSendAPI(request_body);
}


function callSendAPI(request_body) {
  
  request({
      "uri": "https://graph.facebook.com/v5.0/me/messages",
      "qs": {"access_token": FB_PAGE_ACCESS_TOKEN},
      "method": "POST",
      "json": request_body,
      "headers": {
        'Content-Type': 'application/json',
      }
      
  }, (err, res, body) => {
      if (!err) {
          console.log(err);
          console.log('message sent!');
          console.log(body);
      } else {
          console.error("Unable to send message:" + err);
      }
  });
}


module.exports = router;
