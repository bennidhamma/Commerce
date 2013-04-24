using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class Hub
	{
		public Dictionary<string,Spoke> spokes = new Dictionary<string, Spoke> ();

		public Hub ()
		{
		}

		public Spoke Enroll (string key)
		{
			spokes[key] = new Spoke ();
			return spokes[key];
		}

		public void Publish (string channel, object source, EventArgs args) 
		{
			foreach (var spoke in spokes.Values)
				spoke.Publish (channel, source, args);
		}
	}

	public class Spoke
	{
		public Dictionary<string,EventHandler> handlers = new Dictionary<string, EventHandler> ();

		public void Subscribe (string channel, EventHandler handler)
		{
			if (handlers.ContainsKey(channel))
				handlers[channel] += handler;
			else
				handlers[channel] = handler;
		}

		public void Publish (string channel, object source, EventArgs args)
		{
			if (handlers.ContainsKey(channel))
			{
				handlers[channel](source, args);
			}
		}
	}
}

