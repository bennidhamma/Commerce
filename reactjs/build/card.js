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
          card.setState(_.clone(cards[card.props.name]));
        }
        catch (e) {
          console.error(e);
        }
      }
      waitingCards = [];
      Events.publish('/cards/loaded', [cards]);
    });
  });

  var Card = React.createClass ({displayName: 'Card',
    getInitialState: function () {
      if (!cards) {
        waitingCards.push(this);
        return {};
      }
      return _.clone(cards[this.props.name]) || {};
    },

    click: function(evt) {
      console.log('card clicked', this.props.name, this.props.cardSource);
      Events.publish('/card/selected', [this.props.name, this.props.cardSource, this.state, this]);
    },

    render: function () {
      var elems = [];
      elems.push(React.DOM.header( {key:"header"}, this.state.name));
      if (this.state.imageUrl)
        elems.push(React.DOM.img( {key:"img", src:this.state.imageUrl}))
      if (this.state.description) 
        elems.push(React.DOM.p( {key:"description"}, this.state.description))
      return React.DOM.div( {className:"card", onClick:this.click}, elems);
    },
  });

  return Card;
});
