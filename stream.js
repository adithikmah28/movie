document.addEventListener('DOMContentLoaded', () => {
    // === DEFINISI SEMUA ELEMEN ===
    const videoPlayer = document.getElementById('video-player');
    const movieTitleElement = document.getElementById('stream-movie-title');
    const adOverlay = document.getElementById('ad-overlay');
    const adLink = document.getElementById('ad-link');
    
    // Elemen untuk detail film
    const detailQuality = document.getElementById('detail-quality');
    const detailGenre = document.getElementById('detail-genre');
    const detailActors = document.getElementById('detail-actors');
    const detailDirector = document.getElementById('detail-director');
    const detailCountry = document.getElementById('detail-country');

    // 1. Ambil ID film dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        movieTitleElement.textContent = "Film tidak ditemukan!";
        return;
    }

    // 2. Ambil data film dari JSON
    async function getMovieData() {
        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const movie = movies.find(m => m.id == movieId);

            if (movie) {
                // 3. Tampilkan semua data film
                movieTitleElement.textContent = movie.title;
                videoPlayer.src = movie.videoUrl;
                document.title = `Nonton ${movie.title} | BroFlix`;

                // Isi bagian detail film
                detailQuality.textContent = movie.quality;
                detailGenre.textContent = movie.genre.join(', '); // Gabungkan array dengan koma
                detailActors.textContent = movie.actors.join(', ');
                detailDirector.textContent = movie.director;
                detailCountry.textContent = movie.country;

                // Atur link iklan (JANGAN LUPA GANTI!)
                adLink.href = 'https://directlink.com/your-adsterra-id'; // <--- GANTI LINK INI

            } else {
                movieTitleElement.textContent = "Film tidak ditemukan!";
            }
        } catch (error) {
            console.error('Gagal memuat data film:', error);
            movieTitleElement.textContent = "Gagal memuat data.";
        }
    }

    // 4. LOGIKA IKLAN UNTUK NONTON
    adLink.addEventListener('click', (event) => {
        // Penting! Jangan langsung pindah halaman
        event.preventDefault(); 
        
        // Buka link iklan di tab baru
        window.open(adLink.href, '_blank');
        
        // Sembunyikan lapisan iklan
        adOverlay.style.display = 'none';
        
        // Mulai putar video secara otomatis
        videoPlayer.play();
    });

    // Panggil fungsi utama untuk memulai
    getMovieData();
});
