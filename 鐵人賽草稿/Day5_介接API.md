# 重頭戲來囉

在 Day2 的 Bus API(link) 介紹 、Day 3 的 圖層變變變(link)、以及Day 4 的 Marker 動起來(link)後，躍躍欲試地想把學到的東西做統整，除了先前的知識，還會帶入`邏輯`(演算法or解法)。

## 階段目標 : `每10秒 call 一次 API，將取得的資料呈現於地圖上`
## 流程
一開始**載入網頁**時 call 一次 API
成功，將取得的經緯度，車牌，加入地圖。
之後的 `每10秒更新`，**setInterval()** 設定每10秒call一次API，API回傳成功後再更新地圖。
而更新地圖細部的動作 包括 移除之前的Markers(因此需要把前10秒的做儲存)，再加入新的Markers進去。
## 程式碼
## Demo
## 遇到問題
API Quota 不夠
![](https://i.imgur.com/de2fhpP.png)
## 解決方法
1. API 是限制**IP發出的request數量**
以手機為無線基地台，分享給電腦or其他手機，只要其中一個先把request數量用完，所有人都沒辦法再request。
會看到地圖沒有公車在行駛
![](https://i.imgur.com/Iiiy0AY.png)
所以可以換個IP(ex:借用別人的網路)來做使用。But! **人力成本太高**，如果是邊緣人就G惹。
2. 手動更新
設定 更新 Button，使用者想更新地圖再更新，讓request次數下降。但如果使用者太調皮，狂按猛按，request次數也是會爆掉。**不保險且太累啦**
3. 申請會員(**正解**) 
使用到現在，從來沒有超過request數而不能使用。**Very Good**
![](https://i.imgur.com/1Q3Uopq.png)
`一般會員` =>一天兩萬次 => 我申請這個的，其實就滿夠用啦。
進階會員 :十萬~~伏特~~次 / 一天

