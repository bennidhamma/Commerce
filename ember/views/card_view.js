var _ = require('../vendor/underscore-min')

var CardView = Ember.View.extend({
  cardSource: null,

  templateName: 'card',

  classNameBindings: ['cssType', 'cssName', 'cssCategory'],

  classNames: ['card'],
    
  cssType: function() {
    var type = this.get('context.type');
    if (!type)
       return '';
    return Em.String.dasherize(type);
  }.property('context.type'),

  cssCategory: function() {
    var category = this.get('context.category');
    if (!category)
      return '';
    return Em.String.dasherize(category.replace('&amp; ',''));
  }.property('context.category'),

  cssName: function() {
    var name = this.get('context.name');
    if (!name) return '';
    return Em.String.dasherize(name);
  }.property('context.name'),
  
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
