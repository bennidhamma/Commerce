var NewRoute = Ember.Route.extend({
	setupController: function (controller, game) {
		App.Friend.findAll(function(items) {
		  controller.set('friends', items);	
		});
	}
});

module.exports = NewRoute;
