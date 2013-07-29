using System;
using System.Runtime.Serialization;

namespace ForgottenArts.Commerce
{
	public class Hex
	{
		public long Id {get; set;}	
		public int PopulationLimit {get; set;}
		int currentPopulation;
		public int CurrentPopulation {
			get {
				// If there is a colony, there is no population.
				return HasColony ? 0 : currentPopulation;
			}
			set {
				currentPopulation = value;
			}
		}
		public bool HasColony {get; set;}

		public int GetPopulationLimit ()
		{
			var hp = new Property () {
				Player = this.Player,
				Source = this,
				Key = "hex.population_limit",
				Value = PopulationLimit
			};
			Player.HandleCardEvents (hp);
			return (int) hp.Value;
		}

		[IgnoreDataMember]
		public PlayerGame Player {get; set;}

		public void AddColonist (int count = 1)
		{
			CurrentPopulation += count;
		}
	}
}

