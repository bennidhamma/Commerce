using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ForgottenArts.Commerce
{
	public class PlayerGame
	{
		public int HandSize = 5;

		public string PlayerKey {get; set;}
		public long GameId {get; set;}
		public int Score {get; set;}

		public Stack<string> Deck {get; set;}
		public List<string> Hand {get; set;}
		public Stack<string> Discards {get; set;}

		public PlayerGame () {
			Deck = new Stack<string> ();
			Hand = new List<string> ();
			Discards = new Stack<string> ();
		}

		public bool Defends () 
		{
			//TODO: scan cards in hand, looking for card with defensive actoion
			// and call it!
			return false;
		}

		public void DrawHand () {
			while (Hand.Count < HandSize) {
				if (Deck.Count == 0) {
					if (Discards.Count == 0) {
						//no more cards to draw.
						return;
					}
					// Shuffle discard.
					var discards = new List<string> (Discards);
					discards.Shuffle ();
					Deck = new Stack<string> (discards);
					Discards.Clear ();
				}
				Hand.Add (Deck.Pop());
			}
		}

		private Player player;
		[IgnoreDataMember]
		public Player Player {
			get {
				if (player == null) {
					player = Player.GetOrCreate (this.PlayerKey);
				}
				return player;
			}
			set {
				player = value;
			}
		}

		private Game game;
		[IgnoreDataMember]
		public Game Game {
			get {
				if (game == null) {
					game = GameRunner.Instance.Repository.Get<Game>(Game.GetKey(GameId));
				}
				return game;
			}
			set {
				game = value;
			}
		}

		public override string ToString ()
		{
			if (Player != null) {
				return Player.DisplayName;
			}
			else {
				return "Unkown Player";
			}
		}
	}
}

