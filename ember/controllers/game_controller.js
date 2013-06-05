var GameController = Ember.Controller.extend({
  "isMyTurn": function () { 
		return true;
	},
	"selectCard": function() {
		console.log ("selectCard", arguments);
	}
});

module.exports = GameController;
