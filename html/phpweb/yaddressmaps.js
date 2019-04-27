'use strict';
/*global $, google */

var response // デバッグ用変数

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
      response = result;
      console.log(response);
      var lnglat = result.Feature[0].Geometry.Coordinates.split(",");
      var lng = lnglat[0];
      var lat = lnglat[1]
      var myCenter = new Y.LatLng(lat, lng);
      var ymap = new Y.Map("map_canvas");
      ymap.drawMap(myCenter, 15, Y.LayerSetId.NORMAL);
    }
  );
}
