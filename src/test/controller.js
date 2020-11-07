const assert = require("assert"),
    nock = require("nock"),
    sinon = require("sinon"),
    ip = require("ip"),
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

    describe("scanForKodis", () => {
        it("should return the ip of the local machine", (done) => {
            let localIP = ip.address();

            nock(`http://${localIP}:8080`)
            .get("/jsonrpc")
            .reply(200, "success");

            let c = new Controller();
            c.scanForKodis((err, kodis) => {
                if (err){
                    done(err);
                } else if (kodis.indexOf(localIP) > -1) {
                    done();
                } else {
                    done("could not find localIP in kodis array");
                }
            });
        }).timeout(60000); // this test might take a while to run depending on the network
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

    describe("shutdown", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "System.Shutdown";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.shutdown((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("restart", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "System.Reboot";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.restart((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("repeatOff", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Player.SetRepeat";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.repeatOff((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("repeatOne", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Player.SetRepeat";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.repeatOne((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("repeatAll", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Player.SetRepeat";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.repeatAll((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
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

    describe("stop", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Player.Stop";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.stop((err, response) => {
                if (err || !response) { done(err); }
                else{done();}
            });
        });
    });

    describe("select", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.Select";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.select((err, response) => {
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
                    return body.jsonrpc === RPCVersion && body.method === "Player.GoTo";
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
                    return body.jsonrpc === RPCVersion && body.method === "Player.GoTo";
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

    describe("setVolume", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Application.SetVolume";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\":\"2.0\",\"result\":{\"volume\":25}}");

            setNockVolume();

            c.setVolume((err, volume) => {
                if (err || !volume) { done(err); }
                else{
                    assert.equal(25, volume.volume);
                    done();
                }
            }, 25);
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
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.goHome((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("contextMenu", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.ContextMenu";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.contextMenu((err, response) => {
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
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

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
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

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
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

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
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.goDown((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("goBack", () => {
        it("should not return an error", (done) => {
            let c = new Controller();
            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.Back";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"ok\"}");

            setNockPlayerID();

            c.goBack((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("showInfo", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.Info";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\": \"OK\"}");

            c.showInfo((err, response) => {
                if (err || !response) { done(err); }
                done();
            });
        });
    });

    describe("quit", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Application.Quit";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\": \"OK\"}");

            c.quit((err, response) => {
                if (err || !response) { done(err); }
                done();
            });
        });
    });
    describe("toggleFullscreen", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "GUI.SetFullscreen";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\": \"true\"}");

            c.toggleFullscreen((err, response) => {
                if (err || !response) { done(err); }
                done();
            });
        });
    });

    describe("toggleMute", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Application.SetMute";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\": \"OK\"}");

            c.toggleMute((err, response) => {
                if (err || !response) { done(err); }
                done();
            });
        });
    });

    describe("inputAction", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.ExecuteAction" && body.params.action === "close";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputAction("close", (err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("inputHome", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.Home";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputHome((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("inputInfo", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.Info";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputInfo((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("inputSelect", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.Select";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputSelect((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("inputSendText", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.SendText" && body.params.text === "test123";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputSendText("test123", (err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("inputShowCodec", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.ShowCodec";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputShowCodec((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("inputShowOSD", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.ShowOSD";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputShowOSD((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("inputShowPlayerProcessInfo", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "Input.ShowPlayerProcessInfo";
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":\"OK\"}");

            setNockPlayerID();

            c.inputShowPlayerProcessInfo((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });

    describe("getCurrentWindow", () => {
        it("should not return an error", (done) => {
            let c = new Controller();

            nock("http://localhost:8080")
                .post("/jsonrpc", (body) => {
                    return body.jsonrpc === RPCVersion && body.method === "GUI.GetProperties" && body.params.properties.includes("currentwindow");
                })
                .reply(200, "{\"id\":1,\"jsonrpc\": \"2.0\",\"result\":{\"currentwindow\":{\"id\": 12901,\"label\":\"Fullscreen OSD\"}}}");

            setNockPlayerID();

            c.getCurrentWindow((err, response) => {
                if (err || !response) { done(err); }
                else {done();}
            });
        });
    });
});
