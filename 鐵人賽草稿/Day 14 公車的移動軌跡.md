## Code
item : API 回傳的經緯度
設定 icon 的圖片，大小需事先調好，程式碼沒辦法調整圖片大小。
並將 經緯度 包成 參數的傳入格式 latlng。
```js
        var offSiteX = -0.00001532;
        var offSiteY =  0.00005708;

        for (var i = 0; i < items.length; i++){
            var img = new Image();
            img.src = './images/arrow3.pn g';
            var lat = Number(items[i].BusPosition.PositionLat) + offSiteY;
            var lon = Number(items[i].BusPosition.PositionLon) - offSiteX;
            var latlng = {lat: lat, lon: lon};
            var options = {
                img: img
            };
            var angleMarker = L.angleMarker(latlng, options); 
```
將上次API回傳的經緯度和這次API回傳的經緯度運算出角度，依照角度旋轉icon，並加入地圖。
```js
        var angle = 0;
        for (var j=0;j<pre.length;j++)
        {
            if(pre[j]["key"]==items[i].PlateNumb)
            {
                var previousLatLng = {lat: pre[j].lat, lon:  pre[j].lon};
                var nextLanLng = {lat:items[i].BusPosition.PositionLat, lon:  items[i].BusPosition.PositionLon};
                angle = angleMarker.getAngle(previousLatLng, nextLanLng);
                angleMarker.setHeading(angle);
                if (angle!=0)  // 如果這次的經緯度和上次經緯度 有方向上的變化，則加入地圖
                {
                    mymap.addLayer(angleMarker);
                }
                delete pre[j]["key"]  // 清除上次經緯度紀錄
            }
        }
        pre.push({"key":items[i].PlateNumb,"lat":items[i].BusPosition.PositionLat,"lon":items[i].BusPosition.PositionLon}); // 加入這次經緯度紀錄
```
## Demo 
[![Yes](https://img.youtube.com/vi/csY63HqUPLs/0.jpg)](https://www.youtube.com/watch?v=csY63HqUPLs)
[![Yes](https://img.youtube.com/vi/a68jZ3fS77A/0.jpg)](https://www.youtube.com/watch?v=a68jZ3fS77A)
[![Yes](https://img.youtube.com/vi/-S_Dcq3NL9M/0.jpg)](https://www.youtube.com/watch?v=-S_Dcq3NL9M)

### Ref
* [leaflet-marker-direction](https://jackzoushao.github.io/leaflet-marker-direction/)