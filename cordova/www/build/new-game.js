/** @jsx React.DOM */
define(['react', 'main', 'config'], 
    function (React, Plus, config) {
  var NewGame = React.createClass({displayName: 'NewGame',
    getInitialState: function () {
      Plus.getFriends (function(friends) {
        this.setState ({friends: _.clone(friends)});
      }.bind(this));
      if (!Plus.me()) {
        Plus.ready(function() {
          this.setState({players: [Plus.me()]});        
        }.bind(this));
        return {players: [], friends: []};
      }
      return {players: [Plus.me()], friends: []};
    },

    invite: function (p) {
      this.state.players.push(p);
      this.state.friends = _.without(this.state.friends, p);
      this.setState(this.state);
    },

    uninvite: function (p) {
      this.state.friends.splice(0, 0, p);
      this.state.players = _.without(this.state.players, p);
      this.setState(this.state);
    },

    startGame: function () {
      var players = this.state.players.map (function(p) {
        return p.id;
      });
      $.ajax({
        url: config.serverUrlBase + '/api/game',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({players: players}),
        success: function (resp) {
          document.location.hash = "game/" + resp.gameId;
        }
      });
    },

    render: function() {
      var players = this.state.players.map(function(p) {
        return React.DOM.li(null, 
          React.DOM.img( {src:p.image.url}),p.displayName,
          React.DOM.button( {onClick:this.uninvite.bind(this, p)},  " - " )
        )}.bind(this));

      var friends = this.state.friends.map(function(p) {
        return React.DOM.li(null, 
          React.DOM.img( {src:p.image.url}),p.displayName,
          React.DOM.button( {onClick:this.invite.bind(this, p)},  " + " )
        )}.bind(this));

      return React.DOM.section( {className:"new-game"}, 
        React.DOM.h2(null, "Start a new game"),
        React.DOM.button( {onClick:this.startGame}, "Start!"),
        React.DOM.section( {className:"players"}, 
          React.DOM.h3(null, "Players"),
          React.DOM.ul(null, 
            players
          )
        ),
        React.DOM.section( {className:"invitees"}, 
          React.DOM.h3(null, "Invite up to 3 friends to play with"),
          React.DOM.ul(null, 
            friends
          )
        )
      );
    }
  });

  return NewGame;
});
