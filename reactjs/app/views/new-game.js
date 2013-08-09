/** @jsx React.DOM */
define(['react', 'main', 'config'], 
    function (React, Plus, config) {
  var NewGame = React.createClass({
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
        return <li>
          <img src={p.image.url}/>{p.displayName}
          <button onClick={this.uninvite.bind(this, p)}> - </button>
        </li>}.bind(this));

      var friends = this.state.friends.map(function(p) {
        return <li>
          <img src={p.image.url}/>{p.displayName}
          <button onClick={this.invite.bind(this, p)}> + </button>
        </li>}.bind(this));

      return <section class="new-game">
        <h2>Start a new game</h2>
        <button onClick={this.startGame}>Start!</button>
        <section class="players">
          <h3>Players</h3>
          <ul>
            {players}
          </ul>
        </section>
        <section class="invitees">
          <h3>Invite up to 3 friends to play with</h3>
          <ul>
            {friends}
          </ul>
        </section>
      </section>;
    }
  });

  return NewGame;
});
