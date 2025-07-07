document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Halaman ---
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');

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

    // --- Logika Sidebar dan Pencarian ---
    if(menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('show'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); });
    }
    
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.movie-item').forEach(item => {
                const titleElement = item.querySelector('.movie-title');
                if (titleElement) {
                     item.style.display = titleElement.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
                }
            });
        });
    }

    // --- Logika Menu Negara (DENGAN UPGRADE UNTUK MULTI-NEGARA) ---
    const countryMenuToggle = document.getElementById('country-menu-toggle');
    const countrySubmenu = document.getElementById('country-submenu');

    async function populateCountryMenu() {
        if (!countrySubmenu) return;
        try {
            const response = await fetch('movies.json');
            const data = await response.json();
            
            // UPGRADE: Gunakan flatMap untuk mengambil semua negara dari dalam array
            const allCountries = data.flatMap(item => item.country);
            const uniqueCountries = [...new Set(allCountries)].sort();
            
            countrySubmenu.innerHTML = ''; 
            uniqueCountries.forEach(country => {
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
            if (event.target.closest('#country-submenu')) {
                return;
            }
            event.preventDefault();
            countryMenuToggle.classList.toggle('active');
        });
        populateCountryMenu();
    }
});
