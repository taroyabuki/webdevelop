'use strict';
/*global $, L, document */

$(document).ready(function() {
  $("#button").click(function() {
    // input要素の値を取得する
    var lat = $("#lat").val();
    var lng = $("#lng").val();

    // 地図の生成
    var myMap = L.map("map_canvas");
    L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
      attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
    }).addTo(myMap);
    myMap.setView([lat, lng], 15);

    // マーカーの生成
    L.marker([lat, lng], {title: "Hello, World!"}).addTo(myMap);
  });
});
