var Plus = require ('../vendor/main')
var _ = require('../vendor/underscore-min')

var Friend = Ember.Object.extend({});

var friends = {};

var loadedAll = false;

Friend.reopenClass({
	fromRaw: function(raw) {
		raw.imageUrl = raw.image.url;
		return Friend.create(raw);
	},

	me: function(process) {
		Plus.ready(function() {
			process(App.Friend.create(Plus.me()));
		});
	},

	meId: function() {
		var me = Plus.me();
		if (me) {
			return me.id;
		}
	},

	findAll: function(process) {
		if (loadedAll) {
			process(_.toArray(friends));
			return;
		}

		Plus.ready(function() {
			gapi.client.plus.people.list({
				userId: 'me',
				orderBy: 'best',
				collection: 'visible'
			}).execute(function(resp) {
				var items = [];
				for (var i = 0; i < resp.items.length; i++) {
					var friend = Friend.fromRaw(resp.items[i]);
					friends[friend.id] = friend;
					items.push(friend);
				}
				process(items);
				loadedAll = true;
			});
		});
	},

	list: function (ids, process) {
		var response = {};

		var searchRequest = function(id) {
			return gapi.client.request({
				path: 'plus/v1/people/' + id
			});
		};

		var httpBatch = gapi.client.newHttpBatch();

		var waitFor = 0;
		for (var i = 0; i < ids.length; i++) {
			var id = ids[i];
			if (friends[id]) {
				response[id] = friends[id];
			} else {
				httpBatch.add(searchRequest(ids[i]));
				waitFor++;
			}
		}

		if (waitFor) {
			httpBatch.execute(function(resp) {
				for (var k in resp) {
					var result = resp[k].result;
					if (!result) {
						continue;
					}
					var friend = Friend.fromRaw(result);
					friends[friend.id] = friend;
					response[friend.id] = friend;
				}
				process(response);
			});
		} else {
			process(response);
		}
	},
});

module.exports = Friend;
