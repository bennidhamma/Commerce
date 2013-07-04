using System;
using System.Collections.Generic;
using System.Linq;

namespace ForgottenArts.Commerce
{
	public enum GamePhase {
		Action,
		Buy
	}

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
			 * Setup player decks.
			 * Setup the bank
			 * Draw starting hands.
			 * First turn is player 0.
			 * Change game state to running.
			 */

			// Set up each player's deck by pushing the cards onto each player's
			// discard pile. This will cause DrawHand to shuffle the deck.
			foreach (var player in game.Players) {
				foreach (var kvp in Cards.StartingDeck) {
					for (int i = 0; i < kvp.Value; i++) {
						player.Discards.Push(kvp.Key);
					}
				}
			}

			game.Bank = new Dictionary<string, int> (cards.StartingBank);

			foreach (var pg in game.Players) {
				pg.DrawHand ();
			}

			game.Status = GameState.Running;

			NewTurn (game);
		}

		void MaybeNewTurn (Game game)
		{
			if (game.CurrentTurn.Actions == 0 && game.CurrentTurn.Buys == 0) {
				NewTurn(game);
			}
		}

		public void NewTurn (Game game)
		{
			if (game.CurrentTurn.Count > 0 && game.CurrentPlayer != null) {
				// Discard cards, draw new cards, shuffling if necessary.
				var currentPlayer = game.CurrentPlayer;
				while (currentPlayer.Hand.Count > 0) {
					currentPlayer.Discards.Push (currentPlayer.Hand[0]);
					currentPlayer.Hand.RemoveAt(0);
				}
				currentPlayer.DrawHand ();
			}
			game.CurrentTurn.Actions = StartingActions;
			game.CurrentTurn.Buys = StartingBuys;
			game.CurrentTurn.Gold = 0;
			game.CurrentTurn.PlayerKey = game.Players[game.CurrentTurn.Count % game.Players.Count].PlayerKey;
			game.CurrentTurn.Count++;
			CheckForGameEnd (game);
			//TODO: notify new current player it is their turn.
		}

		public bool CheckForGameEnd (Game game)
		{
			// TODO: check for signal that a player has advanced to a new age.
			return false;
		}

		public bool Skip (Game game, PlayerGame player, GamePhase phase) {
			// Is it the current player's turn?
			if (Config.EnforcePlayer && game.CurrentPlayer != player) {
				throw new InvalidOperationException ("It is not your turn");
			}

			if (phase == GamePhase.Action) {
				game.CurrentTurn.Actions = 0;
				MaybeNewTurn(game);
				return true;
			}

			if (phase == GamePhase.Buy) {
				game.CurrentTurn.Buys = 0;
				MaybeNewTurn(game);
				return true;
			}

			return false;
		}

		public bool PlayCard (Game game, PlayerGame player, string cardKey, int hexId)
		{
			var card = Cards [cardKey];

			if (string.IsNullOrEmpty (card.Action)) {
				Console.WriteLine ("Card has no action: " + cardKey);
				return false;
			}

			// Is it the current player's turn?
			if (Config.EnforcePlayer && game.CurrentPlayer != player) {
				throw new InvalidOperationException ("It is not your turn");
			}

			if (game.CurrentTurn.Actions <= 0) {
				throw new InvalidOperationException ("You don't have any actions remaining");
			}

			if (!player.Hand.Contains (cardKey)) {
				throw new InvalidOperationException ("You don't have this card to play");
			}

			CardArgs cardArgs =  new CardArgs ();
			if (card.NeedsHex) {
				cardArgs.Hex = game.GetHex(hexId);
			}

			game.CurrentTurn.CurrentCard = cardKey;
			if (!ScriptManager.Manager.ExecuteCardAction (player.Game, card, cardArgs)) {
				return false;
			}
			// Need to deal with situations like Ship cards getting Trashed during the execution.
			if (cardArgs.TrashCard) {
				game.Trash.Add (cardKey);
				player.Hand.Remove (cardKey);
			} else if (cardArgs.DiscardCard) {
				player.Hand.Remove (cardKey);
				player.Discards.Push (cardKey);
			}
			game.CurrentTurn.CurrentCard = null;
			game.CurrentTurn.Actions--;
			MaybeNewTurn(game);
			return true;
		}

		public bool Buy (Game game, PlayerGame player, string cardKey)
		{
			var card = Cards[cardKey];

			// Is it the current player's turn?
			if (Config.EnforcePlayer && game.CurrentPlayer != player) {
				throw new InvalidOperationException ("It is not your turn");
			}

			if (game.CurrentTurn.Buys <= 0) {
				throw new InvalidOperationException ("You don't have any buys remaining");
			}

			if (card.Cost > game.CurrentTurn.Gold) {
				throw new InvalidOperationException ("Not enough gold to purchase card");
			}

			game.CurrentTurn.Gold -= card.Cost;

			// Add card to hand.
			player.Discards.Push (cardKey);

			// Deduct buy
			if (--game.CurrentTurn.Buys <= 0) {
				NewTurn (game);
			}

			return true;
		}
	}
}

