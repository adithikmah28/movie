document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Halaman ---
    const videoIframe = document.getElementById('video-iframe');
    const titleEl = document.getElementById('stream-movie-title');
    const adOverlay = document.getElementById('ad-overlay');
    const adLink = document.getElementById('ad-link');
    // Detail
    const qualityEl = document.getElementById('detail-quality');
    const genreEl = document.getElementById('detail-genre');
    const actorsEl = document.getElementById('detail-actors');
    const directorEl = document.getElementById('detail-director');
    const countryEl = document.getElementById('detail-country');
    const synopsisEl = document.getElementById('detail-synopsis'); // Elemen baru untuk sinopsis
    // Series
    const seriesSelector = document.getElementById('series-selector');
    const seasonButtons = document.getElementById('season-buttons');
    const episodeContainer = document.getElementById('episode-container');
    const episodeButtons = document.getElementById('episode-buttons');

    // --- Fungsi Bantuan ---
    function changeVideo(tmdbId, s, e) { videoIframe.src = `https://vidsrc.to/embed/tv/${tmdbId}/${s}-${e}`; }

    function generateEpisodeButtons(s, totalEp, tmdbId) {
        episodeContainer.classList.remove('hide'); episodeButtons.innerHTML = '';
        for (let i = 1; i <= totalEp; i++) {
            const btn = document.createElement('button');
            btn.className = 'se-button'; btn.textContent = i;
            btn.addEventListener('click', () => { document.querySelectorAll('#episode-buttons .se-button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); changeVideo(tmdbId, s, i); });
            episodeButtons.appendChild(btn);
        }
        episodeButtons.querySelector('.se-button').click();
    }
    
    // --- Fungsi Utama ---
    async function getMovieData() {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) { return titleEl.textContent = "Film tidak ditemukan!"; }
        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const data = movies.find(m => m.id == id);
            if (data) {
                // Mengisi semua detail termasuk SINOPSIS
                titleEl.textContent = `${data.title} (${data.year})`;
                document.title = `Nonton ${data.title} (${data.year}) - BroFlix`;
                qualityEl.textContent = data.quality;
                genreEl.textContent = data.genre.join(', ');
                actorsEl.textContent = data.actors.join(', ');
                directorEl.textContent = data.director;
                countryEl.textContent = data.country;
                synopsisEl.textContent = data.synopsis || 'Sinopsis untuk film ini tidak tersedia.'; // Tambahkan ini

                // Logika untuk Movie vs Series
                if (data.type === 'series') {
                    seriesSelector.classList.remove('hide');
                    seasonButtons.innerHTML = '';
                    data.seasons.forEach(season => {
                        const btn = document.createElement('button');
                        btn.className = 'se-button'; btn.textContent = `Season ${season.season_number}`;
                        btn.addEventListener('click', () => { document.querySelectorAll('#season-buttons .se-button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); generateEpisodeButtons(season.season_number, season.total_episodes, data.tmdb_id); });
                        seasonButtons.appendChild(btn);
                    });
                    seasonButtons.querySelector('.se-button').click();
                } else {
                    videoIframe.src = data.iframeUrl;
                }
            } else {
                titleEl.textContent = "Film tidak ditemukan!";
            }
        } catch (error) {
            console.error('Gagal memuat data:', error);
            titleEl.textContent = "Gagal memuat data.";
        }
    }

    adLink.addEventListener('click', (e) => { e.preventDefault(); window.open(adLink.href, '_blank'); adOverlay.style.display = 'none'; });
    getMovieData();
});
