const KodiController = require("./Controller");

let kodi = new KodiController();

kodi.showInfo((err, data) => {
    console.log(data);
});