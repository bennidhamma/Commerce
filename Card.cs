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
		public string Category {get; set;}
		public string Name {get; set;}
		public string ImageUrl {get; set;}
		public string Description {get; set;}
		public bool NeedsHex {get; set;}
		public int Cost {get; set;}

		// List of required cards in order to purchase.
		public List<string> Requires {get; set;}

		// List of cards that cannot be owned when purchasing:
		public List<string> Excludes {get; set;}

		// Action applies to Nation cards.
		public string Action {get; set;}
		// Event applies to Nation and Technology cards.
		public string Event {get; set;}

		// These apply to Trade cards.
		public string Calamity {get; set;}
		public List<int> TradeValues {get; set;}
		public int TradeLevel {get; set;}
	}

	// Card Events:
	public class ModifyTradeSetEvent 
	{
		public string Good {get; set;}

		// The position this trade set is for this player's turn.
		public int Position { get; set; }

		// The size of the trade set.
		public int Size {get; set;}

		public override string ToString ()
		{
			return string.Format ("[ModifyTradeSetEvent: Good={0}, Position={1}, Size={2}]", Good, Position, Size);
		}	
	}

	public class PurchaseEvent {
		public Card Card {get; set;}
		public int Cost {get; set;}
	}

	public class TaxationEvent {
		public int GoldPerColony {get ;set;}
	}

	public class TurnEvent {

	}

	public class Property {
		public PlayerGame Player {get; set;}
		public object Source {get; set;}
		public string Key {get; set;}
		public object Value {get; set;}
	}
}