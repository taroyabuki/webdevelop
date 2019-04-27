<?php
//パラメータをテキストボックスに再現する準備
$paramq = '';
if (isset($_GET['q']))
  $paramq = htmlspecialchars($_GET['q'], ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style type="text/css">
      html, body { height: 100%; }
      td { font-size: smaller; }
    </style>
    <!-- 「yabukiweb」の部分は，自分のアプリケーションIDで置き換える。 -->
    <script src="https://map.yahooapis.jp/js/V1/jsapi?appid=yabukiweb"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js"></script>
    <script src="yaddressmaps.js"></script>
    <script>
      $(document).ready(function() {
        var address = $(".address:first").text();
        if (address.indexOf("掲載がない場合") != -1) address = $(".address:eq(1)").text();
        drawMap(address); // 地図を生成する
      });
    </script>
    <title>郵便番号検索フォームとGoogle Maps APIのマッシュアップ</title>
  </head>
  <body>
    <form action="" method="get">
      <p>
        <input type="text" name="q" value='<?php echo $paramq; ?>'/>
        <input type="submit" value="search" />
      </p>
    </form>
    <div id="map_canvas" style="float: right; width: 50%; height: 90%;"></div>
    <?php require('zips.php'); ?>
  </body>
</html>