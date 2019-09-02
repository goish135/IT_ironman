**<<補充>>**
`同步控制按鈕`
[![Yes](https://img.youtube.com/vi/jYwohPqch3k/0.jpg)](https://www.youtube.com/watch?v=jYwohPqch3k)
原本的設定是由兩邊的控制，雖然兩邊的控制都能改變地圖中的顯示方向，但如果按地圖嵌的按鈕，側欄裡沒有跟著改變狀態，使用者可能以為故障了，但其實沒有，所以當我們按蜘蛛人或橘熊時，側爛的Radio Button也要同步更新。
```js
        // 當按下蜘蛛人按鈕時
        $('input:checked').prop('checked', false); // 移除原本勾選的狀態
        $('#go').prop('checked', true);            // 將GO的Radio Button勾選起來
```
```js
        // 當按下橘熊時
        $('input:checked').prop('checked', false); // 移除原本勾選的狀態
        $('#back').prop('checked', true);          // 將Back的Radio Button勾選起來
```
# 心路歷程
在做這個project一開始的時候，我是把web放在heroku上運行。
但heroku有dyno的限制([Dynos: the heart of the Heroku platform](https://www.heroku.com/dynos))，用一段時間就會App Error，因為額度用完。
後來想了一下這樣也不是辦法，要讓服務不間斷，所以我想到之前在學校上課時有一組的project是放Google Drive那的，**認真聽別人分享專題很重要** 總是會有收穫XD，所以就去網路上查了一下資料([Google Drive雲端硬碟變成HTML網頁空間](https://www.minwt.com/website/server/19192.html))，也把自己的專案放上Google Drive，試用結果:Google 實在太棒啦 m(_ _)m ，簡單又方便又**不受限**又**免費**。 

# GitHub 靜態網頁
GitHub 廣為人知的就是版本控管。還有很多的功能，像是放置自己的作品集，在ReadMe.md寫下專案的介紹，或是寫履歷，最近fb滑到朋友的高中朋友的profile，不看沒怎樣，一看嚇死人的奪人目光，就是用GitHub的Github Page寫的，網址中有出現 `github.io`，非常清楚明瞭做了些什麼，而且經歷也是很豐富，參加了好多次的黑客松，之後有空我也來練習寫寫看，感覺未來找工作會有很大的幫助。
接下來來說說大致的步驟關於Deploy靜態網頁於GitHub上。
其實可以不用用到指令就可以做到，hen 不錯~~~
Step 1 : 申請一個GitHub帳戶
Step2  : New repository
Step3  : 切到 Setting Tab ，開啟GitHub Page
成功的話會長下圖這樣
![](https://i.imgur.com/6EsXdNP.png)
Step4 : 把 html js css 都放上去吧
Step5 : 最後 在網址輸入 https://Github帳號.github.io/專案名稱/  (預設找到index.html)
如果不是這個名稱請確實輸入 https://Github帳號.github.io/專案名稱/你的命名.html
Ex: 
![](https://i.imgur.com/P2jalrC.png)
https://goish135.github.io/1010/first_1010.html
效果 : [影片↓]
[![Yes](https://img.youtube.com/vi/WWAjN8S7ibY/0.jpg)](https://www.youtube.com/watch?v=WWAjN8S7ibY)
# Heroku
>Heroku是一個支援多種程式語言的`雲平台即服務`。在2010年被Salesforce.com收購。Heroku作為最開始的雲平台之一，從2007年6月起開發，當時它僅支援Ruby，但後來增加了對Java、Node.js、Scala、Clojure、Python以及PHP和Perl的支援

放網頁 :
Step 1 : Prepare the app
```
文件備妥
$ git clone https://github.com/heroku/php-getting-started.git
切到抓下來的文件資料夾 php-getting-started
$ cd php-getting-started
```
Step 2 : Deploy the app
```
建一個 Heroku APP 
$ heroku create
如果要自己為APP命名可以
$ heroku create waitingBus9018
將資料夾的資料放上Heroku
$ git push heroku master
Ensure that at least one instance of the app is running
$ heroku ps:scale web=1
將APP打開
$ heroku open
```
在 php-getting-started 中會看到 web 子資料夾 ，打開 web，把project放入
![](https://i.imgur.com/I5iUDu6.png)
記得把index.html 改副檔名成`index.php`，因為Heroku 會辨認語言，在部屬網頁的部分，辨認php
![](https://i.imgur.com/2narySh.png)

### Heroku其他應用
大二時，軟工主題 Line Bot，開啟了我與Heroku的第一次邂逅。
→ [Slack 機器人 環境設定](https://goish135.github.io/Learning-note/) 
其實一開始把各個環境串起來沒有這麼容易，看網路上的教學文看了好幾篇，但可能因為版本更新的問題，照做了，還是會有問題，所以之後開始看`官方文件`或是`較新的教學文章`的說明。
上面的 `Slack 機器人 環境設定` 其實沒有達成我原先要做的，因為不是以 Line 為平台，Slack 好像在台灣較顯微人知。
到了大三時，應用課餘閒暇時，繼續研究要怎麼弄，結果一個晚上的時間，環境(Line<->Heroku)架起來囉!
![](https://i.imgur.com/GNfjrEM.png)
→ [line-bot-GotYou135](https://github.com/goish135/line-bot-GotYou135)
這次之後，我和Heroku已經滿麻吉啦，舉凡收集資料、定時送信(Decard熱門文章 CPE隨機練習題目)、還有放置網頁都交給他幫我處理。

# Google Drive
Step1 : [click me](https://drv.tw/) ，選擇欲授權的帳戶，允許授權
Step2 : 將Project的那份資料夾 傳到 Google Drive
Step3 : 將 Google Drive 的那份資料夾 ，按進階 and 公開在網際網路上
Step4 : 按照格式 `https://www-drv.com/~Gmail帳號/gd/Google Drive資料夾名稱` 輸入到網址列 
### 歡迎體驗 (版本由舊至新)
**說明**
Click 蜘蛛人 往鹿港
Click 橘熊   往台中
Click 藍色Marker 打開側欄
*  [v1.0](https://bus9018.herokuapp.com/)
*  [v1.1](https://vy94rp4j1bgvpp7prj7ezw-on.drv.tw/www/)
*  [v1.2](https://vy94rp4j1bgvpp7prj7ezw-on.drv.tw/bus/)
*  [v1.3](https://vy94rp4j1bgvpp7prj7ezw-on.drv.tw/AAA/)


## More Information
* [GitHub架設HTML靜態網站](https://www.minwt.com/website/server/18522.html)
* [定時寄送CPE題目](https://github.com/goish135/self-project)
* [定時爬取天氣紀錄至Google試算表](https://github.com/goish135/Data.Processing/tree/master/recordweather/recordweather)