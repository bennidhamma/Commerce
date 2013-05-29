var _ = require('../vendor/underscore-min')
var config = require('../config');

var Card = Ember.Object.extend({

});

Card.reopenClass({
	getForGame: function(gameId, process) {
		$.ajax({
			url: config.serverUrlBase + '/api/game/' + gameId + '/cards',
			contentType: 'application/json',
			success: function(resp) {
				var cards = [];
				for(var i = 0; i < resp.length; i++) {
					cards.push(Card.create(resp[i]));
				}
				process(cards);
			}
		});
	}
});

module.exports = Card;
