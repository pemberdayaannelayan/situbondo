// =====================================================
// LOGIN.JS - SISTEM AUTENTIKASI SIMATA
// =====================================================

// Fungsi untuk menampilkan notifikasi
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

// Fungsi untuk menampilkan tanggal saat ini
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    document.getElementById('passwordHint').innerHTML = `Kode keamanan berubah setiap hari berdasarkan tanggal.`;
}

// Fungsi untuk generate kode keamanan
function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// Fungsi untuk login sebagai tamu
function loginAsGuest() {
    const loginModal = document.getElementById('loginModal');
    const appContent = document.getElementById('appContent');
    const loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
    const loginSuccessTitle = document.getElementById('loginSuccessTitle');
    
    // Set session sebagai tamu
    sessionStorage.setItem('simata_session', 'active');
    sessionStorage.setItem('simata_user_mode', 'guest');
    
    // Update judul modal
    loginSuccessTitle.textContent = 'Akses Mode Tamu';
    
    // Tampilkan modal sukses
    loginModal.style.display = 'none';
    appContent.style.display = 'block';
    loginSuccessModal.show();
    
    showNotification('Berhasil masuk sebagai tamu. Akses terbatas untuk melihat data.', 'success');
}

// Fungsi untuk login biasa
function loginWithCode() {
    const btn = document.getElementById('loginButton');
    const spinner = document.getElementById('loginSpinner');
    const inputCode = document.getElementById('securityCode').value;
    const correctCode = generateSecurityCode();
    const loginModal = document.getElementById('loginModal');
    const appContent = document.getElementById('appContent');
    const loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
    const loginSuccessTitle = document.getElementById('loginSuccessTitle');
    
    if (inputCode !== correctCode) {
        showNotification('Kode keamanan salah! Periksa kembali atau hubungi administrator.', 'error');
        return;
    }
    
    btn.disabled = true;
    spinner.classList.remove('d-none');
    btn.innerHTML = 'MEMBUKA SISTEM... <span class="spinner-border spinner-border-sm ms-2"></span>';
    
    setTimeout(() => {
        // Set session sebagai admin
        sessionStorage.setItem('simata_session', 'active');
        sessionStorage.removeItem('simata_user_mode'); // Pastikan bukan guest
        
        // Update judul modal
        loginSuccessTitle.textContent = 'Akses Diotorisasi';
        
        loginModal.style.display = 'none';
        appContent.style.display = 'block';
        loginSuccessModal.show();
        btn.disabled = false;
        spinner.classList.add('d-none');
        btn.innerHTML = 'BUKA DASHBOARD';
    }, 1200);
}

// Event listener untuk login form
document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan tanggal
    displayCurrentDate();
    
    // Setup event listeners
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
    
    // Login form submit
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        loginWithCode();
    });
    
    // Tombol login sebagai tamu
    document.getElementById('guestLoginButton').addEventListener('click', function() {
        loginAsGuest();
    });
    
    // Continue to Dashboard
    document.getElementById('btnContinueDashboard').addEventListener('click', function() {
        const loginSuccessModal = bootstrap.Modal.getInstance(document.getElementById('loginSuccessModal'));
        const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        
        loginSuccessModal.hide();
        setTimeout(() => {
            welcomeModal.show();
        }, 300);
    });
    
    // Welcome Modal Reload
    document.getElementById('btnWelcomeReload').addEventListener('click', function() {
        const welcomeModal = bootstrap.Modal.getInstance(document.getElementById('welcomeModal'));
        welcomeModal.hide();
        if (typeof window.handleReloadRepo === 'function') {
            window.handleReloadRepo();
        }
    });
    
    // Cek session aktif
    const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
    if (isSessionActive) {
        const loginModal = document.getElementById('loginModal');
        const appContent = document.getElementById('appContent');
        loginModal.style.display = 'none';
        appContent.style.display = 'block';
        
        // Tampilkan badge mode user
        const isGuest = sessionStorage.getItem('simata_user_mode') === 'guest';
        const userModeBadge = document.getElementById('userModeBadge');
        if (isGuest && userModeBadge) {
            userModeBadge.style.display = 'inline-block';
        }
    } else {
        setTimeout(() => {
            const loginModal = document.getElementById('loginModal');
            loginModal.style.display = 'flex';
        }, 100);
    }
});
