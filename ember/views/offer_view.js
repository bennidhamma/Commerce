var Events = require('../vendor/pubsub.js');

var OfferView = Ember.View.extend({
  tagName: 'li',
  templateName: 'offer',
  attributeBindings: ['offerId'],

  offerId: function () {
    return this.get('context.id');
  }.property('content.id'),

  source: null, 
  click: function(event) {
    console.log('offer double clicked', event.currentTarget);
    $(event.currentTarget).toggleClass('selected');
    var source = this.get('source');
    Events.publish('/offer/selected', [this.get('context.id'), source], this);
  }
});

module.exports = OfferView;

