document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Halaman ---
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input'); // Tetap sama, karena ID tidak berubah

    // --- Fungsi Bantuan ---
    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.innerHTML = `<div class="movie-poster"><img src="${item.poster}" alt="${item.title}"><div class="quality-tag quality-${item.quality.toLowerCase()}">${item.quality}</div><div class="rating"><span class="rating-star">⭐</span><span>${item.rating.toFixed(1)}</span></div></div><p class="movie-title">${item.title} (${item.year})</p>`;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => { window.location.href = `stream.html?id=${item.id}`; });
        return itemElement;
    }

    // --- Fungsi Utama untuk Mengisi Halaman ---
    async function initializePage() {
        try {
            const response = await fetch('movies.json');
            const data = await response.json();

            // 1. Tampilkan Film dan Series di Halaman Utama
            const movies = data.filter(item => item.type === 'movie');
            const series = data.filter(item => item.type === 'series');
            if (moviesGrid) { moviesGrid.innerHTML = ''; movies.slice(0, 10).forEach(movie => moviesGrid.appendChild(createContentItem(movie))); }
            if (seriesGrid) { seriesGrid.innerHTML = ''; series.slice(0, 10).forEach(serie => seriesGrid.appendChild(createContentItem(serie))); }
        } catch (error) {
            console.error('Gagal memuat konten halaman:', error);
            if (moviesGrid) moviesGrid.innerHTML = '<p>Gagal memuat film.</p>';
            if (seriesGrid) seriesGrid.innerHTML = '<p>Gagal memuat series.</p>';
        }
    }
    
    if (moviesGrid && seriesGrid) {
        initializePage();
    }

    // --- Logika Sidebar, Pencarian, dan Menu Negara ---
    if(menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('show'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); });
    }
    
    // Logika Pencarian (bekerja untuk search bar di header)
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            // Pencarian ini akan menyembunyikan/menampilkan film di halaman utama
            document.querySelectorAll('.movie-item').forEach(item => {
                const titleElement = item.querySelector('.movie-title');
                if (titleElement) {
                     item.style.display = titleElement.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
                }
            });
        });
    }

    // Logika untuk Menu Negara (kembali ke sidebar)
    const countryMenuToggle = document.getElementById('country-menu-toggle');
    const countrySubmenu = document.getElementById('country-submenu');

    async function populateCountryMenu() {
        if (!countrySubmenu) return;
        try {
            const response = await fetch('movies.json');
            const data = await response.json();
            const countries = [...new Set(data.map(item => item.country))].sort();
            
            countrySubmenu.innerHTML = ''; 
            countries.forEach(country => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="list.html?country=${encodeURIComponent(country)}">${country}</a>`;
                countrySubmenu.appendChild(li);
            });
        } catch (error) {
            console.error('Gagal memuat daftar negara:', error);
            countrySubmenu.innerHTML = '<li><a href="#">Gagal memuat</a></li>';
        }
    }

    if (countryMenuToggle) {
        countryMenuToggle.addEventListener('click', (event) => {
            event.preventDefault();
            countryMenuToggle.classList.toggle('active');
        });
        populateCountryMenu();
    }
});
