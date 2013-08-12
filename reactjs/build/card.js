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
          card.state.info = cards[card.props.name];
          card.setState(card.state);
        }
        catch (e) {
          console.error(e.message);
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
      return {info: cards[this.props.name]};
    },

    click: function(evt) {
      console.log('card clicked', this.props.name, this.props.cardSource);
      Events.publish('/card/selected', [this.props.name, this.props.cardSource, this.state.info, this]);
    },

    renderSetValues: function (start, end) {
      var values = this.state.info.tradeValues;
      var set = [];
      for (var i = start; i < end && i < values.length; i++) {
        set.push(React.DOM.span( {key:'sv-' + i, className:"set-value"}, values[i]));
      }
      return set;
    },

    render: function () {
      var s = this.state.info;
      if (!s) {
        return React.DOM.div( {onClick:this.click, className:"card"});
      }
      var elems = [];
      var style = {};
      var classes = ["card", dasherize(s.type), dasherize(s.category), dasherize(s.name)];
      if (this.props.selected)
        classes.push("selected");
      if (this.props.secret)
        classes.push("secret");
      if (s.description && s.description.length > 100)
        classes.push("dense");
      else if (s.description && s.description.length < 40)
        classes.push("sparse");
      if (!this.props.faux) {
        classes.push('expandable');
      
        var requires = [];
        if (s.cost) {
          requires.push(s.cost + " gold");
          if (s.requires) {
            requires = requires.concat(s.requires);
          }
        }
        
        if (s.tradeValues)  {
          elems.push(React.DOM.section( {key:"s1", className:"set set1"}, this.renderSetValues(0, 4)));
          elems.push(React.DOM.h1(null, s.tradeValues[0]));
        }
        elems.push(React.DOM.header( {key:"h"}, s.name));
        if (s.imageUrl) {
          if (s.tradeValues) {
            style = {"backgroundImage":"url(/images/trade/" + s.imageUrl + ")"};
          } else {
            elems.push(React.DOM.img( {key:"i", src:"/images/card/" + s.imageUrl}))
          }
        }
        if (s.description) 
          elems.push(React.DOM.section( {key:"d", className:"info"}, 
              React.DOM.p( {className:"description"}, s.description),
              React.DOM.div( {className:"purchase-info"}, 
                requires && requires.join(', ')
              )
            ));
        if (s.tradeValues && s.tradeValues.length > 8)
          elems.push(React.DOM.section( {key:"s2", className:"set set3"}, this.renderSetValues(8, 12)));
        if (s.tradeValues && s.tradeValues.length > 3)
          elems.push(React.DOM.section( {key:"s3", className:"set set2"}, this.renderSetValues(4, 8)));
      }
      return React.DOM.div( {onClick:this.click, className:classes.join(' '), style:style}, 
        elems
      );
    },
  });

  return Card;
});
