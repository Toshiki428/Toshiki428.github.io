---
title: 'RADIUSとは？認証・認可・課金を行うAAAプロトコルを解説'
date: '2026-10-07'
tags: ['ネットワーク', '通信', 'プロトコル']
category: 'STUDY_LOG'
---

本記事では、RADIUSについて整理します。

## RADIUSとは

RADIUS（Remote Authentication Dial In User Service）は、 **AAA（Authentication, Authorization, Accounting：認証・認可・課金）** を実現するためのプロトコルです。

名前に「Dial In」とある通り、もともとはダイヤルアップ接続のユーザーを認証するために生まれたプロトコルです。

その後、Ethernet接続やWi-Fi、VPNなど、さまざまな接続方式でも使われるようになり、現在では企業向けAPNの認証など、EPCの解説記事 Part5で触れたような場面でも使われています。

[EPC解説記事 Part5](/#/blog/epc-5)

## 登場人物

RADIUSには、大きく3つの登場人物がいます。

**ユーザ**
- 認証を受ける対象

**NAS（Network Access Server）**  
- ユーザーからの接続要求を受け付け、RADIUSサーバに問い合わせるクライアント側の機器
- EPCでは、PGWがこのNASの役割を担います

**RADIUSサーバ**  
- NASからの問い合わせを受けて、実際に認証・認可・課金の判断を行うサーバ

## AAAとは

### Authentication（認証）

正当な利用者であることを確認することです。

代表的な技術はパスワード認証です。  
特定の人や機器を一意に識別できるシステムを作り、ユーザIDとパスワードの組み合わせで認証します。

### Authorization（認可）

利用者に権限を与えることです。

認証によって「誰であるか」が確認された後、その利用者が「何をしてよいか」を決めます。  
例えば、全データの閲覧・編集を許可する、といった権限の割り当てがこれにあたります。

### Accounting（課金）

利用者の利用状況を記録することです。

Accounting-Requestの中には **Acct-Status-Type** というAttributeが含まれており、このメッセージが「利用開始（Start）」「利用中の途中経過（Interim-Update）」「利用終了（Stop）」のどれを表しているかを示します。

NASは、ユーザーが接続を始めた時点でStart、利用中は一定間隔でInterim-Update、接続が終わった時点でStopという形で、段階的にRADIUSサーバへ記録を送ります。  
特にStopのタイミングでは、実際にやり取りされたデータ量なども一緒に送られるため、これがプリペイド課金や従量課金の元データになります。

## メッセージの種類

RADIUSのメッセージは、大きく認証系と課金系の2つに分けられます。

### 認証・認可系

- **Access-Request**：NASからRADIUSサーバへ送られる、接続を要求するメッセージ。ユーザー名や暗号化されたパスワードなどが含まれます
- **Access-Accept**：RADIUSサーバが、接続を許可する際に返すメッセージ
- **Access-Reject**：RADIUSサーバが、接続を拒否する際に返すメッセージ
- **Access-Challenge**：RADIUSサーバが、追加の情報を求める際に返すメッセージ。これを受け取ったNASは、追加情報を添えて再度Access-Requestを送ります

### 課金系

- **Accounting-Request**：NASからRADIUSサーバへ送られる、利用状況を記録するためのメッセージ
- **Accounting-Response**：RADIUSサーバがそれを受理したことを伝えるメッセージ

## 代表的なAttribute（属性）

RADIUSのメッセージの中身は、 **Attribute（属性）** という単位で構成されています。  
それぞれのAttributeには番号が振られていて、Type（種類）・Length（長さ）・Value（値）という形式で表現されます。

代表的なものをいくつか紹介します。

- **User-Name**：接続してきたユーザーの名前
- **User-Password**：暗号化されたパスワード
- **NAS-IP-Address**：問い合わせを送ってきたNASのIPアドレス
- **Framed-IP-Address**：ユーザーに割り当てるIPアドレス

特に**Framed-IP-Address**は、Access-Acceptの中に含まれ、「このユーザーにはこのIPアドレスを割り当ててください」とNASに伝えるためのAttributeです。  
Part5で、PGWがUEにIPアドレスを割り当てる、という話をしましたが、RADIUSによる認証を使う構成の場合、このFramed-IP-Addressが、そのIPアドレスを伝える役割を担うことがあります。

## EAPとの組み合わせ

RADIUSは、 **EAP（Extensible Authentication Protocol）** という別のプロトコルと組み合わせて使われることもよくあります。

EAPは、認証の方式そのものを拡張可能にするための仕組みです。  
EAP-TLS（証明書ベース）、EAP-SIM/EAP-AKA（SIMカードを使った認証）など、複数の認証方式が用意されています。

RADIUSは、このEAPのやり取りを**EAP-Message**という専用のAttributeに包んで運ぶ役割を果たします。  
特にWi-Fiの802.1X認証などでよく使われる組み合わせです。

ちなみに、EAP-SIM/EAP-AKAはSIMカードを使って認証を行う方式で、契約者情報を管理するHSS（Part2, Part4で紹介したデータベース）とも連携します。  
スマートフォンがWi-Fiに自動接続する際、裏側でこの仕組みが動いていることがあります。

## RADIUSの弱点

RADIUSは長年使われてきたプロトコルですが、いくつか弱点も抱えています。

一つは、**UDP**というプロトコルの上で動いている点です。  
UDPは、送りっぱなしで届いたかどうかを保証しない通信方式なので、メッセージが途中で失われても気づきにくい、という課題があります。

もう一つは、エラーが起きた際の挙動です。  
RADIUSは、エラーが起きるとメッセージを黙って破棄してしまうことがあり、何が起きたのか追いにくいことがあります。

こうした弱点を踏まえて設計されたのが、次に紹介する**Diameter**というプロトコルです。  
ただし、実はDiameterはあまり使われず、今もRADIUSは現役で動いていたりします。

## まとめ

本記事では、Part5で軽く触れたRADIUSについて整理しました。

- RADIUSは、 **認証・認可・課金（AAA）** を実現するプロトコルで、もともとはダイヤルアップ接続向けに生まれた
- **NAS** （クライアント側）と **RADIUSサーバ** が登場人物で、Part5の文脈ではPGWとAAAサーバがこれにあたる
- 認証系（Access-Request/Accept/Reject/Challenge）と課金系（Accounting-Request/Response）のメッセージがある
- メッセージの中身は **Attribute** という単位で構成され、User-Name, Framed-IP-Addressなど、用途に応じたものが定義されている
- **EAP**という別のプロトコルと組み合わせて使われることも多く、その際はRADIUSがEAPのやり取りを運ぶ役割を果たす
- UDPを使っていることやエラー処理の甘さなど、いくつかの弱点も抱えている

次の記事では、RADIUSの弱点を踏まえて設計された **Diameter** というプロトコルについて見ていきます。

