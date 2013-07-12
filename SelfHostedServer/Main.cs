using System;

namespace ForgottenArts.Commerce.Server
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			// Setup config.
			Config.SetupContentWatcher ();

			// Setup Nancy host.
			var host = new Nancy.Hosting.Self.NancyHost (new Uri("http://" + Config.Server + ":" + Config.HttpPort));
			host.Start ();

			// Setup socket server
			PlayerSocketServer.Instance = new PlayerSocketServer ();
			PlayerSocketServer.Instance.Init ();

			// Setup cards.
			var cards = new CardCatalog ();
			cards.Load ();
			GameRunner.Instance.Cards = cards;

			// Setup scripts.
			ScriptManager.Manager.Setup (Config.DllPath);

			// Sanitize games.
			GameRunner.Instance.Sanitize();

			// Wait for interrupt.
			Console.ReadLine();
			host.Stop ();
		}
	}
}
