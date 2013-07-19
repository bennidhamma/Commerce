using System;

namespace ForgottenArts.Commerce.Server
{
	public class MatchView
	{
		public long Id {get ;set;}

		public long Offer1Id {
			get;
			set;
		}

		public long Offer2Id {
			get;
			set;
		}

		public bool CanCancel {get; set;}
		public bool CanAccept {get; set;}

		public MatchView (PlayerGame player, Match match)
		{
			this.Id = match.MatchId;
			this.Offer1Id = match.Offer1.Id;
			this.Offer2Id = match.Offer2.Id;

			if (match.Offer1.PlayerKey == player.PlayerKey) {
				this.CanCancel = true;
			} else if (match.Offer2.PlayerKey == player.PlayerKey) {
				this.CanCancel = true;
				this.CanAccept = true;
			}
		}
	}
}

