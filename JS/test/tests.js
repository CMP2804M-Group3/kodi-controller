var assert = require("assert"),
	nock = require("nock"),
	sinon = require("sinon"),
	Controller = require("../Controller.js");

const RPCVersion = "2.0";

var oldLog = console.log;

describe("Controller", () => {
	describe("getActivePlayerID", () => {
		it("should return the id of the player", (done) => {
			var c = new Controller();

			nock("http://localhost:8080")
			.post("/jsonrpc", (body) => {
				return body.jsonrpc == RPCVersion && body.method == "Player.GetActivePlayers";
			})
			.reply(200, `{"id":1,"jsonrpc":"2.0","result":[{"playerid":1337,"playertype":"internal","type":"video"}]}`);

			c.getActivePlayerID((err, playerID) => {
				if (err) done(err);
				assert.equal(1337, playerID);
				done();
			});
		});
	});

	describe("playPause", () => {
		it("should report the play/pause was executed", (done) => {
			var c = new Controller();
			var spy = sinon.spy(console, "log");

			nock("http://localhost:8080")
			.post("/jsonrpc", (body) => {
				return body.jsonrpc == RPCVersion && body.method == "Player.PlayPause";
			})
			.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":0}}`);

			c.playPause();

			// should probably rework this test
			setTimeout(() => {
				assert(spy.getCall(-1), "INFO: Play / Pause successfully executed.");
				done();
			}, 100);
		});
	});
});