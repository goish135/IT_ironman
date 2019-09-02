## Code
定義 addArrows 的 function 
依照 兩個經緯度相差的角度 旋轉icon 並 定義 箭頭的樣式 
```js
    var arrowPolyline = L.Polyline.extend({
        addArrows: function(){
		    var points = this.getLatLngs()
            for (var p = 0; p +1 < points.length; p++){
                var diffLat = points[p+1]["lat"] - points[p]["lat"]
                var diffLng = points[p+1]["lng"] - points[p]["lng"]
                var center = [points[p]["lat"] + diffLat/2,points[p]["lng"] + diffLng/2]
                var angle = 360 - (Math.atan2(diffLat, diffLng)*57.295779513082)
                var arrowM = new L.marker(center,{
                   icon: new L.divIcon({ 
                        className : "arrowIcon",
                        iconSize: new L.Point(30,30), 
                        iconAnchor: new L.Point(15,15), 
                        html : "<div style = 'font-size: 20px; -webkit-transform: rotate("+ angle +"deg)'>➨</div>"
                   })
                }).addTo(mymap);
           }
            
        }
    })
```
在原本的路線中 加入箭頭s
```js
    var polyline = new arrowPolyline(temp, {color: 'red'}).addTo(mymap);
    polyline.addArrows()
```
## Demo 
![](https://i.imgur.com/Pj3ybL4.png)
![](https://i.imgur.com/Fat923q.png)

### Ref 
* [arrows-in-leaflet](http://www.coffeegnome.net/arrows-in-leaflet/)