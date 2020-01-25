const kodiController = require("./src/Controller");

let kodi = new kodiController();

kodi.rewind((err, res)  =>{
    console.log(res);
}, 2);