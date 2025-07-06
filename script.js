document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMEN BARU UNTUK MENU & PENCARIAN ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');

    // Elemen lama (Sama seperti sebelumnya)
    const categoryGrids = {
        trending: document.getElementById('trending-movies'),
        action: document.getElementById('action-movies'),
        comedy: document.getElementById('comedy-movies'),
        drama: document.getElementById('drama-movies'),
    };
    const modal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-movie-title');
    const videoPlayer = document.getElementById('video-player');
    const closeButton = document.querySelector('.close-button');
    
    let allMovies = []; // Simpan semua film di sini untuk pencarian

    // --- LOGIKA UNTUK SIDEBAR MENU ---
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });

    // Ambil data film
    async function fetchMovies() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Gagal memuat data film!');
            allMovies = await response.json(); // Simpan data ke variabel global
            displayMovies(allMovies);
        } catch (error) {
            console.error(error);
        }
    }

    // --- FUNGSI displayMovies DI-UPDATE TOTAL ---
    function displayMovies(moviesToDisplay) {
        // Bersihkan semua grid
        Object.values(categoryGrids).forEach(grid => {
            if (grid) grid.innerHTML = '';
        });

        moviesToDisplay.forEach(movie => {
            // Membuat container utama untuk setiap film
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            // Simpan judul untuk pencarian, dalam huruf kecil agar tidak case-sensitive
            movieItem.dataset.title = movie.title.toLowerCase();

            // Isi container dengan poster dan judul
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
            
            // Tambahkan event listener ke poster untuk membuka modal
            const posterElement = movieItem.querySelector('.movie-poster');
            posterElement.addEventListener('click', () => {
                openModal(movie.title, movie.videoUrl);
            });
            
            // Masukkan ke grid kategori yang benar
            if (categoryGrids[movie.category]) {
                categoryGrids[movie.category].appendChild(movieItem);
            }
        });
    }

    // --- LOGIKA PENCARIAN FILM ---
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


    // Fungsi Modal (Sama seperti sebelumnya)
    function openModal(title, videoUrl) { /* ... tidak berubah ... */ }
    function closeModal() { /* ... tidak berubah ... */ }
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target == modal) closeModal(); });

    // Panggil fungsi utama
    fetchMovies();
});
