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
					var game = App.Game.create(resp);
					process(game);
				}
			});
	},

	playCard: function (card, process) {
    this.sendCommand('playCard', {card:card}, process);
	},

	buyCard: function (card, process) {
    this.sendCommand('buyCard', {card:card}, process);
  },

  skip: function (phase, process) {
    this.sendCommand('skip', {phase:phase}, process);
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
