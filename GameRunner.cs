using System;
using System.Collections.Generic;
using System.Linq;
using ForgottenArts.Commerce.Server;

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

		/// <summary>
		/// Sanitize games, to avoid zombie games and such.
		/// </summary>
		public void Sanitize ()
		{
			foreach (var game in Games) {
				Sanitize (game);
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
				if (player.Hexes.Count > Config.MaxNumberOfHexes) {
					player.Hexes = player.Hexes.Take (Config.MaxNumberOfHexes).ToList ();
				}
			}

			// See if we need to add any new cards to the bank. This is mainly a debug utillity. We probably don't want to do this to real games :)
			foreach (var kvp in cards.StartingBank)
			{
				if (!game.Bank.ContainsKey(kvp.Key)) {
					game.Bank.Add (kvp.Key, kvp.Value);
					put = true;
				}
			}

			if (game.Players.Count > 0 && string.IsNullOrEmpty(game.Players[0].Color)) {
				put = true;
				for (var i = 0; i < game.Players.Count; i++) {
					game.Players[i].Color = PlayerGame.Colors[i];
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
			game.CurrentTurn.TradeSetsRedeemed = 0;

			game.CurrentPlayer.HandleCardEvents (new TurnEvent ());

			CheckForGameEnd (game);
			//TODO: notify new current player it is their turn.
		}

		public void HandleStarvation (Game game)
		{
			foreach (var p in game.Players) {
				foreach (var h in p.Hexes) {
					if (!h.HasColony && h.CurrentPopulation > h.GetPopulationLimit()) {
						h.CurrentPopulation = h.GetPopulationLimit();
					}
				}
			}
		}

		public void HandleTaxation (Game game)
		{
			foreach (var p in game.Players)
			{
				int numberOfColonies = p.Hexes.Count (h => h.HasColony);
				var te = new TaxationEvent () {
					GoldPerColony = 1
				};
				p.HandleCardEvents (te);
				p.Gold += numberOfColonies * te.GoldPerColony;
				game.Log ("{0} received {1} gold from {2} {3}", p.Name, numberOfColonies * te.GoldPerColony, 
				          numberOfColonies, numberOfColonies == 1 ? "colony" : "colonies");
			}
		}

		private void ExtendTradeTime (Game game)
		{
			game.TradeEnd = DateTime.Now;
			game.TradeEnd.AddSeconds (game.TradeDurationInSeconds > 0 ? game.TradeDurationInSeconds : 
				Config.DefaultTradeDurationSeconds);
		}

		public void StartTradingPhase (Game game)
		{
			game.Status = GameState.Trading;
			ExtendTradeTime (game);

			// Ensure that trade deck is shuffled and in a healthy state.
			game.SetupTradeDeck ();

			// For each player and distribute trade cards, starting with players with the fewest number of colonies.
			foreach (var player in from p in game.Players orderby p.Hexes.Count(h => h.HasColony) select p) {
				int colonyCount = player.Hexes.Count (h => h.HasColony);
				for (int level = 0; level < colonyCount && level < game.TradeCards.Count; ++level) {
					// Continue on to next trade card level if all the trade cards at this level have run out.
					if (game.TradeCards [level].Count == 0)
						continue;
					// Move the trade card from the game trade cards pile to the player pile.
					var ti = new TradeCardInfo () {
						Card = game.TradeCards [level] [0]
					};
					player.TradeCards.Add (ti);
					game.TradeCards [level].RemoveAt (0);
				}
			}

			// If there are not two players with at least 3 cards, end trading.
			if (game.Players.Count (p => p.TradeCards.Count >= 3) < 2) {
				EndTradingPhase (game);
			}
		}

		public void EndTradingPhase (Game game)
		{
			HandleTaxation (game);
			ResolveCalamities (game);
			HandleStarvation (game);

			// Sort players in order of smallest population - colonies count for 5.
			game.Players = new List<PlayerGame>(game.Players.OrderBy(p => p.Hexes.Sum(h => h.HasColony ? 5 : h.CurrentPopulation)));

			// Remove all offers and matches.
			game.Trades.Clear ();
			game.Matches.Clear ();
			foreach (var player in game.Players) {
				player.ProposedMatches.Clear ();
				player.ReceivedMatches.Clear ();
				player.DoneTrading = false;
			}

			game.Status = GameState.Running;
			NewTurn (game, false);
		}

		public void ResolveCalamities (Game game)
		{
			// Remove calamity cards from player's trade cards.
			var calamities = new List<CalamityArgs>();
			foreach (var p in game.Players) {
				p.TradeCards.RemoveAll ( tradeCard => {
					var card = cards[tradeCard.Card];
					if (card == null) {
						return true;
					}
					if (card.Calamity != null) {
						var calamityArgs = new CalamityArgs () {
							Card = card,
							PrimaryPlayer = p,
							SecondaryPlayer = game.GetPlayer (tradeCard.FromPlayerKey)
						};
						calamities.Add (calamityArgs);
						return true;
					}
					return false;
				});
			}

			// Resolve calamities in order of trade level.
			foreach (var args in calamities.OrderBy (c => c.Card.TradeLevel)) {
				if (args.Card.TradeLevel < 1) {
					Console.WriteLine ("Card {0} has bad trade level {1}", args.Card.Name, args.Card.TradeLevel);
					continue;
				}
				ScriptManager.Manager.ExecuteCalamity (game, args.Card, args.PrimaryPlayer, args.SecondaryPlayer);
				game.TradeCards[args.Card.TradeLevel-1].Add (args.Card.Name);
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
			game.Log ("{0} played {1}.", player.Name, cardKey);
			var error = ScriptManager.Manager.ExecuteCardAction (game, card, cardArgs);
			if (error != null) {
				throw new InvalidOperationException (error);
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
			if (player.Hand.Count == 0)
				game.CurrentTurn.Actions = 0;
			else
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

			var purchaseEvent = new PurchaseEvent () {
				Card = card,
				Cost = card.Cost
			};
			player.HandleCardEvents (purchaseEvent);
			var cost = purchaseEvent.Cost;

			if (cost > game.CurrentPlayer.Gold) {
				throw new InvalidOperationException ("Not enough gold to purchase card");
			}

			if (game.Bank[cardKey] <= 0) {
				throw new InvalidOperationException ("The bank does not have this card.");
			}

			if (card.Type == CardType.Technology && player.TechnologyCards.Contains(cardKey)) {
				throw new InvalidOperationException ("You already have this technology card.");
			}

			if (card.Requires != null && card.Requires.Except(player.AllCards).Take (1).Count () > 0)
			{
				throw new InvalidOperationException ("Purchasing card requires " + string.Join (", ", card.Requires));
			}

			if (card.Excludes != null && card.Excludes.Intersect(player.AllCards).Take (1).Count () > 0)
			{
				throw new InvalidOperationException ("Cannot purchase card due to exclusions:" + string.Join (", ", card.Excludes));
			}

			game.CurrentPlayer.Gold -= cost;

			if (card.Type == CardType.Nation) {
				// Add card to hand.
				player.Discards.Push (cardKey);
			} else { // Technology card.
				player.TechnologyCards.Add (cardKey);
			}

			// Remove from bank.
			game.Bank[cardKey]--;

			game.Log ("{0} bought {1}.", player.Name, cardKey);

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
			Save (game);
			foreach (var p in game.Players) {
				PlayerSocketServer.Instance.Send (new OfferView (game, p, offer), "newOffer", p); 
			}

			return false;
		}

		public bool SuggestMatch (Game game, PlayerGame player, Offer myOffer, PlayerGame otherPlayer, Offer otherOffer)
		{
			if (game.Status != GameState.Trading)
			{
				throw new InvalidOperationException ("Cannot suggest matches because the game is not in a trading phase!");
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
			game.Matches.Add (match);
			Save (game);

			foreach (var p in game.Players) {
				PlayerSocketServer.Instance.Send (new MatchView (p, match), "newMatch", p);
			}

			return false;
		}

		public bool AcceptMatch (Game game, PlayerGame player, Match match)
		{
			if (game.Status != GameState.Trading)
			{
				throw new InvalidOperationException ("Cannot accept matches because the game is not in a trading phase!");
			}

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
				firstPlayer.GiveTradeCard(player, card);
			}

			foreach (string card in match.Offer2.Cards)
			{
				player.GiveTradeCard(firstPlayer, card);
			}

			game.Matches.RemoveAll (m => m.MatchId == match.MatchId);
			game.Trades.RemoveAll (o => o.Id == match.Offer1.Id || o.Id == match.Offer2.Id);

			ExtendTradeTime (game);

			// Remove match will also trigger a save.
			RemoveMatch (game, match, firstPlayer, player, false);

			return true;
		}

		void RemoveMatch (Game game, Match match, PlayerGame firstPlayer, PlayerGame secondPlayer, bool sendUpdates)
		{
			firstPlayer.ProposedMatches.RemoveAll (m => m.MatchId == match.MatchId);
			secondPlayer.ReceivedMatches.RemoveAll (m => m.MatchId == match.MatchId);
			game.Matches.RemoveAll (m => m.MatchId == match.MatchId);

			if (sendUpdates)
			{
				Save (game);
				PlayerSocketServer.Instance.Send (match.MatchId, "removeMatch", game);
			}
		}

		public bool CancelMatch (Game game, PlayerGame player, Match match)
		{
			if (game.Status != GameState.Trading)
			{
				throw new InvalidOperationException ("Cannot cancel matches because the game is not in a trading phase!");
			}

			var firstPlayer = game.GetPlayer (match.Offer1.PlayerKey);
			var secondPlayer = game.GetPlayer (match.Offer2.PlayerKey);

			if (player.PlayerKey != firstPlayer.PlayerKey && player.PlayerKey != secondPlayer.PlayerKey) {
				throw new InvalidOperationException ("Cannot cancel a match that isn't yours.");
			}
			RemoveMatch (game, match, firstPlayer, secondPlayer, true);
			return false;
		}

		public bool DoneTrading (Game game, PlayerGame player)
		{
			if (game.Status != GameState.Trading) {
				throw new InvalidOperationException ("Cannot mark trading done if not in trade phase");
			}
			
			player.DoneTrading = true;
			// If there is only 1 or fewer people not done trading, end the trading phase.
			if (game.Players.Count(p => !p.DoneTrading) <= 1) {
				EndTradingPhase (game);
			}
			return true;
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

			foreach (string card in cards) {
				if (card != currentCard) {
					if (currentCard != null) {
						RedeemSet (game, player, currentCard, count);
					}
					count = 1;
					currentCard = card;
				} else {
					count++;
				}
				player.RemoveTradeCard (card, true);
			}

			// Flush the last set.
			if (count > 0) {
				RedeemSet (game, player, currentCard, count);
			}

			return true;
		}

		void RedeemSet (Game game, PlayerGame player, string currentCard, int count)
		{
			var cardObject = this.cards [currentCard];
			var modifyTradeSet = new ModifyTradeSetEvent () {
				Size = count,
				Good = currentCard,
				Position = game.CurrentTurn.TradeSetsRedeemed
			};
			player.HandleCardEvents (modifyTradeSet);
			count = modifyTradeSet.Size;
			var gold = cardObject.TradeLevel * count * count;
			player.Gold += gold;
			game.CurrentTurn.TradeSetsRedeemed++;
			game.Log ("{0} redeemed {1} {2} for {3} gold.", player.Name, count, currentCard, gold);
		}
	}

	public class CalamityArgs
	{
		public Card Card {get; set;}
		public PlayerGame PrimaryPlayer {get; set;}
		public PlayerGame SecondaryPlayer {get; set;}
	}
}