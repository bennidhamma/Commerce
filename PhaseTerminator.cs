using System;
using System.Threading;

namespace ForgottenArts.Commerce
{
	public class PhaseTerminator
	{
		public static PhaseTerminator Instance {get; set;}

		public Timer Timer {get; set;}

		public void Start ()
		{
			Timer = new Timer (TerminatePhases, null, Config.PhaseTerminationHeartbeat, Config.PhaseTerminationHeartbeat);
		}

		public void TerminatePhases (object state)
		{
			foreach (var game in GameRunner.Instance.Games) {
				if (game.Status != GameState.Trading) {
					continue;
				}
				var duration = game.TradeDurationInSeconds;
				if (duration == 0) {
					duration = Config.DefaultTradeDurationSeconds;
				}
				if ((DateTime.Now - game.PhaseStart).Seconds > duration) {
					GameRunner.Instance.EndTradingPhase (game);
				}
			}
		}
	}
}

