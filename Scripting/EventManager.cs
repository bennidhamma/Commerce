using System;

namespace ForgottenArts.Commerce
{
	public class EventManager
	{
		private string startGame;

		public EventManager ()
		{
		}

		public void Setup ()
		{
			Config.LoadYamlFile("events.yaml", (yaml) => {
				foreach (string key in yaml.Keys) {
					switch (key) {
					case "Start":
						this.startGame = yaml.Start;
						break;
					};
				}
			});
		}

		public void StartGame (Game game) {
			if (this.startGame != null)
			{
				try {
					ScriptManager.Manager.ExecuteGameEvent (game, this.startGame);
				}
				catch (Exception e)
				{
					Console.WriteLine ("Error executing start event: " + e.Message);
				}

			}
		}
	}
}

