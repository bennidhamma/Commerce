define(function(require, exports, module) {

var config = require('config');

var ready = {
	isReady: false,
	readyCallbacks: [],
	setReady: function() {
		this.isReady = true;
		for (var i = 0; i < this.readyCallbacks.length; i++) {
			this.readyCallbacks[i]();
		}
	}
};

var me = null;
var friends = {};

var Plus = {
	ready: function(fn) {
		if (ready.isReady) {
			fn();
		}
		else {
			ready.readyCallbacks.push(fn);
		}
	},

	me: function() { return me; },

	authenticate:  function (plus) {
		/* REST url: PUT /api/player/auth
		 * { 
		 * 	id: 1234,
		 * 	displayName: 'Ben Joldersma',
		 *	givenName: 'Ben',
		 *	...
		 * }
		 * returns list of games
		 */
		me = plus;
		var payload = JSON.stringify({
			plusId: plus.id,
			photo: plus.image.url,
			gender: plus.gender,
			displayName: plus.displayName,
			firstName: plus.name.givenName,
			lastName: plus.name.familyName
		});
		console.log(payload);
		ready.setReady();
		$.ajax({
			url: config.serverUrlBase + '/api/player/auth',
			type: 'PUT',
			dataType: 'json',
			contentType: 'application/json',
			data: payload,
			success: function (resp) {
				// list of games!
			}
		});
	},

	signinCallback: function (authResult) {
		if (!authResult['access_token']) {
			return;
		}
		document.getElementById('signinButton').style.display = 'none';
		gapi.client.load('plus','v1', function(){
			 var request = gapi.client.plus.people.get({
				'userId': 'me',
				 });
			 request.execute(authenticate);
			})
	}
};

(function() {
 var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
 po.src = 'https://apis.google.com/js/client:plusone.js';
 var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

module.exports = Plus;
window.signinCallback = Plus.signinCallback;
window.authenticate = Plus.authenticate;

});
