var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class Controller{

    constructor(ip = "localhost", port = 8080){
        this.url ="http://"+ip+":"+port+"/jsonrpc";

    }

    async send_request(body) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(body));

        xhr.onreadystatechange = async function() {
            if (this.readyState != 4) return;
        
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                return data;
            }
        }

    }

    get_active_players(){
        let data = this.send_request({"jsonrpc": "2.0",
                        "method": "Player.GetActivePlayers",
                        "id": 1})
        console.log(data.);
        
    }

    play_pause(){
        let player_id = this.get_active_players();
        this.send_request({"jsonrpc": "2.0",
        "method": "Player.PlayPause",
        "params": {"playerid": 1}, "id": 1});
    }
}


let c = new Controller();

c.play_pause();