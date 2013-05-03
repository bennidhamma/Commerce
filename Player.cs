using System;

namespace ForgottenArts.Commerce
{
	public class Player
	{
		public string PlusId {get; set;}
		public string Photo {get; set;}
		public string Gender {get; set;}
		public string FirstName {get; set;}
		public string LastName {get; set;}
		public string DisplayName {get; set;}

		public string GetKey ()
		{
			return "player-plus-" + PlusId;
		}
	}
}