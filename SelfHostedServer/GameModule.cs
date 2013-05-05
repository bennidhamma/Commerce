using System;
using Nancy;
using Nancy.ModelBinding;

namespace ForgottenArts.Commerce
{
	/* Operations we care about:
	 *  - associate a g+ user to a Player oject: PUT G+ DTO return Player DTO (for now, just put players).
	 *  - start hosting a new game - POST Game DTO return Game DTO (w/ Id or something set) - inc. players
	 */

	public class GameModule : Nancy.NancyModule	
	{
		private IRepository repository;

		void SetupDependencies ()
		{
			repository = GameRunner.Instance.Repository = new RedisRepository ();
		}

		public GameModule () : base ("/api") {
			SetupDependencies();
			Options["/player/auth"] = p => {
				return new Response ()
				.WithHeader ("Access-Control-Allow-Origin", "*")
				.WithHeader ("Access-Control-Allow-Headers", "Content-Type")
				.WithHeader ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
			};
			Get["/"] = p => "Hello World!";
			Put["/player"] = p => new Player() {
				DisplayName = "Ben"
			};
			Put["/player/auth"] = parameters => {
				var p2 = this.Bind<Player> ();
				repository.Put (p2.GetKey(), p2);
				//TODO: return games.
				return p2;
			};
		}
	}
}

