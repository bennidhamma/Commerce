using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public enum CardType {
		Nation,
		Technology,
		Trade
	}

	public class Card
	{
		public CardType Type {get; set;}
		public string Name {get; set;}
		public string ImageUrl {get; set;}
		public string Description {get; set;}
		public bool HasAttack {get; set;}
		public bool NeedsHex {get; set;}
		public Dictionary<string,int> Cost {get; set;}

		// Action applies to Nation cards.
		public string Action {get; set;}

		// These apply to either nation or technology cards.
		public string ModifyPurchaseCost {get; set;}
		public string ModifyAttack {get; set;}
		public string ModifyDiscovery {get; set;}

		// These apply to Trade cards.
		public int TradeLevel {get; set;}
		public string CalamityEffect {get; set;}

		public Card ()
		{
			Cost = new Dictionary<string, int> ();
		}
	}
}

