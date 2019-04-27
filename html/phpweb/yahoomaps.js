'use strict';
/*global $, google */

$(document).ready(function() {
  $("#button").click(function() {
    // input要素の値を取得し、マップの中心を決める
    var lat = $("#lat").val();
    var lng = $("#lng").val();
    var myCenter = new Y.LatLng(lat, lng);

    // 地図の生成
    var ymap = new Y.Map("map_canvas");
    ymap.drawMap(myCenter, 15, Y.LayerSetId.NORMAL);

    // マーカーの生成
    var marker = new Y.Marker(myCenter);
    marker.__label__ = "Hello, World!";
    marker.bind("mouseover", function() { $('#output').html(this.__label__); });
    ymap.addFeature(marker);
  });
});