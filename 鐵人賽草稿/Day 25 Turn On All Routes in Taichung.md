## Prototype
![](https://i.imgur.com/k5ELZMV.png)
---
## 開發過程 (站上一篇文 站下三天刻)
day 1 : **研究相關 search bar**
關鍵字 `Leaflet search bar` 
網路上的範例都是 
搜一個地點 下面會有類似的跑出來
可以選
就是沒有我想要的樣子 ...
但 有不是 embedded 在 map 的模式 
我先採用這個 (由簡單的概念開始，之後說不定就容易多)
輔助搜尋的字 為跟著字頭 
比如說 我先打了3
下面提示就會 跑出 301 302 303 304 305 .....
點選 下面提示 或是 click input 框 
替換掉 預設 9018 的 去回程目的地顯示 及 站序 及 時間
`先加入 搜尋框顯示` 
![](https://i.imgur.com/wjpHYkU.png)
### Code 
```html
<input type="text" class="search" id="myInput" onclick="updatemap(this.value)"  placeholder="Search for routes.." title="Type in a route" value=''> 
```
icon 從這個 [免費icon 網站](https://www.flaticon.com/)找的 ps: 用過的都說讚
```css
 #myInput {
  background-image: url('https://i.imgur.com/NA1Mcr9.png');
  background-position: 10px 10px;
  background-repeat: no-repeat;
  width: 50%;
  font-size: 16px;
  padding: 12px 20px 12px 40px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
}
```
---
day2 : 
Finish 搜尋全線公車的部分。
Ref : 
* [Day28 「使用網頁等公車」 ─ 就來做搜尋功能囉！](https://ithelp.ithome.com.tw/articles/10197402)
* [搜尋功能](https://github.com/Ryin0424/Taichunung-Bus/blob/master/js/app.js#L30)
---
day3 : 統整 
全線公車On起來 XD
花了三天的時間！！！
第一天 ： 研究搜尋框
第二天 ： 搜尋 提示 + 預測資訊API
第三天 ： 按鈕切換 和 修Bug 流程順起來
接下來 寫技術文章囉 ~~~ 累累der , but 希望今天可以把 Day 25 寫完 或是拆成兩天 Day 25 26 寫
邏輯 ： 按這個 什麼隱藏 什麼顯示 ....blabla 
API call 了 3個 動態位置 ，預測時間（9018），站序&預測時間（台中）
還好有**會員申請** 不然會爆

### pseudo code

1. 點選 Turn On ，進入模式2 (台中等公車)
隱藏 9018的內容 ，顯示模式2的搜尋框 
2. 點選搜尋框 輸入路線名稱 filter 同時 顯示接近的 路線(以輸入開頭接近的為優先)
當有相近的出現，會顯示；沒有則不顯示
3. 點選 輸入框 或是 下方的 提示就可進入 詳細資訊，以及 更新地圖
隱藏提示部分，顯示 路線資訊 (每10秒自動更新)
更新地圖 : 載入為雙向，10秒後預設為去程。
而點選 去/回程之後 顯示的內容以點選的方向為主 做自動更新 。 
4. 點選 turn off 回到 9018 公車
一開始載入 顯示 雙向公車位置 及 去程預測時間。
一旦手動點選方向，之後以點選方向為更新依據(內容)。

### [開放原始碼](https://github.com/goish135/IT_ironman/tree/master/Day25)

---
## Demo
`搜尋框提示` 依照字頭做搜尋
影片 ↓
[![Yes](https://img.youtube.com/vi/edjefEaXiFM/0.jpg)](https://www.youtube.com/watch?v=edjefEaXiFM)
`台中全線公車` 
原本已有的 Inter City Bus(台中<->彰化) 再加上 City(Taichung) Bus ，點選藍色Marker開啟側欄，再點選 Turn on，會切換到台中等公車的部分 側欄資訊 包含 去/回程 依照站序排的站牌名稱 ，等待時間 同時 依照輸入的路線編號或是點選的路線編號，更新地圖公車位置的顯示。
影片 ↓
[![Yes](https://img.youtube.com/vi/R0VFJaUS9yE/0.jpg)](https://www.youtube.com/watch?v=R0VFJaUS9yE)
### Ref 
* [Taichunung-Bus](https://github.com/Ryin0424/Taichunung-Bus)
