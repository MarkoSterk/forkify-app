import View from './View';
import icons from '../../img/icons.svg'; // Parcel 1

class AddRecipeView extends View {
    
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');

    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _parentElement = document.querySelector('.upload');
    
    _errorMessage = 'No bookmarks yet. FInd a nice recipe and bookmark it.';
    _message = 'Recipe was uploaded successfully.';

    constructor() {
        super();
        this.generateUploadForm();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    /**
     * Toggles recipe upload form window
     * @author Marko Šterk
     */
    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    /**
     * Adds event listener to button for opening the upload recipe form
     * @author Marko Šterk
     */
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
    }

    /**
     * Adds event listener to button and overlay for closing upload recipe form
     * @author Marko Šterk
     */
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overlay.addEventListener('click', this.toggleWindow.bind(this))
    }

    /**
     * Adds event listener for submiting recipe upload form
     * @param {function} handler Upload handler function 
     * @author Marko Šterk
     */
    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);
            handler(data)
        })
    }

    /**
     * Clears parent element and inserts recipe upload form html to parent element
     * @author Marko Šterk
     */
    generateUploadForm() {
        this._clear();
        const markup = this._generateFormMarkup();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Generates recipe upload form html markup
     * @returns {string} HTML markup of recipe upload form
     * @author Marko Šterk
     */
    _generateFormMarkup() {
        return `
            <div class="upload__column">
                <h3 class="upload__heading">Recipe data</h3>
                <label>Title</label>
                <input placeholder="Recipe Title" required name="title" type="text" />
                <label>URL</label>
                <input placeholder="Recipe source URL" required name="sourceUrl" type="text" />
                <label>Image URL</label>
                <input placeholder="Recipe image URL" required name="image" type="text" />
                <label>Publisher</label>
                <input placeholder="Publisher name" required name="publisher" type="text" />
                <label>Prep time</label>
                <input placeholder="Meal preparation time (min)" required name="cookingTime" type="number" />
                <label>Servings</label>
                <input placeholder="Recipe servings (number)" required name="servings" type="number" />
            </div>

            <div class="upload__column">
                <h3 class="upload__heading">Ingredients</h3>
                <label>Ingredient 1</label>
                <input
                placeholder="quantity,unit,ingredient"
                type="text"
                required
                name="ingredient-1"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 2</label>
                <input
                placeholder="quantity,unit,ingredient"
                type="text"
                name="ingredient-2"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 3</label>
                <input
                placeholder="quantity,unit,ingredient"
                type="text"
                name="ingredient-3"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 4</label>
                <input
                placeholder="quantity,unit,ingredient"
                type="text"
                name="ingredient-4"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 5</label>
                <input
                placeholder="quantity,unit,ingredient"
                type="text"
                name="ingredient-5"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
                <label>Ingredient 6</label>
                <input
                placeholder="quantity,unit,ingredient"
                type="text"
                name="ingredient-6"
                placeholder="Format: 'Quantity,Unit,Description'"
                />
            </div>

            <button class="btn upload__btn">
                <svg>
                <use href="src/img/icons.svg#icon-upload-cloud"></use>
                </svg>
                <span>Upload</span>
            </button>
        `;
    }
}

export default new AddRecipeView();