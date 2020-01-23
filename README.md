# Kodi Controller
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/CMP2804M-Group3/kodi-controller/Node%20CI)
![npm](https://img.shields.io/npm/v/kodi-controller) 

Kodi Controller is a callback driven package for controlling Kodi from javascript. 

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install Kodi Controller.

```bash
npm install kodi-controller
```

## Usage

```javascript
const KodiController = require("kodi-controller");

kodi = new KodiController("192.168.0.24", 8080);

kodi.pause();

kodi.getVolume((err, volume) =>{
    console.log(`The Volume is currently ${volume}.`);
});
```

## Contributing
Please make sure to update tests as appropriate.

## License
[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
