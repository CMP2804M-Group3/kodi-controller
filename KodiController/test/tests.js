const assert = require("assert"),
	nock = require("nock"),
	sinon = require("sinon"),
	Controller = require("../Controller.js");

const RPCVersion = "2.0";

const oldLog = console.log;

function SetNockPlayerID(){
	return nock("http://localhost:8080")
	.post("/jsonrpc", (body) => {
		return body.jsonrpc === RPCVersion && body.method === "Player.GetActivePlayers";
	})
	.reply(200, `{"id":1,"jsonrpc":"2.0","result":[{"playerid":1337,"playertype":"internal","type":"video"}]}`);
}

describe("Controller", () => {
	after(function(){
		nock.restore();
		nock.cleanAll();
	});

	describe("getActivePlayerID", () => {
		it("should return the id of the player", (done) => {
			let c = new Controller();

			SetNockPlayerID();

			c.getActivePlayerID((err, playerID) => {
				if (err) done(err);
				assert.equal(1337, playerID);
				done();
			});
		});
	});

	describe("playPause", () => {
		it("should report the play/pause was executed", (done) => {
			let c = new Controller();
			let spy = sinon.spy(console, "log");

			nock("http://localhost:8080")
			.post("/jsonrpc", (body) => {
				return body.jsonrpc === RPCVersion && body.method === "Player.PlayPause";
			})
			.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":0}}`);

			SetNockPlayerID();

			c.playPause();

			// should probably rework this test
			setTimeout(() => {
				assert(spy.getCall(-1), "INFO: Play / Pause successfully executed.");
				done();
			}, 100);
		});
	});

	describe("play", () => {
		it("should report the play command was executed", (done) => {
			let c = new Controller();
			let spy = sinon.spy(console, "log");

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Player.PlayPause";
				})
				.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":1}}`);

			SetNockPlayerID();

			c.playPause();

			// should probably rework this test
			setTimeout(() => {
				assert(spy.getCall(-1), "INFO: Played successfully.");
				done();
			}, 100);
		});
	});

	describe("pause", () => {
		it("should report the pause command was executed", (done) => {
			let c = new Controller();
			let spy = sinon.spy(console, "log");

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Player.PlayPause";
				})
				.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":0}}`);

			SetNockPlayerID();

			c.playPause();

			// should probably rework this test
			setTimeout(() => {
				assert(spy.getCall(-1), "INFO: Paused successfully.");
				done();
			}, 100);
		});
	});

});