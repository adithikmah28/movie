document.addEventListener('DOMContentLoaded', () => {
    // Definisi elemen (tidak berubah)
    const videoIframe = document.getElementById('video-iframe');
    const movieTitleElement = document.getElementById('stream-movie-title');
    // ... (definisi elemen lainnya)

    // --- FUNGSI BARU: Update SEO & Meta Tags ---
    function updateMetaTags(movie) {
        // Update Judul Tab
        document.title = `Nonton ${movie.title} (${movie.year}) Sub Indo - BroFlix`;

        // Buat atau Update Meta Description
        let descriptionTag = document.querySelector('meta[name="description"]');
        if (!descriptionTag) {
            descriptionTag = document.createElement('meta');
            descriptionTag.name = 'description';
            document.head.appendChild(descriptionTag);
        }
        descriptionTag.content = `Streaming & Nonton film ${movie.title} (${movie.year}) sub indo, kualitas ${movie.quality}. Dibintangi oleh ${movie.actors.join(', ')}. Hanya di BroFlix.`;

        // Buat atau Update Meta Keywords
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsTag) {
            keywordsTag = document.createElement('meta');
            keywordsTag.name = 'keywords';
            document.head.appendChild(keywordsTag);
        }
        keywordsTag.content = `nonton ${movie.title}, streaming ${movie.title} sub indo, download ${movie.title}, ${movie.genre.join(', ')}, ${movie.country}, film ${movie.year}`;
    }

    // Fungsi getMovieData diperbarui
    async function getMovieData() {
        // ... (kode untuk mengambil movieId tidak berubah) ...
        try {
            const response = await fetch('movies.json');
            const movies = await response.json();
            const movie = movies.find(m => m.id == movieId);

            if (movie) {
                // --- PERUBAHAN DI SINI ---
                // 1. Set judul dengan tahun
                movieTitleElement.textContent = `${movie.title} (${movie.year})`;
                // 2. Panggil fungsi untuk update SEO
                updateMetaTags(movie);
                // 3. Set sisa data (tidak berubah)
                videoIframe.src = movie.iframeUrl; 
                // ... (set detail film lainnya) ...

            } else { /* ... */ }
        } catch (error) { /* ... */ }
    }
    
    // Logika iklan (tidak berubah)
    adLink.addEventListener('click', (event) => { /* ... */ });
    
    getMovieData();
});
