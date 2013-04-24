using System;
using System.Collections.Generic;
using System.Reflection;

namespace ForgottenArts.Commerce
{
	public class CardCatalog
	{
		private Dictionary<string, Card> cards = new Dictionary<string, Card> ();

		public CardCatalog ()
		{
		}

		public void LoadCards (string directory)
		{
			var cardType = typeof(Card);
			Config.YamlDirectoryOperator ("cards", delegate(dynamic cardObject) {
				var card = new Card();
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
	}
}

