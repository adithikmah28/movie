document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('video-player');
    const movieTitleElement = document.getElementById('stream-movie-title');

    // 1. Ambil ID film dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        movieTitleElement.textContent = "Film tidak ditemukan!";
        return;
    }

    // 2. Ambil semua data film dari movies.json
    async function getMovieData() {
        try {
            const response = await fetch('movies.json');
            const movies = await response.json();

            // 3. Cari film yang cocok berdasarkan ID
            const movie = movies.find(m => m.id == movieId);

            // 4. Jika film ditemukan, tampilkan datanya
            if (movie) {
                movieTitleElement.textContent = movie.title;
                videoPlayer.src = movie.videoUrl;
                document.title = `Nonton ${movie.title} | BroFlix`; // Update judul tab browser
            } else {
                movieTitleElement.textContent = "Film tidak ditemukan!";
            }
        } catch (error) {
            console.error('Gagal memuat data film:', error);
            movieTitleElement.textContent = "Gagal memuat data.";
        }
    }

    getMovieData();
});
