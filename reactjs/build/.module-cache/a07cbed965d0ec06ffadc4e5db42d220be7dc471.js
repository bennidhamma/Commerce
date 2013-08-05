/** @jsx React.DOM */
define(['react', 'game', 'pubsub'], function (React, gameServer, Events) {

  var cards = null;
  var waitingCards = [];

  Events.subscribe('game', function(game) {
    gameServer.getCards(function(resp) {
      cards = {};
      for (var i = 0; i < resp.length; i++) {
        var card = resp[i];
        cards[card.name] = card;
      }
      for (var i = 0; i < waitingCards.length; i++) {
        var card = waitingCards[i];
        try {
          card.setState(cards[card.props.name]);
        }
        catch (e) {
          console.error(e);
        }
      }
      waitingCards = [];
    });
  });

  var Card = React.createClass ({displayName: 'Card',
    getInitialState: function () {
      if (!cards) {
        waitingCards.push(this);
        return {};
      }
      return cards[this.props.name] || {};
    },

    render: function () {
      var elems = [];
      var header = React.DOM.header(null, this.state.name);
      var img = React.DOM.img( {src:this.state.imageUrl})
      if (this.state.description) 
      return (
        React.DOM.div( {className:"card"}

        )
      );
    }
  });

  return Card;
});
