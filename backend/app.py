# backend/app.py
from flask import Flask, send_from_directory
import os

# frontend フォルダへの絶対パスを取得
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
frontend_path = os.path.join(base_dir, 'frontend')

app = Flask(__name__, static_folder=frontend_path)

@app.route('/')
def index():
    return send_from_directory(frontend_path, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
