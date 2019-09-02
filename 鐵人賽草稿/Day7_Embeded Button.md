## 需求碰出新滋味

老大說`按鈕嵌在地圖上` 感覺比較一目暸然(比起在側欄放 Radio Button)，使用上比較方便。
所以又去Google查關鍵字 `Leaflet Button`,有超多優秀的Demo。
小技巧分享，如果關鍵字的全部tab那找不到想要的效果，可以去圖片tab的搜尋結果找，或是一開始就直接看圖片，圖示時常會發現很多好玩的東東，或是激發創意。

## 操作
除了之前的側欄(可以之後放`預測到達時間`)，選擇保留，但，載入網頁後3秒自動跳出部分刪除，
有需要看到側欄的內容時，點選 Marker 打開側欄。
控制去程回程不同車子的顯示的控制項，有原本的 側欄裡頭的 Radio Button，還有地圖上嵌的兩個Button。
* click 蜘蛛人 : 往鹿港
* click 橘熊   : 往台中

## 程式碼

 ```javascript
 var customControl =  L.Control.extend({

  options: {
    position: 'topleft'
    // control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';     
    container.style.backgroundImage = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT95yXZFIju_XFA4ecqzwG8d7vAWNfl999A2o4k0W47zfvNnm2Q)";
    container.style.backgroundSize = "50px 50px";
    container.style.width = '50px';
    container.style.height = '50px';

    container.onclick = function(){
        $(function () {
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
        });
        chosen = 0 ;
    }
    return container;
  }
});
mymap.addControl(new customControl());

var customControl2 =  L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';     
    container.style.backgroundImage = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHNloKSe3JGtdvBRCZiRpZezNE72PpJ5sozYrje78sZhFPYsn-fg)";
    container.style.backgroundSize = "50px 50px";
    container.style.width = '50px';
    container.style.height = '50px';

    container.onclick = function(){  
      console.log('buttonClicked2');
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

    return container;
  }
});
mymap.addControl(new customControl2());
 ```
## Demo
[![Yes](https://img.youtube.com/vi/3j68xnmoPu0/0.jpg)](https://www.youtube.com/watch?v=3j68xnmoPu0)
## 大家來找碴 (What's Different?)
![](https://i.imgur.com/EwIHXvy.jpg)
`How to do it ?`
請待下回揭曉!
## Follow Me
* [30天鐵人鍊成紀錄](https://github.com/goish135/IT_ironman/tree/master/Day7)
### Ref :
* [control-button-leaflet](http://www.coffeegnome.net/control-button-leaflet/)

