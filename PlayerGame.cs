using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class PlayerGame
	{
		public int HandSize = 5;

		public Player Player {get; set;}
		public Game Game {get; set;}
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

		public override string ToString ()
		{
			if (this.Player != null) {
				return this.Player.Name;
			}
			else {
				return "Unkown Player";
			}
		}
	}
}

