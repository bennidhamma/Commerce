using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using ForgottenArts.Commerce;

namespace Tests
{
	public class BaseTest
	{
		[TestFixtureSetUp]
		public void Setup()
		{
			ScriptManager.Manager.Setup (Config.DllPath);
			GameRunner.Instance.Repository = new TestRepository ();
		}

		protected PlayerGame AddPlayer (Game g)
		{
			var p = new PlayerGame () {
				Player = new Player () {DisplayName = "Player " + g.Players.Count}
			};
			p.Game = g;
			g.Players.Add (p);
			return p;
		}
	}

	public class CalamityTests : BaseTest
	{

		[Test]
		public void FamineTest () {
			Game g = new Game ();
			var p1 = AddPlayer (g);
			p1.AddHex (20, 20);
			
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/trade", CardType.Trade);
			
			ScriptManager.Manager.ExecuteCalamity (g, catalog["Famine"], p1, null);
			
			Assert.That (p1.Hexes[0].CurrentPopulation, Is.EqualTo(8));
		}
		
		[Test]
		public void SmallPoxTest () {
			Game g = new Game();
			var p1 = AddPlayer (g);
			var p2 = AddPlayer (g);
			p1.AddHex (20, 20);
			p2.AddHex (20, 20);
			
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/trade", CardType.Trade);
			
			ScriptManager.Manager.ExecuteCalamity (g, catalog["Small Pox"], p1, null);
			
			Assert.That (p1.Hexes[0].CurrentPopulation, Is.EqualTo(6));
			Assert.That (p2.Hexes[0].CurrentPopulation, Is.EqualTo(12));
		}
		
		[Test]
		public void SmallPoxWithAntibioticsTest () {
			Game g = new Game();
			var p1 = AddPlayer (g);
			p1.AddHex (20, 20);
			p1.TechnologyCards.Add ("Antibiotics");
			
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/trade", CardType.Trade);
			
			ScriptManager.Manager.ExecuteCalamity (g, catalog["Small Pox"], p1, null);
			
			Assert.That (p1.Hexes[0].CurrentPopulation, Is.EqualTo(12));
		}
		
		void AddTradeCards (PlayerGame p, params string[] cards)
		{
			foreach (string card in cards) {
				p.TradeCards.Add (new TradeCardInfo () {
					Card = card
				});
			}
		}
		
		[Test]
		public void NativeRaidTest () {
			Game g = new Game();
			var p1 = AddPlayer (g);
			AddTradeCards (p1, "Corn", "Corn", "Coffee", "Coffee");

			CardCatalog catalog = new CardCatalog();
			catalog.Load ();
			GameRunner.Instance.Cards = catalog;

			int firstTradeStoreCount = g.TradeCards.Sum (x => x.Count);

			ScriptManager.Manager.ExecuteCalamity (g, catalog["Native Raid"], p1, null);
			Assert.That (p1.TradeCards.Count, Is.EqualTo(2));

			int secondTradeStoreCount = g.TradeCards.Sum (x => x.Count);
			Assert.That (secondTradeStoreCount, Is.EqualTo(firstTradeStoreCount + 2));

		}
		
		[Test]
		public void LawsuitTest () {
			Game g = new Game();
			var p1 = AddPlayer (g);
			var p2 = AddPlayer (g);
			p1.AddHex (10, 10);
			p1.Hexes[0].HasColony = true;
			
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards/trade", CardType.Trade);
			
			ScriptManager.Manager.ExecuteCalamity (g, catalog["Lawsuit"], p1, p2);
			
			Assert.That (p1.Hexes.Count, Is.EqualTo(0));
			Assert.That (p2.Hexes.Count, Is.EqualTo(1));
			Assert.That (p2.Hexes[0].PopulationLimit, Is.EqualTo(10));
		}
	}
}

