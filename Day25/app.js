var chosen= '-2' ;
console.log('test',chosen)
var OneDirection = -1
var mode = 1
var address = document.getElementById('now-position'); 
function tunoff()
{
    $("#taichung").hide()
    $("#bus9018").show();
    // $("#content").hide()
    OneDirection = -1
    mode = 1
    chosen = '-2'
     $(function () {
        $.ajax({
        type: 'GET',
        url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$top=150&$format=JSON', 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            //$('body').text(JSON.stringify(Data));
            //console.log(JSON.stringify(Data))

            //$data.val(Data);
            //console.log($data);
            showBusWay2(Data);
        }
          });
       });
}

function hidecontext()
{
    console.log('hide')
    $("#content").hide()
}
function taichung()
{
    $("#taichung").show()
    $("#bus9018").hide();
    $("#content").hide()
    mode = 2
}    
$("#taichung").hide()

$("#list").hide()
const list = document.getElementById('list');
const favorite = document.getElementById('favorite');
let OriginList = "";

/*
const xhr = new XMLHttpRequest();
xhr.open('get','https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=500&$format=JSON');//
xhr.send(null);
xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    function showBusWay(items) {
        console.log(data)
        // console.log(items);
        // var str = '';
        for (var i = 0; i < items.length; i++){
            OriginList += 
            `<li class="card" title="路線詳情" onclick=updatemap(${ items[i].SubRoutes[0].SubRouteName.Zh_tw})>
                    <p class="bus-way">${ items[i].SubRoutes[0].Headsign }</p>
                    <p class="bus-num">${ items[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
            </li>`
        }
        list.innerHTML = OriginList;
    }
    showBusWay(data);
}*/

var data;
 $.ajax({
        type: 'GET',
        url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=500&$format=JSON', 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
                 console.log('okkkkkk',Data)
                 data = Data
                 
        for (var i = 0; i < Data.length; i++){
            console.log('排除特殊符號',String(Data[i].SubRoutes[0].SubRouteName.Zh_tw))
            a = Data[i].SubRoutes[0].SubRouteName.Zh_tw.toString()
            a = a.replace(/[&\|\\\*^%$#@\-]/g,"")
            console.log('debug',Data[i].SubRoutes[0].SubRouteName.Zh_tw)
            console.log(typeof(a))
            OriginList += 
            `<li class="card" title="路線詳情" onclick=updatemap('${ Data[i].SubRoutes[0].SubRouteName.Zh_tw}')>
                    <p class="bus-way">${ Data[i].SubRoutes[0].Headsign }</p>
                    <p class="bus-num">${ Data[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
            </li>`
        }
        list.innerHTML = OriginList;

        }
    });
console.log('aaaa',data)

function updatemap(rline)
{
    
    console.log(rline)
    $("#taichung").show();
    $("#bus9018").hide();
    $("#list").hide()
    $('#content').hide();
    chosen = rline
    
    //chosen = parseInt(RouteName)
    pre = []
    pre2 = []
    //console.log('CRoute',RouteName)
    requestURL = 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+rline+'%27%20'
    console.log(requestURL)
    $(function () {
    $.ajax({
        type: 'GET',
        url: requestURL, 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            //$('body').text(JSON.stringify(Data));
            //console.log(JSON.stringify(Data))

            //$data.val(Data);
            //console.log($data);
            showBusWay2(Data);
            
            // ML_EstimateTime(Data);

        }
    });
    $("#content").hide()
    go_url =  'https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+rline+'%27%20and%20Direction%20eq%20%270%27&$orderby=StopSequence%20asc&$top=100&$format=JSON';
      $.ajax({
        type: 'GET',
        url: go_url, 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            address.innerHTML = String(rline) + ` 號公車路線`;
            goData = Data;
            update = function (items) {
            var str = '';
            const len = items.length;
            for (var i = 0; i < len; i++) {
                goBtn.innerHTML = `往 ${goData[len - 1].StopName.Zh_tw}`;
                backBtn.innerHTML = `往 ${goData[0].StopName.Zh_tw}`;

                const Time = Math.floor(items[i].EstimateTime / 60); //將到站時間換算成分鐘
                if (items[i].EstimateTime == undefined) { //暫無公車靠近，顯示 過站
                    str +=
                        `<li class="bus-state">
                            <span  style="color:white;border-radius:3px;background-color:red;margin-right:5px;font-weight:bold;">
                                過站
                            </span>
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                        </li>`
                } else if (items[i].EstimateTime < 0){ //末班駛離
                    str +=
                        `<li class="bus-state">
                            末班駛離
                           
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                        </li>`
                } else if (items[i].EstimateTime == 0) { //進站中
                    str +=
                        `<li class="bus-state">
                            <span  style="color:black;border-radius:3px;background-color:#FFFF00;margin-right:5px;font-weight:bold;">進站中</span>
                            
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                            <span>${items[i].PlateNumb}</span>
                        </li>`
                } else if (items[i].EstimateTime == 60) { //剩餘一分
                    str +=
                        `<li class="bus-state">
                            <span style="color:black;border-radius:3px;background-color:#33CCFF;margin-right:5px;font-weight:bold;">${Time}分</span>
                           
                            <span class="way"></span>
                            <span class="sta-name">${items[i].StopName.Zh_tw}</span>
                            <span class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></span>
                        </li>`
                } else if (items[i].EstimateTime) { //顯示多久到站
                    str +=
                        `<li class="bus-state">
                            <span class="station" style="color:white;border-radius:3px;background-color:#00FF00;margin-right:5px;font-weight:bold;">
                                <span class="time">${Time}分</span>
                            </span>
                            <span class="way"></span>
                            <span class="sta-name">${items[i].StopName.Zh_tw}</span>
                        </li>`
                }
                busList.innerHTML = str;
                $("#content").show()
            }
            // console.log(1);
        }
        update(goData);
        }
    });
    
   });
}    
var search = document.querySelector('.search');

