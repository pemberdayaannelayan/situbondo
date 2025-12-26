// main.js - Logika utama aplikasi SIMATA

// --- VARIABEL GLOBAL ---
let appData = [];
let appSettings = {
    appName: 'SISTEM PEMETAAN DATA NELAYAN',
    appSubtitle: 'DINAS PERIKANAN KABUPATEN SITUBONDO',
    itemsPerPage: 10,
    privacyMode: true,
    securityCodeSensor: '987654321'
};
let currentPage = 1;
let duplicateCheckInterval = null;
let currentDetailId = null;

// Modal instances
let detailModal, welcomeModal, loginSuccessModal;

// Mapping profesi
const PROFESI_MAPPING = {
    "Penuh Waktu": "Nelayan Penuh Waktu",
    "Sambilan Utama": "Nelayan Sambilan Utama",
    "Sambilan Tambahan": "Nelayan Sambilan Tambahan"
};

// --- FUNGSI UTAMA ---

// Fungsi untuk generate kode keamanan dinamis
function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
}

// Fungsi untuk menampilkan tanggal sekarang
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    if (document.getElementById('currentDateDisplay')) {
        document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
        document.getElementById('passwordHint').innerHTML = `Kode keamanan berubah setiap hari berdasarkan tanggal.`;
    }
}

// Fungsi untuk mask data
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

