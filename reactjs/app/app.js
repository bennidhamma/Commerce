require.config({
  deps: ["app"],
  paths: {
      jquery: "../lib/jquery",
      react: "../lib/react",
      underscore: "../lib/underscore-min",
      jsx: "../build",
  },
  shim: {
     underscore: {
       exports: function() { return _.noConflict() }
     }
  }
});
require(['main', 'react', 'jsx/game', 'game', 'jquery', 'socket', 'pubsub'], 
    function (Plus, React, GameView, gameServer, $, socket, Events) {

  var render = function (game) {
    gameServer.setGame(game);
    GameView.render(game);
  };

  React.initializeTouchEvents(true);

  var update = function () {
    var parts = document.location.hash.substr(1).split('/')
    if (parts.length > 0) {
      switch(parts[0]) {
      case "game": 
        gameServer.get(parts[1], function(resp) {
          render(resp);
          socket.connect(resp.id, Plus.me().id);
        });
        break;
      case "list":
        GameView.render(null, GameView.MenuMode.LIST);
        break;
      case "new":
        GameView.render(null, GameView.MenuMode.NEW);
        break;
      default:
        GameView.render(null);
        break;
      }
    }
  };

  $(window).on('hashchange', update);
  Plus.ready(update);
  //Events.subscribe('/game/update', render);
  Events.subscribe('render', render);
});
