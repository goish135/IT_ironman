## 每日任務
選取 Firebase 部分資料 (其中一台) 為 訓練data。
以 sklearn 的 linear model 為模型 。
## Code
**資料處理** 
讀取 Firebase ， 將其中一台資料(7/28~8/5)依欄位寫入特徵值
```python
from firebase_admin import firestore
import json
cred = credentials.Certificate('./serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

path = "bus"
collection_ref = db.collection(path)
docs = collection_ref.where('PlateNumb','==','KKA-6103').get()
docs = list(docs)
print('len:',len(docs))
latlon = []
count = 0
import csv
for doc in docs:
    docc = doc.to_dict()
    print(docc['GPSTime'])
    print(docc['Lat'])
    print(docc['Lon'])
    print(docc['Speed'])
    count = count + 1

with open('train.csv','w',newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['GPSTime','Lat','Lon','Speed'])
    for doc in docs:
        docc = doc.to_dict()
        writer.writerow([docc['GPSTime'],docc['Lat'],docc['Lon'],docc['Speed']])
```
計算其他特徵值 (距離中教大的**距離**)
```python
import csv
total_train = 0
timeSerial = []
Lat = []
Lon = []
Speed = []
with open('train.csv',newline='') as csvfile:
    rows = csv.reader(csvfile)
    for row in rows:
        timeSerial.append(row[0])
        Lat.append(row[1])
        Lon.append(row[2])
        Speed.append(row[3])
        total_train = total_train + 1
    
#計算距離 
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
    
#載入路線經緯度資料
import json
with open('save.json' , 'r') as reader:
    route = json.loads(reader.read())
#載入距離對照資料
with open('disTable.json' , 'r') as reader:
    distoNTCU = json.loads(reader.read())    
    
add_dis = []

for i in range(1,total_train):
    min = 3000
    count = 0
    rd = -1     # 不列入train data
    for j in range(0,13):
        if(float(Lat[i])!=route[j][0] and float(Lon[i])!=route[j][1]):
            dis = getDistance(float(Lat[i]),float(Lon[i]),route[j][0],route[j][1])
        else:
            dis = 0        
        if dis < min and count < 13:
            rd = distoNTCU[count]
            min = dis
        count = count + 1
    add_dis.append(rd)
   
import csv
with open('train_feature.csv','w',newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['GPSTime','Lat','Lon','Speed','Distance'])
    for i in range(1,total_train):
        writer.writerow([timeSerial[i],Lat[i],Lon[i],Speed[i],add_dis[i-1]])
```
計算label
```python
import csv
data = []
with open('train_feature.csv',newline='') as csvfile:
    rows = csv.reader(csvfile)
    for row in rows:
        data.append(row)

from datetime import datetime 
count = 0
label = []
for i in data:
    str1 = '26.136332967166602'
    if str(i[3]) == str1:
        label.append([count,0])
        temp = count-1
        while data[temp][3]!= "0":
            a=i[0]
            A = a[0:10]+' '+a[11:19]
            B = data[temp][0][0:10] + ' '+ data[temp][0][11:19]
            A = datetime.strptime(str(A),"%Y-%m-%d %H:%M:%S")
            B = datetime.strptime(str(B),"%Y-%m-%d %H:%M:%S")
            label.append([temp,(A-B).seconds/60])
            temp = temp - 1            
    count = count + 1
    
with open('train_all.csv','w',newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['GPSTime','Lat', 'Lon', 'disTOtarget','Speed','time'])
    for z in range(1,len(data)):
        flag = 1
        for zz in range(len(label)):
            if label[zz][0] == z:
                record = label[zz][1] 
                flag = 0
                break
        if flag == 1:
            record = -1
        writer.writerow([data[z][0],data[z][1],data[z][2],data[z][3],data[z][4],record])  
```
將 超過 欲預測站點 的等待時間資料拿掉 
```python
data = []
import csv 
with open('train_all.csv',newline='') as csvfile:
    rows = csv.reader(csvfile)
    for row in rows:
        data.append(row)

print(data)

with open('clean_train_all.csv','w',newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['GPSTime','Lat', 'Lon', 'disTOtarget','Speed','time'])
    
    for i in range(1,len(data)):
        if data[i][5] != '-1':
            writer.writerow([data[i][0],data[i][1],data[i][2],data[i][3],data[i][4],data[i][5]])     
```
---
**訓練模型**
y = a x w1 + b x w2 + c x w3 + d x w4 + b
w1 : Lat
w2 : Lon
w3 : disTOtarget
w4 : Speed
```python
import pandas as pd
import numpy as np
from sklearn import linear_model

df = pd.read_csv('clean_train_all.csv.csv')
print('資料數量:',len(df))
reg = linear_model.LinearRegression()
reg.fit(df.drop(['time','GPSTime'],axis='columns'),df.time)
print(reg.score(df.drop(['time','GPSTime'],axis='columns'),df.time)) # R^2 決定係數
print(reg.coef_ )       # weight 
print(reg.intercept_ )  # bias
```
## Demo
**train.csv** 部分特徵值 ['GPSTime','Lat','Lon','Speed']
![](https://i.imgur.com/vzAAeKw.png)
**train_feature.csv** 使用 Lat,Lon 距離 路線哪一點比較近，再對照 那一點距離中教大多遠，填入 train data 的 feature 
![](https://i.imgur.com/Y6xpHCz.png)
**train_all.csv** 訓練資料 features + label 
![](https://i.imgur.com/00iLtli.png)
**result**
w1 : 85.9258325
w2 : 833.851985
w3 : 0.000172761469
w4 : -0.0237584361
bias : -102694.62563892263
`決定係數 : 0.6227298859330972`
==> 所花時間 = w1 x 經度 + w2 x 緯度 + w3 x 距離 + w4 x 速度 + (-102694.62563892263)
![](https://i.imgur.com/Fi6QCOA.jpg)
