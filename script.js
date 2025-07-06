document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');
    
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');

    // Toggle Sidebar
    if(menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // Fungsi untuk membuat elemen item film/series
    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.dataset.title = item.title.toLowerCase();

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

    // Fungsi utama untuk memuat dan menampilkan data di halaman utama
    async function fetchAndDisplayHomepageContent() {
        try {
            const response = await fetch('movies.json');
            const data = await response.json();
            
            const movies = data.filter(item => item.type === 'movie');
            const series = data.filter(item => item.type === 'series');

            if(moviesGrid) moviesGrid.innerHTML = '';
            if(seriesGrid) seriesGrid.innerHTML = '';

            // Tampilkan maksimal 10 film
            movies.slice(0, 10).forEach(movie => {
                if(moviesGrid) moviesGrid.appendChild(createContentItem(movie));
            });

            // Tampilkan maksimal 10 series
            series.slice(0, 10).forEach(serie => {
                if(seriesGrid) seriesGrid.appendChild(createContentItem(serie));
            });

        } catch (error) {
            console.error('Gagal memuat konten:', error);
            if(moviesGrid) moviesGrid.innerHTML = '<p>Gagal memuat film.</p>';
            if(seriesGrid) seriesGrid.innerHTML = '<p>Gagal memuat series.</p>';
        }
    }

    // Fungsi pencarian
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const allContentItems = document.querySelectorAll('.movie-item');
            
            allContentItems.forEach(item => {
                const parentSection = item.closest('.movie-category');
                if (item.dataset.title.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
                
                // Sembunyikan judul seksi jika semua item di dalamnya tersembunyi
                const visibleItems = parentSection.querySelectorAll('.movie-item[style*="display: flex"]');
                if (visibleItems.length === 0) {
                    parentSection.querySelector('.section-header').style.display = 'none';
                } else {
                     parentSection.querySelector('.section-header').style.display = 'flex';
                }
            });
        });
    }

    // Jalankan fungsi jika di halaman yang benar
    if (moviesGrid && seriesGrid) {
        fetchAndDisplayHomepageContent();
    }
});
