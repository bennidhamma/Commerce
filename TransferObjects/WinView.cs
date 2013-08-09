using System;
using System.Collections.Generic;
using System.Linq;

namespace ForgottenArts.Commerce
{
	public class WinView
	{
		public WinPlayerView Winner {get; set;}
		public IEnumerable<WinPlayerView> Others {get; set;}

		public WinView (Game game)
		{
			this.Winner = (from p in game.Players orderby p.Score descending select new WinPlayerView(p)).First();
			this.Others = (from p in game.Players orderby p.Score descending select new WinPlayerView(p)).Skip (1);
		}
	}

	public class WinPlayerView {
		public string Name {get; set;}
		public string Color {get; set;}
		public string Photo {get; set;}
		public int Score {get; set;}

		public WinPlayerView (PlayerGame p) {
			this.Name = p.Name;
			this.Color = p.Color;
			this.Photo = p.Player.Photo;
			this.Score = p.Score;
		}
	}
}

