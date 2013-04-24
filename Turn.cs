using System;

namespace ForgottenArts.Commerce
{
	public class Turn
	{
		public int Count {get; set;}
		public PlayerGame Player {get; set;}
		public int ActionsRemaining {get; set;}
		public int BuysRemaining {get; set;}
		public int Gold {get; set;}

		//TODO: some sort of listing of cards that are active for this turn?
		public Turn ()
		{
		}
	}
}

