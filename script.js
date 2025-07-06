document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');
    
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');

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

    async function fetchAndDisplayHomepageContent() {
        if (!moviesGrid || !seriesGrid) {
            console.error("Elemen 'movies-grid' atau 'series-grid' tidak ditemukan. Pastikan ID di index.html sudah benar.");
            return;
        }

        try {
            const response = await fetch('movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            const movies = data.filter(item => item.type === 'movie');
            const series = data.filter(item => item.type === 'series');

            moviesGrid.innerHTML = '';
            seriesGrid.innerHTML = '';

            movies.slice(0, 10).forEach(movie => {
                moviesGrid.appendChild(createContentItem(movie));
            });

            series.slice(0, 10).forEach(serie => {
                seriesGrid.appendChild(createContentItem(serie));
            });

        } catch (error) {
            console.error('Gagal memuat atau menampilkan konten:', error);
            moviesGrid.innerHTML = '<p>Gagal memuat film. Cek console (F12) untuk detail error.</p>';
            seriesGrid.innerHTML = '<p>Gagal memuat series. Cek console (F12) untuk detail error.</p>';
        }
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.movie-item').forEach(item => {
                if (item.dataset.title.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    fetchAndDisplayHomepageContent();
});
