/** @jsx React.DOM */
define(['react', 'game', 'main', 'pubsub', 'jsx/card', 'jsx/hex'], 
    function(React, gameServer, Plus, Events, Card, Hex) {

  var GameView = React.createClass({
    getInitialState: function() {
      Events.subscribe('/card/selected', this.selectCard);
      Events.subscribe('error', this.notify);
      Events.subscribe('/cards/loaded', function (cardsArg) {
        this.state.cards = cardsArg;
        this.setState(this.state);
      }.bind(this));
      Events.subscribe('/game/update', function (game) {
        this.state.game = game;
        this.setupGame(game);
      }.bind(this));

      this.setupGame(this.props.game);
      return {
        notification: null,
        game: this.props.game,
        cards: null,
        cardsToRedeem: {},
        newOffer: []
      };
    },

    setupGame: function(game) {
      if (game.tradeCards)
        game.tradeCards = game.tradeCards.map(function(c) {return {name: c, selected: false}});
      gameServer.getLog (function(log) {
        this.state.log = log;
        this.setState (this.state);
      }.bind(this));
      this.setState (this.state);
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
          if (game.tradeCards[source.props.index].selected) {
            // If this is the only selected card in a set, add a third select mode 
            // which is to select all cards in the set.

            var cardCount = game.tradeCards.reduce(function(a,b) { 
              return a + (b.name == card ? 1 : 0);
            }, 0);
            if (this.state.cardsToRedeem[card] == 1 && cardCount > 1) {
              for (var i = 0; i < game.tradeCards.length; i++) {
                var tradeCard = game.tradeCards[i];
                if (tradeCard.name == card) {
                  game.tradeCards[i].selected = true;
                }
                this.state.cardsToRedeem[card] = cardCount;
              }
            } else {
              // We have already selected the cards, so de-select all of this type.
              game.tradeCards.map(function(c) {
                if (c.name == card) {
                  c.selected = false;
                }
              });
              delete this.state.cardsToRedeem[card];
            }
          } else { // This card is not currently selected.
            game.tradeCards[source.props.index].selected = true;
            this.state.cardsToRedeem[card] = 1;
          }
          this.setState(this.state);
        } else if (this.isTrading()) {
          if (elem.hasClass('selected')) {
            elem.removeClass('selected secret');
            $('.selected.secret').removeClass('secret');
            var idx = this.state.newOffer.indexOf(card);
            if (idx > -1) {
              this.state.newOffer.splice(idx, 1);
              this.setState({newOffer: this.state.newOffer});
            }
          } else {
            if (this.state.newOffer.length > 2) {
              this.notify('Cannot have more than 3 cards in an offer.', 5000);
              return;
            }
            this.state.newOffer.push(card);
            this.setState({newOffer: this.state.newOffer});
            // TODO: set secret state.
            if (this.state.newOffer.length == 3) {
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
      gameServer.redeem(this.state.cardsToRedeem);
      this.setState({cardsToRedeem: {}});
    },

    listOffer: function() {
      if (!this.isTrading() || this.state.newOffer.length != 3) {
        return;
      }
      gameServer.listOffer(this.state.newOffer);
      this.setState({newOffer: []});
    },

    doneTrading : function () {
      gameServer.doneTrading();
    },

    cancelOffer: function () {
      this.setState({newOffer: []});
      $('.card.Trade.selected').removeClass('selected secret');
    },

    skipActions: function () {
      gameServer.skip('action');
    },

    skipBuys: function () {
      gameServer.skip('buy');
    },

    // Render functions.
    
    buildCards: function (cards, source) {
      return cards.map(function(card, i) {
        var name = card;
        var selected = false;
        if (typeof(card) != "string") {
          name = card.name;
          selected = card.selected;
        }
        return <Card name={name} 
          key={"card-" + i + "-" + name} 
          selected={selected} 
          index={i} 
          cardSource={source}/>;
      });
    },

    buildStack: function (card, count, source) {
      var cards = [];
      for (var i = 0; i < count; i++) {
        cards.push (<Card key={"c-" + i} name={card} cardSource={source}/>);
      }
      return <section key={card} class="stack">{cards}</section>;
    },

    hexId: 0,

    buildHexes: function (hexes) {
      return hexes.map(function(hex, i) {
        return <Hex key={'h-' + hex.id + '-' + this.hexId++} data={hex}/>;
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
    
      return (<section key="buy" class="buy-phase">
        Click a card to buy it or <button onClick={this.skipBuys}>Skip Buys</button>
        <h2>Bank</h2>
        <h3>Nation Cards</h3>
        <section class="bank">
          {nationCards}
        </section>
        <h3>Technology Cards</h3>
        <section class="bank">
          {techCards}
        </section>
      </section>);
    },

    buildMyView: function() {
      var game = this.state.game;
      var hand = this.buildCards(game.hand, "hand");
      var discards = this.buildCards(game.discards, "discards");
      var techCards = this.buildCards(game.technologyCards, "technologyCards");
      var tradeCards = this.buildCards(game.tradeCards, "tradeCards");
      var hexes = this.buildHexes(_.clone(game.hexes));

      var action = null;
      if (this.isActionPhase()) {
        action = <div>
          It is your turn. Click a card to play it, or 
          <button onClick={this.skipActions}>Skip Actions</button>
        </div>; 
      } else if (this.isBuyPhase()) {
        action = this.buildStore (); 
      }

      var redeem = '';
      for (var k in this.state.cardsToRedeem) {
        if (this.state.cardsToRedeem[k]) {
          redeem = <div class="trade-buttons">
            <button class="redeem" onClick={this.redeem}>Redeem Cards</button>
          </div>;
          break;
        }
      }

      return <section class={"me " + game.color}>
          <h2><img src={game.photo}/> {game.name}</h2>
          <strong>{game.gold} Gold</strong>
          {action}
          <section class="hexes">{hexes}</section>
          <section class="hand">{hand}</section>
          <section class="discards">{discards}</section>
          <section class="technology-cards">{techCards}</section>
          <section class="trade-cards">{tradeCards}</section>
          {redeem}
        </section>;
    },

    buildOther: function (other) {
      var discards = this.buildCards (other.discards, "other-discards");
      var techCards = this.buildCards (other.technologyCards, "other-technologyCards");
      var hexes = this.buildHexes (other.hexes);
      return <section key={"other-" + other.color} class={"other " + other.color}>
        <h2><img src={other.photo}/>{other.name}</h2>
        <section class="hexes">{hexes}</section>
        Hand Size: {other.handSize}
        Deck Size: {other.deckSize}
        <section class="discards">{discards}</section>
        <section class="technology-cards">{techCards}</section>
      </section>;
    },

    buildOtherViews: function () {
      var others = this.state.game.otherPlayers.map (this.buildOther);
      return <section key="others" class="others">
          {others} 
        </section>;
    },

    buildLog: function() {
      var entries = [];
      if (this.state.log) {
        var entries = this.state.log.map (function(e, i) {
          return <div class="log-entry" key={e.timestamp + i}>{e.message}</div>
        });
      }
      return <section class="log">{entries}</section>;
    },
    
    render: function () {
      var sections = [
        <section key="n" class="notification-bar" style={this.state.notification ? {} : {display:'none'}}>
          {this.state.notification}
        </section>
      ];

      var game = this.state.game;
      if (game.status == "Running" || game.status == "Finished") {
        // Add the current turn section.
        if (game.status == "Running") {
          sections.push(
            <section key="t" class={"currentTurn " + game.currentTurn.playerColor}>
              <h2>
                <img src={game.currentTurn.playerPhoto}/>
                {game.currentTurn.playerName}
                Actions: {game.currentTurn.actions}
                Buys: {game.currentTurn.buys}
              </h2>
            </section>);
        } else {
          var result = game.result;
          var others = game.result.others.map (function(other) {
            return <span class={"other " + other.color}>
                      <img src={other.photo}/>
                      {other.name}: {other.score}
                   </span>;
          });

          sections.push(
              <section key="t" class={"currentTurn " + result.winner.color}>
                <h2> Game is over.
                  <span class="winner">
                    <img src={result.winner.photo}/>
                    {result.winner.name} : {result.winner.score}
                  </span>
                  {others}
                </h2>
              </section>);
        }

        sections.push(
            <section key="m" class="main-layout">
              {this.buildMyView()}
              {this.buildOtherViews()}
              {this.buildLog()}
            </section>
        );
      } else if (game.status == "Trading") {
        var tradeCards = this.buildCards(game.tradeCards);
        var buttons = [];
        buttons.push(<button onClick={this.doneTrading}>Done Trading</button>);
        if (this.state.readyToListOffer) {
          buttons.push(<button onClick={this.listOffer}>List Trade Offer</button>); 
          buttons.push(<button onClick={this.cancelOffer}>Cancel Trade Offer</button>); 
        }

        sections.push(<section class="trading">
          <h2>Trading Phase</h2>
          {buttons}
          <h3>Your Trade Cards</h3>
          {tradeCards}
        </section>);
      }

      return <div>{sections}</div>;
    }
  });

  return GameView;
});
