using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Net;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

namespace kodiController
{
    public class Controller
    {
        private string url;
        private WebClient webClient = new WebClient();
        public Controller(string ip = "127.0.0.1", string port = "8080")
        {
            url = "http://" + ip + ":" + port + "/jsonrpc";
            Debug.WriteLine("Created Controller with url of " + url, "KODI");
        }

        /// <summary>
        /// Sends a JSON request to KODI using body as the data
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        public JObject SendRequest(string body)
        {
            var responseString = webClient.UploadString("http://localhost:8080/jsonrpc", "POST", body);
            JObject response = JObject.Parse(responseString);
            return response;
        }

        public void PlayPause()
        {
            var json = "{\"jsonrpc\": \"2.0\", \"method\": \"Player.PlayPause\",\"params\": {\"playerid\": 1}, \"id\": 1}";
            var result = SendRequest(json);
            Console.WriteLine(result);
        }
    }
}