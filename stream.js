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
    if (modalAdLink) modalAdLink.addEventListener('click', (e) => { e.preventDefault(); window.open(modalAdLink.href, '_blank'); unlockPlayer(); });

    // --- Logika Baru untuk Episode Manual ---
    function changeVideo(iframeUrl) {
        if (videoIframe) {
            videoIframe.src = iframeUrl;
        }
    }

    function generateEpisodeButtons(episodeList) {
        episodeContainer.classList.remove('hide');
        episodeButtons.innerHTML = '';
        
        // Looping berdasarkan daftar episode manual
        episodeList.forEach((episodeUrl, index) => {
            const btn = document.createElement('button');
            btn.className = 'se-button';
            btn.textContent = index + 1; // Tampilkan nomor episode (1, 2, 3, ...)
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('#episode-buttons .se-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                changeVideo(episodeUrl); // Langsung gunakan link dari JSON
            });
            episodeButtons.appendChild(btn);
        });
        
        // Otomatis klik episode 1 saat season dipilih
        if (episodeButtons.querySelector('.se-button')) {
            episodeButtons.querySelector('.se-button').click();
        }
    }
    
    async function getMovieData() {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) { /* ... (logika jika film tidak ditemukan) ... */ return; }

        try {
            const response = await fetch('movies.json');
            const data = await response.json();

            if (data) {
                const movieData = data.find(m => m.id == id);
                if(movieData) {
                    // Isi detail umum
                    if(titleEl) titleEl.textContent = `${movieData.title} (${movieData.year})`;
                    // ... (sisa pengisian detail)
                    
                    // Logika untuk Movie vs Series
                    if (movieData.type === 'series' && movieData.seasons) {
                        seriesSelector.classList.remove('hide');
                        seasonButtons.innerHTML = '';
                        
                        movieData.seasons.forEach(season => {
                            const btn = document.createElement('button');
                            btn.className = 'se-button';
                            btn.textContent = `Season ${season.season_number}`;
                            
                            btn.addEventListener('click', () => {
                                document.querySelectorAll('#season-buttons .se-button').forEach(b => b.classList.remove('active'));
                                btn.classList.add('active');
                                // Kirim daftar link episode ke fungsi generateEpisodeButtons
                                generateEpisodeButtons(season.episodes);
                            });
                            seasonButtons.appendChild(btn);
                        });
                        
                        if (seasonButtons.querySelector('.se-button')) {
                            seasonButtons.querySelector('.se-button').click();
                        }
                    } else {
                        if (videoIframe) videoIframe.src = movieData.iframeUrl;
                    }
                } else {
                    if(titleEl) titleEl.textContent = "Film tidak ditemukan!";
                    modalBackdrop.classList.add('hide');
                }
            }
        } catch (error) {
            console.error('Gagal memuat data:', error);
            if(titleEl) titleEl.textContent = "Gagal memuat data.";
            modalBackdrop.classList.add('hide');
        }
    }
    getMovieData();
});
