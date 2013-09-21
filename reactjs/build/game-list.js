/** @jsx React.DOM */
define(['react', 'game'], function(React, game) {
  var GameList = React.createClass({displayName: 'GameList',
     getInitialState: function () {
       var self = this;
       game.list(function(resp) {
         self.setState({games: resp});
       });
       return {games:[]};
     },

     render: function() {
       var games = this.state.games.map(function(g) {
         var players = g.players.map(function(p) {
           return React.DOM.img( {key:p.name, className:p.isCurrent ? "selected" : "", src:p.imageUrl});
         });
         var id = g.id;
         return React.DOM.li( {key:id}, React.DOM.a( {href:"#game/" + id}, players));
       });
       return React.DOM.ul( {className:"game-list"}, games);
     }
  });

  return GameList;
});
