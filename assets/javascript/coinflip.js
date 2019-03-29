jQuery(document).ready(function($){
    

    $('#flip-button').on('click', function(){
      var flipResult = Math.random();
      $('#coin').removeClass();
      setTimeout(function(){
        if(flipResult <= 0.5){
          $('#coin').addClass('heads');
          var eatIn = $("<p class='coin-text-heads'>EAT-IN</p>")
          var nextButton = $("<a id='next-button' class='lime waves-effect waves-light btn-large'>Next</a>")
            setTimeout(function(){  
          $("#coin.heads").append(eatIn);
          $("#flip-button").hide();
          $("#flip-button-container").append(nextButton);
          $("#next-button").show();
          console.log('it is head');
        }, 3000);
        
        }
        else{
          $('#coin').addClass('tails');
          var eatOut = $("<p class='coin-text-tails'>EAT-OUT</p>")
          var nextButton = $("<a id='next-button' class='lime waves-effect waves-light btn-large'>Next</a>")
            setTimeout(function(){
          $("#coin.tails").append(eatOut);
          $("#flip-button").hide();
          $("#flip-button-container").append(nextButton);
          $("#next-button").show();
          console.log('it is tails');
        }, 3000);
        
    }
      }, 100);
    });
  });
  