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

  console.log ("in app/appjs");
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

  var googleapi = {
      authorize: function(options) {
          var deferred = $.Deferred();

          //Build the OAuth consent page URL
          var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
              client_id: options.client_id,
              redirect_uri: options.redirect_uri,
              response_type: 'code',
              scope: options.scope
          });

          //Open the OAuth consent page in the InAppBrowser
          var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

          //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
          //which sets the authorization code in the browser's title. However, we can't
          //access the title of the InAppBrowser.
          //
          //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
          //authorization code will get set in the url. We can access the url in the
          //loadstart and loadstop events. So if we bind the loadstart event, we can
          //find the authorization code and close the InAppBrowser after the user
          //has granted us access to their data.
          $(authWindow).on('loadstart', function(e) {
              var url = e.originalEvent.url;
              var qs = {};
              url.substr(url.indexOf('?')+1).split('&').map(function(x) { b = x.split('='); qs[b[0]] = b[1] });
              console.log('onload start: ' + url);
              console.log('code: ' + qs.code);
              console.log('error: ' + qs.error);

              if (qs.code || qs.error) {
                  //Always close the browser when match is found
                  authWindow.close();
              }

              if (qs.code) {
                  //Exchange the authorization code for an access token
                  alert('qs.code: ' +  qs.code)
                  $.post('https://accounts.google.com/o/oauth2/token', {
                      code: qs.code,
                      client_id: options.client_id,
                      client_secret: options.client_secret,
                      redirect_uri: options.redirect_uri,
                      grant_type: 'authorization_code'
                  }).done(function(data) {
                      alert('access token? ' + data);
                      deferred.resolve(data);
                  }).fail(function(response) {
                      alert('error request token: ' + JSON.stringify(response));
                      deferred.reject(response.responseJSON);
                  });
              } else if (qs.error) {
                  //The user denied access to the app
                  deferred.reject({
                      error: qs.error
                  });
              }
          });

          return deferred.promise();
      }
  };


  document.addEventListener('deviceready', function() {
    console.log ('device is ready -- app/app.js');
    var $loginButton = $('#login a');
    var $loginStatus = $('#login p');

    $loginButton.on('click', function() {
        googleapi.authorize({
          client_id: '341062087615.apps.googleusercontent.com',
          client_secret: 'zAKZZZfxrDLBhUOcPm_c9d_5',
          redirect_uri: 'http://localhost',
          scope: 'https://www.googleapis.com/auth/plus.login'
        }).done(function(data) {
          alert('got code: ' + data.access_token);
          $loginStatus.html('Access Token: ' + data.access_token);
        }).fail(function(data) {
          $loginStatus.html(data.error);
        });
      });
  });

  $(window).on('hashchange', update);
  Plus.ready(update);
  //Events.subscribe('/game/update', render);
  Events.subscribe('render', render);
});
