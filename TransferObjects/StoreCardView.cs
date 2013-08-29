using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class StoreCardView
	{
		public string Card { get; set; }
		public int Quantity { get; set; }
		public bool CanBuy { get; set; }

		public StoreCardView (Game game, PlayerGame player, KeyValuePair<string,int> kvp)
		{
			this.Card = kvp.Key;
			this.Quantity = kvp.Value;

			int cost;
			this.CanBuy = GameRunner.Instance.CanBuy (game, player, kvp.Key, out cost) == null;
		}
	}
}

