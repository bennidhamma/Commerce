using System;
using System.Linq;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class TradeView
	{
		public long Id { get; set; }
		public GameState Status { get; set; }
		public List<string> TechnologyCards { get; set; }
		public IEnumerable<string> TradeCards { get; set; }
		public IEnumerable<OfferView> MyOffers { get; set; }
		public IEnumerable<OfferView> OtherOffers { get; set; }
		public IEnumerable<MatchView> Matches { get; set; }
		public DateTime TradeEnd { get; set; } 
 		public IEnumerable<KeyValuePair<string, int>> TradeCardCounts { get; set; } 
		public int Gold { get; set; }

		public TradeView (Game game, PlayerGame player)
		{
			var cards = GameRunner.Instance.Cards;
			this.Id = game.Id;
			this.Status = game.Status;
			this.Gold = player.Gold;
			this.TechnologyCards = player.TechnologyCards;
			this.TradeCards = from c in player.TradeCards where cards[c.Card] != null orderby cards[c.Card].TradeLevel, c.Card select c.Card;
			this.TradeCardCounts = from p in game.Players select new KeyValuePair<string, int> (p.PlayerKey, p.TradeCards.Count);
			this.MyOffers = from o in game.Trades where o.PlayerKey == player.PlayerKey select new OfferView (game, player, o);
			this.OtherOffers = from o in game.Trades where o.PlayerKey != player.PlayerKey select new OfferView (game, player, o);
			this.Matches = from m in game.Matches select new MatchView (player, m);
			this.TradeEnd = game.TradeEnd;
		}
	}
}
