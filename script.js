document.addEventListener('DOMContentLoaded', () => {
    // Definisi elemen (Sama seperti sebelumnya)
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');
    const categoryGrids = { /* ... */ };
    let allMovies = [];

    // Logika Sidebar dan Fetch Movies (Sama seperti sebelumnya)
    menuToggle.addEventListener('click', () => { /* ... */ });
    overlay.addEventListener('click', () => { /* ... */ });
    async function fetchMovies() { /* ... */ }

    // --- FUNGSI displayMovies DI-UPDATE ---
    function displayMovies(moviesToDisplay) {
        Object.values(categoryGrids).forEach(grid => {
            if (grid) grid.innerHTML = '';
        });

        moviesToDisplay.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.dataset.title = movie.title.toLowerCase();

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
            
            // --- PERUBAHAN UTAMA ADA DI SINI ---
            const posterElement = movieItem.querySelector('.movie-poster');
            posterElement.addEventListener('click', () => {
                // Alihkan ke halaman streaming dengan menyertakan ID film di URL
                window.location.href = `stream.html?id=${movie.id}`;
            });
            
            if (categoryGrids[movie.category]) {
                categoryGrids[movie.category].appendChild(movieItem);
            }
        });
    }

    // Logika Pencarian (Sama seperti sebelumnya)
    searchInput.addEventListener('input', (e) => { /* ... */ });

    // HAPUS FUNGSI-FUNGSI INI KARENA SUDAH TIDAK DIPAKAI
    // function openModal(...) { ... }
    // function closeModal() { ... }
    // closeButton.addEventListener(...)
    // window.addEventListener('click', (event) => { if (event.target == modal) closeModal(); });

    // Panggil fungsi utama
    fetchMovies();
});
