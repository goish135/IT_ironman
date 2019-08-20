
var mymap;
var greenIcon;
var markers = [];

    

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
    

},10000);




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
