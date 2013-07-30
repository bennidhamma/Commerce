using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class LogEntry
	{ 
		public string PlayerKey {get; set;}
		public DateTime Timestamp {get; set;}
		public string Message {get; set;}

		public override string ToString ()
		{
			return string.Format ("{0} {1}", Timestamp, Message);
		}
	}
}

