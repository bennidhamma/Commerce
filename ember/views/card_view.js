var CardView = Ember.View.extend({
	cardSource: null,
  templateName: 'card',
  classNames: ['card'],
	doubleClick: function(event) {
		console.log ('card double clicked', event.currentTarget,
			this.get('cardSource'));

		this.get('controller').send('selectCard', this.get('context.name'), 
			this.get('cardSource'));
	}
});

module.exports = CardView;
