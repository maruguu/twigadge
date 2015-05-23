# インストール #
twigadge-XXXX.gadget(XXXXはバージョン番号)をダブルクリックすると、インストールが始まります。

# ログイン #
![http://twigadge.googlecode.com/files/twigadge-main-ss-1.0.png](http://twigadge.googlecode.com/files/twigadge-main-ss-1.0.png)

右上のスパナアイコンをクリックしてガジェットの設定画面を表示させます。
Twitterアカウント情報を入力してください。

# 投稿 #
![http://twigadge.googlecode.com/files/twigadge-update-ss-1.0.png](http://twigadge.googlecode.com/files/twigadge-update-ss-1.0.png)

  1. ![http://twigadge.googlecode.com/files/twigadge-update-icon.png](http://twigadge.googlecode.com/files/twigadge-update-icon.png)をクリック
  1. 横にウィンドウが広がるので、テキストボックスに投稿内容を入力
  1. Updateボタンをクリック (入力中にCtrl+Enterを押すことでも投稿可能です)
  1. ウィンドウは自動的に閉じます

## 返信 ##
タイムライン中のユーザ名をクリックすると簡単に返信を行うことが可能です。横にウィンドウが広がったされた状態でユーザ名をクリックすれば、更新内容にユーザ名を追加することが可能です。

## リロード ##
![http://twigadge.googlecode.com/files/twigadge-reload-icon.png](http://twigadge.googlecode.com/files/twigadge-reload-icon.png)をクリックするとタイムラインのリロードを行います。TwitterAPIには制限があり、1時間にタイムラインを取得できる回数が決まっています。押しすぎに注意してください。

## 発言の拡大表示 ##
![http://twigadge.googlecode.com/files/twigadge-ss-1.0.png](http://twigadge.googlecode.com/files/twigadge-ss-1.0.png)

ユーザアイコンをクリックすると発言が拡大表示されます。
ボタンをクリックすることで以下の動きをします。
  * ☆ 発言をお気に入りに追加(もしくは解除)
  * Twitter Twitter(twitter.com/ユーザ名)を開く
  * Web ユーザのWebページを開く
  * Copy 発言の選択範囲をクリップボードにコピー

# その他の機能 #
## Twitterリンク ##
![http://twigadge.googlecode.com/files/twigadge-home-icon.png](http://twigadge.googlecode.com/files/twigadge-home-icon.png)をクリックすると自分のTwitterページ(twitter.com/home/)を開きます。

## 表示切替 ##
![http://twigadge.googlecode.com/files/twigadge-timeline-icon.png](http://twigadge.googlecode.com/files/twigadge-timeline-icon.png)をクリックすると以下の順番で表示が切り替わります。
  * ![http://twigadge.googlecode.com/files/twigadge-timeline-icon.png](http://twigadge.googlecode.com/files/twigadge-timeline-icon.png) タイムライン表示
  * ![http://twigadge.googlecode.com/files/twigadge-directmessage-icon.png](http://twigadge.googlecode.com/files/twigadge-directmessage-icon.png) ダイレクトメッセージ表示
  * ![http://twigadge.googlecode.com/files/twigadge-reply-icon.png](http://twigadge.googlecode.com/files/twigadge-reply-icon.png) 返信表示
  * ![http://twigadge.googlecode.com/files/twigadge-system-icon.png](http://twigadge.googlecode.com/files/twigadge-system-icon.png) システムメッセージ表示

## 通信状態 ##
  * ![http://twigadge.googlecode.com/files/twigadge-connected-icon.png](http://twigadge.googlecode.com/files/twigadge-connected-icon.png) 接続
  * ![http://twigadge.googlecode.com/files/twigadge-not_connected-icon.png](http://twigadge.googlecode.com/files/twigadge-not_connected-icon.png) 未接続

## 通知 ##
ウィンドウ下に以下のアイコンが表示されることがあります。
  * ![http://twigadge.googlecode.com/files/twigadge-new_directmessage-icon.png](http://twigadge.googlecode.com/files/twigadge-new_directmessage-icon.png) ダイレクトメッセージあり
  * ![http://twigadge.googlecode.com/files/twigadge-new_reply-icon.png](http://twigadge.googlecode.com/files/twigadge-new_reply-icon.png) 返信あり
  * ![http://twigadge.googlecode.com/files/twigadge-error-icon.png](http://twigadge.googlecode.com/files/twigadge-error-icon.png) エラー発生
これらの通知アイコンは、各表示に切り替えるか、アイコンをクリックすることで消すことができます。
## Buzztter連携 ##
タイムライン中、buzzwordが太字となって表示されます。buzzwordをクリックすると該当する[Buzztter](http://www.buzztter.com/)のページへジャンプします。

# 設定 #
## 通信 ##
  * ユーザ名、パスワード
Twitterのアカウント情報を入力してください。
  * 更新間隔(分)
オートリロード間隔を分単位で設定します。
  * DMの更新間隔(分)
ダイレクトメッセージの取得間隔を分単位で設定します。
  * 起動時に返信を取得
起動時に返信の取得を行います。
  * 投稿にPOSTを使う (version 1.1.1で廃止)
ステータス更新の際、POSTメソッドを使ってタイムラインを取得します。
## 表示 ##
  * ウィンドウサイズ
ウィンドウサイズを設定することができます。サイドバーにドッキングした状態としていない状態では別の値になります。それぞれの状態で設定ボタンを押して設定を行ってください。
  * リロード時に先頭に戻る
リロードの際、自動的に最新の発言を表示します。
  * 発言の表示サイズを固定
発言のサイズを固定します。発言の全てを表示するにはユーザアイコンをクリックしてください。
  * ハート対応
発言内の"<3"をハート画像に変換します。
## その他 ##
  * Buzztterからデータを読み込む
Buzztter連携機能を有効にします。
  * 更新間隔(分)
Buzztterからのデータを更新する間隔を分単位で設定します。
  * 保持しておく発言数
入力した分の発言を保持します。この数を超えると古い発言から表示されなくなります。
## バージョン ##
  * 起動時に最新版があるか確認
最新版が公開されていた場合に通知を行います。