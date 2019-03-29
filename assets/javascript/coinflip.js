$(document).ready(function () {

  var eatIn
  var eatOut


  //coin flip on click
  $('#flip-button').on('click', function () {
    var flipResult = Math.random();
    $('#coin').removeClass();
    setTimeout(function () {
      if (flipResult <= 0.5) {
        eatIn = true;
        $('#coin').addClass('heads');
        var eatInText = $("<p class='coin-text-heads'>EAT-IN</p>")
        var nextButton = $("<a id='next-button' class='lime waves-effect waves-light btn-large'>Next</a>")
        setTimeout(function () {
          $("#coin.heads").append(eatInText);
          $("#flip-button").hide();
          $("#flip-button-container").append(nextButton);
          $("#next-button").show();
          console.log("you/re eating in");
          
          //next button on click
          $("#next-button").on('click', function () {
            console.log("im clicked")
            if (eatIn == true) {
              window.open('recipe.html', '_top', false)
            } else if (eatOut == true) {
              window.open('restaurant.html', '_top', false)
            }

          });
        }, 3000);

      }
      else {
        eatOut = true;
        $('#coin').addClass('tails');
        var eatOutText = $("<p class='coin-text-tails'>EAT-OUT</p>")
        var nextButton = $("<a id='next-button' class='lime waves-effect waves-light btn-large'>Next</a>")
        setTimeout(function () {
          $("#coin.tails").append(eatOutText);
          $("#flip-button").hide();
          $("#flip-button-container").append(nextButton);
          $("#next-button").show();
          console.log('you/re eating out');

          //next button on click
          $("#next-button").on('click', function () {
            console.log("im clicked")
            if (eatIn == true) {
              window.open('recipe.html', '_top', false)
            } else if (eatOut == true) {
              window.open('restaurant.html', '_top', false)
            }

          });
        }, 3000);

      }
    }, 100);
  });





});
