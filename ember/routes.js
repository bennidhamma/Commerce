var App = require('./app');

App.Router.map(function() {
  this.route("new");
  this.route("game_list");
	this.route("game", {path: '/game/:game_id'});
});
