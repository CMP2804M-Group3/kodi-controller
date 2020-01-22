const XMLHttpRequest = require("request");
const RPCVersion = "2.0";
const ID = "Joe Pitts";

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
	 * string (err), string (body)
	 */
	sendRequest(method, params, callback) {
		const url = this.url;
		var data = "";

		request.post(url, {json: {
			"jsonrpc": RPCVersion,
			"method": method,
			"params": params,
			"id": ID
		}})
		.on("response", pkt => { data += pkt } )
		.on("error", err => {
			if (callback != null){
				callback(err);
			}
		})
		.on("end", () => {
			var err;
			var result;

			try {
				var parsed = JSON.parse(data);
				err = data.error;
				result = data.result;
			} catch (e) {
				err = e.error
			}

			if (callback != null){
				callback(err);
			}
		});
	}

	/**
	 * Gets the ID of the active player from Kodi, passes it to a callback with arguments
	 * string (error), string (playerID)
	 */
	getActivePlayerID(callback) {
		this.sendRequest("Player.GetActivePlayers", null, (err, data) => {
			callback(err, data[0].playerid);
		});
	}

	/**
	 * Plays kodi if paused and pauses if playing
	 */
	playPause() {
		this.getActivePlayerID((err, playerID) => {
			if (!err){
				this.sendRequest("Player.PlayPause", {playerid: playerID});
			} else {
				console.log("something went wrong :(\n" + err);
			}
		});
	}
};


