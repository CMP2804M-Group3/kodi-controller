const KodiController = require("./src/Controller.js");

Kodi = new KodiController();
Kodi.goPrevious((err, data) =>{
    console.log(err);
    console.log(data);

});