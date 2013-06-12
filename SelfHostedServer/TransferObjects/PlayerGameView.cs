using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class PlayerGameView
	{
		public long Id {
			get;
			set;
		}

		public List<string> Hand {
			get;
			set;
		}

		public Stack<string> Discards {
			get;
			set;
		}

		public int DeckCount {
			get;
			set;
		}

		public TurnView CurrentTurn {
			get;
			set;
		}

		public Dictionary<string, int> Bank {
			get;
			set;
		}

		public PlayerGameView (Game game, PlayerGame player)
		{
			this.Id = game.Id;
			this.Hand = player.Hand;
			this.Discards = player.Discards;
			this.DeckCount = player.Deck.Count;
			this.CurrentTurn = new TurnView(game.CurrentTurn);
			this.Bank = game.Bank;
		}
	}
}

