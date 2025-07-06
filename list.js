document.addEventListener('DOMContentLoaded', () => {
    const listGrid = document.getElementById('list-grid'), listTitle = document.getElementById('list-title'), paginationControls = document.getElementById('pagination-controls');
    if (!listGrid || !listTitle || !paginationControls) { return console.error('Elemen penting tidak ditemukan di list.html!'); }
    const ITEMS_PER_PAGE = 20;

    function createContentItem(item) { /* ... fungsi sama seperti di script.js ... */ return itemElement; }
    function setupPagination(totalItems, currentPage, type) { /* ... fungsi pagination ... */ }

    async function loadContent() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type') || 'movie';
        const page = parseInt(params.get('page')) || 1;
        document.title = `Daftar ${type === 'movie' ? 'Film' : 'Series'} - Halaman ${page} | BroFlix`;
        listTitle.innerHTML = `<i class="fa-solid fa-${type === 'movie' ? 'film' : 'tv'}"></i> Semua ${type === 'movie' ? 'Film' : 'Serial TV'}`;
        try {
            const response = await fetch('movies.json');
            const allContent = await response.json();
            const filtered = allContent.filter(item => item.type === type);
            const start = (page - 1) * ITEMS_PER_PAGE, end = start + ITEMS_PER_PAGE;
            const contentForPage = filtered.slice(start, end);
            listGrid.innerHTML = '';
            if (contentForPage.length === 0) { return listGrid.innerHTML = `<p>Tidak ada konten ditemukan.</p>`; }
            contentForPage.forEach(item => listGrid.appendChild(createContentItem(item)));
            setupPagination(filtered.length, page, type);
        } catch (error) { console.error('Gagal memuat list:', error); listGrid.innerHTML = `<p>Gagal memuat data.</p>`; }
    }
    loadContent();
});
