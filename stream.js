document.addEventListener('DOMContentLoaded', () => {
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
    const episodeButtons = document.getElementById('episode-buttons');

    function unlockPlayer() {
        if (modalBackdrop) modalBackdrop.classList.add('hide');
        if (videoLockOverlay) videoLockOverlay.classList.add('hide');
    }

    if (modalAdLink) modalAdLink.addEventListener('click', e => { e.preventDefault(); window.open(modalAdLink.href, '_blank'); unlockPlayer(); });

    function changeVideo(iframeUrl) { if (videoIframe) videoIframe.src = iframeUrl; }

    function generateEpisodeButtons(episodeList) { /* ... sama seperti sebelumnya ... */ }
    
    async function getMovieData() {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) { /* ... */ return; }

        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const data = movies.find(m => m.id == id);

            if (data) {
                // KODE YANG DIPERBAIKI: Mengisi semua detail
                if (titleEl) titleEl.textContent = `${data.title} (${data.year})`;
                document.title = `Nonton ${data.title} (${data.year}) - BroFlix`;
                if (qualityEl) qualityEl.textContent = data.quality || 'N/A';
                if (genreEl) genreEl.textContent = data.genre.join(', ');
                if (actorsEl) actorsEl.textContent = data.actors.join(', ');
                if (directorEl) directorEl.textContent = data.director || 'N/A';
                if (countryEl) countryEl.textContent = data.country || 'N/A';
                if (synopsisEl) synopsisEl.textContent = data.synopsis || 'Sinopsis tidak tersedia.';
                
                if (data.type === 'series' && data.seasons) {
                    // ... logika series ...
                } else {
                    if (videoIframe) videoIframe.src = data.iframeUrl;
                }
                if (modalBackdrop) modalBackdrop.classList.remove('hide');
            } else {
                // ...
            }
        } catch (error) {
            // ...
        }
    }
    getMovieData();
    
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
});
