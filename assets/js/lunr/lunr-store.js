var store = [{
        "title": "セクタサイズが原因？LocalDBが起動しないトラブルの解析記録",
        "excerpt":"事前知識 私が曖昧だったことや知らなかったことを、事前知識としてまとめています。 セクタサイズ HDDやSSDなどのストレージにデータを書き込んだり読み込んだりする時の単位となるサイズです。 物理セクタサイズと論理セクタサイズが存在します。 セクタサイズは製造段階で決められており、今の主流は4096バイトです。 Direct I/O ファイルシステムを経由せず、直接ストレージに書き込む技術です。 Direct I/Oを使う場合、アプリ側はOSから物理セクタサイズを取得し、それを信じて書き込み・読み込みを行うようです。 状況 OS: Windows IDE: Visual Studio RDBMS: SQL Server(LocalDB) 2019 C#環境の構築にて、友人のPCでエラーが発生したので、エラー解決を手伝いました。 すでに作成されてるマイグレーションをデータベースに反映しようとすると、次のようなエラーが出るのです。 このエラーメッセージは、SQL Server が起動していない、または見つけられないことを示しています。 Error Number:2,State:0,Class:20 A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible....","categories": ["解析記録"],
        "tags": [],
        "url": "/%E8%A7%A3%E6%9E%90%E8%A8%98%E9%8C%B2/2025/05/27/LogAnalysis.html",
        "teaser": null
      },{
        "title": "`systemctl`とは？勉強記録",
        "excerpt":"本記事では「systemctlとは何か」をまとめています。 結論：「systemctlとは、デーモンの状態を確認・管理するコマンド」 厳密には、systemctlがsystemdを通してデーモンを管理する。 経緯 ある日、仮想マシンでUbuntuサーバ（CUI）を動かしていると、コマンドのコピペができませんでした。 そこで、SSH接続をしてホストOSのターミナルから操作をしようと思い、UbuntuサーバにSSHサーバのセットアップをしました。 その時systemctlコマンドを使う中で色々と調べた結果、自分なりにsystemctl周辺を理解できた手応えがあったので、まとめておきます。 知識マップ 私が思うsystemctlの理解に必要な知識マップです。 graph TD A[systemctlとは] --&gt; B[デーモンとは] B --&gt; C[バックグラウンドプロセスとは] A --&gt; D[systemdとは] D --&gt; E[initプロセスとは] 本題 systemctlを理解するために、まずはデーモンとsystemdを理解します。 デーモンとは デーモンとはUNIX系OSで動くバックグラウンドプロセスのことです。 バックグラウンドプロセスとは： ユーザとは切り離されて常駐するプログラムのことです。 つまり、ユーザがログインしていなくても動くプログラムのことです。 例えば、ApacheなどのWebサーバはバックグラウンドですが、 開発中に使うpython -m http.serverなどはユーザが直接起動して使うため、通常はフォアグラウンドで動作します。 Webサーバやファイルサーバ、SSHサーバなどのプログラムはユーザのサーバへのログインの有無は関係なく、常駐してクライアントからのリクエストを処理しています。 これらのプログラムを「デーモン」と呼びます。 systemdとは systemdとはinitプロセス（初期化プロセス）のひとつであり、従来のSysVinitを置き換えるために登場しました。 initプロセスとは： UNIX系OSで、プログラムを動かす元のプログラムのことです。 基本的にプログラムは「自分を動かしてくれるプログラム」がいないと動くことができません。 initプロセスは、他のプロセスを起動させる役割を持っていて、すべてのプロセスの親に当たります。 一般的には、コンピュータの起動直後にBIOS → ブートローダ → Linuxカーネルと処理が進み、最後にinitプロセスが起動します。 initプロセスのPID（Process ID）は1になっています。 つまり、systemdは他のプログラムを動かすことができる、すべてのプログラムの親のことです。...","categories": ["勉強記録"],
        "tags": [],
        "url": "/%E5%8B%89%E5%BC%B7%E8%A8%98%E9%8C%B2/2025/07/14/systemctl.html",
        "teaser": null
      }]
