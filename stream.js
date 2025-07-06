document.addEventListener('DOMContentLoaded', () => {
    // === DEFINISI ELEMEN ===
    const videoIframe = document.getElementById('video-iframe'); // <-- GANTI KE IFRAME
    const movieTitleElement = document.getElementById('stream-movie-title');
    const adOverlay = document.getElementById('ad-overlay');
    const adLink = document.getElementById('ad-link');
    
    // Elemen detail (tidak berubah)
    const detailQuality = document.getElementById('detail-quality');
    const detailGenre = document.getElementById('detail-genre');
    const detailActors = document.getElementById('detail-actors');
    const detailDirector = document.getElementById('detail-director');
    const detailCountry = document.getElementById('detail-country');

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        movieTitleElement.textContent = "Film tidak ditemukan!";
        return;
    }

    async function getMovieData() {
        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const movie = movies.find(m => m.id == movieId);

            if (movie) {
                // Tampilkan data
                movieTitleElement.textContent = movie.title;
                document.title = `Nonton ${movie.title} | BroFlix`;

                // Set sumber iframe
                videoIframe.src = movie.iframeUrl; // <-- GUNAKAN iframeUrl

                // Isi detail film
                detailQuality.textContent = movie.quality;
                detailGenre.textContent = movie.genre.join(', ');
                detailActors.textContent = movie.actors.join(', ');
                detailDirector.textContent = movie.director;
                detailCountry.textContent = movie.country;

                // GANTI LINK IKLANMU DI SINI
                adLink.href = 'https://link-adsterra-kamu.com/disini'; 
            } else {
                movieTitleElement.textContent = "Film tidak ditemukan!";
            }
        } catch (error) {
            console.error('Gagal memuat data film:', error);
            movieTitleElement.textContent = "Gagal memuat data.";
        }
    }

    // LOGIKA IKLAN BARU
    adLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        
        window.open(adLink.href, '_blank');
        
        // Sembunyikan lapisan iklan
        adOverlay.style.display = 'none';
        
        // HAPUS videoPlayer.play()
        // Kita tidak bisa menekan tombol play di dalam iframe secara otomatis
        // Pengguna harus mengklik play sendiri di dalam player iframe
    });

    getMovieData();
});
