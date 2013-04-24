using System;

namespace ForgottenArts.Commerce
{
	public class GameService
	{
		public Game NewGame(Player host) {
			var game = new Game();
			var hostPlayer = new PlayerGame () {
				Player = host,
				Game = game
			};
			game.Players.Add(hostPlayer);
			throw new NotImplementedException();
		}
	}
}

