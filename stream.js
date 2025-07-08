document.addEventListener('DOMContentLoaded', () => {
    const videoIframe = document.getElementById('video-iframe');
    const titleEl = document.getElementById('stream-movie-title');
    const videoLockOverlay = document.getElementById('video-lock-overlay');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalAdLink = document.getElementById('modal-ad-link');
    const seriesSelector = document.getElementById('series-selector');
    const seasonButtons = document.getElementById('season-buttons');
    const episodeButtons = document.getElementById('episode-buttons');

    function unlockPlayer() {
        if (modalBackdrop) modalBackdrop.classList.add('hide');
        if (videoLockOverlay) videoLockOverlay.classList.add('hide');
    }

    if (modalAdLink) modalAdLink.addEventListener('click', e => { e.preventDefault(); window.open(modalAdLink.href, '_blank'); unlockPlayer(); });

    function changeVideo(iframeUrl) { if (videoIframe) videoIframe.src = iframeUrl; }

    function generateEpisodeButtons(episodeList) {
        const episodeContainer = document.getElementById('episode-container');
        if (!episodeContainer || !episodeButtons) return;
        episodeContainer.classList.remove('hide');
        episodeButtons.innerHTML = '';
        episodeList.forEach((episodeUrl, index) => {
            const btn = document.createElement('button');
            btn.className = 'se-button';
            btn.textContent = index + 1;
            btn.addEventListener('click', () => {
                episodeButtons.querySelectorAll('.se-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                changeVideo(episodeUrl);
            });
            episodeButtons.appendChild(btn);
        });
        if (episodeButtons.firstChild) episodeButtons.firstChild.click();
    }
    
    async function getMovieData() {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) {
            if (titleEl) titleEl.textContent = "Film tidak ditemukan!";
            if (modalBackdrop) modalBackdrop.classList.add('hide');
            return;
        }

        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const data = movies.find(m => m.id == id);

            if (data) {
                if (titleEl) titleEl.textContent = `${data.title} (${data.year})`;
                // ... isi semua detail ...
                
                if (data.type === 'series' && data.seasons) {
                    seriesSelector.classList.remove('hide');
                    seasonButtons.innerHTML = '';
                    data.seasons.forEach(season => {
                        const btn = document.createElement('button');
                        btn.className = 'se-button';
                        btn.textContent = `Season ${season.season_number}`;
                        btn.addEventListener('click', () => {
                            seasonButtons.querySelectorAll('.se-button').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            generateEpisodeButtons(season.episodes);
                        });
                        seasonButtons.appendChild(btn);
                    });
                    if (seasonButtons.firstChild) seasonButtons.firstChild.click();
                } else {
                    if (videoIframe) videoIframe.src = data.iframeUrl;
                }
                if (modalBackdrop) modalBackdrop.classList.remove('hide'); // Tampilkan popup
            } else {
                if (titleEl) titleEl.textContent = "Film tidak ditemukan!";
                if (modalBackdrop) modalBackdrop.classList.add('hide');
            }
        } catch (error) {
            console.error('Gagal memuat data:', error);
            if (titleEl) titleEl.textContent = "Gagal memuat data.";
            if (modalBackdrop) modalBackdrop.classList.add('hide');
        }
    }
    getMovieData();
});
