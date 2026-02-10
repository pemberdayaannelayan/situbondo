// =====================================================
// KODE UTAMA APLIKASI SIMPADAN TANGKAP - VERSI 6.1 FINAL REVISI

// =====================================================



// =====================================================
// BAGIAN 4: FUNGSI SHOW/HIDE PASSWORD
// =====================================================

/**
 * SETUP TOGGLE PASSWORD VISIBILITY
 * @param {string} inputId - ID input password
 * @param {string} buttonId - ID tombol toggle
 */
function setupPasswordToggle(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);
    
    if (!passwordInput || !toggleButton) return;
    
    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            this.title = "Tampilkan password";
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            this.title = "Sembunyikan password";
        }
    });
}

/**
 * SETUP SEMUA TOGGLE PASSWORD
 * Setup untuk semua input password di aplikasi
 */
function setupAllPasswordToggles() {
    // Setup untuk login form
    setupPasswordToggle('securityCode', 'passwordToggle');
    
    // Setup untuk sensor code form
    const sensorForm = document.getElementById('sensorCodeForm');
    if (sensorForm) {
        const inputs = [
            { id: 'currentSensorCode', btnId: 'currentSensorCodeToggle' },
            { id: 'newSensorCode', btnId: 'newSensorCodeToggle' },
            { id: 'confirmSensorCode', btnId: 'confirmSensorCodeToggle' }
        ];
        
        inputs.forEach(input => {
            const inputElement = document.getElementById(input.id);
            if (inputElement && !inputElement.parentElement.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                inputElement.parentNode.insertBefore(wrapper, inputElement);
                wrapper.appendChild(inputElement);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = input.btnId;
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle(input.id, input.btnId);
            }
        });
    }
}

// =====================================================
// BAGIAN 5: FUNGSI KEAMANAN MENU
// =====================================================

/**
 * INISIALISASI MODAL AUTHENTIKASI MENU
 * Membuat modal autentikasi dinamis
 */
