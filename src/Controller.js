const request = require("request");
const netList = require('network-list');
const isPortReachable = require('is-port-reachable');
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
     * Searches the network for Kodi's on the supplied port
     * @param {Function} callback The callback function called with the params (err, data) with data being a list of ip's and port
     * @param {number} port The port that Kodi is configured for (Default is 8080)
     */
    scanForKodis(callback, port = 8080) {
        let kodis = [];
        netList.scan({}, async (err, arr) => {
            let aliveIPs = arr.filter(ip => ip.alive);
            console.log(`Found: ${aliveIPs.length} IP's`);
            for (let i = 0; i < aliveIPs.length; i++) {
                console.log(`Trying IP: ${aliveIPs[i].ip}`);
                let address = `http://${aliveIPs[i].ip}:${port}/jsonrpc`;
                await this.pingKodi(address).then((x) => {
                    if(x){
                        console.log("Found a Kodi instance!");
                        kodis.push(aliveIPs[i].ip);
                    }
                }).then(() => {if(i === (aliveIPs.length - 1)){callback(err, kodis)}});
            }
        });
    }

    /**
    * Pings an address to check if it is responding and running Kodi.
    * @param {string} address Address to ping
    * @returns {Promise} Promise which resolves with eithe true or false depending on if the ping succeeded or failed.
    */
    pingKodi(address){
        return new Promise((resolve) => {
            request(address, (err, res, body) => {
                if (!err && res.statusCode == 200){
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Sends a request to Kodi with body as the body of the request, handles errors as needed
     * @param {string}  method The method we are calling
     * @param {Object} params The parameters for the method
     * @param {Function} callback? Function called when request is finished with arguments of
     *      string (err), string (body)
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
                packet.on("data", (packetData) => { data += packetData; });
            })
            .on("error", (err) => {
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
     * Shutdown
     * @param {Function} callback The callback function called with the params (err, data)
     */
    shutdown(callback = function () {}) {
        this.sendRequest("System.Shutdown", {}, callback);
    }

    /**
     * Restart
     * @param {Function} callback The callback function called with the params (err, data)
     */
    restart(callback = function () {}) {
        this.sendRequest("System.Reboot", {}, callback);
    }

    /**
     * Repeat Off
     * @param {Function} callback The callback function called with the params (err, data)
     */
    repeatOff(callback = function () {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.SetRepeat", {playerid: playerID, "repeat":"off" }, callback);
        }); 
    }

    /**
     * Repeat One
     * @param {Function} callback The callback function called with the params (err, data)
     */
    repeatOne(callback = function () {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.SetRepeat", {playerid: playerID, "repeat":"one" }, callback);
        }); 
    }

    /**
     * Repeat All
     * @param {Function} callback The callback function called with the params (err, data)
     */
    repeatAll(callback = function () {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.SetRepeat", {playerid: playerID, "repeat":"all" }, callback);
        }); 
    }

    /**
     * Gets the current players volume
     * @param {Function} callback The callback function called with the params (err, data) with data being the volume
     */
    getVolume(callback) {
        if (!callback) {throw "Callback must be supplied for getVolume!"; }
        this.sendRequest("Application.GetProperties", {"properties": ["volume"]}, (err, data) => {
            if(err) { callback(err); }
            callback(err, data.volume);
        });
    }

    /**
     * Gets the ID of the active player from Kodi
     *  @param {Function} callback The callback function called with the params (err, data) with data being the ID
     */
    getActivePlayerID(callback) {
        if (!callback) {throw "Callback must be supplied for getActivePlayerID!"; }
        this.sendRequest("Player.GetActivePlayers", null, (err, data) => {
            if (err){ 
                callback(err); 
                return;        
            }
            
            callback(err, data[0].playerid);
        });
    }

    /**
     * Stops kodi
     * @param {Function} callback The callback function called with err, callback
     */
    stop(callback = function() {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.Stop", {playerid: playerID}, callback);
        });
    }


    /**
     * Goes to Kodi home menu
     * @param {Function} callback The callback function called with the params (err, data)
     */
    goHome(callback = function() {}) {
        this.sendRequest("Input.Home", null, callback);
        /**
         * Navigates down in the menu
         * @param  {Function} callback The callback function called with the params (err, data)
         */
    }

    /**
     * Brings up the context menu
     * @param  {Function} callback The callback function called with the params (err, data)
     */
    contextMenu(callback = function() {}) {
        this.sendRequest("Input.ContextMenu", null, callback);
    }

    /**
     * Selects the current menu item
     * @param  {Function} callback The callback function called with the params (err, data)
     */
    select(callback = function() {}) {
        this.sendRequest("Input.Select", null, callback);
    }

    /**
     * Navigates left in the menu
     * @param  {Function} callback The callback function called with the params (err, data)
     */
    goLeft(callback = function() {}) {
        this.sendRequest("Input.Left", null, callback);
    }

    /**
     * Navigates right in the menu
     * @param  {Function} callback The callback function called with the params (err, data)
     */
    goRight(callback = function() {}) {
        this.sendRequest("Input.Right", null, callback);
    }

    /**
     * Navigates up in the menu
     * @param  {Function} callback The callback function called with the params (err, data)
     */
    goUp(callback = function() {}) {
        this.sendRequest("Input.Up", null, callback);
    }

    /**
     * Navigates down in the menu
     * @param  {Function} callback The callback function called with the params (err, data)
     */
    goDown(callback = function() {}) {
        this.sendRequest("Input.Down", null, callback);
    }

    /**
     * Goes back in the menu
     * @param {Function} callback The callback function called with the params (err, data)
     */
    goBack(callback = function() {}) {
        this.sendRequest("Input.Back", null, callback);
    }

    /**
     * Media Controls section
     */

    /**
     * Plays Kodi if paused and pauses if playing
     * @param {Function} callback The callback function called with err, callback
     */
    playPause(callback = function() {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.PlayPause", {playerid: playerID}, callback);
        });
    }

    /**
     * Pauses Kodi
     * @param {Function} callback The callback function called with err, callback
     */
    pause(callback = function() {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.PlayPause", {playerid: playerID, play: false}, callback);
        });
    }

    /**
     * Plays Kodi
     * @param {Function} callback The callback function called with err, callback
     */
    play(callback = function() {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.PlayPause", {playerid: playerID, play: true}, callback);
        });
    }
    /**
     * Skips to next media
     * @param {Function} callback The callback function called with err, callback
     */
    goNext(callback = function() {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.GoTo", {playerid: playerID, "to":"next"}, callback);
        });
    }

    /**
     * Goes to start or previous media
     * @param {Function} callback The callback function called with err, callback
     */
    goPrevious(callback = function() {}) {
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.GoTo", {playerid: playerID, "to":"previous"}, callback);
        });
    }

    /**
     * Sets the volume
     * @param {Function} callback The callback function called with the params (err, data) with data being the volume
     * @param {int} volume The volume to set the player to
     */
    setVolume(callback = function () {}, volume) {
        this.sendRequest("Application.SetVolume", {"volume": volume}, callback);
    }

    /**
     * Increases the volume
     * @param {Function} callback The callback function called with err, callback
     * @param {number} volumeChangeBy How much to increase the volume by
     */
    volumeUp(callback = function() {}, volumeChangeBy = 5) {
        if(volumeChangeBy < 0) { callback("volumeChangeBy must be positive!"); return; }
        this.getVolume((err, currentVolume) => {
            if (err){ callback(err); return; }
            this.sendRequest("Application.SetVolume", {"volume" : currentVolume + volumeChangeBy}, callback);

        });

    }

    /**
     * Decreases the volume
     * @param {Function} callback The callback function called with err, callback
     * @param {number} volumeChangeBy How much to decrease the volume by
     */
    volumeDown(callback = function() {}, volumeChangeBy = 5) {
        if(volumeChangeBy < 0) { callback("volumeChangeBy must be positive!"); return; }
        this.getVolume((err, currentVolume) => {
            if (err){ callback(err); return; }
            this.sendRequest("Application.SetVolume", {"volume" : currentVolume - volumeChangeBy}, callback);
        });

    }

    /**
     * Fast forwards
     * @param {Function} callback The callback function called with err, callback
     * @param {number} speed The speed to fast forward with
     *      speed has to be in [2, 4, 8, 16, 32]
     */
    fastForward(callback = function() {}, speed = 2) {
        let allowedSpeeds = [2, 4, 8, 16, 32];
        if(speed < 0) { callback("Speed must be positive!");}
        else if(!allowedSpeeds.includes(speed)) {callback("Speed must be in [2, 4, 8, 16, 32]"); }
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            else {
                this.sendRequest("Player.SetSpeed", {playerid:playerID,"speed":speed}, callback);
            }
        });
    }

    /**
     * Rewinds
     * @param {Function} callback The callback function called with err, callback
     * @param {number} speed The speed to rewind by
     *      speed has to be in [2, 4, 8, 16, 32]
     */
    rewind(callback = function() {}, speed = 2) {
        let allowedSpeeds = [2, 4, 8, 16, 32];
        if(speed < 0) { callback("Speed must be positive!");}
        else if(!allowedSpeeds.includes(speed)) {callback("Speed must be in [2, 4, 8, 16, 32]"); }
        this.getActivePlayerID((err, playerID) => {
            if (err){ callback(err); return; }
            this.sendRequest("Player.SetSpeed", {playerid:playerID,"speed":-speed}, callback);
        });
    }

    /**
     * Shows info on the current video playing
     * @param {Function} callback The callback function called with the params (err, data) with data being the volume
     */
    showInfo(callback = function () {}) {
        this.sendRequest("Input.Info", null, callback);
    }

    /**
     * Toggles mute
     * @param {Function} callback The callback function called with the params (err, data) with data being the volume
     */
    toggleMute(callback = function () {}) {
        this.sendRequest("Application.SetMute", {"mute": "toggle"}, callback);
    }

    /**
     * Toggles fullscreen
     * @param {Function} callback The callback function called with the params (err, data) with data being the volume
     */
    toggleFullscreen(callback = function () {}) {
        this.sendRequest("GUI.SetFullscreen", {"fullscreen": "toggle"}, callback);
    }

    /**
     * Quits the application
     * @param {Function} callback The callback function called with the params (err, data) with data being the volume
     */
    quit(callback = function () {}) {
        this.sendRequest("Application.Quit", null, callback);
    }

    /**
    * Shows the context menu
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputContextMenu(callback = function(){}){
        this.sendRequest("Input.ContextMenu", null, callback);
    }

    /**
    * Execute a specific action
    * @param {string} action Action to be executed (see https://kodi.wiki/view/JSON-RPC_API/v8#Input.Action)
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputAction(iAction, callback = function(){}){
        this.sendRequest("Input.ExecuteAction", {action: iAction}, callback);
    }

    /**
    * Goes to home window in GUI
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputHome(callback = function(){}){
        this.sendRequest("Input.Home", null, callback);
    }

    /**
    * Shows the information dialog
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputInfo(callback = function(){}){
        this.sendRequest("Input.Info", null, callback);
    }

    /**
    * Select an item in GUI
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputSelect(callback = function(){}){
        this.sendRequest("Input.Select", null, callback);
    }

    /**
    * Sends generic (unicode) text to be inserted into a text box in the GUI
    * @param {string} text Text to be sent
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputSendText(str, callback = function(){}){
        this.sendRequest("Input.SendText", {text: str}, callback);
    }

    /**
    * Show codec information of the playing item
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputShowCodec(callback = function(){}){
        this.sendRequest("Input.ShowCodec", null, callback);
    }

    /**
    * Shows the on-screen display for the current player
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputShowOSD(callback = function(){}){
        this.sendRequest("Input.ShowOSD", null, callback);
    }

    /**
    * Show player process information of the playing item, like video decoder, pixel format, pvr signal strength, ...
    * @param {Function} callback The callback function called with the params (err, data)
    */
    inputShowPlayerProcessInfo(callback = function(){}){
        this.sendRequest("Input.ShowPlayerProcessInfo", null, callback);
    }

    /**
    * Retrieves the values of the given properites
    * @param {Array} properties Array of properies to retrieve (see https://kodi.wiki/view/JSON-RPC_API/v8#GUI.Property.Name)
    * @param {Function} callback The callback function called with the params (err, data)
    */
    getProperties(props, callback = function(){}){
        this.sendRequest("GUI.GetProperties", {properties: props}, callback);
    }

    /**
    * Gets the active window the user is using
    * @param {Function} callback The callback function called with the params (err, data) (see https://kodi.wiki/view/JSON-RPC_API/v8#GUI.Property.Value)
    */
    getCurrentWindow(callback = function(){}){
        this.getProperties(["currentwindow"], (err, data) => {
            if (err){
                callback(err);
                return;
            }

            if (!data || !data.currentwindow){
                callback("could not find currentwindow");
            }

            callback(err, data.currentwindow.label);
        });
    }
}

module.exports = Controller;


