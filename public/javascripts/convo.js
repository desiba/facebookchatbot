var botui = new BotUI('api-bot');

 var socket = io.connect('https://aellachatbot.herokuapp.com:80'); //heroku

//var socket = io.connect(window.location.hostname + process.env.PORT || ':8010');

//var socket = io.connect('http://localhost:8010');
// read the BotUI docs : https://docs.botui.org/

botui.message.add({
  content: 'Lets Start Talking...',
  delay: 1500,
}).then(function () {
  botui.action.text({
    action: {
      placeholder: 'Say Hello', }
  }
).then(function (res) {
  socket.emit('fromClient', { client : res.value }); // sends the message typed to server
    console.log(res.value); // will print whatever was typed in the field.
  }).then(function () {
    socket.on('fromServer', function (data) { // recieveing a reply from server.
      console.log(data);
      newMessage(data);
      addAction();
  })
});
})

function newMessage (response) {
  botui.message.add({
    content: response,
    delay: 0,
  })
}

function addAction () {
  botui.action.text({
    action: {
      placeholder: 'enter response...', 
    }
  }).then(function (res) {
    socket.emit('fromClient', { client : res.body });
    console.log('client response: ', res.body);
  }).catch(function(error){
      console.log(error);
  });
}