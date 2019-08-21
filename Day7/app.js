var data = '';
var mymap;
var greenIcon;
var markers = [];

var chosen;
   

 mymap = L.map('mapid').setView([24.144534,120.672542], 13);
 
   mymap.removeControl(mymap.zoomControl);

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
       console.log("Test 1");
        
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
        chosen = 1;
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
        }
    });
});

//console.log($data);

function GetAuthorizationHeader() {
    var AppID = '';
    var AppKey = '';

    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/}; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}


setInterval(function () {
    //xhr2.open('get','https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$top=150&$format=JSON');//
    //xhr2.send(null);
    $(function () {
    if(chosen==0)
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
                console.log(chosen);
            }
        });
    }
    else if(chosen==1)
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
    }
    else
    {
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
        console.log("Test 1");
        //xhr2.open('get',"https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON");//
        //xhr2.send(null);
        $(function () {
            $.ajax({
            type: 'GET',
            url: "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", 
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
        chosen = 0 ;
     }
     else if(value==1)
     {
         console.log("Test 2");
        
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

}
console.log(chosen);




function showBusWay2(items) {
        console.log(items);
        for(var i=0;i<markers.length;i++)
        {
            mymap.removeLayer(markers[i]);  // 移除舊圖標

        }


        for (var i = 0; i < items.length; i++){
            var pop1 = L.popup({autoClose: false,closeOnClick:false,autoPan: false}).setContent(items[i].PlateNumb);
            theMarker = L.marker([items[i].BusPosition.PositionLat, items[i].BusPosition.PositionLon], {icon: greenIcon}).addTo(mymap);
            theMarker.bindPopup(pop1).openPopup();
            markers.push(theMarker);

        }

}
