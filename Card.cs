using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public class Card
	{
		public string Name {get; set;}
		public string ImageUrl {get; set;}
		public string Description {get; set;}
		public bool IsResource {get; set;}
		public bool HasAttack {get; set;}
		public Dictionary<string,int> Cost {get; set;}

		public string Effect {get; set;}
		public string DefensiveAction {get; set;}

		public Card ()
		{
			Cost = new Dictionary<string, int> ();
		}
	}
}

