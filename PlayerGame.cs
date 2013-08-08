using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Linq;

namespace ForgottenArts.Commerce
{

	public class PlayerGame
	{
		public static string[] Colors = new string[] {"Blue", "Red", "Green", "Yellow", "White", "Black", "Orange", "Purple"};

		int handSize = 5;
		public int HandSize {
			get {
				return handSize;
			}
			set {
				handSize = value;
			}
		}
		public int GetHandSize () {
			var p = new Property () {
				Player = this,
				Source = this,
				Key = "player.hand_size",
				Value = handSize
			};
			HandleCardEvents (p);
			return (int)p.Value;
		}

		public string PlayerKey {get; set;}
		public string Name {get {
				return Player.DisplayName;
			}
		}
		public string Color {get; set;}
		public long GameId {get; set;}
		public int Score {get; set;}
		public int Gold {get; set;}

		public Stack<string> Deck {get; set;}
		public List<string> Hand {get; set;}
		public Stack<string> Discards {get; set;}

		public List<TradeCardInfo> TradeCards {get; set;}
		public List<string> TechnologyCards {get; set;}

		public List<Match> ProposedMatches {get; set; }
		public List<Match> ReceivedMatches {get; set; }
		public bool DoneTrading { get; set; }

		List<Hex> hexes;
		public List<Hex> Hexes {
			get {
				return hexes;
			}
			set {
				if (value != null)
				{
					foreach (var hex in value) {
						hex.Player = this;
					}
				}
				hexes = value;
			}
		}

		public int NumberOfColonies {
			get {
				return Hexes.Count (h => h.HasColony);
			}
		}

		public PlayerGame () {
			Deck = new Stack<string> ();
			TradeCards = new List<TradeCardInfo> ();
			TechnologyCards = new List<string> ();
			Hand = new List<string> ();
			Discards = new Stack<string> ();
			Hexes = new List<Hex> ();
			ProposedMatches = new List<Match> ();
			ReceivedMatches = new List<Match> ();
		}

		[IgnoreDataMember]
		public IEnumerable<string> AllCards {
			get {
				foreach (var card in Deck) {
					yield return card;
				}
				foreach (var card in Hand) {
					yield return card;
				}
				foreach (var card in Discards) {
					yield return card;
				}
				foreach (var card in TradeCards) {
					yield return card.Card;
				}
				foreach (var card in TechnologyCards) {
					yield return card;
				}
			}
		}

		public void HandleCardEvents (object cardEvent)
		{
			var type = cardEvent.GetType().Name;
			HandleCardEvents (type, cardEvent);
		}

		public void HandleCardEvents (string type, object cardEvent)
		{
			// Only nation cards held in hand and technology cards can respond to events.
			foreach (var key in Hand.Union (TechnologyCards)) {
				var card = GameRunner.Instance.Cards[key];
				if (card == null)
					continue;
				if (card.Event != null) {
					ScriptManager.Manager.ExecuteCardEvent (this.Game, card, this, type, cardEvent);
				}
			}
		}

		public bool AddHex (int populationLimit, int currentPopulation = 0)
		{
			if (Hexes.Count >= Config.MaxNumberOfHexes) {
				Console.WriteLine ("Too many hexes.");
				return false;
			}
			var hex = new Hex () {
				Id = GameRunner.Instance.Repository.NewId (),
				PopulationLimit = populationLimit,
				CurrentPopulation = currentPopulation,
				HasColony = false,
				Player = this
			};
			return AddHex (hex);
		}

		public bool AddHex (Hex hex)
		{
			if (Hexes.Count >= Config.MaxNumberOfHexes) {
				Console.WriteLine ("Too many hexes.");
				return false;
			}
			this.Hexes.Add (hex);
			return true;
		}

		public bool Defends () 
		{
			//TODO: scan cards in hand, looking for card with defensive actoion
			// and call it!
			return false;
		}

		public void DrawHand () {
			Draw (GetHandSize() - Hand.Count);
		}

