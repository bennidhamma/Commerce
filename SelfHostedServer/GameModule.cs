using System;
using Nancy;
using Nancy.ModelBinding;
using System.Collections.Generic;

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
			After += ctx => ctx.Response.WithHeader("Access-Control-Allow-Origin", "*");
			Options["/{path*}"] = CrossOriginSetup;
			Put["/player/auth"] = AuthenticatePlayer;
			Post["/game"] = CreateGame;
		}

		public dynamic CrossOriginSetup (dynamic parameters)
		{
			return new Response ()
				.WithHeader ("Access-Control-Allow-Origin", "*")
				.WithHeader ("Access-Control-Allow-Headers", "Content-Type")
				.WithHeader ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		}

		public dynamic AuthenticatePlayer (dynamic parameters)
		{
			var p2 = this.Bind<Player> ();
			repository.Put (p2.GetKey(), p2);
			//TODO: return games.
			return p2;
		}

		class NewGameInfo {
			public string[] Players {get; set;}
		}

		public dynamic CreateGame (dynamic parameters)
		{
			var g = this.Bind<NewGameInfo>();
			var game = new Game () {
				Id = repository.NewId()
			};
			
			foreach (string p in g.Players) {
				var player = Player.GetOrCreate(p);
				var playerGame = new PlayerGame () {
					Player = player,
					Game = game
				};
				game.Players.Add (playerGame);
			}

			repository.Put (game.GetKey(), game);

			return new {GameId = game.Id};
		}
	}
}

