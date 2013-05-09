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
			return GetKey (PlusId);
		}

		public static string GetKey (string plusId)
		{
			return "player-plus-" + plusId; 
		}

		public static Player GetOrCreate (string id)
		{
			var player = GameRunner.Instance.Repository.Get<Player> (GetKey (id));
			if (player == null)
			{
				player = new Player () {
					PlusId = id
				};
			}
			return player;
		}
	}
}