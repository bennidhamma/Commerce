using System;
using ForgottenArts.Commerce;

namespace Tests
{
	public class TestRepository : IRepository
	{
		#region IRepository implementation

		int id = 0;
		public long NewId ()
		{
			return ++id;
		}

		public void Put<T> (string key, T value)
		{
			throw new NotImplementedException ();
		}

		public T Get<T> (string key)
		{
			throw new NotImplementedException ();
		}

		public System.Collections.Generic.IEnumerable<T> GetAll<T> ()
		{
			throw new NotImplementedException ();
		}

		public System.Collections.Generic.IList<T> GetList<T> (string key)
		{
			throw new NotImplementedException ();
		}

		public long MaxId {
			get {
				throw new NotImplementedException ();
			}
		}

		#endregion

		public TestRepository ()
		{
		}
	}
}

