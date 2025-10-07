---
title: 'セクタサイズが原因？LocalDBが起動しないトラブルの解析記録'
date: '2025-05-27'
tags: ['Windows', 'LocalDB', 'エラー解決']
category: 'STUDY_LOG'
---

## 事前知識

はじめに、私がこの件で学んだことを、事前知識としてまとめています。

### 1. セクタサイズ

HDDやSSDなどのストレージにデータを書き込んだり読み込んだりする時の単位となるサイズです。

物理セクタサイズと論理セクタサイズが存在しますが、ここでは物理セクタサイズを指しています。

セクタサイズは製造段階で決められており、今の主流は4096バイトです。

### 2. ファイルシステム

ストレージのデータを管理する仕組みのことです。

ストレージ内ではファイルが`0`と`1`の羅列になっています。  
このビット列をファイルやディレクトリとして扱えるようにするために、OSが提供する機能がファイルシステムです。

代表的なファイルシステムとして、`FAT32`や`ext4`などがあります。

### 3. Direct I/O

ファイルシステムを経由せず、アプリが直接ストレージに書き込む技術です。

Direct I/Oを使う場合、アプリはOSから**セクタサイズ**を取得し、それを信じて書き込み・読み込みを行うようです。

## 状況

- OS: Windows11
- IDE: Visual Studio
- RDBMS: SQL Server(LocalDB) 2019

`C#`環境の構築にて、友人のPCでエラーが発生したので、エラー解決を手伝いました。

すでに作成されてるマイグレーションをデータベースに反映しようとすると、次のようなエラーが出ます。  
このエラーメッセージは、「SQL Serverが起動していない、または見つけられない」ことを示しています。

```txt
Error Number:2,State:0,Class:20
A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections. (provider: SQL Network Interfaces, error: 52 - Unable to locate a Local Database Runtime installation. Verify that SQL Server Express is properly installed and that the Local Database Runtime feature is enabled.)
```

まずは、SQLが起動していることを確認したかったので、コマンドプロンプトで`sqllocaldb i`と打ち確認します。  
すると必要なインスタンス（`MSSQLLocalDB`）は存在していました。

次に、インスタンスが起動してることを確認するために、`sqllocaldb i MSSQLLocalDB`と打ちます。  
すると`State: Stopped`となっており、起動していないことがわかりました。

念の為、`sqllocaldb start MSSQLLocalDB`を実行してみるとエラーが発生しました。

ログファイルを確認すると、そこに次のメッセージが出力されていました。

```log
2025-05-24 15:50:00.27 spid28s     There have been 256 misaligned log IOs which required falling back to synchronous IO.  The current IO is on file C:\Users\name\AppData\Local\Microsoft\Microsoft SQL Server Local DB\Instances\MSSQLLocalDB\master.mdf.
```

ここからさらに深く状況を知るため、Event Viewer、Process Monitor、services.mscなどを使って解析を進めました。

## 試したこと

はじめにProcess Monitorで、`sqlservr.exe`の動きを見てみると`ACCESS DENIED`のエラーが数百件見つかり、参照しているディレクトリの権限を確認すると全て問題なさそうでした。

次に`Local DB 2019`を使っているのが原因であり、`Local DB 2022`に変更すると解決するかもしれないという仮説から、2022をインストールしてみましたが、これも失敗。

困った挙句、先ほどのログからI/O関係で詰まっている可能性に絞り調べてみることにしました。

## 結論

結論としては、この判断は正しく、セクタサイズが問題でした。

すでにMicrosoftのドキュメントにも公開されています。  
[詳しくはこちら](https://learn.microsoft.com/ja-jp/troubleshoot/sql/database-engine/database-file-operations/troubleshoot-os-4kb-disk-sector-size?tabs=registry-editor)

実は友人のSSDはセクタサイズが、8192バイト（8KB）だったのです。  
通常のアプリであればファイルシステムを経由し、データを書き込むので、問題になることはありません。

しかしDirect I/Oを使うLocal DBは、**物理セクタサイズを扱う責任を持ちます**。  
だからこそ、4KBまでしか対応していないという仕様があり、「8KBのSSDは対応していない」とエラーが出ます。

ひとまずの解決方法は、レジストリエディタを使い`ForcedPhysicalSectorSizeInBytes`を設定することです。  
`ForcedPhysicalSectorSizeInBytes`は、実際の物理セクタサイズを変えずに、OSがアプリケーションへ報告する物理セクタサイズを上書きする設定のようです。  
詳しくは上の公式ドキュメントをご覧ください。

## 感想

結果的には、ドキュメントを調べるとすぐ解決できる問題でした。

つまり、Process Monitorなどのツールを使う必要はなかったですが、再現性の高い解析方法なので実際の問題に対して使ってみる経験ができてよかったです。

また、強いて言うなら権限の問題ような他の可能性を潰すことに役立ちました。

問題が起きた時、**適当に試行錯誤するのではなく、「仮説を立てて検証」というサイクルを回すことが大切**だと考えています。

ただ、セクタサイズの問題なんて頭の片隅にもなかったので、まだまだ勉強が必要だなと実感しました。
