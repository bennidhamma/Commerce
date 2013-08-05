/** @jsx React.DOM */
define(['react', 'game'], function (React, gameServer) {

  var cards = {};


  var Card = React.createClass ({displayName: 'Card',
    getInitialState: function () {
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