// Fungsi untuk notifikasi
function showNotification(message, type = 'info') {
    const toastEl = document.querySelector('.notification-toast');
    if (!toastEl) return;
    
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    let title = 'Notifikasi';
    let bgClass = 'bg-primary';
    
    switch(type) {
        case 'success':
            title = 'Sukses';
            bgClass = 'bg-success';
            break;
        case 'error':
            title = 'Error';
            bgClass = 'bg-danger';
            break;
        case 'warning':
            title = 'Peringatan';
            bgClass = 'bg-warning';
            break;
        case 'info':
        default:
            title = 'Info';
            bgClass = 'bg-primary';
    }
    
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;
    
    toastEl.classList.remove('bg-primary', 'bg-success', 'bg-danger', 'bg-warning');
    toastEl.classList.add(bgClass);
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Fungsi untuk generate ID Card dengan error handling
function safeGenerateIDCard(id) {
    const loadingEl = document.getElementById('idcardLoading');
    
    try {
        const d = appData.find(item => item.id == id);
        if (!d) {
            showNotification('Data nelayan tidak ditemukan!', 'error');
            return;
        }
        
        if (loadingEl) loadingEl.classList.add('active');
        
        if (typeof window.generateSimataIDCard === 'function') {
            setTimeout(() => {
                try {
                    window.generateSimataIDCard(d);
                } catch (error) {
                    console.error('Error in generateSimataIDCard:', error);
                    showNotification('Gagal membuat ID Card. Silakan coba lagi.', 'error');
                } finally {
                    if (loadingEl) loadingEl.classList.remove('active');
                }
            }, 100);
        } else {
            showNotification('Fitur ID Card sedang dimuat...', 'info');
            setTimeout(() => {
                if (typeof window.generateSimataIDCard === 'function') {
                    window.generateSimataIDCard(d);
                } else {
                    downloadSinglePdf(id);
                    showNotification('ID Card tidak tersedia, mengunduh PDF detail sebagai ganti.', 'warning');
                }
                if (loadingEl) loadingEl.classList.remove('active');
            }, 1000);
        }
    } catch (error) {
        console.error('Error in safeGenerateIDCard:', error);
        showNotification('Gagal membuat ID Card, coba lagi!', 'error');
        if (loadingEl) loadingEl.classList.remove('active');
    }
}

// --- FUNGSI VERIFIKASI KIN ---
function verifyKIN() {
    const verifyInput = document.getElementById('verifyInput');
    if (!verifyInput) return;
    
    const inputValue = verifyInput.value.trim();
    const verifyLoading = document.getElementById('verifyLoading');
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const verifyButton = document.getElementById('verifyButton');
    
    if (!inputValue) {
        showNotification('Masukkan NIK atau kode validasi terlebih dahulu!', 'error');
        return;
    }
    
    // Tampilkan loading
    if (verifyLoading) verifyLoading.style.display = 'block';
    if (verifyButton) verifyButton.disabled = true;
    
    // Simulasi loading
    setTimeout(() => {
        // Cari nelayan berdasarkan NIK atau kode validasi
        let foundNelayan = null;
        
        if (inputValue.length === 16 && /^\d+$/.test(inputValue)) {
            // Cari berdasarkan NIK
            foundNelayan = appData.find(n => n.nik === inputValue);
        } else {
            // Cari berdasarkan kode validasi
            foundNelayan = appData.find(n => n.kodeValidasi === inputValue);
        }
        
        // Sembunyikan loading
        if (verifyLoading) verifyLoading.style.display = 'none';
        if (verifyButton) verifyButton.disabled = false;
        
        // Tampilkan hasil verifikasi
        if (foundNelayan) {
            showVerificationResult(foundNelayan, true);
        } else {
            showVerificationResult(null, false, inputValue);
        }
    }, 1500);
}

function showVerificationResult(nelayanData, isValid, input = '') {
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    if (!verifyResultContainer) return;
    
    // Update breadcrumb
    if (breadcrumbItems.length >= 2) {
        breadcrumbItems[0].classList.remove('active');
        breadcrumbItems[1].classList.add('active');
    }
    
    if (isValid && nelayanData) {
        // Format timestamp
        const now = new Date();
        const timestamp = now.toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Tentukan badge class untuk profesi
        let profesiBadgeClass = 'badge-profesi-penuh';
        if (nelayanData.profesi === 'Nelayan Sambilan Utama') {
            profesiBadgeClass = 'badge-profesi-sambilan-utama';
        } else if (nelayanData.profesi === 'Nelayan Sambilan Tambahan') {
            profesiBadgeClass = 'badge-profesi-sambilan-tambahan';
        }
        
        // Tampilkan hasil valid
        verifyResultContainer.innerHTML = `
            <div class="verify-result-card verify-result-success">
                <div class="verify-icon-container verify-success-icon verify-success-animation">
                    <i class="fas fa-check"></i>
                </div>
                
                <h3 class="verify-result-title">✅ KARTU IDENTITAS NELAYAN VALID</h3>
                
                <div class="verify-result-message">
                    <p class="mb-3">Sistem telah memverifikasi bahwa <strong>${nelayanData.nama}</strong> tercatat sebagai nelayan resmi yang terdaftar di Sistem Informasi Pemetaan Data Nelayan Terpadu (SIMATA) Dinas Perikanan Kabupaten Situbondo.</p>
                    
                    <div class="alert alert-success mb-0">
                        <i class="fas fa-certificate me-2"></i>
                        <strong>STATUS VERIFIKASI:</strong> BERHASIL - Data sesuai dan tervalidasi
                    </div>
                </div>
                
                <div class="verify-details">
                    <h6 class="fw-bold text-primary mb-3">DETAIL IDENTITAS NELAYAN</h6>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Nama Lengkap</span>
                        <span class="verify-detail-value">${nelayanData.nama}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">NIK</span>
                        <span class="verify-detail-value">${nelayanData.nik}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Domisili</span>
                        <span class="verify-detail-value">${nelayanData.desa}, ${nelayanData.kecamatan}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Profesi</span>
                        <span class="verify-detail-value">
                            <span class="badge ${profesiBadgeClass}">${nelayanData.profesi}</span>
                        </span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Status</span>
                        <span class="verify-detail-value">${nelayanData.status}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Kode Validasi</span>
                        <span class="verify-detail-value fw-bold text-primary">${nelayanData.kodeValidasi || 'Tidak tersedia'}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Tanggal Validasi</span>
                        <span class="verify-detail-value">${nelayanData.tanggalValidasi}</span>
                    </div>
                </div>
                
                <div class="verify-timestamp">
                    <i class="fas fa-clock me-1"></i> Waktu Verifikasi: ${timestamp}
                </div>
                
                <div class="verify-actions">
                    <button type="button" class="btn btn-primary verify-action-btn" onclick="generateSimataIDCard(${JSON.stringify(nelayanData).replace(/'/g, "\\'")})">
                        <i class="fas fa-id-card me-1"></i> Cetak KIN
                    </button>
                    <button type="button" class="btn btn-outline-primary verify-action-btn" onclick="viewDetail('${nelayanData.id}')">
                        <i class="fas fa-eye me-1"></i> Lihat Detail Lengkap
                    </button>
                    <button type="button" class="btn btn-outline-secondary verify-action-btn" onclick="resetVerification()">
                        <i class="fas fa-redo me-1"></i> Verifikasi Lagi
                    </button>
                </div>
            </div>
        `;
        
        // Scroll ke hasil
        verifyResultContainer.scrollIntoView({ behavior: 'smooth' });
        
    } else {
        // Tampilkan hasil tidak valid
        verifyResultContainer.innerHTML = `
            <div class="verify-result-card verify-result-error verify-error-animation">
                <div class="verify-icon-container verify-error-icon">
                    <i class="fas fa-times"></i>
                </div>
                
                <h3 class="verify-result-title">❌ KARTU IDENTITAS TIDAK TERDAFTAR</h3>
                
                <div class="verify-result-message">
                    <p class="mb-3">Sistem <strong>TIDAK DAPAT</strong> menemukan data nelayan dengan identitas <strong>"${input}"</strong> dalam database Sistem Informasi Pemetaan Data Nelayan Terpadu (SIMATA) Dinas Perikanan Kabupaten Situbondo.</p>
                    
                    <div class="alert alert-danger mb-0">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>STATUS VERIFIKASI:</strong> GAGAL - Data tidak ditemukan dalam sistem
                    </div>
                </div>
                
                <div class="verify-details">
                    <h6 class="fw-bold text-danger mb-3">KEMUNGKINAN PENYEBAB</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> NIK atau kode validasi salah</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Data belum terdaftar dalam sistem</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Kartu identitas tidak valid atau kadaluarsa</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Kesalahan input data</li>
                    </ul>
                </div>
                
                <div class="verify-timestamp">
                    <i class="fas fa-clock me-1"></i> Waktu Verifikasi: ${new Date().toLocaleString('id-ID')}
                </div>
                
                <div class="verify-actions">
                    <button type="button" class="btn btn-danger verify-action-btn" onclick="resetVerification()">
                        <i class="fas fa-redo me-1"></i> Coba Lagi
                    </button>
                    <button type="button" class="btn btn-outline-secondary verify-action-btn" onclick="document.getElementById('v-pills-input-tab').click()">
                        <i class="fas fa-user-plus me-1"></i> Daftarkan Nelayan Baru
                    </button>
                </div>
            </div>
        `;
        
        // Scroll ke hasil
        verifyResultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    verifyResultContainer.style.display = 'block';
}

function resetVerification() {
    const verifyInput = document.getElementById('verifyInput');
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    // Reset input
    if (verifyInput) verifyInput.value = '';
    
    // Sembunyikan hasil
    if (verifyResultContainer) {
        verifyResultContainer.style.display = 'none';
        verifyResultContainer.innerHTML = '';
    }
    
    // Reset breadcrumb
    if (breadcrumbItems.length >= 2) {
        breadcrumbItems[0].classList.add('active');
        breadcrumbItems[1].classList.remove('active');
    }
    
    // Fokus ke input
    if (verifyInput) verifyInput.focus();
}

function toggleFAQ(id) {
    const answer = document.getElementById(`faqAnswer${id}`);
    const question = document.querySelector(`#faqAnswer${id}`).parentElement;
    const icon = question ? question.querySelector('i') : null;
    
    if (!answer || !icon) return;
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

function handleHashRouting() {
    const hash = window.location.hash;
    
    if (hash === '#verifikasi') {
        const verifyTab = document.getElementById('v-pills-verify-tab');
        if (verifyTab) {
            verifyTab.click();
            
            setTimeout(() => {
                const verifySection = document.getElementById('v-pills-verify');
                if (verifySection) {
                    verifySection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }
}

// --- FUNGSI INISIALISASI ---
function initializeApp() {
    loadData();
    loadSettings();
    
    // Migrasi data lama
    migrateOldData();
    
    // Inisialisasi select kecamatan
    const kecSelect = document.getElementById('kecamatan');
    if (kecSelect) {
        kecSelect.innerHTML = `<option value="">Pilih Kecamatan</option>`;
        if (window.SITUBONDO_DATA) {
            Object.keys(window.SITUBONDO_DATA).sort().forEach(kec => {
                kecSelect.add(new Option(kec, kec));
            });
        }
    }
    
    // Inisialisasi select desa untuk filter
    const filterDesaSelect = document.getElementById('filterDesa');
    if (filterDesaSelect && window.SITUBONDO_DATA) {
        filterDesaSelect.innerHTML = `<option value="">Semua Desa</option>`;
        const allDesas = new Set();
        Object.values(window.SITUBONDO_DATA).forEach(list => {
            list.forEach(d => allDesas.add(d));
        });
        [...allDesas].sort().forEach(d => {
            filterDesaSelect.add(new Option(d, d));
        });
    }
    
    // Inisialisasi select alat tangkap untuk filter
    const filterAlatTangkap = document.getElementById('filterAlatTangkap');
    if (filterAlatTangkap && window.API_INFO) {
        filterAlatTangkap.innerHTML = `<option value="">Semua</option>`;
        Object.keys(window.API_INFO).forEach(api => {
            filterAlatTangkap.add(new Option(api, api));
        });
    }
    
    updateAppIdentity();
    updatePrivacyUI();
    
    // Start duplicate checker
    startDuplicateChecker();
    
    // Setup info tooltips
    setupInfoTooltips();
    setupProfesiInfo();
}

function initFishOptions() {
    const container = document.getElementById('fishCheckboxContainer');
    if (!container || !window.FISH_TYPES) return;
    
    container.innerHTML = '';
    window.FISH_TYPES.forEach(fish => {
        const id = 'fish_' + fish.replace(/\s/g, '');
        const html = `
        <label class="fish-option-box">
            <input type="checkbox" class="form-check-input me-2 fish-checkbox" value="${fish}" id="${id}">
            <span>${fish}</span>
        </label>`;
        container.innerHTML += html;
    });

    const fishLainnya = document.getElementById('fish_Lainnya');
    const inputLain = document.getElementById('jenisIkanLainnya');
    
    if (fishLainnya && inputLain) {
        fishLainnya.addEventListener('change', function() {
            if (this.checked) {
                inputLain.style.display = 'block';
                inputLain.setAttribute('required', 'required');
            } else {
                inputLain.style.display = 'none';
                inputLain.value = '';
                inputLain.removeAttribute('required');
            }
        });
    }
}

function setupInfoTooltips() {
    const alatTangkapSelect = document.getElementById('alatTangkap');
    const apiInfoDiv = document.getElementById('apiInfo');
    
    if (alatTangkapSelect && apiInfoDiv && window.API_INFO) {
        alatTangkapSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected && window.API_INFO[selected]) {
                apiInfoDiv.style.display = 'block';
                apiInfoDiv.innerHTML = `<strong>${selected}:</strong> ${window.API_INFO[selected]}`;
            } else {
                apiInfoDiv.style.display = 'none';
            }
        });
    }

    const jenisKapalSelect = document.getElementById('jenisKapal');
    const kapalInfoDiv = document.getElementById('kapalInfo');
    
    if (jenisKapalSelect && kapalInfoDiv && window.KAPAL_INFO) {
        jenisKapalSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected && window.KAPAL_INFO[selected]) {
                kapalInfoDiv.style.display = 'block';
                kapalInfoDiv.innerHTML = `<strong>${selected}:</strong> ${window.KAPAL_INFO[selected]}`;
            } else {
                kapalInfoDiv.style.display = 'none';
            }
        });
    }
}

function setupProfesiInfo() {
    const profesiSelect = document.getElementById('profesi');
    const profesiHelp = document.getElementById('profesiHelp');
    
    if (profesiSelect && profesiHelp && window.PROFESI_INFO) {
        profesiSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected && window.PROFESI_INFO[selected]) {
                profesiHelp.innerHTML = `
                    <div class="profesi-info-box">
                        <div class="profesi-info-title">${selected}</div>
                        <div class="profesi-info-desc">${window.PROFESI_INFO[selected]}</div>
                    </div>
                `;
            } else {
                profesiHelp.innerHTML = '';
            }
        });
    }
}

