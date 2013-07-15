var Events = require('../vendor/pubsub.js');
var socket = require('../io/socket.js');

var GameRoute = Ember.Route.extend({
	model: function (params) {
		return App.Game.create({id: params.game_id});
	},

	setupController: function (controller, gameSummary) {
		var route = this;
		
		// Listen for game updates.
		Events.subscribe('/game/update', function(game) {
			controller.prepareGame(game);
		});

		Events.subscribe('/offer/new', function(offer) {
			controller.addOffer(offer);
		});

		// List for errors.
		Events.subscribe('error', function(message) {
			controller.notify(message, 5000);
		});

		App.Game.find(gameSummary.id, function (game) {
			socket.connect(gameSummary.id, App.Friend.meId());
			route.getCards(game, controller);
		});
	},

	getCards: function(game, controller) {
		App.Card.getForGame(game, function(cards) {
			controller.set('cards', cards);
			controller.prepareGame(game);
		});
	}

});

module.exports = GameRoute;
