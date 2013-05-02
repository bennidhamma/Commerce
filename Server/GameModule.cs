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
		public GameModule () {
			Get["/"] = p => "Hello World!";
			Get["/player"] = p => new Player() {
				Name = "Ben",
				Email = "foo"
			};
			Post["/player"] = parameters => {
				var p2 = this.Bind<Player> ();
				return p2;
			};
		}
	}
}

