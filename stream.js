document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('video-player');
    const movieTitleElement = document.getElementById('stream-movie-title');
    const adOverlay = document.getElementById('ad-overlay');
    const adLink = document.getElementById('ad-link');
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
                movieTitleElement.textContent = movie.title;
                videoPlayer.src = movie.videoUrl;
                document.title = `Nonton ${movie.title} | BroFlix`;
                detailQuality.textContent = movie.quality;
                detailGenre.textContent = movie.genre.join(', ');
                detailActors.textContent = movie.actors.join(', ');
                detailDirector.textContent = movie.director;
                detailCountry.textContent = movie.country;
                // GANTI LINK INI DENGAN LINK ADSTERRA KAMU
                adLink.href = 'https://link-adsterra-kamu.com/disini'; 
            } else {
                movieTitleElement.textContent = "Film tidak ditemukan!";
            }
        } catch (error) {
            console.error('Gagal memuat data film:', error);
            movieTitleElement.textContent = "Gagal memuat data.";
        }
    }
    adLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        window.open(adLink.href, '_blank');
        adOverlay.style.display = 'none';
        videoPlayer.play();
    });
    getMovieData();
});
