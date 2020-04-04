import $ from 'jquery';
import _ from 'lodash';
import 'materialize-css';
import { SPOONACULAR_API_KEY, YOUTUBE_API_KEY } from '../../config/keys';

const queryString = require('query-string');

const getRecipeID = () => {
  console.log(location.search);
  const parsed = queryString.parse(`${location.search}`);
  console.log(parsed);
  return parsed.id;
};

const recipePage = () => {
  // ********** Variables for QueryURLs **********
  const recipeURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/';
  const recipeID = getRecipeID();

  // ********** QueryURL **********
  // https://spoonacular.com/food-api/docs#Get-Recipe-Information
  // https://api.spoonacular.com/recipes/:id/information?apiKey=###&includeNutrition=false
  const queryURL = `${recipeURL}${recipeID}/information`;

  var recipePromise = $.ajax({
    url: queryURL,
    method: 'GET',
    headers: {
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "x-rapidapi-key": SPOONACULAR_API_KEY
    },
  });

  let cachedServingSize = 0,
      cachedIngredients;

  recipePromise.then((response) => {
    console.log('ajax1 | successful!!!!');
    console.log(response);

    cachedIngredients = response.extendedIngredients;
    cachedServingSize = response.servings;

    // unused recipe elements
    // _.forEach(response.diets, diet => {
    //   dietOpts += `<option value="${_.toLower(val)}">${val}</option>`;
    // });
    
    $('#recipe-title').text(response.title); // recipe title
    $('#recipe-time').append(`${response.readyInMinutes} min.`); // recipe prep time
    $('#recipe-img').attr('src', response.image); // recipe image
    $('#recipe-servings > option[value="choose"]').attr({ 'selected': false });
    $(`#recipe-servings > option[value="${response.servings}"]`).attr({ 
      'disabled' : true,
      'selected' : true 
    });

    let ingredients = '';

    _.forEach(response.extendedIngredients, ingredient => {
      ingredients += `<li>${ingredient.amount} ${_.toLower(ingredient.unit)} 
        ${ingredient.name}</li>`;
    });

    $('#recipe-ingredients').html(ingredients);
    $('#recipe-summary').html(response.summary)

    $('#recipe-instructions').html(response.instructions);

    console.log(`recipeID: ${recipeID}`);
  }).catch(function (error) {
    console.log(`${error.status} ${_.toUpper(error.statusText)}`);
  });

  gapi.load('client', function () {
    var gapiPromise = gapi.client.init({
      'apiKey': YOUTUBE_API_KEY
    }).then(function() {
      return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("Youtube API Client loaded"); },
              function(err) { console.error("Error loading Youtube API Client: ", err); });
    })
    
    Promise.all([recipePromise, gapiPromise]).then(function(values) {
      var recipe = values[0];
      var keyword = recipe.title;

      return gapi.client.youtube.search.list({
        part: "snippet",
        q: keyword,
        topicId: "/m/02wbm",
        order: "relevance",
        maxResults: 3
      })
    }).then(function(response) {
      console.log("Response successful: ");
      var videos = response.result.items;

      videos.forEach(function(video) {
        // create an <iframe> for each video
        // src url should be https://youtube.com/embed/VIDEO_ID
        // append the video to the 'videos' div
        console.log(video.id.videoId);
        $("#videos").append(`<iframe src="https://youtube.com/embed/${video.id.videoId}">`)
      })
    }).catch(function(error) {
      console.log("Error searching: ", error)
    })
  });

  // Initialize Materialize form select.
  $('select').formSelect();

  $('#recipe-servings').on('change', () => {
    let servingsWanted = _.parseInt($('#recipe-servings').val()),
        servingsCoef = _.parseInt(servingsWanted)/_.parseInt(cachedServingSize),
        ingredients = '';

    if (isNaN(servingsCoef))
      return;

    _.forEach(cachedIngredients, ingredient => {
      // DEBUG:
      // console.log(ingredient);
      ingredients += `<li>${ math.round((servingsCoef * _.parseInt(ingredient.amount)), 2) } ${_.toLower(ingredient.unit)} 
        ${ingredient.name}</li>`;
    });

    $('#recipe-ingredients').html(ingredients);
  });
};

export default recipePage;