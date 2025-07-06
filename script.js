document.addEventListener('DOMContentLoaded', () => {
    // Definisi elemen, pastikan ID ini semua ada di index.html
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');

    const categoryGrids = {
        trending: document.getElementById('trending-movies'),
        action: document.getElementById('action-movies'),
        comedy: document.getElementById('comedy-movies'),
        drama: document.getElementById('drama-movies'),
    };
    
    let allMovies = [];

    // Logika untuk Sidebar Menu
    // Jika menuToggle null, baris ini akan error dan script berhenti
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });
    }

    if(overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // Ambil data film
    async function fetchMovies() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Gagal memuat movies.json');
            allMovies = await response.json();
            displayMovies(allMovies);
        } catch (error) {
            console.error('Error saat fetchMovies:', error);
            // Tampilkan pesan error di halaman jika film gagal dimuat
            document.querySelector('main').innerHTML = '<h2 style="text-align:center;">Gagal memuat film. Cek file movies.json atau koneksi.</h2>';
        }
    }

    // Fungsi untuk menampilkan film
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
            
            const posterElement = movieItem.querySelector('.movie-poster');
            posterElement.addEventListener('click', () => {
                window.location.href = `stream.html?id=${movie.id}`;
            });
            
            if (categoryGrids[movie.category]) {
                categoryGrids[movie.category].appendChild(movieItem);
            }
        });
    }

    // Logika Pencarian
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const allMovieItems = document.querySelectorAll('.movie-item');

            allMovieItems.forEach(item => {
                const title = item.dataset.title;
                if (title.includes(searchTerm)) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    }

    // Panggil fungsi utama untuk memulai semuanya
    fetchMovies();
});
