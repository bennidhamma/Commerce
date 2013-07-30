using System;
using System.Collections.Generic;
using System.Linq;

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
		List<List<string>> tradeCards;
		public List<List<string>> TradeCards {
			get {
				if (tradeCards == null)
				{
					SetupTradeDeck ();
				}
				return tradeCards;
			}
			set {
				tradeCards = value;
			}
		}
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
			Trash = new List<string> ();
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
				if (Players.Count == 0)
					return null;
				var key = CurrentTurn.PlayerKey ?? Players[0].PlayerKey;
				return GetPlayer(key);
			}
		}

		public void Debug (string context, params object[] os)
		{
			Console.WriteLine (context);
			foreach (var o in os) {
				Console.WriteLine (o);
			}
		}

		public void Log (string message)
		{
			Log (null, message);
		}

		public void Log (string message, params object[] formatArgs)
		{
			Log (null, string.Format(message, formatArgs));
		}

		public void Log (PlayerGame player, string message)
		{
			var entry = new LogEntry () {
				Message = message,
				Timestamp = DateTime.Now,
			};
			if (player != null)
				entry.PlayerKey = player.PlayerKey;
			AppendToLog (entry);
		}

		private void AppendToLog (LogEntry entry)
		{
			GameRunner.Instance.Repository.Append<LogEntry> ("game-log-" + this.Id, entry);
		}

		public static IEnumerable<LogEntry> GetLog (long gameId)
		{
			return GameRunner.Instance.Repository.GetList<LogEntry> ("game-log-" + gameId).Reverse().Take (20);
		}

		public Hex GetHex (int hexId)
		{
			foreach (var p in this.Players) {
				foreach (var h in p.Hexes) {
					if (h.Id == hexId) {
						h.Player = p;
						return h;
					}
				}
			}
			return null;
		}

		public void SetupTradeDeck ()
		{
			var cards = GameRunner.Instance.Cards;
			if (tradeCards == null)
			{
				tradeCards = new List<List<string>> ();
				for (int level = 0; level < cards.NumberOfTradeLevels; ++level) {
					var cardsAtLevel = cards.GetTradeCardLevel(level);
					tradeCards.Add(new List<string> ());
					foreach (var kvp in cardsAtLevel) {
						for (int i = 0; i < kvp.Value; ++i) {
							tradeCards[level].Add (kvp.Key);
						}
					}
				}
			}
			for (int i = 0; i < tradeCards.Count; i++) {
				tradeCards[i].Shuffle();
			}
		}
	}
}