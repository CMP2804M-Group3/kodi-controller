const Controller = require('./Controller');

let c = new Controller();

c.getActivePlayerID((err, volume) => {
    console.log(volume);
});