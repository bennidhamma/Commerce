using System;
using IronRuby;
using IronRuby.Builtins;
using Microsoft.Scripting;
using Microsoft.Scripting.Hosting;
using System.Text.RegularExpressions;

namespace ForgottenArts.Commerce
{
	public class ScriptManager
	{
		private static ScriptManager manager = new ScriptManager ();
		public static ScriptManager Manager {
			get {
				return manager;
			}
		}
		
		private ScriptEngine engine;

		public ScriptEngine Engine {
			get {
				return this.engine;
			}
			set {
				engine = value;
			}
		}
       	
		public ScriptScope SetupScope (Game game)
		{
			var scope = engine.CreateScope ();
			scope.SetVariable ("game", game);
			scope.SetVariable ("current_player", game.CurrentTurn.Player);
			scope.SetVariable ("players", game.Players);
			scope.SetVariable ("turn", game.CurrentTurn);
			scope.SetVariable ("bank", game.Bank);
			return scope;
		}

		public void ExecuteCardEffect (Game game, Card card) 
		{
			var script = Engine.CreateScriptSourceFromString (card.Effect);
			try
			{
				script.Execute (SetupScope(game));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}
		
		private bool started = false;
		public void Setup (string dllPath)
		{
			if (started)
				return;
			var setup = new ScriptRuntimeSetup() ;
            setup.LanguageSetups.Add(Ruby.CreateRubySetup());
            engine = Ruby.CreateRuntime(setup).GetRubyEngine();
			string baseScript = string.Format ("require '{0}'\n", dllPath ?? Config.DllPath) + 
				Config.ReadAllText ("base.rb");
			try{
				engine.Execute (baseScript);
			}
			catch (Exception e)
			{
				Console.WriteLine ("Error setting up script engine" + e);
			}
			started = true;
		}
		
		private ScriptManager ()
		{
			
		}
	}
}