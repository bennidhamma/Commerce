var GameListRoute = Ember.Route.extend({
	setupController: function(controller) {
		App.GameList.get(function(games) {
			controller.set('games', games);
		});
	}
});

module.exports = GameListRoute;

