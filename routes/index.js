var express = require('express');
var router = express.Router();

const thousands = require('thousands');
const moment = require('moment');

let now = moment();


/* GET home page. */
router.get('/', function(req, res, next) {
  "Server is working"
  //res.render('index', { title: 'botUI_api.ai' });
});


router.post('/hello', (req, res) => {
   console.log(res.body);

  //const dateToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';

 res.setHeader('Content-Type', 'application/json');
 //var speech = req.body.result && req.body.result.parameters;

return res.status(200).json({
    speech: "hello from webhook",
    displayText: "hello from webhook",
    source: "hello world from webhook"
 });
 
});




router.post('/webhook', async (req, res) => {

      const action = req.body.queryResult.action;

      //var response = prompt("Enter your password?");

      //alert("Hello, " + response);

      //console.log(action);
      //console.log(response);

      /*
      switch(action) {
        case "":
           
        break;
        default:
            
            let default_response = {
              fulfillmentText: "default webhook",
            }
            res.json(default_response);
      }
      */

      
});








module.exports = router;