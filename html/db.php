<?php
//データベース接続設定
$dbServer = 'mysql';
$dbName = 'mydb';
$dsn = "mysql:host={$dbServer};dbname={$dbName};charset=utf8";

//データベースへの接続
$dbUser = 'test';
$dbPass = 'pass';
$db = new PDO($dsn, $dbUser, $dbPass);
