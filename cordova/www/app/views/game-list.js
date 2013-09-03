/** @jsx React.DOM */
define(['react', 'game'], function(React, game) {
  var GameList = React.createClass({
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
           return <img key={p.name} class={p.isCurrent ? "selected" : ""} src={p.imageUrl}/>;
         });
         var id = g.id;
         return <li key={id}><a href={"#game/" + id}>{players}</a></li>;
       });
       return <ul>{games}</ul>;
     }
  });

  return GameList;
});
