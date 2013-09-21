using System;

namespace ForgottenArts.Commerce
{
	public class PlayerSummaryView
	{
		public string Photo {get; set;}
		public string Key { get; set; }
		public string Color {get; set;}

		public PlayerSummaryView (PlayerGame p)
		{
			this.Photo = p.Player.Photo;
			this.Key = p.PlayerKey;
			this.Color = p.Color;
		}
	}
}

