using System;
using NUnit.Framework;
using ForgottenArts.Commerce;

namespace Tests
{
	[TestFixture()]
	public class CardTests
	{
		[Test()]
		public void LoadCardsTest ()
		{
			CardCatalog catalog = new CardCatalog();
			catalog.LoadCards("cards");
		}
	}
}

