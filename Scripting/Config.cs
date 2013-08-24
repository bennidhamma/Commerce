using System;
using System.IO;
using System.Collections.Generic;
using System.Configuration;

namespace ForgottenArts.Commerce
{
	public static class Config
	{
		private static string hostName = System.Net.Dns.GetHostName ();
        private static FileSystemWatcher watcher;
        public static Dictionary<string,Action> watchMap = new Dictionary<string, Action> ();
		public static Dictionary<string, Action<string, WatcherChangeTypes>> directoryWatchMap = new Dictionary<string, Action<string, WatcherChangeTypes>> ();
        
		public static string GetSetting(string key, string def) {
			return ConfigurationManager.AppSettings[key] ?? def;
		}

		public static int GetInt(string key, int def) {
			var val = ConfigurationManager.AppSettings[key];
			if (val != null) {
				return Convert.ToInt32 (val);
			} else {
				return def;
			}
		}

		private static Random random;
		public static Random Random {
			get {
				if (random == null) {
					random = new System.Random ();
				}
				return random;
			}
			set {
				random = value;
			}
		}

		public static object GoogleApiKey {
			get {
				return GetSetting("GoogleApiKey", "");
			}
		}

		public static bool EnforcePlayer {
			get {
				return Convert.ToBoolean(GetSetting ("EnforcePlayer", "False"));
			}
		}

		public static string Server {
			get {
				return GetSetting("Server", "127.0.0.1");
			}
		}

		public static int HttpPort {
			get {
				return GetInt("HttpPort", 8080);
			}
		}

		public static int PhaseTerminationHeartbeat {
			get {
				return GetInt("PhaseTerminationHeartbeat", 60000);
			}
		}

		public static int DefaultTradeDurationSeconds {
			get {
				// Default to 5 minutes.
				return GetInt("DefaultTradeDurationSeconds", 60 * 5);
			}
		}

		public static int MaxNumberOfHexes {
			get {
				return GetInt("MaxNumberOfHexes", 9);
			}
		}

		public static int PointsPerColony {
			get {
				return GetInt("PointsPerColony", 50);
			}
		}
        
        public static bool FileExists (string name)
        {
            return File.Exists (Path.Combine(ContentDirectory, name));   
        }
		
		public static string ContentDirectory {
			get {
				return GetSetting("ContentDirectory", "../content/");
			}
		}
		
		private static string dllPath = null;
		public static string DllPath {
			get {
				if (dllPath == null)
					return GetSetting("DllPath",  "bin/Commerce.dll");
				else return 
					dllPath;
			}
			set {
				dllPath = value;
			}
		}

		public static void YamlDirectoryOperator (string path, Action<dynamic> fn)
		{
			YamlDirectoryOperator (path, fn, null);
		}

		public static void YamlDirectoryOperator (string path, Action<dynamic> fn, Action<dynamic> delFn)
		{
			foreach (var f in Directory.GetFiles (Path.Combine (ContentDirectory, path), "*.yaml"))
			{
				LoadYamlFile (f, fn);
			}

			AddDirectoryChangeNotification (path, delegate(string file, WatcherChangeTypes changeType) {
				FileInfo fi = new FileInfo (file);
				if (fi.Extension != ".yaml")
					return;
				if (changeType == WatcherChangeTypes.Created)
				{
					fn(YamlDoc.Load(file));
				}
				else if (changeType == WatcherChangeTypes.Deleted && delFn != null)
				{
					//TODO: investigate if the file is still available when the delete event fires, of if this is just a waste of time.
					delFn(YamlDoc.Load(file));
				}
			});
		}

		public static void LoadYamlFile (string file, Action<dynamic> fn)
		{
			if (!file.StartsWith(ContentDirectory))
				file = Path.Combine (ContentDirectory, file);
			fn (YamlDoc.Load (file));
			AddFileChangeNotification (file, delegate {
				fn(YamlDoc.Load (file));
			});
		}

		public static void LoadYamlDocuments (string file, Action<dynamic> fn, Action documentChangedAction = null)
		{
			if (!file.StartsWith(ContentDirectory))
				file = Path.Combine (ContentDirectory, file);
			foreach (var dynamic in YamlDoc.LoadAll (file))
				fn (dynamic);
			AddFileChangeNotification (file, delegate {
				if (documentChangedAction != null)
					documentChangedAction ();
				foreach (var dynamic in YamlDoc.LoadAll (file))
					fn (dynamic);
			});
		}

		public static void AddFileChangeNotification (string path, Action callback) {
			if (!path.StartsWith(ContentDirectory))
				path = Path.Combine (ContentDirectory, path);
            if (watchMap.ContainsKey (path))
                watchMap[path] += callback;
            else
                watchMap[path] = callback;
        }

		public static void AddDirectoryChangeNotification (string path, Action<string, WatcherChangeTypes> callback)
		{
			if (!path.StartsWith(ContentDirectory))
				path = Path.Combine (ContentDirectory, path);
			if (directoryWatchMap.ContainsKey(path))
			{
				directoryWatchMap[path] += callback;
			}
			else
			{
				directoryWatchMap[path] = callback;
			}
		}
        
        public static void SetupContentWatcher ()
        {
            watcher = new FileSystemWatcher (ContentDirectory);
			watcher.IncludeSubdirectories = true;
			watcher.Created += delegate(object sender, FileSystemEventArgs e) {
				FileInfo fi = new FileInfo (e.FullPath);
				if (directoryWatchMap.ContainsKey (fi.DirectoryName))
				{
					directoryWatchMap[fi.DirectoryName](e.FullPath, e.ChangeType);
				}
			};

			watcher.Deleted += delegate(object sender, FileSystemEventArgs e) {
				FileInfo fi = new FileInfo (e.FullPath);
				if (directoryWatchMap.ContainsKey (fi.DirectoryName))
				{
					directoryWatchMap[fi.DirectoryName](e.FullPath, e.ChangeType);
				}
			};

			watcher.Changed += delegate(object sender, FileSystemEventArgs e) {
				if (watchMap.ContainsKey(e.FullPath))
				{
					watchMap[e.FullPath] ();
					return;
				}
            };
            watcher.EnableRaisingEvents = true;
        }
		
		public static string ReadAllText (string path)
		{
			string text = File.ReadAllText (Path.Combine (ContentDirectory, path));
			return text;
		}
	}
}
