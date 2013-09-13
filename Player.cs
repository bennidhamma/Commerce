using System;
using System.Collections.Generic;

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
		public string RegistrationId {get; set;}

		public IList<long> GetPlayerGames ()
		{
			return GameRunner.Instance.Repository.GetList<long> ("player-games-" + PlusId);
		}

		public string GetKey ()
		{
			return GetKey (PlusId);
		}

		public override string ToString ()
		{
			return string.Format ("{0}, {1} {2}", PlusId, FirstName, LastName);
		}

		public void FetchData () 
		{
			var rc = new RestClient("https://www.googleapis.com/plus/v1/");
			var key = Config.GoogleApiKey;
			try {
				dynamic person = rc.Get ("people/" + PlusId + "?key=" + key);
				this.Photo = person.image.url;
				this.FirstName = person.name.givenName;
				this.LastName = person.name.familyName;
				this.DisplayName = person.displayName;
				GameRunner.Instance.Repository.Put<Player>(GetKey(), this);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error fetching data: " + e.Message);
			}
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
			if (player.DisplayName == null) {
				player.FetchData ();
			}
			return player;
		}

		public static Player MergeOrCreate (string playerId, Player update)
		{
			var originalPlayer = GetOrCreate (playerId);
			originalPlayer.Photo = update.Photo;
			originalPlayer.Gender = update.Gender;
			originalPlayer.FirstName = update.FirstName;
			originalPlayer.LastName = update.LastName;
			originalPlayer.DisplayName = update.DisplayName;

			return originalPlayer;
		}
	}
}
