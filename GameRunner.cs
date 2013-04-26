using System;
using System.Collections.Generic;
using System.Linq;

namespace ForgottenArts.Commerce
{
	public class GameRunner
	{
		public int NumberOfCardsPerSuit = 9;
		public int StartingActions = 1;
		public int StartingBuys = 1;

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

			NewTurn (game);
		}

		void NewTurn (Game game)
		{
			game.CurrentTurn.ActionsRemaining = StartingActions;
			game.CurrentTurn.BuysRemaining = StartingBuys;
			game.CurrentTurn.Gold = 0;
			game.CurrentTurn.Player = game.Players[game.CurrentTurn.Count % game.Players.Count];
			game.CurrentTurn.Count++;
			//TODO: notify new current player it is their turn.
		}

		public void Buy (Game game, PlayerGame player, string cardKey)
		{
			var card = Cards[cardKey];

			// Is it the current player's turn?
			if (game.CurrentTurn.Player != player) {
				throw new InvalidOperationException ("It is not your turn");
			}

			if (game.CurrentTurn.BuysRemaining == 0) {
				throw new InvalidOperationException ("You don't have any buys remaining");
			}

			// Can the player afford it?
			int fallShort = 0;
			foreach (var kvp in card.Cost) {
				fallShort += Math.Max (kvp.Value - player.Hand.Sum(c=> c == kvp.Key ? 1 : 0), 0);
			}

			if (fallShort < game.CurrentTurn.Gold) {
				throw new InvalidOperationException ("Not enough resources to purchase card");
			}
			else {
				game.CurrentTurn.Gold -= fallShort;
			}

			// Deduct resource costs.
			foreach (var kvp in card.Cost) {
				int removeCount = 0;
				player.Hand.RemoveAll (p => p == kvp.Key && removeCount++ < kvp.Value);
			}

			// Add card to hand.
			player.Hand.Add (cardKey);

			// Deduct buy
			if (--game.CurrentTurn.BuysRemaining <= 0) {
				NewTurn (game);
			}
		}
	}
}

