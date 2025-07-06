document.addEventListener('DOMContentLoaded', () => {
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');

    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.innerHTML = `<div class="movie-poster"><img src="${item.poster}" alt="${item.title}"><div class="quality-tag quality-${item.quality.toLowerCase()}">${item.quality}</div><div class="rating"><span class="rating-star">⭐</span><span>${item.rating.toFixed(1)}</span></div></div><p class="movie-title">${item.title} (${item.year})</p>`;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => { window.location.href = `stream.html?id=${item.id}`; });
        return itemElement;
    }

    async function fetchAndDisplayHomepageContent() {
        try {
            const response = await fetch('movies.json');
            const data = await response.json();
            const movies = data.filter(item => item.type === 'movie');
            const series = data.filter(item => item.type === 'series');
            if (moviesGrid) { moviesGrid.innerHTML = ''; movies.slice(0, 10).forEach(movie => moviesGrid.appendChild(createContentItem(movie))); }
            if (seriesGrid) { seriesGrid.innerHTML = ''; series.slice(0, 10).forEach(serie => seriesGrid.appendChild(createContentItem(serie))); }
        } catch (error) {
            console.error('Gagal memuat konten:', error);
            if (moviesGrid) moviesGrid.innerHTML = '<p>Gagal memuat film.</p>';
            if (seriesGrid) seriesGrid.innerHTML = '<p>Gagal memuat series.</p>';
        }
    }
    fetchAndDisplayHomepageContent();

    const menuToggle = document.getElementById('menu-toggle'), sidebar = document.getElementById('sidebar'), overlay = document.getElementById('overlay'), searchInput = document.getElementById('search-input');
    if(menuToggle && sidebar && overlay) { menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('show'); }); overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); }); }
    if(searchInput) { searchInput.addEventListener('input', (e) => { const term = e.target.value.toLowerCase().trim(); document.querySelectorAll('.movie-item').forEach(item => { item.style.display = item.querySelector('.movie-title').textContent.toLowerCase().includes(term) ? 'flex' : 'none'; }); }); }
});
