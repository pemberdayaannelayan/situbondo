// =====================================================
// KODE UTAMA APLIKASI SIMATA - VERSI 5.5 FINAL DIPERBAIKI
// DENGAN TAMBAHAN FITUR PENGATURAN PEJABAT
// =====================================================

// --- VARIABEL GLOBAL ---
let appData = [];
let appSettings = {
    appName: 'SISTEM PEMETAAN DATA NELAYAN',
    appSubtitle: 'DINAS PERIKANAN KABUPATEN SITUBONDO',
    itemsPerPage: 5, // DIUBAH DARI 10 MENJADI 5 (DEFAULT)
    privacyMode: true,
    securityCodeSensor: '987654321',
    // TAMBAHAN: Data pejabat default
    officialName: 'SUGENG PURWO PRIYANTO, S.E, M.M',
    officialNip: '19761103 200903 1 001',
    officialPosition: 'Kepala Bidang Pemberdayaan Nelayan'
};
let currentPage = 1;
let duplicateCheckInterval = null;
let currentDetailId = null; 
let verifyDataResult = null;
let currentFilter = {}; // Variabel untuk menyimpan filter aktif
let detailModal, welcomeModal, loginSuccessModal, fishInfoModal;

// Ekspos variabel ke window untuk akses dari file lain
window.appData = appData;
window.appSettings = appSettings;
window.currentPage = currentPage;
window.currentFilter = currentFilter;

// --- DATA KONSTAN ---
const SITUBONDO_DATA = {
    "Arjasa": ["Arjasa", "Bayeman", "Curah Tatal", "Jatisari", "Kayumas", "Kedungdowo", "Ketowan", "Lamongan"],
    "Asembagus": ["Asembagus", "Awar-awar", "Bantal", "Gudang", "Kedunglo", "Kertosari", "Mojosari", "Parante", "Trigonco", "Wringin Anom"],
    "Banyuglugur": ["Banyuglugur", "Kalianget", "Kalisari", "Lubawang", "Selobanteng", "Telempong", "Tepos"],
    "Banyuputih": ["Banyuputih", "Sumberanyar", "Sumberejo", "Sumberwaru", "Wonorejo"],
    "Besuki": ["Besuki", "Blimbing", "Bloro", "Demung", "Jetis", "Kalimas", "Langkap", "Pesisir", "Sumberejo", "Widoropayung"],
    "Bungatan": ["Bletok", "Bungatan", "Mlandingan Wetan", "Pasir Putih", "Patemon", "Selowogo", "Sumbertengah"],
    "Jangkar": ["Agel", "Curah Kalak", "Gadingan", "Jangkar", "Kumbangsari", "Palangan", "Pesanggrahan", "Sopet"],
    "Jatibanteng": ["Curahsuri", "Jatibanteng", "Kembangsari", "Pategalan", "Patemon", "Semambung", "Sumberanyar", "Wringinanom"],
    "Kapongan": ["Curah Cottok Gebangan", "Kandang", "Kapongan", "Kesambi Rampak", "Landangan", "Peleyan", "Pokaan", "Seletreng", "Wonokoyo"],
    "Kendit": ["Balung", "Bugeman", "Kendit", "Klatakan", "Kukusan", "Rajekwesi", "Tambak Ukir"],
    "Mangaran": ["Mangaran", "Semiring", "Tanjung Glugur", "Tanjung Kamal", "Tanjung Pecinan", "Trebungan"],
    "Mlandingan": ["Alas Bayur", "Campoan", "Mlandingan Kulon", "Selomukti", "Sumberanyar", "Sumber Pinang", "Trebungan"],
    "Panarukan": ["Alasmalang", "Duwet", "Gelung", "Kilensari", "Paowan", "Peleyan", "Sumberkolak", "Wringinanom"],
    "Panji": ["Ardirejo", "Mimbaan", "Battal", "Curah Jeru", "Juglangan", "Kayu Putih", "Klampokan", "Panji Kidul", "Panji Lor", "Sliwung", "Tenggir", "Tokelan"],
    "Situbondo": ["Dawuhan", "Patokan", "Kalibagor", "Kotakan", "Olean", "Talkandang"],
    "Suboh": ["Buduan", "Cemara", "Dawuan", "Gunung Malang", "Gunung Putri", "Ketah", "Mojodungkol", "Suboh"],
    "Sumbermalang": ["Alastengah", "Baderan", "Kalirejo", "Plalangan", "Sumberargo", "Taman", "Tamankursi", "Tamansari", "Tlogosari"]
};

// --- FUNGSI UTAMA ---
function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    document.getElementById('passwordHint').innerHTML = `Kode keamanan berubah setiap hari berdasarkan tanggal.`;
}

function maskData(data, force = false) {
    if (!data) return "-";
    if (data === '00000000') return "Tidak Ada";
    if (!appSettings.privacyMode && !force) return data.toString();
    
    let str = data.toString();
    if (str.length <= 4) return str;
    
    const maskedLength = Math.min(4, str.length);
    const visiblePart = str.slice(0, -maskedLength);
    const maskedPart = '*'.repeat(maskedLength);
    return visiblePart + maskedPart;
}

function getFishIconClass(fishName) {
    const lower = fishName.toLowerCase();
    if (lower.includes('cumi')) return 'fa-ghost'; 
    if (lower.includes('kepiting')) return 'fa-spider'; 
    if (lower.includes('togek') || lower.includes('mendut')) return 'fa-star'; 
    return 'fa-fish';
}

// --- FUNGSI REFRESH HALAMAN ---
function refreshPage() {
    if (confirm('Apakah Anda yakin ingin me-refresh halaman? Semua perubahan yang belum disimpan akan hilang.')) {
        location.reload();
    }
}

