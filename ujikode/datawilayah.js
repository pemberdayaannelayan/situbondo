// datawilayah.js - MODUL PENGELOLAAN DATA WILAYAH

// Daftar desa untuk fitur Data Wilayah
const DESA_LIST = [
    { name: "Kilensari", file: "kilensari.js" },
    { name: "Klatakan", file: "klatakan.js" },
    { name: "Pasir Putih", file: "pasirputih.js" },
    { name: "Ketah", file: "ketah.js" },
    { name: "Demung", file: "demung.js" },
    { name: "Pesisir", file: "pesisir.js" },
    { name: "Besuki", file: "besuki.js" },
    { name: "Kalianget", file: "kalianget.js" },
    { name: "Sumberanyar", file: "sumberanyar.js" },
    { name: "Tanjung Pecinan", file: "tanjungpecinan.js" },
    { name: "Tanjung Kamal", file: "tanjungkamal.js" },
    { name: "Buduan", file: "buduan.js" },
    { name: "Lamongan", file: "lamongan.js" },
    { name: "Sumberwaru", file: "sumberwaru.js" },
    { name: "Duwet", file: "duwet.js" },
    { name: "Gelung", file: "gelung.js" },
    { name: "Peleyan", file: "peleyan.js" },
    { name: "Alasmalang", file: "alasmalang.js" },
    { name: "Wringinanom-Asembagus", file: "wringinanomasembagus.js" },
    { name: "Wringinanom-Panarukan", file: "wringinanompanarukan.js" },
    { name: "Sumberkolak", file: "sumberkolak.js" },
    { name: "Tanjung Glugur", file: "tanjungglugur.js" },
    { name: "Semiring", file: "semiring.js" },
    { name: "Arjasa", file: "arjasa.js" },
    { name: "Landangan", file: "landangan.js" },
    { name: "Seletreng", file: "seletreng.js" },
    { name: "Bungatan", file: "bungatan.js" },
    { name: "Blitok", file: "blitok.js" },
    { name: "Mlandingan Kulon", file: "mlandingankulon.js" },
    { name: "Selomukti", file: "selomukti.js" },
    { name: "Banyuglugur", file: "banyuglugur.js" },
    { name: "Wonorejo", file: "wonorejo.js" },
    { name: "Sumberejo", file: "sumberrejo.js" },
    { name: "Jangkar", file: "jangkar.js" },
    { name: "Gadingan", file: "gadingan.js" },
    { name: "Kumbangsari", file: "kumbangsari.js" },
    { name: "Paowan", file: "paowan.js" }
];

// Fungsi untuk mendapatkan kecamatan dari nama desa
function getKecamatanByDesa(desaName) {
    if (!window.SITUBONDO_DATA) return null;
    
    for (const kec in window.SITUBONDO_DATA) {
        if (window.SITUBONDO_DATA[kec].includes(desaName)) {
            return kec;
        }
    }
    return null;
}

