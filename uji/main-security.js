// =====================================================
// KODE KEAMANAN APLIKASI SIMPADAN TANGKAP - VERSI 6.1 FINAL REVISI
// BAGIAN: SECURITY & AUTHENTICATION
// REVISI: PEMISAHAN KODE KE FILE TERPISAH
// =====================================================

// --- FUNGSI SHOW/HIDE PASSWORD YANG DISEMPURNAKAN ---
function setupPasswordToggle(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);
    
    if (!passwordInput || !toggleButton) return;
    
    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Ganti icon
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

// --- FUNGSI KEAMANAN MENU BARU ---
function initMenuAuthModal() {
    // Cek apakah modal sudah ada
    if (!document.getElementById('menuAuthModal')) {
        // Buat modal autentikasi menu
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
        
        // Tambahkan modal ke body
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
        // Inisialisasi modal Bootstrap
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        // Setup event listener untuk tombol submit
        document.getElementById('menuAuthSubmit').addEventListener('click', handleMenuAuthSubmit);
        
        // Setup event listener untuk tombol batal
        document.getElementById('menuAuthCancelBtn').addEventListener('click', function() {
            // Arahkan ke menu Dashboard saat tombol batal diklik
            redirectToDashboard();
        });
        
        // PERBAIKAN: Tambahkan event listener untuk ketika modal ditutup (close button atau klik di luar)
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', function() {
                // Arahkan ke menu Dashboard saat modal ditutup
                redirectToDashboard();
            });
        }
        
        // Setup event listener untuk tombol show/hide password
        setupPasswordToggle('menuAuthPassword', 'menuAuthPasswordToggle');
        
        // Setup event listener untuk tekan Enter di input password
        document.getElementById('menuAuthPassword').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMenuAuthSubmit();
            }
        });
    } else {
        // Modal sudah ada, inisialisasi ulang
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        // PERBAIKAN: Pastikan event listener untuk modal hidden sudah ada
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            // Hapus event listener yang mungkin sudah ada
            modalElement.removeEventListener('hidden.bs.modal', redirectToDashboard);
            // Tambahkan kembali event listener
            modalElement.addEventListener('hidden.bs.modal', function() {
                redirectToDashboard();
            });
        }
    }
}

// PERBAIKAN: Fungsi untuk mengarahkan ke dashboard
function redirectToDashboard() {
    const dashboardTab = document.getElementById('v-pills-dashboard-tab');
    if (dashboardTab) {
        dashboardTab.click();
    }
}

function showMenuAuth(menuType, menuName) {
    // PERBAIKAN: Cek apakah kode keamanan untuk menu ini diaktifkan
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        // Jika kode keamanan dinonaktifkan, langsung buka menu
        document.getElementById('v-pills-input-tab').click();
        return;
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        // Jika kode keamanan dinonaktifkan, langsung buka menu
        document.getElementById('v-pills-data-tab').click();
        return;
    }
    
    // Simpan tipe menu yang diminta
    document.getElementById('menuAuthModal').setAttribute('data-menu-type', menuType);
    document.getElementById('menuAuthModal').setAttribute('data-menu-name', menuName);
    
    // Update judul modal
    document.getElementById('menuAuthModalLabel').textContent = `Autentikasi Menu ${menuName}`;
    
    // Reset input password
    document.getElementById('menuAuthPassword').value = '';
    document.getElementById('menuAuthPassword').type = 'password';
    
    // Reset icon toggle
    const toggleIcon = document.querySelector('#menuAuthPasswordToggle i');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
    
    // Tampilkan modal
    menuAuthModal.show();
    
    // Focus ke input password
    setTimeout(() => {
        document.getElementById('menuAuthPassword').focus();
    }, 500);
}

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
        // Autentikasi berhasil
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        
        // Simpan di sessionStorage agar bertahan selama sesi browser
        sessionStorage.setItem(`menu_auth_${menuType}`, 'true');
        
        // Tutup modal
        menuAuthModal.hide();
        
        // Tampilkan notifikasi
        showNotification(`Autentikasi berhasil! Mengakses menu ${menuName}`, 'success');
        
        // Buka menu yang dimaksud
        if (menuType === 'input') {
            // Buka tab Input Data
            document.getElementById('v-pills-input-tab').click();
        } else if (menuType === 'data') {
            // Buka tab Data Nelayan
            document.getElementById('v-pills-data-tab').click();
        }
    } else {
        // Password salah
        showNotification('Password salah! Silakan coba lagi.', 'error');
        document.getElementById('menuAuthPassword').value = '';
        document.getElementById('menuAuthPassword').focus();
    }
}

function checkMenuAuth(menuType) {
    // Cek apakah sudah login ke sistem
    const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
    if (!isSessionActive) {
        return false;
    }
    
    // PERBAIKAN: Cek apakah kode keamanan untuk menu ini diaktifkan
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        return true; // Langsung izinkan akses jika kode keamanan dinonaktifkan
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        return true; // Langsung izinkan akses jika kode keamanan dinonaktifkan
    }
    
    // Cek apakah sudah terautentikasi untuk menu ini
    if (menuType === 'input' && menuAuthStatus.inputData) {
        return true;
    }
    if (menuType === 'data' && menuAuthStatus.dataNelayan) {
        return true;
    }
    
    // Cek sessionStorage
    const sessionAuth = sessionStorage.getItem(`menu_auth_${menuType}`);
    if (sessionAuth === 'true') {
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        return true;
    }
    
    return false;
}

