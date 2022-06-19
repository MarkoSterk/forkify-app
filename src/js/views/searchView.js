import View from './View';

class SearchView extends View{
    _parentElement = document.querySelector('.search');

    /**
     * Gets and returns search query string from search bar element
     * @returns {string} Search query string
     * @author Marko Šterk
     */
    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    /**
     * Clears search bar element input
     * @returns {undefined} Nothing is returned
     * @author Marko Šterk
     */
    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    /**
     * Adds event listener for submit event to search bar element
     * @param {function} handler handler function for submit search 
     * @author Marko Šterk
     */
    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();