var Events = require('../vendor/pubsub.js');
var config = require('../config');

var gameId_ = null;
var playerKey_ = null;
var socket = null;

function setPlayer () {
  var message = {
    gameId: gameId_,
    playerKey: playerKey_
  };
  send('setPlayer', JSON.stringify(message));
}

function send (channel, message) {
  message = channel + '\n' + message;
  console.log('sending ', channel, message, performance.now());
  socket.send(message);
}

function receiveMessage (event) {
  console.log ('receiving ', performance.now());
  var message = JSON.parse(event.data);
  
  switch(message.channel) {
  case "gameUpdate":
  case "tradeUpdate":
    var game = App.Game.create(message.body);
    Events.publish('/game/update', [game]);
    break;
  case 'newOffer':
    var offer = App.Offer.create(message.body);
    Events.publish('/offer/new', [offer]);
    break;
  case "newMatch":
    Events.publish('/match/new', [message.body]);
    break;
  case "updateTradeCards":
    Events.publish('/tradeCards/update', [message.body]);
    break;
  case "removeMatch":
    Events.publish('/match/delete', [message.body]);
    break;
  default:
    console.error('unknown message received', message);
  }
}

function connect (gameId, playerKey) {
  gameId_ = gameId;
  playerKey_ = playerKey;
  if (!socket) {
    socket = new WebSocket(config.socketBase);
    socket.onopen = setPlayer;
    socket.onmessage = receiveMessage;
    socket.onclose = function () {
      setTimeout(function() {connect(gameId, playerKey);}, 1000);
    }
  } else {
    setPlayer();
  }
}

module.exports = {
  connect: connect
};
