const XMLHttpRequest = require("request");
const RPCVersion = "2.0"

/**
 * Kodi Controller allows Playing, Pausing and more
 */
module.exports = class Controller {
	/**
	 * @param {string} ip The IP address that Kodi is on
	 * @param {number} port The port that Kodi is configured for (Default is 8080)
	 */
	constructor(ip = "localhost", port = 8080) {
		this.url = `http://${ip}:${port}/jsonrpc`;
	}

	/**
	 * Sends a request to Kodi with body as the body of the request, handles errors as needed
	 * @param {Object} body The body of the request
	 * @param {Function} callback Function called when request is finished with argumemnts of
	 string (err), HTTP.IncomingMessage (response), string/Buffer (body)
	 */
	sendRequest(body, callback) {
		const url = this.url;
		request.post(url, {json: body})
		.on("response", callback)
		.on("error", err => {
			console.log(`Something went wrong :( - ${err}\nRequest body: ${JSON.stringify(body)}`)
		});
	}

	/**
	 * Gets the ID of the active player from Kodi, passes it to a callback with arguments
	 * string (playerID)
	 */
	getActivePlayerID(callback) {
		this.sendRequest({
			"jsonrpc": RPCVersion,
			"method": "Player.GetActivePlayers",
			"id" : 1
		}, (err, response) => {
			if (err){
				conosle.log("error: " + err);
				return;
			}

			callback(data.result[0].playerid);
		});
	}

	/**
	 * Plays kodi if paused and pauses if playing
	 */
	playPause() {
		this.getActivePlayerID(playerID => {
			this.sendRequest({
				"jsonrpc": RPCVersion,
				"method": "Player.PlayPause",
				"params": {"playerid" : playerID},
				"id" : 1
			});
		});
	}
};


