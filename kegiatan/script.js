// Data kegiatan dengan properti 'url' untuk halaman detail
const kegiatanData = [
    {
        id: 1,
        title: "Pelatihan Pengolahan Ikan bagi Nelayan Perempuan",
        date: "2025-03-15",
        description: "Pelatihan pengolahan ikan untuk meningkatkan nilai tambah hasil tangkapan nelayan. Kegiatan diikuti oleh 50 peserta dari berbagai desa pesisir Situbondo. Peserta diajarkan teknik pengolahan ikan menjadi berbagai produk bernilai tinggi seperti nugget, bakso, dan abon ikan.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
        type: "foto",
        category: "pelatihan",
        location: "Balai Pelatihan Perikanan",
        tags: ["pelatihan", "pengolahan ikan", "nelayan perempuan", "pemberdayaan", "UMKM", "inovatif"],
        youtubeUrl: "",
        url: "pelatihan-pengolahan-ikan.html",
        participants: 50,
        duration: "2 hari"
    },
    {
        id: 2,
        title: "Penyerahan Bantuan Mesin Kapal Nelayan",
        date: "2025-02-28",
        description: "Penyerahan bantuan 25 unit mesin kapal kepada nelayan tradisional di Pantai Pasir Putih. Bantuan ini untuk meningkatkan produktivitas tangkapan ikan dan mengurangi beban kerja nelayan. Setiap mesin memiliki kapasitas 15 PK dengan teknologi ramah lingkungan.",
        image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        category: "bantuan",
        location: "Pantai Pasir Putih",
        tags: ["bantuan", "mesin kapal", "nelayan tradisional", "produktivitas", "teknologi", "modernisasi"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "penyerahan-bantuan-mesin.html",
        participants: 75,
        duration: "1 hari"
    },
    {
        id: 3,
        title: "Monitoring Terumbu Karang bersama Kelompok Nelayan",
        date: "2025-01-20",
        description: "Kegiatan monitoring kesehatan terumbu karang di wilayah perairan Situbondo bersama kelompok nelayan yang tergabung dalam program konservasi. Monitoring dilakukan di 5 titik berbeda dengan melibatkan ahli kelautan dari universitas.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
        type: "foto",
        category: "konservasi",
        location: "Perairan Situbondo",
        tags: ["konservasi", "terumbu karang", "monitoring", "kelompok nelayan", "ekosistem", "keberlanjutan"],
        youtubeUrl: "",
        url: "monitoring-terumbu-karang.html",
        participants: 30,
        duration: "3 hari"
    },
    {
        id: 4,
        title: "Sosialisasi Kartu KUSUKA untuk Nelayan",
        date: "2024-12-10",
        description: "Sosialisasi dan pendaftaran Kartu KUSUKA (Kartu Usaha Perikanan) kepada nelayan di Kecamatan Jangkar. Kartu ini untuk identifikasi resmi pelaku usaha perikanan dan memudahkan akses terhadap program bantuan pemerintah.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        category: "sosialisasi",
        location: "Kecamatan Jangkar",
        tags: ["sosialisasi", "KUSUKA", "identifikasi", "nelayan", "administrasi", "bantuan pemerintah"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "sosialisasi-kartu-kusuka.html",
        participants: 120,
        duration: "1 hari"
    },
    {
        id: 5,
        title: "Pelatihan Keselamatan di Laut untuk Anak Buah Kapal",
        date: "2024-11-05",
        description: "Pelatihan keselamatan dan penyelamatan di laut bagi anak buah kapal (ABK) nelayan. Materi meliputi penggunaan alat keselamatan, prosedur darurat, pertolongan pertama, dan komunikasi maritim yang efektif.",
        image: "https://images.unsplash.com/photo-1518834103328-93d45986dce1?q=80&w=2070&auto=format&fit=crop",
        type: "foto",
        category: "pelatihan",
        location: "Pelabuhan Perikanan",
        tags: ["keselamatan", "pelatihan", "ABK", "penyelamatan", "laut", "safety first"],
        youtubeUrl: "",
        url: "pelatihan-keselamatan-laut.html",
        participants: 85,
        duration: "2 hari"
    },
    {
        id: 6,
        title: "Panen Perdana Budidaya Rumput Laut",
        date: "2024-10-18",
        description: "Panen perdana budidaya rumput laut oleh kelompok nelayan binaan di Desa Tambak Ukir. Program budidaya ini untuk diversifikasi mata pencaharian dan meningkatkan pendapatan keluarga nelayan dengan komoditas bernilai ekspor.",
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2074&auto=format&fit=crop",
        type: "foto",
        category: "budidaya",
        location: "Desa Tambak Ukir",
        tags: ["budidaya", "rumput laut", "panen", "diversifikasi", "ekspor", "ekonomi biru"],
        youtubeUrl: "",
        url: "panen-raya-rumput-laut.html",
        participants: 60,
        duration: "1 hari"
    },
    {
        id: 7,
        title: "Penandatanganan MoU dengan Universitas untuk Riset Perikanan",
        date: "2024-09-22",
        description: "Penandatanganan Memorandum of Understanding dengan Universitas Jember untuk kerjasama riset dan pengembangan teknologi perikanan di Situbondo. Kerjasama mencakup penelitian terumbu karang, budidaya berkelanjutan, dan pengolahan hasil perikanan.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        category: "kerjasama",
        location: "Kantor Dinas Perikanan",
        tags: ["MoU", "kerjasama", "riset", "teknologi", "universitas", "inovasi"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "kerjasama-riset-perikanan.html",
        participants: 45,
        duration: "Setengah hari"
    },
    {
        id: 8,
        title: "Pembersihan Pantai oleh Komunitas Nelayan Muda",
        date: "2024-08-14",
        description: "Aksi bersih-bersih pantai yang diinisiasi oleh komunitas nelayan muda Situbondo. Kegiatan ini diikuti oleh 150 peserta dari berbagai desa pesisir dan berhasil mengumpulkan 2 ton sampah plastik untuk didaur ulang.",
        image: "https://images.unsplash.com/photo-1536152470836-b943b246224c?q=80&w=2073&auto=format&fit=crop",
        type: "foto",
        category: "lingkungan",
        location: "Pantai Cemara",
        tags: ["lingkungan", "bersih pantai", "komunitas", "nelayan muda", "plastik", "daur ulang"],
        youtubeUrl: "",
        url: "aksi-bersih-pantai.html",
        participants: 150,
        duration: "1 hari"
    },
    {
        id: 9,
        title: "Peluncuran Aplikasi SIMATA untuk Nelayan",
        date: "2024-07-30",
        description: "Peluncuran aplikasi SIMATA (Sistem Informasi Nelayan) yang memudahkan nelayan mengakses informasi cuaca, harga ikan, dan lokasi penangkapan. Aplikasi ini juga dilengkapi fitur pemantauan kapal dan komunikasi darurat.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        category: "teknologi",
        location: "Aula Kantor Bupati",
        tags: ["aplikasi", "SIMATA", "teknologi", "informasi", "digital", "inovasi"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "peluncuran-aplikasi-simata.html",
        participants: 200,
        duration: "Setengah hari"
    },
    {
        id: 10,
        title: "Kunjungan Kerja Menteri Kelautan dan Perikanan",
        date: "2024-06-25",
        description: "Kunjungan kerja Menteri Kelautan dan Perikanan ke sentra perikanan Situbondo. Beliau meninjau langsung aktivitas nelayan, memberikan arahan, dan meresmikan bantuan alat tangkap ramah lingkungan untuk 50 kelompok nelayan.",
        image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2076&auto=format&fit=crop",
        type: "foto",
        category: "kunjungan",
        location: "Sentra Perikanan",
        tags: ["kunjungan", "menteri", "KKP", "arahan", "alat tangkap", "ramah lingkungan"],
        youtubeUrl: "",
        url: "kunjungan-menteri-kkp.html",
        participants: 300,
        duration: "1 hari"
    },
    {
        id: 11,
        title: "Festival Kuliner Ikan Nusantara",
        date: "2024-05-12",
        description: "Festival kuliner ikan dengan berbagai olahan tradisional dan modern. Kegiatan ini untuk promosi konsumsi ikan di masyarakat Situbondo dan meningkatkan apresiasi terhadap produk perikanan lokal. Menampilkan 50 stan kuliner dari berbagai daerah.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
        type: "foto",
        category: "festival",
        location: "Alun-alun Situbondo",
        tags: ["festival", "kuliner", "promosi", "konsumsi ikan", "wisata kuliner", "ekonomi kreatif"],
        youtubeUrl: "",
        url: "festival-kuliner-ikan.html",
        participants: 5000,
        duration: "3 hari"
    },
    {
        id: 12,
        title: "Pelatihan Pembuatan Alat Tangkap Ramah Lingkungan",
        date: "2024-04-08",
        description: "Pelatihan pembuatan alat tangkap ikan yang ramah lingkungan untuk mengurangi bycatch dan kerusakan ekosistem laut. Peserta diajarkan membuat bubu, jaring selektif, dan alat tangkap lain yang tidak merusak terumbu karang.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        category: "pelatihan",
        location: "Balai Latihan Kerja",
        tags: ["alat tangkap", "ramah lingkungan", "pelatihan", "ekosistem", "berkelanjutan", "konservasi"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "alat-tangkap-ramah-lingkungan.html",
        participants: 65,
        duration: "3 hari"
    }
];

// Inisialisasi AOS Animation
AOS.init({
    once: true,
    offset: 100,
    duration: 800,
    easing: 'ease-out-cubic',
    delay: 100
});

// Variabel Global
let currentPage = 1;
const itemsPerPage = 6;
let currentFilteredData = [...kegiatanData];

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    // Set tahun di footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Set total kegiatan di hero
    document.getElementById('totalKegiatan').textContent = kegiatanData.length;
    
    // Tampilkan semua kegiatan saat pertama kali dimuat
    displayKegiatan(kegiatanData, currentPage);
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup navbar scroll effect
    setupNavbarScroll();
    
    // Setup scroll to top button
    setupScrollToTop();
    
    // Setup tahun filter
    setupYearFilter();
    
    // Setup light gallery (jika diperlukan)
    // setupLightGallery();
});

// Fungsi untuk menampilkan kegiatan
function displayKegiatan(data, page = 1) {
    const container = document.getElementById('kegiatanContainer');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');
    const paginationContainer = document.getElementById('paginationContainer');
    
    // Simpan data yang difilter
    currentFilteredData = [...data];
    
    // Tampilkan loading
    loading.style.display = 'block';
    container.innerHTML = '';
    paginationContainer.innerHTML = '';
    emptyState.style.display = 'none';
    
    // Simulasi loading dengan setTimeout
    setTimeout(() => {
        loading.style.display = 'none';
        
        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        // Hitung pagination
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        
        // Generate HTML untuk setiap kegiatan
        let html = '';
        
        paginatedData.forEach((kegiatan, index) => {
            const date = new Date(kegiatan.date);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            const bulan = String(date.getMonth() + 1).padStart(2, '0');
            const tahun = date.getFullYear();
            
            // Delay untuk animasi bertahap
            const animationDelay = (index % 3) * 100;
            
            // Generate Card
            html += `
            <div class="col-lg-4 col-md-6" 
                 data-aos="fade-up" 
                 data-aos-delay="${animationDelay}"
                 data-bulan="${bulan}" 
                 data-tahun="${tahun}"
                 data-category="${kegiatan.category}">
                <div class="kegiatan-card hover-lift">
                    <div class="kegiatan-img-container">
                        <img src="${kegiatan.image}" 
                             class="kegiatan-img" 
                             alt="${kegiatan.title}"
                             loading="lazy"
                             onerror="this.src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop'">
                        <div class="kegiatan-badge ${kegiatan.type}">
                            <i class="fas ${kegiatan.type === 'youtube' ? 'fa-play-circle' : 'fa-camera'} me-1"></i>
                            ${kegiatan.type === 'youtube' ? 'Video' : 'Foto'}
                        </div>
                        <div class="kegiatan-overlay"></div>
                    </div>
                    <div class="kegiatan-content">
                        <div class="kegiatan-date">
                            <i class="fas fa-calendar-alt"></i> ${formattedDate}
                            <span class="ms-2">
                                <i class="fas fa-users me-1"></i>${kegiatan.participants} peserta
                            </span>
                        </div>
                        <h3 class="kegiatan-title">${kegiatan.title}</h3>
                        <p class="kegiatan-desc">${kegiatan.description}</p>
                        
                        <div class="kegiatan-tags">
                            ${kegiatan.tags.slice(0, 3).map(tag => `<span class="kegiatan-tag">${tag}</span>`).join('')}
                            ${kegiatan.tags.length > 3 ? `<span class="kegiatan-tag">+${kegiatan.tags.length - 3}</span>` : ''}
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
                            <a href="${kegiatan.url}" class="btn-kegiatan">
                                <i class="fas ${kegiatan.type === 'youtube' ? 'fa-play-circle' : 'fa-eye'} me-2"></i>
                                ${kegiatan.type === 'youtube' ? 'Tonton Video' : 'Lihat Detail'}
                            </a>
                            <button class="btn btn-outline-primary btn-sm" onclick="showKegiatanDetail(${kegiatan.id})">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Generate pagination jika diperlukan
        if (totalPages > 1) {
            let paginationHtml = `
            <nav aria-label="Navigasi halaman kegiatan">
                <ul class="pagination">
            `;
            
            // Previous button
            paginationHtml += `
            <li class="page-item ${page === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${page - 1}); return false;" aria-label="Sebelumnya">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
            `;
            
            // Page numbers
            const maxVisiblePages = 5;
            let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            // First page
            if (startPage > 1) {
                paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
                </li>
                ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                `;
            }
            
            // Page numbers
            for (let i = startPage; i <= endPage; i++) {
                paginationHtml += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
                `;
            }
            
            // Last page
            if (endPage < totalPages) {
                paginationHtml += `
                ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                <li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
                </li>
                `;
            }
            
            // Next button
            paginationHtml += `
            <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${page + 1}); return false;" aria-label="Berikutnya">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
            `;
            
            paginationHtml += `
                </ul>
                <div class="text-center mt-3">
                    <small class="text-muted">Halaman ${page} dari ${totalPages} • ${data.length} kegiatan ditemukan</small>
                </div>
            </nav>
            `;
            
            paginationContainer.innerHTML = paginationHtml;
        } else {
            paginationContainer.innerHTML = `
            <div class="text-center">
                <small class="text-muted">Menampilkan ${data.length} kegiatan</small>
            </div>
            `;
        }
        
        // Update current page
        currentPage = page;
        
    }, 500); // Simulasi loading 500ms
}

// Fungsi untuk mengubah halaman
function changePage(page) {
    displayKegiatan(currentFilteredData, page);
    
    // Scroll ke atas dengan smooth
    const sectionTop = document.querySelector('.kegiatan-section').offsetTop - 120;
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
    
    // Update URL hash (optional)
    // window.location.hash = `page-${page}`;
}

// Fungsi filter kegiatan
function filterKegiatan() {
    const bulan = document.getElementById('filterBulan').value;
    const tahun = document.getElementById('filterTahun').value;
    const keyword = document.getElementById('filterKeyword').value.toLowerCase().trim();
    
    let filtered = kegiatanData;
    
    // Filter berdasarkan bulan
    if (bulan) {
        filtered = filtered.filter(kegiatan => {
            const date = new Date(kegiatan.date);
            const kegiatanBulan = String(date.getMonth() + 1).padStart(2, '0');
            return kegiatanBulan === bulan;
        });
    }
    
    // Filter berdasarkan tahun
    if (tahun) {
        filtered = filtered.filter(kegiatan => {
            const date = new Date(kegiatan.date);
            const kegiatanTahun = date.getFullYear();
            return kegiatanTahun === parseInt(tahun);
        });
    }
    
    // Filter berdasarkan keyword
    if (keyword) {
        filtered = filtered.filter(kegiatan => {
            const searchText = `
                ${kegiatan.title.toLowerCase()}
                ${kegiatan.description.toLowerCase()}
                ${kegiatan.tags.join(' ').toLowerCase()}
                ${kegiatan.location.toLowerCase()}
                ${kegiatan.category ? kegiatan.category.toLowerCase() : ''}
            `;
            return searchText.includes(keyword);
        });
    }
    
    // Reset ke halaman pertama
    currentPage = 1;
    
    // Tampilkan hasil filter
    displayKegiatan(filtered, currentPage);
    
    // Update URL hash dengan filter (optional)
    updateFilterHash(bulan, tahun, keyword);
}

// Fungsi reset filter
function resetFilter() {
    document.getElementById('filterBulan').value = '';
    document.getElementById('filterTahun').value = '';
    document.getElementById('filterKeyword').value = '';
    
    // Reset ke halaman pertama
    currentPage = 1;
    
    // Tampilkan semua kegiatan
    displayKegiatan(kegiatanData, currentPage);
    
    // Clear URL hash
    window.location.hash = '';
}

// Fungsi untuk mengupdate hash URL dengan filter
function updateFilterHash(bulan, tahun, keyword) {
    const params = new URLSearchParams();
    if (bulan) params.set('bulan', bulan);
    if (tahun) params.set('tahun', tahun);
    if (keyword) params.set('q', keyword);
    
    const hash = params.toString() ? `filter?${params.toString()}` : '';
    window.location.hash = hash;
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('btnFilter').addEventListener('click', filterKegiatan);
    document.getElementById('btnReset').addEventListener('click', resetFilter);
    document.getElementById('btnResetEmpty').addEventListener('click', resetFilter);
    document.getElementById('btnSearch').addEventListener('click', filterKegiatan);
    
    // Enter key untuk search
    document.getElementById('filterKeyword').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterKegiatan();
        }
    });
    
    // Auto filter ketika select berubah (optional)
    // document.getElementById('filterBulan').addEventListener('change', filterKegiatan);
    // document.getElementById('filterTahun').addEventListener('change', filterKegiatan);
}

// Setup navbar scroll effect
function setupNavbarScroll() {
    const nav = document.getElementById('mainNav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Setup scroll to top button
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Setup year filter options
function setupYearFilter() {
    const tahunSelect = document.getElementById('filterTahun');
    
    // Dapatkan tahun unik dari data kegiatan
    const tahunUnik = [...new Set(kegiatanData.map(k => new Date(k.date).getFullYear()))];
    
    // Urutkan dari yang terbaru
    tahunUnik.sort((a, b) => b - a);
    
    // Tambahkan options
    tahunUnik.forEach(tahun => {
        const option = document.createElement('option');
        option.value = tahun;
        option.textContent = tahun;
        tahunSelect.appendChild(option);
    });
}

// Fungsi untuk menampilkan detail kegiatan di modal
function showKegiatanDetail(id) {
    const kegiatan = kegiatanData.find(k => k.id === id);
    if (!kegiatan) return;
    
    const date = new Date(kegiatan.date);
    const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Update modal content
    document.getElementById('kegiatanModalTitle').textContent = kegiatan.title;
    document.getElementById('modalDate').textContent = formattedDate;
    document.getElementById('modalType').textContent = kegiatan.type === 'youtube' ? 'Video YouTube' : 'Foto Dokumentasi';
    document.getElementById('modalCategory').textContent = kegiatan.category.charAt(0).toUpperCase() + kegiatan.category.slice(1);
    document.getElementById('modalLocation').textContent = kegiatan.location;
    document.getElementById('modalDescription').textContent = kegiatan.description;
    document.getElementById('modalDetailLink').href = kegiatan.url;
    
    // Update tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = kegiatan.tags.map(tag => 
        `<span class="kegiatan-tag">${tag}</span>`
    ).join('');
    
    // Update media (image/video)
    const imageElement = document.getElementById('modalImage');
    const videoContainer = document.getElementById('videoContainer');
    const videoElement = document.getElementById('modalVideo');
    const youtubeLink = document.getElementById('modalYoutubeLink');
    const youtubeLinkBtn = youtubeLink.querySelector('a');
    
    if (kegiatan.type === 'youtube') {
        imageElement.style.display = 'none';
        videoContainer.style.display = 'block';
        videoElement.src = kegiatan.youtubeUrl;
        youtubeLinkBtn.href = kegiatan.youtubeUrl.replace('/embed/', '/watch?v=');
        youtubeLink.style.display = 'block';
    } else {
        imageElement.style.display = 'block';
        videoContainer.style.display = 'none';
        imageElement.src = kegiatan.image;
        youtubeLink.style.display = 'none';
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('kegiatanModal'));
    modal.show();
}

// Fungsi untuk setup light gallery (opsional)
function setupLightGallery() {
    // Inisialisasi light gallery jika diperlukan
    // lightGallery(document.getElementById('kegiatanContainer'), {
    //     selector: '.kegiatan-img',
    //     download: false,
    //     counter: false
    // });
}

// Fungsi untuk memuat filter dari URL hash
function loadFilterFromHash() {
    if (window.location.hash.includes('filter?')) {
        const hashParams = window.location.hash.split('?')[1];
        const params = new URLSearchParams(hashParams);
        
        const bulan = params.get('bulan');
        const tahun = params.get('tahun');
        const keyword = params.get('q');
        
        if (bulan) document.getElementById('filterBulan').value = bulan;
        if (tahun) document.getElementById('filterTahun').value = tahun;
        if (keyword) document.getElementById('filterKeyword').value = keyword;
        
        // Terapkan filter
        if (bulan || tahun || keyword) {
            setTimeout(filterKegiatan, 100);
        }
    }
}

// Panggil fungsi untuk memuat filter dari hash saat halaman dimuat
setTimeout(loadFilterFromHash, 500);

// Export fungsi untuk digunakan di global scope (jika diperlukan)
window.changePage = changePage;
window.filterKegiatan = filterKegiatan;
window.resetFilter = resetFilter;
window.showKegiatanDetail = showKegiatanDetail;
