<?php
//パラメータをテキストボックスに再現する準備
$paramq = '';
if (isset($_GET['q']))
  $paramq = htmlspecialchars($_GET['q'], ENT_QUOTES, 'UTF-8');
?>
<html>
  <head>
    <meta charset="utf-8" />
    <style type="text/css">
      html, body { height: 100%; }
      td { font-size: smaller; }
    </style>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js"></script>
    <script src="gsiaddressmaps.js"></script>
    <script>
      $(document).ready(function() {
        $("#q").keyup(function() {
          console.log("here");
          var url = "zips.php?q=" + $("#q").val();
          $("#result").load(url, function() {
            var address = $(".address:first").text();
            if (address.indexOf("掲載がない場合") != -1) address = $(".address:eq(1)").text();
            drawMap(address); // 地図を生成する
          });
        });
        var address = $(".address:first").text();
        drawMap(address); // 地図を生成する
      });
    </script>
    <title>リアルタイム郵便番号検索</title>
  </head>
  <body>
    <form action="" method="get">
      <p>
        <input id="q" type="text" name="q" value='<?php echo $paramq; ?>'/>
        <input type="submit" value="search" />
      </p>
    </form>
    <div id="map_canvas" style="float: right; width: 50%; height: 90%;"></div>
    <div id="result"><?php require('zips.php'); ?></div>
  </body>
</html>