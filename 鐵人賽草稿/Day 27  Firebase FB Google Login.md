## 心路歷程
[官方文件](https://firebase.google.com/docs/auth/web/facebook-login?fbclid=IwAR2ySPjSfkPkzF89rbGRQFdkTCpGYYb8GNwuyNpM3uMhhAdLjOFtBi9VfD8)看得很頭痛，還好有影片輔助，但這是兩者皆要，才能達成。 
而[影片](https://www.youtube.com/watch?v=D9kD9ynsBtY&feature=share&fbclid=IwAR0ksfksBBPNFjQj46aEgna678EkL-sIlWl7Wx0yX69FKDBO2PAEXGpCllU)看完後 覺得滿easy的，其實是他教得很有條理、淺顯易懂，
跟著做 結果 卡在 `Cannot read property 'FacebookAuthProvider' of undefined`
想說都造做了 怎麼會 ! ! ! 晴天霹靂 ! ! !
開始找可能原因 
設定沒問題(fb developer&firebase)， config 有回傳，
![](https://i.imgur.com/msvjaI4.png)
剩Script 沒 include 到~~~ 但其實 不知道哪個沒include到。
後來老大救援 ，找到一個 [Stackoverflow](https://stackoverflow.com/questions/55329495/firebase-auth-is-not-a-function-with-multiple-firebase-app-initialization?fbclid=IwAR3TqjwaEEwimrvGDZM7phYfqkcOBQeU5Djb_Xr6FYU5xkQ0zExacH5j0Gg) 的資源 ，補了一個 js script。 就 O K 啦 XDDD
![](https://i.imgur.com/JPBHX6B.png)
如果沒有老大的救援，我可能宣告陣亡 置之不理 QQ 

## 步驟 
Step 0 : 申請 [facebook developer](https://developers.facebook.com/) + [firebase](https://firebase.google.com/)
Step 1 : 連接 fb & firebase 
* 創一個 FB Application ，取得 App id ， App key 且 複製
![](https://i.imgur.com/eqF9d6M.png)
* 創一個 Firebase Application ，取得 OAuth 
click Authentication ， 切到 登入方式 ，click fb 的編輯 ，啟用及 把 fb developer 的 id 及 key 貼上，再把 
OAuth 那一欄 複製起來 
![](https://i.imgur.com/NrlwGWc.png)
* 將 OAuth 複製的 ，貼到 fb developer 
![](https://i.imgur.com/I4iS5e2.png)
Step 2 : 準備 一份 html (body) ，複製 Firebase SDK snippet 的內容  貼進 那一份 html (body)裡
點選 Project Overview 旁邊的 齒輪 > 一般設定 ，往下滑 切到 CDN　就可以看到囉 
![](https://i.imgur.com/xYtKJZg.png)
Step 3 : 切換到 Authenticate Using Facebook Login with JavaScript 官方文件 
複製兩個部分 
> * Create an instance of the Facebook provider object
![](https://i.imgur.com/bu03bTU.png)
> * Authenticate with Firebase using the Facebook provider object. You can prompt your users to sign in with their Facebook accounts either by opening a pop-up window or by redirecting to the sign-in page. The redirect method is preferred on mobile devices.
![](https://i.imgur.com/rnmAJ8Z.png)

貼到 html (body) 的 Firebase SDK snippet 的下方 
Step 4 : 官方文件 沒有特別提到(~~或是我沒注意到~~) 要 include 進來的 script ，放 firebaseConfig 前面 
```js
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-auth.js"></script>
```
---
## Code 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Tyy it</title>
</head>
<body>
    <!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.9.1/firebase-auth.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "",
    authDomain: "fb-login-df75e.firebaseapp.com",
    databaseURL: "https://fb-login-df75e.firebaseio.com",
    projectId: "fb-login-df75e",
    storageBucket: "",
    messagingSenderId: "981102618300",
    appId: "1:981102618300:web:685947c929db7343"
  };
  // Initialize Firebase
  var a = firebase.initializeApp(firebaseConfig);
  console.log(a)
</script>
    <script>
       var provider = new firebase.auth.FacebookAuthProvider()
 firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
    </script>
</body>

</html>
```
## 其他 
1. `不`封鎖 彈出視窗 ，程式碼的部分是用 Popup 的方式彈出 fb 的登入視窗 ，一旦封鎖了，等於看不到效果。
[瀏覽器設定](https://support.google.com/chrome/answer/95472?co=GENIE.Platform%3DDesktop&hl=zh-Hant) : 設定 > 進階 > 網站設定 > 允許彈出視窗 
2. 需有 網頁伺服器 ex: XAMPP 
用localhost的方式開 
![](https://i.imgur.com/Y66GXBr.jpg)
## Demo 
![](https://i.imgur.com/ImT5MX1.png)
![](https://i.imgur.com/AhDdHun.jpg)
## 補充 
如果 以Google 帳號的方式登入 ，只需要在firebase 啟用 Google，然後 Code 的 instance 改成下面這行，即可使用Google 第三方登入。
```js
 var provider = new firebase.auth.GoogleAuthProvider()
```
![](https://i.imgur.com/bxubna7.jpg)
