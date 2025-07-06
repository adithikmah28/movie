document.addEventListener('DOMContentLoaded', () => {
    const videoIframe = document.getElementById('video-iframe');
    const movieTitleElement = document.getElementById('stream-movie-title');
    const adOverlay = document.getElementById('ad-overlay');
    const adLink = document.getElementById('ad-link');
    const detailQuality = document.getElementById('detail-quality');
    const detailGenre = document.getElementById('detail-genre');
    const detailActors = document.getElementById('detail-actors');
    const detailDirector = document.getElementById('detail-director');
    const detailCountry = document.getElementById('detail-country');

    function updateMetaTags(movie) {
        document.title = `Nonton ${movie.title} (${movie.year}) Sub Indo - BroFlix`;
        let descriptionTag = document.querySelector('meta[name="description"]');
        if (!descriptionTag) {
            descriptionTag = document.createElement('meta');
            descriptionTag.name = 'description';
            document.head.appendChild(descriptionTag);
        }
        descriptionTag.content = `Streaming & Nonton film ${movie.title} (${movie.year}) sub indo, kualitas ${movie.quality}. Dibintangi oleh ${movie.actors.join(', ')}. Hanya di BroFlix.`;
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsTag) {
            keywordsTag = document.createElement('meta');
            keywordsTag.name = 'keywords';
            document.head.appendChild(keywordsTag);
        }
        keywordsTag.content = `nonton ${movie.title}, streaming ${movie.title} sub indo, download ${movie.title}, ${movie.genre.join(', ')}, ${movie.country}, film ${movie.year}`;
    }
    
    async function getMovieData() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');

        if (!movieId) {
            movieTitleElement.textContent = "Film tidak ditemukan!";
            return;
        }

        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const movie = movies.find(m => m.id == movieId);

            if (movie) {
                movieTitleElement.textContent = `${movie.title} (${movie.year})`;
                updateMetaTags(movie);
                videoIframe.src = movie.iframeUrl;
                detailQuality.textContent = movie.quality;
                detailGenre.textContent = movie.genre.join(', ');
                detailActors.textContent = movie.actors.join(', ');
                detailDirector.textContent = movie.director;
                detailCountry.textContent = movie.country;
                adLink.href = 'GANTI_DENGAN_LINK_ADSTERRA_KAMU';
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
    });

    getMovieData();
});
