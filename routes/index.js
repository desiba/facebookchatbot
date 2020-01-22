var express = require('express');
var router = express.Router();
var http = require('http');
var axios = require('axios');


/* GET home page. */
router.get('/', (req, res) => {
  //res.send("server index");
  //res.type('html');
  //res.header('Content-type', 'application/json');
   res.render('popups', {name : req.body});
  
});

router.post('/login', async (req, res) => {
  
  let email = req.body.email,
       password = req.body.password;
       await axios.post(`https://investor-portal-backend.herokuapp.com/api/login`, {
        params: {
          email: email,
          password: password
        }
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.data);
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

  
      
});


module.exports = router;
