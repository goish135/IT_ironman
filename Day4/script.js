var marker3 = L.icon({
    iconUrl: 'https://i.imgur.com/mRt2rog.png',
    iconSize:     [54.6, 22.7], // size of the icon
    iconAnchor:   [27.3, 11.35], // point of the icon which will correspond to marker's location
    });
    
var p1p2p3p4 = [[24.263936,120.569167], [24.112074,120.615684],
[22.689343 ,120.309121], [22.627560 , 120.267411]];
map.fitBounds(p1p2p3p4);
        
marker3 = L.Marker.movingMarker(p1p2p3p4,[2000, 3000, 2000], {autostart: true,icon: marker3}).addTo(map);
L.polyline(p1p2p3p4, {color: 'red'}).addTo(map);

marker3.once('click', function () {
    marker3.start();
    marker3.on('click', function() {
        if (marker3.isRunning()) {
            marker3.closePopup();
            marker3.pause();
        } else {
            marker3.closePopup();
            marker3.start();
        }
    });

});

marker3.on('end', function() {
    marker3.bindPopup('<b>Welcome to Kaohsiung !</b>', {closeOnClick: false})
    .openPopup();
});

// ==================================================================================================================================
var marker1 = L.icon({
    iconUrl: 'https://i.imgur.com/mRt2rog.png',
    iconSize:     [54.6, 22.7], // size of the icon
    iconAnchor:   [27.3, 11.35], // point of the icon which will correspond to marker's location
    });
var p123456 = [[24.287939, 120.511924], [24.618813,120.731719],
[25.147408, 121.750569], [24.033423, 121.626818], [21.962351,120.778510],[22.621061,120.256785],[24.287939, 120.511924]];

marker1 = L.Marker.movingMarker(p123456,[2000, 2000, 2000, 2000,2000,2000], {autostart: true, loop: true,icon: marker1}).addTo(map);
marker1.loops = 0;
marker1.bindPopup('', {closeOnClick: false});
marker1.on('loop', function(e) {
    marker1.loops++;
    if (e.elapsedTime < 50) {
        marker1.bindPopup("<b>第 " + marker1.loops + " 圈</b>")
        marker1.openPopup();
        setTimeout(function() {
            marker1.closePopup();
        }, 2000);
    }
});
// ===================================================================================================================================
var marker2 = L.icon({
    iconUrl: 'https://i.imgur.com/mRt2rog.png',
    iconSize:     [54.6, 22.7], // size of the icon
    iconAnchor:   [27.3, 11.35], // point of the icon which will correspond to marker's location
    });
marker2 = L.Marker.movingMarker([[25.034265,121.564515 ]], [],{icon:marker2}).addTo(map);
map.on("click", function(e) {
    marker2.moveTo(e.latlng, 1000);
});





    