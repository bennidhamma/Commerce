/** @jsx React.DOM */
define(['react', 'game', 'jsx/card'], 
    function(React, gameServer, Card) {
  var GameView = React.createClass({displayName: 'GameView',
    getInitialState: function() {
      return {
        notification: null,
        game: this.props.game
      };
    },
    
    render: function() {
      var sections = [
        React.DOM.section( {className:"notification-bar", style:this.state.notification ? '' : 'display:none'}, 
          this.state.notification
        )
      ];

      var game = this.state.game;
      if (game.status == "Running") {
        // Add the current turn section.
        sections.push(
          React.DOM.section( {className:"currentTurn " + game.currentTurn.playerColor}, 
            React.DOM.h2(null, 
              React.DOM.img( {src:game.currentTurn.playerPhoto}),
              game.currentTurn.playerName,
" Actions: ", game.currentTurn.actions,
" Buys: ", game.currentTurn.buys
            )
          ));
        


        var hand = this.props.game.hand.map(function(card) {
          return Card( {name:card});
        });
        sections.push(React.DOM.section( {className:"hand"}, hand));
        
      }

      return React.DOM.div(null, sections);
    }
  });

  console.log('game view: ', GameView);

  return GameView;
});
