## 資料收集
**架構圖**

![](https://i.imgur.com/1oGlyGb.png)
**說明**
前一篇(Day9)有介紹 如何新增資料(動態經緯資料）進Firebase,這一篇將介紹如何依照設定的條件讀取出來。
在Firebase 儲存的資料包括所有往鹿港的車子追蹤資料，而要畫出其路線只需1小時的隨機`一台車`的追蹤資料，所以條件中只要將隨機指定的那台車的資料收集起來。
而公車有去和返方向，所以我在firebase分兩個集合做收集，收集間隔為1分鐘（crontab 最小單位）。
讀取完 ，取前60個點左右 繪製於地圖。
如果不是取60左右個點，會是很幾條線疊在一起。（見上一篇）
`資料結構： 集合/文件 組成`
集合（第一個只能放集合）> 集合或文件>...
Ex:
![](https://i.imgur.com/W8w9jW9.png)
>集合名稱 ：Bus : 去程
>文件： GPSTime (為不同值）： 車機時間
>`一旦為同值會覆蓋下一層的集合內容。`
>集合：
>PlateNumb(車牌)
>Speed
>Lat (緯度)
>Lon (經度)
>GPSTime 
> ---
>集合名稱 ： BusBus 回程
>其他同上

## 程式碼
**存取firebase**
```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
cred = credentials.Certificate('./serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
```
**收集指定車牌的資料**
```python
path = "bus" #第一層集合名稱 (收集往鹿港方向車子資訊)
collection_ref = db.collection(path) 
docs = collection_ref.where('PlateNumb','==','KKA-6103').get() # 指定車牌為 KKA-6103的車子資料
docs = list(docs)
latlon = [] #存放經緯度資料
count = 0   #計算有幾個點
for doc in docs:
    if count > 60 :          # 收集60個點
        break
    docc = doc.to_dict()
    print(docc['GPSTime'])
    print(docc['Lat'])
    print(docc['Lon'])
    print(docc['Speed'])
    latlon.append([docc['Lat'],docc['Lon']])  # 將資料放入latlon裡
    count = count + 1
```
**寫入json檔做紀錄**
```python
with open("./latlon.json",'w') as file_object:
    json.dump(latlon,file_object)
```
## Demo 
`篩選後的資料於Web呈現` `路線切換`
[latlon.json檔案位置](https://github.com/goish135/IT_ironman/blob/master/Day7%26Day8/latlon.json)
影片 ↓ 黃色線為往鹿港方向，而藍色線為往台中方向，其實仔細一看，會發現有兩處不太一樣。
[![Yes](https://img.youtube.com/vi/Rgxb9kPHQxU/0.jpg)](https://www.youtube.com/watch?v=Rgxb9kPHQxU)
## Follow Me
[30天鐵人鍊成紀錄](https://github.com/goish135/IT_ironman/tree/master/Day10)
## 下回預告
HaHa，已經把基本的需求都實現啦! 
那我們就應該把他放在網路上給大家玩玩看啦 或是 測試看看 讓大家給些建議，繼續提升Web App的品質。
明天我們就把等公車網頁放到線上，會分享一些放網頁的免費平台喔!及一些心路歷程。