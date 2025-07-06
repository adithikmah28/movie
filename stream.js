document.addEventListener('DOMContentLoaded', () => {
    // Elemen dasar
    const videoIframe = document.getElementById('video-iframe');
    const movieTitleElement = document.getElementById('stream-movie-title');
    const adOverlay = document.getElementById('ad-overlay');
    const adLink = document.getElementById('ad-link');

    // Elemen detail
    const detailQuality = document.getElementById('detail-quality');
    const detailGenre = document.getElementById('detail-genre');
    const detailActors = document.getElementById('detail-actors');
    const detailDirector = document.getElementById('detail-director');
    const detailCountry = document.getElementById('detail-country');

    // Elemen baru untuk series
    const seriesSelector = document.getElementById('series-selector');
    const seasonButtonsContainer = document.getElementById('season-buttons');
    const episodeContainer = document.getElementById('episode-container');
    const episodeButtonsContainer = document.getElementById('episode-buttons');

    let currentMovieData = null; // Untuk menyimpan data film/series saat ini

    function updateMetaTags(movie) {
        document.title = `Nonton ${movie.title} (${movie.year}) Sub Indo - BroFlix`;
        // ... (fungsi meta tags lainnya tetap sama)
    }

    // Fungsi untuk mengganti video
    function changeVideo(tmdbId, season, episode) {
        const newUrl = `https://vidsrc.to/embed/tv/${tmdbId}/${season}-${episode}`;
        videoIframe.src = newUrl;
    }

    // Fungsi untuk membuat tombol episode
    function generateEpisodeButtons(seasonNumber, totalEpisodes, tmdbId) {
        episodeContainer.classList.remove('hide');
        episodeButtonsContainer.innerHTML = ''; // Kosongkan dulu

        for (let i = 1; i <= totalEpisodes; i++) {
            const epButton = document.createElement('button');
            epButton.className = 'se-button';
            epButton.textContent = i;
            epButton.dataset.episodeNumber = i;

            epButton.addEventListener('click', () => {
                // Hapus class active dari tombol episode lain
                document.querySelectorAll('#episode-buttons .se-button').forEach(btn => btn.classList.remove('active'));
                epButton.classList.add('active'); // Aktifkan tombol yang diklik

                changeVideo(tmdbId, seasonNumber, i);
            });

            episodeButtonsContainer.appendChild(epButton);
        }
        // Otomatis klik episode 1 saat season dipilih
        episodeButtonsContainer.querySelector('.se-button').click();
    }

    // Fungsi untuk membuat tombol season
    function generateSeasonButtons(seriesData) {
        seasonButtonsContainer.innerHTML = ''; // Kosongkan dulu

        seriesData.seasons.forEach(season => {
            const seasonButton = document.createElement('button');
            seasonButton.className = 'se-button';
            seasonButton.textContent = `Season ${season.season_number}`;
            
            seasonButton.addEventListener('click', () => {
                // Hapus class active dari tombol season lain
                document.querySelectorAll('#season-buttons .se-button').forEach(btn => btn.classList.remove('active'));
                seasonButton.classList.add('active'); // Aktifkan tombol yang diklik

                // Buat tombol episode untuk season yang dipilih
                generateEpisodeButtons(season.season_number, season.total_episodes, seriesData.tmdb_id);
            });
            seasonButtonsContainer.appendChild(seasonButton);
        });
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
            currentMovieData = movies.find(m => m.id == movieId);

            if (currentMovieData) {
                // Isi detail umum
                movieTitleElement.textContent = `${currentMovieData.title} (${currentMovieData.year})`;
                updateMetaTags(currentMovieData);
                detailQuality.textContent = currentMovieData.quality;
                detailGenre.textContent = currentMovieData.genre.join(', ');
                detailActors.textContent = currentMovieData.actors.join(', ');
                detailDirector.textContent = currentMovieData.director;
                detailCountry.textContent = currentMovieData.country;
                adLink.href = 'GANTI_DENGAN_LINK_ADSTERRA_KAMU';

                // Cek tipe konten: movie atau series?
                if (currentMovieData.type === 'series') {
                    seriesSelector.classList.remove('hide');
                    generateSeasonButtons(currentMovieData);
                    // Otomatis klik season pertama saat halaman dimuat
                    seasonButtonsContainer.querySelector('.se-button').click();
                } else {
                    // Ini adalah film, sembunyikan selector series
                    seriesSelector.classList.add('hide');
                    videoIframe.src = currentMovieData.iframeUrl;
                }

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
