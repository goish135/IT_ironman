# Powerful Library : Leaflet

`Leaflet` : an open-source Javascript library

說明 : `拉圖層` 放進 Map 裡頭呈現，會牽扯到 `Data Source`、 `Tile Provider`，而就整合性(支援性)，我想 leaflet 做的很好。

Data Source : OpenStreetMap
Tile Provider : 
* [mapbox](https://www.mapbox.com/) 
* [stamen](https://stamen.com/)
* [thunderforest](https://www.thunderforest.com/)

## 圖層切換
在 mapbox、stamen、thunderforest 當中我最喜歡 stamen ，我覺得很酷炫。
所以決定以 `stamen` 做為我的例子。

在開始解釋程式碼之前，先來談談為什要切換圖層吧! 除了很Cool之外，__還有什麼適用場景呢__?
Ans : 早上可能需要比較亮的地圖，而夜間就需要比較深色的地圖，不僅對眼睛比較好，整體視覺體驗也Up Up。
### 程式碼 : 可切換三種圖層，並選擇 加Marker or 不加 Marker
```javascript
<script>
	var cities = L.layerGroup();  // citis 可以裝 Markers 
	L.marker([22.627560 , 120.267411]).bindPopup('中山電資大樓').addTo(cities), // 加入第一個
	L.marker([22.689343 ,120.309121]).bindPopup('左營').addTo(cities), // 加入第二個 
	L.marker([24.112074,120.615684]).bindPopup('新烏日').addTo(cities), // 加入第三個
	L.marker([24.263936,120.569167]).bindPopup(' 清水火車站').addTo(cities); // 加入第四個
	// 想加幾個 就有幾個 ↑ // 
	
    var toner = new L.StamenTileLayer("toner", { detectRetina: true }) // 建立第一種圖層
    var terrain = new L.StamenTileLayer("terrain", { detectRetina: true }) //  建立第二種圖層
    var watercolor = new L.StamenTileLayer("watercolor", { detectRetina: true }) //  建立第三種圖層
                        
	var map = L.map('map', {
		center: [22.627560 , 120.267411],  // 設定中心點
		zoom: 10,                          // 設定放大倍率 
		layers: [toner, cities]            // 預設圖層為 toner，網頁載入後 可看到 toner 圖層和前面加的4個地點 
	});
 
    var baseLayers = {             // "名稱": 先前建立好的圖層(值) 
        "toner": toner,
        "terrain": terrain,
        "watercolor":watercolor
    };

	var overlays = {           // "名稱" : 先前建立好的marker(值)
		"Cities": cities       
	};

	L.control.layers(baseLayers, overlays).addTo(map);  // 放入右上控制項裡
</script>
```
## Demo (影片)
[![Yes](https://img.youtube.com/vi/p7qhcdmzbIA/0.jpg)](https://www.youtube.com/watch?v=p7qhcdmzbIA)
## More Information
* [Leaflet Quick Start Guide](https://leafletjs.com/examples/quick-start/)
* [stamen & leaflet](http://maps.stamen.com/#terrain/12/37.7706/-122.3782)
* [layers-control](https://leafletjs.com/examples/layers-control/)
