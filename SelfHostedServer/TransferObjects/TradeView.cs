using System;
using System.Linq;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class TradeView
	{
		public List<string> TradeCards {
			get;
			set;
		}

		public List<Offer> Trades {
			get;
			set;
		}

		public List<Match> Matches {
			get;
			set;
		}

		public DateTime TradeEnd {
			get;
			set;
		}

		public int Duration {
			get;
			set;
		}

		public IEnumerable<Tuple<string, int>> TradeCardCounts {
			get;
			set;
		}

		public TradeView (Game game, PlayerGame player)
		{
			this.TradeCards = player.TradeCards;
			this.TradeCardCounts = from p in game.Players select new Tuple<string, int> (p.PlayerKey, p.TradeCards.Count);
			this.Trades = game.Trades;
			this.Matches = game.Matches;
			this.TradeEnd = game.TradeEnd;
		}
	}
}

