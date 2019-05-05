# ウェブアプリケーション開発環境

MySQL，PHP，phpMyAdminのコンテナを組み合わせて，ウェブアプリケーションの開発環境を構築します．
ウェブアプリケーションの構築方法については，[矢吹太朗『ウェブアプリケーション構築入門』（森北出版, 2011）](https://github.com/taroyabuki/webbook2)を参照してください．

作業フォルダはc:/workであることを仮定します．（自分の環境に合わせて読み替えてください．）

```bash
c:
mkdir /work
cd /work
```

## 準備

1. Gitをインストールする．
1. Dockerをインストールする．
1. 作業用のフォルダを作り，このリポジトリをcloneする．作業用フォルダがc:/workなら次のとおり．

```bash
git clone https://github.com/taroyabuki/webdevelop.git
```

必須ではありませんが，[Visual Studio Code Insiders](https://code.visualstudio.com/insiders/)（ベータ版）を入れて，サイドバーのExtension（Ctrl+Shift+X）で，`Remote Development`と入力し，Remote Developmentをインストールしておくと便利です．たとえば，ホスト側にPHPを入れていなくても，コンテナのPHPを使って編集中のPHPコードの文法をチェックできます（後述）．

## 起動

```bash
cd webdevelop
docker-compose up -d
```

構築した環境を削除する方法は以下の通りです．

```bash
docker-compose down
```

## 動作確認

ウェブサーバのドキュメントルートはhtmlです．info.phpやdb.phpはこのフォルダにあります．

* PHPの動作確認：http://localhost/info.php
* データベースへの接続確認：http://localhost/db.php
* [phpMyAdmin](http://localhost:8080/)（ユーザ名：`root`，パスワード：`pass`）

## 各コンテナでの作業

* MySQLが動作しているサーバを操作したい：`docker-compose exec mysql bash`．ホスト側のファイルは/root/hostでアクセスできる（`docker-compose exec mysql ls /root/host`で確認）．
* MySQLを操作したい：`docker-compose exec mysql mysql -uroot -ppass`
* ウェブサーバを操作したい：`docker-compose exec php bash`．ホスト側のファイルは/var/wwwでアクセスできる（`docker-compose exec php ls /var/www`で確認）．

Visual Studio CodeのRemote Developmentを使うと，コンテナのPHPを使って編集中のPHPコードの文法をチェックする方法は以下の通りです．

1. Ctrl+Shift+P，「Remote-Containers: Attach to Running Container...」でPHPが動作するコンテナ（/webdevelop_php_1）に接続する．
1. File→Open Folderで「/var/www/html」を開く．
1. PHPファイルを開いて編集する．
1. ファイルの保存を保存する．（このとき，文法のチェックが行われる．）

## カスタマイズ

三つのイメージ（mysql:5，phpmyadmin/phpmyadmin，php:7.2-apache）を使っています．
カスタマイズしているのはphp:7.2-apacheだけなので，追加のカスタマイズもこれに対してするといいでしょう．
変更をmyphp/Dockerfileに記述してから，以下を実行してください．

```bash
docker-compose down
docker build -t webdevelop_php myphp
docker-compose up -d
```

## サンプルアプリケーション

矢吹太朗『ウェブアプリケーション構築入門』（森北出版, 2011）のサンプルを試します．

### 4.5.1 指定した位置（緯度・経度）を中心とする地図

Google Maps APIの代わりに[Yahoo! JavaScriptマップAPI](https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/js/)を使います．[アプリケーションID](https://e.developer.yahoo.co.jp/register)を作ってから先に進んでください．（googlemaps.htmlのYahoo!地図版がhtml/phpweb/yahoomaps.htmlです．）

動作確認：http://localhost/phpweb/yahoomaps.html

### 4.5.2 指定した住所を中心とする地図

住所から緯度と経度を求めるには，[Yahoo!ジオコーダAPI](https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/geocoder.html)を使います．このAPIはJSONPで呼び出します．JSONPについては第5章章末のコラム（p.75）を参照してください．（addressmaps.htmlのYahoo!地図版がhtml/phpweb/yaddressmaps.htmlです．）

動作確認：http://localhost/phpweb/yaddressmaps.html

### 9.1 郵便番号データベース

郵便番号データをダウンロードします．

```bash
docker-compose exec php bash -c "\
curl -o ../ken_all.zip https://www.post.japanpost.jp/zipcode/dl/oogaki/zip/ken_all.zip &&\
curl -o ../jigyosyo.zip https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip &&\
unzip -d .. ../ken_all.zip &&\
unzip -d .. ../jigyosyo.zip"
```

郵便番号データをMySQLにインポートします．

```bash
docker-compose exec mysql bash -c "cd /root/host && mysql -uroot -ppass < zips.sql"
```

### 9.2.3 GETによる検索の動作確認と改良

動作確認：http://localhost/phpweb/zips.php?q=150

この段階では文字化けしてもかまいません．

### 9.4 Google Maps APIとのマッシュアップ

zipsmap.phpのYahoo!地図版がhtml/phpweb/yzipsmap.phpです．

動作確認：http://localhost/phpweb/yzipsmap.php?q=150

### 9.5 Ajaxによるリアルタイム検索

zipsajaxmap.phpのYahoo!地図版がhtml/phpweb/yzipsajaxmap.phpです．

動作確認：http://localhost/phpweb/yzipsajaxmap.php

おまけ（マーカー表示）：http://localhost/phpweb/yzipsmap2.php?q=150
