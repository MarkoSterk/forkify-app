import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if(module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try{
    const id = window.location.hash.slice(1);

    if(!id) return;
    
    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // 1)Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2) load recipe
    await model.loadRecipe(id);
    
    // 3) rendering recipe
    recipeView.render(model.state.recipe);
    
  } catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function() {
  try{
    //1) get search query
    const query = searchView.getQuery();
    if(!query) return;
    resultsView.renderSpinner();

    //2) Load search results
    await model.loadSearchResults(query);

    //3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render inital pagination buttons
    paginationView.render(model.state.search);
  }
  catch (err) {
    console.log(err);
  }
}

const controlPagination = function(goToPage) {
  //1) render new results
  resultsView.render(model.getSearchResultsPage(goToPage))
  //2) render new pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  //1) Add/remove bookmark
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  }
  else{
    model.deleteBookmark(model.state.recipe.id);
  }
  //2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //1) Upload recipe
    await model.uploadRecipe(newRecipe);
    
    //2) Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Re-render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    //Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow();
      //Re-render upload form
      addRecipeView.generateUploadForm();
    }, MODAL_CLOSE_SEC * 1000)


  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
  //Upload new recipe data
  
}



/**
 * App initialization
 * Adds handler functions to different View elements
 */
const init = function() {
  bookmarksView.addHanlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
