document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Halaman Utama ---
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');

    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.innerHTML = `<div class="movie-poster"><img src="${item.poster}" alt="${item.title}"><div class="quality-tag quality-${item.quality.toLowerCase()}">${item.quality}</div><div class="rating"><span class="rating-star">⭐</span><span>${item.rating.toFixed(1)}</span></div></div><p class="movie-title">${item.title} (${item.year})</p>`;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => { window.location.href = `stream.html?id=${item.id}`; });
        return itemElement;
    }

    async function initializePage() {
        try {
            const response = await fetch('movies.json');
            const data = await response.json();
            // Tampilkan Film dan Series
            const movies = data.filter(item => item.type === 'movie');
            const series = data.filter(item => item.type === 'series');
            if (moviesGrid) { moviesGrid.innerHTML = ''; movies.slice(0, 10).forEach(movie => moviesGrid.appendChild(createContentItem(movie))); }
            if (seriesGrid) { seriesGrid.innerHTML = ''; series.slice(0, 10).forEach(serie => seriesGrid.appendChild(createContentItem(serie))); }
        } catch (error) {
            console.error('Gagal memuat konten:', error);
        }
    }
    
    if (moviesGrid || seriesGrid) {
        initializePage();
    }

    // --- Logika Sidebar ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if(menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('show'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); });
    }

    // --- Logika Header Search (pindah ke list.html) ---
    const headerSearchForm = document.getElementById('header-search-form');
    const headerSearchInput = document.getElementById('header-search-input');
    if (headerSearchForm) {
        headerSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = headerSearchInput.value.trim();
            if (searchTerm) {
                window.location.href = `list.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // --- Logika Menu Negara (kembali ke sidebar) ---
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
            countrySubmenu.innerHTML = '<li><a href="#">Gagal</a></li>';
        }
    }
    if (countryMenuToggle) {
        countryMenuToggle.addEventListener('click', (e) => { e.preventDefault(); countryMenuToggle.classList.toggle('active'); });
        populateCountryMenu();
    }
});