// --- FUNGSI GET FILTERED DATA UNTUK PDF ---
function getFilteredData() {
    const search = document.getElementById('searchData').value.toLowerCase();
    
    // Filter data berdasarkan pencarian dan filter
    let filtered = appData;
    
    // Terapkan filter jika ada
    if (Object.keys(currentFilter).length > 0) {
        filtered = filtered.filter(d => {
            const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
            const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
            const matchStatus = !currentFilter.status || d.status === currentFilter.status;
            
            // Filter jenis kapal hanya untuk pemilik kapal
            let matchJenis = true;
            if (currentFilter.jenisKapal) {
                if (d.status === 'Pemilik Kapal') {
                    matchJenis = d.jenisKapal === currentFilter.jenisKapal;
                } else {
                    matchJenis = false;
                }
            }
            
            const matchAlatTangkap = !currentFilter.alatTangkap || d.alatTangkap === currentFilter.alatTangkap;
            const matchUsaha = !currentFilter.usaha || 
                (currentFilter.usaha === 'Ada' ? 
                    (d.usahaSampingan && d.usahaSampingan.trim() !== '' && d.usahaSampingan !== '-') : 
                    (!d.usahaSampingan || d.usahaSampingan.trim() === '' || d.usahaSampingan === '-'));
            
            return matchDesa && matchProfesi && matchStatus && matchJenis && matchAlatTangkap && matchUsaha;
        });
    }
    
    // Terapkan pencarian jika ada
    if (search) {
        filtered = filtered.filter(d => 
            d.nama.toLowerCase().includes(search) || 
            d.nik.includes(search) || 
            (d.namaKapal && d.namaKapal.toLowerCase().includes(search)) ||
            d.desa.toLowerCase().includes(search) ||
            d.kecamatan.toLowerCase().includes(search)
        );
    }
    
    return filtered;
}

