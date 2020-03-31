// ********** Variables for QueryURLs **********
const apiKey = RECIPES_API_KEY;
const recipeURL = 'https://api.spoonacular.com/recipes/';
const diet = 'vegetarian';
const intolerances = 'peanut';
const ingredients = 'apples,almond,sugar';
const number = 5;
const apiImagePath = 'https://spoonacular.com/recipeImages/';

// https://spoonacular.com/food-api/docs#Diets
const dietTypesList = [
  'glutenFree',
  'ketogenic',
  'vegan',
  'vegetarian',
  'Lacto-Vegetarian',
  'Ovo-Vegetarian',
  'pescetarian',
  'paleo',
  'primal',
  'whole30', // doesn't exist?
];

// https://spoonacular.com/food-api/docs#Intolerances
const intolerancesList = [
  'dairy',
  'egg',
  'gluten',
  'grain',
  'peanut',
  'seafood',
  'sesame',
  'shellfish',
  'soy',
  'sulfite',
  'tree nut',
  'wheat'
];

// ********** QueryURLs **********
// Search by Diet and instructionsRequired => id, image, imageUrls, readyInMinutes, servings, title
// https://spoonacular.com/food-api/docs#Search-Recipes
const queryUrlRecipes = `${recipeURL}search?apiKey=${apiKey}&diet=${diet}&intolerances=${intolerances}&instructionsRequired=true&number=${number}`;

// Search by Ingredients
// https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients
const queryUrlByIng = `${recipeURL}findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=${number}`;


const recipeIDs = [];

$.ajax({
  url: queryUrlRecipes,
  method: 'GET'
}).done(function (response) {
  console.log('ajax1 | successful!!!!');
  const results = response.results;
  console.log(results);

  results.forEach(function(result) {
    // Render only recipes whose cooking time is equal to or less than 30 mins
    if (result.readyInMinutes <= 30) {
      recipeIDs.push(result.id);

      const tr = $(`<tr id=${result.id}>`);
      const idTd = $('<td>').text(result.id);
      const titleTd = $('<td>').text(result.title);
      const imgEl = $('<img>').attr('src', `${apiImagePath}${result.image}`);
      imgEl.attr('height', '200px');
      const imgTd = $('<td>').append(imgEl);
      const servingTd = $('<td>').text(result.servings);
      const minutesTd = $('<td>').text(result.readyInMinutes);

      tr.append(idTd, titleTd, imgTd, servingTd, minutesTd);
      $('#ingredients .result tbody').append(tr);
    }
  })

}).fail(function(jqXHR, textStatus, errorThrown) {
  console.log(`ajax1 | ${textStatus.toUpperCase()}: ${errorThrown}`)
});


  // $.ajax({
  //   url: queryUrlByIng,
  //   method: 'GET'
  // }).then(function (response) {
  //
  // });



/*
$.ajax({
  url: queryUrlByIng,
  method: 'GET'
}).then(function (response) {
  console.log('ajax1!!!!');
  console.log(response);
  response.forEach(function(recipe) {
    recipeIDs.push(recipe.id);

    const tr = $(`<tr id=${recipe.id}>`);
    const idTd = $('<td>').text(recipe.id);
    const titleTd = $('<td>').text(recipe.title);
    const imgEl = $('<img>').attr('src', recipe.image);
    const imgTd = $('<td>').append(imgEl);

    tr.append(idTd, titleTd, imgTd);
    $('#ingredients .result tbody').append(tr);

  });

  console.log(recipeIDs);

  recipeIDs.forEach(function(id) {
    const queryURLRecipeInfo = `${recipeURL}${id}/information?apiKey=${apiKey}&includeNutrition=false`;
    console.log('query: ' + queryURL);

    $.ajax({
      url: queryURLRecipeInfo,
      method: 'GET'
    }).then(function (response) {
      console.log('ajax2!!!!');
      console.log(response);

      const servingTd = $('<td>').text(response.servings);
      const minitesTd = $('<td>').text(response.readyInMinutes);
      $(`#${id}`).append(servingTd, minitesTd);
    });
  });
});
*/

