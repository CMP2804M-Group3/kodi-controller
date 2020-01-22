const Controller = require('./Controller');

let c = new Controller();

c.play();
setTimeout(function(){ c.pause();}, 3000);
