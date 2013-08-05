/** @jsx React.DOM */
define(['react'], function (React) {
  var card = {
    cost: 10,
    description: "Choose a hex to land one colonist. +1 Action.",
    imageUrl: "one-colonist.png",
    name: "One Colonist",
    needsHex: true,
    tradeLevel: 0,
    type: "Nation",
  };

  var cards = {
    "One Colonist": card
  };

  var Card = React.createClass ({displayName: 'Card',
    getInitialState: function () {
      return cards[this.props.name];
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
