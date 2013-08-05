/** @jsx React.DOM */
require(['react', 'jsx/card', 'jsx/game-list', 'main', 'jquery', 'game', 'jsx/game-view'], 
    function (React, Card, GameList, Plus, $, gameServer, GameView) {
  var currentGame = null;
  var game = {
    render: function() {
      Plus.ready(function() {
        console.log ('currentGame: ', currentGame);
        var renderOutput = null;
        if (currentGame) {
          renderOutput = (GameView( {game:currentGame} ));
        } else {
          renderOutput = (React.DOM.div(null, 
              GameList(null ),
              Card( {name:"One Colonist"})
            ));
        }
        React.renderComponent(renderOutput, document.getElementById("output"));
      });
    }
  };
  game.render();

  $(window).on('hashchange', function() {
    var parts = document.location.hash.substr(1).split('/')
    if (parts.length > 0) {
      switch(parts[0]) {
      case "game": 
        gameServer.get(parts[1], function(resp) {
          currentGame = resp;
          game.render();
        });
        break;
      }
    }
  });
});
