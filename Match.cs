using System;

namespace ForgottenArts.Commerce
{
	public class Match
	{
		// Player Key of the proposing player.
		public string MatchProposer {get; set;}
		// Proposing player's offer id.
		public long ProposerOfferId {get; set;}
		// Player key of the receiving player.
		public string MatchReceiver {get; set;}
		// Recevin player's offer id.
		public long ReceiverOfferId {get; set;}
	}
}

