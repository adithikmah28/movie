document.addEventListener('DOMContentLoaded', () => {
    const listGrid = document.getElementById('list-grid');
    const listTitle = document.getElementById('list-title');
    const paginationControls = document.getElementById('pagination-controls');

    // Jika elemen penting tidak ditemukan, hentikan skrip
    if (!listGrid || !listTitle || !paginationControls) {
        console.error('Elemen penting (list-grid, list-title, atau pagination-controls) tidak ditemukan di list.html!');
        if (listTitle) listTitle.textContent = 'Error: Elemen halaman tidak lengkap.';
        return;
    }

    const ITEMS_PER_PAGE = 20;

    // FUNGSI YANG HILANG SEBELUMNYA - MEMBUAT POSTER FILM
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

    // FUNGSI YANG HILANG SEBELUMNYA - MEMBUAT TOMBOL HALAMAN
    function setupPagination(totalItems, currentPage, type) {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return; // Tidak perlu pagination jika hanya 1 halaman

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

    // Fungsi utama untuk memuat data
    async function loadContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type') || 'movie';
        const currentPage = parseInt(urlParams.get('page')) || 1;

        document.title = `Daftar ${type === 'movie' ? 'Film' : 'Series'} - Halaman ${currentPage} | BroFlix`;
        listTitle.innerHTML = `<i class="fa-solid fa-${type === 'movie' ? 'film' : 'tv'}"></i> Semua ${type === 'movie' ? 'Film' : 'Serial TV'}`;
        
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error(`Gagal fetch: ${response.statusText}`);
            
            const allContent = await response.json();
            const filteredContent = allContent.filter(item => item.type === type);
            
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const contentForPage = filteredContent.slice(startIndex, endIndex);

            listGrid.innerHTML = '';
            if (contentForPage.length === 0) {
                listGrid.innerHTML = `<p style="color: #ccc; grid-column: 1 / -1;">Tidak ada konten yang ditemukan untuk kategori ini.</p>`;
                return;
            }

            // Bagian ini sekarang akan berjalan dengan benar
            contentForPage.forEach(item => {
                listGrid.appendChild(createContentItem(item));
            });

            // Bagian ini juga akan berjalan dengan benar
            setupPagination(filteredContent.length, currentPage, type);

        } catch (error) {
            console.error('Gagal memuat list konten:', error);
            listGrid.innerHTML = `<p style="color: #ccc; grid-column: 1 / -1;">Gagal memuat data.</p>`;
        }
    }

    loadContent();
});
