using System;
using IronRuby;
using IronRuby.Builtins;
using Microsoft.Scripting;
using Microsoft.Scripting.Hosting;
using System.Text.RegularExpressions;

namespace ForgottenArts.Commerce
{
	public class CardArgs
	{
		public Hex Hex {get; set;}

		// Signals card scripts can set to change the after play behavior.
		public bool TrashCard {get; set;}

		public string Error {get; set;}

		bool discardCard = true;
		public bool DiscardCard {
			get {
				return discardCard;
			}
			set {
				discardCard = value;
			}
		}
	}
}