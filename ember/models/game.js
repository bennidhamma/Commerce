var _ = require('../vendor/underscore-min')
var config = require('../config');

var Game = Ember.Object.extend({
	playCard: function (card, process) {
		$.ajax({
			url: config.serverUrlBase + '/api/game/' + this.id + '/playCard',
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({card:card}),
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Player', App.Friend.meId());
			},
			success: process
		});
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
