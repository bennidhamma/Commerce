/** @jsx React.DOM */
require(['react', 'game', 'jsx/card'], 
    function(React, gameServer, Card) {
  var GameView = React.createClass({displayName: 'GameView',
    
    render: function() {
      var hand = this.props.game.hand.map(function(card) {
        return Card( {name:card});
      });

      return React.DOM.section( {className:"hand"}, hand);
    }
  });

  console.log('game view: ', GameView);

  return GameView;
});
