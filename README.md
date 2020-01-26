# Kodi Controller
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/CMP2804M-Group3/kodi-controller/Node%20CI)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/debea2731c734ee2aead6427217a3b86)](https://app.codacy.com/gh/CMP2804M-Group3/kodi-controller?utm_source=github.com&utm_medium=referral&utm_content=CMP2804M-Group3/kodi-controller&utm_campaign=Badge_Grade_Dashboard)
[![npm](https://img.shields.io/npm/v/kodi-controller?color=yellow)](https://www.npmjs.com/package/kodi-controller)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Inline docs](http://inch-ci.org/github/CMP2804M-Group3/kodi-controller.svg?branch=master)](http://inch-ci.org/github/CMP2804M-Group3/kodi-controller)

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
