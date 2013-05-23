var GameRoute = Ember.Route.extend({
	model: function (params) {
		return App.Game.create({id: params.game_id});
	},

	setupController: function (controller, gameSummary) {
		App.Game.find(gameSummary.id, function (game) {
			controller.set('content', game);
		});
	}

});

module.exports = GameRoute;

