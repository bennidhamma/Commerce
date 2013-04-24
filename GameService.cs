using System;

namespace ForgottenArts.Commerce
{
	public class GameService
	{
		public Game NewGame(Player host) {
			var game = new Game();
			game.Players.Add(host);
			throw new NotImplementedException();
		}
	}
}

