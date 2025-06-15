# MQTT over WebSocket 構成に関する開発計画.txt

## 【目的】
ブラウザからMQTT通信を行うWebアプリケーションを開発するにあたり、WebSocket over SSL（wss）で接続できる構成をDockerベースで構築する。
開発環境と本番環境で証明書を切り替えつつ、JavaScript側は同じコードで動作するように設計する。

---

## 【開発ステップ】

1. Let's Encrypt を使った WSS 接続の構成を確立する（MODE=web）
   - nginx が 443 番ポートで WSS を受け付けるように設定
   - certbot で Let's Encrypt の証明書を取得し、nginx に設定
   - nginx が `/mqtt/` パスへの接続を `ws://mosquitto:9001/` に中継
   - mosquitto は `listener 9001` + `protocol websockets` で WebSocket を受け入れる
   - JavaScript から `wss://your-domain.com/mqtt` に接続し、MQTT pub/sub が動作することを確認

2. web／localで証明書・設定を切り替え可能にする Docker 化（MODE=web / MODE=local）
   - Docker Compose で `MODE=web` または `MODE=local` による構成切り替えを実装
   - `certs/web/` に Let's Encrypt 証明書、`certs/local/` に自己署名証明書を配置
   - nginx の設定ファイル（`nginx/web.conf` と `nginx/local.conf`）も切り替え対応
   - `volumes` またはエントリポイントスクリプトで証明書・nginx設定をモードに応じてマウント

3. ブラウザ側 JavaScript で自動接続判定
   - `window.location.hostname` を使って現在のホスト名を取得
   - `wss://${hostname}/mqtt` 形式で接続先を動的に生成
   - ホスト名が本番でもローカルでも同じ構成で接続先が決定されるようにする
   - ローカル環境では `/etc/hosts` により `mqtt.example.com` のようなドメイン名をローカルIPへ向ける
   - JavaScript 側のコード変更なしで両環境に対応可能とする

---

## 【補足事項】

- nginx は MQTT プロトコルを解釈せず、WebSocket プロキシとして動作する
- mosquitto は WebSocket と TCP（mqtt://）での接続を共存させることができる
- バックエンド（Python等）からは `mqtt://` で mosquitto に接続し、同じトピックで pub/sub 可能
- nginx のリバースプロキシとしての役割は「SSL終端」「WebSocket中継」であり、実質的に MQTT ブローカーのプロキシとして機能する

---

## 【備考】

- 自己署名証明書は openssl によりローカルで生成
- JavaScript 側の接続には Paho.js または MQTT.js を使用予定
- `proxy_set_header Upgrade` など WebSocket に必要な nginx 設定を忘れないこと
- `mqtt.example.com` のようなドメイン名を開発中でも再現するために `hosts` ファイルを活用

