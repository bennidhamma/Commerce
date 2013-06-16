using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public enum GameState
	{
		Starting,
		Running,
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
		public int Round {get; set;}
		public Turn CurrentTurn {get; set;}
		public List<PlayerGame> Players {get; set;}
		public Dictionary<string, int> Bank {get; set;}
		public List<Offer> Trades {get; set;}
		public List<LogEntry> Log {get; set;}
		public Win Win {get;set;}

		public Game ()
		{
			Status = GameState.Starting;
			Players = new List<PlayerGame> ();
			Bank = new Dictionary<string, int> ();
			Trades = new List<Offer> ();
			Log = new List<LogEntry> ();
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
	}
}

