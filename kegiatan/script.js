// Data kegiatan dengan properti 'url' untuk halaman detail
const kegiatanData = [
    {
        id: 1,
        title: "Pelatihan Pengolahan Ikan bagi Nelayan Perempuan",
        date: "2025-03-15",
        description: "Pelatihan pengolahan ikan untuk meningkatkan nilai tambah hasil tangkapan nelayan. Kegiatan diikuti oleh 50 peserta dari berbagai desa pesisir Situbondo.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
        type: "foto",
        location: "Balai Pelatihan Perikanan",
        tags: ["pelatihan", "pengolahan ikan", "nelayan perempuan", "pemberdayaan"],
        youtubeUrl: "",
        url: "pelatihan-pengolahan-ikan.html"
    },
    {
        id: 2,
        title: "Penyerahan Bantuan Mesin Kapal Nelayan",
        date: "2025-02-28",
        description: "Penyerahan bantuan 25 unit mesin kapal kepada nelayan tradisional di Pantai Pasir Putih. Bantuan ini untuk meningkatkan produktivitas tangkapan ikan.",
        image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        location: "Pantai Pasir Putih",
        tags: ["bantuan", "mesin kapal", "nelayan tradisional", "produktivitas"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "penyerahan-bantuan-mesin.html"
    },
    {
        id: 3,
        title: "Monitoring Terumbu Karang bersama Kelompok Nelayan",
        date: "2025-01-20",
        description: "Kegiatan monitoring kesehatan terumbu karang di wilayah perairan Situbondo bersama kelompok nelayan yang tergabung dalam program konservasi.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
        type: "foto",
        location: "Perairan Situbondo",
        tags: ["konservasi", "terumbu karang", "monitoring", "kelompok nelayan"],
        youtubeUrl: "",
        url: "monitoring-terumbu-karang.html"
    },
    {
        id: 4,
        title: "Sosialisasi Kartu KUSUKA untuk Nelayan",
        date: "2024-12-10",
        description: "Sosialisasi dan pendaftaran Kartu KUSUKA (Kartu Usaha Perikanan) kepada nelayan di Kecamatan Jangkar. Kartu ini untuk identifikasi resmi pelaku usaha perikanan.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        location: "Kecamatan Jangkar",
        tags: ["sosialisasi", "KUSUKA", "identifikasi", "nelayan"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "sosialisasi-kartu-kusuka.html"
    },
    {
        id: 5,
        title: "Pelatihan Keselamatan di Laut untuk Anak Buah Kapal",
        date: "2024-11-05",
        description: "Pelatihan keselamatan dan penyelamatan di laut bagi anak buah kapal (ABK) nelayan. Materi meliputi penggunaan alat keselamatan dan prosedur darurat.",
        image: "https://images.unsplash.com/photo-1518834103328-93d45986dce1?q=80&w=2070&auto=format&fit=crop",
        type: "foto",
        location: "Pelabuhan Perikanan",
        tags: ["keselamatan", "pelatihan", "ABK", "penyelamatan"],
        youtubeUrl: "",
        url: "pelatihan-keselamatan-laut.html"
    },
    {
        id: 6,
        title: "Panen Perdana Budidaya Rumput Laut",
        date: "2024-10-18",
        description: "Panen perdana budidaya rumput laut oleh kelompok nelayan binaan di Desa Tambak Ukir. Program budidaya ini untuk diversifikasi mata pencaharian.",
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2074&auto=format&fit=crop",
        type: "foto",
        location: "Desa Tambak Ukir",
        tags: ["budidaya", "rumput laut", "panen", "diversifikasi"],
        youtubeUrl: "",
        url: "panen-raya-rumput-laut.html"
    },
    {
        id: 7,
        title: "Penandatanganan MoU dengan Universitas untuk Riset Perikanan",
        date: "2024-09-22",
        description: "Penandatanganan Memorandum of Understanding dengan Universitas Jember untuk kerjasama riset dan pengembangan teknologi perikanan di Situbondo.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        location: "Kantor Dinas Perikanan",
        tags: ["MoU", "kerjasama", "riset", "teknologi"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "kerjasama-riset-perikanan.html"
    },
    {
        id: 8,
        title: "Pembersihan Pantai oleh Komunitas Nelayan Muda",
        date: "2024-08-14",
        description: "Aksi bersih-bersih pantai yang diinisiasi oleh komunitas nelayan muda Situbondo. Kegiatan ini diikuti oleh 150 peserta dari berbagai desa pesisir.",
        image: "https://images.unsplash.com/photo-1536152470836-b943b246224c?q=80&w=2073&auto=format&fit=crop",
        type: "foto",
        location: "Pantai Cemara",
        tags: ["lingkungan", "bersih pantai", "komunitas", "nelayan muda"],
        youtubeUrl: "",
        url: "aksi-bersih-pantai.html"
    },
    {
        id: 9,
        title: "Peluncuran Aplikasi SIMATA untuk Nelayan",
        date: "2024-07-30",
        description: "Peluncuran aplikasi SIMATA (Sistem Informasi Nelayan) yang memudahkan nelayan mengakses informasi cuaca, harga ikan, dan lokasi penangkapan.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        location: "Aula Kantor Bupati",
        tags: ["aplikasi", "SIMATA", "teknologi", "informasi"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "peluncuran-aplikasi-simata.html"
    },
    {
        id: 10,
        title: "Kunjungan Kerja Menteri Kelautan dan Perikanan",
        date: "2024-06-25",
        description: "Kunjungan kerja Menteri Kelautan dan Perikanan ke sentra perikanan Situbondo. Beliau meninjau langsung aktivitas nelayan dan memberikan arahan.",
        image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2076&auto=format&fit=crop",
        type: "foto",
        location: "Sentra Perikanan",
        tags: ["kunjungan", "menteri", "KKP", "arahan"],
        youtubeUrl: "",
        url: "kunjungan-menteri-kkp.html"
    },
    {
        id: 11,
        title: "Festival Kuliner Ikan Nusantara",
        date: "2024-05-12",
        description: "Festival kuliner ikan dengan berbagai olahan tradisional dan modern. Kegiatan ini untuk promosi konsumsi ikan di masyarakat Situbondo.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
        type: "foto",
        location: "Alun-alun Situbondo",
        tags: ["festival", "kuliner", "promosi", "konsumsi ikan"],
        youtubeUrl: "",
        url: "festival-kuliner-ikan.html"
    },
    {
        id: 12,
        title: "Pelatihan Pembuatan Alat Tangkap Ramah Lingkungan",
        date: "2024-04-08",
        description: "Pelatihan pembuatan alat tangkap ikan yang ramah lingkungan untuk mengurangi bycatch dan kerusakan ekosistem laut.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
        type: "youtube",
        location: "Balai Latihan Kerja",
        tags: ["alat tangkap", "ramah lingkungan", "pelatihan", "ekosistem"],
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        url: "alat-tangkap-ramah-lingkungan.html"
    }
];

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi AOS Animation
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
    });

    // Tampilkan semua kegiatan saat pertama kali dimuat
    displayKegiatan(kegiatanData);
    setupEventListeners();
    setupNavbarScroll();
});

