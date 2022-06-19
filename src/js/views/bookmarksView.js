import View from './View';
import previewView from './previewView';
import icons from '../../img/icons.svg'; // Parcel 1

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. FInd a nice recipe and bookmark it.';
    _message = '';

    /**
     * Adds load event listener to bookmarks
     * @param {function} handler Handler function 
     * @returns {undefined} NOthing is returned
     * @author Marko Šterk
     */
    addHanlerRender(handler) {
        window.addEventListener('load', handler)
    }

    /**
     * Generates bookmarks
     * @returns {string} html string for bookmark elements
     * @author Marko Šterk
     */
    _generateMarkup() {
        return this._data.map(
            bookmark => previewView.render(bookmark, false)
            ).join('');
    }
}

export default new BookmarksView();