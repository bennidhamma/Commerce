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

		public void Append<T> (string key, T message)
		{
			Console.WriteLine ("{0}: {1}", key, message);
		}

		#endregion

		public TestRepository ()
		{
		}
	}
}

