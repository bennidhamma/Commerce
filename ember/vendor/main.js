var serverUrlBase = 'http://localhost:8080';

var Plus = {
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
		var payload = JSON.stringify({
			plusId: plus.id,
			photo: plus.image.url,
			gender: plus.gender,
			displayName: plus.displayName,
			firstName: plus.name.givenName,
			lastName: plus.name.familyName
		});
		console.log(payload);
		$.ajax({
			url: serverUrlBase + '/api/player/auth',
			type: 'PUT',
			dataType: 'json',
			contentType: 'application/json',
			data: payload,
			success: function (resp) {
				// list of games!
			}
		});
	},

	loadFriends : function () {
		gapi.client.plus.people.list({
			userId: 'me',
			orderBy: 'best',
			collection: 'visible'
		}).execute(function(resp) {
			for (var i = 0; i < resp.items.length; i++) {
				var o = new Option(resp.items[i].displayName, resp.items[i].id);
				o.label = resp.items[i].displayName;
				$('#friends').append(o);
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