var Events = require('../vendor/pubsub.js');
var _ = require('../vendor/underscore-min')
var config = require('../config');


var Game = Ember.Object.extend({
	sendCommand: function (command, data, process) {
			$.ajax({
				url: config.serverUrlBase + '/api/game/' + this.id + '/' + command,
				type: 'POST',
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(data),
				beforeSend: function(xhr) {
					xhr.setRequestHeader('Player', App.Friend.meId());
				},
				success: function(resp) {
					if (resp && resp.error) {
						Events.publish('error', [resp.error]);
					}	
				},
				error: function (resp) {
					console.log ('error sending ' + command, resp);
				}
			});
	},

	playCard: function (card, hexId, process) {
		var args = {card:card, hexId: hexId};
    this.sendCommand ('playCard', args);
	},

	buyCard: function (card, process) {
    this.sendCommand ('buyCard', {card:card});
  },

  skip: function (phase, process) {
    this.sendCommand ('skip', {phase:phase});
	},

	redeem: function (cards) {
		this.sendCommand ('redeem', {cards: cards});
	},

	listOffer: function (cards) {
		this.sendCommand ('offer', {cards: cards});
	}
});

Game.reopenClass({
	find: function(id, process) {
		App.Friend.me(function(me) {
			$.ajax({
				url: config.serverUrlBase + '/api/game/' + id,
				beforeSend: function(xhr) {
					xhr.setRequestHeader('Player', App.Friend.meId());
				},
				contentType: 'application/json',
				success: function(resp) {
					process(Game.create(resp));
				}
			});
		});
	}
});

module.exports = Game;
