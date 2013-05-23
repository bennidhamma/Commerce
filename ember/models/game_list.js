var _ = require('../vendor/underscore-min')
var config = require('../config');
var GameList = Ember.Object.extend({}); 

GameList.reopenClass({
	get: function(process) {
		App.Friend.me(function(me) {
			$.ajax({
				url: config.serverUrlBase + '/api/player/' + me.id + '/games',
				contentType: 'application/json',
				success: function(resp) {
					// build a unique list of players
					var uniq = _.union.apply(_, resp.map(function(g) { return g.players }));
					// filter out null.
					uniq = _.filter(uniq, function(n) { return n });
					App.Friend.list(uniq, function(players) {
						for (var i = 0; i < resp.length; i++) {
							var game = resp[i];
							for (var j = 0; j < game.players.length; j++) {
								if (game.players[j]) {
									var playerId = game.players[j];
									var player = players[playerId];
									player.set('isCurrent',  game.players[j] == game.currentPlayer);
									game.players[j] = player;
								} else {
									game.players.splice(j, 1);
								}
							}
						}
						// Send the game list response.
						process(resp.map(function(obj) { return Ember.Object.create(obj); }));
					});
				}
			});
		});
	}
});

module.exports = GameList;
