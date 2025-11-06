// ==UserScript==
// @name         GeoFS OSM Airport Models (Multi-Airport)
// @namespace    geofs-custom
// @version      1.1
// @description  Loads OSM-style airport building models into GeoFS for missing airports
// @author       thegreen121 (GXRdev)
// @match        *://www.geo-fs.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- Wait until GeoFS & Cesium are ready ---
    const checkInterval = setInterval(() => {
        if (
            typeof geofs !== "undefined" &&
            geofs.api &&
            geofs.api.viewer &&
            typeof Cesium !== "undefined"
        ) {
            clearInterval(checkInterval);
            setTimeout(initCustomAirports, 2000);
        }
    }, 1500);

    // --- Define airport models here ---
    const airportModels = [
        {
            name: "KIAD - Washington Dulles Intl",
            modelUrl: "https://cdn.jsdelivr.net/gh/greenairways/test@latest/IADP4.gltf",
            lat: 38.947265,
            lon: -77.448265,
            alt: 86.5,
            heading: 90,
            scale: 10
        },
        {
            name: "KSEA - Seattle-Tacoma International Airport",
            modelUrl: "https://cdn.jsdelivr.net/gh/greenairways/KSEA-models-for-GeoFS-Airport-Buildings-Addon@latest/KSEA.gltf",
            lat: 47.44862,
            lon: -122.30257,
            alt: 114,
            heading: 90,
            scale: 1
        }
        // ➕ Add more airports as needed
    ];

    // --- Initialization ---
    function initCustomAirports() {
        console.log("GeoFS loaded — adding custom airport models...");
        airportModels.forEach(addModel);
    }

    // --- Helper: Add a model to the map ---
    function addModel({ name, modelUrl, lat, lon, alt, heading, scale }) {
        // Prevent duplicates
        if (geofs.api.viewer.entities.values.some(e => e.name === name)) {
            console.log(`⚠️ Model '${name}' already exists, skipping.`);
            return;
        }

        const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0)
        );

        const entity = geofs.api.viewer.entities.add({
            name,
            position,
            orientation,
            model: {
                uri: modelUrl,
                scale: scale || 1,
                minimumPixelSize: 128,
                maximumScale: 2000,
                color: Cesium.Color.fromCssColorString("#fff8e0").withAlpha(1.0),
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                colorBlendAmount: 0.25
            }
        });

        console.log(`✅ Model for ${name} added:`, entity);
    }

})();
