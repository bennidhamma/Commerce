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
	socket.send(message);
}

function receiveMessage (event) {
	var message = JSON.parse(event.data);

	switch(message.channel) {
	case "updateGame":
		var game = App.Game.create(message.body);
		Events.publish('/game/update', [game]);
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
	} else {
		setPlayer();
	}
}

module.exports = {
	connect: connect
};