function updateAppIdentity() {
    appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
    
    const appTitle = document.querySelector('.app-title');
    if (appTitle) appTitle.textContent = appSettings.appName;
    
    const dynamicSubtitle = document.getElementById('dynamicSubtitle');
    if (dynamicSubtitle) dynamicSubtitle.textContent = appSettings.appSubtitle;
    
    const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
    if (itemsPerPageSelect) itemsPerPageSelect.value = appSettings.itemsPerPage;
    
    const appNameInput = document.getElementById('appName');
    if (appNameInput) appNameInput.value = appSettings.appName;
    
    const appSubtitleInput = document.getElementById('appSubtitle');
    if (appSubtitleInput) appSubtitleInput.value = appSettings.appSubtitle;
}

function updatePrivacyUI() {
    const toggle = document.getElementById('privacyToggle');
    const status = document.getElementById('privacyStatus');
    const sensorText = document.getElementById('sensorStatusText');
    
    if (toggle) toggle.checked = appSettings.privacyMode;
    
    if (status) {
        if (appSettings.privacyMode) {
            status.innerHTML = "Status: <span class='text-success'>Sensor Aktif (Aman)</span>";
            status.className = "mt-2 small fw-bold";
        } else {
            status.innerHTML = "Status: <span class='text-danger'>Sensor Non-Aktif (Terbuka)</span>";
            status.className = "mt-2 small fw-bold";
        }
    }
    
    if (sensorText) {
        if (appSettings.privacyMode) {
            sensorText.innerHTML = "Sensor: ON";
            sensorText.className = "badge bg-success me-2";
        } else {
            sensorText.innerHTML = "Sensor: OFF";
            sensorText.className = "badge bg-danger me-2";
        }
    }
}

