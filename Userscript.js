// ==UserScript==
// @name         GeoFS OSM Airport Models (JSON Loader)
// @namespace    geofs-custom
// @version      1.2.1
// @description  Loads airport building models from an external JSON file into GeoFS
// @match        https://www.geo-fs.com/*
// @run-at       document-end
// @author       geofslike-wq
// ==/UserScript==

(function () {
  "use strict";

  // --- 設定 ---------------------------------------------------------------
  const JSON_URL = "https://raw.githubusercontent.com/<your-user>/<your-repo>/main/models.json"; // ←差し替え
  const CHECK_INTERVAL_MS = 500;

  // 真っ白に寄せたいときだけ true にする
  const COLOR_BLEND_ENABLED = false;
  const COLOR_BLEND = {
    color: Cesium.Color.fromCssColorString("#ffffff").withAlpha(1.0),
    mode: Cesium.ColorBlendMode.MIX,
    amount: 0.25
  };
  // -----------------------------------------------------------------------

  function isReady() {
    return (
      typeof geofs !== "undefined" &&
      geofs.api &&
      geofs.api.viewer &&
      typeof Cesium !== "undefined"
    );
  }

  function loadAirportJSON() {
    console.log("📥 Fetching airport model list from JSON...");
    fetch(JSON_URL, { cache: "no-cache" })
      .then((response) => response.json())
      .then((json) => {
        console.log("✅ Loaded airport list:", json);
        json.forEach(addModel);
      })
      .catch((err) => console.error("❌ Failed to load JSON:", err));
  }

  // 既存エンティティ重複チェック
  function alreadyExists(id) {
    return geofs.api.viewer.entities.values.some((e) => e.name === id);
  }

  // モデル追加
  function addModel({ name, url: modelUrl, lat, lon, alt, heading, pitch, roll, scale }) {
    const id = name || modelUrl; // ← 統一：nameがあれば使う。なければURL

    if (alreadyExists(id)) {
      console.log(`⏭ Model '${id}' already exists, skipping.`);
      return;
    }

    const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt || 0);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(heading || 0),
        Cesium.Math.toRadians(pitch || 0),
        Cesium.Math.toRadians(roll || 0)
      )
    );

    const modelOptions = {
      uri: modelUrl,
      scale: scale || 1.0,
      minimumPixelSize: 128,
      maximumScale: 2000
    };

    if (COLOR_BLEND_ENABLED) {
      modelOptions.color = COLOR_BLEND.color;
      modelOptions.colorBlendMode = COLOR_BLEND.mode;
      modelOptions.colorBlendAmount = COLOR_BLEND.amount;
    }

    const entity = geofs.api.viewer.entities.add({
      name: id,            // ← 名前統一
      position,
      orientation,
      model: modelOptions
    });

    console.log(`✅ Loaded model: ${id}`, entity);
  }

  // 起動待ち
  function boot() {
    const checkInterval = setInterval(() => {
      if (isReady()) {
        clearInterval(checkInterval);
        setTimeout(loadAirportJSON, 1500); // GeoFSの初期描画が落ち着くまで少し待つ
      }
    }, CHECK_INTERVAL_MS);
  }

  boot();
})();

 

       
