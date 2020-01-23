const assert = require("assert"),
	nock = require("nock"),
	sinon = require("sinon"),
	Controller = require("../Controller.js");

const RPCVersion = "2.0";

function SetNockPlayerID(){
	return nock("http://localhost:8080")
	.post("/jsonrpc", (body) => {
		return body.jsonrpc === RPCVersion && body.method === "Player.GetActivePlayers";
	})
	.reply(200, `{"id":1,"jsonrpc":"2.0","result":[{"playerid":1337,"playertype":"internal","type":"video"}]}`);
}

function SetNockVolume(){
	return nock("http://localhost:8080")
		.post("/jsonrpc", (body) => {
			return body.jsonrpc === RPCVersion && body.method === "Application.GetProperties";
		})
		.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"volume":24}}`);
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
				if (err || !playerID) done(err);
				assert.equal(1337, playerID);
				done();
			});
		});
	});

	describe("getVolume", () => {
		it("should return the volume of the player", (done) => {
			let c = new Controller();

			SetNockVolume();

			c.getVolume((err, volume) => {
				if (err || !volume) done(err);
				assert.equal(24, volume);
				done();
			});
		});
	});

	describe("playPause", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
			.post("/jsonrpc", (body) => {
				return body.jsonrpc === RPCVersion && body.method === "Player.PlayPause";
			})
			.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":0}}`);

			SetNockPlayerID();

			c.playPause((err, response) => {
				if (err || !response) done(err);
				done();
			});
		});
	});

	describe("play", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
			.post("/jsonrpc", (body) => {
				return body.jsonrpc === RPCVersion && body.method === "Player.PlayPause";
			})
			.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":1}}`);

			SetNockPlayerID();

			c.play((err, response) => {
				if (err || !response) done(err);
				done();
			});
		});
	});

	describe("pause", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
			.post("/jsonrpc", (body) => {
				return body.jsonrpc === RPCVersion && body.method === "Player.PlayPause";
			})
			.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":0}}`);

			SetNockPlayerID();

			c.pause((err, response) => {
				if (err || !response) done(err);
				done();
			});
		});
	});

	describe("skip", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Player.GoNext";
				})
				.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":0}}`);

			SetNockPlayerID();

			c.goNext((err, response) => {
				if (err || !response) done(err);
				done();
			});
		});
	});

	describe("goBack", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Player.GoPrevious";
				})
				.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"speed":0}}`);

			SetNockPlayerID();

			c.goPrevious((err, response) => {
				if (err || !response) done(err);
				done();
			});
		});
	});

	describe("volumeDown", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Application.SetVolume";
				})
				.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"volume":19}}`);

			SetNockVolume();

			c.volumeDown((err, volume) => {
				if (err || !volume) done(err);
				assert.equal(19, volume.volume);
				done();
			});
		});
	});

	describe("volumeUp", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Application.SetVolume";
				})
				.reply(200, `{"id":1,"jsonrpc":"2.0","result":{"volume":29}}`);

			SetNockVolume();

			c.volumeUp((err, volume) => {
				if (err || !volume) done(err);
				assert.equal(29, volume.volume);
				done();
			});
		});
	});

});
