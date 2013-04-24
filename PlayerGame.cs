using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class PlayerGame
	{
		public Player Player {get; set;}
		public Game Game {get; set;}
		public int Score {get; set;}

		public List<string> Deck {get; set;}
		public List<string> Hand {get; set;}
		public List<string> Discards {get; set;}

		public PlayerGame () {
			Deck = new List<string> ();
			Hand = new List<string> ();
			Discards = new List<string> ();
		}
	}
}

