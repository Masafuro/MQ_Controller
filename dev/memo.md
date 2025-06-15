# 開発メモ（初期構築）

## 2025-06-16 6:06
名称をSkip-UIに変更
.gitignore及び.keepの貼り直し
certは作り直しが必要そう。


## 2025-06-15 20:29

mkcertによる自己証明書から


## 2025-06-14　16:53

### ✅ 環境情報

- OS: Ubuntu 22.04（VPS）
- 開発言語: Python 3.11（Flask）
- 実行環境: Docker + Docker Compose
- 公開方法: HTTP（ポート8000）でFlask配信

---

### ✅ 構成ディレクトリ

```
MQ_Controller/
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── index.html
├── docker-compose.yml
```

---

### ✅ 現在できていること

- VPS上にPython・Flaskアプリ環境を構築
- Docker & docker-compose による構成管理
- Flaskアプリから `/frontend/index.html` を返す構成が動作
- `http://VPS_IP:8000/` にアクセスして画面が表示される
- `/api/register` に POST リクエストでUUIDとトークンを返すAPIを実装
- GitHub上のリポジトリとSSH連携済み（push/pull可能）

---

### ✅ 技術的ポイント・備考

- `volumes` にて `./frontend:/frontend` をマウントし、静的ファイルをFlaskから読み込ませている
- Flaskアプリ内では `send_from_directory()` を使用し、テンプレートではなく静的HTMLをそのまま返却
- `app.py` は `/frontend` をコンテナ内のパスとして明示的に参照
- ファイアウォール（UFW）とVPS側のセキュリティグループで TCP:8000 を開放済み

---

### ✅ 今後の予定（例）

- 静的HTMLの強化（CSSやJSの導入）
- APIの機能追加
- Mosquitto（MQTT）やRedisとの連携確認
- 開発用 → 本番構成への移行（gunicorn + nginx + https）

