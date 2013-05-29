using System;
using System.Linq;
using Nancy;
using Nancy.ModelBinding;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
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
			Get["/player/{id}/games"] = GetGames;
			Get["/game/{id}"] = GetGame;
			Get["/game/{id}/cards"] = GetGameCards;
		}

		public dynamic CrossOriginSetup (dynamic parameters)
		{
			return new Response ()
				.WithHeader ("Access-Control-Allow-Origin", "*")
				.WithHeader ("Access-Control-Allow-Headers", "Content-Type")
				.WithHeader ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		}

		public dynamic GetGameCards (dynamic arg)
		{
			var game = repository.Get<Game>(Game.GetKey(arg.id));
			if (game == null) {
				throw new Exception ("Couldn't find game.");
			}
			var cardKeys = new HashSet<string> ();
			foreach (var card in game.Bank.Keys) {
				cardKeys.Add (card);
			}
			foreach (var player in game.Players) {
				foreach (var card in player.AllCards) {
					cardKeys.Add (card);
				}
			}
			return from key in cardKeys select GameRunner.Instance.Cards[key];
		}

		public dynamic AuthenticatePlayer (dynamic parameters)
		{
			var p2 = this.Bind<Player> ();
			repository.Put (p2.GetKey(), p2);
			//TODO: return games.
			return p2;
		}

		public dynamic CreateGame (dynamic parameters)
		{
			var g = this.Bind<NewGameInfo>();
			var game = new Game () {
				Id = repository.NewId()
			};
			
			foreach (string p in g.Players) {
				var player = Player.GetOrCreate(p);
				var gameList = player.GetPlayerGames();
				gameList.Add (game.Id);
				var playerGame = new PlayerGame () {
					PlayerKey = player.PlusId,
					Game = game
				};
				game.Players.Add (playerGame);
			}
			GameRunner.Instance.Start (game);
			repository.Put (game.GetKey(), game);
			return new {GameId = game.Id};
		}

		dynamic GetGames (dynamic parameters)
		{
			var player = Player.GetOrCreate (parameters.id);
			var gameList = new List<GameListInfo> ();
			foreach (var gameId in player.GetPlayerGames()) {
				var game = repository.Get<Game>(Game.GetKey(gameId));
				if (game != null) {
					gameList.Add (new GameListInfo(game));
				}
			}
			return gameList;
		}

		dynamic GetGame (dynamic arg)
		{
			return repository.Get<Game>(Game.GetKey(arg.id));
		}

	}
}