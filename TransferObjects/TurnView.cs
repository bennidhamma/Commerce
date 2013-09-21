using System;

namespace ForgottenArts.Commerce.Server
{
	public class TurnView
	{
		public int Actions {get; set;}
		public int Buys {get; set;}
		public int Count {get; set;}
		public string PlayerKey {get; set;}
		public string PlayerPhoto {get; set;}
		public string PlayerName {get; set;}
		public string PlayerColor {get; set;}

		public TurnView (Game game, Turn turn)
		{
			this.Actions = turn.Actions;
			this.Buys = turn.Buys;
			this.Count = turn.Count;
			this.PlayerKey = game.CurrentPlayer.Player.PlusId;
			this.PlayerPhoto = game.CurrentPlayer.Player.Photo;
			this.PlayerName = game.CurrentPlayer.Name;
			this.PlayerColor = game.CurrentPlayer.Color;
		}
	}
}

