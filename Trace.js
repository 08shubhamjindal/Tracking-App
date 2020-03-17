initMap = async (result) => {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: result.latitude,
			lng: result.longitude
		},
		zoom: 8
	});
  var marker = new google.maps.Marker({
    position: {
      lat: result.latitude,
      lng: result.longitude
    },
    map: map,
    title: 'Hello World!'
  });
}

window.onload = function () {
  if (localStorage.getItem('user')!=null) {
    	var previousJsonData = JSON.parse(localStorage.getItem('user'));
      printdata(previousJsonData);
  }
}

togglebuttonforSwitch = () =>{
  var x = document.getElementById('owner');
  var y = document.getElementById('user');
  if(x!=null){
    x.id =  "user";
    x.value = "Switch to owner";
    x.innerHTML = "Switch to Owner";
    window.location= "file:///C:/Users/Shubham%20Jindal/Documents/JavaScriptProject/Tracking-App/TraceUser.html";
  }if(y!=null) {
    y.id = "owner";
    y.value = "Switch to User";
    y.innerHTML = "Switch to User";
    window.location = "file:///C:/Users/Shubham%20Jindal/Documents/JavaScriptProject/Tracking-App/Trace.html";
  }
}

const addLocation = async() => {
	console.log('check');
	getname = document.getElementById('fname').value;
	getaddress = document.getElementById('address').value;
	var result = await asyaddressToLat_Lan(getaddress);
  await initMap(result)
	await addLocationcard(getname, getaddress, result)
	//  await console.log(result.latitude);
}

asyaddressToLat_Lan = async(getaddress) => {
	var latitude;
	var longitude;
	var geocoder = new google.maps.Geocoder();
	geocode_location = {};
	var promise = new Promise(function (resolve, reject) {
		geocoder.geocode({
			'address': getaddress
		}, function (results, status) {
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

addLocationcard = async(getname, getaddress, result) => {
	if (localStorage.getItem('user') == null) {
		console.log('ddd');
		details = {
			result: [{
				id: 1,
				getname: getname,
				getaddress: getaddress,
        latitude :result.latitude,
        longitude : result.longitude
			}]
		}
		localStorage.setItem('user', JSON.stringify(details));
	} else {
		var previousJsonData = JSON.parse(localStorage.getItem('user'));
		add_details = {
			id: previousJsonData.result.length + 1,
			getname: getname,
			getaddress: getaddress,
      latitude :result.latitude,
      longitude : result.longitude
		}
		previousJsonData.result.push(add_details);
		localStorage.setItem('user', JSON.stringify(previousJsonData));
	}
	document.getElementById('firstColumn').innerHTML = document.getElementById('firstColumn').innerHTML + `<div class="card">
     <div class="container">
        <i class="fa fa-car" id="caricon" style="font-size:20px;color:lightblue;text-shadow:2px 2px 4px #000000;"></i>
        <i class="fa fa-cloud" id="cloudicon" style="font-size:20px;color:lightblue;text-shadow:2px 2px 4px #000000;"></i>
        <h4><b>${getname}</b></h4>
        <p>${getaddress}</p>
     </div>
  </div><br/>`
}

printdata = async(previousJsonData) => {
  var size = previousJsonData.result.length;
  for(var i=0; i<size; i++){
    document.getElementById('firstColumn').innerHTML = document.getElementById('firstColumn').innerHTML + `<div class="card">
       <div class="container">
          <i class="fa fa-car" id="caricon" style="font-size:20px;color:lightblue;text-shadow:2px 2px 4px #000000;"></i>
          <i class="fa fa-cloud" id="cloudicon" style="font-size:20px;color:lightblue;text-shadow:2px 2px 4px #000000;"></i>
          <h4><b>${previousJsonData.result[i].getname}</b></h4>
          <p>${previousJsonData.result[i].getaddress}</p>
       </div>
    </div><br/>`
  }
}

getnearbyplace = async ()=>{
  console.log('check1');
  multiplemarkerData = {result:[]};
  var count=1;
  var getaddress = document.getElementById('searchInput').value;
  var result = await asyaddressToLat_Lan(getaddress);
  await initMap(result);
  var previousJsonData = JSON.parse(localStorage.getItem('user'));
  var size = previousJsonData.result.length;
  for(i=0; i<size; i++){
    var distance = (3959* Math.acos(Math.cos(result.latitude * Math.PI / 180)*Math.cos(previousJsonData.result[i].latitude * Math.PI / 180) * Math.cos((previousJsonData.result[i].longitude * Math.PI / 180) - (result.longitude * Math.PI / 180)) + Math.sin((result.latitude * Math.PI / 180)) * Math.sin((previousJsonData.result[i].latitude * Math.PI / 180))));
    if(distance<=5 && count<=10) {
      add_details = {
        id: count,
  			getname: previousJsonData.result[i].getname,
  			getaddress: previousJsonData.result[i].getname,
        latitude :previousJsonData.result[i].latitude,
        longitude : previousJsonData.result[i].longitude
  		}
        multiplemarkerData.result.push(add_details)
        count++;
    } else if(count>10){
      break;
    }
  }
  console.log(multiplemarkerData.result);
  console.log(result);
}