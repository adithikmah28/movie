document.addEventListener('DOMContentLoaded', () => {
    const listGrid = document.getElementById('list-grid');
    const listTitle = document.getElementById('list-title');
    const paginationControls = document.getElementById('pagination-controls');
    const listSearchInput = document.getElementById('list-search-input');
    const ITEMS_PER_PAGE = 20;
    let allData = [];

    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        // KODE YANG DIPERBAIKI: Mengembalikan semua elemen ke dalam poster
        itemElement.innerHTML = `
            <div class="movie-poster">
                <img src="${item.poster}" alt="${item.title}">
                <div class="quality-tag quality-${item.quality.toLowerCase()}">${item.quality}</div>
                <div class="rating">
                    <span class="rating-star">⭐</span>
                    <span>${item.rating.toFixed(1)}</span>
                </div>
            </div>
            <p class="movie-title">${item.title} (${item.year})</p>`;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => { window.location.href = `stream.html?id=${item.id}`; });
        return itemElement;
    }
    
    // ... sisa kode list.js tetap sama ...
    
    function setupPagination(totalItems, currentPage, params) { /* ... */ }
    function displayContent(content, currentPage, params) { /* ... */ }
    async function loadAndFilterContent() { /* ... */ }
    loadAndFilterContent();
    if (listSearchInput) { /* ... */ }
});
