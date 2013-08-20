using System;
using ServiceStack.Redis;
using System.Collections.Generic;
using ServiceStack.Redis.Generic;

namespace ForgottenArts.Commerce
{
	public class RedisRepository : IRepository
	{
		public RedisRepository ()
		{
		}

    public RedisClient GetClient () {
      var redisClient = new RedisClient("127.0.0.1", 6379);
      return redisClient;
    }

		public long NewId ()
		{
			using (var redisClient = GetClient()) {
				return redisClient.Incr ("uid");
			}
		}

		public long MaxId
		{
			get {
				using (var redisClient = GetClient()) {
					return redisClient.Get<long> ("uid");
				}
			}
		}

		public void Put<T> (string key, T value)
		{
			using (var redisClient = GetClient()) {
				var typed = redisClient.As<T> ();
				typed.SetEntry (key, value);
			}
		}

		public T Get<T> (string key)
		{
			using (var redisClient = GetClient()) {
				var typed = redisClient.As<T> ();
				return typed.GetValue(key);
			}
		}

		public IEnumerable<T> GetAll<T> ()
		{
			throw new NotImplementedException ();
		}

		public IList<T> GetList<T> (string key)
		{
			using (var redisClient = GetClient()) {
				var typed = redisClient.As<T> ();
				var list = typed.Lists[key];
				return list;
			}
		}

		public void Append<T> (string key, T message)
		{
			using (var redisClient = GetClient()) {
				var typed = redisClient.As<T> ();
				var list = typed.Lists[key];
				list.Add (message);
			}
		}
	}
}

