import View from './View';
import previewView from './previewView';
import icons from '../../img/icons.svg'; // Parcel 1

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query. Please try again.';
    _message = '';

    /**
     * Generates html markup for search results elements
     * @returns {string} html string for search results elements
     * @author Marko Šterk
     */
    _generateMarkup() {
        return this._data.map(
            result => previewView.render(result, false)
            ).join('');
    }
}

export default new ResultsView();
