using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class GameRunner
	{
		public int NumberOfCardsPerSuit = 9;

		private CardCatalog cards;

		public CardCatalog Cards {
			get {
				if (cards == null) {
					cards = new CardCatalog ();
					cards.LoadCards ("cards");
				}
				return cards;
			}
			set {
				cards = value;
			}
		}

		public GameRunner ()
		{
		}

		public void Start (Game game)
		{
			/*
			 * Setup the bank - for now just add all cards to the bank. 9 of each type.
			 * Deal out all resource cards to players - this forms starting decks.
			 * Draw starting hands.
			 * First turn is player 0.
			 * Change game state to running.
			 */
			var startingDeck = new List<string> ();
			foreach (Card card in Cards) {
				if (card.IsResource) {
					for (int i = 0; i < NumberOfCardsPerSuit; i++) {
						startingDeck.Add (card.Name);
					}
				}
				else {
					game.Bank[card.Name] = NumberOfCardsPerSuit;
				}
			}

			startingDeck.Shuffle();

			for (int i = 0; i < startingDeck.Count; i++) {
				game.Players[i % game.Players.Count].Deck.Push (startingDeck[i]);
			}

			foreach (var pg in game.Players) {
				pg.DrawHand ();
			}

			game.Status = GameState.Running;
		}

		public void Turn (Game game)
		{

		}
	}
}

