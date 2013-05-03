using System;
using NUnit.Framework;
using ForgottenArts.Commerce;
using ServiceStack.Text;

namespace Tests
{
	[TestFixture]
	public class RedisTests
	{
		private RedisRepository repository;
		[TestFixtureSetUp]
		public void Setup()
		{
			repository = new RedisRepository ();
		}

		[Test]
		public void SetAndGetPlayerTest () 
		{
			var player1 = new Player () {
				PlusId = "1234",
				DisplayName = "Dingo Jones",
				Gender = "male"
			};
			Assert.That(player1.GetKey(), Is.EqualTo("player-plus-1234"));
			repository.Put<Player> (player1.GetKey(), player1);
			var player2 = repository.Get<Player> (player1.GetKey());
			Assert.That (player2.PlusId, Is.EqualTo("1234"));
			Assert.That (player2.DisplayName, Is.EqualTo("Dingo Jones"));
			Assert.That (player2.Gender, Is.EqualTo("male"));
		}

		[Test]
		public void PrintPlayersTest () 
		{
			foreach (var player in repository.GetAll<Player>())
			{
				var dump = player.Dump ();
				Console.WriteLine (dump);
			}
		}
	}
}

