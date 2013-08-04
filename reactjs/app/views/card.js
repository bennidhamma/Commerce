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

  var Card = React.createClass ({
    getInitialState: function () {
      return cards[this.props.name];
    },

    render: function () {
      return (
        <div class="card">
          <header>{this.state.name}</header>
          <img src={this.state.imageUrl}/>
        </div>
      );
    }
  });

  return Card;
});
