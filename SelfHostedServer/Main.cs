using System;

namespace ForgottenArts.Commerce.Server
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			Config.SetupContentWatcher ();
			var host = new Nancy.Hosting.Self.NancyHost (new Uri("http://localhost:8080"));
			host.Start ();
			ScriptManager.Manager.Setup (Config.DllPath);
			GameRunner.Instance.Sanitize();
			Console.ReadLine();
			host.Stop ();
		}
	}
}
