import icons from '../../img/icons.svg'; // Parcel 1

export default class View {
    _data;

    /**
     * Render the recieved pbject to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Marko Šterk
     */
    render(data, render = true) {
        if(!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();
        
        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * 
     * @param {Object[]} data New DOM elements
     * @returns {undefined} Updates only changed DOM elements
     * @this {Object} View instance
     * @author Marko Šterk
     */
    update(data){

        
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange()
                        .createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));
        
        newElements.forEach((newEl, i) => {
            const currEl = currentElements[i];
            //console.log(currEl, newEl.isEqualNode(currEl));
            
            //update changed TEXT only
            if(!newEl.isEqualNode(currEl) && 
                newEl.firstChild?.nodeValue.trim() !== ''
            ) {
                currEl.textContent = newEl.textContent;
            }

            //update changed ATTRIBUTES
            if(!newEl.isEqualNode(currEl))
                Array.from(newEl.attributes).forEach(attr => 
                    currEl.setAttribute(attr.name, attr.value)
                );     
        });
    }

    /**
     * Clears parent element HTML
     * @author Marko Šterk
     */
    _clear() {
        this._parentElement.innerHTML = '';
    }

    /**
     * Renders spinner in parent element
     * @author Marko Šterk
     */
    renderSpinner() {
        const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
        this._parentElement.innerHTML = '';
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Renders error message in parent element
     * @param {string | undefined} message Message to be displayed. Default is set in view instance
     * @author Marko Šterk
     */
    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Renders success message in parent element
     * @param {string | undefined} message Message to be displayed. Default is set in view instance
     * @author Marko Šterk
     */
    renderMessage(message = this._message) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}
