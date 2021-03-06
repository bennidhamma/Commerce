define(function(require, exports, module) {

var config = require('config');
var $ = require('jquery');

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
var friendList = [];
var loa

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

  getFriends: function (process) {
    if (!googleLoaded) {
      loadGoogle();
      ready.isReady = false;
    }
		this.ready(function() {
			gapi.client.plus.people.list({
				userId: 'me',
				orderBy: 'best',
				collection: 'visible'
			}).execute(function(resp) {
				friendList = [];
				for (var i = 0; i < resp.items.length; i++) {
					var friend = resp.items[i];
					friends[friend.id] = friend;
					friendList.push(friend);
				}
				process(friendList);
				loadedAll = true;
			});
		});
  },

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
    localStorage['me'] = JSON.stringify(me);
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
        console.log('auth: ', resp);
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
	},

  setRegistrationId: function (regId) {
    console.log ('setting registration id to :' + regId);
    this.ready(function() {
      $.ajax({
        url: config.serverUrlBase + '/api/player/' + me.id + '/androidRegistrationId',
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({registrationId: regId}),
        success: function (resp) {
          console.log ('associated registration id: ', resp);
        }
      })
    });
  }
};

var googleLoaded = false;
function loadGoogle () {
  (function() {
   var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
   po.src = 'https://apis.google.com/js/client:plusone.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
   console.log(s, s.parentNode);
  })();
  googleLoaded = true;
};

if (localStorage['me'] != null) {
  me = JSON.parse(localStorage['me']);
  Plus.authenticate(me);
} else  {
  loadGoogle();
}



module.exports = Plus;
window.signinCallback = Plus.signinCallback;
window.authenticate = Plus.authenticate;
window.setRegistrationId = function (regId) {
  Plus.setRegistrationId(regId);
};

if (typeof(AndroidSocket) != 'undefined') {
  AndroidSocket.ready();
}

});