// --- FUNGSI RENDER DATA TABLE YANG DISEMPURNAKAN ---
function renderDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    const search = document.getElementById('searchData').value.toLowerCase();
    
    // Filter data berdasarkan pencarian dan filter
    let filtered = appData;
    
    // Terapkan filter jika ada
    if (Object.keys(currentFilter).length > 0) {
        filtered = filtered.filter(d => {
            const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
            const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
            const matchStatus = !currentFilter.status || d.status === currentFilter.status;
            
            // Filter jenis kapal hanya untuk pemilik kapal
            let matchJenis = true;
            if (currentFilter.jenisKapal) {
                if (d.status === 'Pemilik Kapal') {
                    matchJenis = d.jenisKapal === currentFilter.jenisKapal;
                } else {
                    matchJenis = false;
                }
            }
            
            const matchAlatTangkap = !currentFilter.alatTangkap || d.alatTangkap === currentFilter.alatTangkap;
            const matchUsaha = !currentFilter.usaha || 
                (currentFilter.usaha === 'Ada' ? 
                    (d.usahaSampingan && d.usahaSampingan.trim() !== '' && d.usahaSampingan !== '-') : 
                    (!d.usahaSampingan || d.usahaSampingan.trim() === '' || d.usahaSampingan === '-'));
            
            return matchDesa && matchProfesi && matchStatus && matchJenis && matchAlatTangkap && matchUsaha;
        });
    }
    
    // Terapkan pencarian jika ada
    if (search) {
        filtered = filtered.filter(d => 
            d.nama.toLowerCase().includes(search) || 
            d.nik.includes(search) || 
            (d.namaKapal && d.namaKapal.toLowerCase().includes(search)) ||
            d.desa.toLowerCase().includes(search) ||
            d.kecamatan.toLowerCase().includes(search)
        );
    }
    
    const nikCounts = {};
    appData.forEach(d => nikCounts[d.nik] = (nikCounts[d.nik] || 0) + 1);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / appSettings.itemsPerPage));
    
    // Validasi currentPage
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalItems === 0) {
        currentPage = 1;
    }
    
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filtered.slice(start, end);

    tableBody.innerHTML = '';
    
    if (totalItems === 0) {
        const row = `<tr>
            <td colspan="8" class="text-center py-5 text-muted">
                <i class="fas fa-database fa-2x mb-3"></i>
                <p>Tidak ada data ditemukan</p>
                ${search || Object.keys(currentFilter).length > 0 ? '<small>Coba dengan kata kunci pencarian atau filter yang berbeda</small>' : ''}
            </td>
        </tr>`;
        tableBody.innerHTML = row;
    } else if (pageData.length === 0) {
        const row = `<tr>
            <td colspan="8" class="text-center py-5 text-muted">
                <i class="fas fa-exclamation-circle fa-2x mb-3"></i>
                <p>Data untuk halaman ini tidak ditemukan</p>
            </td>
        </tr>`;
        tableBody.innerHTML = row;
    } else {
        pageData.forEach((d, i) => {
            const kapalInfo = d.status === 'Pemilik Kapal' ? 
                `<div class="text-truncate-2 small fw-bold text-primary">${d.namaKapal}</div><div class="small text-muted">${d.jenisKapal}</div>` : 
                '-';
            
            const isDuplicate = nikCounts[d.nik] > 1;
            const rowClass = isDuplicate ? 'table-danger' : '';
            
            let badgeClass = 'bg-secondary';
            if(d.profesi === 'Nelayan Penuh Waktu') badgeClass = 'badge-profesi-penuh';
            else if(d.profesi === 'Nelayan Sambilan Utama') badgeClass = 'badge-profesi-sambilan-utama';
            else if(d.profesi === 'Nelayan Sambilan Tambahan') badgeClass = 'badge-profesi-sambilan-tambahan';
            
            const displayNik = maskData(d.nik);
            const displayWaRaw = maskData(d.whatsapp);
            
            let contactDisplay = '';
            if(displayWaRaw === "Tidak Ada") {
                contactDisplay = `<span class="badge bg-light text-muted border">Tidak Ada</span>`;
            } else {
                if (appSettings.privacyMode) {
                    contactDisplay = `<div class="small"><i class="fas fa-phone-alt text-secondary me-1"></i> ${displayWaRaw}</div>`;
                } else {
                    let cleanNum = d.whatsapp;
                    if(cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.substring(1);
                    contactDisplay = `<div class="d-flex align-items-center gap-1"><a href="https://wa.me/${cleanNum}" target="_blank" class="btn btn-sm btn-success py-0 px-1" title="Chat WhatsApp"><i class="fab fa-whatsapp"></i></a><span class="small font-monospace ms-1">${d.whatsapp}</span></div>`;
                }
            }

            const row = `<tr class="${rowClass}">
                <td class="text-center"><input type="checkbox" class="row-checkbox" value="${d.id}" onchange="toggleBulkDeleteBtn()"></td>
                <td class="text-center">${start + i + 1}</td>
                <td onclick="viewDetail('${d.id}')" class="clickable-name col-id-cell">
                    <div class="fw-bold text-dark text-wrap">${d.nama}</div>
                    <div class="small font-monospace text-muted">${displayNik} ${isDuplicate ? '<span class="text-danger fw-bold ms-1">(!)</span>' : ''}</div>
                    <div class="small text-muted text-wrap mt-1"><i class="fas fa-map-marker-alt me-1"></i>${d.kecamatan}, ${d.desa}</div>
                </td>
                <td class="col-contact-cell">${contactDisplay}</td>
                <td class="col-status-cell"><span class="badge ${badgeClass} border">${d.profesi}</span><br><small class="text-muted">${d.status}</small></td>
                <td class="col-status-cell">${kapalInfo}</td>
                <td style="white-space:nowrap;"><span class="badge bg-info text-white">${d.alatTangkap}</span></td>
                <td class="col-action sticky-col-right">
                    <div class="btn-group shadow-sm" role="group">
                        <button class="btn btn-sm btn-info text-white" onclick="viewDetail('${d.id}')" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-warning text-white" onclick="editData('${d.id}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-sm btn-idcard" onclick="safeGenerateIDCard('${d.id}')" title="Cetak ID Card"><i class="fas fa-id-card"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteData('${d.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }
    
    // Update informasi tabel
    const startItem = totalItems > 0 ? start + 1 : 0;
    const endItem = Math.min(start + appSettings.itemsPerPage, totalItems);
    document.getElementById('tableInfo').textContent = `Menampilkan ${startItem}-${endItem} dari ${totalItems} data`;
    
    // Update pagination
    updatePagination(totalItems);
    
    // Update tombol bulk delete
    toggleBulkDeleteBtn();
}

// --- FUNGSI PAGINATION YANG DISEMPURNAKAN ---
function updatePagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / appSettings.itemsPerPage));
    const ul = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Validasi currentPage
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
    
    ul.innerHTML = '';
    
    if (totalPages <= 1) {
        paginationInfo.textContent = `Halaman 1 dari 1 (Total: ${totalItems} data)`;
        return;
    }
    
    paginationInfo.textContent = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems} data)`;
    
    // Tombol pertama
    const first = document.createElement('li');
    first.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    first.innerHTML = `<a class="page-link" href="#" onclick="goToPage(1); return false;" title="Halaman Pertama">&laquo;</a>`;
    ul.appendChild(first);
    
    // Tombol sebelumnya
    const prev = document.createElement('li');
    prev.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prev.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage-1}); return false;" title="Halaman Sebelumnya">&lt;</a>`;
    ul.appendChild(prev);
    
    // Tampilkan beberapa halaman sekitar currentPage
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Pastikan kita selalu menampilkan 5 halaman jika memungkinkan
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    // Tambahkan ellipsis di awal jika diperlukan
    if (startPage > 1) {
        const ellipsis1 = document.createElement('li');
        ellipsis1.className = 'page-item disabled';
        ellipsis1.innerHTML = `<span class="page-link">...</span>`;
        ul.appendChild(ellipsis1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>`;
        ul.appendChild(li);
    }
    
    // Tambahkan ellipsis di akhir jika diperlukan
    if (endPage < totalPages) {
        const ellipsis2 = document.createElement('li');
        ellipsis2.className = 'page-item disabled';
        ellipsis2.innerHTML = `<span class="page-link">...</span>`;
        ul.appendChild(ellipsis2);
    }
    
    // Tombol berikutnya
    const next = document.createElement('li');
    next.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    next.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage+1}); return false;" title="Halaman Berikutnya">&gt;</a>`;
    ul.appendChild(next);
    
    // Tombol terakhir
    const last = document.createElement('li');
    last.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    last.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${totalPages}); return false;" title="Halaman Terakhir">&raquo;</a>`;
    ul.appendChild(last);
}

function goToPage(page) {
    currentPage = page;
    renderDataTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- FUNGSI FILTER YANG DISEMPURNAKAN ---
function applyFilter() {
    currentFilter = {
        desa: document.getElementById('filterDesa').value,
        profesi: document.getElementById('filterProfesi').value,
        status: document.getElementById('filterStatus').value,
        jenisKapal: document.getElementById('filterJenisKapal').value,
        alatTangkap: document.getElementById('filterAlatTangkap').value,
        usaha: document.getElementById('filterUsaha').value
    };
    
    currentPage = 1; // Reset ke halaman pertama saat filter diterapkan
    renderDataTable();
    
    // Hitung jumlah data yang difilter
    const filteredCount = appData.filter(d => {
        const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
        const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
        const matchStatus = !currentFilter.status || d.status === currentFilter.status;
        
        let matchJenis = true;
        if (currentFilter.jenisKapal) {
            if (d.status === 'Pemilik Kapal') {
                matchJenis = d.jenisKapal === currentFilter.jenisKapal;
            } else {
                matchJenis = false;
            }
        }
        
        const matchAlatTangkap = !currentFilter.alatTangkap || d.alatTangkap === currentFilter.alatTangkap;
        const matchUsaha = !currentFilter.usaha || 
            (currentFilter.usaha === 'Ada' ? 
                (d.usahaSampingan && d.usahaSampingan.trim() !== '' && d.usahaSampingan !== '-') : 
                (!d.usahaSampingan || d.usahaSampingan.trim() === '' || d.usahaSampingan === '-'));
        
        return matchDesa && matchProfesi && matchStatus && matchJenis && matchAlatTangkap && matchUsaha;
    }).length;
    
    showNotification(`Filter diterapkan: ${filteredCount} data ditemukan`, 'success');
}

function resetFilter() {
    // Reset semua dropdown filter
    document.getElementById('filterDesa').value = '';
    document.getElementById('filterProfesi').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterJenisKapal').value = '';
    document.getElementById('filterAlatTangkap').value = '';
    document.getElementById('filterUsaha').value = '';
    
    // Reset filter aktif
    currentFilter = {};
    currentPage = 1;
    
    // Render ulang tabel
    renderDataTable();
    
    showNotification('Filter direset, menampilkan semua data', 'info');
}

function showDuplicateDataInFilter() {
    // Hitung data duplikat
    const counts = {};
    appData.forEach(d => counts[d.nik] = (counts[d.nik] || 0) + 1);
    const duplicateData = appData.filter(d => counts[d.nik] > 1);
    
    if (duplicateData.length === 0) {
        showNotification('Tidak ditemukan data NIK ganda. Data sudah bersih!', 'success');
        return;
    }
    
    // Set filter untuk menampilkan hanya data duplikat
    currentFilter = { duplicate: true };
    currentPage = 1;
    
    // Render ulang tabel
    renderDataTable();
    
    showNotification(`Ditemukan ${duplicateData.length} data dengan NIK ganda`, 'warning');
}

// --- FUNGSI UTAMA CRUD ---
function viewDetail(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    currentDetailId = id;
    document.getElementById('d_nama').innerText = d.nama;
    document.getElementById('d_nik').innerText = d.nik; 
    document.getElementById('d_usia').innerText = `${d.usia} Tahun (${d.tahunLahir})`;
    document.getElementById('d_wa').innerText = d.whatsapp;
    document.getElementById('d_domisili').innerText = `${d.desa}, ${d.kecamatan}`;
    
    const profBadge = document.getElementById('d_profesi');
    profBadge.innerText = d.profesi;
    
    let badgeClass = 'bg-primary';
    if(d.profesi === 'Nelayan Penuh Waktu') badgeClass = 'badge-profesi-penuh';
    else if(d.profesi === 'Nelayan Sambilan Utama') badgeClass = 'badge-profesi-sambilan-utama';
    else if(d.profesi === 'Nelayan Sambilan Tambahan') badgeClass = 'badge-profesi-sambilan-tambahan';
    profBadge.className = `badge ${badgeClass}`;

    document.getElementById('d_status').innerText = d.status;
    document.getElementById('d_alatTangkap').innerText = d.alatTangkap;
    document.getElementById('d_usaha').innerText = d.usahaSampingan || '-';
    
    const fishContainer = document.getElementById('d_ikan');
    fishContainer.innerHTML = '';
    if(d.jenisIkan) {
        d.jenisIkan.split(', ').forEach(fish => {
            const iconClass = getFishIconClass(fish);
            fishContainer.innerHTML += `<span class="badge bg-light text-dark border me-1 mb-1"><i class="fas ${iconClass} me-1"></i>${fish}</span>`;
        });
    }
    if(d.status === 'Pemilik Kapal') {
        document.getElementById('d_kapal_card').style.display = 'block';
        document.getElementById('d_namaKapal').innerText = d.namaKapal;
        document.getElementById('d_jenisKapal').innerText = d.jenisKapal;
    } else {
        document.getElementById('d_kapal_card').style.display = 'none';
    }
    document.getElementById('d_tgl_valid').innerText = d.tanggalValidasi;
    document.getElementById('d_validator').innerText = d.validator;
    detailModal.show();
}

function editData(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    const form = document.getElementById('inputForm');
    form.setAttribute('data-edit-id', id);
    
    ['nama', 'nik', 'whatsapp', 'profesi', 'tahunLahir', 'usia', 'alatTangkap', 'usahaSampingan', 'tanggalValidasi', 'validator', 'driveLink', 'kodeValidasi', 'keterangan']
     .forEach(key => document.getElementById(key).value = d[key] || '');

    const waInput = document.getElementById('whatsapp');
    const btnWa = document.getElementById('btnNoWA');
    if(d.whatsapp === '00000000') {
        waInput.setAttribute('readonly', true);
        waInput.removeAttribute('required');
        btnWa.classList.add('active', 'btn-secondary');
        btnWa.textContent = "Batal";
    } else {
        waInput.removeAttribute('readonly');
        waInput.setAttribute('required', 'required');
        btnWa.classList.remove('active', 'btn-secondary');
        btnWa.textContent = "Tidak Ada";
    }

    document.getElementById('jenisIkanLainnya').style.display = 'none';
    document.getElementById('jenisIkanLainnya').value = '';
    
    // Set alat tangkap dan update daftar ikan
    document.getElementById('alatTangkap').value = d.alatTangkap;
    updateFishOptionsByAPI(d.alatTangkap);
    
    // Set ikan yang sudah dipilih setelah daftar diupdate
    setTimeout(() => {
        if(d.jenisIkan) {
            const savedFish = d.jenisIkan.split(', ');
            savedFish.forEach(fish => {
                let found = false;
                document.querySelectorAll('.fish-checkbox').forEach(cb => {
                    if(cb.value === fish) { 
                        cb.checked = true; 
                        found = true; 
                    }
                });
                if(!found) {
                    // Jika ikan tidak ada dalam daftar, maka tambahkan ke opsi "Lainnya"
                    const cbLain = document.getElementById('fish_Lainnya');
                    if (cbLain) {
                        cbLain.checked = true;
                        const inputLain = document.getElementById('jenisIkanLainnya');
                        inputLain.style.display = 'block';
                        inputLain.value = fish;
                    }
                }
            });
        }
    }, 100);

    const kecSelect = document.getElementById('kecamatan');
    kecSelect.value = d.kecamatan;
    kecSelect.dispatchEvent(new Event('change'));
    document.getElementById('desa').value = d.desa;

    const statusSelect = document.getElementById('statusNelayan');
    statusSelect.value = d.status;
    statusSelect.dispatchEvent(new Event('change'));

    if(d.status === 'Pemilik Kapal') {
        ['namaKapal', 'jenisKapal'].forEach(key => {
            document.getElementById(key).value = d[key] || '';
        });
        
        if(d.jenisKapal && KAPAL_INFO[d.jenisKapal]) {
            document.getElementById('kapalInfo').style.display = 'block';
            document.getElementById('kapalInfo').innerHTML = `<strong>${d.jenisKapal}:</strong> ${KAPAL_INFO[d.jenisKapal]}`;
            updateAlatTangkapByKapal();
        }
    }

    if(d.alatTangkap && API_INFO[d.alatTangkap]) {
        document.getElementById('apiInfo').style.display = 'block';
        document.getElementById('apiInfo').innerHTML = `<strong>${d.alatTangkap}:</strong> ${API_INFO[d.alatTangkap]}`;
    }

    document.getElementById('v-pills-input-tab').click();
    window.scrollTo(0,0);
}

function deleteData(id) {
    const userCode = prompt("Masukkan KODE KEAMANAN SENSOR untuk menghapus data:");
    if(userCode === appSettings.securityCodeSensor) {
        if(confirm('Yakin menghapus data ini secara permanen?')) {
            appData = appData.filter(d => d.id != id);
            saveData(); 
            
            // Periksa apakah halaman saat ini akan kosong setelah penghapusan
            const totalItems = appData.length;
            const totalPages = Math.ceil(totalItems / appSettings.itemsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
            
            renderDataTable(); 
            updateDashboard();
            showNotification('Data berhasil dihapus', 'success');
            checkGlobalDuplicates();
        }
    } else if (userCode !== null) alert("Kode keamanan sensor SALAH!");
}

function toggleBulkDeleteBtn() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length > 0;
    const btn = document.getElementById('bulkDeleteBtn');
    if(checked) btn.classList.remove('d-none'); else btn.classList.add('d-none');
}

function bulkDeleteData() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    if(checkedBoxes.length === 0) return;
    
    const userCode = prompt(`Anda akan menghapus ${checkedBoxes.length} data.\nMasukkan KODE KEAMANAN SENSOR:`);
    if(userCode === appSettings.securityCodeSensor) {
        const idsToDelete = Array.from(checkedBoxes).map(cb => cb.value);
        appData = appData.filter(d => !idsToDelete.includes(d.id.toString()));
        saveData(); 
        currentPage = 1; // Reset ke halaman pertama setelah menghapus
        renderDataTable(); 
        updateDashboard();
        showNotification(`${idsToDelete.length} data berhasil dihapus`, 'success');
        document.getElementById('selectAllCheckbox').checked = false;
        checkGlobalDuplicates();
    } else if (userCode !== null) alert("Kode keamanan sensor SALAH!");
}

// --- FUNGSI FORM HANDLING ---
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('inputForm');
    const kodeVal = document.getElementById('kodeValidasi').value;
    if (!kodeVal || kodeVal.trim() === '') {
        showNotification('Anda WAJIB melakukan GENERATE KODE VALIDASI terlebih dahulu!', 'error');
        document.getElementById('generateKodeBtn').focus();
        return;
    }
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.reportValidity(); 
        return;
    }

    const nik = document.getElementById('nik').value;
    const whatsapp = document.getElementById('whatsapp').value;
    if(nik.length !== 16) return showNotification('NIK harus 16 digit', 'error');
    if(!whatsapp.match(/^\d+$/)) return showNotification('WhatsApp hanya angka', 'error');

    let selectedFish = [];
    document.querySelectorAll('.fish-checkbox:checked').forEach(cb => {
        if(cb.value === "Lainnya") {
            const otherVal = document.getElementById('jenisIkanLainnya').value.trim();
            if(otherVal) selectedFish.push(otherVal);
        } else {
            selectedFish.push(cb.value);
        }
    });
    if(selectedFish.length === 0) return showNotification('Pilih minimal satu jenis ikan!', 'error');

    const editId = form.getAttribute('data-edit-id');
    const duplicateCheck = appData.find(d => d.nik === nik);
    if (duplicateCheck && (!editId || duplicateCheck.id != editId)) {
        return showNotification('GAGAL: NIK sudah terdaftar dalam sistem!', 'error');
    }

    const isOwner = document.getElementById('statusNelayan').value === 'Pemilik Kapal';
    const formData = {
        id: editId || Date.now(),
        nama: document.getElementById('nama').value,
        nik: nik,
        whatsapp: whatsapp,
        profesi: document.getElementById('profesi').value,
        status: document.getElementById('statusNelayan').value,
        tahunLahir: document.getElementById('tahunLahir').value,
        usia: document.getElementById('usia').value,
        kecamatan: document.getElementById('kecamatan').value,
        desa: document.getElementById('desa').value,
        alatTangkap: document.getElementById('alatTangkap').value,
        namaKapal: isOwner ? document.getElementById('namaKapal').value : '-',
        jenisKapal: isOwner ? document.getElementById('jenisKapal').value : '-',
        jenisIkan: selectedFish.join(", "),
        usahaSampingan: document.getElementById('usahaSampingan').value,
        tanggalValidasi: document.getElementById('tanggalValidasi').value,
        validator: document.getElementById('validator').value,
        driveLink: document.getElementById('driveLink').value,
        kodeValidasi: document.getElementById('kodeValidasi').value,
        keterangan: document.getElementById('keterangan').value
    };

    if (editId) {
        const index = appData.findIndex(item => item.id == editId);
        appData[index] = formData;
        form.removeAttribute('data-edit-id');
        showNotification('Data berhasil diperbarui', 'success');
    } else {
        appData.push(formData);
        showNotification('Data berhasil disimpan', 'success');
    }

    saveData();
    form.reset();
    document.getElementById('ownerFields').style.display = 'none';
    document.getElementById('desa').innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
    document.getElementById('desa').disabled = true;
    document.getElementById('jenisIkanLainnya').style.display = 'none';
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggalValidasi').value = today;
    
    document.getElementById('apiInfo').style.display = 'none';
    document.getElementById('kapalInfo').style.display = 'none';
    document.getElementById('profesiHelp').innerHTML = '';
    document.getElementById('apiMappingInfo').style.display = 'none';

    updateDashboard(); 
    renderDataTable();
    document.getElementById('v-pills-data-tab').click();
    checkGlobalDuplicates();
}

