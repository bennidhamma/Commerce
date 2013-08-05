using System;
using System.Linq;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class GameListInfo
	{
		public long Id {get; set;}
		GameState Status { get; set; }
		public IEnumerable<GameListPlayerInfo> Players {get; set;}

		public GameListInfo (Game game)
		{
			this.Id = game.Id;
			this.Status = game.Status;
			Players = from p in game.Players select new GameListPlayerInfo (game, p);
		}
	}

	public class GameListPlayerInfo
	{
		public string Name {get; set;}
		public string ImageUrl {get; set;}
		public bool IsCurrent {get; set;}

		public GameListPlayerInfo (Game g, PlayerGame p)
		{
			this.Name = p.Name;
			this.ImageUrl = p.Player.Photo;
			this.IsCurrent = g.CurrentPlayer == p;
		}
	}
}