search.addEventListener('input',searchBus,false); //input屬性 = 使用者每次操作都跑一次 function

function searchBus() {
    $("#content").hide()
    var searchVu = search.value; // searchVu 為使用者輸入的路線號
    console.log('searchVu',searchVu);
     if(searchVu=='')
        {
            $("#list").hide()
        }
        else
        {      
           //console.log('str',str)    
           $("#list").show()
        }      
    function filterItems(searchVu) {
        return data.filter(function (i) {
            return i.SubRoutes[0].SubRouteName.Zh_tw.indexOf(searchVu.toUpperCase()) == 0;
            // 撈出開頭符合使用者搜尋的資料
            // .toUpperCase() 強制轉大寫
        })
    }
    // console.log(filterItems(searchVu));

    function updatedList(items) { // 重新渲染路線結果
        var str = '';
      
        for (var i = 0; i < items.length; i++) {
            str +=
            `<li class="card" title="路線詳情" onclick=updatemap('${ items[i].SubRoutes[0].SubRouteName.Zh_tw}')>
                    <p class="bus-way">${ items[i].SubRoutes[0].Headsign }</p>
                    <p class="bus-num" >${ items[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
                </a>
            </li>`
        }
        list.innerHTML = str;
       
    }
    updatedList(filterItems(searchVu));
}


