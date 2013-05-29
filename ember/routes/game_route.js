var GameRoute = Ember.Route.extend({
	model: function (params) {
		return App.Game.create({id: params.game_id});
	},

	setupController: function (controller, gameSummary) {
		var route = this;
		App.Game.find(gameSummary.id, function (game) {
			controller.set('content', game);
			route.getCards(game);
		});
	},

	getCards: function(game) {
		App.Card.getForGame(game.id, function(cards) {
			game.set('cards', cards);
		});
	}

});

module.exports = GameRoute;

