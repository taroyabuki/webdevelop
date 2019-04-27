'use strict';
/*global $, google */

var myMap; // グローバル
var positions = new Array();

$(document).ready(function() {
  if ($('.address').length === 0) return; // 結果がないときはマップを描かない。

  var center = new Y.LatLng(0, 0); // とりあえずの中心
  var zoom = 15;
  myMap = new Y.Map("map_canvas");
  myMap.drawMap(center, zoom, Y.LayerSetId.NORMAL);

  // class属性が「address」であるものを取り出し、その内容（つまり住所）から緯度経度を取得
  // マーカーにして、「住所」のラベルを付ける。
  $('.address').each(function() {
    var myAddress = $(this).text();
    if (myAddress.indexOf("掲載がない場合") == -1) {
      $.getJSON("https://map.yahooapis.jp/geocode/V1/geoCoder?callback=?",
        {
          appid: "yabukiweb", // 自分のアプリケーションIDで置き換える。
          query: myAddress,
          al: "4",
          output: "json",
        },
        function(result) { // コールバック関数
          var lnglat = result.Feature[0].Geometry.Coordinates.split(",");
          var lng = lnglat[0];
          var lat = lnglat[1]
          var myPosition = new Y.LatLng(lat, lng);
          //console.log(myPosition);
          var marker = new Y.Marker(myPosition); // マーカーの生成
          marker.__label__ = myAddress;
          marker.bind("mouseover", function() { $('#output').html(this.__label__); } );
          myMap.addFeature(marker);
          positions[positions.length] = myPosition;
          resetCenter(); // マップの中心と範囲を更新
        } // ここまでコールバック関数
      );
    }
  });
});

// 各マーカーの緯度経度の平均を中心にする
function resetCenter() {
  var minLat, maxLat, minLng, maxLng;
  var avgLat = 0;
  var avgLng = 0;
  for (var i = 0; i < positions.length; i++) {
    var lat = positions[i].Lat;
    var lng = positions[i].Lon;
    if (i === 0) {
      minLat = maxLat = lat;
      minLng = maxLng = lng;
    } else {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }
    avgLat += lat;
    avgLng += lng;
  }
  // マップの中心
  avgLat /= positions.length;
  avgLng /= positions.length;
  myMap.panTo(new Y.LatLng(avgLat, avgLng));
}