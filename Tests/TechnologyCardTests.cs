using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using ForgottenArts.Commerce;

namespace Tests
{
	public class TechnologyCardTests : BaseTest
	{
		[Test]
		public void CottonGinTest () {
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/trade", CardType.Trade);
			catalog.LoadCards("cards/technology", CardType.Technology);

			var cottonGin = catalog["Cotton Gin"];
			var e = new ModifyTradeSetEvent () {
				Good = "Cotton",
				Size = 1
			};
			ScriptManager.Manager.ExecuteCardEvent (new Game(), cottonGin, null, "ModifyTradeSetEvent", e);

			Assert.That(e.Size, Is.EqualTo(2));
		}

		[Test]
		public void PlayerCardEventsTest () {
			Game g = new Game ();
			var p1 = AddPlayer (g);
			p1.TechnologyCards.Add ("Cotton Gin");

			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/trade", CardType.Trade);
			catalog.LoadCards("cards/technology", CardType.Technology);
			GameRunner.Instance.Cards = catalog;
			
			var e = new ModifyTradeSetEvent () {
				Good = "Cotton",
				Size = 1
			};
			p1.HandleCardEvents (e);
			
			Assert.That(e.Size, Is.EqualTo(2));
		}
	}
}

