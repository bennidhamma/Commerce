var _ = require('../vendor/underscore-min')
var config = require('../config');

var Game = Ember.Object.extend({});

Game.reopenClass({
	find: function(id, process) {
		$.ajax({
			url: config.serverUrlBase + '/api/game/' + id,
			contentType: 'application/json',
			success: function(resp) {
				process(Game.create(resp));
			}
		});
	}
});

module.exports = Game;
