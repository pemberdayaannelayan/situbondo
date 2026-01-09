// =====================================================
// LOGIN SYSTEM - SIMPADAN TANGKAP
// File terpisah untuk sistem otentikasi
// =====================================================

let loginConfig = {};

// Fungsi untuk memuat konfigurasi login
async function loadLoginConfig() {
    try {
        const response = await fetch('login-config.json');
        const config = await response.json();
        loginConfig = config.loginConfig;
        updateLoginUI();
    } catch (error) {
        console.error('Gagal memuat konfigurasi login:', error);
        // Konfigurasi default jika file tidak ditemukan
        loginConfig = {
            appName: "SIMPADAN TANGKAP",
            appSubtitle: "SISTEM SATU DATA NELAYAN",
            slogan: "Situbondo Naik Kelas",
            logoUrl: "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/logoku.png",
            contactInfo: {
                phone: "0878-6561-4222",
                email: "info@dinasperikanansitubondo.com",
                copyright: "© 2025 Dinas Perikanan Kabupaten Situbondo"
            }
        };
    }
}

// Fungsi untuk update UI login dengan konfigurasi
function updateLoginUI() {
    if (!loginConfig) return;
    
    // Update judul dan subtitle
    const titleElement = document.querySelector('.simata-title');
    const subtitleElement = document.querySelector('.simata-subtitle');
    const sloganElement = document.querySelector('.simata-slogan');
    
    if (titleElement && loginConfig.appName) {
        titleElement.textContent = loginConfig.appName;
    }
    
    if (subtitleElement && loginConfig.appSubtitle) {
        subtitleElement.textContent = loginConfig.appSubtitle;
    }
    
    if (sloganElement && loginConfig.slogan) {
        sloganElement.textContent = loginConfig.slogan;
    }
    
    // Update logo jika perlu
    const logoElement = document.querySelector('.simata-icon-box img');
    if (logoElement && loginConfig.logoUrl) {
        logoElement.src = loginConfig.logoUrl;
    }
    
    // Update informasi kontak di footer login
    const copyrightElement = document.querySelector('.login-card .text-center small');
    if (copyrightElement && loginConfig.contactInfo?.copyright) {
        copyrightElement.textContent = loginConfig.contactInfo.copyright;
    }
}

// Fungsi untuk generate kode keamanan harian
function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// Fungsi untuk menampilkan tanggal saat ini
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    const dateElement = document.getElementById('currentDateDisplay');
    
    if (dateElement) {
        dateElement.innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    }
}

// Fungsi untuk toggle visibility password
function setupPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('securityCode');
    const passwordIcon = document.getElementById('passwordToggleIcon');
    
    if (!passwordToggle || !passwordInput || !passwordIcon) return;
    
    passwordToggle.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
            this.title = "Sembunyikan kode";
        } else {
            passwordInput.type = 'password';
            passwordIcon.classList.remove('fa-eye-slash');
            passwordIcon.classList.add('fa-eye');
            this.title = "Lihat kode";
        }
    });
}

// Fungsi untuk validasi login
function validateLogin(inputCode) {
    const correctCode = generateSecurityCode();
    return inputCode === correctCode;
}

// Fungsi untuk menangani submit login
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginSpinner = document.getElementById('loginSpinner');
    
    if (!loginForm || !loginButton || !loginSpinner) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputCode = document.getElementById('securityCode').value;
        
        if (!inputCode) {
            showNotification('Masukkan kode keamanan terlebih dahulu!', 'error');
            return;
        }
        
        // Validasi kode
        if (!validateLogin(inputCode)) {
            showNotification('Kode keamanan salah! Periksa kembali atau hubungi administrator.', 'error');
            return;
        }
        
        // Tampilkan loading
        loginButton.disabled = true;
        loginSpinner.classList.remove('d-none');
        loginButton.innerHTML = 'MEMBUKA SISTEM... <span class="spinner-border spinner-border-sm ms-2"></span>';
        
        // Simpan sesi
        setTimeout(() => {
            sessionStorage.setItem('simata_session', 'active');
            sessionStorage.setItem('simata_login_time', new Date().toISOString());
            
            // Sembunyikan modal login
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('appContent').style.display = 'block';
            
            // Reset form login
            loginForm.reset();
            loginButton.disabled = false;
            loginSpinner.classList.add('d-none');
            loginButton.innerHTML = 'BUKA DASHBOARD';
            
            // Tampilkan modal sukses
            if (window.loginSuccessModal && typeof loginSuccessModal.show === 'function') {
                loginSuccessModal.show();
            }
            
            // Panggil callback jika ada
            if (typeof window.onLoginSuccess === 'function') {
                window.onLoginSuccess();
            }
            
        }, 1200);
    });
}

// Fungsi untuk logout
function logout() {
    // Backup data sebelum logout
    if (typeof window.backupData === 'function') {
        window.backupData();
    }
    
    // Hapus sesi
    sessionStorage.removeItem('simata_session');
    sessionStorage.removeItem('simata_login_time');
    
    // Reset UI
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('appContent').style.display = 'none';
    
    // Reset form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    
    // Tampilkan notifikasi
    showNotification('Anda telah berhasil logout. Data telah dibackup.', 'info');
}

// Fungsi untuk cek sesi aktif
function checkActiveSession() {
    const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
    const loginTime = sessionStorage.getItem('simata_login_time');
    
    if (isSessionActive && loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        // Auto logout setelah 8 jam
        if (hoursDiff >= 8) {
            sessionStorage.removeItem('simata_session');
            sessionStorage.removeItem('simata_login_time');
            return false;
        }
        return true;
    }
    return false;
}

// Inisialisasi sistem login
async function initLoginSystem() {
    // Load konfigurasi
    await loadLoginConfig();
    
    // Setup UI
    displayCurrentDate();
    setupPasswordToggle();
    setupLoginForm();
    
    // Cek sesi aktif
    if (checkActiveSession()) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        
        // Panggil callback jika ada
        if (typeof window.onLoginSuccess === 'function') {
            window.onLoginSuccess();
        }
    }
}

// Ekspos fungsi ke global scope
window.logout = logout;
window.generateSecurityCode = generateSecurityCode;
window.checkActiveSession = checkActiveSession;

// Event listener untuk tombol logout
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('v-pills-logout-tab');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin logout? Sistem akan membuat backup data terlebih dahulu.')) {
                logout();
            }
        });
    }
});

// Inisialisasi ketika DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginSystem);
} else {
    initLoginSystem();
}
