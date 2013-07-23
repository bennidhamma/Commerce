using System;
using IronRuby;
using IronRuby.Builtins;
using Microsoft.Scripting;
using Microsoft.Scripting.Hosting;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using log4net;

namespace ForgottenArts.Commerce
{
	public class ScriptManager
	{
		private static readonly ILog log = LogManager.GetLogger(typeof(ScriptManager));
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
			scope.SetVariable ("player", game.CurrentPlayer);
			scope.SetVariable ("players", game.Players);
			scope.SetVariable ("turn", game.CurrentTurn);
			scope.SetVariable ("bank", game.Bank);
			return scope;
		}

		public string ExecuteCardAction (Game game, Card card, CardArgs args) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.Action);
				var scope = SetupScope(game);
				scope.SetVariable ("hex", args.Hex);
				scope.SetVariable ("args", args);
				script.Execute (scope);
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
				return e.Message;
			}
			return args.Error;
		}

		/**
		 * Allows cards to modify attack rolls, for either the offense or the defense.
		 */
		public int ExecuteModifyAttack (Game game, Card card) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.ModifyAttack);
				return script.Execute (SetupScope(game));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
			return 0;
		}

		/**
		 * Allows cards to modify the ship discovery roll.
		 */
		public int ExecuteModifyDiscovery (Game game, Card card) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.ModifyDiscovery);
				return script.Execute (SetupScope(game));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
			return 0;
		}

		/**
		 * Allows cards to change the purchase cost of new cards.
		 */
		public void ExecuteModifyPurchaseCard (Game game, Card card, string purchaseCard, Dictionary<string, int> modifications) 
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.ModifyAttack);
				var scope = SetupScope(game);
				scope.SetVariable ("mods", modifications);
				script.Execute (SetupScope(game));
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}

		public void ExecuteCalamity (Game game, Card card, PlayerGame primaryPlayer, PlayerGame secondaryPlayer)
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.Calamity);
				var scope = SetupScope(game);
				scope.SetVariable ("primary_player", primaryPlayer);
				scope.SetVariable ("secondary_player", secondaryPlayer);
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
			try
			{
				if (started)
					return;
				var setup = new ScriptRuntimeSetup() ;
				setup.LanguageSetups.Add(Ruby.CreateRubySetup());
				engine = Ruby.CreateRuntime(setup).GetRubyEngine();
				string baseScript = string.Format ("require '{0}'\n", dllPath ?? Config.DllPath) + 
					Config.ReadAllText ("base.rb");
				engine.Execute (baseScript);
				started = true;
			}
			catch (Exception e)
			{
				log.Error ("Error setting up script engine" + e);
			}

		}
		
		private ScriptManager ()
		{
			
		}
	}
}