# CTPメッセージ構造仕様（MQ_Controller）

## 概要:
MQ_Controllerは、全ての通信メッセージを「CTP」構造に統一します。
CTPとは、Command（行為）、Target（対象）、Payload（内容）から構成されるメッセージの最小単位です。

## 構造:
メッセージは以下の3要素から成ります。

{
  "command": "update",          // 何をするか（動詞的な処理）
  "target": "display.brightness", // どの対象に対してか（UIや状態、エンティティなど）
  "payload": { "value": 80 }    // どうするか、どんな情報を伴うか（値や引数）
}

---

## 要素の詳細

### ■ command（必須）
・動詞的な処理種別
・公式コマンドとカスタムコマンドに分類される

[公式コマンド例]
- update   : 状態の部分更新
- set      : 一括設定
- get      : 状態の取得リクエスト
- notify   : 通知・イベント送信
- invoke   : 任意処理の実行
- toggle   : 状態の反転（ON/OFFなど）
- ack/nack : 処理応答（成功/失敗）

[カスタム例]
- game.spawn_enemy
- ui.open_modal
- device.sync_config

※命名の自由度を許容するが、衝突回避のために接頭語（名前空間）を推奨

### ■ target（必須）
・処理対象の論理名
・UI要素のID、状態名、エンティティ識別子など
・階層構造を持たせる場合はドット表記（例：system.audio.volume）

### ■ payload（任意）
・commandに対して必要な情報（引数、値、オプションなど）
・形式は自由だが、コマンドごとに構造例を提示することが望ましい
・空オブジェクトやnullも許容

---

### 使用例

【例1：UIのスライダー操作】
{
  "command": "update",
  "target": "volume",
  "payload": { "value": 50 }
}

【例2：ゲーム内キャラクターの移動】
{
  "command": "invoke",
  "target": "player1",
  "payload": { "action": "move", "x": 120, "y": 240 }
}

【例3：状態取得リクエスト】
{
  "command": "get",
  "target": "system.status",
  "payload": {}
}

---

### 拡張項目（任意）

以下の項目は必要に応じてメッセージに含めてもよい。

- request_id : 応答と紐づけるための一意ID
- meta       : 任意のメタ情報（origin, priorityなど）
- timestamp  : イベント時刻（UNIX時間など）

例：
{
  "command": "update",
  "target": "display.brightness",
  "payload": { "value": 80 },
  "request_id": "abc-123",
  "meta": { "origin": "ui.desktop" },
  "timestamp": 1686543200000
}

---

### 設計方針

- CTPはMQ_Controllerの最小構文単位である
- 「一貫性」「可読性」「拡張性」の三点を重視
- 開発者はCTP構造を守れば、自由なコマンドや対象を設計可能
- UI、ゲーム、IoTなど幅広い領域に適用可能

---

### 備考

- targetは、トピックでルーティングされた後の「内部的な処理対象」として機能する
- CTPに従えば、汎用的なディスパッチ・ルールベースの処理が可能となる
