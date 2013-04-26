using System;
using System.Collections.Generic;
using System.Reflection;

namespace ForgottenArts.Commerce
{
	public class CardCatalog : IEnumerable<Card>
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

		public void PlayCard (PlayerGame player, string cardKey)
		{
			var game = player.Game;
			var card = cards[cardKey];
			game.CurrentTurn.CurrentCard = cardKey;
			ScriptManager.Manager.ExecuteCardEffect (player.Game, card);
			player.Hand.Add (cardKey);
			game.CurrentTurn.CurrentCard = null;
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

