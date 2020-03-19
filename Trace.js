initMap = async (result) => {
  var map = new google.maps.Map(document.getElementById('map'), {
  center: {
   lat: result[0].latitude,
   lng: result[0].longitude
  },
  zoom: 8
 });

 var infowindow = new google.maps.InfoWindow();
 var marker, i;
 for (i = 0; i < result.length; i++) {
  marker = new google.maps.Marker({
   position: new google.maps.LatLng(result[i].latitude, result[i].longitude),
   map: map
  });
   google.maps.event.addListener(marker, 'click', (function(marker, i) {
   return function() {
    infowindow.setContent(result[i].getaddress);
    infowindow.open(map, marker);
   }
  })(marker, i));
 }

}

Add_Update_Form = (Button_Value, function_value) => {
 console.log(function_value);
 document.getElementById('card1id').innerHTML = "";
 document.getElementById('card1id').innerHTML = document.getElementById('card1id').innerHTML + `<div class="container">
  <label for="fname">Name:</label><br>
  <input type="text" id="fname" name="fname"><br><br/>
  <label for="fname">Address:</label><br>
  <input type="text" id="address" name="address"><br><br/>
  <button type="button" name="button" id="addLocation" onclick="${function_value}">${Button_Value}</button>
  </div>`;
}

window.onload = function() {
 if (localStorage.getItem('user') != null) {
  var previousJsonData = JSON.parse(localStorage.getItem('user'));
  printdata(previousJsonData, 'firstColumn');
 }
}

togglebuttonforSwitch = () => {
 var x = document.getElementById('owner');
 var y = document.getElementById('user');
 if (x != null) {
  x.id = "user";
  x.value = "Switch to owner";
  x.innerHTML = "Switch to Owner";
  window.location = "file:///C:/Users/Shubham%20Jindal/Documents/JavaScriptProject/Tracking-App/TraceUser.html";
 }
 if (y != null) {
  y.id = "owner";
  y.value = "Switch to User";
  y.innerHTML = "Switch to User";
  window.location = "file:///C:/Users/Shubham%20Jindal/Documents/JavaScriptProject/Tracking-App/Trace.html";
 }
}


const addLocation = async () => {
 console.log('check');
 getname = document.getElementById('fname').value;
 getaddress = document.getElementById('address').value;
 var results = await asyaddressToLat_Lan(getaddress);
 multiplemarkerData = {
  result: []
 };
 add_details = {
  id: 1,
  getname: getname,
  getaddress: getaddress,
  latitude: results.latitude,
  longitude: results.longitude
 }
 multiplemarkerData.result.push(add_details);
 await initMap(multiplemarkerData.result);
 await addLocationcard(getname, getaddress, results)
}

asyaddressToLat_Lan = async (getaddress) => {
 var latitude;
 var longitude;
 var geocoder = new google.maps.Geocoder();
 geocode_location = {};
 var promise = new Promise(function(resolve, reject) {
  geocoder.geocode({
   'address': getaddress
  }, function(results, status) {
   if (status == 'OK') {
    latitude = results[0].geometry.location.lat();
    //console.log(latitude);
    longitude = results[0].geometry.location.lng();
    geocode_location = {
     latitude: latitude,
     longitude: longitude
    }
   }
   resolve(geocode_location)
  })
 });
 return promise.then(geocode_location);
}

addLocationcard = async (getname, getaddress, result) => {
 if (localStorage.getItem('user') == null) {
  console.log('ddd');
  details = {
   result: [{
    id: 1,
    getname: getname,
    getaddress: getaddress,
    latitude: result.latitude,
    longitude: result.longitude
   }]
  }
  localStorage.setItem('user', JSON.stringify(details));
 } else {
  var previousJsonData = JSON.parse(localStorage.getItem('user'));
  add_details = {
   id: previousJsonData.result.length + 1,
   getname: getname,
   getaddress: getaddress,
   latitude: result.latitude,
   longitude: result.longitude
  }
  previousJsonData.result.push(add_details);
  localStorage.setItem('user', JSON.stringify(previousJsonData));
 }
 document.getElementById('firstColumn').innerHTML = document.getElementById('firstColumn').innerHTML + `<div class="card">
     <div class="container">
      <a onclick="editcard('${previousJsonData.result.length -1}', '${getname}', '${getaddress}')"><i class="fa fa-edit" id="caricon" style="font-size:15px;color:lightblue;text-shadow:2px 2px 4px #000000;" ></i></a>
        <i class="fa fa-trash" id="cloudicon" style="font-size:15px;color:lightblue;text-shadow:2px 2px 4px #000000;"></i>
        <h4>Name:<b>${getname}</b></h4>
        <p>Address:${getaddress}</p>
     </div>
  </div><br/>`
}

