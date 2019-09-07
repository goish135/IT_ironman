var map;
var arrowPolyline = L.Polyline.extend({
        addArrows: function(){
		    var points = this.getLatLngs()
            for (var p = 0; p +1 < points.length; p++){
                
                var diffLat = points[p+1]["lat"] - points[p]["lat"]
                var diffLng = points[p+1]["lng"] - points[p]["lng"]
                var center = [points[p]["lat"] + diffLat/2,points[p]["lng"] + diffLng/2]
               
                var angle = 360 - (Math.atan2(diffLat, diffLng)*57.295779513082)
                
                var arrowM = new L.marker(center,{
                   icon: new L.divIcon({ 
                        className : "arrowIcon",
                        iconSize: new L.Point(30,30), 
                        iconAnchor: new L.Point(15,15), 
                        html : "<div style = 'font-size: 20px; -webkit-transform: rotate("+ angle +"deg)'>&#10152;</div>"
                   })
                }).addTo(map);
           }
            
        }
    })

$( document ).ready(function() {
	map = L.map('map').setView([20,20], 5);
    
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		opacity: 0.6
	}).addTo(map);
    
   var latlngs = [[21,21], [20,22], [22,23], [23,22], [23,26], [22,23], [20,23], [20,25]]    
   var polyline = new arrowPolyline(latlngs, {color: 'red'}).addTo(map);
   polyline.addArrows()
    
    
})