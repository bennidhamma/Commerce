var CardView = Ember.View.extend({
  templateName: 'card',
  classNames: ['card'],
	doubleClick: function(event) {
		console.log ('card double clicked', event.currentTarget);
		this.get('controller').send('selectCard', this.get('context.name'));
	}
});

module.exports = CardView;
