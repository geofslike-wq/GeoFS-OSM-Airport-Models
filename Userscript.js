// ==UserScript==
// @name         GeoFS OSM Airport Models (JSON Loader)
// @namespace    geofs-custom
// @version      1
// @description  Loads airport building models from an external JSON file
// @author       thegreen121 (GXRdev)
// @match        *://www.geo-fs.com/*
// @grant        none


// ==UserScript==
// @name         GeoFS RJTT GLB Loader
// @namespace    geofs-rjtt-glb
// @version      1.0
// @match        https://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const wait = setInterval(() => {
    if (window.geofs && geofs.api && geofs.api.viewer && window.Cesium) {
      clearInterval(wait);
      load();
    }
  }, 1000);

  function load() {
    const entity = geofs.api.viewer.entities.add({
      name: "RJTT Terminal 1",
      position: Cesium.Cartesian3.fromDegrees(
        139.7793,  // lon
        35.5497,   // lat
        2           // alt
      ),
      model: {
        uri: "https://raw.githubusercontent.com/geofslike-wq/GeoFS-RJTT-Models/main/rjtt_terminal1.glb",
        scale: 0.4,
        minimumPixelSize: 128
      }
    });

    geofs.api.viewer.flyTo(entity);
    console.log("RJTT model loaded");
  }
})();

