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

// Seed Data

// on-click event handler - retrieve input values from restaurant.html page
$("#submit-btn").on("click", function (event) {
  event.preventDefault();

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
      let restAddress = rest.location.display_address;
      let restPhoneNumber = rest.phone;
      let restRating = rest.rating;
      let restPrice = rest.price;
      let restLat = rest.coordinates.latitude;
      let restLng = rest.coordinates.longitude;


      // Log return values 
      console.log(restId, restName, restAddress, restPhoneNumber, restRating, restPrice, restLat, restLng)
    })


  })
}
