using System;
using System.Collections.Generic;
using System.Reflection;
using System.IO;

namespace ForgottenArts.Commerce
{
	public class CardCatalog : IEnumerable<Card>
	{
		private Dictionary<string, Card> cards = new Dictionary<string, Card> ();

		private List<Dictionary<string,int>> tradingCardLevels = new List<Dictionary<string, int>> ();
		private Dictionary<string, int> startingDeck = new Dictionary<string, int> ();
		private Dictionary<string, int> startingBank = new Dictionary<string, int> ();

		public int NumberOfTradeLevels { get { return tradingCardLevels.Count; } }

		public Dictionary<string, int> StartingDeck {
			get {
				return startingDeck;
			}
			set {
				startingDeck = value;
			}
		}

		public Dictionary<string, int> StartingBank {
			get {
				return startingBank;
			}
			set {
				startingBank = value;
			}
		}

		public CardCatalog ()
		{
		}

		public void Load () {
			LoadCards ("cards/nation", CardType.Nation);
			LoadCards ("cards/technology", CardType.Technology);
			LoadCards ("cards/trade", CardType.Trade);
			SetupGameInfo ("card-distribution.yaml");
		}

		public Card this [string cardKey] {
			get {
				return cards[cardKey];
			}
			set {
				cards[cardKey] = value;
			}
		}

		public void LoadCards (string directory, CardType typeOfCard)
		{
			var cardType = typeof(Card);
			Config.YamlDirectoryOperator (directory, delegate(dynamic cardObject) {
				var card = new Card() {
					Type = typeOfCard
				};
				foreach (string key in cardObject.Keys) {
					try {
						var prop = cardType.GetProperty (key);
						prop.SetValue (card, Convert.ChangeType(cardObject[key], prop.PropertyType), null);
					}
					catch {
						Console.WriteLine ("Unable to parse property " + key);
					}
				}
				cards[card.Name] = card;
			});
		}

		public void SetupGameInfo (string source)
		{
			Config.LoadYamlFile (Path.Combine(Config.ContentDirectory, source), UpdateGameInfo);
		}

		public void UpdateGameInfo (dynamic gameInfo)
		{
			// Set up a clean collection of trade card levels to swap in.
			var newTradingCardLevels = new List<Dictionary<string, int>>();
			foreach (dynamic level in gameInfo.TradingCards) {
				var dict = new Dictionary<string, int> ();
				foreach (string key in level.Keys) {
					int q = Convert.ToInt32 (level[key]);
					dict[key] = q;
				}
				newTradingCardLevels.Add(dict);
			}
			tradingCardLevels = newTradingCardLevels;

			// Set up a clean collection of starting cards to swap in.
			var startDeck = new Dictionary<string, int> ();
			foreach (string key in gameInfo.StartingDeck.Keys) {
				startDeck[key] = Convert.ToInt32(gameInfo.StartingDeck[key]);
			}
			startingDeck = startDeck;

			// Set up a clean start bank.
			var startBank = new Dictionary<string, int> ();
			foreach (string key in gameInfo.StartingBank.Keys) {
				startBank[key] = Convert.ToInt32(gameInfo.StartingBank[key]);
			}
			startingBank = startBank;
		}

		public Dictionary<string, int> GetTradeCardLevel (int level) {
			return tradingCardLevels[level];
		}

		#region IEnumerable implementation

		public IEnumerator<Card> GetEnumerator ()
		{
			foreach (Card card in cards.Values)
				yield return card;
		}

		#endregion

		#region IEnumerable implementation

		System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator ()
		{
			foreach (Card card in cards.Values)
				yield return card;
		}

		#endregion
	}
}

