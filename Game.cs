using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public enum GameState {
		Starting,
		Running,
		Finished
	}

	public class Game
	{
		public GameState Status {get; set;}
		public int NumberOfPlayers {get; set;}
		public int Round {get; set;}
		public Turn CurrentTurn {get; set;}
		public List<PlayerGame> Players {get; set;}
		public Dictionary<string, int> Bank {get; set;}
		public List<Offer> Trades {get; set;}
		public List<LogEntry> Log {get; set;}

		public Game ()
		{
			Players = new List<PlayerGame> ();
			Bank = new Dictionary<string, int> ();
			Trades = new List<Offer> ();
			Log = new List<LogEntry> ();
			CurrentTurn = new Turn ();
		}
	}
}

