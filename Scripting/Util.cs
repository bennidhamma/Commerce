using System;
using System.Collections;
using System.Dynamic;
using System.Linq;
using System.Collections.Generic;
using YamlDotNet.RepresentationModel;
using System.IO;

namespace ForgottenArts.Commerce
{
	public static class YamlDoc
	{
		public static dynamic Load(string fileName)
		{
			var stream = new YamlStream ();
			stream.Load (new StreamReader (fileName));
			dynamic result;
			if (TryMapValue(stream.Documents[0].RootNode, out result))
			{
				return result;
			}
			
			throw new Exception("Unexpected parsed value");
		}

		public static dynamic FromString(string str)
		{
			var stream = new YamlStream ();
			stream.Load (new StringReader (str));
			dynamic result;
			if (TryMapValue(stream.Documents[0].RootNode, out result))
			{
				return result;
			}
			
			throw new Exception("Unexpected parsed value");
		}

		public static IEnumerable<dynamic> LoadAll (string fileName)
		{
			var stream = new YamlStream ();
			stream.Load (new StreamReader (fileName));
			foreach (var doc in stream.Documents)
			{
				dynamic result;
				if (TryMapValue (doc.RootNode, out result))
					yield return result;
				else
					throw new Exception("Unexpected parsed value");
			}
			

		}

		private static object MapValue(object value)
		{
			object result;
			TryMapValue(value, out result);
			return result;
		}
		
		internal static bool TryMapValue(object value, out object result)
		{
			if (value is YamlMappingNode)
			{
				result = new YamlMapping (value as YamlMappingNode);
				return true;
			}

			if (value is YamlSequenceNode)
			{
				var seq = value as YamlSequenceNode;
				List<object> objects = new List<object> ();
				foreach (var node in seq)
					objects.Add (MapValue (node));
				result = objects;
				return true;
			}

			if (value is YamlScalarNode)
			{
				value = (value as YamlScalarNode).Value;
			}

			if (value is string)
			{
				result = value as string;
				return true;
			}

			result = null;
			return false;
		}
	}
	
	public class YamlMapping : DynamicObject, IEnumerable<KeyValuePair<string,object>>
	{
		private readonly YamlMappingNode _mapping;
		
		public YamlMapping(YamlMappingNode mapping)
		{
			_mapping = mapping;
		}
		
		public override bool TryGetMember(GetMemberBinder binder, out object result)
		{
			if (TryGetValue(binder.Name, out result))
				return true;
			
			return base.TryGetMember(binder, out result);
		}
		
		private bool TryGetValue(string key, out object result)
		{
			YamlNode value;
			if (_mapping.Children.TryGetValue (new YamlScalarNode (key), out value))
			{
				if (YamlDoc.TryMapValue(value, out result))
					return true;
			}
			
			result = null;
			return true;
		}
		
		public override bool TryGetIndex(GetIndexBinder binder, object[] indexes, out object result)
		{
			var key = indexes[0] as string;
			if (key != null)
			{
				if (TryGetValue(key, out result))
					return true;
			}
			
			return base.TryGetIndex(binder, indexes, out result);
		}

		public bool ContainsKey (string key)
		{
			foreach (var entry in _mapping.Children)
			{
				if ((entry.Key as YamlScalarNode).Value == key)
					return true;
			}
			return false;
		}

		public IEnumerable<string> Keys
		{
			get
			{
				foreach (var entry in _mapping.Children)
				{
					yield return (entry.Key as YamlScalarNode).Value;
				}
			}
		}

		#region IEnumerable implementation
		
		IEnumerator IEnumerable.GetEnumerator ()
		{
			return _GetEnumerator ();
		}
		
		#endregion

		#region IEnumerable implementation

		public IEnumerator<KeyValuePair<string, object>> GetEnumerator ()
		{
			return _GetEnumerator ();
		}

		private IEnumerator<KeyValuePair<string, object>> _GetEnumerator ()
		{
			foreach (var entry in _mapping.Children)
			{
				string key = (entry.Key as YamlScalarNode).Value;
				object value;
				if (YamlDoc.TryMapValue (entry.Value, out value))
					yield return new KeyValuePair<string,object> (key, value);
			}
		}

		#endregion
	}
}
