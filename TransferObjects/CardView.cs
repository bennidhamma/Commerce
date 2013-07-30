using System;
using System.Linq;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class CardView
	{
		public CardType Type {get; set;}
		public string Category {get; set;}
		public string Name {get; set;}
		public string ImageUrl {get; set;}
		public string Description {get; set;}
		public bool NeedsHex {get; set;}
		public int Cost {get; set;}
		public List<string> Requires {get; set;}
		public List<int> TradeValues {get; set;}
		public int TradeLevel {get; set;}

		public CardView (Card card)
		{
			if (card == null) {
				return;
			}
			this.Type = card.Type;
			this.Category = card.Category;
			this.Name = card.Name;
			this.Description = card.Description;
			this.ImageUrl = card.ImageUrl;
			this.NeedsHex = card.NeedsHex;
			this.Cost = card.Cost;
			this.Requires = card.Requires;
			this.TradeLevel = card.TradeLevel;
			this.TradeValues = card.TradeValues;
		}
	}

}
