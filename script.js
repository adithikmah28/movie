document.addEventListener('DOMContentLoaded', () => {
    const movieGridTrending = document.getElementById('trending-movies');
    const movieGridAction = document.getElementById('action-movies');
    const movieGridComedy = document.getElementById('comedy-movies');
    const movieGridDrama = document.getElementById('drama-movies');

    const modal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-movie-title');
    const videoPlayer = document.getElementById('video-player');
    const closeButton = document.querySelector('.close-button');

    // Fungsi untuk mengambil data film dari movies.json
    async function fetchMovies() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) {
                throw new Error('Gagal memuat data film!');
            }
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error(error);
        }
    }

    // Fungsi untuk menampilkan film ke kategori yang sesuai
    function displayMovies(movies) {
        // Bersihkan grid sebelum mengisi
        movieGridTrending.innerHTML = '';
        movieGridAction.innerHTML = '';
        movieGridComedy.innerHTML = '';
        movieGridDrama.innerHTML = '';

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-poster');
            movieElement.innerHTML = `<img src="${movie.poster}" alt="${movie.title}">`;
            
            // Simpan data video dan judul di elemen untuk diakses nanti
            movieElement.dataset.videoUrl = movie.videoUrl;
            movieElement.dataset.title = movie.title;

            // Tambahkan event listener untuk membuka modal saat poster diklik
            movieElement.addEventListener('click', () => {
                openModal(movie.title, movie.videoUrl);
            });

            // Masukkan film ke grid kategori yang benar
            switch (movie.category) {
                case 'trending':
                    movieGridTrending.appendChild(movieElement);
                    break;
                case 'action':
                    movieGridAction.appendChild(movieElement);
                    break;
                case 'comedy':
                    movieGridComedy.appendChild(movieElement);
                    break;
                case 'drama':
                    movieGridDrama.appendChild(movieElement);
                    break;
                // Tambahkan case lain jika ada kategori baru
            }
        });
    }

    // Fungsi untuk membuka modal player
    function openModal(title, videoUrl) {
        modalTitle.textContent = title;
        videoPlayer.src = videoUrl;
        modal.style.display = 'flex'; // Gunakan flex untuk centering
    }

    // Fungsi untuk menutup modal player
    function closeModal() {
        modal.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.src = ''; // Hentikan download video
    }

    // Event listener untuk tombol close
    closeButton.addEventListener('click', closeModal);

    // Event listener untuk menutup modal jika klik di luar area konten
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Panggil fungsi utama untuk memulai
    fetchMovies();
});
