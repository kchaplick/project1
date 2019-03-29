/*
  Retrieve Restaurant List from Yelp API
*/

// Global variables
let yelpID = '8lAJdnJS8IADhxzdY93t9w';
let yelpApiKey = 'y_hl6PXci4AHe6XNXNxXwkuPAWbVJaR28iXmlx9rXOQYb4iHKzWhCfCAkvFHzwm2s6RXUmYQwYlmk1ZpllOwOZW3Z2co_8HdphrRJ-p3a9eP0qhRBPzAgOCc3NuXXHYx';
let addressInput;
let distanceSelect;
let priceSelect;
let ingredInput;
let addressLat;
let addressLng;
let restaurantId;
let restaurantSearchLimit = 5;
let map;
let locations = [];

// Autocomplete function - invoked in script tag
function initAutocomplete() {
  console.log('init autocomplete')
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('address-input')
  )
};
// Check value of price-select
let priceCheckInput = (priceSelect === null) ? "1" : priceSelect;

// Setup autocomplete
// Seed Data

// on-click event handler - retrieve input values from restaurant.html page
$("#sub-btn").on("click", function (event) {
  event.preventDefault();

  // Clear locations array
  locations = [];
  addressInput = $("#address-input").val();
  priceSelect = $("#price-select").val();
  cuisineInput = $("#cuisine-input").val()//.toLowerCase();
  // Log input results
  console.log('Input values', addressInput, distanceSelect, priceSelect, cuisineInput)
  // Caluculate price range
  // Invoke Google ajax function
  zipcodeLatLng(addressInput);
});

// Google ajax call - convert zipcode to lat & lng
const zipcodeLatLng = (addressInput) => {
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${addressInput}&key=AIzaSyAh5sBAW8JKo0Fbeu4JPk_dYvN5aEzPW4c`,
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
      let restUrl = rest.url;
      let restLat = rest.coordinates.latitude;
      let restLng = rest.coordinates.longitude;

      // Log return values 
      console.log(restId, restName, restAddress, restPhoneNumber, restRating, restPrice, restUrl, restLat, restLng);
      // Push restaurant data to locations array to build map markers
      locations.push([restName, restLat, restLng])

      // Build HTML Tags
      let restDataDiv = $("<div>");
      let restNameTag = $("<h3>").text(restName);
      restNameTag.addClass("restaurant-name");
      // let ulTag = $("<lu>")
      let restWebsiteTag = $("<p>").text(`Website: ${restUrl}`)
      restWebsiteTag.attr("href", `${restUrl}`)

      let restNumberTag = $("<p>").text(`Number: ${restPhoneNumber}`)
      let restAddressTag = $("<p>").text(`Address: ${restAddress}`)
      let restRatingTag = $("<p>").text(`Rating: ${restRating}`)

      $(restDataDiv).append(restNameTag)
      $(restDataDiv).append(restWebsiteTag)
      $(restDataDiv).append(restNumberTag)
      $(restDataDiv).append(restAddressTag)
      $(restDataDiv).append(restRatingTag)


      $("#restaurant-list-conatiner").append(restDataDiv);
    })
    console.log(locations)
    initMap();
  })
};

// Google map function - to display resturants on map
function initMap() {
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
    bounds.extend(marker.position);
  }
  // Google maps zoom based on markers lat & lng
  map.fitBounds(bounds)
};