// --- FUNGSI DATA ---
function getFishIconClass(fishName) {
    const lower = fishName.toLowerCase();
    if (lower.includes('cumi')) return 'fa-ghost'; 
    if (lower.includes('kepiting')) return 'fa-spider'; 
    return 'fa-fish';
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Password toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('securityCode');
            const icon = document.getElementById('passwordToggleIcon');
            if (passwordInput && icon) {
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
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('loginButton');
            const spinner = document.getElementById('loginSpinner');
            const inputCode = document.getElementById('securityCode').value;
            const correctCode = generateSecurityCode();
            
            if (inputCode !== correctCode) {
                showNotification('Kode keamanan salah! Periksa kembali atau hubungi administrator.', 'error');
                return;
            }
            
            if (btn) btn.disabled = true;
            if (spinner) spinner.classList.remove('d-none');
            if (btn) btn.innerHTML = 'MEMBUKA SISTEM... <span class="spinner-border spinner-border-sm ms-2"></span>';
            
            setTimeout(() => {
                sessionStorage.setItem('simata_session', 'active');

                const loginModal = document.getElementById('loginModal');
                const appContent = document.getElementById('appContent');
                
                if (loginModal) loginModal.style.display = 'none';
                if (appContent) appContent.style.display = 'block';
                
                // Inisialisasi chart dan dashboard
                initializeCharts();
                updateDashboard();
                renderDataTable();
                
                setTimeout(() => {
                    if (typeof initializeMap === 'function') {
                        initializeMap();
                    }
                }, 500);
                
                // Tampilkan modal login success
                if (loginSuccessModal) {
                    loginSuccessModal.show();
                }
                
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = 'BUKA DASHBOARD';
                }
                if (spinner) spinner.classList.add('d-none');
            }, 1200);
        });
    }

    // Continue to dashboard button
    const btnContinueDashboard = document.getElementById('btnContinueDashboard');
    if (btnContinueDashboard && loginSuccessModal && welcomeModal) {
        btnContinueDashboard.addEventListener('click', function() {
            loginSuccessModal.hide();
            setTimeout(() => {
                welcomeModal.show();
            }, 300);
        });
    }

    // Welcome reload button
    const btnWelcomeReload = document.getElementById('btnWelcomeReload');
    if (btnWelcomeReload && welcomeModal) {
        btnWelcomeReload.addEventListener('click', function() {
            welcomeModal.hide();
            if (typeof handleReloadRepo === 'function') {
                handleReloadRepo();
            }
        });
    }

    // No WA button
    const btnNoWA = document.getElementById('btnNoWA');
    if (btnNoWA) {
        btnNoWA.addEventListener('click', function() {
            const input = document.getElementById('whatsapp');
            if (!input) return;
            
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
    }

    // Privacy toggle
    const privacyToggle = document.getElementById('privacyToggle');
    if (privacyToggle) {
        privacyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStatus = appSettings.privacyMode;
            
            if (currentStatus === true) {
                const code = prompt("MASUKKAN KODE KEAMANAN SENSOR untuk menonaktifkan sensor:");
                if (code === appSettings.securityCodeSensor) {
                    appSettings.privacyMode = false;
                    saveSettings(); 
                    updatePrivacyUI(); 
                    renderDataTable();
                    showNotification('Sensor Data dinonaktifkan.', 'warning');
                } else { 
                    alert("Kode Keamanan Sensor Salah!"); 
                    this.checked = true;
                }
            } else {
                appSettings.privacyMode = true;
                saveSettings(); 
                updatePrivacyUI(); 
                renderDataTable();
                showNotification('Sensor Data diaktifkan.', 'success');
            }
        });
    }

    // Kecamatan change event
    const kecamatanSelect = document.getElementById('kecamatan');
    if (kecamatanSelect) {
        kecamatanSelect.addEventListener('change', function() {
            const selectedKec = this.value;
            const desaSelect = document.getElementById('desa');
            if (!desaSelect) return;
            
            desaSelect.innerHTML = `<option value="">Pilih Desa / Kelurahan</option>`;
            if (selectedKec && window.SITUBONDO_DATA && window.SITUBONDO_DATA[selectedKec]) {
                desaSelect.disabled = false;
                window.SITUBONDO_DATA[selectedKec].sort().forEach(desa => {
                    desaSelect.add(new Option(desa, desa));
                });
            } else {
                desaSelect.disabled = true;
                desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
            }
        });
    }

    // Input form
    const inputForm = document.getElementById('inputForm');
    if (inputForm) {
        inputForm.addEventListener('submit', handleFormSubmit);
        
        inputForm.addEventListener('reset', () => {
            setTimeout(() => {
                const ownerFields = document.getElementById('ownerFields');
                if (ownerFields) ownerFields.style.display = 'none';
                
                const usiaInput = document.getElementById('usia');
                if (usiaInput) usiaInput.value = '';
                
                const desaSelect = document.getElementById('desa');
                if (desaSelect) {
                    desaSelect.disabled = true;
                    desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
                }
                
                inputForm.removeAttribute('data-edit-id');
                
                const fishCheckboxes = document.querySelectorAll('.fish-checkbox');
                fishCheckboxes.forEach(cb => cb.checked = false);
                
                const jenisIkanLainnya = document.getElementById('jenisIkanLainnya');
                if (jenisIkanLainnya) {
                    jenisIkanLainnya.style.display = 'none';
                    jenisIkanLainnya.value = '';
                }
                
                const kodeValidasi = document.getElementById('kodeValidasi');
                if (kodeValidasi) {
                    kodeValidasi.value = '';
                    kodeValidasi.removeAttribute('readonly');
                }
                
                const waInput = document.getElementById('whatsapp');
                const btnWa = document.getElementById('btnNoWA');
                if (waInput && btnWa) {
                    waInput.removeAttribute('readonly');
                    btnWa.classList.remove('active', 'btn-secondary');
                    btnWa.classList.add('btn-outline-secondary');
                    btnWa.textContent = "Tidak Ada";
                }
                
                const apiInfo = document.getElementById('apiInfo');
                if (apiInfo) apiInfo.style.display = 'none';
                
                const kapalInfo = document.getElementById('kapalInfo');
                if (kapalInfo) kapalInfo.style.display = 'none';
                
                const profesiHelp = document.getElementById('profesiHelp');
                if (profesiHelp) profesiHelp.innerHTML = '';
                
                const today = new Date().toISOString().split('T')[0];
                const tanggalValidasi = document.getElementById('tanggalValidasi');
                if (tanggalValidasi) tanggalValidasi.value = today;
            }, 100);
        });
    }
    
    // Status nelayan change event
    const statusNelayan = document.getElementById('statusNelayan');
    if (statusNelayan) {
        statusNelayan.addEventListener('change', function() {
            const isOwner = this.value === 'Pemilik Kapal';
            const ownerFields = document.getElementById('ownerFields');
            if (ownerFields) {
                ownerFields.style.display = isOwner ? 'block' : 'none';
                if (!isOwner) {
                    const namaKapal = document.getElementById('namaKapal');
                    const jenisKapal = document.getElementById('jenisKapal');
                    const kapalInfo = document.getElementById('kapalInfo');
                    
                    if (namaKapal) namaKapal.value = '';
                    if (jenisKapal) jenisKapal.value = '';
                    if (kapalInfo) kapalInfo.style.display = 'none';
                }
            }
        });
    }

    // Tahun lahir input event
    const tahunLahir = document.getElementById('tahunLahir');
    if (tahunLahir) {
        tahunLahir.addEventListener('input', function() {
            const year = parseInt(this.value);
            const currentYear = new Date().getFullYear();
            const usiaInput = document.getElementById('usia');
            
            if (usiaInput && year && this.value.length === 4 && year <= currentYear && year >= 1900) {
                usiaInput.value = currentYear - year;
            }
        });
    }

    // Generate kode button
    const generateKodeBtn = document.getElementById('generateKodeBtn');
    if (generateKodeBtn) {
        generateKodeBtn.addEventListener('click', function() {
            const nik = document.getElementById('nik').value;
            const kodeInput = document.getElementById('kodeValidasi');
            if (!kodeInput) return;
            
            if (kodeInput.value && kodeInput.value.trim() !== '') {
                showNotification('Kode Validasi sudah digenerate dan bersifat permanen!', 'warning');
                return;
            }
            
            if (nik.length !== 16) {
                showNotification('Isi NIK 16 digit terlebih dahulu!', 'error');
                return;
            }
            
            const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
            kodeInput.value = 'VLD-' + randomPart;
            showNotification('Kode Validasi berhasil dibuat dan terkunci.', 'success');
        });
    }

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn && sidebar && overlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('mobile-show');
            overlay.classList.add('active');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-show');
            overlay.classList.remove('active');
        });
        
        const sidebarLinks = document.querySelectorAll('#sidebarMenu .nav-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    sidebar.classList.remove('mobile-show');
                    overlay.classList.remove('active');
                }
            });
        });
    }
    
    // Logout button
    const logoutTab = document.getElementById('v-pills-logout-tab');
    if (logoutTab) {
        logoutTab.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin keluar? Sistem akan mengunduh data (reload.js) secara otomatis.')) {
                sessionStorage.removeItem('simata_session');
                if (typeof backupData === 'function') {
                    backupData('reload.js');
                }
                setTimeout(() => location.reload(), 2000);
            }
        });
    }

    // Search data
    const searchData = document.getElementById('searchData');
    if (searchData) {
        searchData.addEventListener('input', renderDataTable);
    }

    // Apply filter button
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', renderFilterTable);
    }

    // Check duplicate button
    const btnCekGanda = document.getElementById('btnCekGanda');
    if (btnCekGanda) {
        btnCekGanda.addEventListener('click', showDuplicateDataInFilter);
    }

    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(cb => cb.checked = this.checked);
            toggleBulkDeleteBtn();
        });
    }

    // Bulk delete button
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', bulkDeleteData);
    }

    // Verify button
    const verifyButton = document.getElementById('verifyButton');
    if (verifyButton) {
        verifyButton.addEventListener('click', verifyKIN);
    }

    // Verify input enter key
    const verifyInput = document.getElementById('verifyInput');
    if (verifyInput) {
        verifyInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyKIN();
            }
        });
    }

    // Print PDF button
    const printPdfBtn = document.getElementById('printPdfBtn');
    if (printPdfBtn) {
        printPdfBtn.addEventListener('click', printData);
    }

    // Export Excel button
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', () => exportData('xlsx'));
    }

    // Export reload.js button
    const exportReloadJsBtn = document.getElementById('exportReloadJsBtn');
    if (exportReloadJsBtn) {
        exportReloadJsBtn.addEventListener('click', () => {
            if (typeof backupData === 'function') {
                backupData('reload.js');
            }
        });
    }

    // Send WA button
    const sendWaBtn = document.getElementById('sendWaBtn');
    if (sendWaBtn) {
        sendWaBtn.addEventListener('click', sendDataToWhatsapp);
    }

    // Backup data button
    const backupDataBtn = document.getElementById('backupDataBtn');
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', () => {
            if (typeof backupData === 'function') {
                backupData();
            }
        });
    }

    // Restore file input
    const restoreFileInput = document.getElementById('restoreFileInput');
    if (restoreFileInput) {
        restoreFileInput.addEventListener('change', function() {
            const restoreDataBtn = document.getElementById('restoreDataBtn');
            if (restoreDataBtn) {
                restoreDataBtn.disabled = !this.files.length;
            }
        });
    }

    // Restore data button
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    if (restoreDataBtn) {
        restoreDataBtn.addEventListener('click', function() {
            if (typeof restoreData === 'function') {
                restoreData();
            }
        });
    }

    // Reload repo button
    const reloadRepoBtn = document.getElementById('btn-reload-repo');
    if (reloadRepoBtn) {
        reloadRepoBtn.addEventListener('click', function() {
            if (typeof handleReloadRepo === 'function') {
                handleReloadRepo();
            }
        });
    }

    // Download detail PDF button
    const btnDownloadDetailPdf = document.getElementById('btnDownloadDetailPdf');
    if (btnDownloadDetailPdf) {
        btnDownloadDetailPdf.addEventListener('click', () => {
            if (currentDetailId) {
                downloadSinglePdf(currentDetailId);
            }
        });
    }

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
            
            const appSubtitleInput = document.getElementById('appSubtitle');
            if (appSubtitleInput) appSettings.appSubtitle = appSubtitleInput.value;
            
            const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
            if (itemsPerPageSelect) appSettings.itemsPerPage = parseInt(itemsPerPageSelect.value);
            
            saveSettings(); 
            updateAppIdentity(); 
            renderDataTable();
            showNotification('Pengaturan tersimpan! Nama instansi berhasil diperbarui.', 'success');
        });
    }

    // Sensor code form
    const sensorCodeForm = document.getElementById('sensorCodeForm');
    if (sensorCodeForm) {
        sensorCodeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentCode = document.getElementById('currentSensorCode').value;
            const newCode = document.getElementById('newSensorCode').value;
            const confirmCode = document.getElementById('confirmSensorCode').value;
            
            if (currentCode !== appSettings.securityCodeSensor) {
                showNotification('Kode keamanan sensor saat ini salah!', 'error');
                return;
            }
            
            if (newCode.length < 6) {
                showNotification('Kode keamanan baru minimal 6 digit!', 'error');
                return;
            }
            
            if (newCode !== confirmCode) {
                showNotification('Konfirmasi kode baru tidak cocok!', 'error');
                return;
            }
            
            appSettings.securityCodeSensor = newCode;
            saveSettings();
            
            const currentSensorCodeInput = document.getElementById('currentSensorCode');
            const newSensorCodeInput = document.getElementById('newSensorCode');
            const confirmSensorCodeInput = document.getElementById('confirmSensorCode');
            
            if (currentSensorCodeInput) currentSensorCodeInput.value = '';
            if (newSensorCodeInput) newSensorCodeInput.value = '';
            if (confirmSensorCodeInput) confirmSensorCodeInput.value = '';
            
            showNotification('Kode keamanan sensor berhasil diperbarui!', 'success');
        });
    }

    // Setup floating menu
    setupFloatingMenu();
}

