/*
  Retrieve Restaurant List from Yelp API
*/

// Global variables
let yelpID = '8lAJdnJS8IADhxzdY93t9w';
let yelpApiKey = 'y_hl6PXci4AHe6XNXNxXwkuPAWbVJaR28iXmlx9rXOQYb4iHKzWhCfCAkvFHzwm2s6RXUmYQwYlmk1ZpllOwOZW3Z2co_8HdphrRJ-p3a9eP0qhRBPzAgOCc3NuXXHYx';
let zipcodeInput;
let distanceSelect;
let priceSelect;
let priceRange;
let ingredInput;
let addressLat;
let addressLng;
let restaurantId;
let restaurantSearchLimit = 5;
let map;
let locations = [];



// Seed Data

// on-click event handler - retrieve input values from restaurant.html page
$("#submit-btn").on("click", function (event) {
  event.preventDefault();

  // Clear locations array
  locations = [];

  zipcodeInput = $("#zipcode-input").val();
  distanceSelect = $("#distance-select").val();
  priceSelect = $("#price-select").val();
  cuisineInput = $("#cuisine-input").val().toLowerCase();
  // Log input results
  console.log('Input values', zipcodeInput, distanceSelect, priceSelect, cuisineInput)
  // Invoke Google ajax function
  zipcodeLatLng(zipcodeInput);
});

// Google ajax call - convert zipcode to lat & lng
const zipcodeLatLng = (zipcodeInput) => {
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcodeInput}&key=AIzaSyAh5sBAW8JKo0Fbeu4JPk_dYvN5aEzPW4c`,
    method: "GET"
  }).then(function (response) {
    console.log(response)
    addressLat = response.results[0].geometry.location.lat
    addressLng = response.results[0].geometry.location.lng
    // Log lat & lng
    console.log(addressLat, addressLng)

    // Invoke Yelp ajax function
    restaurantList(addressLat, addressLng);
  })
};

// Yelp ajax call - retrieve restaurant list/data
const restaurantList = (lat, lng) => {
  $.ajax({
    url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${cuisineInput}&latitude=${lat}&longitude=${lng}&sort_by=distance&limit=${restaurantSearchLimit}`,
    method: "GET",
    headers: {
      Authorization: `Bearer y_hl6PXci4AHe6XNXNxXwkuPAWbVJaR28iXmlx9rXOQYb4iHKzWhCfCAkvFHzwm2s6RXUmYQwYlmk1ZpllOwOZW3Z2co_8HdphrRJ-p3a9eP0qhRBPzAgOCc3NuXXHYx`,
    }
  }).then(function (response) {
    console.log(response)
    let restResponse = response.businesses;

    // Loop through response array
    restResponse.forEach((rest) => {
      let restId = rest.id;
      let restName = rest.name;
      let restAddressArray = rest.location.display_address;
      let restAddress = restAddressArray.join(',')
      let restPhoneNumber = rest.phone;
      let restRating = rest.rating;
      let restPrice = rest.price;
      let restLat = rest.coordinates.latitude;
      let restLng = rest.coordinates.longitude;

      // Log return values 
      console.log(restId, restName, restAddress, restPhoneNumber, restRating, restPrice, restLat, restLng);
      // Push restaurant data to locations array to build map markers
      locations.push([restName, restLat, restLng])
    })
    console.log(typeof addressLat)
    console.log(typeof addressLng)

    console.log(locations)
  })
  // Invoke initMap()
  setTimeout(function () {
    initialize();
  }, 3000);
};

// Initialize Google initMap function
const initialize = () => {
  console.log('initilize function called')
  initMap();
}

// Google map function - to display resturants on map
function initMap() {
  console.log('initMap function')
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: addressLat,
      lng: addressLng
    },
    zoom: 15
  });
  console.log('google maps first part complete')
  // Create Google Maps Info Window to display restarant markers
  let infowindow = new google.maps.InfoWindow({});
  let markers = [];
  let i;

  // Create map viewpoint property
  let loc;
  let bounds = new google.maps.LatLngBounds();

  // Clear out the old markers
  markers.forEach(function (marker) {
    marker.setMap(null);
  });

  // Loop through locations array - add markers to map
  for (i = 0; i < locations.length; i++) {
    console.log('google marker for-loop')
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
      title: locations[i][0],
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker)
      }
    })(marker, i))
    // Get lat & lng coordinate - use extend to add coordinates to the bounds property
    console.log('FitBounds', marker.position.lat(), marker.position.lng());
    // loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
    bounds.extend(marker.position);
  }
  console.log('bounds', bounds)
  // Google maps zoom based on markers
  map.fitBounds(bounds)
};




