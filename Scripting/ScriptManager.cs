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

		public void ExecuteCardEvent (Game game, Card card, PlayerGame player, string type, object cardEvent)
		{
			try
			{
				var script = Engine.CreateScriptSourceFromString (card.Event);
				var scope = SetupScope(game);
				scope.SetVariable ("event", cardEvent);
				scope.SetVariable ("event_type", type);
				script.Compile (new MyErrorListener()).Execute (scope);
			}
			catch (Exception e)
			{
				Console.WriteLine (e);
			}
		}

		public void ExecuteCalamity (Game game, Card card, PlayerGame primaryPlayer, PlayerGame secondaryPlayer)
		{

			var script = Engine.CreateScriptSourceFromString (card.Calamity);
			var scope = SetupScope(game);
			scope.SetVariable ("primary_player", primaryPlayer);
			scope.SetVariable ("secondary_player", secondaryPlayer);
			try
			{
				script.Compile (new MyErrorListener()).Execute (scope);
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

				engine = Ruby.CreateEngine ( x => {
					x.ExceptionDetail = true;
				});
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

	class MyErrorListener : ErrorListener
	{
		public override void ErrorReported(ScriptSource source, string message, Microsoft.Scripting.SourceSpan span, int errorCode, Microsoft.Scripting.Severity severity)
		{
			Console.WriteLine("{0},{1}: {2}", span.Start.Line, span.Start.Column, message);
		}
	}
}