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

  var Card = React.createClass ({
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
        set.push(<span key={'sv-' + i} class="set-value">{values[i]}</span>);
      }
      return set;
    },

    render: function () {
      var s = this.state.info;
      if (!s) {
        return <div onClick={this.click} class="card"></div>;
      }
      var elems = [];
      var classes = ["card", dasherize(s.type), dasherize(s.category), dasherize(s.name)];
      if (this.props.selected)
        classes.push("selected");
      if (s.description && s.description.length > 100)
        classes.push("dense");
      else if (s.description && s.description.length < 50)
        classes.push("sparse");

      var requires = [];
      if (s.cost) {
        requires.push(s.cost + " gold");
        if (s.requires) {
          requires = requires.concat(s.requires);
        }
      }
      
      if (s.tradeValues)
        elems.push(<section key='s1' class="set set1">{this.renderSetValues(0, 4)}</section>);
      elems.push(<header key="h">{s.name}</header>);
      if (s.imageUrl)
        elems.push(<img key="i" src={s.imageUrl}/>)
      if (s.description) 
        elems.push(<section key="d" class="info">
            <p class="description">{s.description}</p>
            <div class="purchase-info">
              {requires && requires.join(', ')}
            </div>
          </section>);
      if (s.tradeValues && s.tradeValues.length > 8)
        elems.push(<section key='s2' class="set set3">{this.renderSetValues(8, 12)}</section>);
      if (s.tradeValues && s.tradeValues.length > 3)
        elems.push(<section key='s3' class="set set2">{this.renderSetValues(4, 8)}</section>);
      return <div onClick={this.click} class={classes.join(' ')}>
        {elems}
      </div>;
    },
  });

  return Card;
});
