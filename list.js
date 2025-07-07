document.addEventListener('DOMContentLoaded', () => {
    const listGrid = document.getElementById('list-grid');
    const listTitle = document.getElementById('list-title');
    const paginationControls = document.getElementById('pagination-controls');
    const listSearchInput = document.getElementById('list-search-input');
    if (!listGrid || !listTitle || !paginationControls) return;
    const ITEMS_PER_PAGE = 20;

    // ... (fungsi createContentItem dan setupPagination tetap sama) ...
    
    async function loadAndFilterContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const country = urlParams.get('country');
        const genre = urlParams.get('genre'); // Parameter baru
        const search = urlParams.get('search');
        const currentPage = parseInt(urlParams.get('page')) || 1;

        let pageTitle = "Daftar Konten";
        // Logika judul yang lebih pintar
        if (search) { pageTitle = `Hasil untuk "${search}"`; } 
        else if (country && genre) { pageTitle = `Film ${genre} dari ${country}`; }
        else if (country) { pageTitle = `Film & Series dari ${country}`; }
        else if (type) { pageTitle = `Semua ${type === 'movie' ? 'Film' : 'Serial TV'}`; }
        listTitle.innerHTML = `<i class="fa-solid fa-film"></i> ${pageTitle}`;
        document.title = `${pageTitle} | BroFlix`;
        
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Gagal fetch');
            const allData = await response.json();
            
            let filteredContent = allData;

            // Logika filter berantai
            if (search) { filteredContent = filteredContent.filter(item => item.title.toLowerCase().includes(search.toLowerCase())); }
            if (country) { filteredContent = filteredContent.filter(item => item.country === country); }
            if (genre) { filteredContent = filteredContent.filter(item => item.genre.includes(genre)); }
            if (type) { filteredContent = filteredContent.filter(item => item.type === type); }
            
            // ... (sisa kode untuk display dan pagination) ...
            
        } catch (error) {
            console.error('Gagal memuat list konten:', error);
            listGrid.innerHTML = `<p>Gagal memuat data.</p>`;
        }
    }
    
    // ... (sisa kode list.js) ...
    loadAndFilterContent();
});
