var NewRoute = Ember.Route.extend({
	model: function() {
		return App.Game.create({
			players: []
		});
	},

	setupController: function (controller, game) {
		App.Friend.findAll(function(items) {
		  controller.set('friends', items);	
		});
		App.Friend.me(function(me) {
			game.set('players', [me]);
		});
	}
});

module.exports = NewRoute;
