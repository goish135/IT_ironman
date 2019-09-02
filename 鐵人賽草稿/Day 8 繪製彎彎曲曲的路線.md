**<< 補充 >>**
1. `移除放大縮小鍵`(預設地圖都有)
![](https://i.imgur.com/wytf5YN.png)
```js
mymap.removeControl(mymap.zoomControl);
```
2. Custom Icon 定錨位置
弄懂定錨(iconAnchor的重要性) ↓
![](https://i.imgur.com/mqlh25h.jpg)

```js
    var LeafIcon = L.Icon.extend({
		options: {
			iconSize:     [24, 24],
			iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location ?
			popupAnchor:  [0, -12]  // point from which the popup should open relative to the iconAnchor
		}
	});
```
其實[官網](https://leafletjs.com/examples/custom-icons/)的解釋，我有點不太懂。
那就東調調(iconAnchor的數值)西調調(大小取小:上圖)，看調出來的感覺哪個比較不誇張...
上圖原本車頭向左的黑色車子，可能會有倒退嚕(往右開)的情況，所以換成黃色車頭正面圖 XD，就不會有這怪怪的現象。
但還是要追根究底一下，總不能之後遇到相同的狀況，還是東調西調，有點兒浪費時間~~~
在[StackOverflow](https://stackoverflow.com/questions/46101450/explanation-of-leaflet-custom-icon-latlng-vs-xy-coordinates)我得到很好的解答。
> ![](https://i.imgur.com/qReqSHD.png) 截圖自:[Explanation of Leaflet Custom Icon LatLng vs XY Coordinates](https://stackoverflow.com/questions/46101450/explanation-of-leaflet-custom-icon-latlng-vs-xy-coordinates)

---

## 切回正題
`沒有比較沒有進步` 
* 圖1 : 台中公車通 截圖
![](https://i.imgur.com/6ZXzNkJ.jpg)
* 圖2 : 本Web (MLX友廷等公車)
![](https://i.imgur.com/H1qQccN.jpg)
* 圖3 : 改良版 (MLX友廷等公車)
![](https://i.imgur.com/v2oa0v7.jpg)

台中公車通(現有手機APP)，是如何畫線的，我猜應該就是拿API提供的站牌經緯度資料做連線。
推測原因 ，看圖2 vs 圖3 ，路線形狀根本一樣，而我圖2就是拿API提供的站牌經緯度資料做連線(回到Day6)。

**那如何改良呢?** Ans : `使用動態資訊`
Sol :
Google Maps 查了一下 台中火車站到鹿港 大概需要幾分鐘，60分鐘。
寫 Code 收集 每隔一段時間(1分鐘)的 位置資料，放入資料庫裡。
60 個點 能完成 彎曲路線的繪製。

## 凡開過必留下痕跡
假設我們已有那些點(大概60點)，之後會分享如何得出的實作步驟。
```js
<script type="text/javascript" src="latlon.json"></script>
```
``` js
// 61個點 // latlon.json
data = '[[緯度1,經度1],[緯度2,經度2],[]...]';
```
設計原理:
將 latlon.json 的 座標點取出，如果距離超過10公里不連線。因為可能是連回出發點位置(如圖↓)。
![](https://i.imgur.com/DGULUYj.jpg)
不加入離太遠的那一點，把現有的線段畫出。
如果經緯度都沒有超過10km的點，加入list，最後顯示。


```js
  var mydata = JSON.parse(data);
   
    console.log(mydata)
    var temp = [];
    for(var i=0;i<mydata.length;i++)
    {
        if(i==0) temp.push(mydata[i]);
        else
        {
            if(GetDistance(mydata[i][0],mydata[i][1],mydata[i-1][0],mydata[i-1][1])>10)
            {
                var polyline = L.polyline(temp, {color: 'red'}).addTo(mymap);
                mymap.fitBounds(polyline.getBounds());
                temp = [];
            }
            else
            {
                temp.push(mydata[i]);
            }
            
        }
    }
    var polyline = L.polyline(temp, {color: 'red'}).addTo(mymap);
    mymap.fitBounds(polyline.getBounds());
    function GetDistance( lat1,  lng1,  lat2,  lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
    }
```
## 其他 Demo
![](https://i.imgur.com/XIgh9Y5.jpg)
## 即將登場 : Firebase ，Heroku，GCP
## Follow Me
[30天鐵人鍊成紀錄](https://github.com/goish135/IT_ironman/tree/master/Day7%26Day8)
### More Information
* [在Javascript中，如何读取外部的本地JSON文件？](https://vimsky.com/article/3575.html)


