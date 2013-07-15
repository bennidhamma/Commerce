using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce.Server
{
	public class OfferView
	{
		public long Id {
			get;
			set;
		}

		public string PlayerKey {
			get;
			set;
		}

		public string PlayerPhoto {
			get;
			set;
		}

		public string PlayerName {
			get;
			set;
		}

		public List<string> Cards {
			get;
			set;
		}

		public OfferView (Game game, Offer offer)
		{
			this.PlayerKey = offer.PlayerKey;

			var player = game.GetPlayer (offer.PlayerKey);
			this.PlayerPhoto = player.Player.Photo;
			this.PlayerName = player.Player.DisplayName;

			this.Id = offer.Id;
			this.Cards = new List<string>(offer.Cards);
			// Remove the third card because it is hidden.
			this.Cards.RemoveAt(2);
		}
	}
}