function setupMenuAuthListeners() {
    // Event listener untuk menu Input Data
    const inputDataTab = document.getElementById('v-pills-input-tab');
    if (inputDataTab) {
        inputDataTab.addEventListener('click', function(e) {
            // Cek apakah sudah terautentikasi
            if (!checkMenuAuth('input')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('input', 'Input Data');
            }
        });
    }
    
    // Event listener untuk menu Data Nelayan
    const dataNelayanTab = document.getElementById('v-pills-data-tab');
    if (dataNelayanTab) {
        dataNelayanTab.addEventListener('click', function(e) {
            // Cek apakah sudah terautentikasi
            if (!checkMenuAuth('data')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('data', 'Data Nelayan');
            }
        });
    }
}

function resetMenuAuth() {
    // Reset status autentikasi menu
    menuAuthStatus.inputData = false;
    menuAuthStatus.dataNelayan = false;
    
    // Hapus dari sessionStorage
    sessionStorage.removeItem('menu_auth_input');
    sessionStorage.removeItem('menu_auth_data');
}

// --- FUNGSI BARU: INISIALISASI TOGGLE UNTUK KODE KEAMANAN MENU ---
function initMenuSecurityToggles() {
    // Load toggle state untuk menu Input Data
    const toggleInputData = document.getElementById('toggleSecurityMenuInputData');
    if (toggleInputData) {
        toggleInputData.checked = appSettings.securityMenuInputDataEnabled;
        updateMenuSecurityToggleUI('input', appSettings.securityMenuInputDataEnabled);
    }
    
    // Load toggle state untuk menu Data Nelayan
    const toggleDataNelayan = document.getElementById('toggleSecurityMenuDataNelayan');
    if (toggleDataNelayan) {
        toggleDataNelayan.checked = appSettings.securityMenuDataNelayanEnabled;
        updateMenuSecurityToggleUI('data', appSettings.securityMenuDataNelayanEnabled);
    }
    
    // Setup event listeners untuk toggle
    setupMenuSecurityToggleListeners();
}

// --- FUNGSI BARU: UPDATE UI TOGGLE KEAMANAN MENU ---
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

// --- FUNGSI BARU: SETUP EVENT LISTENERS UNTUK TOGGLE KEAMANAN MENU ---
function setupMenuSecurityToggleListeners() {
    // Toggle untuk menu Input Data
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
    
    // Toggle untuk menu Data Nelayan
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

// --- FUNGSI PERBAIKAN: SETUP SHOW/HIDE PASSWORD UNTUK SEMUA INPUT ---
function setupAllPasswordToggles() {
    // Setup untuk login form
    setupPasswordToggle('securityCode', 'passwordToggle');
    
    // Setup untuk sensor code form (jika ada)
    const sensorForm = document.getElementById('sensorCodeForm');
    if (sensorForm) {
        // Tambahkan toggle button untuk current sensor code
        const currentCodeInput = document.getElementById('currentSensorCode');
        if (currentCodeInput) {
            const parent = currentCodeInput.parentElement;
            if (!parent.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                currentCodeInput.parentNode.insertBefore(wrapper, currentCodeInput);
                wrapper.appendChild(currentCodeInput);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = 'currentSensorCodeToggle';
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle('currentSensorCode', 'currentSensorCodeToggle');
            }
        }
        
        // Tambahkan toggle button untuk new sensor code
        const newCodeInput = document.getElementById('newSensorCode');
        if (newCodeInput) {
            const parent = newCodeInput.parentElement;
            if (!parent.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                newCodeInput.parentNode.insertBefore(wrapper, newCodeInput);
                wrapper.appendChild(newCodeInput);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = 'newSensorCodeToggle';
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle('newSensorCode', 'newSensorCodeToggle');
            }
        }
        
        // Tambahkan toggle button untuk confirm sensor code
        const confirmCodeInput = document.getElementById('confirmSensorCode');
        if (confirmCodeInput) {
            const parent = confirmCodeInput.parentElement;
            if (!parent.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                confirmCodeInput.parentNode.insertBefore(wrapper, confirmCodeInput);
                wrapper.appendChild(confirmCodeInput);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = 'confirmSensorCodeToggle';
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle('confirmSensorCode', 'confirmSensorCodeToggle');
            }
        }
    }
}

// Setup event listeners untuk security
document.addEventListener('DOMContentLoaded', function() {
    // Login Form
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

    // Continue to Dashboard
    const continueBtn = document.getElementById('btnContinueDashboard');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            loginSuccessModal.hide();
            setTimeout(() => {
                welcomeModal.show();
            }, 300);
        });
    }

    // Welcome Modal Reload
    const welcomeReloadBtn = document.getElementById('btnWelcomeReload');
    if (welcomeReloadBtn) {
        welcomeReloadBtn.addEventListener('click', function() {
            welcomeModal.hide();
            handleReloadRepo();
        });
    }

    // Privacy Toggle
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

    // Sensor Code Form
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
});

// Ekspos fungsi security ke window
window.checkMenuAuth = checkMenuAuth;
window.showMenuAuth = showMenuAuth;
window.resetMenuAuth = resetMenuAuth;
