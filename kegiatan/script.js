// Data kegiatan dengan properti 'url' untuk halaman detail
const kegiatanData = [
    {
        "id": 1764988551018,
        "title": "Pelatihan Teknologi Penangkapan Ikan dan Perawatan Jaring Ikan untuk Nelayan Situbondo",
        "date": "2025-11-10",
        "description": "Pelatihan ini merupakan bentuk komitmen pemerintah daerah dalam meningkatkan kapasitas nelayan tradisional melalui transfer teknologi dan pengetahuan. Dengan pendekatan praktis dan interaktif, kegiatan berhasil memberikan keterampilan nyata yang langsung dapat diterapkan nelayan dalam operasional penangkapan ikan sehari-hari, sekaligus mendukung keberlanjutan sumber daya perikanan di wilayah Situbondo.",
        "images": [
            "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/dokumentasi/2025/november/gambar4.jpeg"
        ],
        "type": "multimedia",
        "category": "pelatihan",
        "location": "Cafe Besuki Tempo Doloe",
        "tags": [
            "Nelayan Situbondo",
            "Situbondo Naik Kelas",
            "Bantuan Jaring",
            "Dinas Peternakan dan Perikanan",
            "Bidang Pemberdayaan Nelayan",
            "Cafe Besuki Tempo Doloe"
        ],
        "youtubeUrls": [
            "https://www.youtube.com/embed/6TbwAzsGcpM"
        ],
        "url": "https://dinasperikanansitubondo.com/dokumentasi/2025/november/kegiatan-pelatihan-teknologi-penangkapan-ikan-besuki.html",
        "participants": 0,
        "duration": ""
    },
    {
        "id": 1764993106377,
        "title": "Pendampingan Penenggelaman Fish Apartment",
        "date": "2025-11-26",
        "description": "Program pendampingan penenggelaman fish apartment merupakan inisiatif konservasi perairan yang mengedepankan pendekatan partisipatif masyarakat. Kegiatan ini menekankan transfer pengetahuan teknis kepada nelayan lokal dalam pemasangan artificial reef, dengan tujuan menciptakan habitat baru bagi biota laut dan mengurangi tekanan penangkapan di area tradisional.",
        "images": [
            "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/dokumentasi/2025/november/foto7.jpeg"
        ],
        "type": "foto",
        "category": "konservasi",
        "location": "Desa Pasir Putih dan Desa Kalianget",
        "tags": [
            "Fist Apartment",
            "Rumah Ikan Buatan",
            "Artificial Reef",
            "Konservasi Perairan",
            "Ekosistem Laut",
            "Penenggelaman Modul Ikan",
            "Rehabilitasi Sumber daya Ikan",
            "Terumbu Buatan"
        ],
        "youtubeUrls": [],
        "url": "https://dinasperikanansitubondo.com/dokumentasi/2025/november/pendampingan-penenggelaman-fist-apartment.html",
        "participants": 0,
        "duration": ""
    },
    {
        "id": 1769662672667,
        "title": "Kerja Bakti Dalam Rangka Persiapan Peresmian Pasar Higienis",
        "date": "2026-01-19",
        "description": "Kerja bakti dalam rangka persiapan peresmian pasar higienes ikan segar mimbo yang dihadiri oleh camat banyuputih beserta staf, pemdes sumberanyar dan tim bidang pemberdayaan nelayan dari dinas peternakan dan perikanan kabupaten situbondo.",
        "images": [
            "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/foto/kerjabakti/kerjabakti1.jpeg",
            "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/foto/kerjabakti/kerjabakti2.jpeg",
            "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/foto/kerjabakti/kerjabakti3.jpeg",
            "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/foto/kerjabakti/kerjabakti4.jpeg",
            "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/foto/kerjabakti/kerjabakti5.jpeg"
        ],
        "type": "multimedia",
        "category": "lainnya",
        "location": "Desa Sumberanyar Kecamatan Banyuputih",
        "tags": [
            "Dinas Peternakan & Perikanan"
        ],
        "youtubeUrls": [
            "https://www.youtube.com/embed/5n4ySz4mEPE"
        ],
        "url": "https://dinasperikanansitubondo.com/dokumentasi/2026/januari/kegiatan-kerja-bakti-bidang-pemberdayaan-nelayan-desa-sumberanyar.html",
        "participants": 0,
        "duration": ""
    },
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
let isAuthenticated = false;
const ADMIN_PASSWORD = "19450817";

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    // Set tahun di footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Hitung dan set statistik
    calculateAndSetStatistics();
    
    // Tampilkan semua kegiatan saat pertama kali dimuat
    displayKegiatan(kegiatanData, currentPage);
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup navbar scroll effect
    setupNavbarScroll();
    
    // Setup scroll to top button
    setupScrollToTop();
    
    // Setup tahun filter (dinamis)
    setupYearFilter();
    
    // Setup password protection untuk generator
    setupPasswordProtection();
    
    // Setup modal event listeners
    setupModalEvents();
});

