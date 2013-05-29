using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class PlayerGameView
	{
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

		Turn CurrentTurn {
			get;
			set;
		}

		public PlayerGameView (Game game, PlayerGame player)
		{
			this.Hand = player.Hand;
			this.Discards = player.Discards;
			this.DeckCount = player.Deck.Count;
			this.CurrentTurn = game.CurrentTurn;
		}
	}
}