// --- FUNGSI DASHBOARD ---
function initializeCharts() {
    const profesiCtx = document.getElementById('profesiChart').getContext('2d');
    const kapalCtx = document.getElementById('kapalChart').getContext('2d');

    if (window.profesiChart instanceof Chart) window.profesiChart.destroy();
    if (window.kapalChart instanceof Chart) window.kapalChart.destroy();

    window.profesiChart = new Chart(profesiCtx, {
        type: 'doughnut', 
        data: { labels: [], datasets: [] },
        options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
    });

    window.kapalChart = new Chart(kapalCtx, {
        type: 'bar', 
        data: { labels: [], datasets: [] },
        options: { maintainAspectRatio: false, responsive: true, scales: { y: { beginAtZero: true } } }
    });
    
    updateDashboard();
}

function updateDashboard() {
    if (!window.profesiChart || !window.kapalChart) return; 

    document.getElementById('totalPenerima').textContent = appData.length;
    const penuhWaktuCount = appData.filter(d => d.profesi === 'Nelayan Penuh Waktu').length;
    document.getElementById('totalPenuhWaktu').textContent = penuhWaktuCount;
    document.getElementById('totalPemilik').textContent = appData.filter(d => d.status === 'Pemilik Kapal').length;
    
    const sambilanUtamaCount = appData.filter(d => d.profesi === 'Nelayan Sambilan Utama').length;
    document.getElementById('totalSambilanUtama').textContent = sambilanUtamaCount;
    
    const sambilanTambahanCount = appData.filter(d => d.profesi === 'Nelayan Sambilan Tambahan').length;
    document.getElementById('totalSambilanTambahan').textContent = sambilanTambahanCount;
    
    const abkCount = appData.filter(d => d.status === 'Anak Buah Kapal').length;
    document.getElementById('totalABK').textContent = abkCount;

    const pData = {};
    appData.forEach(d => pData[d.profesi] = (pData[d.profesi] || 0) + 1);
    window.profesiChart.data = {
        labels: Object.keys(pData),
        datasets: [{ 
            data: Object.values(pData), 
            backgroundColor: ['#0c2461', '#e58e26', '#27ae60', '#4a69bd', '#f6b93b'] 
        }] 
    };
    window.profesiChart.update();

    const kData = {};
    appData.filter(d => d.status === 'Pemilik Kapal').forEach(d => kData[d.jenisKapal] = (kData[d.jenisKapal] || 0) + 1);
    window.kapalChart.data = {
        labels: Object.keys(kData),
        datasets: [{ label: 'Unit', data: Object.values(kData), backgroundColor: '#4a69bd' }]
    };
    window.kapalChart.update();
}

