<?php
//データベース接続設定
$dbServer = getenv('MYSQL_PORT_3306_TCP_ADDR');
$dbName = 'docker';
$dsn = "mysql:host={$dbServer};dbname={$dbName};charset=utf8";
$dbUser = 'docker';
$dbPass = 'docker';
//データベースへの接続
$db = new PDO($dsn, $dbUser, $dbPass);
echo "OK";
