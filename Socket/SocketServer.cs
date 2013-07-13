using System;
using Bauglir.Ex;
using System.Net.Sockets;
using log4net;
using System.Collections.Generic;
using System.Net;
using ServiceStack.Text;

namespace ForgottenArts.Commerce
{
	public class SocketServer : WebSocketServer
	{
		public override WebSocketServerConnection GetConnectionInstance(
			TcpClient aClient,
			WebSocketHeaders aHeaders,
			string aHost, string aPort, string aResourceName, string aOrigin, string aCookie, string aVersion,
			ref string aProtocol, ref string aExtension,
			ref int aHttpCode
			)
		{
			return new PlayerSocket(aClient, this);
		}
	}

	public class PlayerSocketServer
	{
		public static PlayerSocketServer Instance {get; set;}

		private static readonly ILog log = LogManager.GetLogger(typeof(PlayerSocketServer));
		SocketServer wss;
		
		List<PlayerSocket> Sockets = new List<PlayerSocket> ();

		// TODO: support multiple sockets per player.
		Dictionary<string, PlayerSocket> SocketsByPlayers = new Dictionary<string, PlayerSocket> ();
		
		public PlayerSocketServer ()
		{
		}
		
		public bool PlayerOnline (PlayerGame p)
		{
			return SocketsByPlayers.ContainsKey (p.GetKey());
		}
		
		public void AddSocket (PlayerSocket socket)
		{
			Sockets.Add (socket);
		}
		
		public void AssociateSocket (string key, PlayerSocket socket)
		{
			SocketsByPlayers[key] = socket;
		}

		public void DissasociateSocket (string key)
		{
			SocketsByPlayers.Remove (key);
		}
		
		public void RemoveSocket (PlayerSocket ps)
		{
			if (ps.Key != null && SocketsByPlayers.ContainsKey (ps.Key))
				SocketsByPlayers.Remove(ps.Key);
			Sockets.Remove (ps);
		}
		
		public void Init()
		{
			log.Debug ("Initializing PlayerSocket Server");
			wss = new SocketServer ();
			wss.SocketError += HandleWssSocketError;
			wss.AfterAddConnection += HandleWssAfterAddConnection;
			wss.Start (IPAddress.Any, 8082);
			log.Debug ("Socket server started.");
		}
		
		void HandleWssAfterAddConnection (WebSocketServer aServer, WebSocketServerConnection aConnection)
		{
			log.DebugFormat ("HandleWssAfterAddConnection {0}, {1}", aServer, aConnection);
			var p = aConnection as PlayerSocket;
			AddSocket(p);
			aConnection.ConnectionClose += delegate {
				log.Debug ("removing socket");
				try
				{
					RemoveSocket (p);
				}
				catch (Exception e)
				{
					log.Error ("Error removing socket", e);	
				}
			};
		}
		
		void HandleWssSocketError (WebSocketServer aServer, System.Net.Sockets.SocketException aException)
		{
			log.Error ("HandleWssSocketError", aException);
		}

		public void Send (object message, string channel, Game game)
		{
			var data = PrepareMessage(message, channel);
			foreach (var player in game.Players) {
				if (player != null) {
					Send (data, player);
				}
			}
		}
		
		public void Send (object message, string channel, PlayerGame player)
		{
			if (player == null) {
				log.Warn("Sending to null player");
				return;
			}
			var key = player.GetKey ();
			if (SocketsByPlayers.ContainsKey (key))
			{
				string data = PrepareMessage (message, channel);
				SocketsByPlayers[key].SendText (data);
			}
		}

		public void Send (string data, PlayerGame player)
		{
			var key = player.GetKey ();
			if (SocketsByPlayers.ContainsKey (key))
			{
				SocketsByPlayers[key].SendText (data);
			}
		}
		
		public void Send (object message, string channel)
		{
			Send (message, channel, (Predicate<PlayerSocket>)null);
		}
		
		public void Send (object message, string channel, Predicate<PlayerSocket> predicate)
		{
			string data = PrepareMessage (message, channel);
			foreach (var s in Sockets)
			{
				if (s == null)
					continue;
				//log.Debug ("Sending data to player socket", data, predicate(s));
				if (predicate == null || predicate(s))
				{
					s.SendText (data);
				}
			}
		}
		
		string PrepareMessage (object message, string channel)
		{
			var msg = new Message () {
				Channel = channel,
				Body = message
			};
			return msg.ToJson();
		}

		public void DispatchMessage (string channel, dynamic message) {
			if (Receive != null) {
				Receive (this, new SocketMessageArgs() {Channel = channel, Message = message});
			}
		}

		public event EventHandler<SocketMessageArgs> Receive;

		public class SocketMessageArgs : EventArgs
		{
			public string Channel {get; set;}
			public dynamic Message {get; set;}
		}

		public class Message {
			public string Channel {get; set;}
			public object Body {get; set;}
		}
	}
}

