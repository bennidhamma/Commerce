require.config({
  deps: ["app"],
  paths: {
      jquery: "../lib/jquery",
      react: "../lib/react",
      jsx: "../build/",
  },
});
require(['main', 'react', 'jsx/game', 'game', 'jquery'], 
    function (Plus, React, GameView, gameServer, $) {
  var update = function () {
    var parts = document.location.hash.substr(1).split('/')
    if (parts.length > 0) {
      switch(parts[0]) {
      case "game": 
        gameServer.get(parts[1], function(resp) {
          gameServer.setGame(resp);
          GameView.render(resp);
        });
        break;
      default:
        GameView.render(null);
      }
    }
  }
  $(window).on('hashchange', update);
  Plus.ready(update);
});
