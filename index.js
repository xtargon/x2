'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

const request = require('request')

const APP_TOKEN = 'EAAFab9dUtI0BAK8MipIaEsCnGHAyZBSqAmt2WpQAPWwAezGuZAf76xbd0y9YcY9ZBlfn9XPrc8GdYgwRy09lrPHnAbuFt2jNctC08fGRKMo1lNKZA9fzhQ3q5fGoV1VqGs2F8vW7Hb1PPlpNgHfqTDLWW8AlpaGsoTShSXcVhMxQHOsFxa7lW6fDLYEuSDkZD'

app.get('/',function(req, res){
  res.send('hello world my bro!')
  console.log("all fine bro :/")
})

/*app.get('/webhook',function(req, res){
  if(req.query['hub.verify_token'] == 'fskdñfksñdlkjfñgn'){
    res.send(req.query['hub.challenge'])
    console.log("all fine bro :/")
  }else{
    res.send('Tu no tienes que entrar aqui')
  }
})
*/

app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "6926566s6"
      
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
app.post('/webhook',function(req, res){
  var data = req.body
  if(data.object == 'page'){
    data.entry.forEach(function(pageEntry){
      pageEntry.messaging.forEach(function(messagingEvent){
        if(messagingEvent.message){         
          getMessage(messagingEvent)
        }
      })
    })
  }
  res.sendStatus(200)
})

function getMessage(event){
  var senderID = event.sender.id
  var messageText = event.message.text

  evaluarMensaje(senderID, messageText)
}

function evaluarMensaje(senderID, messageText){
  var mensaje = '';

  if(isContain(messageText,'ayuda')){
    mensaje = 'En que te puedo ayudar? :)'
    enviarMensajeTexto(senderID, mensaje)
  }else if(isContain(messageText,'info')){
    mensaje = 'Hola que tal nuestro numero de telefono es: XXX-5545\n mi correo es: mail@gmail.com'
    enviarMensajeTexto(senderID, mensaje)
  }else if(isContain(messageText,'get started')){
    mensaje = 'Get Started!'
    sendButtonMessage(senderID, mensaje)
  }else{
    mensaje = 'solo se repetir'+ messageText
    enviarMensajeTexto(senderID, mensaje)
  }

  
}

function enviarMensajeTexto(senderID, mensaje){
  var messageData = {
    recipient : {
      id: senderID
    },
    message: {
      text: mensaje
    }
  }

  callSendAPI(messageData)
}

function sendButtonMessage(recipientId, query) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "get started.",
                    "subtitle": "???---???",
                    
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://platzi.com/historias/la-receta-para-mantenerse-actualizado/",
                        "title": query
                    }]
                }]
            }
      }
    }
  };  
 
  callSendAPI(messageData);
}

function callSendAPI(messageData){
  //api de facebook
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: APP_TOKEN},
    method: 'POST',
    json: messageData
  },function(error, response, data){
    if(error)
      console.log('No es posible enviar el mensaje')
    else
      console.log('Mensaje enviado')
  })
}

function isContain(texto, word){
  if(typeof texto=='undefined' || texto.lenght<=0) return false
  return texto.indexOf(word) > -1
}

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening in port 3000'));

// Sets server port and logs message on success
/*app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "6926566s6"
      
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
  });*/

