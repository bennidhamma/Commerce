using System;

namespace ForgottenArts.Commerce
{
	public class Match
	{
		public long MatchId {get; set;}
		public long GameId {get; set;}
		public Offer Offer1 {get; set;}
		public Offer Offer2 {get; set;}
	}
}

