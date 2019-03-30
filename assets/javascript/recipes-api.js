// 1. if the person just click submit without filling out the form he shoulf 
// 2. he should get 5 recipes of certain ingrediants - should be displayed
// 3. if anything is filled out, the
// all the global vars 
var apiId = "bee074ae"
var apiKey = '35f0b53adef2a154fbff9b7a401cc1f7'
var ingrds = ["chicken", "beef", "soup", "lamb", "vegetables"]
var randomIngrd;
var link;
var getRecipesUrl;
var timeInSeconds;
var userIngredient;
var userTime;
var neut;
var def;
var defu;
// the on click function
$("#subBtn").click(function () {
    randomIngrd = ingrds[Math.floor(ingrds.length * Math.random())]
    userTime = $("#cookingtime").val()
    timeInSeconds = userTime * 60
    userIngredient = $("#ingredients").val().trim();
    var userDiet = $("#dietary").val()
    var userHealth = $("#allergy").val()
    def= "FASAT"
    defu="393^Gluten-Free"
    //the search using the form or no

    getRecipesUrl = `https://api.yummly.com/v1/api/recipes?_app_id=${apiId}&_app_key=${apiKey}&q=${userIngredient ? userIngredient : randomIngrd}&requirePictures=true&maxTotalTimeInSeconds=${timeInSeconds ? timeInSeconds : 2400}&nutrition.${userDiet ? userDiet : def}.max=20&allowedAllergy[]=${userHealth ? userHealth : defu}&maxResult=5&start=5&sourceRecipeUrl`




    // the ajax calls
    $.get(getRecipesUrl)
        .then(function (results) {
            // display 5 recipes
            var recipes = results.matches
            console.log(recipes)
            for (var i = 0; i < recipes.length; i++) {
                var name = recipes[i].recipeName;

                var id = recipes[i].id;

                var ingredients = recipes[i].ingredients
                var time = (recipes[i].totalTimeInSeconds) / 60
                var image = recipes[i].smallImageUrls[0]
                var getRecipeStepsUrl = `https://api.yummly.com/v1/api/recipe/${id}?_app_id=${apiId}&_app_key=${apiKey}`

                $.get(getRecipeStepsUrl)
                    .then(function (results) {
                        link = results.source.sourceRecipeUrl
                    });
            };
        })
})

  