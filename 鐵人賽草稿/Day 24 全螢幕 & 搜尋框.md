上一回為 `動態模型訓練` ，每天都會進行資料的收集、處理及訓練模型，並記錄 weights & bias &  R^2^ 於 daily_log.csv 裡 。
而 **測試**這個cycle需要點時間，切到前端，把服務範圍擴大或是提升使用者體驗，到了 Day 27 來驗收，如果結果如預期
**當資料越多，準確率提升**，就來打造專屬API，如果還有需要改善的部分，就再想想還有沒有更優的辦法(搬資料)，但還是會search有關於打造API的相關知識，讓實力Up Up。

## Code
引入
```js
    <link rel="stylesheet" href="Control.FullScreen.css" />
	<script src="Control.FullScreen.js"></script>
```
加入 fullscreen 控制項
當 箭頭移到 fullscreen control 上 會顯示提示訊息 Show me the fullscreen !
click fullscreen control 的按鈕 ，進入全螢幕後，再按一次 或是 ESC 即可回原本的。
還沒按之前 箭頭在上 提示訊息 Exit fullscreen mode。
```js
     mymap = new L.map('mapid', {
       center: new L.LatLng(24.144534,120.672542),
	   zoom: 13,  
       fullscreenControl: true,
			fullscreenControlOptions: { // optional
				title:"Show me the fullscreen !",
				titleCancel:"Exit fullscreen mode"
			}
    });
```
detect 進入 全螢幕時，在console 那，會輸出 enterFullscreen。
離開 全螢幕時，在console 那，會輸出 exitFullscreen。
```js
		// detect fullscreen toggling
		mymap.on('enterFullscreen', function(){
			if(window.console) window.console.log('enterFullscreen');
            
		});
		mymap.on('exitFullscreen', function(){
			if(window.console) window.console.log('exitFullscreen');
            
		});
```
## Demo
![](https://i.imgur.com/UJf7KXr.png)
![](https://i.imgur.com/GnhaoEx.png)
![](https://i.imgur.com/b6t6Jod.png)
![](https://i.imgur.com/SjR5sHj.png)
## Notice
之前把 放大縮小鍵(+/-)移除，這次將plugin 提到的 code 寫完 ，結果 有偵測到 進入全螢幕 但其實沒有全螢幕效果。
後來猜測 是 zoom control (放大縮小鍵(+/-)) 拿掉的問題 ，因此加回來 ，就OK啦 ，夠神奇 !
Peter Parker 有 Peter Tinagle ![](https://i.ytimg.com/vi/s80qIgXD6ow/maxresdefault.jpg)
`阿瑜 有 阿瑜 Tingle XD` 
## Ref
Plugin : [leaflet.fullscreen](https://github.com/brunob/leaflet.fullscreen)