printdata = async (previousJsonData, idd) => {
 var size = previousJsonData.result.length;
 for (var i = 0; i < size; i++) {
  document.getElementById(idd).innerHTML = document.getElementById(idd).innerHTML + `<div class="card">
       <div class="container">
          <a onclick="editcard('${i}', '${previousJsonData.result[i].getname}', '${previousJsonData.result[i].getaddress}')"><i class="fa fa-edit" id="caricon" style="font-size:15px;color:lightblue;text-shadow:2px 2px 4px #000000;"></i></a>
          <i class="fa fa-trash" id="cloudicon" style="font-size:15px;color:lightblue;text-shadow:2px 2px 4px #000000;"></i>
          <h4>Name:<b>${previousJsonData.result[i].getname}</b></h4>
          <p>Address:${previousJsonData.result[i].getaddress}</p>
       </div>
    </div><br/>`
 }
}

getnearbyplace = async () => {
 console.log('check1');
 multiplemarkerData = {result:[]};
 var count = 1;
 var getaddress = document.getElementById('searchInput').value;
 var result = await asyaddressToLat_Lan(getaddress);
 var previousJsonData = JSON.parse(localStorage.getItem('user'));
 var size = previousJsonData.result.length;
 multiplemarkerData.result.push({
  id: 0,
  getname: "you",
  getaddress: getaddress,
  latitude: result.latitude,
  longitude: result.longitude
 })

 for (i = 0; i < size; i++) {
  var distance = (3959 * Math.acos(Math.cos(result.latitude * Math.PI / 180) * Math.cos(previousJsonData.result[i].latitude * Math.PI / 180) * Math.cos((previousJsonData.result[i].longitude * Math.PI / 180) - (result.longitude * Math.PI / 180)) + Math.sin((result.latitude * Math.PI / 180)) * Math.sin((previousJsonData.result[i].latitude * Math.PI / 180))));
  if (distance <= 50 && count <= 10) {
   add_details = {
    id: count,
    getname: previousJsonData.result[i].getname,
    getaddress: previousJsonData.result[i].getaddress,
    latitude: previousJsonData.result[i].latitude,
    longitude: previousJsonData.result[i].longitude
   }
   multiplemarkerData.result.push(add_details)
   count++;
  } else if (count > 10) {
   break;
  }
 }
 await initMap(multiplemarkerData.result);
 printdata_User(multiplemarkerData, 'firstColumn1', false);
 console.log(multiplemarkerData.result);
 console.log(result);
}

editcard = (index, name, address) => {
 console.log(index + name + address);
 Add_Update_Form('Update The Details', 'edit(' + index + ')');
 document.getElementById("fname").value = name;
 document.getElementById("address").value = address;
}

edit = async (index) => {
 console.log(index);
 getname = document.getElementById('fname').value;
 getaddress = document.getElementById('address').value;
 var results = await asyaddressToLat_Lan(getaddress);
 var previousJsonData = JSON.parse(localStorage.getItem('user'));
 previousJsonData.result[index].getname = getname;
 previousJsonData.result[index].getaddress = getaddress;
 previousJsonData.result[index].latitude = results.latitude;
 previousJsonData.result[index].longitude = results.longitude;
 localStorage.setItem('user', JSON.stringify(previousJsonData));
 multiplemarkerData = {result: []};
 add_details = {
  id: 1,
  getname: getname,
  getaddress: getaddress,
  latitude: results.latitude,
  longitude: results.longitude
 }
 multiplemarkerData.result.push(add_details);
 await initMap(multiplemarkerData.result);
 window.alert('Edit Done');
}
