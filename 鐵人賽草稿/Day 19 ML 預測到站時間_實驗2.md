## 承先 
實驗1 資料(**clean_train_all.csv**) 時間為 __7/28~8/5__ ，資料數量為 908 。
原本 是想說 用更多的資料 下去 train ，看看準確率會不會提升。
所以 有了實驗2 。
## 啟後
實驗2 資料(**190813_label.csv**) 時間為 __7/28~8/12__，資料數量為 849 。
HaHa ，是不是再想說為什麼 資料數量反而變少啦?!
因為 在重 run 一次 流程 處理資料 (1) 收集特徵值 (2) 計算其他特徵值 (3) 計算label ，在(2)的時候 發現原本的
程式 不適用於 計算label 。有些資料並不是理論上按照一分鐘回傳回來，可能間隔30分鐘，才回傳，這樣會造成誤差。
所以 (2) -> (3) 我在原本程式當中，又多加一個檢查是否一分鐘回傳的條件，資料雖然收集的時間延長但篩掉一些不符合條件的資料，加加減減，反而最後是變少的情況。
## Code
```python
#讀取feature
import csv
data = []
with open('190812_KKA-6103_features.csv',newline='') as csvfile:
    rows = csv.reader(csvfile)
    for row in rows:
        data.append(row)

#計算label
from datetime import datetime
ctime = {}
for i in range(1,len(data)):
    
    flag = 0
    if  str(data[i][4])=="26.136332967166602":
        stop = i
        flag = 1
        j = i - 1        
    while flag == 1 and str(data[j][4])!="26.136332967166602":
        if j==1 or str(data[j][4])=="-1":
            break
        A = data[j][0][0:10]+' '+data[j][0][11:16]
        A = datetime.strptime(str(A),"%Y-%m-%d %H:%M")
        B = data[j+1][0][0:10]+' '+ data[j+1][0][11:16]
        B = datetime.strptime(str(B),"%Y-%m-%d %H:%M")
        D = B - A 
        D = str(D)
        if D[3:4] == "1":       # 相差一分鐘 才放進 train data
            X = data[i][0][0:10]+' '+data[i][0][11:16]
            X = datetime.strptime(str(X),"%Y-%m-%d %H:%M")
            a = str(X - A)            
            ctime[j] = a[2:4] 
        j = j - 1            

with open('190813_label.csv','w',newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['GPSTime','Lat', 'Lon', 'Speed','disTOtarget','time'])
    for i in range(1,len(data)):
        if i in ctime.keys():
            writer.writerow([data[i][0],data[i][1],data[i][2],data[i][3],data[i][4],ctime[i]])        
```
## Demo 
**190812_KKA-6103_features.csv** 第78筆資料 和 第79筆 資料 相差 38 min 。
![](https://i.imgur.com/NOTqudm.png)
**190813_label.csv**
![](https://i.imgur.com/QPqkjRI.png)
**Result**
預估等待時間 = (-1136.52111) x Lat + 2060.83273 x Lon + (-0.0127095007) x 距離 + (-0.0156634324) x 速度 + (-221249.1457116791)
決定係數 : **0.6303786117557562**
