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
			foreach (var game in Games) {
				Sanitize (game);
			}
		}

		public IEnumerable<Game> Games {
			get {
				// Get the max id, to know when to stop searching for games.
				var maxId = Repository.MaxId;
				for (long i = 0; i <= maxId; i++) {
					var game = Repository.Get<Game>(Game.GetKey(i));
					if (game != null) {
						yield return game;
					}
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
			foreach (var player in game.Players)
			{
				if (player.GameId != game.Id) {
					player.GameId = game.Id;
					put = true;
				}
			}
			if (put) {
				Save (game);
			}
		}

		public void Save (Game game)
		{
			Repository.Put(game.GetKey(), game);
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

		public void NewTurn (Game game, bool checkForTrades = true)
		{
			if (checkForTrades && game.CurrentTurn.Count > 0 && game.CurrentTurn.Count % game.Players.Count == 0)
			{
				StartTradingPhase (game);
				return;
			}

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
			game.CurrentTurn.PlayerKey = game.Players[game.CurrentTurn.Count % game.Players.Count].PlayerKey;
			game.CurrentTurn.Count++;
			CheckForGameEnd (game);
			//TODO: notify new current player it is their turn.
		}

		public void StartTradingPhase (Game game)
		{
			game.Status = GameState.Trading;
			game.PhaseStart = DateTime.Now;

			// Ensure that trade deck is shuffled and in a healthy state.
			SetupTradeDeck (game);

			// For each player and distribute trade cards, starting with players with the fewest number of colonies.
			foreach (var player in from p in game.Players orderby p.Hexes.Count(h => h.HasColony) select p) {
				int colonyCount = player.Hexes.Count (h => h.HasColony);
				for (int level = 0; level < colonyCount; ++level) {
					// Continue on to next trade card level if all the trade cards at this level have run out.
					if (game.TradeCards [level].Count == 0)
						continue;
					// Move the trade card from the game trade cards pile to the player pile.
					player.TradeCards.Add (game.TradeCards [level] [0]);
					game.TradeCards [level].RemoveAt (0);
				}
			}
		}

		public void EndTradingPhase (Game game)
		{
			// Sort players in order of smallest population - colonies count for 5.
			game.Players = new List<PlayerGame>(game.Players.OrderBy(p => p.Hexes.Sum(h => h.HasColony ? 5 : h.CurrentPopulation)));

			game.Status = GameState.Running;
			game.PhaseStart = DateTime.Now;
			NewTurn (game, false);
		}

		void SetupTradeDeck (Game game)
		{
			if (game.TradeCards == null)
			{
				game.TradeCards = new List<List<string>> ();
				for (int level = 0; level < this.cards.NumberOfTradeLevels; ++level) {
					var cardsAtLevel = cards.GetTradeCardLevel(level);
					game.TradeCards.Add(new List<string> ());
					foreach (var kvp in cardsAtLevel) {
						for (int i = 0; i < kvp.Value; ++i) {
							game.TradeCards[level].Add (kvp.Key);
						}
					}
				}
			}
			for (int i = 0; i < game.TradeCards.Count; i++) {
				game.TradeCards[i].Shuffle();
			}
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

			if (card.Cost > game.CurrentPlayer.Gold) {
				throw new InvalidOperationException ("Not enough gold to purchase card");
			}

			game.CurrentPlayer.Gold -= card.Cost;

			// Add card to hand.
			player.Discards.Push (cardKey);

			// Deduct buy
			if (--game.CurrentTurn.Buys <= 0) {
				NewTurn (game);
			}

			return true;
		}


		// By current convention, the first two cards are visible, and the third is invisible.
		public bool ListOffer (Game game, PlayerGame player, List<string> cards)
		{
			if (game.Status != GameState.Trading)
			{
				throw new InvalidOperationException ("Cannot list offers because the game is not in a trading phase!");
			}

			if (!player.HasTradeCards(cards)) {
				throw new InvalidOperationException ("Player cannot list these cards because he or she does not have them.");
			}

			if (cards.Count != 3)
			{
				throw new InvalidOperationException ("Trade Offers can only consist of three cards.");
			}

			var offer = new Offer () {
				Id = repository.NewId (),
				PlayerKey = player.PlayerKey,
				Cards = cards
			};

			game.Trades.Add (offer);

			return true;
		}

		public bool SuggestMatch (Game game, PlayerGame player, Offer myOffer, PlayerGame otherPlayer, Offer otherOffer)
		{
			if (game.Status != GameState.Trading)
			{
				throw new InvalidOperationException ("Cannot list offers because the game is not in a trading phase!");
			}

			// This check should be unusual because we are in a trade phase where cards cannot be redeemed and the only
			// thing that should remove trade cards is accepting a match.
			if (!player.HasTradeCards (myOffer.Cards) || !otherPlayer.HasTradeCards(otherOffer.Cards)) {
				throw new InvalidOperationException ("Players do not possess trade cards for this trade.");
			}

			if (player.PlayerKey != myOffer.PlayerKey || otherPlayer.PlayerKey != otherOffer.PlayerKey) {
				throw new InvalidOperationException ("These offers do not match these players.");
			}

			var match = new Match () {
				MatchId = repository.NewId(),
				GameId = game.Id,
				Offer1 = myOffer,
				Offer2 = otherOffer
			};

			player.ProposedMatches.Add (match);

			otherPlayer.ReceiveMatch (match);

			return true;
		}

		public bool AcceptMatch (Game game, PlayerGame player, Match match)
		{
			// Ensure that this player is the second player.
			if (player.PlayerKey != match.Offer2.PlayerKey) {
				throw new InvalidOperationException ("Only the second player in a match can accept it.");
			}

			var firstPlayer = game.GetPlayer (match.Offer1.PlayerKey);
			if (firstPlayer == null || !firstPlayer.ProposedMatches.Exists (m => m.MatchId == match.MatchId)) {
				throw new InvalidOperationException ("First player is invalid or does not have the match");
			}

			if (!player.ReceivedMatches.Exists (m=> m.MatchId == match.MatchId)) {
				throw new InvalidOperationException ("Second player does not have the match");
			}

			if (!player.HasTradeCards(match.Offer2.Cards) || !firstPlayer.HasTradeCards(match.Offer1.Cards))
			{
				// Need to validate offers prior to execution to ensure players have the cards.
				ValidateOffers (game);
				throw new InvalidOperationException ("Players do not have the cards for this trade.");
			}
		
			// Execute trade.
			foreach (string card in match.Offer1.Cards)
			{
				GiveTradeCard(firstPlayer, player, card);
			}

			foreach (string card in match.Offer2.Cards)
			{
				GiveTradeCard(player, firstPlayer, card);
			}

			// We always want to save, but if we do in validate offers, we can skip in the caller.
			return !ValidateOffers (game);
		}

		public bool CancelMatch (Game game, PlayerGame player, Match match)
		{
			var firstPlayer = game.GetPlayer (match.Offer1.PlayerKey);
			var secondPlayer = game.GetPlayer (match.Offer2.PlayerKey);

			if (player.PlayerKey != firstPlayer.PlayerKey || player.PlayerKey != secondPlayer.PlayerKey) {
				throw new InvalidOperationException ("Cannot cancel a match that isn't yours.");
			}

			int c = firstPlayer.ProposedMatches.RemoveAll (m => m.MatchId == match.MatchId);
			c += secondPlayer.ReceivedMatches.RemoveAll (m => m.MatchId == match.MatchId);

			return c > 0;
		}

		public void GiveTradeCard(PlayerGame a, PlayerGame b, string card)
		{
			a.TradeCards.Remove (card);
			b.TradeCards.Add (card);
		}

		bool ValidateOffers (Game game)
		{
			int numRemoved = game.Trades.RemoveAll (o => {
				var p = game.GetPlayer (o.PlayerKey);
				return !p.HasTradeCards(o.Cards);
			});
			if (numRemoved > 0) {
				Save (game);
				return true;
			}
			return false;
		}

		public bool RedeemTradeCards (Game game, PlayerGame player, List<string> cards)
		{
			// TODO: ensure it is the current player's turn (or not?)

			// Ensure the player has all the cards.
			if (!player.HasTradeCards(cards)) {
				throw new InvalidOperationException ("Invalid list of cards to redeem.");
			}

			// Sort the cards.
			cards.Sort ();

			string currentCard = null;
			int count = 0;
			Card cardObject = null;

			foreach (string card in cards) {
				if (card != currentCard) {
					if (currentCard != null) {
						cardObject = this.cards [currentCard];
						player.Gold += cardObject.TradeLevel * count * count;
					}
					count = 1;
					currentCard = card;
				} else {
					count++;
				}
				player.TradeCards.Remove(card);
			}

			// Flush the last set.
			cardObject = this.cards[currentCard];
			player.Gold += cardObject.TradeLevel * count * count;

			return true;
		}
	}
}