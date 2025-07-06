document.addEventListener('DOMContentLoaded', () => {
    // Definisi variabel (Sama seperti sebelumnya)
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

    // --- FUNGSI BARU UNTUK MEMBUAT BINTANG RATING ---
    function generateStars(rating) {
        const totalStars = 5;
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Bintang Penuh
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }
        // Bintang Setengah (jika ada)
        if (hasHalfStar) {
            // Kita tetap pakai ★ untuk simple, tapi bisa diganti icon lain jika mau
            // Untuk simple, kita bulatkan ke atas saja.
        }
        // Bintang Kosong
        const emptyStars = totalStars - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '☆';
        }

        // Simplifikasi: 4.2 -> ★★★★☆, 4.8 -> ★★★★★
        let simpleStars = '';
        for(let i = 1; i <= 5; i++) {
            simpleStars += (i <= Math.round(rating)) ? '★' : '☆';
        }
        return simpleStars;
    }

    async function fetchMovies() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Gagal memuat data film!');
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error(error);
        }
    }

    // --- FUNGSI displayMovies DI-UPDATE ---
    function displayMovies(movies) {
        // Bersihkan semua grid
        Object.values(categoryGrids).forEach(grid => {
            if (grid) grid.innerHTML = '';
        });

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-poster');

            // Membuat HTML untuk poster dengan overlay
            movieElement.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="quality-tag quality-${movie.quality.toLowerCase()}">${movie.quality}</div>
                <div class="rating">${generateStars(movie.rating)}</div>
            `;
            
            // Simpan data untuk modal
            movieElement.dataset.videoUrl = movie.videoUrl;
            movieElement.dataset.title = movie.title;

            // Event listener untuk membuka modal
            movieElement.addEventListener('click', () => {
                openModal(movie.title, movie.videoUrl);
            });
            
            // Masukkan ke grid yang sesuai
            if (categoryGrids[movie.category]) {
                categoryGrids[movie.category].appendChild(movieElement);
            }
        });
    }

    // Fungsi modal (Sama seperti sebelumnya)
    function openModal(title, videoUrl) {
        modalTitle.textContent = title;
        videoPlayer.src = videoUrl;
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.src = '';
    }

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    // Panggil fungsi utama
    fetchMovies();
});
