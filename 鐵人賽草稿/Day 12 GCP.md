What is GCP ? 
Google Cloud Platform 
>Google雲端平台是一項使用了Google核心基礎架構、資料分析和機器學習技術的雲計算服務。

*GCP 使用案例*
>1. SPOTIFY
>在導入 dataflow、BigQuery 之後，Spotify 從原本一個禮拜為一位使用者產出一個播放清單，到現在一天就能產出六個，這必須歸功於 GCP 完整的大數據分析功能。
>2. VoiceTube
影片串流平台注重速度，原本使用Linode Latency : 40ms ，改用GCP後 Latency : 7ms 。
Natural Language API：字幕的單句結構分析，使用此 API 來改善英文翻譯內容的精確度
>3. SCM (Surprise Captain Map) Since 2018
我於去年開發的導航
   * Google Drive API // 實現自動上傳資料到雲端備份動態速率資料
   ![](https://i.imgur.com/k9mH6I9.png)
   * Google Sheets API // 收集特徵值(天氣)資料 存放地方
   ![](https://i.imgur.com/63kzpcW.png)
   * Direction API : 規劃路徑
   
Why i use GCP ? 
因為 Heroku 的 dyno 耗盡啦 QQ
所以 跳槽 GCP ，使用免費額度 ，但要綁定信用卡，穩定 不會有dyno 用完的時候(目前)，我覺得對於這次的主題來說， GCP 就是 網頁版的 VM ，開GCP，使用ssh連線 VM，丟程式碼上去，微做修改，crontab 排程 執行，一開始 資料存在 firebase ，後來放文字檔(.json)。
![](https://i.imgur.com/GFPta2N.png)
![](https://i.imgur.com/v7FVgET.png)
Command :
```
    $ sudo su #切到root
    $ crontab -l #查看目前排程
    $ crontab -e #編輯排程
    $ crontab -r #移除排程
    $ sudo apt-get install postix #安裝郵件伺服器
    $ vi /var/mail/root #查看日誌
    $ cp /dev/null /var/mail/root #可清除日誌
```
test crontab : 
[crontab.guru - the cron schedule expression editor](https://crontab.guru/)
---
Code :
```python

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate('/home/turningpoint1125/serviceAccount.json') # 絕對路徑 # 絕對重要
firebase_admin.initialize_app(cred)
db = firestore.client()
from hashlib import sha1
import hmac
from wsgiref.handlers import format_date_time
from datetime import datetime
from time import mktime
import base64
from requests import request
from pprint import pprint
import json
app_id = ''
app_key = ''
class Auth():

    def __init__(self, app_id, app_key):
        self.app_id = app_id
        self.app_key = app_key

    def get_auth_header(self):
        xdate = format_date_time(mktime(datetime.now().timetuple()))
        hashed = hmac.new(self.app_key.encode('utf8'), ('x-date: ' + xdate).encode('utf8'), sha1)
        signature = base64.b64encode(hashed.digest()).decode()

        authorization = 'hmac username="' + self.app_id + '", ' + \
                        'algorithm="hmac-sha1", ' + \
                        'headers="x-date", ' + \
                        'signature="' + signature + '"'
        return {
            'Authorization': authorization,
            'x-date': format_date_time(mktime(datetime.now().timetuple())),
            'Accept - Encoding': 'gzip'
        }


if __name__ == '__main__':
    a = Auth(app_id, app_key)
    response = request('get', "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", headers= a.get_auth_header())
    print(type(response.content))
    str = str(response.content,'utf-8')
    print(type(str))
    jsonValue = json.loads(str)
    print(type(jsonValue))

    for item in jsonValue:
        print('GPSTime:'+item['GPSTime'])
        print(item['BusPosition']['PositionLat'])
        print('經度:',item['BusPosition']['PositionLon'])
        print('Speed',item['Speed'])
        doc = {
            'PlateNumb': item['PlateNumb'],
            'GPSTime': item['GPSTime'],
            'Lat':item['BusPosition']['PositionLat'],
            'Lon':item['BusPosition']['PositionLon'],
            'Speed':item['Speed']
        }
        doc_ref = db.collection("bus").document(item['GPSTime'])
        doc_ref.set(doc)
```
Notice :
在 crontab -e 編輯 排程時，執行哪份檔案絕對要寫 `絕對路徑`
程式碼裡 牽扯到 讀取哪個檔案 寫入哪個檔案 也要 `絕對路徑`
