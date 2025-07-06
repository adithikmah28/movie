document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const searchInput = document.getElementById('search-input');

    const categoryGrids = {
        trending: document.getElementById('trending-movies'),
        action: document.getElementById('action-movies'),
        comedy: document.getElementById('comedy-movies'),
        drama: document.getElementById('drama-movies'),
    };
    
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });
    }
    if(overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    async function fetchAndDisplayMovies() {
        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            
            Object.values(categoryGrids).forEach(grid => {
                if (grid) grid.innerHTML = '';
            });

            movies.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('movie-item');
                movieItem.dataset.title = movie.title.toLowerCase();

                movieItem.innerHTML = `
                    <div class="movie-poster">
                        <img src="${movie.poster}" alt="${movie.title}">
                        <div class="quality-tag quality-${movie.quality.toLowerCase()}">${movie.quality}</div>
                        <div class="rating">
                            <span class="rating-star">⭐</span>
                            <span>${movie.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <p class="movie-title">${movie.title} (${movie.year})</p>
                `;
                
                movieItem.querySelector('.movie-poster').addEventListener('click', () => {
                    window.location.href = `stream.html?id=${movie.id}`;
                });

                if (categoryGrids[movie.category]) {
                    categoryGrids[movie.category].appendChild(movieItem);
                }
            });

        } catch (error) {
            console.error('Gagal memuat film:', error);
        }
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const allMovieItems = document.querySelectorAll('.movie-item');

            allMovieItems.forEach(item => {
                if (item.dataset.title.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    fetchAndDisplayMovies();
});
