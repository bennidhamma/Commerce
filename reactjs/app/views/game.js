/** @jsx React.DOM */
define(['react', 'jsx/card', 'jsx/game-list', 'main', 'jquery', 'game', 'jsx/game-view', 'jsx/new-game'], 
    function (React, Card, GameList, Plus, $, gameServer, GameView, NewGame) {
  var currentGame = null;

  var Menu = React.createClass({
    listGames: function () {
      document.location.hash = "list";
    },

    newGame: function () {
      document.location.hash = "new";
    },

    render: function () {
      switch (this.props.mode) {
        case game.MenuMode.LIST:
          return <GameList />;
        case game.MenuMode.NEW:
          return <NewGame />;
        default:
          return <section class="main-menu">
            <h1>Commerce Main Menu</h1>
            <ul>
              <li onClick={this.listGames}>List Games</li>
              <li onClick={this.newGame}>New Game</li>
            </ul>
          </section>;
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
          renderOutput = (<GameView game={currentGame} />);
        } else {
          renderOutput = <Menu mode={mode}/>
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
