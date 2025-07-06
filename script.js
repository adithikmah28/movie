document.addEventListener('DOMContentLoaded', () => {
    // === Elemen Dropdown Custom ===
    const genreDropdown = document.getElementById('genre-dropdown');
    const countryDropdown = document.getElementById('country-dropdown');
    const genreMenu = document.getElementById('genre-menu');
    const countryMenu = document.getElementById('country-menu');
    const gridTitle = document.getElementById('grid-title');
    const allMoviesGrid = document.getElementById('all-movies-grid');

    let allMovies = [];
    let currentGenre = 'all';
    let currentCountry = 'all';

    // Ambil data film
    async function fetchMovies() {
        try {
            const response = await fetch('movies.json');
            allMovies = await response.json();
            populateFilters();
            displayMovies(allMovies);
        } catch (error) {
            console.error('Error saat fetchMovies:', error);
        }
    }

    // Mengisi menu dropdown custom
    function populateFilters() {
        const genres = new Set();
        const countries = new Set();
        allMovies.forEach(movie => {
            movie.genre.forEach(g => genres.add(g));
            countries.add(movie.country);
        });

        // Tambah opsi "Semua"
        genreMenu.innerHTML = '<a class="dropdown-item active" data-value="all">Semua Genre</a>';
        countryMenu.innerHTML = '<a class="dropdown-item active" data-value="all">Semua Negara</a>';

        // Urutkan dan isi opsi lainnya
        [...genres].sort().forEach(genre => {
            genreMenu.innerHTML += `<a class="dropdown-item" data-value="${genre}">${genre}</a>`;
        });
        [...countries].sort().forEach(country => {
            countryMenu.innerHTML += `<a class="dropdown-item" data-value="${country}">${country}</a>`;
        });
    }

    // Menampilkan film ke grid
    function displayMovies(moviesToDisplay) {
        allMoviesGrid.innerHTML = '';
        moviesToDisplay.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `
                <div class="movie-poster">
                    <img src="${movie.poster}" alt="${movie.title}">
                    <div class="quality-tag quality-${movie.quality.toLowerCase()}">${movie.quality}</div>
                    <div class="rating"><span class="rating-star">⭐</span><span>${movie.rating.toFixed(1)}</span></div>
                </div>
                <p class="movie-title">${movie.title}</p>
            `;
            movieItem.querySelector('.movie-poster').addEventListener('click', () => {
                window.location.href = `stream.html?id=${movie.id}`;
            });
            allMoviesGrid.appendChild(movieItem);
        });
    }

    // Logika untuk filter
    function applyFilters() {
        const filteredMovies = allMovies.filter(movie => {
            const genreMatch = currentGenre === 'all' || movie.genre.includes(currentGenre);
            const countryMatch = currentCountry === 'all' || movie.country === currentCountry;
            return genreMatch && countryMatch;
        });
        
        // Update judul grid
        if (currentGenre !== 'all' || currentCountry !== 'all') {
            let title = `Film ${currentGenre !== 'all' ? currentGenre : ''} ${currentCountry !== 'all' ? 'dari ' + currentCountry : ''}`;
            gridTitle.textContent = title.trim();
        } else {
            gridTitle.textContent = 'Semua Film';
        }

        displayMovies(filteredMovies);
    }

    // === Logika untuk Buka/Tutup & Pilih Dropdown ===
    function handleDropdownClick(dropdown, menu) {
        // Tutup dropdown lain jika ada yang terbuka
        if (dropdown.id === 'genre-dropdown' && countryDropdown.querySelector('.dropdown-menu').classList.contains('show')) {
            countryDropdown.querySelector('.dropdown-menu').classList.remove('show');
        } else if (dropdown.id === 'country-dropdown' && genreDropdown.querySelector('.dropdown-menu').classList.contains('show')) {
            genreDropdown.querySelector('.dropdown-menu').classList.remove('show');
        }
        menu.classList.toggle('show');
    }

    function handleOptionSelect(menu, event) {
        if (event.target.classList.contains('dropdown-item')) {
            // Update filter value
            const selectedValue = event.target.getAttribute('data-value');
            if (menu.id === 'genre-menu') {
                currentGenre = selectedValue;
            } else {
                currentCountry = selectedValue;
            }

            // Hapus kelas 'active' dari semua item dan tambahkan ke yang diklik
            menu.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
            event.target.classList.add('active');

            // Tutup menu dan jalankan filter
            menu.classList.remove('show');
            applyFilters();
        }
    }

    // Pasang event listener
    genreDropdown.querySelector('.dropdown-toggle').addEventListener('click', () => handleDropdownClick(genreDropdown, genreMenu));
    countryDropdown.querySelector('.dropdown-toggle').addEventListener('click', () => handleDropdownClick(countryDropdown, countryMenu));
    genreMenu.addEventListener('click', (e) => handleOptionSelect(genreMenu, e));
    countryMenu.addEventListener('click', (e) => handleOptionSelect(countryMenu, e));

    // Tutup dropdown jika klik di luar
    window.addEventListener('click', (e) => {
        if (!genreDropdown.contains(e.target)) {
            genreMenu.classList.remove('show');
        }
        if (!countryDropdown.contains(e.target)) {
            countryMenu.classList.remove('show');
        }
    });

    // Mulai semuanya
    fetchMovies();
});
