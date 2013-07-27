using System;

namespace ForgottenArts.Commerce
{
	public class Turn
	{
		public int Count {get; set;}
		public string PlayerKey { get; set; }
		public int Actions {get; set;}
		public int Buys {get; set;}

		// Current Card is useful for defensive scripts to know if they can 
		// deflect an attack.
		public string CurrentCard {get; set;}

		//TODO: some sort of listing of cards that are active for this turn?
		public Turn ()
		{
		}

		// Statistics.
		public int TradeSetsRedeemed {
			get;
			set;
		}
	}
}

