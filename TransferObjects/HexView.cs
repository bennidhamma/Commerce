using System;

namespace ForgottenArts.Commerce
{
	public class HexView
	{
		public long Id {get; set;}	
		public int PopulationLimit {get; set;}
		public int CurrentPopulation { get; set; }
		public bool HasColony {get; set;}

		public HexView (Hex hex)
		{
			this.Id = hex.Id;
			this.PopulationLimit = hex.GetPopulationLimit();
			this.CurrentPopulation = hex.CurrentPopulation;
			this.HasColony = hex.HasColony;
		}
	}
}