var greenIcon;
var redIcon;
var markers = [];
var markers2 = []; 


   

    

   
     mymap = new L.map('mapid', {
       center: new L.LatLng(24.144534,120.672542),
	   zoom: 13,  
       fullscreenControl: true,
			fullscreenControlOptions: { // optional
				title:"Show me the fullscreen !",
				titleCancel:"Exit fullscreen mode"
			}
    });
    

    // events are fired when entering or exiting fullscreen.
		// detect fullscreen toggling
		mymap.on('enterFullscreen', function(){
			if(window.console) window.console.log('enterFullscreen');
            
		});
		mymap.on('exitFullscreen', function(){
			if(window.console) window.console.log('exitFullscreen');
            
		});
   
  
   

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);


    var LeafIcon = L.Icon.extend({
		options: {

			iconSize:     [24, 24],
			iconAnchor:   [12, 12],
			popupAnchor:  [0, -12]
		}
	});

	greenIcon = new LeafIcon({iconUrl: 'https://cdn3.iconfinder.com/data/icons/education-vol-1-34/512/1_Bus_school_school_bus_vehicle-128.png'});
    redIcon   = new LeafIcon({iconUrl: 'https://i.imgur.com/1NR7PWi.png'});

/*
const xhr2 = new XMLHttpRequest();
xhr2.open('get','https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$top=150&$format=JSON');//
xhr2.send(null);
*/
var customControl =  L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';
    container.style.backgroundImage = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT95yXZFIju_XFA4ecqzwG8d7vAWNfl999A2o4k0W47zfvNnm2Q)";
    container.style.backgroundSize = "50px 50px";
    container.style.width = '50px';
    container.style.height = '50px';

    container.onclick = function(){
       if(mode==1)
       {    
       console.log("Test 1");
        //xhr2.open('get',"https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON");//
        //xhr2.send(null);
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", //欲呼叫之API網址(此範例為台鐵車站資料)
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))

                showBusWay2(Data);
                mymap.removeLayer(polyline2);
                mymap.removeLayer(polyline);
                mymap.addLayer(polyline);
                //L.polyline(temp, {color: 'yellow',weight:6}).addTo(mymap);
                //mymap.fitBounds(polyline.getBounds());
                console.log(chosen);
            }
            });
        });

        chosen = '0' ;
        $('input:checked').prop('checked', false);
        $('#go').prop('checked', true);
         $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%270%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON",
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                //showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
       }
       else
       {
           getGoJson()
       }           
        /*
        mymap.addLayer(ironman);
        if (ironman.isRunning()) {
            ironman.pause();
        } else {
            ironman.closePopup();
            ironman.start();

        }
        */

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
      if(mode==1)
      {    
      $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'1'&$top=150&$format=JSON", 
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))

                showBusWay2(Data);
                console.log(chosen);
                //console.log('check it out',mydata);
                //for(var i=0;i<mydata.length;i++)
                {
                    mymap.removeLayer(polyline);
                    mymap.removeLayer(polyline2);
                    mymap.addLayer(polyline2);

                    console.log(polyline2);
                }
            }
            });
        });
        chosen = '-1';
        $('input:checked').prop('checked', false);
        $('#back').prop('checked', true);
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%271%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON",
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                //showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
      } 
      else
      {
          getBackJson()
      }
        // mymap.removeLayer(ironman);
    }

    return container;
  }
});
mymap.addControl(new customControl2());
$(function () {
    $.ajax({
        type: 'GET',
        url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$top=150&$format=JSON', //欲呼叫之API網址(此範例為台鐵車站資料)
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            //$('body').text(JSON.stringify(Data));
            //console.log(JSON.stringify(Data))

            //$data.val(Data);
            //console.log($data);
            showBusWay2(Data);
            ML_EstimateTime(Data);

        }
    });
});
var outline = [[24.144661, 120.672551],[24.136106, 120.682463],[24.135853, 120.681780],[24.144386, 120.672329]];
var polygon = L.polygon(outline, {color: 'red'}).addTo(mymap);
CX = [24.144661 ,24.136106,24.135853 ,24.144386]
CY = [120.672551,120.682463, 120.681780,120.672329]
function checkcheck (x, y, cornersX, cornersY) {
    console.log('shake it')
    var i, j=cornersX.length-1 ;
    var  oddNodes=false;

    var polyX = cornersX;
    var polyY = cornersY;

    for (i=0; i<cornersX.length; i++) {
        if ((polyY[i]< y && polyY[j]>=y ||  polyY[j]< y && polyY[i]>=y) &&  (polyX[i]<=x || polyX[j]<=x)) {
oddNodes^=(polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x);
        }

    j=i;
    }
    console.log(typeof(oddNodes))
return oddNodes;
}
function ML_EstimateTime(Data)
{
    console.log('kkk',Data);
    console.log(Data[0].PlateNumb)
    console.log(Data[0].BusPosition.PositionLat)
    w1 = 85.9258325
    w2 = 833.851985
    w3 = 0.000172761469
    w4 = 0.0237584361
    b  = -102694.62563892263
    w1_v2 = -1136.52111
    w2_v2 = 2060.83273
    w3_v2 = -0.0127095007
    w4_v2 = -0.0156634324
    b_v2  = -221249.1457116791
    ntcu  = [24.144671,120.672558]
    flag = 0
    for(i=0;i<Data.length;i++)
    {
        if(Data[i].Direction=="0")
        {
            console.log('bbbbbbbbbbb')
            // 與路線的點算距離 看誰最小
            min = 2000

            if(checkcheck(Data[i].BusPosition.PositionLat,Data[i].BusPosition.PositionLon,CX,CY)==1)
            {
                console.log('Hihihihihi')
               for(j=0;j<12;j++)
            {
                tp = GetDistance(Data[i].BusPosition.PositionLat,Data[i].BusPosition.PositionLon,temp[j][0],temp[j][1])
                if(tp<min)
                {
                    min = tp
                    record = distoNTCU[j]
                    flag = 1
                    thelat = Data[i].BusPosition.PositionLat
                    thelon = Data[i].BusPosition.PositionLon
                    thespeed = Data[i].Speed
                    thePb = Data[i].PlateNumb
                    console.log('okokokok')
                }
            }
            }
            else
            {
                console.log('nonono')
            }
           


        }
    }
     if(flag==1)
            {
                y = parseFloat(thelat)*w1 + parseFloat(thelon)*w2 + record*w3 + parseFloat(thespeed)*w4 + b
                y_v2 = parseFloat(thelat)*w1_v2 + parseFloat(thelon)*w2_v2 + record*w3_v2 + parseFloat(thespeed)*w4_v2 + b_v2
                console.log('y',y)
                console.log('y2: ',y_v2)
                $('#stopX').html(Math.round(y))
                $('#pnX').html(thePb)
                if(y_v2 <= 0)
                {$('#stopX2').html('即將進站')}
                else {
                  $('#stopX2').html(Math.round(y_v2))
                }

                $('#pnX2').html(thePb)
            }
    if(flag==0)
    {
        $('#stopX').html('<><')
        $('#pnX').html('')
        $('#stopX2').html('<><')
        $('#pnX2').html('')
    }
}
//console.log($data);

