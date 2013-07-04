using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class LogEntry
	{ 
		public long PlayerId {get; set;}
		public DateTime Timestamp {get; set;}
		public string Message {get; set;}
	}
}

