const assert = require("assert"),
	nock = require("nock"),
	sinon = require("sinon"),
	Controller = require("../Controller.js");

const RPCVersion = "2.0";

function setNockPlayerID(){
	return nock("http://localhost:8080")
	.post("/jsonrpc", (body) => {
		return body.jsonrpc === RPCVersion && body.method === "Player.GetActivePlayers";
	})
	.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":[{\"playerid\":1337,\"playertype\":\"internal\",\"type\":\"video\"}]}");
}

function setNockVolume(){
	return nock("http://localhost:8080")
		.post("/jsonrpc", (body) => {
			return body.jsonrpc === RPCVersion && body.method === "Application.GetProperties";
		})
		.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"volume\":24}}");
}

describe("Controller", () => {
	after(function(){
		nock.restore();
		nock.cleanAll();
	});

	describe("getActivePlayerID", () => {
		it("should return the id of the player", (done) => {
			let c = new Controller();

			setNockPlayerID();

			c.getActivePlayerID((err, playerID) => {
				if (err || !playerID) { done(err); }
				else{
					assert.equal(1337, playerID);
					done();
				}
			});
		});
	});

	describe("getVolume", () => {
		it("should return the volume of the player", (done) => {
			let c = new Controller();

			setNockVolume();

			c.getVolume((err, volume) => {
				if (err || !volume) { done(err); }
				else{
					assert.equal(24, volume);
					done();
				}
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
			.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"speed\":0}}");

			setNockPlayerID();

			c.playPause((err, response) => {
				if (err || !response) { done(err); }
				else{done();}
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
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"speed\":1}}");

			setNockPlayerID();

			c.play((err, response) => {
				if (err || !response) { done(err); }
				else{done();}
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
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"speed\":0}}");

			setNockPlayerID();

			c.pause((err, response) => {
				if (err || !response) { done(err); }
				else{done();}
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
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"speed\":0}}");

			setNockPlayerID();

			c.goNext((err, response) => {
				if (err || !response) { done(err); }
				else{done();}
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
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"speed\":0}}");

			setNockPlayerID();

			c.goPrevious((err, response) => {
				if (err || !response) { done(err); }
				else{done();}
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
				.reply(200, "{\"id\":1,\"jsonrpc\":\"2.0\",\"result\":{\"volume\":19}}");

			setNockVolume();

			c.volumeDown((err, volume) => {
				if (err || !volume) { done(err); }
				else{
					assert.equal(19, volume.volume);
					done();
				}
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
				.reply(200, "{\"id\":1,\"jsonrpc\":\"2.0\",\"result\":{\"volume\":29}}");

			setNockVolume();

			c.volumeUp((err, volume) => {
				if (err || !volume) { done(err); }
				else{
					assert.equal(29, volume.volume);
					done();
				}
			});
		});
	});

	describe("fastForward", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Player.SetSpeed";
				})
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"speed\":2}}");

			setNockPlayerID();

			c.fastForward((err, response) => {
				if (err || !response) { done(err); }
				else{done();}
			});
		});
	});

	describe("rewind", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Player.SetSpeed";
				})
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"speed\":-2}}");

			setNockPlayerID();

			c.rewind((err, response) => {
				if (err || !response) { done(err); }
				else{done();}
			});
		});
	});

	describe("goHome", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Input.Home";
				})
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"ok\"}");

			setNockPlayerID();

			c.goHome((err, response) => {
				if (err || !response) { done(err); }
				else {done();}
			});
		});
	});
	describe("goLeft", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Input.Left";
				})
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"ok\"}");

			setNockPlayerID();

			c.goLeft((err, response) => {
				if (err || !response) { done(err); }
				else {done();}
			});
		});
	});
	describe("goRight", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Input.Right";
				})
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"ok\"}");

			setNockPlayerID();

			c.goRight((err, response) => {
				if (err || !response) { done(err); }
				else {done();}
			});
		});
	});
	describe("goUp", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Input.Up";
				})
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"ok\"}");

			setNockPlayerID();

			c.goUp((err, response) => {
				if (err || !response) { done(err); }
				else {done();}
			});
		});
	});
	describe("goDown", () => {
		it("should not return an error", (done) => {
			let c = new Controller();

			nock("http://localhost:8080")
				.post("/jsonrpc", (body) => {
					return body.jsonrpc === RPCVersion && body.method === "Input.Down";
				})
				.reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"ok\"}");

			setNockPlayerID();

			c.goDown((err, response) => {
				if (err || !response) { done(err); }
				else {done();}
			});
		});
	});
});