function GetAuthorizationHeader() {
    var AppID = '1dc69d1674fd440aab9447e6dd6eac6d';
    var AppKey = 'TPymIgAXR1mfRUxa8GH1zDgQ8FQ';

    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/}; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}


setInterval(function () {
   
    $(function () {
    if(chosen!='0' && chosen!='-1' && chosen!='-2')
    {
         if(OneDirection==0)
         {    
          Rurl = 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+chosen+'%27%20'+"and Direction%20eq%20'0'"
         }
         else if(OneDirection==1)
         {
             Rurl = 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+chosen+'%27%20'+"and Direction%20eq%20'1'"
         }
         else
         {
             Rurl = 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+chosen+'%27%20'
         }             
         console.log(Rurl)
         $(function () {
            $.ajax({
            type: 'GET',       
            url: Rurl,
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                //showEstimateTime(Data)
                showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
    }        
    else if(chosen=='0')  // 9018 往鹿港
    {
        $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", //欲呼叫之API網址(此範例為台鐵車站資料)
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))

                showBusWay2(Data);
                ML_EstimateTime(Data)
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
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                //showBusWay2(Data);
                console.log(chosen);
            }
            });
        });

    }
    else if(chosen== '-1')  // 9018 往台中
    {
        $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'1'&$top=150&$format=JSON", //欲呼叫之API網址(此範例為台鐵車站資料)
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))

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
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                //showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
    }
    else
    {
        console.log('default route')
        $(function () {
        $.ajax({
        type: 'GET',
        url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$top=150&$format=JSON', //欲呼叫之API網址(此範例為台鐵車站資料)
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            //$('body').text(JSON.stringify(Data));
            //console.log(JSON.stringify(Data))

            //$data.val(Data);
            //console.log($data);
            showBusWay2(Data);
        }
          });
       });
    }

});
},10000);


