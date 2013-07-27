using System;
using System.Linq;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class PlayerGameView
	{
		public long Id { get; set; }
		public GameState Status { get; set; }
		public List<Hex> Hexes { get; set; }
		public List<string> Hand { get;	set; }
		public Stack<string> Discards {	get; set; }
		public int DeckCount { get;	set; }
		public List<string> TechnologyCards { get;	set; }
		public TurnView CurrentTurn { get; set; }
		public Dictionary<string, int> Bank { get; set; }
		public List<LogEntry> Log { get; set; }
		public int Gold { get; set; }
		public IEnumerable<string> TradeCards { get; set; }

		public PlayerGameView (Game game, PlayerGame player)
		{
			var cards = GameRunner.Instance.Cards;
			this.Id = game.Id;
			this.Status = game.Status;
			this.Hand = player.Hand;
			this.Discards = player.Discards;
			this.DeckCount = player.Deck.Count;
			this.TechnologyCards = player.TechnologyCards;
			this.CurrentTurn = new TurnView(game, game.CurrentTurn);
			this.Bank = game.Bank;
			this.Log = player.Log;
			this.Hexes = player.Hexes;
			this.Gold = player.Gold;
			this.TradeCards = from c in player.TradeCards where cards[c.Card] != null select c.Card;
		}
	}
}
