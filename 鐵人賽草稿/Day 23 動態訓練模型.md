## 架構圖 
![](https://i.imgur.com/HTlSYfD.png)
## record.json 救回來
json_load() load 出來 代表資料齊全，沒出來 代表手動繼續補
```python
import json
with open('record.json','r') as f:
    json_string = json.load(f)

print(type(json_string))
print(len(json_string)) 

count = 0
cmp   = 0
complete = 0
for key in json_string:
    print(len(json_string[key]))
    cmp = cmp + len(json_string[key]) 
    for i in json_string[key]:
        if len(i) == 4 :
            count = count + 1            
            if 'GPSTime:' in i.keys() and  'Speed' in i.keys() and 'Lat' in i.keys() and 'Lon' in i.keys():
                complete = complete + 1        
print(cmp,complete)            
```
處理資料
```python
#載入收集來的資料
import json
with open('./record.json','r') as load_f:
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
    #print(load_dict[key]) #[{第一筆資料},{第2筆資料},...]...[]
    #print(load_dict[key][0])
    #input('Stop')
    
    for item in load_dict[key]:
        if len(item) == 4 :
            #print(item['Lat']) #每一筆資料的距離(target)的依據 #Lat
            #print(item['Lon']) #每一筆資料的距離(target)的依據 #Lon
            GPSTime.append(item['GPSTime:'])
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
#print(add_dis)
#print(len(add_dis))
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
        #input('stop')
        if (year2-year)==0 and (month2-month)==0 and (day2-day)==0 and (hour2-hour)==0 and (min2-minu)==1:
            #X = GPSTime[i][0:10]+' '+GPSTime[i][11:16]
            #X = datetime.strptime(str(X),"%Y-%m-%d %H:%M")
            #print(X)
            #print(A)
            #input('stop')
            X=GPSTime[i][14:16]
            X=int(X)
            
            #a = X - A 
            #a=str(a)
            ctime[j] = X - minu
            #print(a)
            #input('stop')
        else:
            break
        j = j - 1            
#print(ctime)

#將訓練資料儲成表格.csv
import csv
with open('0827.csv','w',newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['GPSTime','Lat','Lon','disTO','Speed','Time'])
    for i in range(train_number):
        if i in ctime.keys():
            writer.writerow([GPSTime[i],Lat[i],Lon[i],add_dis[i],Speed[i],ctime[i]])
```            
訓練模型
```python
import pandas as pd
from sklearn import linear_model
df = pd.read_csv('0827.csv')
print('資料數量:',len(df))
reg = linear_model.LinearRegression()
reg.fit(df.drop(['Time','GPSTime'],axis='columns'),df.Time)
print('R^2:',reg.score(df.drop(['Time','GPSTime'],axis='columns'),df.Time))
print('weight:',reg.coef_ )
print('bias',reg.intercept_ )
```
![](https://i.imgur.com/4fh2rrQ.jpg)