// Inisialisasi Data Wilayah
function initDataWilayah() {
    const container = document.getElementById('wilayahCardsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Urutkan desa berdasarkan nama
    const sortedDesa = [...DESA_LIST].sort((a, b) => a.name.localeCompare(b.name));
    
    // Tambahkan kartu untuk setiap desa
    sortedDesa.forEach(desa => {
        const card = document.createElement('div');
        card.className = 'wilayah-card';
        
        // Cek jika ini desa yang sedang aktif
        if (window.currentWilayah && window.currentWilayah.mode === 'desa' && window.currentWilayah.desaName === desa.name) {
            card.classList.add('active');
        }
        
        card.innerHTML = `
            <div class="wilayah-card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-map-marker-alt me-2"></i>
                        <strong>${desa.name}</strong>
                    </div>
                    ${window.currentWilayah && window.currentWilayah.mode === 'desa' && window.currentWilayah.desaName === desa.name ? 
                        '<span class="badge bg-success">Aktif</span>' : ''}
                </div>
            </div>
            <div class="wilayah-card-body">
                <div class="wilayah-info-badge">
                    <i class="fas fa-database me-1"></i> Data Tersedia
                </div>
                
                <div class="wilayah-actions">
                    <button class="btn wilayah-btn wilayah-btn-load" onclick="loadDataByDesa('${desa.name}', '${desa.file}')">
                        <i class="fas fa-database"></i>
                        <span>Muat Data</span>
                    </button>
                    <button class="btn wilayah-btn wilayah-btn-input" onclick="setupInputForDesa('${desa.name}')">
                        <i class="fas fa-plus"></i>
                        <span>Input Data</span>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Update total desa count
    const totalDesaCount = document.getElementById('totalDesaCount');
    if (totalDesaCount) totalDesaCount.textContent = sortedDesa.length;
    
    // Update status indicator
    updateWilayahStatusIndicator();
}

// Fungsi untuk setup input data berdasarkan desa
function setupInputForDesa(desaName) {
    const modalDataWilayah = bootstrap.Modal.getInstance(document.getElementById('modalDataWilayah'));
    if (modalDataWilayah) modalDataWilayah.hide();
    
    // Cari kecamatan dari desa ini
    const kecamatan = getKecamatanByDesa(desaName);
    
    // Set mode wilayah ke desa
    if (window.currentWilayah) {
        window.currentWilayah.mode = 'desa';
        window.currentWilayah.desaName = desaName;
        window.currentWilayah.fileName = DESA_LIST.find(d => d.name === desaName)?.file || `${desaName.toLowerCase()}.js`;
    }
    
    // Update UI wilayah
    updateWilayahUI();
    updateWilayahStatusIndicator();
    
    // Buka tab Input Data
    const inputTab = document.getElementById('v-pills-input-tab');
    if (inputTab) inputTab.click();
    
    // Atur dropdown kecamatan dan desa
    if (kecamatan) {
        const kecSelect = document.getElementById('kecamatan');
        if (kecSelect) {
            kecSelect.value = kecamatan;
            // Trigger change event untuk memuat desa
            kecSelect.dispatchEvent(new Event('change'));
            
            // Setelah dropdown desa terisi, atur desa
            setTimeout(() => {
                const desaSelect = document.getElementById('desa');
                if (desaSelect) {
                    desaSelect.value = desaName;
                }
                
                // Focus ke field nama
                const namaInput = document.getElementById('nama');
                if (namaInput) namaInput.focus();
                
                if (window.showNotification) {
                    window.showNotification(`Mode input data untuk Desa ${desaName} telah diaktifkan. Data yang diinput akan otomatis tersimpan untuk desa ini.`, 'success');
                }
            }, 500);
        }
    } else {
        if (window.showNotification) {
            window.showNotification(`Desa ${desaName} tidak ditemukan dalam data kecamatan.`, 'warning');
        }
    }
}

// Fungsi untuk memuat data dari desa tertentu
function loadDataByDesa(desaName, fileName) {
    if (confirm(`Anda akan memuat data dari Desa ${desaName}. Data saat ini akan digantikan. Lanjutkan?`)) {
        if (window.showLoading) {
            window.showLoading("Memuat Data Desa", `Sedang memproses data dari Desa ${desaName}. Mohon tunggu...`);
        }
        
        // Reset currentWilayah
        if (window.currentWilayah) {
            window.currentWilayah.mode = 'desa';
            window.currentWilayah.desaName = desaName;
            window.currentWilayah.fileName = fileName;
        }
        
        // Update UI
        updateWilayahUI();
        updateWilayahStatusIndicator();
        
        // Load data dari file JavaScript
        const script = document.createElement('script');
        script.src = fileName + '?t=' + new Date().getTime();
        
        script.onload = function() {
            console.log(`File ${fileName} berhasil dimuat`);
            
            // Beri waktu untuk pemrosesan
            setTimeout(() => {
                if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                    try {
                        // Ganti data dengan data baru dari desa
                        if (window.appData) {
                            window.appData = window.SIMATA_BACKUP_DATA;
                        }
                        if (window.saveData) window.saveData();
                        if (window.renderDataTable) window.renderDataTable();
                        if (window.updateDashboard) window.updateDashboard();
                        
                        if (window.hideLoading) window.hideLoading();
                        if (window.showNotification) {
                            window.showNotification(`Data dari Desa ${desaName} berhasil dimuat (${window.SIMATA_BACKUP_DATA.length} data)`, 'success');
                        }
                        
                        const modalDataWilayah = bootstrap.Modal.getInstance(document.getElementById('modalDataWilayah'));
                        if (modalDataWilayah) modalDataWilayah.hide();
                        
                        // Update filter desa
                        if (window.updateFilterDesaOptions) window.updateFilterDesaOptions();
                        
                    } catch (error) {
                        console.error('Error memuat data desa:', error);
                        if (window.hideLoading) window.hideLoading();
                        if (window.showNotification) {
                            window.showNotification('Gagal memuat data dari desa. Format data tidak valid.', 'error');
                        }
                    }
                } else {
                    if (window.hideLoading) window.hideLoading();
                    if (window.showNotification) {
                        window.showNotification(`Tidak ada data yang ditemukan di file ${fileName}`, 'warning');
                    }
                }
            }, 500);
        };
        
        script.onerror = function() {
            console.error(`Gagal memuat file ${fileName}`);
            if (window.hideLoading) window.hideLoading();
            if (window.showNotification) {
                window.showNotification(`Maaf, Desa Tersebut Masih Belum Ada Data Di SIMPADAN TANGKAP`, 'error');
            }
        };
        
        document.head.appendChild(script);
    }
}

// Fungsi untuk mengaktifkan mode global dari wilayah
function setInputGlobalMode() {
    if (confirm('Anda akan beralih ke mode Input Global. Data saat ini akan tetap tersimpan. Lanjutkan?')) {
        if (window.currentWilayah) {
            window.currentWilayah.mode = 'global';
            window.currentWilayah.desaName = null;
            window.currentWilayah.fileName = 'reload.js';
        }
        
        // Reload data dari reload.js
        if (window.handleReloadRepo) window.handleReloadRepo();
        updateWilayahUI();
        updateWilayahStatusIndicator();
        if (window.showNotification) {
            window.showNotification('Mode Input Global diaktifkan. Data dari reload.js akan dimuat.', 'info');
        }
    }
}

// Update UI wilayah
function updateWilayahUI() {
    const badge = document.getElementById('currentWilayahBadge');
    const info = document.getElementById('wilayahInfo');
    const inputModeBadge = document.getElementById('inputModeBadge');
    const desaWarning = document.getElementById('desaWarning');
    const submitFormBtn = document.getElementById('submitFormBtn');
    
    if (!window.currentWilayah) return;
    
    if (window.currentWilayah.mode === 'desa') {
        if (badge) {
            badge.innerHTML = `Wilayah: Desa ${window.currentWilayah.desaName}`;
            badge.className = 'badge bg-info';
        }
        if (info && window.currentWilayah.desaName && window.currentWilayah.fileName) {
            info.textContent = `Mode Desa: Data dari ${window.currentWilayah.fileName}. Input data hanya untuk desa ${window.currentWilayah.desaName}.`;
        }
        if (inputModeBadge) {
            inputModeBadge.textContent = `Mode: Desa ${window.currentWilayah.desaName}`;
            inputModeBadge.className = 'badge bg-info float-end';
        }
        if (desaWarning) desaWarning.classList.remove('d-none');
        if (submitFormBtn) submitFormBtn.disabled = false;
    } else {
        if (badge) {
            badge.innerHTML = 'Wilayah: Global (reload.js)';
            badge.className = 'badge bg-primary';
        }
        if (info) info.textContent = 'Mode Global: Data dari reload.js. Input data bebas tanpa batasan desa.';
        if (inputModeBadge) {
            inputModeBadge.textContent = 'Mode: Global';
            inputModeBadge.className = 'badge bg-warning float-end';
        }
        if (desaWarning) desaWarning.classList.add('d-none');
        if (submitFormBtn) submitFormBtn.disabled = false;
    }
}

// Fungsi untuk update status indicator di modal
function updateWilayahStatusIndicator() {
    const indicator = document.getElementById('wilayahStatusIndicator');
    if (!indicator || !window.currentWilayah) return;
    
    if (window.currentWilayah.mode === 'desa') {
        indicator.className = 'wilayah-status-indicator wilayah-status-desa';
        indicator.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>Mode Desa: ${window.currentWilayah.desaName || '-'}</span>`;
    } else {
        indicator.className = 'wilayah-status-indicator wilayah-status-global';
        indicator.innerHTML = `<i class="fas fa-globe"></i><span>Mode Global</span>`;
    }
}

// Inisialisasi event listener untuk Data Wilayah
function initWilayahEventListeners() {
    // Tombol Data Wilayah
    const btnDataWilayah = document.getElementById('btnDataWilayah');
    if (btnDataWilayah) {
        btnDataWilayah.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('modalDataWilayah'));
            modal.show();
        });
    }

    // Tombol Input Global
    const btnInputGlobal = document.getElementById('btnInputGlobal');
    if (btnInputGlobal) {
        btnInputGlobal.addEventListener('click', setInputGlobalMode);
    }

    // Tombol Input Global di Modal
    const btnInputGlobalModal = document.getElementById('btnInputGlobalModal');
    if (btnInputGlobalModal) {
        btnInputGlobalModal.addEventListener('click', function() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalDataWilayah'));
            if (modal) modal.hide();
            setInputGlobalMode();
        });
    }

    // Tombol Global Mode di modal
    const btnGlobalMode = document.getElementById('btnGlobalMode');
    if (btnGlobalMode) {
        btnGlobalMode.addEventListener('click', function() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalDataWilayah'));
            if (modal) modal.hide();
            setInputGlobalMode();
        });
    }

    // Search wilayah di modal
    const searchWilayah = document.getElementById('searchWilayah');
    if (searchWilayah) {
        searchWilayah.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.wilayah-card');
            let visibleCount = 0;
            
            cards.forEach(card => {
                const desaName = card.querySelector('strong')?.textContent.toLowerCase();
                if (desaName && desaName.includes(searchTerm)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const emptyState = document.getElementById('wilayahEmptyState');
            const cardsContainer = document.getElementById('wilayahCardsContainer');
            
            if (visibleCount === 0 && searchTerm.trim() !== '') {
                if (emptyState) emptyState.classList.remove('d-none');
                if (cardsContainer) cardsContainer.classList.add('d-none');
            } else {
                if (emptyState) emptyState.classList.add('d-none');
                if (cardsContainer) cardsContainer.classList.remove('d-none');
            }
        });
    }
}

// Ekspos fungsi ke global scope
window.DESA_LIST = DESA_LIST;
window.getKecamatanByDesa = getKecamatanByDesa;
window.initDataWilayah = initDataWilayah;
window.setupInputForDesa = setupInputForDesa;
window.loadDataByDesa = loadDataByDesa;
window.setInputGlobalMode = setInputGlobalMode;
window.updateWilayahUI = updateWilayahUI;
window.updateWilayahStatusIndicator = updateWilayahStatusIndicator;
window.initWilayahEventListeners = initWilayahEventListeners;

// Inisialisasi saat dokumen siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initWilayahEventListeners();
    });
} else {
    initWilayahEventListeners();
}
