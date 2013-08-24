using System;
using System.Linq;
using System.Threading;

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

			// Setup scripts.
			ScriptManager.Manager.Setup (Config.DllPath);

			// Setup cards.
			var cards = new CardCatalog ();
			cards.Load ();
			var events = new EventManager ();
			events.Setup ();
			GameRunner.Instance.Cards = cards;
			GameRunner.Instance.Events = events;

			// Sanitize games.
			GameRunner.Instance.Sanitize();

			// Setup phase terminator
			PhaseTerminator.Instance = new PhaseTerminator ();
			//PhaseTerminator.Instance.Start ();

			// Wait for interrupt.
			//Under mono if you deamonize a process a Console.ReadLine with cause an EOF 
			//so we need to block another way
			if(args.Any(s => s.Equals("-d", StringComparison.CurrentCultureIgnoreCase)))
			{
				while(true) Thread.Sleep(10000000);	
			}
			else
			{
				Console.ReadKey();    
			}
			host.Stop ();
		}
	}
}
