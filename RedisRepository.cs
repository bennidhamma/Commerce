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

		public long NewId ()
		{
			using (var redisClient = new RedisClient()) {
				return redisClient.Incr ("uid");
			}
		}

		public void Put<T> (string key, T value)
		{
			using (var redisClient = new RedisClient()) {
				var typed = redisClient.As<T> ();
				typed.SetEntry (key, value);
			}
		}

		public T Get<T> (string key)
		{
			using (var redisClient = new RedisClient()) {
				var typed = redisClient.As<T> ();
				return typed.GetValue(key);
			}
		}

		public IEnumerable<T> GetAll<T> ()
		{
			using (var redisClient = new RedisClient()) {
				var typed = redisClient.As<T> ();
				return typed.GetAll();
			}
		}

		public IList<T> GetList<T> (string key)
		{
			using (var redisClient = new RedisClient()) {
				var typed = redisClient.As<T> ();
				var list = typed.Lists[key];
				return list;
			}
		}
	}
}

