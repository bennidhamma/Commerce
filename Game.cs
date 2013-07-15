using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public enum GameState
	{
		Starting,
		Running,
		Trading,
		Finished
	}

	public class Invitation 
	{
		// Note: if any player declines invitiation, the invite is deleted.
		// When all players have accepted, the game is created.
		public int NumberOfPlayers {get; set;}
		public List<PlayerGame> InvitedPlayers {get; set;}
		public List<PlayerGame> AcceptedPlayers {get; set;}
	}

	public class Game
	{
		public long Id {get; set;}
		public GameState Status {get; set;}
		public DateTime TradeEnd {get; set;}
		public int Round {get; set;}
		public Turn CurrentTurn {get; set;}
		public List<PlayerGame> Players {get; set;}
		public Dictionary<string, int> Bank {get; set;}
		public List<List<string>> TradeCards {get; set;}
		public List<string> Trash {get; set;}
		public List<Offer> Trades {get; set;}
		public List<Match> Matches { get; set; }

		public Win Win {get;set;}
		public int TradeDurationInSeconds {get; set;}

		public Game ()
		{
			Status = GameState.Starting;
			Players = new List<PlayerGame> ();
			Bank = new Dictionary<string, int> ();
			Trades = new List<Offer> ();
			Matches = new List<Match> ();
			CurrentTurn = new Turn ();
		} 

		public string GetKey () 
		{
			return GetKey (Id);
		}

		public static string GetKey (long id)
		{
			return "game-" + id;
		}

		public PlayerGame GetPlayer (string playerKey)
		{
			foreach (var p in this.Players) {
				if (p.PlayerKey == playerKey) {
					p.Game = this;
					return p;
				}
			}
			return null;
		}

		public PlayerGame CurrentPlayer {
			get {
				var key = CurrentTurn.PlayerKey ?? Players[0].PlayerKey;
				return GetPlayer(key);
			}
		}

		public void Log (string message)
		{
			Log (null, message);
		}

		public void Log (PlayerGame player, string message)
		{
			var entry = new LogEntry () {
				Message = message,
				Timestamp = DateTime.Now
			};
			if (player != null) {
				player.PublishLogEntry (entry);
			}
			else {
				foreach (var p in this.Players) {
					p.PublishLogEntry (entry);
				}
			}
		}

		public Hex GetHex (int hexId)
		{
			foreach (var p in this.Players) {
				foreach (var h in p.Hexes) {
					if (h.Id == hexId)
						return h;
				}
			}
			return null;
		}
	}
}