// --- FUNGSI STORAGE ---
function saveData() { 
    localStorage.setItem('nelayanData', JSON.stringify(appData)); 
}

function saveSettings() { 
    appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
    localStorage.setItem('nelayanSettings', JSON.stringify(appSettings)); 
}

function loadData() { 
    const d = localStorage.getItem('nelayanData'); 
    if(d) appData = JSON.parse(d); 
}

function loadSettings() { 
    const s = localStorage.getItem('nelayanSettings'); 
    if(s) {
        const loadedSettings = JSON.parse(s);
        loadedSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
        if (!loadedSettings.securityCodeSensor) {
            loadedSettings.securityCodeSensor = '987654321';
        }
        // TAMBAHAN: Load data pejabat jika ada
        if (!loadedSettings.officialName) {
            loadedSettings.officialName = 'SUGENG PURWO PRIYANTO, S.E, M.M';
        }
        if (!loadedSettings.officialNip) {
            loadedSettings.officialNip = '19761103 200903 1 001';
        }
        if (!loadedSettings.officialPosition) {
            loadedSettings.officialPosition = 'Kepala Bidang Pemberdayaan Nelayan';
        }
        // Pastikan itemsPerPage valid (minimal 1)
        if (!loadedSettings.itemsPerPage || loadedSettings.itemsPerPage < 1) {
            loadedSettings.itemsPerPage = 5;
        }
        Object.assign(appSettings, loadedSettings);
    }
}

