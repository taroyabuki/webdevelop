# Dockerを使うウェブアプリケーション開発環境（PHP）

MySQL，PHP，phpMyAdminのDockerコンテナを組み合わせて，ウェブアプリケーションの開発環境を構築します．

- Dockerの使い方は，[辻真吾・矢吹太朗『ゼロからはじめるデータサイエンス入門』（講談社, 2021）](https://github.com/taroyabuki/fromzero)を参照してください．ただし，この書籍ではここで使っているDocker Composeについては説明していないので，Docker Composeについては別の資料があるといいでしょう．例：大澤文孝・浅居尚『さわって学ぶクラウドインフラ　docker基礎からのコンテナ構築』（日経BP, 2020）
- ウェブアプリケーションの構築方法については，[矢吹太朗『ウェブアプリケーション構築入門』（森北出版, 2011）](https://github.com/taroyabuki/webbook2)を参照してください．

## 概要

開発環境の概要は次のとおりです（詳細は[docker-compose.yml](docker-compose.yml)を参照）．

[![概念図](figure.svg)](figure.md)

## 準備

1. （Windows）WSL2を有効にする（ここではUbuntuを仮定）．

```bash
#PowerShellで
wsl --install
# ↑でヘルプテキストが表示される場合は，
wsl --install -d Ubuntu
```

2. （Windows）WSL2のUbuntuでgitをインストールする．

```bash
sudo apt update
sudo apt install git
```

3. 適当な作業ディレクトリで，リポジトリをクローンする．

```bash
#Explorerで作業ディレクトリを用意し，そこを開いた状態で，
#アドレス欄に`bash`と入力してWSLに入ってから，
git clone https://github.com/taroyabuki/webdevelop.git
```

3. Docker Desktopをインストールする．

```bash
#Windowsの場合は，PowerShellで
winget install Docker.DockerDesktop
```

### VS Code（オプション）

必須ではありませんが，Visual Studio Codeを入れて，サイドバーのExtension（Ctrl+Shift+X）で，`Remote Development`と入力し，Remote Developmentをインストールしておくと便利です．たとえば，ホスト側にPHPを入れていなくても，コンテナのPHPを使って編集中のPHPコードの文法をチェックできます（後述）．

## 起動と停止

次を実行します．（PowerShell，WSLのどちらでもかまいません．カレントディレクトリをwebdevelopにしてください．）

```bash
#docker-compose.ymlがあるディレクトリで
docker compose up -d
```

構築した環境を停止する方法は次のとおりです．

```bash
docker compose down
```

停止に失敗するとコンテナが残ってしまいます．（稼働中の）コンテナが残っている状態で新たに開発環境を起動しようとすると，次のようなエラーになります（ポートの利用が重複しているということ）．

```
（省略）Bind for 0.0.0.0:8080 failed: port is already allocated
```

こういう場合は開発環境を停止させればいいのですが，それがうまく行かない場合は，`docker ps`で残っているコンテナを確認して，`docker rm`で削除します．

```bash
$ docker ps #確認
CONTAINER ID   IMAGE                    COMMAND                  CREATED        STATUS        PORTS                  NAMES
8846c6f8a068   taroyabuki/php-pdo:7.2   "docker-php-entrypoi…"   12 hours ago   Up 12 hours   0.0.0.0:80->80/tcp     webdevelop-php-1
0865bf577c46   mysql:5.7                "docker-entrypoint.s…"   12 hours ago   Up 12 hours   3306/tcp, 33060/tcp    webdevelop-mysql-1
2de8fc0818a3   phpmyadmin/phpmyadmin    "/docker-entrypoint.…"   12 hours ago   Up 12 hours   0.0.0.0:8080->80/tcp   webdevelop-phpmyadmin-1

$ docker rm -f 884 086 2de #削除
```

### ボリュームの操作

開発環境を起動すると，データベースのデータを保存するためのボリュームができます．ボリュームの操作は次のとおりです．

- 一覧表示：`docker volume ls`
- 削除：`docker volume rm webdevelop_my_volume`
- 全ボリュームの削除：`docker volume prune`．

## 動作確認

ウェブサーバのドキュメントルートはhtmlです．info.phpやdb.phpはこのフォルダにあります．

* PHPの動作確認：http://localhost/info.php
* データベースへの接続確認：http://localhost/db.php （何も表示されなければ成功）
* phpMyAdmin: http://localhost:8080 （ユーザ名：`root`，パスワード：`pass`．または，ユーザ名：`test`，パスワード：`pass`）

## 各コンテナでの作業

各コンテナで作業する方法は次のとおりです．いずれも`exit`で終了．

* .html, .css, .phpなどの編集：ホストのwebdevelop/html のファイルを編集する．
* MySQLの操作：
    * [phpMyAdmin](http://localhost:8080)
    * `docker compose exec mysql mysql -uroot -ppass`
* 予備：コンテナmysqlの操作：`docker compose exec mysql bash`（ホストのwebdevelopとコンテナの/root/hostは同じ）
* 予備：コンテナphpの操作：`docker compose exec php bash`（ホストのwebdevelopとコンテナの/root/hostは同じ）

### Remote Development

Visual Studio CodeのRemote Developmentを使うと，コンテナのPHPを使って編集中のPHPコードの文法をチェックする方法は次のとおりです．

1. Ctrl+Shift+P，「Remote-Containers: Attach to Running Container...」でPHPが動作するコンテナ（/webdevelop_php_1）に接続する．
1. File→Open Folderで「/var/www/html」を開く．
1. PHPファイルを開いて編集する．
1. ファイルを保存する．（このとき，文法のチェックが行われる．）

## カスタマイズ

三つのイメージ（mysql:5.7，phpmyadmin/phpmyadmin，php:7.2-apache）を使っています．
カスタマイズしているのはphp:7.2-apacheだけなので，追加のカスタマイズもこれに対してするといいでしょう．
変更をmyphp/Dockerfileに記述してから，次を実行してください．

```bash
docker compose down
docker build -t webdevelop_php myphp
docker compose up -d
```

## サンプルアプリケーション

矢吹太朗『ウェブアプリケーション構築入門』（森北出版, 2011）のサンプルを試します．

### 4.5.1 指定した位置（緯度・経度）を中心とする地図

（使いにくくなった）Google Maps APIの代わりに地理院タイルとLeafletを使います．

- [地理院タイルを用いたサイト構築サンプル集](https://maps.gsi.go.jp/development/sample.html)
- [Leaflet API reference](https://leafletjs.com/reference.html)

googlemaps.htmlの地理院タイル版がhtml/phpweb/gsimaps.htmlです．

動作確認：http://localhost/phpweb/gsimaps.html

### 4.5.2 指定した住所を中心とする地図

[Yahoo!ジオコーダAPI](https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/geocoder.html)で住所から位置（緯度と経度）を求めます．[アプリケーションID](https://e.developer.yahoo.co.jp/register)を作ってから先に進んでください．

このAPIはJSONPで呼び出します．JSONPについては第5章章末のコラム（p.75）を参照してください．

addressmaps.htmlの地理院タイル版がhtml/phpweb/gsiaddressmaps.htmlです．

動作確認：http://localhost/phpweb/gsiaddressmaps.html

### 9.1 郵便番号データベース

郵便番号データをダウンロードします．

```bash
docker compose exec php bash -c "\
cd /root/host
rm -f ken_all.zip jigyosyo.zip KEN_ALL.CSV JIGYOSYO.CSV
curl -O https://www.post.japanpost.jp/zipcode/dl/oogaki/zip/ken_all.zip &&\
curl -O https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip &&\
unzip ken_all.zip &&\
unzip jigyosyo.zip"
```

郵便番号データをMySQLにインポートします．

```bash
docker compose exec mysql bash -c "cd /root/host && mysql -uroot -ppass mydb < zips.sql"
```

### 9.2.3 GETによる検索の動作確認と改良

動作確認：http://localhost/phpweb/zips.php?q=150

この段階では文字化けしてもかまいません．

### 9.4 Google Maps APIとのマッシュアップ

zipsmap.phpの地理院タイル版がhtml/phpweb/gsizipsmaps.phpです．

動作確認：http://localhost/phpweb/gsizipsmaps.php?q=150

おまけ（マーカー表示）：http://localhost/phpweb/gsizipsmaps2.php?q=150

![動作画面](gsizipsmaps2.png)

書籍に合わせて，[Yahoo!ジオコーダAPI](https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/geocoder.html)で住所から位置を求めています．[郵便番号検索API](https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/zipcodesearch.html)で郵便番号から位置を求めてもいいでしょう．

### 9.5 Ajaxによるリアルタイム検索

zipsajaxmap.phpのYahoo!地図版がhtml/phpweb/gsizipsajaxmaps.phpです．

動作確認：http://localhost/phpweb/gsizipsajaxmaps.php

## ライセンス

Copyright (c) 2022 Taro Yabuki

Released under the [MIT license](LICENSE)
