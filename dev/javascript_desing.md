# javascript design 


## MQ_Controller メッセージ仕様（基本仕様）

### 形式：
  MQTTメッセージのペイロードはJSON形式とし、以下の構造を基本とする。

### 構造：
{
  "command": "ui_update",        // 省略可能。省略時は "ui_update" として扱う。
  "target": "element",          // 省略可能。省略時は "element" として扱う。
  "payload": {
    "selector": "<CSSセレクタ>", // 必須。対象DOM要素を指定する。
    "action": "<操作名>",         // 必須。実行するUI操作。
    "value": "<任意の値>"         // 操作に必要なパラメータ（操作によっては省略可）。
  }
}

### 既定の動作：
- `command` が省略された場合、"ui_update" として処理する。
- `target` が省略された場合、"element" として処理する。
- `payload` が不正または不完全な場合は処理せず、エラーログを出力する。

### selector の指定方法：
- `selector` は CSS セレクタとして解釈される。JavaScript の `document.querySelector(selector)` で解決されることを前提とする。
- 使用可能なセレクタの例：
  - `"#id"`：特定のIDを持つ要素（例：`"#status"`）
  - `".class"`：クラス名を持つ最初の要素（例：`".alert"`）
  - `"tag"`：特定のタグ名の要素（例：`"input"`）
  - `"親 > 子"`：階層構造を指定（例：`"#form > input[type='text']"`）
- セレクタは複雑な指定も可能だが、**クライアント側のDOM構造と正確に一致している必要がある。**

### action 一覧（target: "element" の場合）：
- "set_text"      → textContent を指定の value に設定
- "set_html"      → innerHTML を指定の value に設定
- "set_value"     → value プロパティを設定（フォーム入力用）
- "add_class"     → classList に指定のクラス名を追加
- "remove_class"  → classList から指定のクラス名を削除
- "show"          → display を "" にして表示
- "hide"          → display を "none" にして非表示

#### 例：
{
  "payload": {
    "selector": "#status",
    "action": "set_text",
    "value": "保存が完了しました"
  }
}

#### 将来的な拡張：
- target の追加（例：audio, storage, navigation）
- action の追加（例：toggle_class, animate, etc）
- payload に複数命令を配列形式で渡すバッチ処理の検討
- UI以外の命令に対応するための command 切り替えの活用

#### 備考：
- selector の記述ミス（対象が存在しないなど）は UI 操作をスキップし、コンソールに警告を出力する。
- すべてのクライアント処理は共通の JavaScript ランタイムで処理可能な構造を保つ。
