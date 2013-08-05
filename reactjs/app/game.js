define(['pubsub', '../lib/underscore-min', 'config', 'jquery', 'main'], 
    function(Events, _, config, $, Plus) {
  var currentGame = null;
  var game = {
    sendCommand: function (command, data, process) {
        $.ajax({
          url: config.serverUrlBase + '/api/game/' + currentGame.id + '/' + command,
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(data),
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Player', Plus.me().id);
          },
          success: function(resp) {
            if (resp && resp.error) {
              Events.publish('error', [resp.error]);
            }  
          },
          error: function (resp) {
            console.log ('error sending ' + command, resp);
          }
        });
    },

    playCard: function (card, hexId, process) {
      var args = {card:card, hexId: hexId};
      this.sendCommand ('playCard', args);
    },

    buyCard: function (card, process) {
      this.sendCommand ('buyCard', {card:card});
    },

    skip: function (phase, process) {
      this.sendCommand ('skip', {phase:phase});
    },

    redeem: function (cards) {
      this.sendCommand ('redeem', {cards: cards});
    },

    listOffer: function (cards) {
      this.sendCommand ('offer', {cards: cards});
    },

    doneTrading: function () {
      this.sendCommand ('trading/done', {});
    },

    suggestMatch: function (myOfferId, otherOfferId) {
      this.sendCommand ('match/suggest', {
        myOfferId: myOfferId,
        otherOfferId: otherOfferId
      });
    },

    cancelMatch: function (matchId) {
      this.sendCommand ('match/cancel', {matchId: matchId});
    },

    acceptMatch: function (matchId) {
      this.sendCommand ('match/accept', {matchId: matchId});
    },

    // Getters
    getLog: function (process) {
      $.get(config.serverUrlBase + '/api/game/' + currentGame.id + '/log', process, 'json');
    },

    getCards: function (process) {
      $.get(config.serverUrlBase + '/api/game/' + currentGame.id + '/cards', process, 'json');
    },

    get: function (id, process) {
      $.ajax({
        url: config.serverUrlBase + '/api/game/' + id,
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Player', Plus.me().id);
        },
        contentType: 'application/json',
        success: process
      });
    },

    list: function (process) {
      var meId = Plus.me().id;
      $.ajax({
        url: config.serverUrlBase + '/api/player/' + meId + '/games',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Player', Plus.me().id);
        },
        contentType: 'application/json',
        success: process
      });
    },

    // Setters
    setGame: function(game) {
      currentGame = game;
      Events.publish('game', [game]);
    }
  };

  return game;
});
