var _ = require('../vendor/underscore-min')
var config = require('../config');

var Game = Ember.Object.extend({});

Game.reopenClass({
	find: function(id, process) {
		App.Friend.me(function(me) {
			$.ajax({
				url: config.serverUrlBase + '/api/player/' + me.id +
			 		 	'/game/' + id,
				contentType: 'application/json',
				success: function(resp) {
					process(Game.create(resp));
				}
			});
		});
	}
});

module.exports = Game;
