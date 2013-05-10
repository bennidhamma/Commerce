using System;
using System.Collections.Generic;

namespace ForgottenArts.Commerce
{
	public interface IRepository
	{
		long NewId ();
		void Put<T> (string key, T value);
		T Get<T> (string key);
		IEnumerable<T> GetAll<T> ();
		IList<T> GetList<T> (string key);
	}
}

