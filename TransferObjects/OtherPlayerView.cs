using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class OtherPlayerView
	{
		/* 
		 * Things we care about from other players:
		 *  - Name
		 *  - PlayerPhoto
		 *  - Hand Size
		 *  - Deck Size
		 *  - Discards
		 *  - Technology Cards
		 *  - Hexes
		 */

		public string Name {get; set;}
		public string Photo {get; set;}
		public string Color {get; set;}
		public int HandSize {get; set;}
		public int DeckSize {get; set;}
		public Stack<string> Discards {get; set;}
		public List<string> TechnologyCards {get; set;}
		public List<Hex> Hexes {get; set;}

		public OtherPlayerView (PlayerGame other)
		{
			this.Name = other.Name;
			this.Photo = other.Player.Photo;
			this.Color = other.Color;
			this.HandSize = other.Hand.Count;
			this.DeckSize = other.Deck.Count;
			this.Discards = other.Discards;
			this.TechnologyCards = other.TechnologyCards;
			this.Hexes = other.Hexes;
		}
	}
}