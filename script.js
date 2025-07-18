document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Halaman Utama ---
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');
    const indonesiaMoviesGrid = document.getElementById('indonesia-movies-grid');
    
    // --- Elemen Navigasi ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const headerSearchForm = document.getElementById('header-search-form');
    const headerSearchInput = document.getElementById('header-search-input');
    const countryMenuToggle = document.getElementById('country-menu-toggle');
    const countrySubmenu = document.getElementById('country-submenu');

    // --- Fungsi Bantuan ---
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
            <p class="movie-title">${item.title} (${item.year})</p>`;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => { window.location.href = `stream.html?id=${item.id}`; });
        return itemElement;
    }

    // --- Fungsi Utama untuk Mengisi Halaman ---
    async function initializePage() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const movies = data.filter(item => item.type === 'movie');
            const series = data.filter(item => item.type === 'series');
            const indonesiaMovies = data.filter(item => item.country === 'Indonesia');
            
            if (moviesGrid) { moviesGrid.innerHTML = ''; movies.slice(0, 10).forEach(movie => moviesGrid.appendChild(createContentItem(movie))); }
            if (seriesGrid) { seriesGrid.innerHTML = ''; series.slice(0, 10).forEach(serie => seriesGrid.appendChild(createContentItem(serie))); }
            
            const indonesiaSection = document.getElementById('indonesia-movies-section');
            if (indonesiaMoviesGrid && indonesiaMovies.length > 0) {
                indonesiaMoviesGrid.innerHTML = '';
                indonesiaMovies.slice(0, 10).forEach(movie => indonesiaMoviesGrid.appendChild(createContentItem(movie)));
            } else if (indonesiaSection) {
                indonesiaSection.classList.add('hide');
            }
        } catch (error) {
            console.error('Gagal memuat konten utama:', error);
        }
    }

    // Panggil fungsi hanya jika kita di halaman utama
    if (moviesGrid || seriesGrid || indonesiaMoviesGrid) {
        initializePage();
    }
    
    // --- LOGIKA YANG MEMPERBAIKI SEMUA NAVIGASI ---

    // 1. Sidebar Menu (Titik Tiga)
    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // 2. Header Search
    if (headerSearchForm) {
        headerSearchForm.addEventListener('submit', e => {
            e.preventDefault();
            const searchTerm = headerSearchInput.value.trim();
            if (searchTerm) window.location.href = `list.html?search=${encodeURIComponent(searchTerm)}`;
        });
    }

    // 3. Menu Negara di Sidebar
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
            countrySubmenu.innerHTML = `<li><a href="#">Gagal</a></li>`;
        }
    }

    if (countryMenuToggle) {
        countryMenuToggle.addEventListener('click', event => {
            // Cek jika yang diklik adalah link di dalam submenu, biarkan berfungsi normal
            if (event.target.closest('.submenu')) {
                return;
            }
            // Jika yang diklik adalah menu utamanya, baru buka/tutup
            event.preventDefault();
            countryMenuToggle.classList.toggle('active');
        });
        populateCountryMenu();
    }
});
