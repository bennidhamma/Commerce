using System;
using System.Collections.Generic;
using System.Reflection;

namespace ForgottenArts.Commerce
{
	public class CardCatalog : IEnumerable<Card>
	{
		private Dictionary<string, Card> cards = new Dictionary<string, Card> ();

		private List<Dictionary<string,int>> tradingCardLevels = new List<Dictionary<string, int>> ();

		public CardCatalog ()
		{
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
				foreach (var key in cardObject.Keys) {
					switch (key as string) {
					case "Cost":
						foreach (var cost in cardObject.Cost) {
							card.Cost[cost.Key] = Convert.ToInt32(cost.Value);
						}
						break;
					default:
						var prop = cardType.GetProperty (key);
						prop.SetValue (card, Convert.ChangeType(cardObject[key], prop.PropertyType), null);
						break;
					}
				}
				cards[card.Name] = card;
			});
		}

		public void SetupTradingCardLevels (string source)
		{
			Config.LoadYamlFile (source, UpdateTradingCardLevels);
		}

		public void UpdateTradingCardLevels (dynamic gameInfo)
		{
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

