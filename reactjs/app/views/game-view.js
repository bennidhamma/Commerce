/** @jsx React.DOM */
define(['react', 'game', 'jsx/card'], 
    function(React, gameServer, Card) {
  var GameView = React.createClass({
    getInitialState: function() {
      return {
        notification: null,
        game: this.props.game
      };
    },

    buildCards: function(cards) {
      return cards.map(function(card) {
        return <Card name={card}/>;
      });
    },

    buildMyView: function() {
      var game = this.state.game;
      var hand = this.buildCards(game.hand);
      var discards = this.buildCards(game.discards);
      var techCards = this.buildCards(game.technologyCards);
      var tradeCards = this.buildCards(game.tradeCards);

      return <section class={"me " + game.color}>
          <section class="hand">{hand}</section>
          <section class="discards">{discards}</section>
          <section class="technology-cards">{techCards}</section>
          <section class="trade-cards">{tradeCards}</section>
        </section>;
    },

    buildOtherViews: function() {
      return <section class="others"></section>;
    },

    buildLog: function() {
      return <section class="log"></section>;
    },
    
    render: function() {
      var sections = [
        <section class="notification-bar" style={this.state.notification ? {} : {display:'none'}}>
          {this.state.notification}
        </section>
      ];

      var game = this.state.game;
      if (game.status == "Running") {
        // Add the current turn section.
        sections.push(
          <section class={"currentTurn " + game.currentTurn.playerColor}>
            <h2>
              <img src={game.currentTurn.playerPhoto}/>
              {game.currentTurn.playerName}
              Actions: {game.currentTurn.actions}
              Buys: {game.currentTurn.buys}
            </h2>
          </section>);

        sections.push(
            <section class="main-layout">
              {this.buildMyView()}
              {this.buildOtherViews()}
              {this.buildLog()}
            </section>
        );

      }

      return <div>{sections}</div>;
    }
  });

  console.log('game view: ', GameView);

  return GameView;
});
