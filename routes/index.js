var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("Server is working")
  //res.render('index', { title: 'botUI_api.ai' });
});


router.post('/hello', (req, res) => {
   console.log("hello is working");

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

    res.render('popups.html');

      //const action = req.body.queryResult.action;
      //console.log(action);

      //res.render('../public/popups.html', { name: req.body.name });

      
      //read({prompt: "Username: ", default: "test-user" }, function (er, user){
          //console.log(user);
      //});
      

      
});








module.exports = router;