function val(value)
{
    console.log("Hello");
     if(value==0)
     {
         mymap.removeLayer(polyline2);
         mymap.removeLayer(polyline);
         mymap.addLayer(polyline);
        console.log("Test 1");
        //xhr2.open('get',"https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON");//
        //xhr2.send(null);
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", //欲呼叫之API網址(此範例為台鐵車站資料)
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))

                showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
        chosen = '0' ;
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%270%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON",
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                //showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
     }
     else if(value== 1)
     {
          mymap.removeLayer(polyline);
          mymap.removeLayer(polyline2);
          mymap.addLayer(polyline2);
         console.log("Test 2");
         //xhr2.open('get',"https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'1'&$top=150&$format=JSON");//
        //xhr2.send(null);
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'1'&$top=150&$format=JSON", //欲呼叫之API網址(此範例為台鐵車站資料)
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                //console.log(JSON.stringify(Data))

                showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
        chosen = '-1';
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%271%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON",
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                showEstimateTime(Data)
                //showBusWay2(Data);
                console.log(chosen);
            }
            });
        });
     }

}
console.log(chosen);
//xhr2.onload = function () {
    //data = JSON.parse(xhr2.responseText);
    //data = JSON.parse(data);
    //showBusWay2(data);

//}

var pre = [];
var pre2 = [];
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
    if(chosen=='0')
    {
         $("#s1").show();
         $("#s2").show();
         $("#s3").show();
         $("#s4").show();
         $("#sX").show();
         $("#sX2").show();
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
            //console.log(h);
            //console.log(m);
            //console.log(h*100+m);
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
            //$('#stop1').html(data[i].EstimateTime)
            //$('#pn1').html('')
        }
        console.log(a1)


    }
    if(a1==false) {$('#stop4').html('X');$('#pn4').html('')}
    if(a2==false) {$('#stop3').html('X');$('#pn3').html('')}
    if(a3==false) {$('#stop2').html('X');$('#pn2').html('')}
    }
    else if(chosen== '-1')
    {
         $("#s5").show();
         $("#s6").show();
         $("#s7").show();
         $("#s1").hide();

         $("#s2").hide();
         $("#s3").hide();
         $("#s4").hide();
         $("#sX").hide();
         $("#sX2").hide();
        console.log('rrrrrrr')
        b1 = false;
        b2 = false;
         for(var i=0;i<data.length;i++)
    {
        console.log(data[i].StopName['Zh_tw'])
        console.log(data[i].PlateNumb)
        console.log(data[i].EstimateTime)
        //if(data[i].StopName['Zh_tw'] == '鹿港站')
        {
            // $('#stop4').html('<font size="3">'+Math.round((data[i].EstimateTime)/60)+' min'+'</font>')
            console.log(first1)
            var today=new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            //console.log(h);
            //console.log(m);
            //console.log(h*100+m);
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
            //$('#stop1').html(data[i].EstimateTime)
            // $('#pnb1').html('')
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
    if(b1==false) {$('#sop2').html('X');$('#pnb2').html('')}
    if (b2==false) {$('#sop3').html('X');$('#pnb3').html('')}
    }
}

function showBusWay2(items) {

        for(var i=0;i<markers.length;i++)
        {
            mymap.removeLayer(markers[i]);  // 移除舊圖標

        }
        for(var i=0;i<markers2.length;i++)
        {
            mymap.removeLayer(markers2[i]);
        }
        var offSiteX = -0.00001532;
        var offSiteY =  0.00005708;

        for (var i = 0; i < items.length; i++){

        var img = new Image();
        if(items[i].Direction=='0')
        {

            img.src = './images/0.png';

            var lat = Number(items[i].BusPosition.PositionLat) + offSiteY;
            var lon = Number(items[i].BusPosition.PositionLon) - offSiteX;
            var latlng = {lat: lat, lon: lon};

            var options =
            {
                img: img
            };
            var angleMarker = L.angleMarker(latlng, options);

            var angle = 0;
            if(pre.length==0)
            {
                mymap.addLayer(angleMarker);
                markers2.push(angleMarker);
            }
            var flag = 1;
            for (var j=0;j<pre.length;j++)
            {
                if(pre[j]["key"]==items[i].PlateNumb)
                {
                    flag = 0;
                    var previousLatLng = {lat: pre[j].lat, lon:  pre[j].lon};
                    var nextLanLng = {lat:items[i].BusPosition.PositionLat, lon:  items[i].BusPosition.PositionLon};
                    console.log(previousLatLng)
                    console.log(nextLanLng)
                    angle = angleMarker.getAngle(previousLatLng, nextLanLng);
                    console.log("yes");
                    console.log('angle',angle)
                    angleMarker.setHeading(angle);
                    if (angle!=0)
                    {
                        mymap.addLayer(angleMarker);
                        markers2.push(angleMarker);
                    }
                    else
                    {
                            angleMarker.setHeading(pre[j]["angle"]);
                            mymap.addLayer(angleMarker);
                            markers2.push(angleMarker);
                    }

                    console.log(pre[j])
                    pre.splice(j,1);
                    break;
                }
            }

            if(flag==1)
            {
                mymap.addLayer(angleMarker);
                markers2.push(angleMarker);
            }
            pre.push({"key":items[i].PlateNumb,"lat":items[i].BusPosition.PositionLat,"lon":items[i].BusPosition.PositionLon,"angle":angle});

        }
        else
        {
            img.src = './images/1.png';

            var lat = Number(items[i].BusPosition.PositionLat) + offSiteY;
            var lon = Number(items[i].BusPosition.PositionLon) - offSiteX;
            var latlng = {lat: lat, lon: lon};

            var options =
            {
                img: img
            };
            var angleMarker = L.angleMarker(latlng, options);

            var angle = 0;
           
            if(pre2.length==0)
            {
                mymap.addLayer(angleMarker);
                markers2.push(angleMarker);
            }
            var flag = 1;
            for (var j=0;j<pre2.length;j++)
            {
                if(pre2[j]["key"]==items[i].PlateNumb)
                {
                    flag = 0;
                    var previousLatLng = {lat: pre2[j].lat, lon:  pre2[j].lon};
                    var nextLanLng = {lat:items[i].BusPosition.PositionLat, lon:  items[i].BusPosition.PositionLon};
                    console.log(previousLatLng)
                    console.log(nextLanLng)
                    angle = angleMarker.getAngle(previousLatLng, nextLanLng);
                    console.log("yes");
                    console.log('angle',angle)
                    angleMarker.setHeading(angle);
                    if (angle!=0)
                    {
                        mymap.addLayer(angleMarker);
                        markers2.push(angleMarker);
                    }
                    else
                    {
                            angleMarker.setHeading(pre2[j]["angle"]);
                            mymap.addLayer(angleMarker);
                            markers2.push(angleMarker);
                    }

                    console.log(pre2[j])
                    pre2.splice(j,1);
                    break;
                }
            }

            if(flag==1)
            {
                mymap.addLayer(angleMarker);
                markers2.push(angleMarker);
            }
            pre2.push({"key":items[i].PlateNumb,"lat":items[i].BusPosition.PositionLat,"lon":items[i].BusPosition.PositionLon,"angle":angle});
        }



}
}
// $('#stop1').html("即將進站")
$(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity/9018?$filter=Direction%20eq%20%270%27%20and%20PlateNumb%20ne%20%27-1%27%20&$top=150&$format=JSON",
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log('>>>',JSON.stringify(Data))
                chosen='0';
                showEstimateTime(Data)
                //showBusWay2(Data);
                //console.log(chosen);
                // $('#go').prop('checked', true);
                console.log(chosen);
            }
            });
        });
        