// Setup modal event listeners
function setupModalEvents() {
    const modalElement = document.getElementById('kegiatanModal');
    
    modalElement.addEventListener('shown.bs.modal', function() {
        // Reset carousel setiap kali modal ditampilkan
        const carousel = modalElement.querySelector('#modalCarousel');
        if (carousel) {
            const bsCarousel = new bootstrap.Carousel(carousel);
            bsCarousel.to(0);
        }
    });
    
    modalElement.addEventListener('hidden.bs.modal', function() {
        // Reset modal content
        const carouselInner = document.getElementById('modalCarouselInner');
        if (carouselInner) carouselInner.innerHTML = '';
        
        const videoList = document.getElementById('modalVideoList');
        if (videoList) videoList.innerHTML = '';
    });
}

// Fungsi untuk menghitung dan menampilkan statistik
function calculateAndSetStatistics() {
    // Total kegiatan
    document.getElementById('totalKegiatan').textContent = kegiatanData.length;
    
    // Total tahun aktif (unik)
    const tahunUnik = [...new Set(kegiatanData.map(k => new Date(k.date).getFullYear()))];
    document.getElementById('totalTahun').textContent = tahunUnik.length;
    
    // Total lokasi (unik)
    const lokasiUnik = [...new Set(kegiatanData.map(k => k.location))];
    document.getElementById('totalLokasi').textContent = lokasiUnik.length;
    
    // Total tags (semua tag unik)
    const semuaTags = kegiatanData.flatMap(k => k.tags);
    const tagUnik = [...new Set(semuaTags)];
    document.getElementById('totalTags').textContent = tagUnik.length;
}

