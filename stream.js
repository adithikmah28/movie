document.addEventListener('DOMContentLoaded', () => {
    const videoIframe = document.getElementById('video-iframe'), titleEl = document.getElementById('stream-movie-title'), adOverlay = document.getElementById('ad-overlay'), adLink = document.getElementById('ad-link'), qualityEl = document.getElementById('detail-quality'), genreEl = document.getElementById('detail-genre'), actorsEl = document.getElementById('detail-actors'), directorEl = document.getElementById('detail-director'), countryEl = document.getElementById('detail-country'), seriesSelector = document.getElementById('series-selector'), seasonButtons = document.getElementById('season-buttons'), episodeContainer = document.getElementById('episode-container'), episodeButtons = document.getElementById('episode-buttons');

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
                qualityEl.textContent = data.quality; 
                genreEl.textContent = data.genre.join(', '); 
                actorsEl.textContent = data.actors.join(', '); 
                directorEl.textContent = data.director; 
                countryEl.textContent = Array.isArray(data.country) ? data.country.join(', ') : data.country;
                
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
                } else { videoIframe.src = data.iframeUrl; }
            } else { titleEl.textContent = "Film tidak ditemukan!"; }
        } catch (error) { console.error('Gagal memuat data:', error); titleEl.textContent = "Gagal memuat data."; }
    }

    adLink.addEventListener('click', (e) => { 
        e.preventDefault(); 
        window.open(adLink.href, '_blank'); 
        adOverlay.style.display = 'none'; // Cukup sembunyikan popup
    });
    
    getMovieData();
});
