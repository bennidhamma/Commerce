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

    renderSetValues: function (start, end) {
      var values = this.state.tradeValues;
      var set = [];
      for (var i = start; i < end && i < values.length; i++) {
        values.push(<span class="set-value">{values[i]}</span>);
      }
      return values;
    },

    render: function () {
      var s = this.state;
      var elems = [];
      
      // Setup trade set values.
      if (s.tradeValues)
        elems.push(<section class="set set1">{this.renderSetValues(0, 3)}</section>);
      elems.push(<header key="h">{s.name}</header>);
      if (this.state.imageUrl)
        elems.push(<img key="i" src={s.imageUrl}/>)
      if (this.state.description) 
        elems.push(<p key="d">{s.description}</p>)
      if (this.state.cost)
        elems.push(<p key="c">{s.cost} gold</p>);
      if (this.state.requires)
        elems.push(<p key="r">{s.requires}</p>);
      if (s.tradeValues && s.tradeValues.length > 8)
        elems.push(<section class="set set3">{this.renderSetValues(8, 12)}</section>);
      if (s.tradeValues && s.tradeValues.length > 3)
        elems.push(<section class="set set2">{this.renderSetValues(4, 8)}</section>);
      return <div onClick={this.click}
          class={["card", dasherize(s.type), dasherize(s.category), dasherize(s.name)].join(' ')}>
        {elems}
      </div>;
    },
  });

  return Card;
});
