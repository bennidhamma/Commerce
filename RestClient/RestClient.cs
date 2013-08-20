using System;
using System.Net;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;

namespace ForgottenArts.Commerce
{
	public class RestClient
	{
		WebClientEx wc = new WebClientEx ();
		string server;

		public string Server {
			get {
				return this.server;
			}
			set {
				server = value;
			}
		}
		
		public RestClient (string server)
		{
			this.server = server;
			wc.Headers.Add ("Content-Type", "application/json");
		}
		
		public void AddHeader (string name, string val)
		{
			wc.Headers.Add (name, val);
		}		
		
		private dynamic DoRequest(string verb, Func<string> func)
		{
			string resp = null;
      Console.WriteLine("Doing request " + verb + " -- " + func);
			try
			{			
				resp = func();
			}
			catch (WebException we)
			{
        if (we.Response != null) {
          StreamReader sr = new StreamReader (we.Response.GetResponseStream ());
          Console.Error.WriteLine ( sr.ReadToEnd ());
        } else {
          Console.Error.WriteLine(we.Message);
        }
				throw new Exception ("Error in " + verb, we);
			}
      Console.WriteLine("response: " + resp);
			if (resp.StartsWith ("["))
			    return JArray.Parse (resp);
			else
			    return JsonConvert.DeserializeObject<DynamicDictionary>(resp);	
		}
		
		public dynamic Get (string endpoint)
		{
      var url = server + endpoint;
      Console.WriteLine("getting " + url);
			return DoRequest("GET", delegate {
        Console.WriteLine("Get callback - wc: " + wc);
        Console.WriteLine("url: " + url);
        var r = wc.OpenRead(url);
        Console.WriteLine("reader: " + r);
        var sr = new StreamReader(r);
        Console.WriteLine("stream reader: " + sr);
        var str = sr.ReadToEnd();
        Console.WriteLine("str: " + str);
        return str;
				//return new StreamReader (wc.OpenRead(server + endpoint)).ReadToEnd ();
			});
		}
		
		public dynamic Post (string endpoint, object postData)
		{
			string jsonPost =  JsonConvert.SerializeObject (postData);
			return DoRequest("POST", delegate {
				return wc.UploadString (server + endpoint, "POST", jsonPost).Trim();
			});
		}
		
		public dynamic Put (string endpoint, object postData)
		{
			string jsonPost =  JsonConvert.SerializeObject (postData);
			return DoRequest("PUT", delegate {
				return wc.UploadString (server + endpoint, "PUT", jsonPost).Trim();
			});
		}
		
		public dynamic Delete (string endpoint)
		{
			return DoRequest("DELETE", delegate {
				var req = wc.GetRequest (server + endpoint);
				req.Method = "DELETE";
				var resp = req.GetResponse ();
				return new StreamReader (resp.GetResponseStream()).ReadToEnd ();
			});
		}
	}
	
	class WebClientEx : WebClient
    {
        public static CookieContainer CookieContainer { get; private set; }

        public WebClientEx()
        {
            CookieContainer = new CookieContainer();
            this.UseDefaultCredentials = true;
        }

        protected override WebRequest GetWebRequest(Uri address)
        {
            var request = base.GetWebRequest(address);
            if (request is HttpWebRequest)
            {
                (request as HttpWebRequest).CookieContainer = CookieContainer;
            }
            return request;
        }
		
		public WebRequest GetRequest (string address)
		{
			return GetWebRequest (new Uri (address));
		}
    }
}

