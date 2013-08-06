/** @jsx React.DOM */
define(['react', 'game', 'main', 'pubsub', 'jsx/card', 'jsx/hex'], 
    function(React, gameServer, Plus, Events, Card, Hex) {

  var GameView = React.createClass({displayName: 'GameView',
    cardsToRedeem: [],
    newOffer: [],

    getInitialState: function() {
      Events.subscribe('/card/selected', this.selectCard);
      Events.subscribe('error', this.notify);
      Events.subscribe('/cards/loaded', function (cardsArg) {
        this.state.cards = cardsArg;
        this.setState(this.state);
      }.bind(this));

      return {
        notification: null,
        game: this.props.game,
        cards: null
      };
    },

    isTrading: function () {
      return this.state.game.status == 'Trading';
    },

    isMyTurn: function () {
      return !this.isTrading () && this.state.game.currentTurn.playerKey == Plus.me().id;
    },

    isActionPhase: function () {
      return this.isMyTurn() && this.state.game.currentTurn.actions;
    },

    isBuyPhase: function () {
      var turn = this.state.game.currentTurn;
      return this.isMyTurn() && !turn.actions && turn.buys;
    },

    notify: function (message, time) {
      console.error ('TODO: notify', message, time);
    },

    unnotify: function () {
      console.log ('TODO: unnotify');
    },

    // Play Action functions.

    selectCard: function(card, cardSource, cardObject, source) {
      console.log('card selected: ', card, cardSource, cardObject, source);
      var self = this;
      var game = this.state.game;
      switch (cardSource) {
      case 'hand':
        if (this.isActionPhase()) {
          if (cardObject.needsHex) {
            this.notify('Select a hex', 0);
            var handle = Events.subscribe('/hex/selected', function(hexId) {
              gameServer.playCard(card, hexId);
              Events.unsubscribe(handle);
              self.unnotify();
            });
          } else {
            gameServer.playCard(card);
          }
        }
        break;
      case 'bank':
        if (this.isBuyPhase()) {
          gameServer.buyCard(card);
        }
        break;
      case 'tradeCards':
        if (this.isMyTurn()) {
          if (source.state.selected) {
            // If this is the only selected card in a set, add a third select mode 
            // which is to select all cards in the set.
            //TODO: 
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

    redeem: function() {
      if (!this.isMyTurn()) {
        return;
      }
      gameServer.redeem(this.cardsToRedeem);
      this.cardsToRedeem = [];
      $('.card.Trade.selected').removeClass('selected');
    },

    listOffer: function() {
      if (!this.isTrading() || this.newOffer.length != 3) {
        return;
      }
      gameServer.listOffer(this.newOffer);
      this.newOffer = [];
      $('.card.Trade.selected').removeClass('selected secret');
    },

    doneTrading : function () {
      gameServer.doneTrading();
    },

    cancelOffer: function () {
      this.newOffer = [];
      $('.card.Trade.selected').removeClass('selected secret');
    },

    skip: function (phase) {
      gameServer.skip(phase);
    },

    // Render functions.
    
    buildCards: function (cards, source) {
      return cards.map(function(card) {
        return Card( {name:card, cardSource:source});
      });
    },

    buildStack: function (card, count, source) {
      var cards = [];
      for (var i = 0; i < count; i++) {
        cards.push (Card( {name:card, cardSource:source}));
      }
      return React.DOM.section( {className:"stack"}, cards);
    },

    buildHexes: function (hexes) {
      return hexes.map(function(hex) {
        return Hex( {data:hex});
      });
    },

    buildStore: function () {
      if (!this.state.cards) {
        return;
      }
      var game = this.state.game;
      var nationCards = [];
      var techCards = [];
      for (var k in game.bank) {
        var card = this.state.cards[k];
        if (card.type == 'Nation') {
          nationCards.push (this.buildStack(k, game.bank[k], 'bank'));
        } else { 
          techCards.push (this.buildStack(k, game.bank[k], 'bank'));
        }
      }
    
      return (React.DOM.section( {className:"buy-phase"}, 
" Click a card to buy it or ", React.DOM.button( {onClick:"this.skip"}, "Skip Buys"),
        React.DOM.h2(null, "Bank"),
        React.DOM.h3(null, "Nation Cards"),
        React.DOM.section( {className:"bank"}, 
          nationCards
        ),
        React.DOM.h3(null, "Technology Cards"),
        React.DOM.section( {className:"bank"}, 
          techCards
        )
      ));
    },

    buildMyView: function() {
      var game = this.state.game;
      var hand = this.buildCards(game.hand, "hand");
      var discards = this.buildCards(game.discards, "discards");
      var techCards = this.buildCards(game.technologyCards, "technologyCards");
      var tradeCards = this.buildCards(game.tradeCards, "tradeCards");
      var hexes = this.buildHexes(game.hexes);

      var store = null;
      if (this.isBuyPhase()) {
        store = this.buildStore (); 
      }

      return React.DOM.section( {className:"me " + game.color}, 
          store,
          React.DOM.section( {className:"hexes"}, hexes),
          React.DOM.section( {className:"hand"}, hand),
          React.DOM.section( {className:"discards"}, discards),
          React.DOM.section( {className:"technology-cards"}, techCards),
          React.DOM.section( {className:"trade-cards"}, tradeCards)
        );
    },

    buildOtherViews: function() {
      return React.DOM.section( {className:"others"});
    },

    buildLog: function() {
      return React.DOM.section( {className:"log"});
    },
    
    render: function () {
      var sections = [
        React.DOM.section( {className:"notification-bar", style:this.state.notification ? {} : {display:'none'}}, 
          this.state.notification
        )
      ];

      var game = this.state.game;
      if (game.status == "Running") {
        // Add the current turn section.
        sections.push(
          React.DOM.section( {className:"currentTurn " + game.currentTurn.playerColor}, 
            React.DOM.h2(null, 
              React.DOM.img( {src:game.currentTurn.playerPhoto}),
              game.currentTurn.playerName,
" Actions: ", game.currentTurn.actions,
" Buys: ", game.currentTurn.buys
            )
          ));

        sections.push(
            React.DOM.section( {className:"main-layout"}, 
              this.buildMyView(),
              this.buildOtherViews(),
              this.buildLog()
            )
        );

      }

      return React.DOM.div(null, sections);
    }
  });

  return GameView;
});
