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
       	
		ScriptScope scope = null;
		public ScriptScope SetupScope (Game game)
		{
			scope.SetVariable ("game", game);
			scope.SetVariable ("player", game.CurrentPlayer);
			scope.SetVariable ("players", game.Players);
			scope.SetVariable ("turn", game.CurrentTurn);
			scope.SetVariable ("bank", game.Bank);
			scope.SetVariable ("runner", GameRunner.Instance);
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

		public CompiledCode CompileCardEvent (Card card)
		{
			Console.WriteLine("compiling card " + card.Name);
			var script = Engine.CreateScriptSourceFromString (card.Event);
			return script.Compile (new MyErrorListener(card.Name));
		}

		public void ExecuteCardEvent (Game game, Card card, PlayerGame player, string type, object cardEvent)
		{
			try
			{
				//var time = DateTime.Now;
				var scope = SetupScope(game);
				scope.SetVariable ("event", cardEvent);
				scope.SetVariable ("event_type", type);
				//Console.WriteLine ("ExecuteCardEvent::setting scope took: " + (DateTime.Now - time).TotalMilliseconds);
				//time = DateTime.Now;
				card.CompiledCardEvent.Execute (scope);
				//Console.WriteLine ("ExecuteCardEvent::Execute took: " + (DateTime.Now - time).TotalMilliseconds);

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
				script.Compile (new MyErrorListener(card.Name)).Execute (scope);
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
        scope = engine.CreateScope();
				string baseScript = string.Format ("require '{0}'\n", dllPath ?? Config.DllPath) + 
					Config.ReadAllText ("base.rb");
				Console.WriteLine ("Executing base script: " + baseScript);
				Console.WriteLine ("executed base script");
				engine.Execute(baseScript, scope);
				started = true;
			}
			catch (Exception e)
			{
				Console.WriteLine("error setting up script engine: " + e.Message);
				log.Error ("Error setting up script engine" + e);
			}

		}
		
		private ScriptManager ()
		{
			
		}
	}

	class MyErrorListener : ErrorListener
	{
		string context;

		public MyErrorListener (string contextArg)
		{
			this.context = contextArg;
		}

		public override void ErrorReported(ScriptSource source, string message, Microsoft.Scripting.SourceSpan span, int errorCode, Microsoft.Scripting.Severity severity)
		{
			Console.WriteLine("{0} {1},{2}: {3}", context, span.Start.Line, span.Start.Column, message);
		}
	}
}
