using System;
using System.Collections.Generic;
using System.Linq;
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
			GameRunner.Instance.Repository = new TestRepository ();
		}

		[Test]
		public void BasicScriptTest ()
		{
			var card = new Card () {
				Event = "puts 'hello world'"
			};
			Game g = new Game ();
			card.CompiledCardEvent = ScriptManager.Manager.CompileCardEvent (card);
			for (int i  = 0; i < 100; i++)
				ScriptManager.Manager.ExecuteCardEvent (g, card, null, "test", null);
		}

		[Test()]
		public void LoadCardsTest ()
		{
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/nation", CardType.Nation);
		}

		[Test()]
		public void LoadTradingCardsTest ()
		{
			CardCatalog catalog = new CardCatalog();
			catalog.SetupGameInfo ("card-distribution.yaml");
			Assert.That (catalog.GetTradeCardLevel (0)["Timber"], Is.EqualTo(9));
		}

		[Test()]
		public void PlayCardTest ()
		{
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/nation", CardType.Nation);

			Game g = new Game ();
			PlayerGame p1 = new PlayerGame () { PlayerKey = "1" };
			PlayerGame p2 = new PlayerGame () { PlayerKey = "2" };
			p1.Game = g;
			g.Players.Add (p1);
			g.Players.Add (p2);
			GameRunner gr = new GameRunner ();

			g.CurrentTurn.PlayerKey = "1";
			gr.Start (g);

			Assert.That (g.CurrentTurn.Actions, Is.EqualTo(1));
			p1.Hand.Add ("General");
			p2.Hand = new List<string>(new string [] {"General", "Marketplace", "Sawmill", "Scout"});
			gr.PlayCard (g, p1, "General", 0);
			Assert.That(p1.Hand, Is.Not.Contains("General"));
			Assert.That (g.CurrentTurn.Actions, Is.EqualTo(0));
			Assert.That(p2.Hand.Count, Is.EqualTo(3));
			Assert.That(p2.Hand[0], Is.EqualTo ("Marketplace"));
			Assert.That(p2.Hand[1], Is.EqualTo ("Sawmill"));
			Assert.That(p2.Hand[2], Is.EqualTo ("Scout"));
		}

		[Test]
		public void StartGameTest ()
		{
			Game g = new Game ();
			PlayerGame p1 = new PlayerGame ();
			PlayerGame p2 = new PlayerGame ();
			p1.Game = g;
			g.Players.Add (p1);
			g.Players.Add (p2);

			GameRunner gr = new GameRunner ();

			Assert.That (g.Status, Is.EqualTo (GameState.Starting));

			gr.Start (g);

			Assert.That (g.Status, Is.EqualTo (GameState.Running));
		}

		[Test]
		public void BuyTest () {
			Game g = new Game ();
			PlayerGame p1 = new PlayerGame ();
			PlayerGame p2 = new PlayerGame ();
			p1.Game = g;
			g.Players.Add (p1);
			g.Players.Add (p2);
			
			GameRunner gr = new GameRunner ();
			gr.Start (g);

			p1.Hand = new List<string>() {"Wood", "Wood", "Corn", "Corn"};

			gr.Buy (g, p1, "Scouts");

			Assert.That(p1.Hand.Contains ("Scouts"));

			Assert.That(p1.Hand.Sum(c=> c == "Corn" ? 1 : 0), Is.EqualTo (1));

			Assert.That(p1.Hand.Sum(c=> c == "Wood" ? 1 : 0), Is.EqualTo (1));
		}
	}
}

