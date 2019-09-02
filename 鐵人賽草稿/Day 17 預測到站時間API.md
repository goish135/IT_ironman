## 今日任務
Call 預測到站時間 API ，並把回傳資訊寫入側欄裡。
## Code
設定前端位置以及樣式
```html
     <div id="sidebar">
       <h1>AAA</h1>
       <input type="radio" id="go" name="gr" value="0" onclick="val(0)" checked="true"><font size="3">往鹿港</font>
       <input type="radio" id="back" name="gr" value="1" onclick="val(1)"><font size="3">往台中</font>
       <button type="button" onclick="sidebar.hide();">Close Sidebar</button>
       <hr>
       <p id="s1"><span id="stop1" style="color:white;border-radius:3px;background-color:red;margin-right:5px;font-weight:bold;"><font size="3">X</font></span></span><font size="3">台中火車站(東站)</font><span id='pn1'style="margin-left:6px"></span></p>
       <p id="s2"><span id="stop2" style="color:white;border-radius:3px;background-color:orange;margin-right:5px;font-weight:bold;"><font size="3">X</font></span><font size="3">干城站</font><span id='pn2'style="margin-left:6px"></span></p>
       <p id="s3"><span id="stop3" style="color:white;border-radius:3px;background-color:#EEEE00;margin-right:5px;font-weight:bold;"><font size="3">X</font></span><font size="3">朝馬站</font><span id='pn3'style="margin-left:6px"></span></p>
       <p id="s4"><span id="stop4" style="color:white;border-radius:3px;background-color:green;margin-right:5px;font-weight:bold;"><font size="3">X</font></span><font size="3">鹿港站</font><span id='pn4'style="margin-left:6px"></span></p>
       
       <p id="s5"><span id="sop1" style="color:white;border-radius:3px;background-color:green;margin-right:5px;font-weight:bold;"><font size="3">X</font></span><font size="3">鹿港站</font><span id='pnb1'style="margin-left:6px"></span></p>
       <p id="s6"><span id="sop2" style="color:white;border-radius:3px;background-color:#EEEE00;margin-right:5px;font-weight:bold;"><font size="3">X</font></span><font size="3">朝馬站</font><span id='pnb2'style="margin-left:6px"></span></p>
       <p id="s7"><span id="sop3" style="color:white;border-radius:3px;background-color:red;margin-right:5px;font-weight:bold;"><font size="3">X</font></span></span><font size="3">台中火車站(東站)</font><span id='pnb3'style="margin-left:6px"></span></p>
       
     </div>
```
載入時 呼叫 API 並 更新地圖。
```js
$(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%270%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                console.log('>>>',JSON.stringify(Data))
                chosen=0;
                showEstimateTime(Data)
                console.log(chosen);
            }
            }); 
        });
```
當切換成去程時，顯示去程資訊，將回程的顯示隱藏；黨切換成回程，顯示回程資訊，將去程顯示隱藏。
```js
$("#s1").show();
$("#s2").show();
$("#s3").show();
$("#s4").show();
         
$("#s5").hide();
$("#s6").hide();
$("#s7").hide();

var a1,a2,a3;
var b1,b2;         
function showEstimateTime(data)
{
    if(chosen==0)
    {    
         $("#s1").show();
         $("#s2").show();
         $("#s3").show();
         $("#s4").show();
         
         $("#s5").hide();
         $("#s6").hide();
         $("#s7").hide();
    a1=false;
    a2=false;
    a3=false;
       
    for(var i=0;i<data.length;i++)
    {
        
        console.log(data[i].StopName['Zh_tw'])
        console.log(data[i].PlateNumb)
        console.log(data[i].EstimateTime)
         
        
        if(data[i].StopName['Zh_tw'] == '鹿港站')
        {    
            console.log('.....')
            $('#stop4').html('<font size="3">'+Math.round((data[i].EstimateTime)/60)+' min'+'</font>')
            $('#pn4').html(data[i].PlateNumb)
            a1 = true;
            console.log(a1)
        }
             
        if(data[i].StopName['Zh_tw'] == '朝馬站')
        {    
            $('#stop3').html('<font size="3">'+Math.round((data[i].EstimateTime)/60)+' min'+'</font>')
            a2 = true;
            $('#pn3').html(data[i].PlateNumb)
        }
        
        if(data[i].StopName['Zh_tw'] == '干城站')
        {    
            console.log('QQ')
            $('#stop2').html('<font size="3">'+Math.round((data[i].EstimateTime)/60)+' min'+'</font>')
            a3 = true;
            $('#pn2').html(data[i].PlateNumb)
        }
        
        //if(data[i].StopName['Zh_tw'] == '台中站')
        {    
            console.log(first0)
            var today=new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var now = h*100+m
            for(var x=0;x<first0.length;x++)
            {
                 var result = parseInt(first0[x])
                 //console.log(result)
                 if(now==first0[x])
                 {
                     $('#stop1').html(now);
                 }
                 else if(now>first0[x]&&((x+1)<first0.length)&&now<=first0[x+1])
                 {
                     $('#stop1').html('<font size="3">'+first0[x+1]+'</font>');
                 }
            }
            if(now>first0[first0.length-1]) {$('#stop1').html('末班駛離');}
        }
        console.log(a1)
        
            
    }
    if(a1==false) {$('#stop4').html('X')}
    if(a2==false) {$('#stop3').html('X')}
    if(a3==false) {$('#stop2').html('X')}
    }
    else if(chosen==1)
    {
         $("#s5").show();
         $("#s6").show();
         $("#s7").show();
         $("#s1").hide();
         
         $("#s2").hide();
         $("#s3").hide();
         $("#s4").hide();
        console.log('rrrrrrr')
        b1 = false;
        b2 = false;
         for(var i=0;i<data.length;i++)
    {
        console.log(data[i].StopName['Zh_tw'])
        console.log(data[i].PlateNumb)
        console.log(data[i].EstimateTime)

        {    
            console.log(first1)
            var today=new Date();
            var h = today.getHours();
            var m = today.getMinutes();

            var now = h*100+m
            for(var x=0;x<first1.length;x++)
            {
                 var result = parseInt(first1[x])
                 //console.log(result)
                 if(now==first1[x])
                 {
                     $('#sop1').html(now);
                 }
                 else if(now>first1[x]&&((x+1)<first1.length)&&now<=first1[x+1])
                 {
                     $('#sop1').html('<font size="3">'+first1[x+1]+'</font>');
                 }
            }
            if(now>first1[first1.length-1]) {$('#sop1').html('末班駛離');}

        }
        if(data[i].StopName['Zh_tw'] == '朝馬')
        {    
            $('#sop2').html('<font size="3">'+Math.round((data[i].EstimateTime)/60)+' min'+'</font>')
            b1 = true;
            $('#pnb2').html(data[i].PlateNumb)
        }
                
        
        if(data[i].StopName['Zh_tw'] == '臺中火車站(東站)')
        {    
            $('#sop3').html('<font size="3">'+Math.round((data[i].EstimateTime)/60)+' min'+'</font>')
            b2 = true;
            $('#pnb3').html(data[i].PlateNumb)
        }
       
            
    }
    if(b1==false) $('#sop2').html('X')
    if (b2==false) $('#sop3').html('X')    
    }        
}    
```
每10秒更新一次 側欄資訊
```js
setInterval(function () {
    $(function () {
    if(chosen==0)
    {        
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
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%270%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                console.log(chosen);
            }
            }); 
        });
    }
    else if(chosen==1)
    {
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
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%271%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                console.log(chosen);
            }
            }); 
        });        
    }
    else
    {
        $(function () {
        $.ajax({
        type: 'GET',
        url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$top=150&$format=JSON', 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            showBusWay2(Data);            
        }
    });
});
    }        
    
});
},10000);
```
其他 :
點選 側欄的 Radio Buttons 或是 地圖鑲嵌的按鈕 時，會再更新一次。
如果需要立馬(手動) 更新的可以按 改變方向的按鈕，或是 重新整理 會有最新資訊。
## Demo
![](https://i.imgur.com/jf4fR1W.jpg)
[![Yes](https://img.youtube.com/vi/ZUAYGx29vqM/0.jpg)](https://www.youtube.com/watch?v=ZUAYGx29vqM)
