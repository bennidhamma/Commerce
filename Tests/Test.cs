using System;
using NUnit.Framework;
using ForgottenArts.Commerce;

namespace Tests
{
	[TestFixture()]
	public class CardTests
	{
		[TestFixtureSetUp]
		public void Setup()
		{
			ScriptManager.Manager.Setup (Config.DllPath);
		}

		[Test()]
		public void LoadCardsTest ()
		{
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards");
		}

		[Test()]
		public void PlayCardTest ()
		{
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards");

			Game g = new Game ();
			PlayerGame p1 = new PlayerGame ();
			PlayerGame p2 = new PlayerGame ();
			p1.Game = g;
			g.Players.Add (p1);
			g.Players.Add (p2);

			g.CurrentTurn.Player = p1;

			p2.Hand.AddRange(new string [] {"General", "Marketplace", "Sawmill", "Scout"});
			catalog.PlayCard (p1, "General");

			Assert.That(p2.Hand.Count, Is.EqualTo(3));
		}
	}
}