var goData = '';
var backData = '';

var goBtn = document.getElementById('go1');
var backBtn = document.getElementById('back1');

//goBtn.value = "AAA";
//backBtn.value = "BBB";
console.log('goBtn',goBtn.value)


var busList = document.getElementById('bus-way-list');

goBtn.addEventListener('click', getGoJson, false);
backBtn.addEventListener('click', getBackJson, false);

console.log('jjjjj')
console.log(chosen)





function chdir(a)
{
    console.log(a)
    if(a=="go")
    {
        check = a
    }
    else
    {
        check = a
    }        
}
/* 判斷去程回程 */
var check = 'go';
var GoUrl,BackUrl;
function checkWay() {
    go_url =  'https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+String(chosen)+'%27%20and%20Direction%20eq%20%270%27&$orderby=StopSequence%20asc&$top=100&$format=JSON';
// console.log(roadLine);
console.log(go_url)
  GoUrl = go_url;
// console.log(GoUrl);
back_url = 'https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+String(chosen)+'%27%20and%20Direction%20eq%20%271%27&$orderby=StopSequence%20asc&$top=100&$format=JSON';
  BackUrl = back_url;


// address.innerHTML = String(chosen) + ` 號公車路線`;
var updata; //記錄要渲染的路線資料

    if(mode==2)
    {    
        if (check == "go"){
            getGoJson();
            console.log('gogogo')
        }
        else{
            getBackJson();
            console.log('backkkkk')
        }
    }   
    
}
checkWay();



