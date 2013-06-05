var _ = require('../vendor/underscore-min')
var config = require('../config');

var Card = Ember.Object.extend({
	relImageUrl: function() {
		return '/images/cards/' + this.get('imageUrl');
	}.property('imageUrl')
});

Card.reopenClass({
	getForGame: function(game, process) {
		$.ajax({
			url: config.serverUrlBase + '/api/game/' + game.id + '/cards',
			contentType: 'application/json',
			success: function(resp) {
				var cards = {};
				for(var i = 0; i < resp.length; i++) {
					var card = Card.create(resp[i]);
					cards[card.name] = card;
				}

				// Update game hand.
				for (var i = 0; i < game.hand.length; i++) {
					game.hand[i] = cards[game.hand[i]];
				}

				process(cards);
			}
		});
	}
});

module.exports = Card;
