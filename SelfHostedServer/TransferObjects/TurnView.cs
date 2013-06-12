using System;

namespace ForgottenArts.Commerce.Server
{
	public class TurnView
	{
		public int Actions {get; set;}
		public int Buys {get; set;}
		public int Gold {get; set;}
		public int Count {get; set;}
		public string PlayerKey {get; set;}
		public string PlayerPhoto {get; set;}
		public string PlayerName {get; set;}

		public TurnView (Turn turn)
		{
			this.Actions = turn.Actions;
			this.Buys = turn.Buys;
			this.Gold = turn.Gold;
			this.Count = turn.Count;
			this.PlayerKey = turn.Player.PlayerKey;
			this.PlayerPhoto = turn.Player.Player.Photo;
			this.PlayerName = turn.Player.Player.FirstName;
		}
	}
}