/* 去程資料 */
function getGoJson(){
            
                
            Rurl = 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+chosen+'%27%20'+"and Direction%20eq%20'0'"
            
            $.ajax({
            type: 'GET',       
            url: Rurl,
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                //showEstimateTime(Data)
                showBusWay2(Data);
                console.log(chosen);
            }
            });
        
    OneDirection = 0
    check = 'go'
    clearInterval(getBackJson); // 讓畫面不會渲染出 回程路線
     $(function () {
         
    $.ajax({
        type: 'GET',
        url: GoUrl, 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            
            goData = Data;
            update = function (items) {
            var str = '';
            const len = items.length;
            for (var i = 0; i < len; i++) {
                goBtn.innerHTML = `往 ${goData[len - 1].StopName.Zh_tw}`;
                backBtn.innerHTML = `往 ${goData[0].StopName.Zh_tw}`;

                const Time = Math.floor(items[i].EstimateTime / 60); //將到站時間換算成分鐘
                if (items[i].EstimateTime == undefined) { //暫無公車靠近，顯示 過站
                    str +=
                        `<li class="bus-state">
                            <span  style="color:white;border-radius:3px;background-color:red;margin-right:5px;font-weight:bold;">
                                過站
                            </span>
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                        </li>`
                } else if (items[i].EstimateTime < 0){ //末班駛離
                    str +=
                        `<li class="bus-state">
                            末班駛離
                           
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                        </li>`
                } else if (items[i].EstimateTime == 0) { //進站中
                    str +=
                        `<li class="bus-state">
                            <span  style="color:black;border-radius:3px;background-color:#FFFF00;margin-right:5px;font-weight:bold;">進站中</span>
                            
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                            <span>${items[i].PlateNumb}</span>
                        </li>`
                } else if (items[i].EstimateTime == 60) { //剩餘一分
                    str +=
                        `<li class="bus-state">
                            <span style="color:black;border-radius:3px;background-color:#33CCFF;margin-right:5px;font-weight:bold;">${Time}分</span>
                           
                            <span class="way"></span>
                            <span class="sta-name">${items[i].StopName.Zh_tw}</span>
                            <span class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></span>
                        </li>`
                } else if (items[i].EstimateTime) { //顯示多久到站
                    str +=
                        `<li class="bus-state">
                            <span class="station" style="color:white;border-radius:3px;background-color:#00FF00;margin-right:5px;font-weight:bold;">
                                <span class="time">${Time}分</span>
                            </span>
                            <span class="way"></span>
                            <span class="sta-name">${items[i].StopName.Zh_tw}</span>
                        </li>`
                }
                busList.innerHTML = str;
                $("#content").show()
            }
          
        }
        update(goData);
        }
    });
   });
    
    
    
    
}


