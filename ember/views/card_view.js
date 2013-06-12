var _ = require('../vendor/underscore-min')

var CardView = Ember.View.extend({
	cardSource: null,

  templateName: 'card',

  classNames: ['card'],

  cardCost: function () {
		var cost = this.get('context.cost');
		return _.map(cost, function(v, k) { return v + ' ' + k; })
		.join(', ');
  }.property('context.cost'),

	doubleClick: function(event) {
		console.log ('card double clicked', event.currentTarget,
			this.get('cardSource'));

		this.get('controller').send('selectCard', this.get('context.name'), 
			this.get('cardSource'));
	}
});

module.exports = CardView;
