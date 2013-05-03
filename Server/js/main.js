function authenticate (plus) {
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
		url: '/api/player/auth',
		type: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		data: payload,
		success: function (resp) {
			// list of games!
		}
	});
}
