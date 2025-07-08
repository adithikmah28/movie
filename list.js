document.addEventListener('DOMContentLoaded', () => {
    const listGrid = document.getElementById('list-grid');
    const listTitle = document.getElementById('list-title');
    const paginationControls = document.getElementById('pagination-controls');
    const listSearchInput = document.getElementById('list-search-input');
    
    // Periksa apakah semua elemen penting ada
    if (!listGrid || !listTitle || !paginationControls) {
        console.error('Elemen penting tidak ditemukan di list.html!');
        if(listTitle) listTitle.textContent = "Error: Elemen halaman tidak lengkap.";
        return;
    }

    const ITEMS_PER_PAGE = 20;
    let allData = []; // Simpan semua data untuk pencarian real-time

    function createContentItem(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('movie-item');
        itemElement.innerHTML = `
            <div class="movie-poster">
                <img src="${item.poster}" alt="${item.title}">
                <div class="quality-tag quality-${item.quality.toLowerCase()}">${item.quality}</div>
                <div class="rating">
                    <span class="rating-star">⭐</span>
                    <span>${item.rating.toFixed(1)}</span>
                </div>
            </div>
            <p class="movie-title">${item.title} (${item.year})</p>`;
        itemElement.querySelector('.movie-poster').addEventListener('click', () => { window.location.href = `stream.html?id=${item.id}`; });
        return itemElement;
    }

    function setupPagination(totalItems, currentPage, params) {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            const newParams = new URLSearchParams(params);
            newParams.set('page', i);
            pageLink.href = `list.html?${newParams.toString()}`;
            pageLink.textContent = i;
            pageLink.classList.add('page-item');
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            paginationControls.appendChild(pageLink);
        }
    }

    function displayContent(content, currentPage, params) {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const contentForPage = content.slice(startIndex, endIndex);

        listGrid.innerHTML = '';
        if (contentForPage.length === 0) {
            listGrid.innerHTML = `<p style="color: #ccc; grid-column: 1 / -1;">Tidak ada konten yang ditemukan.</p>`;
        } else {
            contentForPage.forEach(item => listGrid.appendChild(createContentItem(item)));
        }
        setupPagination(content.length, currentPage, params);
    }
    
    async function loadAndFilterContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const country = urlParams.get('country');
        const search = urlParams.get('search');
        const currentPage = parseInt(urlParams.get('page')) || 1;

        let pageTitle = "Daftar Konten";
        if (search) {
             pageTitle = `Hasil untuk "${search}"`;
             listTitle.innerHTML = `<i class="fa-solid fa-search"></i> ${pageTitle}`;
        } else if (country) {
            pageTitle = `Film & Series dari ${country}`;
            listTitle.innerHTML = `<i class="fa-solid fa-globe"></i> ${pageTitle}`;
        } else if (type) {
            pageTitle = `Semua ${type === 'movie' ? 'Film' : 'Serial TV'}`;
            listTitle.innerHTML = `<i class="fa-solid fa-${type === 'movie' ? 'film' : 'tv'}"></i> ${pageTitle}`;
        } else {
            // Default jika tidak ada parameter
            listTitle.innerHTML = `<i class="fa-solid fa-film"></i> Semua Konten`;
        }
        document.title = `${pageTitle} | BroFlix`;
        
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Gagal fetch');
            allData = await response.json();
            
            let filteredContent = allData;

            if (search) {
                filteredContent = filteredContent.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
                if(listSearchInput) listSearchInput.value = search;
            } else if (country) {
                filteredContent = filteredContent.filter(item => item.country === country);
            } else if (type) {
                filteredContent = filteredContent.filter(item => item.type === type);
            }
            
            displayContent(filteredContent, currentPage, urlParams);

        } catch (error) {
            console.error('Gagal memuat list konten:', error);
            listGrid.innerHTML = `<p>Gagal memuat data. Cek console (F12).</p>`;
        }
    }

    if (listSearchInput) {
        listSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filtered = allData.filter(item => item.title.toLowerCase().includes(searchTerm));
            const params = new URLSearchParams();
            if (searchTerm) {
                params.set('search', searchTerm);
            }
            displayContent(filtered, 1, params);
        });
    }

    loadAndFilterContent();
});
