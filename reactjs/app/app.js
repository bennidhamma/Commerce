require.config({
  deps: ["app"],
  paths: {
      jquery: "../lib/jquery",
      react: "../lib/react",
      underscore: "../lib/underscore-min",
      jsx: "../build/",
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
      default:
        GameView.render(null);
      }
    }
  };

  $(window).on('hashchange', update);
  Plus.ready(update);
  Events.subscribe('gameUpdate', render);
  Events.subscribe('tradeUpdate', render);
  Events.subscribe('render', render);
});
