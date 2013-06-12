using System;
using System.Collections.Generic;
using System.Linq;

namespace ForgottenArts.Commerce
{
	public class GameRunner
	{
		private static GameRunner instance = new GameRunner ();

		public static GameRunner Instance {
			get {
				return instance;
			}
			set {
				instance = value;
			}
		}

		private IRepository repository;

		public IRepository Repository {
			get {
				return repository;
			}
			set {
				repository = value;
			}
		}

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

		/// <summary>
		/// Sanitize games, to avoid zombie games and such.
		/// </summary>
		public void Sanitize ()
		{
			// Get the max id, to know when to stop searching for games.
			var maxId = Repository.MaxId;
			for (long i = 0; i <= maxId; i++) {
				var game = Repository.Get<Game>(Game.GetKey(i));
				if (game != null) {
					Sanitize (game);
				}
			}
		}

		public void Sanitize(Game game) 
		{
			bool put = false;
			if (game.CurrentTurn == null || (game.CurrentTurn.Actions == 0 && game.CurrentTurn.Buys == 0)) {
				NewTurn(game);
				put = true;
			}
			if (put) {
				Repository.Put(game.GetKey(), game);
			}
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

		public void NewTurn (Game game)
		{
			game.CurrentTurn.Actions = StartingActions;
			game.CurrentTurn.Buys = StartingBuys;
			game.CurrentTurn.Gold = 0;
			game.CurrentTurn.Player = game.Players[game.CurrentTurn.Count % game.Players.Count];
			game.CurrentTurn.Count++;
			CheckForGameEnd (game);
			//TODO: notify new current player it is their turn.
		}

		public bool CheckForGameEnd (Game game)
		{
			foreach (var player in game.Players) {
				var deck = new List<string>(player.Deck);
				deck.AddRange (player.Hand);
				deck.AddRange (player.Discards);
				deck.Sort ();
				string suit = null;
				int longestSuitCount = 0;
				for (int i = 0; i < deck.Count; i++) {
					if (suit != deck[i]) {
						suit = deck[i];
						longestSuitCount = 0;
					} 
					else
					{
						if (++longestSuitCount >= NumberOfCardsPerSuit) {
							// Game is over!
							game.Win = new Win () {
								Player = player,
								Suit = suit
							};
							game.Status = GameState.Finished;
							// TODO: notify players game is over.
							return true;
						}
					}
				}
			}
			return false;
		}

		public void PlayCard (Game game, PlayerGame player, string cardKey)
		{
			var card = Cards[cardKey];

			// Is it the current player's turn?
			if (Config.EnforcePlayer && game.CurrentTurn.Player != player) {
				throw new InvalidOperationException ("It is not your turn");
			}

			if (game.CurrentTurn.Actions <= 0) {
				throw new InvalidOperationException ("You don't have any actions remaining");
			}

			if (!player.Hand.Contains(cardKey)) {
				throw new InvalidOperationException ("You don't have this card to play");
			}

			game.CurrentTurn.CurrentCard = cardKey;
			ScriptManager.Manager.ExecuteCardEffect (player.Game, card);
			player.Hand.Remove (cardKey);
			game.CurrentTurn.CurrentCard = null;
			game.CurrentTurn.Actions--;
		}

		public void Buy (Game game, PlayerGame player, string cardKey)
		{
			var card = Cards[cardKey];

			// Is it the current player's turn?
			if (game.CurrentTurn.Player != player) {
				throw new InvalidOperationException ("It is not your turn");
			}

			if (game.CurrentTurn.Buys <= 0) {
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
			if (--game.CurrentTurn.Buys <= 0) {
				NewTurn (game);
			}
		}
	}
}

