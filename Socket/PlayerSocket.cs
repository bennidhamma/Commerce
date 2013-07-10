using System;
using Bauglir.Ex;
using log4net;
using System.Net.Sockets;
using Newtonsoft.Json;

namespace ForgottenArts.Commerce
{
	public class PlayerSocket : WebSocketServerConnection
	{
		static readonly ILog log = LogManager.GetLogger(typeof(PlayerSocket));
		
		public PlayerSocket(TcpClient aClient, WebSocketServer aParent): base(aClient, aParent)
		{
			log.Debug ("constructing PlayerSocketHandler instance.");
		}
		
		protected override void ProcessText (bool aReadFinal, bool aRes1, bool aRes2, bool aRes3, string aString)
		{
			Receive (aString);
		}
		
		private string key;

		public string Key {
			get {
				return key;
			}
			set {
				key = value;
			}
		}

		public void Receive (string data)
		{
			//TODO: unless the type is to set player, if player is not set, deny the request.
			log.Debug("Received Data: " + data);
			//first line is the type.
			string channel = "";
			int firstLine = data.IndexOf('\n');
			if (firstLine == -1)
			{
				log.Warn ("error parsing received data");
				return;
			}
			channel = data.Substring(0, firstLine);
			data = data.Remove(0, firstLine+1);
			log.DebugFormat("channel is: [{0}], data is: [{1}]", channel, data);
			try
			{
				dynamic message = JsonConvert.DeserializeObject<DynamicDictionary>(data);

				if (channel == "setPlayer") {
					log.Debug ("setting player");
					if (this.key != null) {
						PlayerSocketServer.Instance.DissasociateSocket(key);
					}
					long gameId = Convert.ToInt64 (message.gameId);
					string playerKey = message.playerKey;
					this.key = PlayerGame.MakeKey (gameId, playerKey);
					PlayerSocketServer.Instance.AssociateSocket (this.key, this);
					log.DebugFormat ("Socket set to " + this.key);
				}

				if (this.key == null)
					throw new Exception ("Cannot publish message because this socket does not have a player associated.");

				if (PlayerSocketServer.Instance != null)
				{
					PlayerSocketServer.Instance.DispatchMessage (channel, message);
				}
			}
			catch (Exception e)
			{
				log.Error (e);
			}
		}
	}
}

