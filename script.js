document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Baru ---
    const genreFilter = document.getElementById('genre-filter');
    const countryFilter = document.getElementById('country-filter');
    const allMoviesGrid = document.getElementById('all-movies-grid');

    // --- Elemen Lama ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    let allMovies = [];

    // Logika Sidebar (tidak berubah)
    if(menuToggle) { /* ... */ }
    if(overlay) { /* ... */ }

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

    // --- FUNGSI BARU: Mengisi Opsi Filter Secara Otomatis ---
    function populateFilters() {
        const genres = new Set();
        const countries = new Set();

        allMovies.forEach(movie => {
            movie.genre.forEach(g => genres.add(g));
            countries.add(movie.country);
        });

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
    }
    
    // --- FUNGSI BARU: Logika Filter ---
    function applyFilters() {
        const selectedGenre = genreFilter.value;
        const selectedCountry = countryFilter.value;

        const filteredMovies = allMovies.filter(movie => {
            const genreMatch = selectedGenre === 'all' || movie.genre.includes(selectedGenre);
            const countryMatch = selectedCountry === 'all' || movie.country === selectedCountry;
            return genreMatch && countryMatch;
        });

        displayMovies(filteredMovies);
    }
    
    // --- FUNGSI displayMovies DISEDERHANAKAN ---
    function displayMovies(moviesToDisplay) {
        allMoviesGrid.innerHTML = ''; // Bersihkan grid utama

        moviesToDisplay.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            // ... (kode untuk membuat poster tidak berubah)
            movieItem.innerHTML = `
                <div class="movie-poster">
                    <img src="${movie.poster}" alt="${movie.title}">
                    <div class="quality-tag quality-${movie.quality.toLowerCase()}">${movie.quality}</div>
                    <div class="rating">
                        <span class="rating-star">⭐</span>
                        <span>${movie.rating.toFixed(1)}</span>
                    </div>
                </div>
                <p class="movie-title">${movie.title}</p>
            `;
            const posterElement = movieItem.querySelector('.movie-poster');
            posterElement.addEventListener('click', () => {
                window.location.href = `stream.html?id=${movie.id}`;
            });
            allMoviesGrid.appendChild(movieItem);
        });
    }

    // Pasang Event Listener ke Filter
    genreFilter.addEventListener('change', applyFilters);
    countryFilter.addEventListener('change', applyFilters);

    // Panggil fungsi utama
    fetchMovies();
});
