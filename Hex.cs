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

		[IgnoreDataMember]
		public PlayerGame Player {get; set;}

		public void AddColonist (int count = 1)
		{
			CurrentPopulation += count;
		}
	}
}