// Fungsi untuk menampilkan kegiatan (DIPERBAIKI)
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

            // Logic untuk menentukan gambar utama
            let mainImage = kegiatan.images && kegiatan.images.length > 0 
                ? kegiatan.images[0] 
                : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop';

            // Logic untuk peserta (Dinamis, tidak hardcode 50)
            let participantHtml = '';
            if (kegiatan.participants && kegiatan.participants > 0) {
                participantHtml = `
                    <span class="ms-2">
                        <i class="fas fa-users me-1"></i>${kegiatan.participants} peserta
                    </span>`;
            } else {
                participantHtml = `
                    <span class="ms-2">
                        <i class="fas fa-globe me-1"></i>Umum
                    </span>`;
            }
            
            // Tentukan jenis media dan teks tombol
            let buttonIcon = 'fa-eye';
            let buttonText = 'Lihat Detail';
            
            if (kegiatan.type === 'youtube' || (kegiatan.youtubeUrls && kegiatan.youtubeUrls.length > 0)) {
                buttonIcon = 'fa-play-circle';
                buttonText = 'Tonton Video';
            } else if (kegiatan.type === 'multimedia' || (kegiatan.images && kegiatan.images.length > 0 && kegiatan.youtubeUrls && kegiatan.youtubeUrls.length > 0)) {
                buttonIcon = 'fa-photo-video';
                buttonText = 'Lihat Media';
            }
            
            // Validasi URL untuk mencegah error
            const detailUrl = validateUrl(kegiatan.url);
            
            // Generate Card dengan tombol baru
            html += `
            <div class="col-lg-4 col-md-6" 
                 data-aos="fade-up" 
                 data-aos-delay="${animationDelay}"
                 data-bulan="${bulan}" 
                 data-tahun="${tahun}"
                 data-category="${kegiatan.category}">
                <div class="kegiatan-card hover-lift">
                    <div class="kegiatan-img-container">
                        <img src="${mainImage}" 
                             class="kegiatan-img" 
                             alt="${kegiatan.title}"
                             loading="lazy"
                             onerror="this.src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop'">
                    </div>
                    <div class="kegiatan-content">
                        <div class="kegiatan-date">
                            <i class="fas fa-calendar-alt"></i> ${formattedDate}
                            ${participantHtml}
                        </div>
                        <h3 class="kegiatan-title">${kegiatan.title}</h3>
                        <p class="kegiatan-desc">${kegiatan.description}</p>
                        
                        <div class="kegiatan-tags">
                            ${kegiatan.tags.slice(0, 3).map(tag => `<span class="kegiatan-tag">${tag}</span>`).join('')}
                            ${kegiatan.tags.length > 3 ? `<span class="kegiatan-tag">+${kegiatan.tags.length - 3}</span>` : ''}
                        </div>
                        
                        <div class="card-buttons">
                            <a href="${detailUrl}" class="btn-card-detail" target="_blank" onclick="event.stopPropagation();">
                                <i class="fas ${buttonIcon} me-2"></i>
                                ${buttonText}
                            </a>
                            <button class="btn-card-preview" onclick="event.stopPropagation(); showKegiatanDetail(${kegiatan.id})" title="Quick Preview">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Tambahkan event listener untuk klik card (untuk membuka modal)
        document.querySelectorAll('.kegiatan-card').forEach((card, index) => {
            card.addEventListener('click', function(e) {
                // Cegah jika yang diklik adalah link atau button
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
                    e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                
                const kegiatan = paginatedData[index];
                if (kegiatan) {
                    showKegiatanDetail(kegiatan.id);
                }
            });
        });
        
        // Generate pagination jika diperlukan
        if (totalPages > 1) {
            generatePagination(totalPages, page, data.length);
        } else {
            paginationContainer.innerHTML = `
            <div class="text-center">
                <small class="text-muted">Menampilkan ${data.length} kegiatan</small>
            </div>
            `;
        }
        
        currentPage = page;
        
    }, 500);
}

// Fungsi validasi URL (DIPERBAIKI)
function validateUrl(url) {
    if (!url) return '#';
    
    // Jika URL sudah lengkap
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // Jika dimulai dengan www.
    if (url.startsWith('www.')) {
        return 'https://' + url;
    }
    
    // Jika URL relatif
    if (url.startsWith('/')) {
        return 'https://dinasperikanansitubondo.com' + url;
    }
    
    // Default
    return 'https://dinasperikanansitubondo.com/' + url;
}

// Fungsi untuk generate pagination
function generatePagination(totalPages, currentPage, totalItems) {
    const paginationContainer = document.getElementById('paginationContainer');
    
    let paginationHtml = `
    <nav aria-label="Navigasi halaman kegiatan">
        <ul class="pagination">
    `;
    
    // Previous button
    paginationHtml += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;" aria-label="Sebelumnya">
            <i class="fas fa-chevron-left"></i>
        </a>
    </li>
    `;
    
    // Page numbers logic
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHtml += `
        <li class="page-item">
            <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
        </li>
        ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
        </li>
        `;
    }
    
    if (endPage < totalPages) {
        paginationHtml += `
        ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        <li class="page-item">
            <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
        </li>
        `;
    }
    
    paginationHtml += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;" aria-label="Berikutnya">
            <i class="fas fa-chevron-right"></i>
        </a>
    </li>
    `;
    
    paginationHtml += `
        </ul>
        <div class="text-center mt-3">
            <small class="text-muted">Halaman ${currentPage} dari ${totalPages} • ${totalItems} kegiatan ditemukan</small>
        </div>
    </nav>
    `;
    
    paginationContainer.innerHTML = paginationHtml;
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
    
    // Update URL hash dengan filter
    updateFilterHash(bulan, tahun, keyword);
}

// Fungsi reset filter
function resetFilter() {
    document.getElementById('filterBulan').value = '';
    document.getElementById('filterTahun').value = '';
    document.getElementById('filterKeyword').value = '';
    
    currentPage = 1;
    displayKegiatan(kegiatanData, currentPage);
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

// Setup year filter options (dinamis 90 tahun ke depan)
function setupYearFilter() {
    const tahunSelect = document.getElementById('filterTahun');
    const tahunSekarang = new Date().getFullYear();
    const tahunMulai = 2024;
    const tahunAkhir = tahunSekarang + 90;
    
    // Clear existing options except first
    while (tahunSelect.options.length > 1) {
        tahunSelect.remove(1);
    }

    // Tambahkan opsi tahun dari 2024 hingga 90 tahun ke depan
    for (let tahun = tahunAkhir; tahun >= tahunMulai; tahun--) {
        const option = document.createElement('option');
        option.value = tahun;
        option.textContent = tahun;
        tahunSelect.appendChild(option);
    }
}

// Setup password protection untuk generator
function setupPasswordProtection() {
    const btnGenerator = document.getElementById('btnGenerator');
    const btnVerifyPassword = document.getElementById('btnVerifyPassword');
    const adminPasswordInput = document.getElementById('adminPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordError = document.getElementById('passwordError');
    
    btnGenerator.addEventListener('click', function() {
        if (isAuthenticated) {
            const generatorModal = new bootstrap.Modal(document.getElementById('generatorModal'));
            generatorModal.show();
        } else {
            const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
            passwordModal.show();
        }
    });
    
    togglePasswordBtn.addEventListener('click', function() {
        const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        adminPasswordInput.setAttribute('type', type);
        togglePasswordBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    btnVerifyPassword.addEventListener('click', function() {
        const password = adminPasswordInput.value.trim();
        
        if (password === ADMIN_PASSWORD) {
            isAuthenticated = true;
            passwordError.classList.add('d-none');
            
            const passwordModal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
            passwordModal.hide();
            
            adminPasswordInput.value = '';
            
            setTimeout(() => {
                const generatorModal = new bootstrap.Modal(document.getElementById('generatorModal'));
                generatorModal.show();
            }, 300);
            
            showToast('Akses diberikan!', 'Anda sekarang dapat mengakses generator script.', 'success');
        } else {
            passwordError.classList.remove('d-none');
            document.getElementById('errorMessage').textContent = 'Kode keamanan salah. Coba lagi.';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
            
            adminPasswordInput.classList.add('shake');
            setTimeout(() => {
                adminPasswordInput.classList.remove('shake');
            }, 500);
        }
    });
    
    adminPasswordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            btnVerifyPassword.click();
        }
    });
    
    document.getElementById('passwordModal').addEventListener('hidden.bs.modal', function() {
        adminPasswordInput.value = '';
        passwordError.classList.add('d-none');
        adminPasswordInput.setAttribute('type', 'password');
        togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
    });
}

// Fungsi untuk menampilkan toast notification
function showToast(title, message, type = 'info') {
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0 position-fixed" style="bottom: 20px; right: 20px; z-index: 1090;" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong><br>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', function() {
        toastEl.remove();
    });
}

// Fungsi untuk menampilkan detail kegiatan di modal (DIPERBAIKI)
function showKegiatanDetail(id) {
    const kegiatan = kegiatanData.find(k => k.id === id);
    if (!kegiatan) {
        showToast('Kegiatan tidak ditemukan', 'Data kegiatan tidak tersedia', 'warning');
        return;
    }
    
    const date = new Date(kegiatan.date);
    const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Update text content
    document.getElementById('kegiatanModalTitle').textContent = kegiatan.title;
    document.getElementById('modalDate').textContent = formattedDate;
    document.getElementById('modalCategory').textContent = kegiatan.category.charAt(0).toUpperCase() + kegiatan.category.slice(1);
    document.getElementById('modalLocation').textContent = kegiatan.location;
    document.getElementById('modalDescription').textContent = kegiatan.description;
    
    // Validasi dan set URL
    const validUrl = validateUrl(kegiatan.url);
    const modalDetailLink = document.getElementById('modalDetailLink');
    modalDetailLink.href = validUrl;
    
    // Pastikan link terbuka di tab baru
    modalDetailLink.target = '_blank';
    
    // Update participants and duration jika ada
    if (kegiatan.participants && kegiatan.participants > 0) {
        document.getElementById('modalParticipants').textContent = kegiatan.participants;
        document.getElementById('modalParticipants').parentElement.style.display = 'inline-block';
    } else {
        document.getElementById('modalParticipants').parentElement.style.display = 'none';
    }
    
    if (kegiatan.duration) {
        document.getElementById('modalDuration').textContent = kegiatan.duration;
        document.getElementById('modalDuration').parentElement.style.display = 'inline-block';
    } else {
        document.getElementById('modalDuration').parentElement.style.display = 'none';
    }
    
    // Update tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = kegiatan.tags.map(tag => 
        `<span class="kegiatan-tag">${tag}</span>`
    ).join('');
    
    // Update media containers
    const carouselContainer = document.getElementById('carouselContainer');
    const videoContainer = document.getElementById('modalVideoContainer');
    const carouselInner = document.getElementById('modalCarouselInner');
    const videoList = document.getElementById('modalVideoList');
    
    // Reset containers
    carouselContainer.style.display = 'none';
    videoContainer.style.display = 'none';
    carouselInner.innerHTML = '';
    videoList.innerHTML = '';
    
    // Tampilkan gambar jika ada
    if (kegiatan.images && kegiatan.images.length > 0) {
        carouselContainer.style.display = 'block';
        
        kegiatan.images.forEach((img, index) => {
            const activeClass = index === 0 ? 'active' : '';
            carouselInner.innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <img src="${img}" class="d-block w-100 modal-img" alt="Dokumentasi ${index + 1}" 
                         onerror="this.src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop'">
                </div>
            `;
        });
        
        // Tambahkan indicators jika lebih dari 1 gambar
        if (kegiatan.images.length > 1) {
            let indicatorsHtml = '<div class="carousel-indicators">';
            kegiatan.images.forEach((_, index) => {
                indicatorsHtml += `<button type="button" data-bs-target="#modalCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>`;
            });
            indicatorsHtml += '</div>';
            carouselInner.insertAdjacentHTML('beforebegin', indicatorsHtml);
        }
    }
    
    // Tampilkan video jika ada
    if (kegiatan.youtubeUrls && kegiatan.youtubeUrls.length > 0) {
        videoContainer.style.display = 'block';
        
        kegiatan.youtubeUrls.forEach((url, index) => {
            const videoId = extractYouTubeId(url);
            
            if (videoId) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
                
                videoList.innerHTML += `
                    <div class="col-md-${kegiatan.youtubeUrls.length > 1 ? '6' : '12'} mb-3">
                        <div class="ratio ratio-16x9 video-iframe-container">
                            <iframe src="${embedUrl}" 
                                    title="Video ${index + 1} - ${kegiatan.title}"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                    loading="lazy">
                            </iframe>
                        </div>
                        <div class="text-center mt-2">
                            <a href="${watchUrl}" target="_blank" class="btn btn-sm btn-outline-danger">
                                <i class="fab fa-youtube me-1"></i> Tonton di YouTube
                            </a>
                        </div>
                    </div>
                `;
            }
        });
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('kegiatanModal'));
    modal.show();
}

