/** @jsx React.DOM */
define(['react', 'game', 'main', 'pubsub', 'jsx/card', 'jsx/hex', 'jquery'], 
    function(React, gameServer, Plus, Events, Card, Hex, $) {

  var MenuItem = React.createClass ({displayName: 'MenuItem',
    select: function () {
      this.props.onSelect (this.props.key);
    },

    render: function () {
      return React.DOM.span(
        {className:this.props.cssClass,
        onMouseUp:this.select,
        onTouchEnd:this.select}, 
          this.props.children
        ); 
    }
  });

  var GameView = React.createClass({displayName: 'GameView',
    getInitialState: function () {
      this.setupListeners ();
      this.setupGame (this.props.game);
      return {
        notification: null,
        game: this.props.game,
        cards: null,
        cardsToRedeem: {},
        newOffer: [],
        isMyTurn: false
      };
    },

    setupListeners: function () {
      Events.subscribe ('/card/selected', this.selectCard);
      Events.subscribe ('error', this.notify);
      Events.subscribe ('/cards/loaded', function (cardsArg) {
        if (!this.isMounted())
          return;
        this.state.cards = cardsArg;
        this.setState(this.state);
      }.bind(this));
      Events.subscribe ('/game/update', function (game) {
        this.state.game = game;
        this.setupGame(game);
      }.bind(this));
      Events.subscribe ('/offer/new', function (offer) {
        if (offer.playerKey == Plus.me().id) {
          this.state.game.myOffers.push(offer);
        } else {
          this.state.game.otherOffers.push(offer)
        }
        this.setState(this.state);
      }.bind(this));
      Events.subscribe ('/match/new', function(match) {
        this.state.game.matches.push(match);
        this.drawMatches ();
      }.bind(this));
      Events.subscribe ('/match/delete', function(matchId) {
        this.state.game.matches = _.filter(
          this.state.game.matches, function (m) { return m.id != matchId; });
        this.drawMatches ();
      }.bind(this));
    },

    setupGame: function (game) {
      if (game.tradeCards)
        game.tradeCards = game.tradeCards.map(function(c) {return {name: c, selected: false}});
      if (game.hand)
        game.plays = new Array(game.hand.length);
      gameServer.getLog (function(log) {
        this.state.log = log;
        this.setState (this.state);
      }.bind(this));
      if (this.state) {
        this.setState (this.state);
        if (this.isMyTurn(game) && !(this.state && this.state.isMyTurn)) {
          this.notify('It is your turn.', 2000);
        }
        this.setState({isMyTurn: this.isMyTurn(game)})
      }
    },

    isTrading: function () {
      return this.state.game.status == 'Trading';
    },

    isMyTurn: function (game) {
      game = game || this.state.game;
      return game.status == "Running" && game.currentTurn.playerKey == Plus.me().id;
    },

    isActionPhase: function () {
      return this.isMyTurn() && this.state.game.currentTurn.actions;
    },

    isBuyPhase: function () {
      var turn = this.state.game.currentTurn;
      return this.isMyTurn() && !turn.actions && turn.buys;
    },

    notify: function (message, time) {
      this.setState({notification: message});
      if (time === undefined) {
        time = 5000;
      } 
      if (time) {
        setInterval(this.unnotify, time);
      }
    },

    unnotify: function () {
      if (this.isMounted())
        this.setState({notification: null});
    },

    // Play Action functions.

    selectCard: function(card, cardSource, cardObject, source) {
      console.log('card selected: ', card, cardSource, cardObject, source);
      var self = this;
      var game = this.state.game;
      switch (cardSource) {
      case 'hand':
        if (this.isActionPhase()) {
          game.plays[source.props.index] = true;
          if (cardObject.needsHex) {
            if (game.hexes.length > 0)
              this.notify('Select a hex', 10000);
            else
              this.notify("You can't play this card until you have a hex. Try playing a ship first :)");
            var handle = Events.subscribe('/hex/selected', function(hexId) {
              gameServer.playCard(card, hexId);
              Events.unsubscribe(handle);
              self.unnotify();
            });
          } else {
            gameServer.playCard(card);
          }
        } else if (!this.isMyTurn()) {
          this.notify ("It is not your turn.", 1000);
        }
        break;
      case 'bank':
        if (this.isBuyPhase()) {
          gameServer.buyCard(card);
          game.plays[source.props.index] = true;
        }
        break;
      case 'tradeCards':
        var currentTradeCard = game.tradeCards[source.props.index];
        if (this.isMyTurn()) {
          if (!currentTradeCard.selected) {
            // If no cards are selected, select all cards in set.
            
            var cardCount = game.tradeCards.reduce(function(a,b) { 
              return a + (b.name == card ? 1 : 0);
            }, 0);
            if (!this.state.cardsToRedeem[card])
              this.state.cardsToRedeem[card] = 0;
            if (this.state.cardsToRedeem[card] == 0 && cardCount > 1) {
              // Select all cards.
              for (var i = 0; i < game.tradeCards.length; i++) {
                var tradeCard = game.tradeCards[i];
                if (tradeCard.name == card) {
                  game.tradeCards[i].selected = true;
                }
                this.state.cardsToRedeem[card] = cardCount;
              }
            } else {
              this.state.cardsToRedeem[card]++;
              /*
              // We have already selected the cards, so de-select all of this type.
              game.tradeCards.map(function(c) {
                if (c.name == card) {
                  c.selected = true;
                }
              });
              delete this.state.cardsToRedeem[card];
              */
            }
          } else { // Deselect card.
            currentTradeCard.selected = false;
            this.state.cardsToRedeem[card]--;
          }
          this.setState(this.state);
        } else if (this.isTrading()) {
        // We are in trade mode, user intent is to create trade offers.
          if (currentTradeCard.selected) {
            currentTradeCard.selected = false;
            currentTradeCard.secret = false;
            var idx = this.state.newOffer.indexOf(card);
            if (idx > -1) {
              this.state.newOffer.splice(idx, 1);
            }
          } else {
            if (this.state.newOffer.length > 2) {
              this.notify('Cannot have more than 3 cards in an offer.', 5000);
              return;
            }
            currentTradeCard.selected = true;
            this.state.newOffer.push(card);
            if (this.state.newOffer.length == 3) {
              currentTradeCard.secret = true;
              this.state.readyToListOffer = true;
            }
          }
          this.setState(this.state);
        }
      }
    },

    redeem: function() {
      if (!this.isMyTurn()) {
        return;
      }
      gameServer.redeem(this.state.cardsToRedeem);
      this.setState({cardsToRedeem: {}});
    },

    listOffer: function() {
      if (!this.isTrading() || this.state.newOffer.length != 3) {
        return;
      }
      gameServer.listOffer(this.state.newOffer);
      this.cancelOffer ();
    },

    cancelOffer: function () {
      this.state.game.tradeCards.map(function(c) { c.selected = false; c.secret = false; });
      this.state.readyToListOffer = false;
      this.state.newOffer = [];
      this.setState(this.state);
    },

    doneTrading : function () {
      gameServer.doneTrading();
    },

    skipActions: function () {
      gameServer.skip('action');
    },

    skipBuys: function () {
      gameServer.skip('buy');
    },

    // Touch events
    touch: function (evt) {
      if (this.currentCard) {
        this.currentCard.unfocus();
        this.currentCard = null;
      }
    },

    setCurrentCard: function (card) {
      this.currentCard = card;
    },

    // Render functions.
    
    buildCards: function (cards, source, selectable) {
      var game = this.state.game;
      return cards.map(function(card, i) {
        var name = card;
        var selected = false;
        var secret = false;
        if (typeof(card) != "string") {
          name = card.name;
          selected = card.selected;
          secret = card.secret;
        }
        var played = source == 'hand' && game.plays[i];
        return Card( {name:name, 
          key:"card-" + i + "-" + name, 
          selected:selected, 
          selectable:selectable,
          onFocus:this.setCurrentCard,
          secret:secret,
          index:i, 
          played:played,
          cardSource:source});
      }.bind(this));
    },

    buildStack: function (card, count, source, cssClass, selectable) {
      var cardStack = (Card( {key:"c", 
                       name:card, 
                       selectable:selectable,
                       cardSource:source, 
                       height:count, 
                       cssClass:cssClass}));
      return React.DOM.section( {key:card, className:"stack"}, cardStack);
    },

    hexId: 0,

    buildHexes: function (hexes) {
      return hexes.map(function(hex, i) {
        return Hex( {key:'h-' + hex.id + '-' + this.hexId++, data:hex});
      });
    },

    buildStore: function () {
      if (!this.state.cards) {
        return;
      }
      var game = this.state.game;
      var nationCards = [];
      var techCards = [];
      for (var i = 0; i < game.bank.length; i++) {
        var storeCard = game.bank[i];
        var k = storeCard.card;
        var val = storeCard.quantity;
        var card = this.state.cards[k];
        var canBuyClass = storeCard.canBuy ? 'can-buy' : 'cannot-buy';
        if (card.type == 'Nation') {
          nationCards.push (this.buildStack(k, val, 'bank', canBuyClass, storeCard.canBuy));
        } else { 
          techCards.push (this.buildStack(k, val, 'bank', canBuyClass, storeCard.canBuy));
        }
      }
    
      return (React.DOM.section( {key:"buy", className:"buy-phase"}, 
" Click a card to buy it or ", React.DOM.button( {onClick:this.skipBuys}, "Skip Buys"),
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
      if (this.state.view && this.state.view != Plus.me().id)
        return;
      var game = this.state.game;
      var hand = this.buildCards(game.hand, "hand", this.isActionPhase());
      var discards = this.buildCards(game.discards, "discards");
      var deck = this.buildStack("unknown", game.deckSize, 'deck');
      var techCards = this.buildCards(game.technologyCards, "technologyCards");
      var tradeCards = this.buildCards(game.tradeCards, "tradeCards", this.isMyTurn());
      var hexes = this.buildHexes(_.clone(game.hexes));

      var action = null;
      if (this.isActionPhase()) {
        action = React.DOM.div(null, 
" It is your turn. Click a card to play it, or " ,          React.DOM.button( {onClick:this.skipActions}, "Skip Actions")
        ); 
      } else if (this.isBuyPhase()) {
        action = this.buildStore (); 
      }

      var redeem = '';
      for (var k in this.state.cardsToRedeem) {
        if (this.state.cardsToRedeem[k]) {
          redeem = React.DOM.div( {className:"trade-buttons"}, 
            React.DOM.button( {className:"redeem", onClick:this.redeem}, "Sell Cards")
          );
          break;
        }
      }

      return React.DOM.section( {className:"me " + game.color}, 
          React.DOM.h2(null, React.DOM.img( {src:game.photo}), game.name),
          React.DOM.strong(null, game.gold, " Gold"),
          React.DOM.section( {className:"hexes"}, hexes),
          React.DOM.section( {className:"hand"}, hand),
          action,
          React.DOM.section( {className:"discards"}, deck, discards),
          React.DOM.section( {className:"technology-cards"}, techCards),
          React.DOM.section( {className:"trade-cards"}, tradeCards),
          redeem
        );
    },

    buildOther: function (other) {
      if (!this.state.view || this.state.view != other.key)
        return;
      var hand = [];
      for (var i = 0; i < other.handSize; i++)
        hand.push ('unknown');
      var hand = this.buildCards(hand, "other-hand");
      var discards = this.buildCards (other.discards, "other-discards");
      var deck = this.buildStack("unknown", other.deckSize, 'deck');
      var techCards = this.buildCards (other.technologyCards, "other-technologyCards");
      var hexes = this.buildHexes (other.hexes);
      return React.DOM.section( {key:"other-" + other.color, className:"other " + other.color}, 
        React.DOM.h2(null, React.DOM.img( {src:other.photo}),other.name),
        React.DOM.section( {className:"hexes"}, hexes),
        React.DOM.section( {className:"other-hand"}, hand, deck),
        React.DOM.section( {className:"discards"}, discards),
        React.DOM.section( {className:"technology-cards"}, techCards)
      );
    },

    buildOtherViews: function () {
      var others = this.state.game.otherPlayers.map (this.buildOther);
      return React.DOM.section( {key:"others", className:"others"}, 
          others 
        );
    },

    buildLog: function () {
      if (!this.state.view || this.state.view != 'log')
        return;
      var entries = [];
      if (this.state.log) {
        var entries = this.state.log.map (function(e, i) {
          return React.DOM.div( {className:"log-entry", key:e.timestamp + i}, e.message)
        });
      }
      return React.DOM.section( {className:"log"}, entries);
    },

    drawMatches: function () {
      var game = this.state.game;
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

      if (!p1 || !p2)
        return;
      
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
          gameServer.acceptMatch(match.id);
        });
        buttons.append(button);
      }
      if (match.canCancel) {
        var button = $('<button class=can-canel>X</button>');
        button.click(function () {
          gameServer.cancelMatch(match.id);
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
      var e = $('.offer-' + offerId);
      var o = e.offset();
      return o && {
        x: (o.left - po.left) + e.width() / 2,
        y: (o.top - po.top) + e.height() / 2
      };
    },

    buildTradeView: function() {
      var game = this.state.game;
      var tradeCards = this.buildCards(game.tradeCards, "tradeCards", true);
      var technologyCards = this.buildCards(game.technologyCards, "technologyCards");
      var buttons = [];
      buttons.push(React.DOM.button( {onClick:this.doneTrading}, "Done Trading"));
      if (this.state.readyToListOffer) {
        buttons.push(React.DOM.button( {onClick:this.listOffer}, "List Trade Offer")); 
        buttons.push(React.DOM.button( {onClick:this.cancelOffer}, "Cancel Trade Offer")); 
      }

      setTimeout(this.drawMatches, 0);

      return React.DOM.section( {className:"trading"}, 
        React.DOM.h2(null, "Trading Phase"),
        buttons,
        React.DOM.h3(null, "Your Trade Cards"),
        tradeCards,
        this.buildOffers(),
        technologyCards
      );
    },

    offerClick: function (offer, source) {
      var myOffer = null;
      var otherOffer = null;
      if (source == "my") {
        if (this.state.myOffer == offer) {
          this.setState({myOffer: null});
          return;
        }
        otherOffer = this.state.otherOffer;
        if (otherOffer) {
          myOffer = offer;
        } else {
          this.setState({myOffer: offer});
        }
      } else { // Clicked offer is in the other offers column.
        if (this.state.otherOffer == offer) {
          this.setState({otherOffer: null});
          return;
        }
        myOffer = this.state.myOffer;
        if (myOffer) {
          otherOffer = offer;
        } else {
          this.state.otherOffer = offer;
          this.setState({otherOffer: offer});
        }
      }

      if (myOffer && otherOffer) {
        gameServer.suggestMatch (myOffer.id, otherOffer.id);
        this.setState({myOffer: null, otherOffer: null});
      }
    },

    buildOffer: function(source, o) {
      var cards = this.buildCards(o.cards);
      var selected = o == this.state.myOffer || o == this.state.otherOffer ? 'selected' : '';
      return React.DOM.li(
          {onClick:this.offerClick.bind(this, o, source), 
          className:selected + ' offer-' + o.id}, 
        React.DOM.img( {className:"photo", src:o.playerPhoto, title:o.playerName}),
        cards
      );  
    },

    buildOffers: function () {
      var game = this.state.game;
      var myOffers = game.myOffers.map(this.buildOffer.bind(this, "my"));
      var otherOffers = game.otherOffers.map(this.buildOffer.bind(this, "other"));
      
      return React.DOM.section( {className:"offers"}, 
        React.DOM.canvas( {id:"offerCanvas"}),
        React.DOM.ul( {className:"my"}, 
          myOffers
        ),
        React.DOM.ul( {className:"other"}, 
          otherOffers
        )
      );
    },

    changeView: function(key) {
      this.setState({view: key});
    },
    
    render: function () {
      var sections = [
        React.DOM.section( {key:"n", className:"notification-bar", style:this.state.notification ? {} : {display:'none'}}, 
          this.state.notification
        )
      ];

      var game = this.state.game;
      if (game.status == "Running" || game.status == "Finished") {
        // Add the current turn section.
        if (game.status == "Running") {
          var players = game.players.map (function(player) {
            if (player.key == game.currentTurn.playerKey)
              return MenuItem( {key:player.key, onSelect:this.changeView}, 
                  React.DOM.img( {src:game.currentTurn.playerPhoto}),
                  React.DOM.span( {className:"actions turn-info " + (this.isActionPhase() ? "selected" : "")}, game.currentTurn.actions),
                  React.DOM.span( {className:"buys turn-info " + (this.isBuyPhase() ? "selected" : "")}, game.currentTurn.buys)
                );
            else
             return MenuItem( {key:player.key, onSelect:this.changeView, cssClass:"other " + player.color}, 
                      React.DOM.img( {src:player.photo})
                   );
          }.bind(this));
          sections.push(
            React.DOM.section( {key:"t", className:"currentTurn " + game.currentTurn.playerColor}, 
              React.DOM.h2(null, 
                players,
                MenuItem( {key:"log", onSelect:this.changeView}, 
                  React.DOM.img( {src:"/images/log-icon.png", width:"24", height:"24"})
                )
              )
            ));
        } else {
          var result = game.result;
          var others = game.result.others.map (function(other) {
            return React.DOM.span( {className:"other " + other.color}, 
                      React.DOM.img( {src:other.photo}),
                      other.name,": ", other.score
                   );
          });

          sections.push(
              React.DOM.section( {key:"t", className:"currentTurn " + result.winner.color}, 
                React.DOM.h2(null,  " Game is over. ",                  React.DOM.span( {className:"winner"}, 
                    React.DOM.img( {src:result.winner.photo}),
                    result.winner.name, " : ", result.winner.score
                  ),
                  others
                )
              ));
        }

        sections.push(
            React.DOM.section( {key:"m", className:"main-layout"}, 
              this.buildMyView(),
              this.buildOtherViews(),
              this.buildLog()
            )
        );
      } else if (game.status == "Trading") {
        sections.push(this.buildTradeView());
      }

      return React.DOM.div( {onTouchStart:this.touch}, sections);
    }
  });

  return GameView;
});
