'use strict';
/*global $, L */

var myMap;

// 住所から位置を取得し、地図を生成する
function drawMap(myAddress) {
  // 住所から位置を求めるためのYahoo!ジオコーダAPI
  $.getJSON("https://map.yahooapis.jp/geocode/V1/geoCoder?callback=?",
    {
      appid: "yabukiweb", // 自分のアプリケーションIDで置き換える。
      query: myAddress,
      al: "4",
      output: "json",
    },
    function(result) { // コールバック関数
      //console.log(result);
      var lnglat = result.Feature[0].Geometry.Coordinates.split(",");
      var lng = lnglat[0];
      var lat = lnglat[1];
      if (myMap) { // 地図があるなら削除する
        myMap.off();
        myMap.remove();
      }
      myMap = L.map("map_canvas");
      L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
      }).addTo(myMap);
      myMap.setView([lat, lng], 15);
    }
  );
}
