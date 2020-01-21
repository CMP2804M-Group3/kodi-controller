import json
import logging
import urllib.request

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


class Controller:

    def __init__(self, ip="localhost", port=8080):
        self.url = f"http://{ip}:{port}/jsonrpc"
        logging.debug(self.url)

    def send_request(self, body):
        request = urllib.request.Request(self.url)
        request.add_header('Content-Type', 'application/json; charset=utf-8')
        json_body = json.dumps(body)
        json_body_bytes = json_body.encode('utf-8')
        request.add_header('Content-Length', len(json_body_bytes))

        logging.debug(f"Sending request: body = {body}")

        response = urllib.request.urlopen(request, json_body_bytes)
        return json.loads(response.read().decode('utf-8'))

    def get_active_players(self):
        player_response = self.send_request({"jsonrpc": "2.0",
                                             "method": "Player.GetActivePlayers",
                                             "id": 1})
        return int(player_response['result'][0]['playerid'])

    def get_current_item(self):
        player_id = self.get_active_players()
        response = self.send_request({"jsonrpc": "2.0",
                                      "method": "Player.GetItem",
                                      "params": { "properties":
                                                      ["title",
                                                       "album"
                                                       "artist",
                                                       "duration",
                                                       "thumbnail",
                                                       "file",
                                                       "fanart",
                                                       "streamdetails"],
                                                  "playerid": player_id },
                                      "id": "AudioGetItem"})
        print(response)

    def play_pause(self):
        player_id = self.get_active_players()

        self.send_request({"jsonrpc": "2.0",
                           "method": "Player.PlayPause",
                           "params": {"playerid": player_id}, "id": 1})
