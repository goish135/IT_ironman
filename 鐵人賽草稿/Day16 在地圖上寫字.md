## 今日任務
在站點的位置上字，標明是公車停哪一站。
## 程式碼
設定字的外觀
```css
   <style>
   .labelClass{
      white-space:nowrap;
      text-shadow: 0 0 0.1em black, 0 0 0.1em black,0 0 0.1em black,0 0 0.1em black,0 0 0.1em;
      color: yellow
}
```
將字依照站牌所在的位置加進地圖
```js
L.divIcon({ 
  className: "labelClass",
  html: "textToDisplay"
})
var createLabelIcon = function(labelClass,labelText){
    return L.divIcon({ 
       className: labelClass,
       html: labelText
    })
}        
L.marker(new L.LatLng(24.135992, 120.686298), {icon:createLabelIcon("labelClass","臺中火車站(東站)")}).addTo(mymap);
    L.marker(new L.LatLng(24.142145, 120.685771), {icon:createLabelIcon("labelClass","干城站")}).addTo(mymap);
    L.marker(new L.LatLng(24.170675, 120.637357), {icon:createLabelIcon("labelClass","朝馬站")}).addTo(mymap);
    L.marker(new L.LatLng(24.05624, 120.43451), {icon:createLabelIcon("labelClass","鹿港站")}).addTo(mymap);
```

## Demo
台中車站 、 干城站 、 朝馬站 、 鹿港站
![](https://i.imgur.com/EETadFi.png)

## Ref
* [labels-in-leaflet](http://www.coffeegnome.net/labels-in-leaflet/)
* [Leaflet.label](https://github.com/Leaflet/Leaflet.label)