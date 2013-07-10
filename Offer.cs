using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class Offer
	{
		public long Id {get; set;}
		public string PlayerKey {get; set;}
		public List<string> Cards {get; set;}
	}
}

