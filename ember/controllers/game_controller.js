var Events = require('../vendor/pubsub.js');
var _ = require('../vendor/underscore-min')

var GameController = Ember.Controller.extend({
	notification: '',

	cardsToRedeem: [],

	hasCardsToRedeem: function () {
		return this.cardsToRedeem.length;
	}.property('cardsToRedeem.@each'),

	'isTrading' : function () {
		var game = this.get('content');
		return game.status == 'Trading';
	},

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

	'selectCard': function (card, cardSource, elem) {
		var self = this;
		var game = this.get('content');
	  switch (cardSource) {
	  case 'hand':
			if (this.get('isActionPhase')) {
				var cardObject = this.get('cards')[card];
				if (cardObject.needsHex) {
					this.notify('Select a hex', 0);
					var handle = Events.subscribe('/hex/selected', function(hexId) {
						self.playCard(card, hexId);
						Events.unsubscribe(handle);
						self.unnotify();
					});
				} else {
					this.playCard(card);
				}
			}
			break;
    case 'bank':
			if (this.get('isBuyPhase')) {
				game.buyCard(card);
			}
			break;
		case 'tradeCards':
			if (this.get('isMyTurn')) {
				elem = $(elem);
				if (elem.hasClass('selected')) {
					elem.removeClass('selected');
					var idx = this.cardsToRedeem.indexOf(card);
					if (idx > -1) {
						this.cardsToRedeem.removeAt(idx);
					}
				} else {
					this.cardsToRedeem.pushObject(card);
					elem.addClass('selected');
				}
			}
		}
	},

	'playCard': function(card, hexId) {
		var self = this;
		var game = this.get('content');
		game.playCard(card, hexId);
	},

	'redeem': function() {
		if (!this.get('isMyTurn')) {
			return;
		}
		var game = this.get('content');
		game.redeem(this.cardsToRedeem);
		this.set('cardsToRedeem', []);
		$('.card.Trade.selected').removeClass('selected');
	},

  'skip': function (phase) {
		var game = this.get('content');
		var self = this;	
		game.skip(phase);
  },

	'prepareGame': function (game) {
		this.set('cardsToRedeem', []);
		var cards = this.get('cards');
		// Update game hand.
		if (game.hand) {
			for (var i = 0; i < game.hand.length; i++) {
				game.hand[i] = cards[game.hand[i]];
			}
		}

		if (game.discards) {
			// Update discards -- some trickiness with getting the order right.
			for (i = 0; i < game.discards.length; i++) {
				game.discards[i] = cards[game.discards[i]];
			}
			game.set('discards', game.get('discards').toArray().reverse());
		}

		if (game.tradeCards) {
			// Update trade cards.
			for (i = 0; i < game.tradeCards.length; i++) {
				game.tradeCards[i] = cards[game.tradeCards[i]];
			}
			var tradeCards = game.get('tradeCards').toArray();
			tradeCards = _.sortBy(tradeCards, function(c) {
				return c.tradeLevel + '.' + c.name;
			});
			game.set('tradeCards', tradeCards);
		}

		this.set('content', game);
	},

  'notify': function (message, duration) {
		this.set('notification', message);
		if (duration) {
			$('.notification-bar').slideDown().delay(duration).slideUp();
		} else {
			$('.notification-bar').slideDown();
		}
	},

	'unnotify': function () {
		$('.notification-bar').slideUp();
	}
		
});

module.exports = GameController;
