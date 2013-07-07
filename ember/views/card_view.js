var _ = require('../vendor/underscore-min')

var CardView = Ember.View.extend({
	cardSource: null,

  templateName: 'card',

	classNameBindings: ['context.type'],

  classNames: ['card'],
	
	setValues1: function () {
		return this.setValues(0, 4);
	}.property('context.tradeValues'),

	setValues2: function () {
		return this.setValues(4, 8);
	}.property('context.tradeValues'),

	setValues3: function () {
		return this.setValues(8, 12);
	}.property('context.tradeValues'),

	setValues: function(start, end) {
		var card = this.get('context');
		if (!card.tradeValues) {
			return null;
		}
		var items = [];
		for (var i = start; i < end && i < card.tradeValues.length; i++) {
			items.push(card.tradeValues[i]);
		}
		return items;
	},

	doubleClick: function(event) {
		console.log ('card double clicked', event.currentTarget,
			this.get('cardSource'));

		this.get('controller').send('selectCard', this.get('context.name'), 
			this.get('cardSource'));
	}
});

module.exports = CardView;
