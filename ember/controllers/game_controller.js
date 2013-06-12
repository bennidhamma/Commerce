var GameController = Ember.Controller.extend({
  'isMyTurn': function () { 
		return true;
	},

	'isActionPhase': function () {
		var game = this.get('content');
		if (!game.currentTurn) {
			return false;
		}
		return this.isMyTurn() && game.currentTurn.actions;
	}.property('content.currentTurn.actions'),

	'isBuyPhase': function () {
		var game = this.get('content');
		if (!game.currentTurn) {
			return false;
		}
		return this.isMyTurn() && !game.currentTurn.actions && game.currentTurn.buys;
	}.property('content.currentTurn.actions', 'content.currentTurn.buys'),

  'bank': function () {
		var game = this.get('content');
		var ret = [];
		for(var k in game.bank) {
			var stack = [];
			for (var i = 0; i < game.bank[k]; i++) {
				stack.push(this.cards[k]);
			}
			ret.push(stack);
		}
		return ret;
	}.property('content.bank'),

	'selectCard': function (card, cardSource) {
		var self = this;
		var game = this.get('content');
	  switch (cardSource) {
	  case 'hand':
			if (this.get('isMyTurn') && this.get('content.currentTurn.actions')) {
				game.playCard(card, function (game) {
					self.prepareGame(game);
				});
			}
			break;
		}
		console.log ('selectCard', arguments);
	},

	'prepareGame': function (game) {
		var cards = this.get('cards');
		// Update game hand.
		for (var i = 0; i < game.hand.length; i++) {
			game.hand[i] = cards[game.hand[i]];
		}
		this.set('content', game);
	}
});

module.exports = GameController;
