using System;
using IronRuby;
using IronRuby.Builtins;
using Microsoft.Scripting;
using Microsoft.Scripting.Hosting;
using System.Text.RegularExpressions;
using System.Collections.Generic;

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
			scope.SetVariable ("current_player", game.CurrentPlayer);
			scope.SetVariable ("players", game.Players);
			scope.SetVariable ("turn", game.CurrentTurn);
			scope.SetVariable ("bank", game.Bank);
			return scope;
		}

		public void ExecuteCardAction (Game game, Card card, CardArgs args) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.Action);
				var scope = SetupScope(game);
				scope.SetVariable ("hex", args.Hex);
				script.Execute (scope);
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}

		public int ExecuteModifyAttack (Game game, Card card) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.ModifyAttack);
				script.Execute (SetupScope(game));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}

		public int ExecuteModifyDiscovery (Game game, Card card) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.ModifyDiscovery);
				script.Execute (SetupScope(game));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}

		public void ExecuteModifyPurchaseCard (Game game, Card card, string purchaseCard, Dictionary<string, int> modifications) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.ModifyAttack);
				script.Execute (SetupScope(game, args));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}

		public void ExecuteCardEffect (Game game, Card card, CardArgs args) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.Action);
				script.Execute (SetupScope(game, args));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}
		public void ExecuteCardEffect (Game game, Card card, CardArgs args) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.Action);
				script.Execute (SetupScope(game, args));
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