var assert = require("assert"),
	nock = require("nock"),
	Controller = require("../Controller.js");

const RPCVersion = "2.0";

describe("controller", () => {
	describe("getActivePlayerID", () => {
		it("should return the id of the player", (done) => {
			var c = new Controller();

			nock("http://localhost:8080")
			.post("/jsonrpc", (body) => {
				var data = JSON.parse(body);
				return data.jsonrpc == RPCVersion && data.method == "Player.GetActivePlayers";
			})
			.reply(200, `{"id":1,"jsonrpc":"2.0","result":[{"playerid":1337,"playertype":"internal","type":"video"}]}`);

			c.getActivePlayerID((err, playerID) => {
				if (err) done(err);
				assert.equal(1337, playerID);
				done();
			});
		});
	});
});
