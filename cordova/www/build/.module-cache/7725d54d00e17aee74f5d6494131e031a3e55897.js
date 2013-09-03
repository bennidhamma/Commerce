/** @jsx React.DOM */
define(['react', 'jsx/card', 'jsx/game-list', 'main', 'jquery', 'game', 'jsx/game-view', 'jsx/new-game'], 
    function (React, Card, GameList, Plus, $, gameServer, GameView, NewGame) {
  var currentGame = null;
  var currentMode = MenuMode.MAIN;

  var Menu = React.createClass({displayName: 'Menu',
    getInitialState: function () {
      return {mode: this.props.mode || MenuMode.MAIN};
    },

    listGames: function () {
      this.setState({mode: MenuMode.LIST});
    },

    newGame: function () {
      this.setState({mode: MenuMode.NEW});
    },

    render: function () {
      switch (this.state.mode) {
        case MenuMode.MAIN: 
          return React.DOM.section( {className:"main-menu"}, 
            React.DOM.h1(null, "Commerce Main Menu"),
            React.DOM.ul(null, 
              React.DOM.li( {onClick:this.listGames}, "List Games"),
              React.DOM.li( {onClick:this.newGame}, "New Game")
            )
          );
        case MenuMode.LIST:
          return GameList(null );
        case MenuMode.NEW:
          return NewGame(null );
      }
    }
  })

  var game = {
    render: function(game, mode) {
      currentGame = game;
      Plus.ready(function() {
        console.log ('currentGame: ', currentGame);
        var renderOutput = null;
        if (currentGame) {
          renderOutput = (GameView( {game:currentGame} ));
        } else {
          renderOutput = Menu( {mode:mode})
        }
        React.renderComponent(renderOutput, document.getElementById("output"));
      });
    },

    MenuMode: {
      MAIN: 1,
      LIST: 2,
      NEW: 3
    }
  };

  return game;
});
