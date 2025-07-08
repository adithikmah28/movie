document.addEventListener('DOMContentLoaded', () => {
    // Definisikan semua elemen di awal
    const videoIframe = document.getElementById('video-iframe');
    const titleEl = document.getElementById('stream-movie-title');
    const videoLockOverlay = document.getElementById('video-lock-overlay');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalAdLink = document.getElementById('modal-ad-link');
    const qualityEl = document.getElementById('detail-quality');
    const genreEl = document.getElementById('detail-genre');
    const actorsEl = document.getElementById('detail-actors');
    const directorEl = document.getElementById('detail-director');
    const countryEl = document.getElementById('detail-country');
    const synopsisEl = document.getElementById('detail-synopsis');
    const seriesSelector = document.getElementById('series-selector');
    const seasonButtons = document.getElementById('season-buttons');
    const episodeContainer = document.getElementById('episode-container');
    const episodeButtons = document.getElementById('episode-buttons');

    // --- Logika Kunci Iklan ---
    function unlockPlayer() {
        modalBackdrop.classList.add('hide'); 
        videoLockOverlay.classList.add('hide'); 
    }

    if (modalAdLink) {
        modalAdLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(modalAdLink.href, '_blank');
            unlockPlayer();
        });
    }
    
    // --- Logika Memuat Data yang Canggih (Dengan Episode) ---
    function changeVideo(tmdbId, s, e) {
        if (videoIframe) {
            // Ini sudah benar menggunakan vidlink.pro untuk series
            videoIframe.src = `https://vidlink.pro/embed/tv/${tmdbId}?s=${s}&e=${e}`;
        }
    }

    function generateEpisodeButtons(s, totalEp, tmdbId) {
        episodeContainer.classList.remove('hide');
        episodeButtons.innerHTML = '';
        for (let i = 1; i <= totalEp; i++) {
            const btn = document.createElement('button');
            btn.className = 'se-button';
            btn.textContent = i;
            btn.addEventListener('click', () => {
                document.querySelectorAll('#episode-buttons .se-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                changeVideo(tmdbId, s, i);
            });
            episodeButtons.appendChild(btn);
        }
        if (episodeButtons.querySelector('.se-button')) {
            episodeButtons.querySelector('.se-button').click();
        }
    }
    
    async function getMovieData() {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) {
            if (titleEl) titleEl.textContent = "Film tidak ditemukan!";
            modalBackdrop.classList.add('hide'); 
            return;
        }

        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Gagal fetch movies.json');
            const movies = await response.json();
            const data = movies.find(m => m.id == id);

            if (data) {
                // Isi semua detail
                if(titleEl) titleEl.textContent = `${data.title} (${data.year})`;
                if(document) document.title = `Nonton ${data.title} (${data.year}) - BroFlix`;
                if(qualityEl) qualityEl.textContent = data.quality;
                if(genreEl) genreEl.textContent = data.genre.join(', ');
                if(actorsEl) actorsEl.textContent = data.actors.join(', ');
                if(directorEl) directorEl.textContent = data.director;
                if(countryEl) countryEl.textContent = data.country;
                if(synopsisEl) synopsisEl.textContent = data.synopsis || 'Sinopsis tidak tersedia.';

                // Logika untuk membedakan Movie vs Series
                if (data.type === 'series' && data.seasons) {
                    seriesSelector.classList.remove('hide'); 
                    seasonButtons.innerHTML = '';
                    data.seasons.forEach(season => {
                        const btn = document.createElement('button');
                        btn.className = 'se-button';
                        btn.textContent = `Season ${season.season_number}`;
                        btn.addEventListener('click', () => {
                            document.querySelectorAll('#season-buttons .se-button').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            generateEpisodeButtons(season.season_number, season.total_episodes, data.tmdb_id);
                        });
                        seasonButtons.appendChild(btn);
                    });
                    if (seasonButtons.querySelector('.se-button')) {
                        seasonButtons.querySelector('.se-button').click();
                    }
                } else {
                    // Jika ini film, langsung set iframeUrl
                    if (videoIframe) videoIframe.src = data.iframeUrl;
                }
            } else {
                if(titleEl) titleEl.textContent = "Film tidak ditemukan!";
                modalBackdrop.classList.add('hide');
            }
        } catch (error) {
            console.error('Gagal memuat data:', error);
            if(titleEl) titleEl.textContent = "Gagal memuat data.";
            modalBackdrop.classList.add('hide');
        }
    }

    getMovieData();
});