function initMenuAuthModal() {
    if (!document.getElementById('menuAuthModal')) {
        const modalHTML = `
        <div class="modal fade" id="menuAuthModal" tabindex="-1" aria-labelledby="menuAuthModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="menuAuthModalLabel">Autentikasi Menu</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="menuAuthPassword" class="form-label">Masukkan Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="menuAuthPassword" placeholder="Password" autocomplete="off">
                                <button class="btn btn-outline-secondary" type="button" id="menuAuthPasswordToggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Masukkan password untuk mengakses menu ini.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="menuAuthCancelBtn">Batal</button>
                        <button type="button" class="btn btn-primary" id="menuAuthSubmit">Masuk</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        document.getElementById('menuAuthSubmit').addEventListener('click', handleMenuAuthSubmit);
        document.getElementById('menuAuthCancelBtn').addEventListener('click', redirectToDashboard);
        
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', redirectToDashboard);
        }
        
        setupPasswordToggle('menuAuthPassword', 'menuAuthPasswordToggle');
        
        document.getElementById('menuAuthPassword').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMenuAuthSubmit();
            }
        });
    } else {
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            modalElement.removeEventListener('hidden.bs.modal', redirectToDashboard);
            modalElement.addEventListener('hidden.bs.modal', redirectToDashboard);
        }
    }
}

/**
 * REDIRECT KE DASHBOARD
 * Mengarahkan pengguna ke menu dashboard
 */
function redirectToDashboard() {
    const dashboardTab = document.getElementById('v-pills-dashboard-tab');
    if (dashboardTab) {
        dashboardTab.click();
    }
}

/**
 * MENAMPILKAN MODAL AUTHENTIKASI MENU
 * @param {string} menuType - Jenis menu ('input' atau 'data')
 * @param {string} menuName - Nama menu untuk ditampilkan
 */
function showMenuAuth(menuType, menuName) {
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        document.getElementById('v-pills-input-tab').click();
        return;
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        document.getElementById('v-pills-data-tab').click();
        return;
    }
    
    document.getElementById('menuAuthModal').setAttribute('data-menu-type', menuType);
    document.getElementById('menuAuthModal').setAttribute('data-menu-name', menuName);
    
    document.getElementById('menuAuthModalLabel').textContent = `Autentikasi Menu ${menuName}`;
    document.getElementById('menuAuthPassword').value = '';
    document.getElementById('menuAuthPassword').type = 'password';
    
    const toggleIcon = document.querySelector('#menuAuthPasswordToggle i');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
    
    menuAuthModal.show();
    
    setTimeout(() => {
        document.getElementById('menuAuthPassword').focus();
    }, 500);
}

/**
 * HANDLE SUBMIT AUTHENTIKASI MENU
 * Memproses autentikasi password menu
 */
function handleMenuAuthSubmit() {
    const password = document.getElementById('menuAuthPassword').value;
    const menuType = document.getElementById('menuAuthModal').getAttribute('data-menu-type');
    const menuName = document.getElementById('menuAuthModal').getAttribute('data-menu-name');
    
    let correctPassword = '';
    if (menuType === 'input') {
        correctPassword = appSettings.passwordInputData;
    } else if (menuType === 'data') {
        correctPassword = appSettings.passwordDataNelayan;
    }
    
    if (password === correctPassword) {
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        sessionStorage.setItem(`menu_auth_${menuType}`, 'true');
        
        menuAuthModal.hide();
        showNotification(`Autentikasi berhasil! Mengakses menu ${menuName}`, 'success');
        
        if (menuType === 'input') {
            document.getElementById('v-pills-input-tab').click();
        } else if (menuType === 'data') {
            document.getElementById('v-pills-data-tab').click();
        }
    } else {
        showNotification('Password salah! Silakan coba lagi.', 'error');
        document.getElementById('menuAuthPassword').value = '';
        document.getElementById('menuAuthPassword').focus();
    }
}

/**
 * CEK STATUS AUTHENTIKASI MENU
 * @param {string} menuType - Jenis menu ('input' atau 'data')
 * @returns {boolean} Status autentikasi
 */
function checkMenuAuth(menuType) {
    const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
    if (!isSessionActive) {
        return false;
    }
    
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        return true;
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        return true;
    }
    
    if (menuType === 'input' && menuAuthStatus.inputData) {
        return true;
    }
    if (menuType === 'data' && menuAuthStatus.dataNelayan) {
        return true;
    }
    
    const sessionAuth = sessionStorage.getItem(`menu_auth_${menuType}`);
    if (sessionAuth === 'true') {
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        return true;
    }
    
    return false;
}

/**
 * SETUP EVENT LISTENER UNTUK AUTHENTIKASI MENU
 */
function setupMenuAuthListeners() {
    const inputDataTab = document.getElementById('v-pills-input-tab');
    if (inputDataTab) {
        inputDataTab.addEventListener('click', function(e) {
            if (!checkMenuAuth('input')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('input', 'Input Data');
            }
        });
    }
    
    const dataNelayanTab = document.getElementById('v-pills-data-tab');
    if (dataNelayanTab) {
        dataNelayanTab.addEventListener('click', function(e) {
            if (!checkMenuAuth('data')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('data', 'Data Nelayan');
            }
        });
    }
}

/**
 * RESET STATUS AUTHENTIKASI MENU
 */
function resetMenuAuth() {
    menuAuthStatus.inputData = false;
    menuAuthStatus.dataNelayan = false;
    
    sessionStorage.removeItem('menu_auth_input');
    sessionStorage.removeItem('menu_auth_data');
}

// =====================================================
// BAGIAN 6: FUNGSI TOGGLE KEAMANAN MENU ON/OFF
// =====================================================

/**
 * INISIALISASI TOGGLE KEAMANAN MENU
 * Setup toggle untuk mengaktifkan/nonaktifkan kode keamanan menu
 */
function initMenuSecurityToggles() {
    const toggleInputData = document.getElementById('toggleSecurityMenuInputData');
    if (toggleInputData) {
        toggleInputData.checked = appSettings.securityMenuInputDataEnabled;
        updateMenuSecurityToggleUI('input', appSettings.securityMenuInputDataEnabled);
    }
    
    const toggleDataNelayan = document.getElementById('toggleSecurityMenuDataNelayan');
    if (toggleDataNelayan) {
        toggleDataNelayan.checked = appSettings.securityMenuDataNelayanEnabled;
        updateMenuSecurityToggleUI('data', appSettings.securityMenuDataNelayanEnabled);
    }
    
    setupMenuSecurityToggleListeners();
}

/**
 * UPDATE UI TOGGLE KEAMANAN MENU
 * @param {string} menuType - Jenis menu ('input' atau 'data')
 * @param {boolean} isEnabled - Status toggle
 */
function updateMenuSecurityToggleUI(menuType, isEnabled) {
    const toggleElement = document.getElementById(`toggleSecurityMenu${menuType === 'input' ? 'InputData' : 'DataNelayan'}`);
    const statusElement = document.getElementById(`securityMenu${menuType === 'input' ? 'InputData' : 'DataNelayan'}Status`);
    
    if (!toggleElement || !statusElement) return;
    
    if (isEnabled) {
        statusElement.innerHTML = `<span class="text-success fw-bold">ON (Aktif)</span>`;
        statusElement.className = "mt-2 small fw-bold text-success";
        toggleElement.checked = true;
    } else {
        statusElement.innerHTML = `<span class="text-danger fw-bold">OFF (Non-Aktif)</span>`;
        statusElement.className = "mt-2 small fw-bold text-danger";
        toggleElement.checked = false;
    }
}

/**
 * SETUP EVENT LISTENERS UNTUK TOGGLE KEAMANAN MENU
 */
function setupMenuSecurityToggleListeners() {
    const toggleInputData = document.getElementById('toggleSecurityMenuInputData');
    if (toggleInputData) {
        toggleInputData.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStatus = appSettings.securityMenuInputDataEnabled;
            
            if (currentStatus === true) {
                const code = prompt("MASUKKAN KODE KEAMANAN SENSOR untuk menonaktifkan kode keamanan menu Input Data:");
                if (code === appSettings.securityCodeSensor) {
                    appSettings.securityMenuInputDataEnabled = false;
                    saveSettings();
                    updateMenuSecurityToggleUI('input', false);
                    showNotification('Kode keamanan menu Input Data dinonaktifkan.', 'warning');
                } else { 
                    alert("Kode Keamanan Sensor Salah!"); 
                    this.checked = true;
                }
            } else {
                appSettings.securityMenuInputDataEnabled = true;
                saveSettings();
                updateMenuSecurityToggleUI('input', true);
                showNotification('Kode keamanan menu Input Data diaktifkan.', 'success');
            }
        });
    }
    
    const toggleDataNelayan = document.getElementById('toggleSecurityMenuDataNelayan');
    if (toggleDataNelayan) {
        toggleDataNelayan.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStatus = appSettings.securityMenuDataNelayanEnabled;
            
            if (currentStatus === true) {
                const code = prompt("MASUKKAN KODE KEAMANAN SENSOR untuk menonaktifkan kode keamanan menu Data Nelayan:");
                if (code === appSettings.securityCodeSensor) {
                    appSettings.securityMenuDataNelayanEnabled = false;
                    saveSettings();
                    updateMenuSecurityToggleUI('data', false);
                    showNotification('Kode keamanan menu Data Nelayan dinonaktifkan.', 'warning');
                } else { 
                    alert("Kode Keamanan Sensor Salah!"); 
                    this.checked = true;
                }
            } else {
                appSettings.securityMenuDataNelayanEnabled = true;
                saveSettings();
                updateMenuSecurityToggleUI('data', true);
                showNotification('Kode keamanan menu Data Nelayan diaktifkan.', 'success');
            }
        });
    }
}

// =====================================================
// BAGIAN 7: FUNGSI UTILITAS UTAMA
// =====================================================

/**
 * MENDAPATKAN LABEL PROFESI
 * @param {string} profesi - Kode profesi
 * @returns {string} Label profesi lengkap
 */
function getProfesiLabel(profesi) {
    return PROFESI_MAPPING[profesi] || profesi;
}

/**
 * MIGRASI DATA LAMA
 * Update struktur data lama ke format baru
 */
function migrateOldData() {
    appData.forEach(item => {
        if (PROFESI_MAPPING[item.profesi]) {
            item.profesi = PROFESI_MAPPING[item.profesi];
        }
        if (!item.hasOwnProperty('alamat')) {
            item.alamat = '';
        }
    });
    saveData();
}

/**
 * GENERATE KODE KEAMANAN HARIAN
 * @returns {string} Kode keamanan berdasarkan tanggal
 */
function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * MENAMPILKAN TANGGAL SEKARANG
 */
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    document.getElementById('passwordHint').innerHTML = `Masukkan kode keamanan untuk mengakses sistem`;
}

/**
 * MASK DATA SENSITIF
 * @param {string} data - Data yang akan dimask
 * @param {boolean} force - Paksa masking meski privacy mode off
 * @returns {string} Data yang sudah dimask
 */
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

/**
 * MENDAPATKAN ICON CLASS UNTUK IKAN
 * @param {string} fishName - Nama ikan
 * @returns {string} Class FontAwesome untuk ikan
 */
function getFishIconClass(fishName) {
    const lower = fishName.toLowerCase();
    if (lower.includes('cumi')) return 'fa-ghost'; 
    if (lower.includes('kepiting')) return 'fa-spider'; 
    if (lower.includes('togek') || lower.includes('mendut')) return 'fa-star'; 
    return 'fa-fish';
}


// =====================================================
// BAGIAN 24: INITIALIZATION
// =====================================================

/**
 * INITIALIZE APP
 * Inisialisasi seluruh aplikasi
 */
function initializeApp() {
    loadData();
    loadSettings();
    migrateOldData();
    
    initDataWilayah();
    initMenuAuthModal();
    
    if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
        console.log("Data backup terdeteksi. Ready untuk merge/sync.");
    }

    const kecSelect = document.getElementById('kecamatan');
    if (kecSelect) {
        kecSelect.innerHTML = `<option value="">Pilih Kecamatan</option>`;
        if (typeof SITUBONDO_DATA !== 'undefined') {
            Object.keys(SITUBONDO_DATA).sort().forEach(kec => kecSelect.add(new Option(kec, kec)));
        }
    }
    
    const filterDesaSelect = document.getElementById('filterDesa');
    if (filterDesaSelect) {
        filterDesaSelect.innerHTML = `<option value="">Semua Desa</option>`;
        const allDesas = new Set();
        if (typeof SITUBONDO_DATA !== 'undefined') {
            Object.values(SITUBONDO_DATA).forEach(list => list.forEach(d => allDesas.add(d)));
        }
        [...allDesas].sort().forEach(d => filterDesaSelect.add(new Option(d, d)));
    }
    
    const filterAlatTangkap = document.getElementById('filterAlatTangkap');
    if (filterAlatTangkap) {
        filterAlatTangkap.innerHTML = `<option value="">Semua</option>`;
        Object.keys(API_INFO).forEach(api => filterAlatTangkap.add(new Option(api, api)));
    }
    
    const filterJenisKapal = document.getElementById('filterJenisKapal');
    if (filterJenisKapal) {
        filterJenisKapal.innerHTML = `<option value="">Semua</option>`;
        Object.keys(KAPAL_INFO).forEach(kapal => filterJenisKapal.add(new Option(kapal, kapal)));
    }
    
    const jenisKapalSelect = document.getElementById('jenisKapal');
    if (jenisKapalSelect) {
        jenisKapalSelect.innerHTML = '<option value="">Pilih Jenis...</option>';
        Object.keys(KAPAL_INFO).forEach(kapal => {
            jenisKapalSelect.add(new Option(kapal, kapal));
        });
    }
    
    const alatTangkapSelect = document.getElementById('alatTangkap');
    if (alatTangkapSelect) {
        alatTangkapSelect.innerHTML = '<option value="">Pilih Alat Penangkapan Ikan...</option>';
        Object.keys(API_INFO).forEach(api => {
            alatTangkapSelect.add(new Option(api, api));
        });
    }
    
    updateAppIdentity();
    updatePrivacyUI();
    updateWilayahUI();
    updateWilayahStatusIndicator();
    startDuplicateChecker();
    setupInfoTooltips();
    setupProfesiInfo();
    
    updateFishOptionsByAPI('');
    loadOfficialData();
    setupAutoUppercaseInputs();
    setupMenuAuthListeners();
    setupAllPasswordToggles();
    initMenuSecurityToggles();
}

// =====================================================
// BAGIAN 25: MAIN EVENT LISTENERS
// =====================================================

/**
 * SETUP EVENT LISTENERS
 * Setup semua event listener untuk aplikasi
 */
function setupEventListeners() {
    setupAllPasswordToggles();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('loginButton');
            const spinner = document.getElementById('loginSpinner');
            const inputCode = document.getElementById('securityCode').value;
            const correctCode = generateSecurityCode();
            
            if (!btn || !spinner) return;
            
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
    }

    const continueBtn = document.getElementById('btnContinueDashboard');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            loginSuccessModal.hide();
            setTimeout(() => {
                welcomeModal.show();
            }, 300);
        });
    }

    const welcomeReloadBtn = document.getElementById('btnWelcomeReload');
    if (welcomeReloadBtn) {
        welcomeReloadBtn.addEventListener('click', function() {
            welcomeModal.hide();
            handleReloadRepo();
        });
    }

    const noWaBtn = document.getElementById('btnNoWA');
    if (noWaBtn) {
        noWaBtn.addEventListener('click', function() {
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

    const kecamatanSelect = document.getElementById('kecamatan');
    if (kecamatanSelect) {
        kecamatanSelect.addEventListener('change', function() {
            const selectedKec = this.value;
            const desaSelect = document.getElementById('desa');
            if (!desaSelect) return;
            
            desaSelect.innerHTML = `<option value="">Pilih Desa / Kelurahan</option>`;
            if (selectedKec && SITUBONDO_DATA && SITUBONDO_DATA[selectedKec]) {
                desaSelect.disabled = false;
                SITUBONDO_DATA[selectedKec].sort().forEach(desa => desaSelect.add(new Option(desa, desa)));
            } else {
                desaSelect.disabled = true;
                desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
            }
        });
    }

    const inputForm = document.getElementById('inputForm');
    if (inputForm) {
        inputForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (inputForm) {
        inputForm.addEventListener('reset', () => {
            setTimeout(() => {
                const ownerFields = document.getElementById('ownerFields');
                const usiaInput = document.getElementById('usia');
                const desaSelect = document.getElementById('desa');
                const jenisIkanLainnya = document.getElementById('jenisIkanLainnya');
                const waInput = document.getElementById('whatsapp');
                const btnWa = document.getElementById('btnNoWA');
                const alamatInput = document.getElementById('alamat');
                
                if (ownerFields) ownerFields.style.display = 'none';
                if (usiaInput) usiaInput.value = '';
                if (alamatInput) alamatInput.value = '';
                if (desaSelect) {
                    desaSelect.disabled = true;
                    desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
                }
                if (inputForm) inputForm.removeAttribute('data-edit-id');
                if (jenisIkanLainnya) {
                    jenisIkanLainnya.style.display = 'none';
                    jenisIkanLainnya.value = '';
                }
                
                const kv = document.getElementById('kodeValidasi');
                if (kv) {
                    kv.value = '';
                    kv.removeAttribute('readonly'); 
                }
                
                if (waInput) waInput.removeAttribute('readonly');
                if (btnWa) {
                    btnWa.classList.remove('active', 'btn-secondary');
                    btnWa.classList.add('btn-outline-secondary');
                    btnWa.textContent = "Tidak Ada";
                }
                
                const apiInfo = document.getElementById('apiInfo');
                const kapalInfo = document.getElementById('kapalInfo');
                const profesiHelp = document.getElementById('profesiHelp');
                const apiMappingInfo = document.getElementById('apiMappingInfo');
                
                if (apiInfo) apiInfo.style.display = 'none';
                if (kapalInfo) kapalInfo.style.display = 'none';
                if (profesiHelp) profesiHelp.innerHTML = '';
                if (apiMappingInfo) apiMappingInfo.style.display = 'none';
                
                const today = new Date().toISOString().split('T')[0];
                const tanggalValidasi = document.getElementById('tanggalValidasi');
                if (tanggalValidasi) tanggalValidasi.value = today;
                
                updateFishOptionsByAPI('');
            }, 100);
        });
    }
    
    const statusNelayan = document.getElementById('statusNelayan');
    if (statusNelayan) {
        statusNelayan.addEventListener('change', function() {
            const isOwner = this.value === 'Pemilik Kapal';
            const ownerFields = document.getElementById('ownerFields');
            if (ownerFields) {
                ownerFields.style.display = isOwner ? 'block' : 'none';
                if(!isOwner) {
                    const namaKapal = document.getElementById('namaKapal');
                    const jenisKapal = document.getElementById('jenisKapal');
                    const kapalInfo = document.getElementById('kapalInfo');
                    const apiMappingInfo = document.getElementById('apiMappingInfo');
                    
                    if (namaKapal) namaKapal.value = '';
                    if (jenisKapal) jenisKapal.value = '';
                    if (kapalInfo) kapalInfo.style.display = 'none';
                    if (apiMappingInfo) apiMappingInfo.style.display = 'none';
                }
            }
        });
    }

    const tahunLahirInput = document.getElementById('tahunLahir');
    if (tahunLahirInput) {
        tahunLahirInput.addEventListener('input', function() {
            const year = parseInt(this.value);
            const currentYear = new Date().getFullYear();
            const usiaInput = document.getElementById('usia');
            if (!usiaInput) return;
            
            if(year && this.value.length === 4 && year <= currentYear && year >= 1900) {
                usiaInput.value = currentYear - year;
            }
        });
    }

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
            if(nik.length !== 16) {
                return showNotification('Isi NIK 16 digit terlebih dahulu!', 'error');
            }
            const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
            kodeInput.value = 'VLD-' + randomPart;
            showNotification('Kode Validasi berhasil dibuat dan terkunci.', 'success');
        });
    }

    const btnDataWilayah = document.getElementById('btnDataWilayah');
    if (btnDataWilayah) {
        btnDataWilayah.addEventListener('click', function() {
            modalDataWilayah.show();
        });
    }

    const btnInputGlobal = document.getElementById('btnInputGlobal');
    if (btnInputGlobal) {
        btnInputGlobal.addEventListener('click', setInputGlobalMode);
    }

    const btnInputGlobalModal = document.getElementById('btnInputGlobalModal');
    if (btnInputGlobalModal) {
        btnInputGlobalModal.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    const btnGlobalMode = document.getElementById('btnGlobalMode');
    if (btnGlobalMode) {
        btnGlobalMode.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    const btnGlobalModeKecamatan = document.getElementById('btnGlobalModeKecamatan');
    if (btnGlobalModeKecamatan) {
        btnGlobalModeKecamatan.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    const searchWilayah = document.getElementById('searchWilayah');
    if (searchWilayah) {
        searchWilayah.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            const activeTab = document.querySelector('#wilayahTabs .nav-link.active');
            if (!activeTab) return;
            
            let cardSelector, emptyStateId, containerId;
            
            if (activeTab.id === 'desa-tab') {
                cardSelector = '#wilayahDesaCardsContainer .wilayah-card';
                emptyStateId = 'wilayahDesaEmptyState';
                containerId = 'wilayahDesaCardsContainer';
            } else {
                cardSelector = '#wilayahKecamatanCardsContainer .wilayah-card';
                emptyStateId = 'wilayahKecamatanEmptyState';
                containerId = 'wilayahKecamatanCardsContainer';
            }
            
            const cards = document.querySelectorAll(cardSelector);
            let visibleCount = 0;
            
            cards.forEach(card => {
                const name = card.querySelector('strong').textContent.toLowerCase();
                if (name.includes(searchTerm)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const emptyState = document.getElementById(emptyStateId);
            const container = document.getElementById(containerId);
            
            if (visibleCount === 0 && searchTerm.trim() !== '') {
                if (emptyState) emptyState.classList.remove('d-none');
                if (container) container.classList.add('d-none');
            } else {
                if (emptyState) emptyState.classList.add('d-none');
                if (container) container.classList.remove('d-none');
            }
        });
    }

    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            const input = document.getElementById('verifyInput').value;
            if (!input || input.trim() === '') {
                showNotification('Masukkan Kode Validasi (KIN) atau NIK untuk verifikasi', 'warning');
                return;
            }
            
            const result = verifyKIN(input);
            displayVerifyResult(result);
        });
    }

    const refreshBtn = document.getElementById('btn-refresh-page');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshPage);
    }

    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebarMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenuBtn && overlay && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
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
    }
    
    const logoutBtn = document.getElementById('v-pills-logout-tab');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm('Apakah Anda yakin ingin keluar? Sistem akan mengunduh data backup secara otomatis.')) {
                showLoading("Membuat Backup", "Sedang membuat backup data sebelum keluar. Mohon tunggu...");
                setTimeout(() => {
                    sessionStorage.removeItem('simata_session');
                    resetMenuAuth();
                    backupData();
                    setTimeout(() => {
                        hideLoading();
                        location.reload();
                    }, 2000);
                }, 500);
            }
        });
    }

    const searchInput = document.getElementById('searchData');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            renderDataTable();
        });
    }
    
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const cekGandaBtn = document.getElementById('btnCekGanda');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    if (applyFilterBtn) applyFilterBtn.addEventListener('click', applyFilter);
    if (resetFilterBtn) resetFilterBtn.addEventListener('click', resetFilter);
    if (cekGandaBtn) cekGandaBtn.addEventListener('click', showDuplicateDataInFilter);
    if (selectAllCheckbox) selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
        toggleBulkDeleteBtn();
    });
    if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', bulkDeleteData);
    
    const unduhFilteredPdfBtn = document.getElementById('btnUnduhFilteredPdf');
    if (unduhFilteredPdfBtn) unduhFilteredPdfBtn.addEventListener('click', generateFilteredPdf);
    
    const unduhTabelPdfBtn = document.getElementById('btnUnduhTabelPdf');
    if (unduhTabelPdfBtn) unduhTabelPdfBtn.addEventListener('click', generateTabelPdf);

    const printPdfBtn = document.getElementById('printPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportReloadJsBtn = document.getElementById('exportReloadJsBtn');
    const sendWaBtn = document.getElementById('sendWaBtn');
    const backupDataBtn = document.getElementById('backupDataBtn');
    const restoreFileInput = document.getElementById('restoreFileInput');
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    
    if (printPdfBtn) printPdfBtn.addEventListener('click', printData);
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', () => exportData('xlsx'));
    if (exportReloadJsBtn) exportReloadJsBtn.addEventListener('click', () => backupData('reload.js'));
    if (sendWaBtn) sendWaBtn.addEventListener('click', sendDataToWhatsapp);
    if (backupDataBtn) backupDataBtn.addEventListener('click', () => backupData());
    if (restoreFileInput) {
        restoreFileInput.addEventListener('change', function() {
            if (restoreDataBtn) {
                restoreDataBtn.disabled = !this.files.length;
            }
        });
    }
    if (restoreDataBtn) restoreDataBtn.addEventListener('click', restoreData);
    
    const reloadRepoBtn = document.getElementById('btn-reload-repo');
    if (reloadRepoBtn) {
        reloadRepoBtn.addEventListener('click', handleReloadRepo);
    }
    
    const downloadDetailPdfBtn = document.getElementById('btnDownloadDetailPdf');
    if (downloadDetailPdfBtn) {
        downloadDetailPdfBtn.addEventListener('click', () => {
            downloadSinglePdf(currentDetailId);
        });
    }

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            appSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
            
            const appSubtitleInput = document.getElementById('appSubtitle');
            const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
            
            if (appSubtitleInput) appSettings.appSubtitle = appSubtitleInput.value;
            
            if (itemsPerPageSelect) {
                let itemsPerPage = parseInt(itemsPerPageSelect.value);
                if (isNaN(itemsPerPage) || itemsPerPage < 1) {
                    itemsPerPage = 5;
                }
                appSettings.itemsPerPage = itemsPerPage;
            }
            
            saveSettings(); 
            updateAppIdentity(); 
            renderDataTable();
            showNotification('Pengaturan tersimpan! Nama instansi dan jumlah baris per halaman berhasil diperbarui.', 'success');
        });
    }

    const officialForm = document.getElementById('officialForm');
    if (officialForm) {
        officialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const officialName = document.getElementById('officialName').value;
            const officialNip = document.getElementById('officialNip').value;
            const officialPosition = document.getElementById('officialPosition').value;
            
            if (!officialName || !officialNip || !officialPosition) {
                showNotification('Harap isi semua field data pejabat!', 'error');
                return;
            }
            
            appSettings.officialName = officialName;
            appSettings.officialNip = officialNip;
            appSettings.officialPosition = officialPosition;
            
            saveSettings();
            showNotification('Data pejabat penandatangan berhasil disimpan!', 'success');
        });
    }

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
            document.getElementById('currentSensorCode').value = '';
            document.getElementById('newSensorCode').value = '';
            document.getElementById('confirmSensorCode').value = '';
            showNotification('Kode keamanan sensor berhasil diperbarui!', 'success');
        });
    }

    setupFloatingMenu();
}

// =====================================================
// BAGIAN 26: DOM CONTENT LOADED
// =====================================================

/**
 * DOM CONTENT LOADED
 * Event listener utama saat halaman selesai dimuat
 */
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
            
            if (sessionStorage.getItem('menu_auth_input') === 'true') {
                menuAuthStatus.inputData = true;
            }
            if (sessionStorage.getItem('menu_auth_data') === 'true') {
                menuAuthStatus.dataNelayan = true;
            }
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
        showNotification("Terjadi kesalahan sistem saat memuat. Silakan refresh halaman.", 'error');
    }
});

// =====================================================
// BAGIAN 27: WINDOW EXPORTS
// =====================================================

// Ekspos fungsi-fungsi penting ke window untuk akses global
window.loadDataByDesa = loadDataByDesa;
window.loadDataByKecamatan = loadDataByKecamatan;
window.setupInputForDesa = setupInputForDesa;
window.setupInputForKecamatan = setupInputForKecamatan;
window.setInputGlobalMode = setInputGlobalMode;
window.setVerifyExample = setVerifyExample;
window.verifyKINAndShow = verifyKINAndShow;
window.verifyKIN = verifyKIN;
window.resetVerifyForm = resetVerifyForm;
window.viewDetail = viewDetail;
window.safeGenerateIDCard = safeGenerateIDCard;
window.editData = editData;
window.deleteData = deleteData;
window.goToPage = goToPage;
window.toggleBulkDeleteBtn = toggleBulkDeleteBtn;
window.showDuplicateDataInFilter = showDuplicateDataInFilter;
window.generateIDCard = generateIDCard;