/* 回程資料 */
function getBackJson() {
    OneDirection = 1
    clearInterval(getBackJson); // 讓畫面不會渲染出 回程路線
    check = 'back'
            
                
            Rurl = 'https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27'+chosen+'%27%20'+"and Direction%20eq%20'1'"
            
            $.ajax({
            type: 'GET',       
            url: Rurl,
            dataType: 'json',
            headers: GetAuthorizationHeader(),
            success: function (Data) {
                //$('body').text(JSON.stringify(Data));
                console.log(JSON.stringify(Data))
                //showEstimateTime(Data)
                showBusWay2(Data);
                console.log(chosen);
            }
            });
     $(function () {
         
    $.ajax({
        type: 'GET',
        url: BackUrl, 
        dataType: 'json',
        headers: GetAuthorizationHeader(),
        success: function (Data) {
            backData = Data;
            
            console.log('OOXX')
            update = function (items) {
            var str = '';
            const len = items.length;
            for (var i = 0; i < len; i++) {
               

   const Time = Math.floor(items[i].EstimateTime / 60); //將到站時間換算成分鐘
                if (items[i].EstimateTime == undefined) { //暫無公車靠近，顯示 過站
                    str +=
                        `<li class="bus-state">
                            <span  style="color:white;border-radius:3px;background-color:red;margin-right:5px;font-weight:bold;">
                                過站
                            </span>
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                        </li>`
                } else if (items[i].EstimateTime < 0){ //末班駛離
                    str +=
                        `<li class="bus-state">
                            末班駛離
                           
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                        </li>`
                } else if (items[i].EstimateTime == 0) { //進站中
                    str +=
                        `<li class="bus-state">
                            <span  style="color:black;border-radius:3px;background-color:#FFFF00;margin-right:5px;font-weight:bold;">進站中</span>
                            
                            <span class="way"></span>
                            ${items[i].StopName.Zh_tw}
                            <span>${items[i].PlateNumb}</span>
                        </li>`
                } else if (items[i].EstimateTime == 60) { //剩餘一分
                    str +=
                        `<li class="bus-state">
                            <span style="color:black;border-radius:3px;background-color:#33CCFF;margin-right:5px;font-weight:bold;">${Time}分</span>
                           
                            <span class="way"></span>
                            <span class="sta-name">${items[i].StopName.Zh_tw}</span>
                            <span class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></span>
                        </li>`
                } else if (items[i].EstimateTime) { //顯示多久到站
                    str +=
                        `<li class="bus-state">
                            <span class="station" style="color:white;border-radius:3px;background-color:#00FF00;margin-right:5px;font-weight:bold;">
                                <span class="time">${Time}分</span>
                            </span>
                            <span class="way"></span>
                            <span class="sta-name">${items[i].StopName.Zh_tw}</span>
                        </li>`
                }
                busList.innerHTML = str;
            }
            // console.log(1);
        }
        update(backData);
        }
    });
   });
}

    
 setInterval(checkWay, 10000);

        
