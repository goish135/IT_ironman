# Day 2 主角 : [ptx 公共運輸整合資訊流通服務平台](https://ptx.transportdata.tw/PTX/)

---

> 交通部積極發展「公共運輸整合資訊流通服務平臺」(Public Transport Data eXchange，PTX)， 與各公共運輸機關平台協作建立標準化、高效能、跨運具之公共運輸旅運開放資料服務，以OData (Open Data Protocol)標準介面提供高品質、 開放資料達四星級之公共運輸旅運資料服務API，提供產官學各界加值單位以機器對機器(M2M)資料交換機制介接應用。PTX平臺涵蓋全國尺度之公路、 軌道、航空及航運4大類公共運輸旅運相關動靜態資料。 
Ref: [ptx](https://ptx.transportdata.tw/PTX/)

## 預期達成階段目標
* 取得每10秒的9018公車 `動態經緯度資料`呈現於地圖上

## 找資料囉 
>**Step1 : 點公車**

![](https://i.imgur.com/QRK175x.png)
>**Step2: 點左側 `台中市政府交通局`，再點右邊的`臺中市市區公車動態定時資料服務(A1)`**

![](https://i.imgur.com/5d50ATo.png)
>**Step3: Ctrl + F 找到 InterCityBus**

Inter : 之間
台中和彰化 `之間` 的 9018 路線公車往返
![](https://i.imgur.com/9gYFKG8.png)
>**Step4: 選擇第二個 [取得指定[路線名稱]的公路客運動態定時資料(A1)](https://ptx.transportdata.tw/MOTC?t=Bus&v=2#!/InterCityBus/InterCityBusApi_RealTimeByFrequency_1)**

![](https://i.imgur.com/lFjUjjs.png)

>可以看到我們需要的`經緯度資訊`和其他`重要資訊`

**經緯度資訊:**
PositionLat : 緯度
PositionLon : 經度
**其他重要資訊:**
* PlateNumb : 車牌號碼
用於區別是哪一台車的經緯度
* Direction : 方向
去程 : 台中往彰化 `value:0`
回程 : 彰化往台中 `value:1`
* GPSTime : 車機時間
視為資料的時間
* Speed : 車速
ML 的 Training Data 的 feature

![](https://i.imgur.com/uohvVQl.png)

>**資料篩選**
RouteName 為幾號公車 
top 回傳前幾筆資料 
為了確保回傳所有公車的資料，所以先填150。
後來知道總共有 14台 9018 往鹿港，之後會提到是如何知道

![](https://i.imgur.com/AkANp9t.png)

![](https://i.imgur.com/VehzCBf.png)

![](https://i.imgur.com/xbjK6bI.png)

>**What's in Request URL?**

其實就跟Response Body裡的長一模模沒兩樣

