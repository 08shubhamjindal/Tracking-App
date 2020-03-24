printdata_User = async (previousJsonData, idd, check_var) => {
  document.getElementById(idd).innerHTML = "";
  var start = 1;
  if(check_var==true){
     start = 0;
     document.getElementById(idd).innerHTML = "<b>Your Last History</b><br/><br/>";
  }
 var size = previousJsonData.result.length;
 var innerhtml = '';
 for (var i = start; i < Math.min(5,size); i++) {
      innerhtml = innerhtml + `<div class="card">
          <div class="container">
          <h4>Name:<b>${previousJsonData.result[i].getname}</b></h4>
          <p>Address:${previousJsonData.result[i].getaddress}</p>
          <button type="button" name="button" onclick="initMap_User('${previousJsonData.result[0].latitude}' , '${previousJsonData.result[0].longitude}'
           ,'${previousJsonData.result[i].latitude}' , '${previousJsonData.result[i].longitude}'); recent_Search('${previousJsonData.result[i].getname}','${previousJsonData.result[i].getaddress}', '${previousJsonData.result[i].latitude}',
            '${previousJsonData.result[i].longitude}');">Get Direction</button>
       </div>
    </div><br/>`
 }
 document.getElementById(idd).innerHTML = document.getElementById(idd).innerHTML + innerhtml;
}

initMap_User = (source_lat, source_lang, dest_lat, dest_lang) => {
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

calculateAndDisplayRoute = (directionsService, directionsDisplay, pointA, pointB) => {
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
window.onload = function() {
  var previous_RecentJsonData = JSON.parse(localStorage.getItem('recentItem'));
  printdata_User(previous_RecentJsonData , 'firstColumn1', true);
}

recent_Search = (name, address, latitude, longitude)=> {
  if (localStorage.getItem('recentItem') == null) {
   add_details = {result: [{
     id: 1,
     getname: name,
     getaddress: address,
     latitude: latitude,
     longitude: longitude}]}
   localStorage.setItem('recentItem', JSON.stringify(add_details));
 } else {
     var previous_RecentJsonData = JSON.parse(localStorage.getItem('recentItem'));
     var size = previous_RecentJsonData.result.length;
     var flag=0;
     add_details = {id: previous_RecentJsonData.result.length + 1,
     getname: name,
     getaddress: address,
     latitude: latitude,
     longitude: longitude}
     for(var i=0; i<size; i++){
       if(previous_RecentJsonData.result[i].latitude==latitude && previous_RecentJsonData.result[i].longitude==longitude
          && previous_RecentJsonData.result[i].getname==name && previous_RecentJsonData.result[i].getaddress==address) {
            previous_RecentJsonData.result.splice(i,1);
            previous_RecentJsonData.result.unshift(add_details);
            flag=1;
            break;
          }
     }
     if(flag==0) previous_RecentJsonData.result.push(add_details);

     localStorage.setItem('recentItem', JSON.stringify(previous_RecentJsonData));
 }
}
