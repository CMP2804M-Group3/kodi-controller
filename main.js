const KodiController = require("./src/Controller.js");

Kodi = new KodiController();
Kodi.goHome((err, data) =>{
    console.log(err);
    console.log(data);

});