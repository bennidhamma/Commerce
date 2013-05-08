var Plus = require ('../vendor/main')

var Friend = Ember.Object.extend({});

Friend.reopenClass({
	me: function(process) {
		Plus.ready(function() {
			process(App.Friend.create(Plus.me()));
		});
	},

	findAll: function(process) {
		Plus.ready(function() {
			gapi.client.plus.people.list({
				userId: 'me',
				orderBy: 'best',
				collection: 'visible'
			}).execute(function(resp) {
				var items = [];
				for (var i = 0; i < resp.items.length; i++) {
					items.push(Friend.create(resp.items[i]));
				}
				process(items);
			});
		});
	}
});

module.exports = Friend;
