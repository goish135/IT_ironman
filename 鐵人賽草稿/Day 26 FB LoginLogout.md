## 前言 
想做個 `加入我的最愛路線` ，首先需要辨別身份(唯一key,id)，對照資料庫有無紀錄(是否為會員/有無最愛清單...)，
這時候，就需要登入來幫忙，而登入登出除了自己刻 也可以藉助第三方的方式，幾乎人人都有 fb ，如果一鍵登入fb，及 web app，不用再另外註冊，
對使用者而言，很方便 ; 對開發者而言，也省去不少功夫。

## 步驟
FB 登入登出 
目前找網路上的資源 
實作出 官方小按鈕的登入登出
並可以取得 使用者的 名稱/email/id 
**Step 1 : FB Developer 註冊**
click this one [facebook for developers](https://developers.facebook.com/apps?locale=zh_TW)
先要有臉書帳號，登入後，網頁Redirect到 facebook for developers。
![](https://i.imgur.com/H39DzBt.png)
Step 2 : 新增 FB 應用程式 
需要做一些設定 ，主要的兩個
* `隱私網址設定` 可用線上提供網址的服務 [privacypolicies](https://www.privacypolicies.com/) 
* 應用程式“網域” 位址 需要 `https` : 很重要
可以掛在 GitHub 上  ps : 先啟動 GitHub Pages
ex : [fb_login.html](https://goish135.github.io/web/fb_login.html)
![](https://i.imgur.com/aZKeKuk.png)
Step 3 : 取得使用者 name,email,id 顯示於前端網頁
![](https://i.imgur.com/wQKww5h.jpg)
![](https://i.imgur.com/41LAMHG.jpg)
後端：id 可用於 使用者辨認 > 我的最愛清單 
## Code
三種狀態 : 
1. 未登入 fb
2. 已登 但 未加入 應用程式 會員
3. 已登 且 加入 應用程式 會員
```js
<fb:login-button scope="public_profile,email" autologoutlink="true" onlogin="checkLoginState();"></fb:login-button>

目前狀態：<span id="FB_STATUS_1"></span>

<script>
window.fbAsyncInit = function() {
FB.init({
appId: '', // 填入 FB APP ID
cookie: true,
xfbml: true,
version: 'v3.2'
});
FB.getLoginStatus(function(response) {
statusChangeCallback(response);
});
};
// 處理各種登入身份
function statusChangeCallback(response) {
console.log(response);
var target = document.getElementById("FB_STATUS_1"),
html = "";
// 登入 FB 且已加入會員
if (response.status === 'connected') {
html = "已登入 FB，並加入 友廷等公車應用程式<br/>";
FB.api('/me?fields=id,name,email', function(response) {
console.log(response);
html += "會員暱稱：" + response.name + "<br/>";
html += "會員 email：" + response.email+ "<br/>";
html += "會員 uid :" + response.id;
target.innerHTML = html;
});
}
// 登入 FB, 未偵測到加入會員
else if (response.status === "not_authorized") {
target.innerHTML = "已登入 FB，但未加入 友廷等公車應用程式 應用程式";
}
// 未登入 FB
else {
target.innerHTML = "未登入 FB";
}
}
function checkLoginState() {
FB.getLoginStatus(function(response) {
statusChangeCallback(response);
});
}
// 載入 FB SDK
(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s);
js.id = id;
js.src = "https://connect.facebook.net/zh_TW/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
</script>
```
Ref :
* [apply-facebook-app-id](https://www.wfublog.com/2016/11/apply-facebook-app-id.html)
* [fb-api-log-in-out-button-example](https://www.wfublog.com/2018/12/fb-api-log-in-out-button-example.html)