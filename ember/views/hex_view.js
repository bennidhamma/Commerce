var Events = require('../vendor/pubsub.js');

var HexView = Ember.View.extend({
	templateName: 'hex',
	classNameBindings: ['context.hasColony'],
	classNames: ['hex'],

	doubleClick: function(event) {
		console.log('hex double clicked', event.currentTarget);
		Events.publish('/hex/selected', [this.get('context.id')], this);
	}

});

module.exports = HexView;

