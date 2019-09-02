現在有了基本盤(Day5)，讓我們再加些東西上去吧。

`前情提要`
![](https://i.imgur.com/tPjMVqy.jpg)
# 路線圖
Data Source:
* [取得指定[路線名稱]的公路客運路線與站牌資料](https://ptx.transportdata.tw/MOTC?t=Bus&v=2#!/InterCityBus/InterCityBusApi_StopOfRoute_1)
* [站牌](https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/InterCity/9018?$top=30&$format=JSON)

Data:
![](https://i.imgur.com/g36l9fL.png)
`去程(往鹿港) `
台中 > 干城 > 朝馬 > 鹿港
`回程(往台中)`
鹿港 > 朝馬 > 台中

 **程式碼** 
 ```javascript
      // create a red polyline from an array of LatLng points
     var latlngs =
     [
        [24.135992, 120.686298],
        [24.142145, 120.685771],
        [24.170675, 120.637357],
        [24.05624,  120.43451]

     ];
    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
    // zoom the map to the polyline
    mymap.fitBounds(polyline.getBounds());
 ```
 ---
 
# 側欄(sidebar)
為何想到要加個側欄進Map裡頭呢?因為想有`Button`可以`控制`去回程的切換。
分享個最初的版本↓
[![Yes](https://img.youtube.com/vi/hpDAkun-tpY/0.jpg)](https://www.youtube.com/watch?v=hpDAkun-tpY)
但這樣看起來有點太low，在網路上有找到sidebar的 `leaflet plugin`，把它套用在地圖上。
**程式碼**
```javascript
<link rel="stylesheet" href="L.Control.Sidebar.css" />
<script src="L.Control.Sidebar.js"></script>
```
```javascript
    var sidebar = L.control.sidebar('sidebar', {
      position: 'left'
     });

    mymap.addControl(sidebar);    // 3 秒後 左側欄會自動跑出來
        setTimeout(function () {
        sidebar.show();
    }, 3000);

    var marker = L.marker([24.144596, 120.672539]).addTo(mymap).on('click', function () { // 點選Marker可以開關sidebar
      sidebar.toggle();
    });
```
載入時未選擇方向，去回程都有顯示。
點選側欄中的 GO Radio Button (去鹿港)，Back (回台中)，Close 關閉側欄。
設計原理 :
設一個變數為 chosem ，初始化為 -1。當點選 GO 會設為 0，之後每隔10秒都是去程的車子，當點選 Back 會設為 1，
之後每隔10秒都是回程的車子。
```javascript
function val(value)
{
    
     if(value==0)
     {
        console.log("Test 1");
       
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))
                
                showBusWay2(Data);
                console.log(chosen);
            }
            }); 
        });
        chosen = 0 ;
     }
     else if(value==1)
     {
         
         
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'1'&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
               
                
                showBusWay2(Data);
                console.log(chosen);
            }
            }); 
        });
        chosen = 1;
     }

}
console.log(chosen);
```
```javascript
setInterval(function () {
   
    $(function () {
    if(chosen==0)
    {        
        $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
 
                
                showBusWay2(Data);
                console.log(chosen);
            }
        });
    }
    else if(chosen==1)
    {
        $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'1'&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))
                
                showBusWay2(Data);
                console.log(chosen);
            }
        });        
    }
    else
    {
        $(function () {
        $.ajax({
        type: 'GET',
        url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$top=150&$format=JSON', 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            //$('body').text(JSON.stringify(Data));
            //console.log(JSON.stringify(Data))
            
            //$data.val(Data);
            //console.log($data); 
            showBusWay2(Data);            
        }
    });
});
    }        
    
});
},10000);
```
**Demo**
[![Yes](https://img.youtube.com/vi/5zqsDK6B1Tw/0.jpg)](https://www.youtube.com/watch?v=5zqsDK6B1Tw)
## Follow Me
* [30天鐵人鍊成紀錄](https://github.com/goish135/IT_ironman/tree/master/Day6)
## Ref
* [leaflet-sidebar](https://github.com/Turbo87/leaflet-sidebar)
