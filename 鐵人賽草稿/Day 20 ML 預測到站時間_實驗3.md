## 承先
實驗 1 和 實驗 2 皆為單一條公車資料 。
同樣地 ，嘗試用更多的資料 train 模型，看看會不會有更高的準確率。
## 啟後
這次 使用 所有 9018 的公車資料 (共14台) ，資料時間 : 7/28 ~ 8/12 ，資料數量為 15118。
## Code 
存取 firebase
```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
cred = credentials.Certificate('./serviceAccount.json') # firebase 的憑證 
firebase_admin.initialize_app(cred)
db = firestore.client()
```
將 集合 bus (往鹿港) 全部 讀取下來 並 做資料類型的轉換，最後 寫入 json。
```python
path = "bus"
collection_ref = db.collection(path)
docs = collection_ref.get()
save = []
for doc in docs:
    save.append(doc.to_dict())    
import json
with open('AllData.json','w') as f:
    json.dump(save,f,indent=4)
```
將 車子 依 車牌做分類 ，寫入 json (classify.json) 。
```python
import pandas as pd
import numpy as np

filepath = "./AllData.json"
data = pd.read_json(filepath,orient='values',encoding='utf-8')

import json
mydict = {}
for i in range(len(data)):
    temp = {}
    temp['GPSTime'] = str(data['GPSTime'][i])
    temp['Speed'] = int(data['Speed'][i])
    temp['Lat'] = float(data['Lat'][i])
    temp['Lon'] = float(data['Lon'][i])  
    if data['PlateNumb'][i] in mydict: 
        mydict[data['PlateNumb'][i]].append(temp)
    else:
        mydict[data['PlateNumb'][i]] = list()
        mydict[data['PlateNumb'][i]].append(temp)
print(len(mydict))        
with open('classify.json','w+') as f:
    json.dump(mydict,f,indent=4)
```
將 收集下來的資料 classify.json 處理成 train data: **0818.csv**
```python
#載入收集來的資料
import json
with open('./classify.json','r') as load_f:
    load_dict = json.load(load_f)

#print(load_dict) #測試是否載入資料成功

#計算其他需要的特徵值 - distance,time

#print(len(load_dict)) #共14台 負責跑台中
GPSTime = []
Lat     = []
Lon     = []
Speed   = []

train_number = 0
for key in load_dict:
    for item in load_dict[key]:
        GPSTime.append(item['GPSTime'])
        Lat.append(item['Lat'])
        Lon.append(item['Lon'])
        Speed.append(item['Speed'])
        train_number = train_number+1        
#計算 label
##前備工具(1):計算點點距離
import math
def getDistance(latA, lonA, latB, lonB):  
    ra = 6378140  # radius of equator: meter  
    rb = 6356755  # radius of polar: meter  
    flatten = (ra - rb) / ra  # Partial rate of the earth  
    # change angle to radians  
    radLatA = math.radians(latA)  
    radLonA = math.radians(lonA)  
    radLatB = math.radians(latB)  
    radLonB = math.radians(lonB)        
    pA = math.atan(rb / ra * math.tan(radLatA))  
    pB = math.atan(rb / ra * math.tan(radLatB))  
    x = math.acos(math.sin(pA) * math.sin(pB) + math.cos(pA) * math.cos(pB) * math.cos(radLonA - radLonB))   
    c1 = (math.sin(x) - x) * (math.sin(pA) + math.sin(pB))**2 / math.cos(x / 2)**2        
    c2 = (math.sin(x) + x) * (math.sin(pA) - math.sin(pB))**2 / math.sin(x / 2)**2    
    dr = flatten / 8 * (c1 - c2)  
    distance = ra * (x + dr)    
    return distance
##前備工具(2):載入路線經緯度資料
with open('save.json' , 'r') as reader:
    route = json.loads(reader.read())
##前備工具(3):載入距離對照資料
with open('disTable.json' , 'r') as reader:
    distoNTCU = json.loads(reader.read())
#計算離target的大略距離(先)
add_dis = []
for i in range(train_number):
    min = 3000
    rd = -1     # 不列入train data
    for j in range(0,13):
        if(float(Lat[i])!=route[j][0] and float(Lon[i])!=route[j][1]):
            dis = getDistance(float(Lat[i]),float(Lon[i]),route[j][0],route[j][1])
        else:
            dis = 0        
        if dis < min :
            rd = distoNTCU[j]
            min = dis            
    add_dis.append(rd)

#計算距離TARGET 所花時間(label)(後)
from datetime import datetime
from dateutil.parser import parse
ctime = {}
for i in range(train_number):
    
    flag = 0
    if  str(add_dis[i])=="26.136332967166602":
        ctime[i] = "0"    
        flag = 1
        j = i - 1        
    while flag == 1 and str(add_dis[j])!="26.136332967166602":
        if j==1 or str(add_dis[j])=="-1":
            break

        year = GPSTime[j][0:4]
        year = int(year)
        #print('year:',int(year))
        month = GPSTime[j][5:7]
        #print('month:',int(month))
        month = int(month)
        day  = GPSTime[j][8:10]
        #print('day:',int(day))
        day = int(day)
        hour = GPSTime[j][11:13]
        #print('hour:',int(hour))
        hour = int(hour)
        minu = GPSTime[j][14:16]
        minu = int(minu)
        #print('min:',minu)
        
        year2 = GPSTime[j+1][0:4]
        year2 = int(year2)
        month2 = GPSTime[j+1][5:7]
        month2 = int(month2)
        day2  = GPSTime[j+1][8:10]
        day2  = int(day2)
        hour2 = GPSTime[j+1][11:13]
        hour2 = int(hour2)
        min2 = GPSTime[j+1][14:16]
        min2 = int(min2)        
        if (year2-year)==0 and (month2-month)==0 and (day2-day)==0 and (hour2-hour)==0 and (min2-minu)==1:
            X=GPSTime[i][14:16]
            X=int(X)
            ctime[j] = X - minu
        else:
            break
        j = j - 1            
#print(ctime)

#將訓練資料儲成表格.csv
import csv
with open('0818.csv','w',newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['GPSTime','Lat','Lon','disTO','Speed','Time'])
    for i in range(train_number):
        if i in ctime.keys():
            writer.writerow([GPSTime[i],Lat[i],Lon[i],add_dis[i],Speed[i],ctime[i]])
```
train model 
```python
import pandas as pd
from sklearn import linear_model
from sklearn.preprocessing import MinMaxScaler
from sklearn import preprocessing
scaler = MinMaxScaler()
        
df = pd.read_csv('0818.csv')
print('資料數量:',len(df))
df_normalize = scaler.fit_transform(df.drop(['Time','GPSTime'],axis='columns'))
# df_normalize = preprocessing.scale(df.drop(['Time','GPSTime'],axis='columns')) # 標準化 (1)
# df_normalize = scaler.fit_transform(df.drop(['Time','GPSTime'],axis='columns')) #標準化 (2)
# print(df_normalize)

reg = linear_model.LinearRegression()
reg.fit(df.drop(['Time','GPSTime'],axis='columns'),df.Time)
#reg.fit(df_normalize,df.Time)
print('R^2:',reg.score(df_normalize,df.Time))
print('weight:',reg.coef_ )
print('bias',reg.intercept_ )
```
## Demo
**AllData.json**
![](https://i.imgur.com/qDKlNwq.png)

**classify.json**
![](https://i.imgur.com/8zH45xQ.png)

**14台不同車牌的 9018 公車**
![](https://i.imgur.com/owjzSzb.png)
**Result**
![](https://i.imgur.com/H878b79.png)