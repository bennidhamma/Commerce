/** @jsx React.DOM */
define(['react', 'game', 'pubsub'], function (React, gameServer, Events) {

  var cards = null;
  var waitingCards = [];

  function dasherize (str) {
    return str && str.toLowerCase().replace(/[ _&!.]/g, '-');
  }

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

    renderSetValues: function (start, end) {
      var values = this.state.tradeValues;
      var set = [];
      for (var i = start; i < end && i < values.length; i++) {
        values.push(React.DOM.span( {className:"set-value"}, values[i]));
      }
      return values;
    },

    render: function () {
      var s = this.state;
      var elems = [];
      
      // Setup trade set values.
      if (s.tradeValues)
        elems.push(React.DOM.section( {className:"set set1"}, this.renderSetValues(0, 3)));
      elems.push(React.DOM.header( {key:"h"}, s.name));
      if (this.state.imageUrl)
        elems.push(React.DOM.img( {key:"i", src:s.imageUrl}))
      if (this.state.description) 
        elems.push(React.DOM.p( {key:"d"}, s.description))
      if (this.state.cost)
        elems.push(React.DOM.p( {key:"c"}, s.cost, " gold"));
      if (this.state.requires)
        elems.push(React.DOM.p( {key:"r"}, s.requires));
      if (s.tradeValues && s.tradeValues.length > 8)
        elems.push(React.DOM.section( {className:"set set3"}, this.renderSetValues(8, 12)));
      if (s.tradeValues && s.tradeValues.length > 3)
        elems.push(React.DOM.section( {className:"set set2"}, this.renderSetValues(4, 8)));
      return React.DOM.div( {onClick:this.click,
          className:["card", dasherize(s.type), dasherize(s.category), dasherize(s.name)].join(' ')}, 
        elems
      );
    },
  });

  return Card;
});
