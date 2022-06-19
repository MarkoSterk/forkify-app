import { API_URL, RES_PER_PAGE, KEY } from "./config";
import { getJSON, sendJSON } from "./helpers";

/**
 * application state object
 * stores the current states
 */
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1
    },
    bookmarks: []
};

/**
 * Formates recipe data from API call
 * @param {Object} data recipe data 
 * @returns formated recipe data object
 * @author Marko Šterk
 */
const createRecipeObject = function(data) {
    const {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key}),
    };
}

/**
 * Loads recipe data from API call into app state object
 * @param {string} id recipe id 
 * @author Marko Šterk
 */
export const loadRecipe = async function(id) {
    try {
        const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
        
        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;
    }
    catch (err) {
        //temporary error handling
        throw err;
    }
}

/**
 * Loads search results from API call and updates state object
 * @param {string} query search bar query string 
 * @author Marko Šterk
 */
export const loadSearchResults = async function(query) {
    try{
        state.search.page = 1;
        state.search.query = query;

        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key})
            }
        });
    }
    catch (err){
        throw err;
    }
};

/**
 * Loads recipes for selected page
 * @param {number} page page number from state object 
 * @returns {object} slice of results in the state object 
 * @author Marko Šterk
 */
export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; //0;
    const end = page * state.search.resultsPerPage; //9;
    return state.search.results.slice(start, end)
}

/**
 * Recalculates ingredients quantities according to selected servings number
 * @param {number} newServings 
 * @author Marko Šterk
 */
export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * (newServings / state.recipe.servings)
        //newQt = oldQt * (newServings / oldServings)
    });
    state.recipe.servings = newServings;
}

/**
 * Saves bookmarks to local storage in browser
 */
const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}


/**
 * Adds recipe to booksmarks object
 * @param {object} recipe object to add to bookmarks 
 * @author Marko Šterk
 */
export const addBookmark = function(recipe) {
    //Add bookmark
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

/**
 * Deletes recipe from bookmarks
 * @param {string} id recipe id
 * @author Marko Šterk
 */
export const deleteBookmark = function(id) {
    //Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //Mark current recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

/**
 * On app initialization loads bookmarks from local storage to state object
 * @author Marko Šterk
 */
const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}

init();

/**
 * clears all bookmarks from localstorage
 * @author Marko Šterk
 */
const clearBookmarks = function() {
    localStorage.clear('bookmarks');
}
//clearBookmarks();

/**
 * Uploads new recipe to API
 * @param {object} newRecipe object with recipe for uploading 
 * @author Marko Šterk
 */
export const uploadRecipe = async function(newRecipe) {

    try{
        const ingredients = Object.entries(newRecipe).filter(
            entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        ).map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3) throw new Error(
                'Wrong ingredient format! Please use the correct format.'
                );
            const [quantity, unit, description] = ingArr;


            return {quantity: quantity ? +quantity : null,
                unit,
                description};
        })
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        };
        //console.log(recipe);
        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);

    } catch (err) {
        throw err;
    }
}