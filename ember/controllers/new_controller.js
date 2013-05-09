var config = require('../config.js');

var NewController = Ember.ObjectController.extend({
	invite: function(friend) {
		var players = this.get('content.players').addObject(friend);
		this.get('friends').removeObject(friend);
	},
	
	uninvite: function(friend) {
		var players = this.get('content.players').removeObject(friend);
		this.get('friends').addObject(friend);
	},

	startGame: function() {
		var game = {
			players: this.get('content.players')
								.map(function(p){return p.id})
		}
		$.ajax({
			url: config.serverUrlBase + '/api/game',
			type: 'POST',
		  dataType: 'json',
		  contentType: 'application/json',
		  data: JSON.stringify(game),
		  success: function (resp) {
				// game created!
			}
		});
	}
});

module.exports = NewController;
