using System;
using System.Linq;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class GameListInfo
	{
		public long Id {get; set;}
		GameState Status { get; set; }
		public List<string> Players {get; set;}
		public string CurrentPlayer {get; set;}

		public GameListInfo (Game game)
		{
			this.Id = game.Id;
			this.Status = game.Status;
			Players = new List<string> (from p in game.Players select p.PlayerKey);
			if (game.CurrentTurn != null && game.CurrentTurn.Player != null) {
				CurrentPlayer = game.CurrentTurn.Player.PlayerKey;
			}
		}
	}
}

