var GameRoute = Ember.Route.extend({
	model: function (params) {
		return App.Game.create({id: params.game_id});
	},

	setupController: function (controller, gameSummary) {
		var route = this;
		App.Game.find(gameSummary.id, function (game) {
			route.getCards(game, controller);
		});
	},

	getCards: function(game, controller) {
		App.Card.getForGame(game, function(cards) {
			controller.set('cards', cards);
			controller.set('content', game);
		});
	}

});

module.exports = GameRoute;
