using System;

namespace ForgottenArts.Commerce.Server
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			var host = new Nancy.Hosting.Self.NancyHost (new Uri("http://localhost:8080"));
			host.Start ();
			Console.ReadLine();
			host.Stop ();
		}
	}
}