function setupFloatingMenu() {
    const fabMain = document.getElementById('fabMainBtn');
    const container = document.getElementById('fabMenu');
    
    if (!fabMain || !container) return;
    
    fabMain.addEventListener('click', () => {
        container.classList.toggle('open');
        const icon = fabMain.querySelector('i');
        if (container.classList.contains('open')) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-times');
            fabMain.style.transform = "rotate(90deg)";
        } else {
            icon.classList.add('fa-plus');
            icon.classList.remove('fa-times');
            fabMain.style.transform = "rotate(0deg)";
        }
    });
    
    const shortcuts = {
        'fabInput': 'v-pills-input-tab',
        'fabFilter': 'v-pills-filter-tab',
        'fabExport': 'v-pills-export-tab',
        'fabBackup': 'v-pills-backup-tab',
        'fabSettings': 'v-pills-settings-tab'
    };
    
    for (const [id, tabId] of Object.entries(shortcuts)) {
        const element = document.getElementById(id);
        const tabElement = document.getElementById(tabId);
        
        if (element && tabElement) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                tabElement.click();
                container.classList.remove('open');
            });
        }
    }
    
    const fabReload = document.getElementById('fabReload');
    if (fabReload) {
        fabReload.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof handleReloadRepo === 'function') {
                handleReloadRepo();
            }
        });
    }
}