// Fungsi untuk menampilkan kegiatan
function displayKegiatan(data, page = 1, itemsPerPage = 6) {
    const container = document.getElementById('kegiatanContainer');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');
    const paginationContainer = document.getElementById('paginationContainer');
    
    // Tampilkan loading
    loading.style.display = 'block';
    container.innerHTML = '';
    paginationContainer.innerHTML = '';
    emptyState.style.display = 'none';
    
    // Simulasi loading
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
        
        paginatedData.forEach(kegiatan => {
            const date = new Date(kegiatan.date);
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            const bulan = String(date.getMonth() + 1).padStart(2, '0');
            const tahun = date.getFullYear();
            
            // Generate Card
            html += `
            <div class="col-lg-4 col-md-6" data-aos="fade-up" data-bulan="${bulan}" data-tahun="${tahun}">
                <div class="kegiatan-card">
                    <div class="kegiatan-img-container">
                        <img src="${kegiatan.image}" class="kegiatan-img" alt="${kegiatan.title}">
                        <div class="kegiatan-badge ${kegiatan.type}">
                            <i class="fas ${kegiatan.type === 'youtube' ? 'fa-play-circle' : 'fa-camera'} me-1"></i>
                            ${kegiatan.type === 'youtube' ? 'Video' : 'Foto'}
                        </div>
                    </div>
                    <div class="kegiatan-content">
                        <div class="kegiatan-date">
                            <i class="fas fa-calendar-alt"></i> ${formattedDate}
                        </div>
                        <h3 class="kegiatan-title">${kegiatan.title}</h3>
                        <p class="kegiatan-desc">${kegiatan.description}</p>
                        
                        <div class="kegiatan-tags">
                            ${kegiatan.tags.map(tag => `<span class="kegiatan-tag">${tag}</span>`).join('')}
                        </div>
                        
                        <a href="${kegiatan.url}" class="btn-kegiatan">
                            <i class="fas ${kegiatan.type === 'youtube' ? 'fa-play-circle' : 'fa-eye'} me-2"></i>
                            ${kegiatan.type === 'youtube' ? 'Tonton Video' : 'Lihat Detail'}
                        </a>
                    </div>
                </div>
            </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Generate pagination jika diperlukan
        if (totalPages > 1) {
            let paginationHtml = `
            <nav aria-label="Page navigation">
                <ul class="pagination">
            `;
            
            // Previous button
            paginationHtml += `
            <li class="page-item ${page === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${page - 1}); return false;">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
            `;
            
            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
                `;
            }
            
            // Next button
            paginationHtml += `
            <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${page + 1}); return false;">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
            `;
            
            paginationHtml += `
                </ul>
            </nav>
            `;
            
            paginationContainer.innerHTML = paginationHtml;
        }
        
        // Simpan data untuk pagination
        container.setAttribute('data-current-page', page);
        container.setAttribute('data-filtered-items', JSON.stringify(data));
        
    }, 500); // Simulasi loading 500ms
}

