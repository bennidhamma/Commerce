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

  var Card = React.createClass ({
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
      elems.push(<header key="header">{this.state.name}</header>);
      if (this.state.imageUrl)
        elems.push(<img key="img" src={this.state.imageUrl}/>)
      if (this.state.description) 
        elems.push(<p key="description">{this.state.description}</p>)
      return <div class="card" onClick={this.click}>{elems}</div>;
    },
  });

  return Card;
});
