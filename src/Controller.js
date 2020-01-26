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
	 * @param {Function} callback? Function called when request is finished with arguments of
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
	 * Gets the current players volume
	 * @param {Function} callback The callback function called with the params (err, data) with data being the volume
	 */
	getVolume(callback) {
		if (!callback) {console.error("Callback must be supplied for getVolume!"); return;}
		this.sendRequest("Application.GetProperties", {"properties": ["volume"]}, (err, data) => {
			if(err) { callback(err); }
			else { callback(err, data.volume); }
		});
	}

	/**
	 * Gets the ID of the active player from Kodi
	 *  @param {Function} callback The callback function called with the params (err, data) with data being the ID
	 */
	getActivePlayerID(callback) {
		if (!callback) {console.error("Callback must be supplied for getActivePlayerID!"); return;}
		this.sendRequest("Player.GetActivePlayers", null, (err, data) => {
			if (err){ callback(err); }
			else{ callback(err, data[0].playerid); }
		});
	}

	/**
	 * Plays kodi if paused and pauses if playing
	 * @param {Function} callback The callback function called with err, callback
	 */
	playPause(callback = function() {}) {
		this.getActivePlayerID((err, playerID) => {
			if (err){ callback(err); }
			else{ this.sendRequest("Player.PlayPause", {playerid: playerID}, callback); }
		});
	}

	/**
	 * Pauses kodi
	 * @param {Function} callback The callback function called with err, callback
	 */
	pause(callback = function() {}) {
		this.getActivePlayerID((err, playerID) => {
			if (err){ callback(err); }
			else{ this.sendRequest("Player.PlayPause", {playerid: playerID, play: false}, callback); }
		});
	}

	/**
	 * Plays kodi
	 * @param {Function} callback The callback function called with err, callback
	 */
	play(callback = function() {}) {
		this.getActivePlayerID((err, playerID) => {
			if (err){ callback(err); }
			else { this.sendRequest("Player.PlayPause", {playerid: playerID, play: true}, callback); }
		});
	}
	/**
	 * Skips to next media
	 * @param {Function} callback The callback function called with err, callback
	 */
	goNext(callback = function() {}) {
		this.getActivePlayerID((err, playerID) => {
			if (err){ callback(err); }
			else { this.sendRequest("Player.GoNext", {playerid: playerID}, callback); }
		});
	}

	/**
	 * Goes to start or previous media
	 * @param {Function} callback The callback function called with err, callback
	 */
	goPrevious(callback = function() {}) {
		this.getActivePlayerID((err, playerID) => {
			if (err){ callback(err);}
			else{ this.sendRequest("Player.GoPrevious", {playerid: playerID}, callback); }
		});
	}

	/**
	 * Increases the volume
	 * @param {Function} callback The callback function called with err, callback
	 * @param {number} volumeChangeBy How much to increase the volume by
	 */
	volumeUp(callback = function() {}, volumeChangeBy = 5) {
		if(volumeChangeBy < 0) { callback("volumeChangeBy must be positive!");}
		else {
			this.getVolume((err, currentVolume) => {
				if (err){ callback(err); }
				else {
					this.sendRequest("Application.SetVolume", {"volume" : currentVolume + volumeChangeBy}, callback);
				}
			});
		}
	}

	/**
	 * Decreases the volume
	 * @param {Function} callback The callback function called with err, callback
	 * @param {number} volumeChangeBy How much to decrease the volume by
	 */
	volumeDown(callback = function() {}, volumeChangeBy = 5) {
		if(volumeChangeBy < 0) { callback("volumeChangeBy must be positive!");}
		else {
			this.getVolume((err, currentVolume) => {
				if (err){ callback(err); }
				else {
					this.sendRequest("Application.SetVolume", {"volume" : currentVolume - volumeChangeBy}, callback);
				}
			});
		}
	}

	/**
	 * Fast forwards
	 * @param {Function} callback The callback function called with err, callback
	 * @param {number} speed The speed to fast forward with
	 * 		speed has to be in [2, 4, 8, 16, 32]
	 */
	fastForward(callback = function() {}, speed = 2) {
		let allowedSpeeds = [2, 4, 8, 16, 32];
		if(speed < 0) { callback("Speed must be positive!");}
		else if(!allowedSpeeds.includes(speed)) {callback("Speed must be in [2, 4, 8, 16, 32]"); }
		else {
			this.getActivePlayerID((err, playerID) => {
				if (err){ callback(err); }
				else {
					this.sendRequest("Player.SetSpeed", {playerid:playerID,"speed":speed}, callback);
				}
			});
		}
	}

	/**
	 * Rewinds
	 * @param {Function} callback The callback function called with err, callback
	 * @param {number} speed The speed to rewind by
	 * 		speed has to be in [2, 4, 8, 16, 32]
	 */
	rewind(callback = function() {}, speed = 2) {
		let allowedSpeeds = [2, 4, 8, 16, 32];
		if(speed < 0) { callback("Speed must be positive!");}
		else if(!allowedSpeeds.includes(speed)) {callback("Speed must be in [2, 4, 8, 16, 32]"); }
		else {
			this.getActivePlayerID((err, playerID) => {
				if (err){ callback(err); }
				else {
					this.sendRequest("Player.SetSpeed", {playerid:playerID,"speed":-speed}, callback);
				}
			});
		}
	}

}

module.exports = Controller;


