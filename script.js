document.addEventListener('DOMContentLoaded', () => {
    const moviesGrid = document.getElementById('movies-grid');
    const seriesGrid = document.getElementById('series-grid');
    const indonesiaPopularGrid = document.getElementById('indonesia-popular-movies');
    const indonesiaHorrorGrid = document.getElementById('indonesia-horror-movies');

    function createContentItem(item) { /* ... fungsi sama ... */ }

    async function initializePage() {
        try {
            const response = await fetch('movies.json');
            const data = await response.json();
            
            // Tampilkan Film dan Series Umum
            const movies = data.filter(item => item.type === 'movie');
            const series = data.filter(item => item.type === 'series');
            if (moviesGrid) { moviesGrid.innerHTML = ''; movies.slice(0, 10).forEach(movie => moviesGrid.appendChild(createContentItem(movie))); }
            if (seriesGrid) { seriesGrid.innerHTML = ''; series.slice(0, 10).forEach(serie => seriesGrid.appendChild(createContentItem(serie))); }

            // Tampilkan Indonesia Populer (berdasarkan rating)
            const indonesiaPopular = data.filter(item => item.country === 'Indonesia').sort((a, b) => b.rating - a.rating);
            if (indonesiaPopularGrid && indonesiaPopular.length > 0) {
                indonesiaPopularGrid.innerHTML = '';
                indonesiaPopular.slice(0, 10).forEach(movie => indonesiaPopularGrid.appendChild(createContentItem(movie)));
            } else if (document.getElementById('indonesia-populer-section')) {
                document.getElementById('indonesia-populer-section').classList.add('hide');
            }

            // Tampilkan Horor Indonesia
            const indonesiaHorror = data.filter(item => item.country === 'Indonesia' && item.genre.includes('Horor'));
            if (indonesiaHorrorGrid && indonesiaHorror.length > 0) {
                indonesiaHorrorGrid.innerHTML = '';
                indonesiaHorror.slice(0, 10).forEach(movie => indonesiaHorrorGrid.appendChild(createContentItem(movie)));
            } else if (document.getElementById('indonesia-horor-section')) {
                document.getElementById('indonesia-horor-section').classList.add('hide');
            }
            
        } catch (error) {
            console.error('Gagal memuat konten:', error);
        }
    }
    
    // Panggil fungsi utama
    initializePage();

    // Re-use createContentItem
    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.innerHTML = `<div class="movie-poster"><img src="${item.poster}" alt="${item.title}"><div class="quality-tag quality-${item.quality.toLowerCase()}">${item.quality}</div><div class="rating"><span class="rating-star">⭐</span><span>${item.rating.toFixed(1)}</span></div></div><p class="movie-title">${item.title} (${item.year})</p>`;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => { window.location.href = `stream.html?id=${item.id}`; });
        return itemElement;
    }
    
    // Logika Sidebar, Negara, dan Search (tetap sama)
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if(menuToggle && sidebar && overlay) { /* ... logika sidebar ... */ }
    const headerSearchForm = document.getElementById('header-search-form');
    if (headerSearchForm) { /* ... logika search ... */ }
    const countryMenuToggle = document.getElementById('country-menu-toggle');
    async function populateCountryMenu() { /* ... logika negara ... */ }
    if (countryMenuToggle) { /* ... logika klik negara ... */ }
});
