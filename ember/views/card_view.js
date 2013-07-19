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

  click: function(event) {
    var card = this.get('context');
    var name = card.get('name');
    var cardSource = this.get('cardSource');
    console.log ('card double clicked', event.currentTarget, cardSource);

    this.get('controller').send('selectCard', name, cardSource,
        event.currentTarget);
  }
});

module.exports = CardView;
