using System;
using System.Linq;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class TradeView
	{
		public long Id {
			get;
			set;
		}

		public GameState Status {
			get;
			set;
		}

		public List<string> TradeCards {
			get;
			set;
		}

		public IEnumerable<OfferView> Trades {
			get;
			set;
		}

		public IEnumerable<MatchView> Matches {
			get;
			set;
		}

		public DateTime TradeEnd {
			get;
			set;
		}

		public IEnumerable<KeyValuePair<string, int>> TradeCardCounts {
			get;
			set;
		}

		public int Gold {
			get;
			set;
		}

		public TradeView (Game game, PlayerGame player)
		{
			this.Id = game.Id;
			this.Status = game.Status;
			this.Gold = player.Gold;
			this.TradeCards = player.TradeCards;
			this.TradeCardCounts = from p in game.Players select new KeyValuePair<string, int> (p.PlayerKey, p.TradeCards.Count);
			this.Trades = from o in game.Trades select new OfferView (game, o);
			this.Matches = from m in game.Matches select new MatchView (m);
			this.TradeEnd = game.TradeEnd;
		}
	}
}