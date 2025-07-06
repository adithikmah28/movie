document.addEventListener('DOMContentLoaded', () => {
    const listGrid = document.getElementById('list-grid');
    const listTitle = document.getElementById('list-title');
    const paginationControls = document.getElementById('pagination-controls');

    const ITEMS_PER_PAGE = 20;

    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.innerHTML = `
            <div class="movie-poster">
                <img src="${item.poster}" alt="${item.title}">
                <div class="quality-tag quality-${item.quality.toLowerCase()}">${item.quality}</div>
                <div class="rating">
                    <span class="rating-star">⭐</span>
                    <span>${item.rating.toFixed(1)}</span>
                </div>
            </div>
            <p class="movie-title">${item.title} (${item.year})</p>
        `;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => {
            window.location.href = `stream.html?id=${item.id}`;
        });
        return itemElement;
    }

    function setupPagination(totalItems, currentPage, type) {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = `list.html?type=${type}&page=${i}`;
            pageLink.textContent = i;
            pageLink.classList.add('page-item');
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            paginationControls.appendChild(pageLink);
        }
    }

    async function loadContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type') || 'movie';
        const currentPage = parseInt(urlParams.get('page')) || 1;

        document.title = `Daftar ${type === 'movie' ? 'Film' : 'Series'} - Halaman ${currentPage} | BroFlix`;
        listTitle.innerHTML = `<i class="fa-solid fa-${type === 'movie' ? 'film' : 'tv'}"></i> Semua ${type === 'movie' ? 'Film' : 'Serial TV'}`;
        
        try {
            const response = await fetch('movies.json');
            const allContent = await response.json();

            const filteredContent = allContent.filter(item => item.type === type);
            
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const contentForPage = filteredContent.slice(startIndex, endIndex);

            listGrid.innerHTML = '';
            if (contentForPage.length === 0) {
                listGrid.innerHTML = `<p>Tidak ada konten yang ditemukan.</p>`;
                return;
            }

            contentForPage.forEach(item => {
                listGrid.appendChild(createContentItem(item));
            });

            setupPagination(filteredContent.length, currentPage, type);

        } catch (error) {
            console.error('Gagal memuat list konten:', error);
            listGrid.innerHTML = `<p>Terjadi kesalahan saat memuat data.</p>`;
        }
    }

    loadContent();
});
