# basic command

## 開発状況

- WSLのdocker上の構築

### ubuntu
- logout
- > su - {username}


### githubの使い方
- git status
- git add .
- git commit -m "msg"
- git push origin main
- git pull origin main
    - 引込
- git checkout -- mosquitto/log/mosquitto.log
    - 放棄 


### dockerの使い方
- sudo service docker start
- docker info
- docker ps
- docker compose up -d --build
    - docker-compose.ymlに基づいて起動
    - 現在、httpも起動する
- docker compose down
    - dockerを落とす 

### mosquittoの使い方
- ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1
    - ipアドレスに対して、Windows側からmqtt://{IPアドレス}:1883で接続
- mosquittoの再起動
    - docker restart mosquitto
- errorメッセージの確認
    - docker compose logs -f mosquitto

### Flask serverの立て方
- cd backend
- python3 app.py


