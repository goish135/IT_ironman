## What is Firebase ?
>Firebase是Firebase，Inc。於2011年開發的移動和Web應用程序開發平台，隨後於2014年被Google收購。截至2018年10月，Firebase平台共有18種產品，150萬個應用程序使用這些產品。 [wiki](https://en.wikipedia.org/wiki/Firebase)

>Firebase 支援 Android、iOS及網頁的app雲端開發平台。 [截錄出處](https://tw.alphacamp.co/blog/2016-07-22-firebase)
> * 開發(Develop) 
> 安全且高效能。
>提供的後端服務 include `即時資料庫 (Realtime database)`、
>簡單的身分驗證模組(Authentication)、雲端訊息(Cloud Messaging)、
>主機(Hosting)、檔案儲存(Storage)、及遠端配置(Remote Config)等
>讓使用者可以`輕鬆測試不同環境(OS與硬體裝置)的產品運作是否正常及順暢`。
>* 成長(Grow) : 與Google的深度整合，串接app行為資料，讓使用者(app開發者)提供更精準的廣告或溝通訊息給顧客。
>* 獲利(Earn) : 廣告。
> 1. 事件紀錄無上限
> 2. 支援原始資料自動匯出 `巨量資料分析` `PB等級的資料` `BigQuery`  
>**BigQuery:**
>* 收費 : 查詢和資料儲存
>* 免費 : 資料載入和匯出
>![](https://uploads-ssl.webflow.com/5b559436ff2e007783c2c551/5b97b01464609fa20450766d_big-query.png)
>圖片提供：[Steven Hsieh](https://www.linkedin.com/in/pei-kang-hsieh-78830232)
>3. 可直接行動的分析工具 : 將客戶群分類，推撥(push)廣告給目標族群。 
## Why i use Firebase ?

在使用過SQL Server(Microsoft)，再裝 Visual Studio，安裝時間久，耗記憶體。 (壞印象)
但其實很多國家考試都很喜歡考 (C# plus SQL) ，而通常會使用的開發平台為以上所提的兩個。
接Case時，分析需求後，思考使用的工具，PHP plus MySQl 最為適當。 
在 安裝上 我使用 XAMPP ，簡易網頁伺服器，還包含MySQL。 安裝快速，不會耗記憶體，方便使用。(好印象)
這次想來嘗嘗鮮，且不想總是開著電腦(收集OpenData)，所以我選擇 FireBase來體驗看看。
## How to use Firebase ?
可以看看這位大師寫的教學文
* [10分鐘建立專屬資料庫](https://medium.com/pyradise/%E5%8D%81%E5%88%86%E9%90%98%E5%BB%BA%E7%AB%8B%E5%B0%88%E5%B1%AC%E8%B3%87%E6%96%99%E5%BA%AB-c9f9de6728b6)
* [60秒搞懂firestore資料結構](https://medium.com/pyradise/60%E7%A7%92%E6%90%9E%E6%87%82firestore%E8%B3%87%E6%96%99%E7%B5%90%E6%A7%8B-c61ba6206cba)
* [10分鐘資料庫操作 — 新增資料](https://medium.com/pyradise/10%E5%88%86%E9%90%98%E8%B3%87%E6%96%99%E5%BA%AB%E6%93%8D%E4%BD%9C-%E6%96%B0%E5%A2%9E%E8%B3%87%E6%96%99-b96db385e1e4) 
* [10分鐘資料庫操作 — 讀取資料](https://medium.com/pyradise/10%E5%88%86%E9%90%98%E8%B3%87%E6%96%99%E5%BA%AB%E6%93%8D%E4%BD%9C-%E8%AE%80%E5%8F%96%E8%B3%87%E6%96%99-608f49645f92)
* [10分鐘資料庫操作 — 更新資料](https://medium.com/pyradise/10%E5%88%86%E9%90%98%E8%B3%87%E6%96%99%E5%BA%AB%E6%93%8D%E4%BD%9C-%E6%9B%B4%E6%96%B0%E8%B3%87%E6%96%99-7bdcab299120)
* [10分鐘資料庫操作 — 刪除資料](https://medium.com/pyradise/10%E5%88%86%E9%90%98%E8%B3%87%E6%96%99%E5%BA%AB%E6%93%8D%E4%BD%9C-%E5%88%AA%E9%99%A4%E8%B3%87%E6%96%99-f69571904e0d)
建議按照順序看下來，因為有其脈絡，先後順序。
全部看完只需 51 分鐘 !!! (理論上)
針對  我自己想達成的階段目標(定時collect資料放進firebase)，我看到讀取資料，就開始動手做做看囉~~~
其實可以從第一篇就跟著做做看，個人覺得很容易上手XD
## Firebase Monitoring.
![](https://i.imgur.com/upXr7p9.png)

## Limit.
![](https://i.imgur.com/oDF73VH.png)
![](https://i.imgur.com/buwnMmC.png)
## Code
**設定firebase的存取**
```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate('./serviceAccount.json') # 憑證放置路徑
firebase_admin.initialize_app(cred)
db = firestore.client()
```
**介接API的資料**
```python
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
import os
import time
from apscheduler.schedulers.blocking import BlockingScheduler
def tick():
    global str1
    a = Auth(app_id, app_key)
    response = request('get', "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", headers= a.get_auth_header())
    str1 = str(response.content,'utf-8')
    jsonValue = json.loads(str1)
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
**設定排程 每五秒進行爬取**
```python
if __name__ == '__main__':
    scheduler = BlockingScheduler()
    scheduler.add_job(tick, 'interval', seconds=5)
    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C    '))

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass
```
## Demo (產出資料)
![](https://i.imgur.com/gtmm1jc.png)
## Official Review (使用心得)
![](https://i.imgur.com/WzGSrzX.jpg)
[改自劉沛影片](https://www.youtube.com/channel/UCK3Ycl9dcHk0qz8yoN-6phA)
``簡單易上手，讚啦 ~~~ 未來請多多指教!!!``
## Follow Me
* [30天鐵人鍊成紀錄](https://github.com/goish135/IT_ironman/tree/master/Day9)
## Ref 
* [配額說明](https://cloud.google.com/appengine/quotas?hl=zh_TW)

