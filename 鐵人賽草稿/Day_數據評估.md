# Day ?
# 模型評估
## 評估依據: 決定係數 R^2^ (coefficient of determination)
> 在統計學中用於度量因變量的變異中可由自變量解釋部分所占的比例，以此來判斷統計模型的解釋力。[維基](https://zh.wikipedia.org/wiki/%E5%86%B3%E5%AE%9A%E7%B3%BB%E6%95%B0)

![https://wikimedia.org/api/rest_v1/media/math/render/svg/fed29779d54adeccdec58f0894870c680f3d6b5b](https://wikimedia.org/api/rest_v1/media/math/render/svg/fed29779d54adeccdec58f0894870c680f3d6b5b)
SSres : 殘差平方和
![https://wikimedia.org/api/rest_v1/media/math/render/svg/2669c9340581d55b274d3b8ea67a7deb2225510b](https://wikimedia.org/api/rest_v1/media/math/render/svg/2669c9340581d55b274d3b8ea67a7deb2225510b)
SStot : 總平方和
![https://wikimedia.org/api/rest_v1/media/math/render/svg/aec2d91094ee54fbf0f7912d329706ff016ec1bd](https://wikimedia.org/api/rest_v1/media/math/render/svg/aec2d91094ee54fbf0f7912d329706ff016ec1bd)
yi : 觀察值(label)， fi:預測值， ei: yi-fi: 殘差

-----

在統計教科書的定義 : R^2^ = SSreg / SStotal

SSreg : 回歸平方和
![https://wikimedia.org/api/rest_v1/media/math/render/svg/107a9fb71364b9db3cf481e956ad2af11cba10a1](https://wikimedia.org/api/rest_v1/media/math/render/svg/107a9fb71364b9db3cf481e956ad2af11cba10a1)
> 關於社會科學研究，R2值為0.5或0.6則是常見，R2值大於0.7則很少見。生物或農業研究，R2大於0.9也是不多。但是在儀器效正公式，R2值通常為0.999。 [中興大學](http://amebse.nchu.edu.tw/new_page_535.htm)


-----


<font color="red">模型解釋力越好，R^2^越接近1。</font>
<font color="red">模型解釋力越差，R^2^越接近0。</font>

|參數| w1 | w2 | w3 | w4 | bias | R^2^|
| -------- | -------- | -------- |-------- | -------- |-------- |-------- |
|說明| Lat: 緯度| Lon: 經度|Distance: 離目標地的距離|Speed:速度|偏移量|決定係數|
|實驗1|85.9258325|==833.851985==| 0.000172761469| -0.0237584361|-102694.62563892263|0.6227298859330972|
|實驗2|-1136.52111|==2060.83273==| -0.0127095007|-0.0156634324|-221249.1457116791|0.6303786117557562|
|實驗3.1.0|6.74520588e+01|1.15879474e+02|6.94714089e-03|-2.60241778e-02|-15611.737308694073|0.689679737580==7882==|
|實驗3.1.1|2.33001895|6.79864871|13.09853519|-1.82169245|-3.541795105252505|0.689679737580==8023==|
|實驗3.1.2|0.57736935|1.36166018|  5.05134143| -0.40746203|4.688120121708412|0.689679737580==8013==|
## 實驗1: 單一台車(車牌:KKA-6103)
```python
import pandas as pd
from sklearn.externals import joblib
df = pd.read_csv('clean_train_all.csv') #讀取訓練資料
print('資料數量:',len(df))              
reg2 = joblib.load('save/clf.pkl')      #載入模型       
print('R^2:',reg2.score(df.drop(['time','GPSTime'],axis='columns'),df.time)) #評估模型
print('weight:',reg2.coef_ )   #取得權重
print('bias:',reg2.intercept_) #取得偏移量
```
```python
資料數量: 908
R^2: 0.6227298859330972
weight: [ 8.59258325e+01  8.33851985e+02  1.72761469e-04 -2.37584361e-02]
w1:Lat,w2:Lon,w3:Distance,w4:Speed
bias: -102694.62563892263
```
## 實驗2:單一台車(車牌:KKA-6103)
```python
import pandas as pd
from sklearn import linear_model
reg2 = joblib.load('save/clf_08130413.pkl')
print('R^2:',reg2.score(df.drop(['time','GPSTime'],axis='columns'),df.time))
print('weight:',reg2.coef_ )
print('bias:',reg2.intercept_)
```
```python
資料數量: 849
R^2: 0.6303785544789213
weight: [-1.13652198e+03  2.06083125e+03 -1.56636176e-02 -1.27094919e-02]
w1:Lat,w2:Lon,w3:Distance,w4:Speed
bias: -221248.94569364924
```
## 實驗1 vs 實驗2
* 資料量變少 ++908 -> 849++
因為觀察到資料部分並非每一分鐘收集的資料(如圖1)，推測原因為訊號未確實回傳，收集到資料庫，因此API獲取的資料有所遺漏，所以去除時間不連續的資料(非每一分鐘回傳的資料)

**圖1**
![https://i.imgur.com/qoMgxje.png](https://i.imgur.com/qoMgxje.png)

**圖1對應數據: 14:49、15:28各回傳一次，但中間並沒有回傳**
![https://i.imgur.com/Qo5pwOw.png](https://i.imgur.com/Qo5pwOw.png)

**圖1放大檢視(影片)**
[![Yes](https://img.youtube.com/vi/l5lFS_50BmM/0.jpg)](https://www.youtube.com/watch?v=l5lFS_50BmM)

* 準確率上升 ++0.62...->0.63...++

測試版v1 :實驗1的weights&bias，預測等待的時間比較長。
測試版v2 :實驗2的weights&bias，預測等待的時間比較短。
Summary : 測試版v2的預測等待時間較精準
**前端呈現(影片)**
[![Yes](https://img.youtube.com/vi/Q1K0_VQ7Nrc/0.jpg)](https://www.youtube.com/watch?v=Q1K0_VQ7Nrc)

## 實驗3.1 : 全部車子資料(共14台)
### 3.1.0 : 未標準化
```python
import pandas as pd
from sklearn import linear_model
df = pd.read_csv('0818.csv')
print('資料數量:',len(df))
reg = linear_model.LinearRegression()
reg.fit(df.drop(['Time','GPSTime'],axis='columns'),df.Time)
print('R^2:',reg.score(df.drop(['Time','GPSTime'],axis='columns'),df.Time))
print('weight:',reg.coef_ )
print('bias',reg.intercept_ )
```
```python
資料數量: 15118
R^2: 0.6896797375807882
weight: [ 6.74520588e+01  1.15879474e+02  6.94714089e-03 -2.60241778e-02]
bias -15611.737308694073
```
### 3.1.1 : 標準化 **MinMaxScaler()**
```python
import pandas as pd
from sklearn import linear_model
from sklearn.preprocessing import MinMaxScaler #加載標準化數據模塊

scaler = MinMaxScaler()
df = pd.read_csv('0818.csv')
print('資料數量:',len(df))
df_normalize = scaler.fit_transform(df.drop(['Time','GPSTime'],axis='columns')) #標準化
reg = linear_model.LinearRegression()
reg.fit(df_normalize,df.Time)
print('R^2:',reg.score(df_normalize,df.Time))
print('weight:',reg.coef_ )
print('bias',reg.intercept_ )
```
```python
資料數量: 15118
R^2: 0.6896797375808023
weight: [ 2.33001895  6.79864871 13.09853519 -1.82169245]
bias -3.541795105252505
```
### 3.1.2 : 標準化 **preprocessing.scale()**
```python
import pandas as pd
from sklearn import linear_model
from sklearn import preprocessing #加載標準化數據模塊
df = pd.read_csv('0818.csv')
print('資料數量:',len(df))
df_normalize = preprocessing.scale(df.drop(['Time','GPSTime'],axis='columns')) #標準化
reg = linear_model.LinearRegression()
reg.fit(df_normalize,df.Time)
print('R^2:',reg.score(df_normalize,df.Time))
print('weight:',reg.coef_ )
print('bias',reg.intercept_ )
```
```python
R^2: 0.6896797375808013
weight: [ 0.57736935  1.36166018  5.05134143 -0.40746203]
bias 4.688120121708412
```
## 標準化
### Why 標準化 ? 
**Ans : 提高模型精準度(終極目標)**
### 為何可以提高模型精準度?
**Ans: 標準化 提供機器學習更好的資料結構**

---
## 實測:
### 資料結構 : 有scale 和沒有 scale 的區別

```python
#資料太長，擷取片段 
## 未標準化
                         GPSTime       Lat  ...   Speed  Time
15110  2019-08-12T19:01:59+08:00  24.15009  ...       0     0
15111  2019-08-12T19:02:39+08:00  24.15065  ...      19     0
15112  2019-08-12T19:03:39+08:00  24.15415  ...      37     0
15113  2019-08-12T19:04:39+08:00  24.15546  ...       0     0
15114  2019-08-12T19:05:39+08:00  24.15546  ...       0     0
15115  2019-08-12T19:06:59+08:00  24.15912  ...      36     0
15116  2019-08-12T19:07:59+08:00  24.16160  ...      18     0
15117  2019-08-12T19:08:39+08:00  24.16210  ...       0     0

## 標準化 (preprocessing.scale())
[15118 rows x 6 columns]
[[-1.01077298  1.39996845  1.75067283  1.14879219]
 [-0.80866308  1.34380139  1.57500624 -0.8311457 ]
 [-0.45935175  1.34209936  1.48945253 -0.8311457 ]
 ...
 [ 1.46127642 -1.44923345 -0.84240772  1.46813701]
 [ 1.75100622 -1.83304172 -0.84240772  0.31849566]
 [ 1.80941949 -1.89601691 -0.84240772 -0.8311457 ]]
 
 ## 標準化 (MinMaxScaler())
 [15118 rows x 6 columns]
[[0.22213645 0.75285495 1.         0.44285714]
 [0.27221847 0.74160559 0.93225564 0.        ]
 [0.35877642 0.7412647  0.89926256 0.        ]
 ...
 [0.83470038 0.18220556 0.         0.51428571]
 [0.90649426 0.10533492 0.         0.25714286]
 [0.92096883 0.092722   0.         0.        ]]
```

### 評估結果 
有上升，但微乎其微。

| 未標準化 | 標準化(1)| 標準化(2) |
| -------- | -------- | -------- |
| 0.6896797375807882     | 0.6896797375808023     | 0.6896797375808013    |

