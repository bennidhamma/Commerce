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

    buildCards: function(cards) {
      return cards.map(function(card) {
        return Card( {name:card});
      });
    },

    buildMyView: function() {
      var game = this.state.game;
      var hand = this.buildCards(game.hand);
      var discards = this.buildCards(game.discards);
      var techCards = this.buildCards(game.technologyCards);
      var tradeCards = this.buildCards(game.tradeCards);


      return React.DOM.section( {className:"me " + game.color}, 
          React.DOM.section( {className:"hand"}, hand),
          React.DOM.section( {className:"discards"}, discards),
          React.DOM.section( {className:"technology-cards"}, techCards),
          React.DOM.section( {className:"trade-cards"}, trade-cards)
        );
    },

    buildOtherViews: function() {
      return React.DOM.section( {className:"others"});
    },

    buildLog: function() {
      return React.DOM.section( {className:"log"});
    },
    
    render: function() {
      var sections = [
        React.DOM.section( {className:"notification-bar", style:this.state.notification ? {} : {display:'none'}}, 
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

        sections.push(
            React.DOM.section( {className:"main-layout"}, 
              this.buildMyView(),
              this.buildOtherViews(),
              this.buildLog()
            )
        );

      }

      return React.DOM.div(null, sections);
    }
  });

  console.log('game view: ', GameView);

  return GameView;
});
