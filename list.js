document.addEventListener('DOMContentLoaded', () => {
    const listGrid = document.getElementById('list-grid');
    const listTitle = document.getElementById('list-title');
    const paginationControls = document.getElementById('pagination-controls');
    const listSearchInput = document.getElementById('list-search-input');
    const ITEMS_PER_PAGE = 20;
    let allData = [];

    function createContentItem(item) { /* ... sama seperti script.js ... */ }
    function setupPagination(totalItems, currentPage, params) { /* ... sama seperti sebelumnya ... */ }

    function displayContent(content, currentPage, params) {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        listGrid.innerHTML = '';
        if (content.length === 0) {
            listGrid.innerHTML = `<p style="color: #ccc; grid-column: 1 / -1;">Tidak ada konten yang ditemukan.</p>`;
        } else {
            content.slice(startIndex, endIndex).forEach(item => listGrid.appendChild(createContentItem(item)));
        }
        setupPagination(content.length, currentPage, params);
    }

    async function loadAndFilterContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type'), country = urlParams.get('country'), search = urlParams.get('search');
        const currentPage = parseInt(urlParams.get('page')) || 1;

        // ... logika judul ...
        
        try {
            const response = await fetch('movies.json');
            allData = await response.json();
            let filteredContent = allData;
            if (search) filteredContent = allData.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
            else if (country) filteredContent = allData.filter(item => item.country === country);
            else if (type) filteredContent = allData.filter(item => item.type === type);
            
            displayContent(filteredContent, currentPage, urlParams);
        } catch (error) { console.error('Gagal memuat list:', error); }
    }
    
    loadAndFilterContent();

    // ... sisa fungsi dan event listener ...
});
