function generateSecretBase64URL(length = 16) {
  
  // const secret = generateSecretBase64URL(); // 出力例: "fRJdVg2XKoPov7sHMe9mTw"
  //console.log(secret);
  
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes); // 安全なランダム値を生成

  // バイナリ列をBase64に変換（ブラウザのbtoa関数を使う）
  const base64 = btoa(String.fromCharCode(...bytes));

  // Base64 → Base64URLへ変換（URLで使えるように）
  const base64url = base64
    .replace(/\+/g, '-')   // '+' を '-' に
    .replace(/\//g, '_')   // '/' を '_' に
    .replace(/=+$/, '');   // '=' を除去（パディング除去）

  return base64url;

}

function scheduleReload(delayMs = 24 * 60 * 60 * 1000) {
    // デフォルトで6時間後
    setTimeout(() => {
        const currentPath = location.pathname;
        const timestamp = Date.now();
        const url = new URL(location.href);
        url.searchParams.set('t', Date.now());
        location.href = url.toString();
    }, delayMs);
}


// メッセージの展開

function handleMessage(message) {
  const command = message.command || "ui_update";
  const target = message.target || "element";
  const payload = message.payload || {};

  if (command === "ui_update") {
    switch (target) {
      case "element":
        handleElementCommand(payload);
        break;
      default:
        console.error("Unsupported UI target:", target);
    }
  } else {
    console.error("Unknown command:", command);
  }
}

function handleElementCommand(payload) {
  const { selector, action, value } = payload;

  const el = document.querySelector(selector);
  if (!el) {
    console.error("Element not found:", selector);
    return;
  }

  switch (action) {
    case "set_text":
      el.textContent = value;
      break;

    case "set_html":
      el.innerHTML = value;
      break;

    case "set_value":
      el.value = value;
      break;

    case "add_class":
      el.classList.add(value);
      break;

    case "remove_class":
      el.classList.remove(value);
      break;

    case "show":
      el.style.display = "";
      break;

    case "hide":
      el.style.display = "none";
      break;

    default:
      console.error("Unknown action:", action);
  }
}


function connectMQTT() {
  // Paho.MQTT.Client(ホスト名, ポート番号, パス, クライアントID)
  //const host = window.location.hostname;
  //const port = window.location.port || 80; // ポート指定がなければ80を仮定（httpのデフォルト）
  //const client = new Paho.MQTT.Client(host, Number(port), "/mqtt/", "client-id");

  const host = window.location.hostname;
  const port = window.location.port || 443;
  const client = new Paho.MQTT.Client(`wss://${host}:${port}/mqtt/`, "client-id");

  //const client = new Paho.MQTT.Client("172.21.151.45", 8000, "/mqtt/", "client-id");
  // 接続が切れたときのハンドラ
  client.onConnectionLost = function(responseObject) {
    console.log("Connection lost:", responseObject.errorMessage);
  };

  // メッセージ受信時のハンドラ
  client.onMessageArrived = function(message) {
    console.log("Received:", message.destinationName, message.payloadString);
  };

  // 接続オプション
  const options = {
    onSuccess: function() {
      console.log("Connected to MQTT broker");
      client.subscribe("test/topic");

      // デモ用に即時publish
      const message = new Paho.MQTT.Message("Hello from browser");
      message.destinationName = "test/topic";
      client.send(message);
    },
    onFailure: function(e) {
      console.error("Connection failed:", e.errorMessage);
    }
  };

  client.connect(options);
}