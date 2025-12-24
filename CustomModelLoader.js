
// ==UserScript==
// @name         GeoFS Static Model Loader (RJTT)
// @namespace    https://github.com/geofslike-wq/GeoFS-OSM-Airport-Models
// @version      1.1.0
// @description  Load RJTT terminals (two parts) into GeoFS
// @match        https://www.geo-fs.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const MODELS = [
    {
      name: "RJTT - Terminal 1 / Part A",
      url: "https://raw.githubusercontent.com/geofslike-wq/GeoFS-OSM-Airport-Models/main/rjtt_terminal1.gltf",
      lat: 35.553300,
      lon: 139.781500,
      alt: 6.0,
      heading: 0.0,   // 必要なら160度に
      scale: 1.0
    },
    {
      name: "RJTT - Terminal 1 / Part B",
      url: "https://raw.githubusercontent.com/geofslike-wq/GeoFS-OSM-Airport-Models/main/taminalRJTT.gltf",
      lat: 35.553300,
      lon: 139.781500,
      alt: 6.0,
      heading: 0.0,
      scale: 1.0
    }
  ];

  const checkInterval = setInterval(() => {
    if (typeof geofs !== "undefined" &&
        geofs.api && geofs.api.viewer && Cesium) {
      clearInterval(checkInterval);
      setTimeout(initRJTT, 1500);
    }
  }, 500);

  function initRJTT() {
    console.log("[RJTT Loader] GeoFS ready, loading RJTT models…");
    MODELS.forEach(addModelEntity);
  }

  function addModelEntity(entry) {
    const position = Cesium.Cartesian3.fromDegrees(entry.lon, entry.lat, entry.alt || 0);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(entry.heading || 0), 0, 0
      )
    );

    const entity = geofs.api.viewer.entities.add({
      name: entry.name,
      position,
      orientation,
      model: {
        uri: entry.url,      // Raw glTF
        scale: entry.scale || 1.0,
        minimumPixelSize: 128,
        maximumScale: 2000
      }
    });

    console.log("[RJTT Loader] added:", entry.name, entity);
  }
})();