// --- FUNGSI NOTIFICATION ---
function showNotification(message, type = 'info') {
    const toastEl = document.querySelector('.notification-toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    let title = 'Notifikasi';
    let bgClass = 'bg-primary';
    
    switch(type) {
        case 'success':
            title = 'Sukses!';
            bgClass = 'bg-success';
            break;
        case 'error':
            title = 'Error!';
            bgClass = 'bg-danger';
            break;
        case 'warning':
            title = 'Peringatan!';
            bgClass = 'bg-warning';
            break;
        case 'info':
        default:
            title = 'Informasi';
            bgClass = 'bg-primary';
            break;
    }
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// --- FUNGSI DUPLICATE CHECKER ---
function startDuplicateChecker() {
    checkGlobalDuplicates();
    duplicateCheckInterval = setInterval(checkGlobalDuplicates, 15000);
}

function checkGlobalDuplicates() {
    const counts = {};
    let hasDuplicate = false;
    for (const d of appData) {
        counts[d.nik] = (counts[d.nik] || 0) + 1;
        if (counts[d.nik] > 1) { hasDuplicate = true; break; }
    }
    document.getElementById('duplicateWarning').style.display = hasDuplicate ? 'block' : 'none';
}

// --- FUNGSI FLOATING MENU ---
function setupFloatingMenu() {
    const fabMain = document.getElementById('fabMainBtn');
    const container = document.getElementById('fabMenu');
    fabMain.addEventListener('click', () => {
        container.classList.toggle('open');
        const icon = fabMain.querySelector('i');
        if(container.classList.contains('open')){
            icon.classList.remove('fa-plus'); icon.classList.add('fa-times');
            fabMain.style.transform = "rotate(90deg)";
        } else {
            icon.classList.add('fa-plus'); icon.classList.remove('fa-times');
            fabMain.style.transform = "rotate(0deg)";
        }
    });
    
    const shortcuts = {
        'fabInput': 'v-pills-input-tab', 
        'fabFilter': 'v-pills-filter-tab',
        'fabVerify': 'v-pills-verify-tab',
        'fabExport': 'v-pills-export-tab', 
        'fabBackup': 'v-pills-backup-tab', 
        'fabSettings': 'v-pills-settings-tab'
    };
    
    for (const [id, tabId] of Object.entries(shortcuts)) {
        document.getElementById(id).addEventListener('click', (e) => {
            e.preventDefault(); 
            document.getElementById(tabId).click(); 
            container.classList.remove('open');
        });
    }
    
    document.getElementById('fabReload').addEventListener('click', (e) => {
        e.preventDefault(); 
        handleReloadRepo();
    });
}

// --- INISIALISASI APLIKASI ---
function initializeApp() {
    loadData();
    loadSettings();
    
    // Inisialisasi modal
    detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
    welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
    fishInfoModal = new bootstrap.Modal(document.getElementById('fishInfoModal'));
    
    // Inisialisasi dropdown kecamatan
    const kecSelect = document.getElementById('kecamatan');
    kecSelect.innerHTML = `<option value="">Pilih Kecamatan</option>`;
    if (typeof SITUBONDO_DATA !== 'undefined') {
        Object.keys(SITUBONDO_DATA).sort().forEach(kec => kecSelect.add(new Option(kec, kec)));
    }
    
    // Inisialisasi dropdown filter desa
    const allDesas = new Set();
    if (typeof SITUBONDO_DATA !== 'undefined') {
        Object.values(SITUBONDO_DATA).forEach(list => list.forEach(d => allDesas.add(d)));
    }
    const filterDesaSelect = document.getElementById('filterDesa');
    filterDesaSelect.innerHTML = `<option value="">Semua Desa</option>`;
    [...allDesas].sort().forEach(d => filterDesaSelect.add(new Option(d, d)));
    
    // Inisialisasi dropdown filter alat tangkap
    const filterAlatTangkap = document.getElementById('filterAlatTangkap');
    filterAlatTangkap.innerHTML = `<option value="">Semua</option>`;
    Object.keys(API_INFO).forEach(api => filterAlatTangkap.add(new Option(api, api)));
    
    // Inisialisasi dropdown filter jenis kapal
    const filterJenisKapal = document.getElementById('filterJenisKapal');
    filterJenisKapal.innerHTML = `<option value="">Semua</option>`;
    Object.keys(KAPAL_INFO).forEach(kapal => filterJenisKapal.add(new Option(kapal, kapal)));
    
    // Inisialisasi dropdown jenis kapal di form input
    const jenisKapalSelect = document.getElementById('jenisKapal');
    jenisKapalSelect.innerHTML = '<option value="">Pilih Jenis...</option>';
    Object.keys(KAPAL_INFO).forEach(kapal => {
        jenisKapalSelect.add(new Option(kapal, kapal));
    });
    
    // Inisialisasi dropdown alat tangkap di form input
    const alatTangkapSelect = document.getElementById('alatTangkap');
    alatTangkapSelect.innerHTML = '<option value="">Pilih Alat Penangkapan Ikan...</option>';
    Object.keys(API_INFO).forEach(api => {
        alatTangkapSelect.add(new Option(api, api));
    });
    
    updateAppIdentity();
    updatePrivacyUI();
    startDuplicateChecker();
    setupInfoTooltips();
    setupProfesiInfo();
    
    // Inisialisasi daftar ikan
    updateFishOptionsByAPI('');
    
    // Inisialisasi data pejabat
    loadOfficialData();
}

function setupInfoTooltips() {
    const alatTangkapSelect = document.getElementById('alatTangkap');
    const apiInfoDiv = document.getElementById('apiInfo');
    
    alatTangkapSelect.addEventListener('change', function() {
        const selected = this.value;
        if (selected && API_INFO[selected]) {
            apiInfoDiv.style.display = 'block';
            apiInfoDiv.innerHTML = `<strong>${selected}:</strong> ${API_INFO[selected]}`;
            updateFishOptionsByAPI(selected);
        } else {
            apiInfoDiv.style.display = 'none';
            updateFishOptionsByAPI('');
        }
    });

    const jenisKapalSelect = document.getElementById('jenisKapal');
    const kapalInfoDiv = document.getElementById('kapalInfo');
    
    jenisKapalSelect.addEventListener('change', function() {
        const selected = this.value;
        if (selected && KAPAL_INFO[selected]) {
            kapalInfoDiv.style.display = 'block';
            kapalInfoDiv.innerHTML = `<strong>${selected}:</strong> ${KAPAL_INFO[selected]}`;
            updateAlatTangkapByKapal();
        } else {
            kapalInfoDiv.style.display = 'none';
            document.getElementById('apiMappingInfo').style.display = 'none';
        }
    });
}

function setupProfesiInfo() {
    const profesiSelect = document.getElementById('profesi');
    const profesiHelp = document.getElementById('profesiHelp');
    
    profesiSelect.addEventListener('change', function() {
        const selected = this.value;
        if (selected && PROFESI_INFO[selected]) {
            profesiHelp.innerHTML = `
                <div class="profesi-info-box">
                    <div class="profesi-info-title">${selected}</div>
                    <div class="profesi-info-desc">${PROFESI_INFO[selected]}</div>
                </div>
            `;
        } else {
            profesiHelp.innerHTML = '';
        }
    });
}

// --- EVENT LISTENERS UTAMA ---
function setupEventListeners() {
    // Password Toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('securityCode');
            const icon = document.getElementById('passwordToggleIcon');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.title = "Sembunyikan kode";
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.title = "Lihat kode";
            }
        });
    }

    // Login Form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('loginButton');
        const spinner = document.getElementById('loginSpinner');
        const inputCode = document.getElementById('securityCode').value;
        const correctCode = generateSecurityCode();
        
        if (inputCode !== correctCode) {
            showNotification('Kode keamanan salah! Periksa kembali atau hubungi administrator.', 'error');
            return;
        }
        
        btn.disabled = true;
        spinner.classList.remove('d-none');
        btn.innerHTML = 'MEMBUKA SISTEM... <span class="spinner-border spinner-border-sm ms-2"></span>';
        
        setTimeout(() => {
            sessionStorage.setItem('simata_session', 'active');
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('appContent').style.display = 'block';
            initializeCharts();
            updateDashboard();
            renderDataTable();
            loginSuccessModal.show();
            btn.disabled = false;
            spinner.classList.add('d-none');
            btn.innerHTML = 'BUKA DASHBOARD';
        }, 1200);
    });

    // Continue to Dashboard
    document.getElementById('btnContinueDashboard').addEventListener('click', function() {
        loginSuccessModal.hide();
        setTimeout(() => {
            welcomeModal.show();
        }, 300);
    });

    // Welcome Modal Reload
    document.getElementById('btnWelcomeReload').addEventListener('click', function() {
        welcomeModal.hide();
        handleReloadRepo();
    });

    // No WhatsApp Button
    document.getElementById('btnNoWA').addEventListener('click', function() {
        const input = document.getElementById('whatsapp');
        if (input.hasAttribute('readonly')) {
            input.removeAttribute('readonly');
            input.value = '';
            input.setAttribute('required', 'required');
            this.classList.remove('active', 'btn-secondary');
            this.classList.add('btn-outline-secondary');
            this.textContent = "Tidak Ada";
        } else {
            input.value = '00000000';
            input.setAttribute('readonly', true);
            input.removeAttribute('required'); 
            this.classList.add('active', 'btn-secondary');
            this.classList.remove('btn-outline-secondary');
            this.textContent = "Batal";
        }
    });

    // Kecamatan Change
    document.getElementById('kecamatan').addEventListener('change', function() {
        const selectedKec = this.value;
        const desaSelect = document.getElementById('desa');
        desaSelect.innerHTML = `<option value="">Pilih Desa / Kelurahan</option>`;
        if (selectedKec && SITUBONDO_DATA && SITUBONDO_DATA[selectedKec]) {
            desaSelect.disabled = false;
            SITUBONDO_DATA[selectedKec].sort().forEach(desa => desaSelect.add(new Option(desa, desa)));
        } else {
            desaSelect.disabled = true;
            desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
        }
    });

    // Form Submit
    document.getElementById('inputForm').addEventListener('submit', handleFormSubmit);
    
    // Form Reset
    document.getElementById('inputForm').addEventListener('reset', () => {
        setTimeout(() => {
            document.getElementById('ownerFields').style.display = 'none';
            document.getElementById('usia').value = '';
            document.getElementById('desa').disabled = true;
            document.getElementById('desa').innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
            document.getElementById('inputForm').removeAttribute('data-edit-id');
            document.getElementById('jenisIkanLainnya').style.display = 'none';
            const kv = document.getElementById('kodeValidasi');
            kv.value = '';
            kv.removeAttribute('readonly'); 
            const waInput = document.getElementById('whatsapp');
            waInput.removeAttribute('readonly');
            const btnWa = document.getElementById('btnNoWA');
            btnWa.classList.remove('active', 'btn-secondary');
            btnWa.classList.add('btn-outline-secondary');
            btnWa.textContent = "Tidak Ada";
            document.getElementById('apiInfo').style.display = 'none';
            document.getElementById('kapalInfo').style.display = 'none';
            document.getElementById('profesiHelp').innerHTML = '';
            document.getElementById('apiMappingInfo').style.display = 'none';
            
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('tanggalValidasi').value = today;
            
            // Reset daftar ikan ke semua opsi
            updateFishOptionsByAPI('');
        }, 100);
    });
    
    // Status Nelayan Change
    document.getElementById('statusNelayan').addEventListener('change', function() {
        const isOwner = this.value === 'Pemilik Kapal';
        const ownerFields = document.getElementById('ownerFields');
        ownerFields.style.display = isOwner ? 'block' : 'none';
        if(!isOwner) {
            document.getElementById('namaKapal').value = '';
            document.getElementById('jenisKapal').value = '';
            document.getElementById('kapalInfo').style.display = 'none';
            document.getElementById('apiMappingInfo').style.display = 'none';
        }
    });

    // Tahun Lahir Input
    document.getElementById('tahunLahir').addEventListener('input', function() {
        const year = parseInt(this.value);
        const currentYear = new Date().getFullYear();
        if(year && this.value.length === 4 && year <= currentYear && year >= 1900) {
            document.getElementById('usia').value = currentYear - year;
        }
    });

    // Generate Kode Button
    document.getElementById('generateKodeBtn').addEventListener('click', function() {
        const nik = document.getElementById('nik').value;
        const kodeInput = document.getElementById('kodeValidasi');
        if (kodeInput.value && kodeInput.value.trim() !== '') {
            showNotification('Kode Validasi sudah digenerate dan bersifat permanen!', 'warning');
            return;
        }
        if(nik.length !== 16) {
            return showNotification('Isi NIK 16 digit terlebih dahulu!', 'error');
        }
        const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
        kodeInput.value = 'VLD-' + randomPart;
        showNotification('Kode Validasi berhasil dibuat dan terkunci.', 'success');
    });

    // Refresh Halaman Button
    document.getElementById('btn-refresh-page').addEventListener('click', refreshPage);

    // Mobile Menu
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebarMenu');
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        sidebar.classList.add('mobile-show');
        overlay.classList.add('active');
    });
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-show');
        overlay.classList.remove('active');
    });
    document.querySelectorAll('#sidebarMenu .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                sidebar.classList.remove('mobile-show');
                overlay.classList.remove('active');
            }
        });
    });
    
    // Logout
    document.getElementById('v-pills-logout-tab').addEventListener('click', () => {
        if(confirm('Apakah Anda yakin ingin keluar? Sistem akan mengunduh data (reload.js) secara otomatis.')) {
            sessionStorage.removeItem('simata_session');
            backupData('reload.js');
            setTimeout(() => location.reload(), 2000);
        }
    });

    // Search and Filter
    document.getElementById('searchData').addEventListener('input', function() {
        currentPage = 1; // Reset ke halaman pertama saat mencari
        renderDataTable();
    });
    
    // Filter & Validasi Data
    document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);
    document.getElementById('resetFilterBtn').addEventListener('click', resetFilter);
    document.getElementById('btnCekGanda').addEventListener('click', showDuplicateDataInFilter);
    document.getElementById('selectAllCheckbox').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
        toggleBulkDeleteBtn();
    });
    document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDeleteData);
    
    // Inisialisasi modul-modul lain
    initVerifikasiKIN();
    initCetak();
    initEkspor();
    initPengaturan();
    
    // Setup floating menu
    setupFloatingMenu();
}

