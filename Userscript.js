// ==UserScript==
// @name         GeoFS OSM Airport Models (JSON Loader)
// @namespace    geofs-custom
// @version      1
// @description  Loads airport building models from an external JSON file
// @author       thegreen121 (GXRdev)
// @match        *://www.geo-fs.com/*
// @grant        none

// ====== RJTT を自分用で追加（override） ======
(function() {
  // 既存の空港リストオブジェクト（アドオン側が使っている想定）を探す
  // 例：window.GeoFSOSMAirports という名前で管理されていると仮定
  // ※実際の変数名が違う場合は、空港リスト読み込み箇所に合わせて修正してください

  const hasGlobalList = typeof window.GeoFSOSMAirports === "object";
  const myRJTT = {
    "RJTT": {
      "name": "Tokyo International Airport (Haneda)",
      "lat": 35.5494,      // 羽田の中心付近
      "lon": 139.7798,
      "zoom": 16,          // 詳細表示が必要なら 16〜17 推奨
      "osm": true          // OSMモデルを使う
      // 必要なら下記のような追加フィールドを使う実装もあります（アドオン仕様に合わせて）
      // "bounds": [35.530, 139.750, 35.570, 139.810], // 南西(緯度,経度)〜北東(緯度,経度)
      // "excludeTags": ["ruins"], // OSMタグの除外例
      // "customModels": [{"id":"rjtt_twr","lat":35.5499,"lon":139.7790,"url":"..."}]
    }
  };

  if (hasGlobalList) {
    // 既存リストにマージ（上書き）
    window.GeoFSOSMAirports = Object.assign({}, window.GeoFSOSMAirports, myRJTT);
    console.log("[GeoFS-OSM-Airport-Models] RJTT added via personal override.");
  } else {
    // 万一、初期化の前なら遅延マージ用に仮置き
    window.GeoFSOSMAirports = myRJTT;
    console.log("[GeoFS-OSM-Airport-Models] RJTT list created as personal override.");
  }

  // 読み込みトリガー（アドオンが提供している再読込関数があれば呼ぶ）
  // 例：  // 例：window.GeoFSOSMReload?.();

        fetch(JSON_URL)
            .then(response => response.json())
            .then(json => {
                console.log("📁 Loaded airport list:", json);
                json.forEach(addModel);
            })
            .catch(err => console.error("❌ Failed to load JSON:", err));
    }


    // --- Add model ---
    function addModel({ name, modelUrl, lat, lon, alt, heading, scale }) {

        if (geofs.api.viewer.entities.values.some(e => e.name === name)) {
            console.log(`⚠️ Model '${name}' already exists, skipping.`);
            return;
        }

        const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

        const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading || 0), 0, 0)
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

        console.log(`✅ Loaded model: ${name}`);
    }

})();
