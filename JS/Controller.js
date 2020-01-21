const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
     * Sends a request to Kodi with body as the body of the request
     * @param {Object} body The body of the request
     * @returns {Promise<string>}
     */
    async send_request(body) {
        // Create the XHR request
        const request = new XMLHttpRequest();
        const url = this.url;

        // Return it as a Promise
        return new Promise(function(resolve, reject) {
            request.onreadystatechange = function() {
                // Only run if the request is complete
                if (request.readyState !== 4) return;

                // Process the response
                if (request.status >= 200 && request.status < 300) {
                    // If successful
                    resolve(JSON.parse(this.responseText));
                } else {
                    // If failed
                    reject({status : request.status, statusText : request.statusText});
                }
            };
            request.open("POST", url, true);
            request.setRequestHeader('Content-Type',
                                   'application/json; charset=utf-8');
            request.send(JSON.stringify(body));
        });
    }

    /**
     * Gets the ID of the active player from Kodi
     * @returns {Promise<number>}
     */
    async getActivePlayerID() {
        let self = this; // Need pointer to this as nested promise function changes
                         // reference

        return new Promise(function(resolve, reject) {
            self.send_request({
                "jsonrpc" : "2.0",
                "method" : "Player.GetActivePlayers",
                "id" : 1
            })
            .then(data => { resolve(data["result"][0]["playerid"]); })
            .catch(error => {
                console.log("Something went wrong :(", error);
                reject(error);
            });
        })
    }

    /**
     * Plays kodi if paused and pauses if playing
     */
    playPause() {
        this.getActivePlayerID().then(
            player_id => {this.send_request({
                "jsonrpc" : "2.0",
                "method" : "Player.PlayPause",
                "params" : {"playerid" : player_id},
                "id" : 1})
            .catch(error => { console.log("Error: ", error); })});
      }
};

