import View from './View';
import icons from '../../img/icons.svg'; // Parcel 1

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    /**
     * Adds event listener to pagination buttons
     * @param {function} handler Handler function for click event on pagination button
     * @author Marko Šterk
     */
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

    /**
     * GEnerates html string for pagination buttons
     * @returns {string} html markup string for pagination buttons
     * @author Marko Šterk
     */
    _generateMarkup() {
        const currentPage = this._data.page
        const numPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );
        // Page 1, and there are other pages
        if(currentPage === 1 && numPages > 1){
            return `
            <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }

        // Last page
        if(currentPage === numPages && numPages > 1) {
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
            `;
        }

        // Other page
        if(currentPage > 1 && currentPage < numPages) {
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>

                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }

        // Page 1, and there are NO other pages
        return '';
    }
}

export default new PaginationView()