// Helper function untuk extract YouTube ID
function extractYouTubeId(url) {
    if (!url) return null;
    
    // Handle embed URL
    if (url.includes('youtube.com/embed/')) {
        return url.split('/embed/')[1].split('?')[0];
    }
    
    // Handle youtu.be URL
    if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
    }
    
    // Handle watch URL
    if (url.includes('youtube.com/watch?v=')) {
        return url.split('v=')[1].split('&')[0];
    }
    
    // Handle youtu.be with parameters
    if (url.includes('youtu.be/') && url.includes('?')) {
        return url.split('youtu.be/')[1].split('?')[0];
    }
    
    return null;
}

// ==========================================
// GENERATOR SCRIPT FEATURES - DIPERBAIKI
// ==========================================

// Fungsi untuk Generate dan Preview
function generatePreview() {
    if (!isAuthenticated) {
        showToast('Akses Ditolak', 'Silakan login terlebih dahulu untuk mengakses generator.', 'warning');
        const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
        passwordModal.show();
        return;
    }
    
    // Ambil data dari form
    const title = document.getElementById('genTitle').value;
    const date = document.getElementById('genDate').value;
    const category = document.getElementById('genCategory').value;
    const location = document.getElementById('genLocation').value;
    const imagesRaw = document.getElementById('genImages').value;
    const videosRaw = document.getElementById('genVideos').value;
    const detailUrl = document.getElementById('genDetailUrl').value;
    const desc = document.getElementById('genDesc').value;
    const tagsRaw = document.getElementById('genTags').value;

    // Validasi
    if(!title || !date || !desc || !detailUrl) {
        showToast('Data Tidak Lengkap', 'Mohon lengkapi Judul, Tanggal, Deskripsi, dan URL Detail.', 'warning');
        return;
    }

    // Process Images
    const imagesList = imagesRaw.split('\n')
        .map(url => url.trim())
        .filter(url => url !== '' && (url.startsWith('http') || url.startsWith('https')))
        .map(url => url.includes('?') ? url.split('?')[0] : url);

    // Process Videos dengan extract YouTube ID
    const videosList = videosRaw.split('\n')
        .map(url => url.trim())
        .filter(url => url !== '' && (url.includes('youtube') || url.includes('youtu.be')))
        .map(url => {
            const videoId = extractYouTubeId(url);
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
            return url;
        })
        .filter(url => url !== null && url.includes('youtube.com/embed/'));

    // Tentukan type berdasarkan konten
    let type = 'foto';
    if (videosList.length > 0 && imagesList.length > 0) {
        type = 'multimedia';
    } else if (videosList.length > 0) {
        type = 'youtube';
    }

    // Buat Object Data
    const newData = {
        id: Date.now(),
        title: title,
        date: date,
        description: desc,
        images: imagesList.length > 0 ? imagesList : [],
        type: type,
        category: category,
        location: location,
        tags: tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        youtubeUrls: videosList.length > 0 ? videosList : [],
        url: detailUrl,
        participants: 0,
        duration: ""
    };

    // Render Preview Card
    renderPreviewCard(newData);

    // Generate Code String
    const jsonString = JSON.stringify(newData, null, 4);
    const cleanCode = `    ${jsonString},`;
    
    document.getElementById('codeOutput').textContent = cleanCode;
    
    // Tampilkan statistik media
    const imageCount = imagesList.length;
    const videoCount = videosList.length;
    showToast('Preview Berhasil!', `${imageCount} gambar dan ${videoCount} video telah diproses. URL Detail: ${detailUrl}`, 'success');
}

