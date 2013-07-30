var Events = require('../vendor/pubsub.js');
var _ = require('../vendor/underscore-min')

var GameController = Ember.Controller.extend({
  'notification': '',

  'cardsToRedeem': [],

  'newOffer': [],

  'hasCardsToRedeem': function () {
    return this.cardsToRedeem.length;
  }.property('cardsToRedeem.@each'),

  'readyToListOffer': function () {
    return this.newOffer.length == 3;
  }.property('newOffer.@each'),

  'isTrading' : function () {
    var game = this.get('content');
    return game.status == 'Trading';
  }.property('content.status'),

  'isMyTurn': function () { 
    return !this.get('isTrading') && this.get('content.currentTurn.playerKey') == App.Friend.meId();
  }.property('isTrading'),

  'isActionPhase': function () {
    var game = this.get('content');
    if (!game.currentTurn) {
      return false;
    }
    return this.get('isMyTurn') && game.currentTurn.actions;
  }.property('content.currentTurn.actions'),

  'isBuyPhase': function () {
    var game = this.get('content');
    if (!game.currentTurn) {
      return false;
    }
    return this.get('isMyTurn') && !game.currentTurn.actions && game.currentTurn.buys;
  }.property('content.currentTurn.actions', 'content.currentTurn.buys'),

  'nationBank': function () {
    var game = this.get('content');
    var ret = [];
    for(var k in game.bank) {
      var card = this.cards[k];
      if (card.type != "Nation")
        continue;
      var stack = [];
      for (var i = 0; i < game.bank[k]; i++) {
        stack.push(this.cards[k]);
      }
      ret.push(stack);
    }
    return ret;
  }.property('content.bank'),

  'techBank': function () {
    var game = this.get('content');
    var ret = [];
    for(var k in game.bank) {
      var card = this.cards[k];
      if (card.type != "Technology")
        continue;
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
      elem = $(elem);
      if (this.get('isMyTurn')) {
        if (elem.hasClass('selected')) {
          // If this is the only selected card in a set, add a third select mode 
          // which is to select all cards in the set.
          var cardClass = '.trade-cards .' + Em.String.dasherize(card);
          var cardCount = $(cardClass).length;
          if ($(cardClass + '.selected').length == 1 && cardCount > 1) {
            $(cardClass).addClass('selected');
            // Add one less than total card count to account for the additioal cards we are selecting.
            for (var i = 0; i < cardCount - 1; i++) {
              this.cardsToRedeem.push (card);
            }
          } else {
            $(cardClass).removeClass('selected');
            var idx;
            while((idx = this.cardsToRedeem.indexOf(card)) > -1) {
              this.cardsToRedeem.removeAt(idx);
            }
          }
        } else {
          this.cardsToRedeem.pushObject(card);
          elem.addClass('selected');
        }
      } else if (this.get('isTrading')) {
        if (elem.hasClass('selected')) {
          elem.removeClass('selected secret');
          $('.selected.secret').removeClass('secret');
          var idx = this.newOffer.indexOf(card);
          if (idx > -1) {
            this.newOffer.removeAt(idx);
          }
        } else {
          if (this.newOffer.length > 2) {
            this.notify('Cannot have more than 3 cards in an offer.', 5000);
            return;
          }
          this.newOffer.pushObject(card);
          elem.addClass('selected');
          if (this.newOffer.length == 3) {
            elem.addClass('secret');
          }
        }
      }
    }
  },

  'selectOffer': function (offerId, source) {
    var self = this;
    var game = this.get('content');
    // Clear out any current selection.
    $('.offers ul.' + source + ' .selected').removeClass('selected');
    var myOffer = null;
    var otherOffer = null;
    
    if (source == 'my') {
      if (this.get('myOfferId') == offerId) {
        this.set('myOfferId', null);
        return;
      }
      otherOffer  = this.get('otherOfferId');
      if (otherOffer) {
        myOffer = offerId;
      } else {
        this.set('myOfferId', offerId);
      }
    } else {
      if (this.get('otherOfferId') == offerId) {
        this.set('otherOfferId', null);
        return;
      }
      myOffer = this.get('myOfferId');
      if (myOffer) {
        otherOffer = offerId;
      } else {
        this.set('otherOfferId', offerId);
      }
    }

    if (myOffer && otherOffer) {
      game.suggestMatch(myOffer, otherOffer);
      this.set('myOfferId', null);
      this.set('otherOfferId', null);
      $('.offers ul .selected').removeClass('selected');
    } else {
      $('[offerid=' + offerId + ']').addClass('selected');
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

  'listOffer': function() {
    if (!this.get('isTrading') || this.newOffer.length != 3) {
      return;
    }
    var game = this.get('content');
    game.listOffer(this.newOffer);
    this.set('newOffer', []);
    $('.card.Trade.selected').removeClass('selected secret');
  },

  'doneTrading' : function () {
    var game = this.get('content');
    game.doneTrading();
  },

  'cancelOffer': function () {
    this.set('newOffer', []);
    $('.card.Trade.selected').removeClass('selected secret');
  },

  'skip': function (phase) {
    var game = this.get('content');
    var self = this;  
    game.skip(phase);
  },

  prepareCards: function (arr) {
    if (!arr) 
      return;
    var cards = this.get('cards');
    for (var i = 0; i < arr.length; i++) {
      if (typeof(arr[i]) == "string") {
        arr[i] = cards[arr[i]];
      }
    }
  },

  'prepareGame': function (game) {
    this.set('cardsToRedeem', []);
    this.prepareCards (game.hand);
    this.prepareCards (game.discards);

    if (game.discards) {
      this.prepareCards (game.discards);
      // Update discards -- some trickiness with getting the order right.
      game.set('discards', game.get('discards').toArray().reverse());
    }

    this.prepareCards (game.technologyCards);

    if (game.tradeCards) {
      this.updateTradeCards (game.get('tradeCards').toArray(), game);
    }

    if (game.myOffers) {
      // Update offers.
      for (i = 0; i < game.myOffers.length; i++) {
        this.prepareOffer (game.myOffers[i]);
      }
    }

    if (game.otherOffers) {
      // Update offers.
      for (i = 0; i < game.otherOffers.length; i++) {
        this.prepareOffer (game.otherOffers[i]);
      }
    }

    // Other players
    if (game.otherPlayers) {
      for (i = 0; i < game.otherPlayers.length; i++) {
        var other = game.otherPlayers[i];
        this.prepareCards (other.discards);
        this.prepareCards (other.technologyCards);
      }
    }

    this.set('content', game);

    this.updateMatches (game);
    
    game.getLog();
  },

  'updateTradeCards': function (cards, game) {
    if (!game) {
      game = this.get('content');
    }
    var cardObjects = this.get('cards');
    for (i = 0; i < cards.length; i++) {
      cards[i] = cardObjects[cards[i]];
    }
    cards = _.sortBy(cards, function(c) {
      if (!c) {console.log(c)}
      return c && c.tradeLevel + '.' + c.name;
    });
    game.set('tradeCards', cards);
  },

  'prepareOffer': function (offer) {
    var cards = this.get('cards');
    for (var i = 0; i < offer.cards.length; i++) {
      offer.cards[i] = cards[offer.cards[i]];
    }
  },

  'addOffer': function (offer) {
    this.prepareOffer(offer);
    var game = this.get('content');
    if (offer.playerKey == App.Friend.meId()) {
      game.get('myOffers').addObject(offer);
    } else {
      game.get('otherOffers').addObject(offer);
    }
    this.updateMatches (game);
  },

  'updateMatches': function (game) {
    var self = this;
    setTimeout(function() {self.drawMatches(game);}, 0); 
  },

  drawMatches: function (game) {
    var canvas = $('#offerCanvas');
    var parent = canvas.parent();
    if (canvas.length == 0 || parent.length == 0)
      return;
    canvas = canvas[0];
    canvas.width = parent.width();
    canvas.height = parent.height();
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $('section.offers div.match-buttons').remove();
    if (!game.matches) {
      return;
    }
    for (var i = 0; i < game.matches.length; i++) {
      var match = game.matches[i];
      this.drawMatchLine (game, ctx, match);
    }
  },

  drawMatchLine: function (game, ctx, match) {
    var p1 = this.getOfferPoint(match.offer1Id);
    var p2 = this.getOfferPoint(match.offer2Id);
    
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo (p1.x, p1.y);
    ctx.lineTo (p2.x, p2.y);
    ctx.closePath();
    ctx.stroke();

    var buttons = $('<div class=match-buttons>');
    if (match.canAccept) {
      var button = $('<button class=can-accept>Accept</button>');
      button.click(function () {
        game.acceptMatch(match.id);
      });
      buttons.append(button);
    }
    if (match.canCancel) {
      var button = $('<button class=can-canel>X</button>');
      button.click(function () {
        game.cancelMatch(match.id);
      });
      buttons.append(button);
      var center = {
        left: (p1.x + p2.x) / 2,
        top: (p1.y + p2.y) / 2
      };
      center.left -= buttons.width() / 2;
      center.top -= buttons.height() / 2;
      buttons.css({
        top: center.top,
        left: center.left,
        position: 'absolute'
      });
      $('section.offers').append(buttons);
    }
  },

  getOfferPoint: function (offerId) {
    var po = $('#offerCanvas').offset();
    var e = $('[offerid=' + offerId + ']');
    var o = e.offset();
    return {
      x: (o.left - po.left) + e.width() / 2,
      y: (o.top - po.top) + e.height() / 2
    };
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
  },

  setupListeners: function () {
    var controller = this;
    // Listen for game updates.
    Events.subscribe('/game/update', function (game) {
      controller.prepareGame(game);
    });

    Events.subscribe('/offer/new', function (offer) {
      controller.addOffer(offer);
    });

    Events.subscribe('/match/new', function (match) {
      var game = controller.get('content');
      game.get('matches').addObject(match);
      controller.drawMatches(game);
    });

    Events.subscribe('/tradeCards/update', function (cards) {
      controller.updateTradeCards (cards);
    });

    Events.subscribe('/match/delete', function (matchId) {
      var game = controller.get('content');
      for (var i = 0; i < game.matches.length; i++) {
        if (game.matches[i].id == matchId) {
          game.matches.splice(i, 1);
          break
        }
      }
      controller.drawMatches(game);
    });

    // List for errors.
    Events.subscribe('error', function(message) {
      controller.notify(message, 5000);
    });
  }
    
});

module.exports = GameController;
