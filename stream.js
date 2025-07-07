document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Halaman ---
    const videoIframe = document.getElementById('video-iframe');
    const titleEl = document.getElementById('stream-movie-title');
    // Elemen baru untuk popup
    const videoPlayOverlay = document.getElementById('video-play-overlay');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalAdLink = document.getElementById('modal-ad-link');
    // Detail & Series
    const qualityEl = document.getElementById('detail-quality'), genreEl = document.getElementById('detail-genre'), actorsEl = document.getElementById('detail-actors'), directorEl = document.getElementById('detail-director'), countryEl = document.getElementById('detail-country'), synopsisEl = document.getElementById('detail-synopsis'), seriesSelector = document.getElementById('series-selector'), seasonButtons = document.getElementById('season-buttons'), episodeContainer = document.getElementById('episode-container'), episodeButtons = document.getElementById('episode-buttons');

    // --- Logika Popup Iklan ---
    function showAdPopup() {
        modalBackdrop.classList.remove('hide');
    }
    function hideAdPopup() {
        modalBackdrop.classList.add('hide');
    }
    function unlockPlayer() {
        hideAdPopup();
        videoPlayOverlay.classList.add('hide');
    }

    if (videoPlayOverlay) videoPlayOverlay.addEventListener('click', showAdPopup);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideAdPopup);
    if (modalAdLink) {
        modalAdLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(modalAdLink.href, '_blank');
            unlockPlayer();
        });
    }

    // --- Logika Memuat Data Film/Series ---
    function changeVideo(tmdbId, s, e) { videoIframe.src = `https://vidsrc.to/embed/tv/${tmdbId}/${s}-${e}`; }
    function generateEpisodeButtons(s, totalEp, tmdbId) {
        episodeContainer.classList.remove('hide'); episodeButtons.innerHTML = '';
        for (let i = 1; i <= totalEp; i++) {
            const btn = document.createElement('button');
            btn.className = 'se-button'; btn.textContent = i;
            btn.addEventListener('click', () => {
                document.querySelectorAll('#episode-buttons .se-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                changeVideo(tmdbId, s, i);
                // Tampilkan lagi overlay jika belum diklik
                if (!videoPlayOverlay.classList.contains('hide')) {
                     videoPlayOverlay.classList.remove('hide');
                }
            });
            episodeButtons.appendChild(btn);
        }
        if (episodeButtons.querySelector('.se-button')) {
            episodeButtons.querySelector('.se-button').click();
        }
    }
    
    async function getMovieData() {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) { return titleEl.textContent = "Film tidak ditemukan!"; }
        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const data = movies.find(m => m.id == id);
            if (data) {
                titleEl.textContent = `${data.title} (${data.year})`;
                document.title = `Nonton ${data.title} (${data.year}) - BroFlix`;
                qualityEl.textContent = data.quality; genreEl.textContent = data.genre.join(', '); actorsEl.textContent = data.actors.join(', '); directorEl.textContent = data.director; countryEl.textContent = data.country; synopsisEl.textContent = data.synopsis || 'Sinopsis untuk film ini tidak tersedia.';

                if (data.type === 'series' && data.seasons) {
                    seriesSelector.classList.remove('hide');
                    seasonButtons.innerHTML = '';
                    data.seasons.forEach(season => {
                        const btn = document.createElement('button');
                        btn.className = 'se-button'; btn.textContent = `Season ${season.season_number}`;
                        btn.addEventListener('click', () => { document.querySelectorAll('#season-buttons .se-button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); generateEpisodeButtons(season.season_number, season.total_episodes, data.tmdb_id); });
                        seasonButtons.appendChild(btn);
                    });
                    if (seasonButtons.querySelector('.se-button')) {
                        seasonButtons.querySelector('.se-button').click();
                    }
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
    getMovieData();
});