// Fungsi Render Preview Card di dalam Modal Generator
function renderPreviewCard(data) {
    const container = document.getElementById('previewCardContainer');
    
    // Format Date
    const date = new Date(data.date);
    const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // Participants Logic
    let participantHtml = '';
    if (data.participants && data.participants > 0) {
        participantHtml = `<span class="ms-2"><i class="fas fa-users me-1"></i>${data.participants} peserta</span>`;
    } else {
        participantHtml = `<span class="ms-2"><i class="fas fa-globe me-1"></i>Umum</span>`;
    }

    // Tentukan button icon dan text
    let buttonIcon = 'fa-eye';
    let buttonText = 'Lihat Detail';
    
    if (data.type === 'youtube') {
        buttonIcon = 'fa-play-circle';
        buttonText = 'Tonton Video';
    } else if (data.type === 'multimedia') {
        buttonIcon = 'fa-photo-video';
        buttonText = 'Lihat Media';
    }
    
    const imageCount = data.images ? data.images.length : 0;
    const videoCount = data.youtubeUrls ? data.youtubeUrls.length : 0;

    const html = `
        <div class="kegiatan-card" style="max-width: 400px; margin: 0 auto;">
            <div class="kegiatan-img-container">
                <img src="${data.images && data.images[0] ? data.images[0] : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop'}" 
                     class="kegiatan-img" alt="${data.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop'">
            </div>
            <div class="kegiatan-content">
                <div class="kegiatan-date">
                    <i class="fas fa-calendar-alt"></i> ${formattedDate}
                    ${participantHtml}
                </div>
                <h3 class="kegiatan-title" style="font-size: 1.2rem;">${data.title}</h3>
                <p class="kegiatan-desc" style="font-size: 0.9rem;">${data.description}</p>
                <div class="kegiatan-tags">
                    ${data.tags.map(tag => `<span class="kegiatan-tag">${tag}</span>`).join('')}
                </div>
                <div class="card-buttons">
                    <a href="${validateUrl(data.url)}" class="btn-card-detail" target="_blank">
                        <i class="fas ${buttonIcon} me-2"></i>
                        ${buttonText}
                    </a>
                    <button class="btn-card-preview" onclick="alert('Ini adalah preview. Di halaman utama, tombol ini akan membuka modal detail.')" title="Quick Preview">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="mt-3 text-center text-muted small">
                    <i class="fas fa-images me-1"></i> ${imageCount} gambar | 
                    <i class="fab fa-youtube me-1"></i> ${videoCount} video
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Fungsi Copy to Clipboard
function copyToClipboard() {
    const codeText = document.getElementById('codeOutput').textContent;
    if(codeText.includes("// Kode akan muncul")) {
        showToast('Tidak Ada Kode', 'Silakan generate preview terlebih dahulu.', 'warning');
        return;
    }

    navigator.clipboard.writeText(codeText).then(() => {
        showToast('Kode Disalin!', 'Script berhasil disalin ke clipboard. Paste ke dalam file script.js.', 'success');
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
        showToast('Gagal Menyalin', 'Terjadi kesalahan saat menyalin kode.', 'danger');
    });
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
        
        if (bulan || tahun || keyword) {
            setTimeout(filterKegiatan, 100);
        }
    }
}

// Fungsi untuk membersihkan form generator
function clearGeneratorForm() {
    document.getElementById('genTitle').value = '';
    document.getElementById('genDate').value = '';
    document.getElementById('genCategory').value = 'pelatihan';
    document.getElementById('genLocation').value = '';
    document.getElementById('genImages').value = '';
    document.getElementById('genVideos').value = '';
    document.getElementById('genDetailUrl').value = '';
    document.getElementById('genDesc').value = '';
    document.getElementById('genTags').value = '';
    
    document.getElementById('previewCardContainer').innerHTML = `
        <div class="text-center text-muted py-5 border rounded bg-white">
            <i class="fas fa-image fa-3x mb-3 text-secondary"></i>
            <p>Klik tombol Generate untuk melihat preview</p>
        </div>
    `;
    
    document.getElementById('codeOutput').textContent = '// Kode akan muncul di sini...';
}

// Panggil fungsi untuk memuat filter dari hash saat halaman dimuat
setTimeout(loadFilterFromHash, 500);

// Event listener untuk modal generator saat ditutup
document.getElementById('generatorModal').addEventListener('hidden.bs.modal', clearGeneratorForm);

// Export global functions
window.changePage = changePage;
window.filterKegiatan = filterKegiatan;
window.resetFilter = resetFilter;
window.showKegiatanDetail = showKegiatanDetail;
window.generatePreview = generatePreview;
window.copyToClipboard = copyToClipboard;
window.clearGeneratorForm = clearGeneratorForm;
window.extractYouTubeId = extractYouTubeId;
window.validateUrl = validateUrl;