		public void Draw (int number)
		{
			for (int i = 0; i < number; i++) {
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

		public void Discard (int number)
		{
			while (Hand.Count > 0 && number-- > 0) {
				Discards.Push (Hand[0]);
				Hand.RemoveAt(0);
			}
		}

		public void DiscardTo (int number)
		{
			Discard (Hand.Count - number);
		}

		public void GainTradeCard (int count = 1)
		{
			var game = this.game;
			var cardKeys = (from l in game.TradeCards from c in l select c).ToList().Shuffle().Take(count);
			foreach (var cardKey in cardKeys) {
				var card = GameRunner.Instance.Cards[cardKey];
				game.TradeCards[card.TradeLevel-1].Remove(cardKey);
				var ti = new TradeCardInfo () {
					Card = cardKey
				};
				TradeCards.Add (ti);
			}

		}

		public bool HasTradeCards (List<string> cards)
		{
			// There's probably a more optimal way to do this.
			var tradeCards = new List<string>(from c in TradeCards select c.Card);
			foreach (string card in cards) {
				if (!tradeCards.Contains(card)) {
					return false;
				}
				tradeCards.Remove(card);
			}
			return true;
		}

		public bool HasTradeCards (Dictionary<string, int> cards)
		{
			foreach (var kvp in cards) {
				var count = (from c in TradeCards where c.Card == kvp.Key select c).Count ();
				if (count < kvp.Value)
					return false;
			}
			return true;
		}

		public bool RemoveTradeCard (string card, bool returnToStore)
		{
			var index = TradeCards.FindIndex (t => t.Card == card);
			if (index >= 0) 
				TradeCards.RemoveAt (index);
			else
				return false;

			if (returnToStore) {
				var cardObject = GameRunner.Instance.Cards[card];
				// return the trade card back to the appropriate trade level pile.
				game.TradeCards[cardObject.TradeLevel-1].Add(card);
			}
			return true;
		}

		public bool GiveTradeCard(PlayerGame player, string card)
		{
			if (!RemoveTradeCard (card, false))
				return false;
			var ti = new TradeCardInfo () {
				Card = card,
				FromPlayerKey = this.PlayerKey
			};
			player.TradeCards.Add (ti);
			return true;
		}

		public void ReceiveMatch (Match match)
		{
			this.ReceivedMatches.Add (match);
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

		public void Send (object message, string channel)
		{
			PlayerSocketServer.Instance.Send (message, channel, this);
		}

		public override string ToString ()
		{
			if (Player != null) {
				return Player.ToString();
			}
			else {
				return "Unkown Player";
			}
		}

		public string GetKey ()
		{
			return (GameId + "-" + PlayerKey);
		}

		public static string MakeKey (long gameId, string playerKey)
		{
			return gameId + "-" + playerKey;
		}

		public int ReduceColonies (int number, string reason)
		{
			int reduced = 0;
			number = Math.Min (number, this.Hexes.Count (h => h.HasColony));
			foreach (var hex in this.Hexes) {
				if (hex.HasColony) {
					hex.HasColony = false;
					hex.CurrentPopulation = hex.PopulationLimit;
					reduced++;
					if (--number <= 0) {
						break;
					}
				}
			}
			this.Game.Log ("{0} lost {1} colonies due to {2}.", this.Player.DisplayName, number, reason);
			return reduced;
		}

		public void RemovePopulation (int amountToRemove, string reason)
		{
			if (amountToRemove <= 0)
				return;
			int currentTotal = this.Hexes.Sum (h => h.CurrentPopulation);

			// If the player does not have enough free population to remove, reduce cities.
			// Each city reduced counts for 4 population.
			int excess = amountToRemove - currentTotal;
			if (excess > 0) {
				// TODO: remove magic number.
				int numberOfColoniesToRemove = (excess / 4) + 1;
				int coloniesReduced = ReduceColonies (numberOfColoniesToRemove, reason);
				amountToRemove -= coloniesReduced * 4;
			}

			// You can only remove as many people as there are.
			amountToRemove = Math.Min (amountToRemove, currentTotal);
			int populationRemoved = amountToRemove;

			// Now remove, round robin, one from each hex with a population until
			while (amountToRemove > 0) {
				foreach (var hex in from h in Hexes where h.CurrentPopulation > 0 select h) {
					hex.CurrentPopulation--;
					if (amountToRemove-- <= 0) {
						break;
					}
				}
			}

			this.Game.Log ("{0} of {1}'s colonists died due to {2}.", populationRemoved, this.Player.DisplayName, reason);
		}
	}

	public class TradeCardInfo {
		public string Card {get; set;}
		public string FromPlayerKey {get; set;}
	}
}