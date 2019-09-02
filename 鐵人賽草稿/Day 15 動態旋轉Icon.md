
## Code
承接上一篇(Day 14)，多加一個動作: 將上一次 API 回傳的經緯度，紀錄下來，新資料來的時候，先清除掉舊的經緯度資料，再用新資料做更新。
```js
function showBusWay2(items) {
        for(var i=0;i<markers.length;i++)
        {
            mymap.removeLayer(markers[i]);  // 移除舊圖標
        }
        for(var i=0;i<markers2.length;i++)
        {
            mymap.removeLayer(markers2[i]);
        }
        var offSiteX = -0.00001532;
        var offSiteY =  0.00005708;

        for (var i = 0; i < items.length; i++){

            var img = new Image();
            if(items[i].Direction=='0')
            {
               img.src = './images/0.png';
               var lat = Number(items[i].BusPosition.PositionLat) + offSiteY;
               var lon = Number(items[i].BusPosition.PositionLon) - offSiteX;
               var latlng = {lat: lat, lon: lon};
               var options =
               {
                 img: img
               };
               var angleMarker = L.angleMarker(latlng, options);
               var angle = 0;
               if(pre.length==0)
               {
                 mymap.addLayer(angleMarker);
                 markers2.push(angleMarker);
               }
               var flag = 1;
               for (var j=0;j<pre.length;j++)
               {
                 if(pre[j]["key"]==items[i].PlateNumb)
                 {
                    flag = 0;
                    var previousLatLng = {lat: pre[j].lat, lon:  pre[j].lon};
                    var nextLanLng = {lat:items[i].BusPosition.PositionLat, lon:  items[i].BusPosition.PositionLon};
                    angle = angleMarker.getAngle(previousLatLng, nextLanLng);
                    angleMarker.setHeading(angle);
                    if (angle!=0)
                    {
                        mymap.addLayer(angleMarker);
                        markers2.push(angleMarker);
                    }
                    else
                    {
                            angleMarker.setHeading(pre[j]["angle"]);
                            mymap.addLayer(angleMarker);
                            markers2.push(angleMarker);
                    }
                    console.log(pre[j])
                    pre.splice(j,1);
                    break;
                }
            }

            if(flag==1)
            {
                mymap.addLayer(angleMarker);
                markers2.push(angleMarker);
            }
            pre.push({"key":items[i].PlateNumb,"lat":items[i].BusPosition.PositionLat,"lon":items[i].BusPosition.PositionLon,"angle":angle});

        }
        else
        {
            img.src = './images/1.png';

            var lat = Number(items[i].BusPosition.PositionLat) + offSiteY;
            var lon = Number(items[i].BusPosition.PositionLon) - offSiteX;
            var latlng = {lat: lat, lon: lon};

            var options =
            {
                img: img
            };
            var angleMarker = L.angleMarker(latlng, options);
            var angle = 0;
            if(pre2.length==0)
            {
                mymap.addLayer(angleMarker);
                markers2.push(angleMarker);
            }
            var flag = 1;
            for (var j=0;j<pre2.length;j++)
            {
                if(pre2[j]["key"]==items[i].PlateNumb)
                {
                    flag = 0;
                    var previousLatLng = {lat: pre2[j].lat, lon:  pre2[j].lon};
                    var nextLanLng = {lat:items[i].BusPosition.PositionLat, lon:  items[i].BusPosition.PositionLon};
                    console.log(previousLatLng)
                    console.log(nextLanLng)
                    angle = angleMarker.getAngle(previousLatLng, nextLanLng);
                    console.log("yes");
                    console.log('angle',angle)
                    angleMarker.setHeading(angle);
                    if (angle!=0)
                    {
                        mymap.addLayer(angleMarker);
                        markers2.push(angleMarker);
                    }
                    else
                    {
                            angleMarker.setHeading(pre2[j]["angle"]);
                            mymap.addLayer(angleMarker);
                            markers2.push(angleMarker);
                    }

                    console.log(pre2[j])
                    pre2.splice(j,1);
                    break;
                }
            }

            if(flag==1)
            {
                mymap.addLayer(angleMarker);
                markers2.push(angleMarker);
            }
            pre2.push({"key":items[i].PlateNumb,"lat":items[i].BusPosition.PositionLat,"lon":items[i].BusPosition.PositionLon,"angle":angle});
        }
    }
}
```
## Demo
[![Yes](https://img.youtube.com/vi/tOG5S4r1BuE/0.jpg)](https://www.youtube.com/watch?v=tOG5S4r1BuE)