// Fungsi untuk mengubah halaman
function changePage(page) {
    const container = document.getElementById('kegiatanContainer');
    const filteredItems = JSON.parse(container.getAttribute('data-filtered-items') || '[]');
    displayKegiatan(filteredItems, page);
    
    // Scroll ke atas
    window.scrollTo({
        top: document.querySelector('.kegiatan-section').offsetTop - 100,
        behavior: 'smooth'
    });
}

// Fungsi filter kegiatan
function filterKegiatan() {
    const bulan = document.getElementById('filterBulan').value;
    const tahun = document.getElementById('filterTahun').value;
    const keyword = document.getElementById('filterKeyword').value.toLowerCase();
    
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
            return (
                kegiatan.title.toLowerCase().includes(keyword) ||
                kegiatan.description.toLowerCase().includes(keyword) ||
                kegiatan.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
                kegiatan.location.toLowerCase().includes(keyword)
            );
        });
    }
    
    // Tampilkan hasil filter
    displayKegiatan(filtered);
}

// Fungsi reset filter
function resetFilter() {
    document.getElementById('filterBulan').value = '';
    document.getElementById('filterTahun').value = '';
    document.getElementById('filterKeyword').value = '';
    displayKegiatan(kegiatanData);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('btnFilter').addEventListener('click', filterKegiatan);
    document.getElementById('btnReset').addEventListener('click', resetFilter);
    document.getElementById('btnResetEmpty').addEventListener('click', resetFilter);
    document.getElementById('filterKeyword').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterKegiatan();
        }
    });
}

// Efek Navbar saat scroll
function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const nav = document.getElementById('mainNav');
        if (window.scrollY > 50) {
            nav.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            nav.style.background = "rgba(255, 255, 255, 0.98)";
        } else {
            nav.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
            nav.style.background = "rgba(255, 255, 255, 0.95)";
        }
    });
}

// (Optional) Fungsi showKegiatanDetail tetap disimpan jika ingin digunakan kembali di masa depan
// atau untuk memanipulasi modal secara manual.
function showKegiatanDetail(id) {
    const kegiatan = kegiatanData.find(k => k.id === id);
    if (!kegiatan) return;
    
    const date = new Date(kegiatan.date);
    const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    
    document.getElementById('kegiatanModalTitle').textContent = kegiatan.title;
    document.getElementById('modalDate').textContent = formattedDate;
    document.getElementById('modalType').textContent = kegiatan.type === 'youtube' ? 'Video YouTube' : 'Foto Dokumentasi';
    document.getElementById('modalLocation').textContent = kegiatan.location;
    document.getElementById('modalDescription').textContent = kegiatan.description;
    
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = kegiatan.tags.map(tag => `<span class="kegiatan-tag">${tag}</span>`).join('');
    
    const imageElement = document.getElementById('modalImage');
    const videoContainer = document.getElementById('videoContainer');
    const videoElement = document.getElementById('modalVideo');
    const youtubeLink = document.getElementById('modalYoutubeLink');
    
    if (kegiatan.type === 'youtube') {
        imageElement.style.display = 'none';
        videoContainer.style.display = 'block';
        videoElement.src = kegiatan.youtubeUrl;
        const youtubeBtn = youtubeLink.querySelector('a');
        youtubeBtn.href = kegiatan.youtubeUrl.replace('/embed/', '/watch?v=');
        youtubeLink.style.display = 'block';
    } else {
        imageElement.style.display = 'block';
        videoContainer.style.display = 'none';
        imageElement.src = kegiatan.image;
        youtubeLink.style.display = 'none';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('kegiatanModal'));
    modal.show();
}
