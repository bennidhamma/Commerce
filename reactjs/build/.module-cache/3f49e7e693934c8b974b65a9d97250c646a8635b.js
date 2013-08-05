/** @jsx React.DOM */
define(['react', 'game'], function (React, gameServer) {

  var cards = null;
  var waitingCards = [];

  gameServer.getCards(function(resp) {
    cards = resp;
    for (var i = 0; i < waitingCards.length; i++) {
      var card = waitingCards[i];
      card.setState(cards[card.props.name]);
    }
    waitingCards = [];
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
      return (
        React.DOM.div( {className:"card"}, 
          React.DOM.header(null, this.state.name),
          React.DOM.img( {src:this.state.imageUrl})
        )
      );
    }
  });

  return Card;
});
