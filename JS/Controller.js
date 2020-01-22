const request = require("request");
const RPCVersion = "2.0";
const ID = 1;

/**
 * Kodi Controller allows Playing, Pausing and more
 */
class Controller {
	/**
	 * @param {string} ip The IP address that Kodi is on
	 * @param {number} port The port that Kodi is configured for (Default is 8080)
	 * @constructor
	 */
	constructor(ip = "localhost", port = 8080) {
		this.url = `http://${ip}:${port}/jsonrpc`;
	}

	/**
	 * Sends a request to Kodi with body as the body of the request, handles errors as needed
	 * @param {string}  method The method we are calling
	 * @param {Object} params The parameters for the method
	 * @param {Function} callback Function called when request is finished with arguments of
	 * 		string (err), string (body)
	 */
	sendRequest(method, params, callback) {
		let data = "";
		let body = {
			"jsonrpc": RPCVersion,
			"method": method,
			"id": ID
		};
		if (params) { body.params = params; } // If params are supplied add them to the request

		request.post(this.url, {json: body})
		.on("response", (packet) => { 
			packet.on("data", packetData => { data += packetData; });
		})
		.on("error", err => {
			if (callback){ callback(err); }
		})
		.on("end", () => {
			let err;
			let result;
			try {
				let parsed = JSON.parse(data);
				err = parsed.error;
				result = parsed.result;
			} catch (e) { err = e.error; }

			if (callback){ callback(err, result); }

		});
	}

	/**
	 * Gets the ID of the active player from Kodi
	 *  @param {Function} callback The callback function called with the params (err, data)
	 */
	getActivePlayerID(callback) {
		this.sendRequest("Player.GetActivePlayers", null, (err, data) => {
			if (!err){
				callback(err, data[0].playerid);
			} else {
				callback(err);
			}
		});
	}

	/**
	 * Plays kodi if paused and pauses if playing
	 */
	playPause() {
		this.getActivePlayerID((err, playerID) => {
			if (!err){
				this.sendRequest("Player.PlayPause", {playerid: playerID}, null);
				console.log("INFO: Play / Pause successfully executed.");
			} else {
				console.log("ERROR: \n" + err);
			}
		});
	}
}

module.exports = Controller;


