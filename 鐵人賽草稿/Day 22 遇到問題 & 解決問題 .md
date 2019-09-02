## 架構圖 (New)

### 轉變 儲存位置 from Firebase to json
拋棄 Firebase 的原因是 把資料讀取有 次數限制，因為資料為每天持續收集，但每天都會收一次全部的資料，做訓練，會有 `Quota Exceed` 狀況。
**資料結構**
`Firebase`
集合(去程/回程) -> 文件(GPSTime) -> 集合(PlateNumb+GPSTime+Speed+Lon+Lat) 
`json`
{"車牌號碼1":[{資料1},{資料2},...],"車牌號碼2":[{資料1},{資料2},...]...}
---
## 問題描述
8/23 檢查 log (/var/mail/root)看看程式執行情況，發現 程式執行到 json.loads() 有 json.decoder.**JSONDecodeError**，Google 查了一下可能原因，通常都是 數據問題，所以從 GCP 下載 record.json (儲存每一分鐘收集的公車動態經緯度資料)，滑到 Line 622 column 48 的位置，並沒有把資料完整寫入，~~其下的資料，順序上也出現問題，應該要是(GPSTime>Speed>Lon>Lat)，但看到卻是 亂序，找不出規律~~ 。
![](https://i.imgur.com/snoAXSY.png) 
**record.json**
![](https://i.imgur.com/JrpO3kW.png)
## 處理方式
推測是1分鐘時間來不及寫入，而造成數據寫入不完全。
*  將時間調成每五分鐘 收一次資料 。
```bash
*/5 6-22 * * * python3 /home/turningpoint1125/collect_data.py
```
* Try... Except...
```python
try: #數據正常
    # 回報 date & weights & bias 
    # 紀錄 date & weights & bias 於 csv 
    # 寄 mail ，訊息設定為 'Good night.' 
except:
    # 回報 數據問題
    # 寄 mail ，訊息設定為 'Programmer No Life.'
```

* 處理 `record.json` ， 統計出 共幾筆資料，正常數量，異常數量(欄位順序錯)
   1. 手動補齊 json 格式
   ![](https://i.imgur.com/peu8MXG.jpg)
   ~~2. 判斷欄位順序是否正確~~ dict 的 key 沒有欄位順序可言  
   


