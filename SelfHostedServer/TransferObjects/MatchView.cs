using System;

namespace ForgottenArts.Commerce.Server
{
	public class MatchView
	{
		public long Offer1Id {
			get;
			set;
		}

		public long Offer2Id {
			get;
			set;
		}

		public MatchView (Match match)
		{
			this.Offer1Id = match.Offer1.Id;
			this.Offer2Id = match.Offer2.Id;
		}
	}
}

