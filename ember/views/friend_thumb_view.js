var FriendThumbView = Ember.View.extend({
	templateName: 'friend_thumb',
	imageUrl: function() {
		return this.get('image.url');
	}.property('image.url')
});

module.exports = FriendThumbView;