// --- CORE LOGIC FUNCTIONS ---
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('inputForm');
    const kodeVal = document.getElementById('kodeValidasi').value;
    
    if (!kodeVal || kodeVal.trim() === '') {
        showNotification('Anda WAJIB melakukan GENERATE KODE VALIDASI terlebih dahulu!', 'error');
        const generateKodeBtn = document.getElementById('generateKodeBtn');
        if (generateKodeBtn) generateKodeBtn.focus();
        return;
    }
    
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.reportValidity(); 
        return;
    }

    const nik = document.getElementById('nik').value;
    const whatsapp = document.getElementById('whatsapp').value;
    
    if (nik.length !== 16) {
        showNotification('NIK harus 16 digit', 'error');
        return;
    }
    
    if (!whatsapp.match(/^\d+$/)) {
        showNotification('WhatsApp hanya angka', 'error');
        return;
    }

    // Get selected fish types
    let selectedFish = [];
    document.querySelectorAll('.fish-checkbox:checked').forEach(cb => {
        if (cb.value === "Lainnya") {
            const otherVal = document.getElementById('jenisIkanLainnya').value.trim();
            if (otherVal) selectedFish.push(otherVal);
        } else {
            selectedFish.push(cb.value);
        }
    });
    
    if (selectedFish.length === 0) {
        showNotification('Pilih minimal satu jenis ikan!', 'error');
        return;
    }

    const editId = form.getAttribute('data-edit-id');
    const duplicateCheck = appData.find(d => d.nik === nik);
    
    if (duplicateCheck && (!editId || duplicateCheck.id != editId)) {
        showNotification('GAGAL: NIK sudah terdaftar dalam sistem!', 'error');
        return;
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
    
    const ownerFields = document.getElementById('ownerFields');
    if (ownerFields) ownerFields.style.display = 'none';
    
    const desaSelect = document.getElementById('desa');
    if (desaSelect) {
        desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
        desaSelect.disabled = true;
    }
    
    const fishCheckboxes = document.querySelectorAll('.fish-checkbox');
    fishCheckboxes.forEach(cb => cb.checked = false);
    
    const jenisIkanLainnya = document.getElementById('jenisIkanLainnya');
    if (jenisIkanLainnya) {
        jenisIkanLainnya.style.display = 'none';
        jenisIkanLainnya.value = '';
    }
    
    const today = new Date().toISOString().split('T')[0];
    const tanggalValidasi = document.getElementById('tanggalValidasi');
    if (tanggalValidasi) tanggalValidasi.value = today;
    
    const apiInfo = document.getElementById('apiInfo');
    if (apiInfo) apiInfo.style.display = 'none';
    
    const kapalInfo = document.getElementById('kapalInfo');
    if (kapalInfo) kapalInfo.style.display = 'none';
    
    const profesiHelp = document.getElementById('profesiHelp');
    if (profesiHelp) profesiHelp.innerHTML = '';

    updateDashboard(); 
    renderDataTable();
    
    if (typeof renderMapMarkers === 'function') {
        renderMapMarkers();
    }
    
    if (typeof updateMapStatistics === 'function') {
        updateMapStatistics();
    }
    
    const dataTab = document.getElementById('v-pills-data-tab');
    if (dataTab) dataTab.click();
    
    checkGlobalDuplicates();
}

function renderDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    const search = document.getElementById('searchData') ? document.getElementById('searchData').value.toLowerCase() : '';
    let filtered = appData.filter(d => JSON.stringify(d).toLowerCase().includes(search));
    
    const nikCounts = {};
    appData.forEach(d => nikCounts[d.nik] = (nikCounts[d.nik] || 0) + 1);

    const totalItems = filtered.length;
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const pageData = filtered.slice(start, start + appSettings.itemsPerPage);

    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">Data tidak ditemukan</td></tr>`;
        toggleBulkDeleteBtn();
        return;
    }

    pageData.forEach((d, i) => {
        const kapalInfo = d.status === 'Pemilik Kapal' ? 
            `<div class="text-truncate-2 small fw-bold text-primary">${d.namaKapal}</div><div class="small text-muted">${d.jenisKapal}</div>` : '-';
        
        const isDuplicate = nikCounts[d.nik] > 1;
        const rowClass = isDuplicate ? 'table-danger' : '';
        
        let badgeClass = 'bg-secondary';
        if (d.profesi === 'Nelayan Penuh Waktu') badgeClass = 'badge-profesi-penuh';
        else if (d.profesi === 'Nelayan Sambilan Utama') badgeClass = 'badge-profesi-sambilan-utama';
        else if (d.profesi === 'Nelayan Sambilan Tambahan') badgeClass = 'badge-profesi-sambilan-tambahan';
        
        const displayNik = maskData(d.nik);
        const displayWaRaw = maskData(d.whatsapp);
        
        let contactDisplay = '';
        if (displayWaRaw === "Tidak Ada") {
            contactDisplay = `<span class="badge bg-light text-muted border">Tidak Ada</span>`;
        } else {
            if (appSettings.privacyMode) {
                contactDisplay = `<div class="small"><i class="fas fa-phone-alt text-secondary me-1"></i> ${displayWaRaw}</div>`;
            } else {
                let cleanNum = d.whatsapp;
                if (cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.substring(1);
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
        
        const tbodyRow = document.createElement('tbody');
        tbodyRow.innerHTML = row;
        tableBody.appendChild(tbodyRow);
    });
    
    const tableInfo = document.getElementById('tableInfo');
    if (tableInfo) {
        tableInfo.textContent = `Menampilkan ${pageData.length} dari ${totalItems} data (Limit: ${appSettings.itemsPerPage})`;
    }
    
    updatePagination(totalItems);
    toggleBulkDeleteBtn();
}

// ... (Continue with other functions from the original code)
// Note: Due to character limits, I cannot include the entire main.js file here
// The remaining functions should be copied from the original code

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize modal instances
        detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
        welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
        
        initializeApp();
        setupEventListeners();
        initFishOptions();
        
        displayCurrentDate();
        
        const today = new Date().toISOString().split('T')[0];
        const tanggalValidasi = document.getElementById('tanggalValidasi');
        if (tanggalValidasi) tanggalValidasi.value = today;
        
        const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
        if (isSessionActive) {
            const loginModal = document.getElementById('loginModal');
            const appContent = document.getElementById('appContent');
            
            if (loginModal) loginModal.style.display = 'none';
            if (appContent) appContent.style.display = 'block';
            
            initializeCharts();
            updateDashboard();
            renderDataTable();
            
            setTimeout(() => {
                if (typeof initializeMap === 'function') {
                    initializeMap();
                }
            }, 500);
        } else {
            setTimeout(() => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) loginModal.style.display = 'flex';
            }, 100);
        }

        // Handle hash routing untuk verifikasi
        handleHashRouting();

    } catch (error) {
        console.error("Initialization Error:", error);
        alert("Terjadi kesalahan sistem saat memuat. Silakan refresh.");
    }
});

// Ekspor fungsi ke global scope
window.appData = appData;
window.appSettings = appSettings;
window.maskData = maskData;
window.showNotification = showNotification;
window.safeGenerateIDCard = safeGenerateIDCard;
window.verifyKIN = verifyKIN;
window.showVerificationResult = showVerificationResult;
window.resetVerification = resetVerification;
window.toggleFAQ = toggleFAQ;
window.handleHashRouting = handleHashRouting;
window.generateSecurityCode = generateSecurityCode;