// --- INISIALISASI SAAT DOKUMEN SIAP ---
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
        setupEventListeners();
        
        displayCurrentDate();
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tanggalValidasi').value = today;
        
        const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
        if (isSessionActive) {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('appContent').style.display = 'block';
            initializeCharts();
            updateDashboard();
            renderDataTable();
        } else {
            setTimeout(() => {
                document.getElementById('loginModal').style.display = 'flex';
            }, 100);
        }

        if (typeof window.handleHashRouting === 'function') {
            window.handleHashRouting();
        }

    } catch (error) {
        console.error("Initialization Error:", error);
        alert("Terjadi kesalahan sistem saat memuat. Silakan refresh.");
    }
});

// --- EKSPOS FUNGSI KE WINDOW ---
window.maskData = maskData;
window.viewDetail = viewDetail;
window.editData = editData;
window.deleteData = deleteData;
window.safeGenerateIDCard = safeGenerateIDCard;
window.showNotification = showNotification;
window.showFishInfoModal = showFishInfoModal;
window.renderDataTable = renderDataTable;
window.goToPage = goToPage;
window.applyFilter = applyFilter;
window.resetFilter = resetFilter;
window.showDuplicateDataInFilter = showDuplicateDataInFilter;
window.getFilteredData = getFilteredData;
window.refreshPage = refreshPage;
window.updateAlatTangkapByKapal = updateAlatTangkapByKapal;
window.updateFishOptionsByAPI = updateFishOptionsByAPI;

console.log('✅ SIMATA Application v5.5 FINAL initialized successfully');
console.log('✅ Semua modul berhasil dimuat dan sinkron');
