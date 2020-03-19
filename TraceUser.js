printdata_User = async (previousJsonData, idd) => {
 var size = previousJsonData.result.length;
 for (var i = 1; i < size; i++) {
       document.getElementById(idd).innerHTML = document.getElementById(idd).innerHTML + `<div class="card">
       <div class="container">
          <h4><b>${previousJsonData.result[i].getname}</b></h4>
          <p>${previousJsonData.result[i].getaddress}</p>
          <button type="button" name="button" onclick="initMap_User('${previousJsonData.result[0].latitude}' , '${previousJsonData.result[0].longitude}'
           ,'${previousJsonData.result[i].latitude}' , '${previousJsonData.result[i].longitude}')">Get Direction</button>
       </div>
    </div><br/>`
 }
}
function initMap_User(source_lat, source_lang, dest_lat, dest_lang) {
 var pointA = new google.maps.LatLng(source_lat, source_lang),
   pointB = new google.maps.LatLng(dest_lat, dest_lang),
   map = new google.maps.Map(document.getElementById('map')),
   directionsService = new google.maps.DirectionsService,
   directionsDisplay = new google.maps.DirectionsRenderer({
     map: map
   }),
   markerA = new google.maps.Marker({
     position: pointA,
     title: "point A",
     label: "A",
     map: map
   }),
   markerB = new google.maps.Marker({
     position: pointB,
     title: "point B",
     label: "B",
     map: map
   });
 calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
 directionsService.route({
   origin: pointA,
   destination: pointB,
   travelMode: google.maps.TravelMode.DRIVING
 }, function(response, status) {
   if (status == google.maps.DirectionsStatus.OK) {
     directionsDisplay.setDirections(response);
   } else {
     window.alert('Directions request failed due to ' + status);
   }
 });
}
