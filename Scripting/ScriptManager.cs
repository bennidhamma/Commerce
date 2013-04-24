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
        
        public Action SetupActionScript (string code)
        {
            return SetupActionScript(code, SetupScope ());
        }
	
		public Action SetupActionScript (string code, ScriptScope scope)
		{
			string scriptString = string.Format ("Proc.new {{ {0} }}", code);
			var script = Engine.CreateScriptSourceFromString (CoerceMutableStringHack(scriptString));
			try
			{
				var proc = (Proc)script.Execute (scope);
				return delegate {
				//log.Debug ("executing ", code);
					try
					{
						proc.Call (proc);
					}
					catch (Exception e)
					{
						log.Error ("Error executing ruby script: ", e, code);
					}
				//	log.Debug ("done executing script");
				};
			}
			catch (SyntaxErrorException ex)
			{
				log.ErrorFormat ("Error compiling ruby script ({0}, {1}\n{2}", ex.Line, ex.Column, ex.SourceCode);
			}
			return null;
		}
		
		public Action<T> SetupActionScript<T> (string code, params string[] paramNames)
		{
			string scriptString = string.Format ("Proc.new {{ |{0}| {1} }}", string.Join(",", paramNames), code);
			var scope = SetupScope ();
			var script = Engine.CreateScriptSourceFromString (CoerceMutableStringHack(scriptString));
			try
			{
				var proc = (Proc)script.Execute (scope);
				return (t) => {
				//	log.Debug ("executing ", code, t);
					try
					{
						proc.Call (proc, PrepareArgument (t));
					}
					catch (Exception e)
					{
						log.Error ("Error executing ruby script: ", e, code);
					}
				//	log.Debug ("done executing script");
				};
			}
			catch (SyntaxErrorException ex)
			{
				log.ErrorFormat ("Error compiling ruby script ({0}, {1}\n{2}", ex.Line, ex.Column, ex.SourceCode);
			}
			return null;
		}
		
		public Func<T> SetupFuncScript<T> (string code)
		{
			string scriptString = string.Format ("Proc.new {{ {0} }}", code);
			var scope = SetupScope ();
			var script = Engine.CreateScriptSourceFromString (CoerceMutableStringHack(scriptString));
			try
			{
				var proc = (Proc)script.Execute (scope);
				return delegate {
				//	log.Debug ("executing ", code);
					try
					{
						var r = (T)proc.Call (proc);
					//	log.Debug ("done executing script");
						return r;
					}
					catch (Exception e)
					{
						log.Error ("Error executing ruby script: ", e, code);
						return default(T);
					}
				};
			}
			catch (SyntaxErrorException ex)
			{
				log.ErrorFormat ("Error compiling ruby script ({0}, {1}\n{2}", ex.Line, ex.Column, ex.SourceCode);
			}
			return null;
		}
		
		public Func<T,U> SetupFuncScript<T,U> (string code, params string[] paramNames)
		{
			string scriptString = string.Format ("Proc.new {{ |{0}| {1} }}", string.Join(",", paramNames), code);
			var scope = SetupScope ();
			var script = Engine.CreateScriptSourceFromString (CoerceMutableStringHack(scriptString));
			try
			{
				var proc = (Proc)script.Execute (scope);
				return (t) => {
				//	log.Debug ("executing ", code, t);
					try
					{
						var r = (U)proc.Call (proc, PrepareArgument (t));
					//	log.Debug ("done executing script");
						return r;
					}
					catch (Exception e)
					{
						log.Error ("Error executing ruby script: ", e, code);
						return default(U);
					}
				};
			}
			catch (SyntaxErrorException ex)
			{
				log.ErrorFormat ("Error compiling ruby script ({0}, {1}\n{2}", ex.Line, ex.Column, ex.SourceCode);
			}
			return null;
		}
		
		public Action<T,U> SetupActionScript<T,U> (string code, params string[] paramNames)
		{
			string scriptString = string.Format ("Proc.new {{ |{0}| {1} }}", string.Join(",", paramNames), code);
			var scope = SetupScope ();
			var script = Engine.CreateScriptSourceFromString (CoerceMutableStringHack(scriptString));
			try
			{
				var proc = (Proc)script.Execute (scope);
				return (t,u) => {
				//	log.Debug ("executing ", code, t, u);
					try
					{
						proc.Call (proc, PrepareArgument (t), PrepareArgument (u));
					}
					catch (Exception e)
					{
						log.Error ("Error executing ruby script: ", e, code);
					}
				//	log.Debug ("done executing script");
				};
			}
			catch (SyntaxErrorException ex)
			{
				log.ErrorFormat ("Error compiling ruby script ({0}, {1}\n{2}", ex.Line, ex.Column, ex.SourceCode);
			}
			return null;
		}

		public Action<T, U, V> SetupActionScript<T,U,V> (string code, params string[] paramNames)
		{
			string scriptString = string.Format ("Proc.new {{ |{0}| {1} }}", string.Join(",", paramNames), code);
			var scope = SetupScope ();
			var script = Engine.CreateScriptSourceFromString (CoerceMutableStringHack(scriptString));
			try
			{
				var proc = (Proc)script.Execute (scope);
				return (t,u,v) => {
					//	log.Debug ("executing ", code, t, u);
					try
					{
						proc.Call (proc, PrepareArgument (t), PrepareArgument (u), PrepareArgument (v) );
					}
					catch (Exception e)
					{
						log.Error ("Error executing ruby script: ", e, code);
					}
					//	log.Debug ("done executing script");
				};
			}
			catch (SyntaxErrorException ex)
			{
				log.ErrorFormat ("Error compiling ruby script ({0}, {1}\n{2}", ex.Line, ex.Column, ex.SourceCode);
			}
			return null;
		}
		
		public object PrepareArgument (object o)
		{
			return o;
			/*
			if (o == null)
				return o;
			if (o is AbstractRecord)
				o = new RecordProxy (o as AbstractRecord);
			else if (o.GetType().IsPrimitive || o is string || o is decimal || o is DateTime)
				o = o;
			else
				o = new DynamicProxy (o);
			return o;
			*/
		}
		
		public Func<T,U, V> SetupFuncScript<T,U, V> (string code, params string[] paramNames)
		{
			string scriptString = string.Format ("Proc.new {{ |{0}| {1} }}", string.Join(",", paramNames), code);
			var scope = SetupScope ();
			var script = Engine.CreateScriptSourceFromString (CoerceMutableStringHack(scriptString));
			try
			{
				var proc = (Proc)script.Execute (scope);
				object r = null;
				return (t,u) => {
				//	log.Debug ("executing script", code, t, u);
					try
					{
						r = proc.Call (proc, PrepareArgument (t), PrepareArgument (u));
						return (V)r;
					}
				//	log.Debug ("done executing script");
					catch (Exception e)
					{
						log.Error ("Error executing ruby script: ", t, u, r, e, code);
						return default(V);
					}
				};
			}
			catch (SyntaxErrorException ex)
			{
				log.ErrorFormat ("Error compiling ruby script ({0}, {1}\n{2}", ex.Line, ex.Column, ex.SourceCode);
			}
			return null;
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
			}
		}
		
		Regex literalString = new Regex	(@"(['""]).*?\1", RegexOptions.Compiled);
		private string CoerceMutableStringHack (string input)
		{
			return literalString.Replace (input, "$0.to_clr_string");
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
				log.Error ("Error setting up script engine", e);
			}
			started = true;
		}
		
		private ScriptManager ()
		{
			
		}
	}
}