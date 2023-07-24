const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: [], 

	// BUILD THE MAP
	buildMap() {
	  this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
	  });

	  // ADD TILES TO MAP
	  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
		  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
	  }).addTo(this.map);

	  // ADD A GEOLOCATION MARKER
	  const marker = L.marker(this.coordinates);
	  marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup();
	},

	// ADD MARKERS FOR BUSINESSES
	addMarkers() {
	  for (let i = 0; i < this.businesses.length; i++) {
		const marker = L.marker([
		  this.businesses[i].lat,
		  this.businesses[i].long,
		])
		  .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
		  .addTo(this.map);

		this.markers.push(marker); // Fix: Add the marker to the markers array
	  }
	},
  };

  // GET COORDS
  async function getCoords() {
	const pos = await new Promise((resolve, reject) => {
	  navigator.geolocation.getCurrentPosition(resolve, reject);
	});
	return [pos.coords.latitude, pos.coords.longitude];
  }

  async function getFoursquare(business) {
	const options = {
	  method: 'GET',
	  headers: {
		Accept: 'application/json',
		Authorization: 'fsq3LSy0Q+MnFWpGlQatt+VPgtYeFjvPyoq4v3y01Elz5fg=',
	  },
	};
	let [lat, lon] = myMap.coordinates; 
	let response = await fetch(
	  `https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=5&ll=${lat}%2C${lon}`,
	  options
	);
	let data = await response.json(); 
	let businesses = data.results;
	return businesses;
  }

  // process foursquare array
  function processBusinesses(data) {
	let businesses = data.map((element) => {
	  let location = {
		name: element.name,
		lat: element.geocodes.main.latitude,
		long: element.geocodes.main.longitude,
	  };
	  return location;
	});
	return businesses;
  }

  window.onload = async () => {
	const coords = await getCoords();
	myMap.coordinates = coords;
	myMap.buildMap();
  };

  // SUMBIT BUTTON
  document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault();
	let business = document.getElementById('business').value;
	let data = await getFoursquare(business);
	myMap.businesses = processBusinesses(data);
	myMap.addMarkers();
  });