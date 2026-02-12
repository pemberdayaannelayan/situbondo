// ==================== INISIALISASI & EVENT LISTENER ====================

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Set current year in footer
const yearElement = document.getElementById('currentYear');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(10, 110, 74, 0.08)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        }
    }
});

// Gallery modal functionality
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (!img) return;
        const imgSrc = img.src;
        const imgAlt = img.alt || 'Dokumentasi kegiatan';
        
        // Create modal
        const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0">
                    <div class="modal-body p-0 position-relative">
                        <img src="${imgSrc}" alt="${imgAlt}" class="img-fluid w-100 rounded" loading="lazy">
                        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modalElement = document.getElementById('imageModal');
        if (modalElement && window.bootstrap) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Remove modal when closed
            modalElement.addEventListener('hidden.bs.modal', function() {
                this.remove();
            }, { once: true });
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollTopBtn.className = 'btn btn-primary position-fixed bottom-3 end-3 rounded-circle shadow-lg';
scrollTopBtn.style.width = '50px';
scrollTopBtn.style.height = '50px';
scrollTopBtn.style.zIndex = '1000';
scrollTopBtn.style.display = 'none';
scrollTopBtn.style.background = 'linear-gradient(135deg, var(--secondary-green), var(--primary-green))';
scrollTopBtn.style.border = 'none';
scrollTopBtn.setAttribute('aria-label', 'Kembali ke atas');

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.alignItems = 'center';
        scrollTopBtn.style.justifyContent = 'center';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== SHARE FUNCTIONALITY ====================

window.openShareModal = function() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'flex';
}

window.closeShareModal = function() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'none';
}

window.shareToWhatsApp = function() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Penyaluran Bantuan Sosial Korban Banjir Besuki - Dinas Perikanan Situbondo\n\nKegiatan kemanusiaan Dinas Perikanan Situbondo bersama DINSOS dalam rangka memberikan bantuan sosial kepada warga korban banjir bandang di wilayah Besuki pada tanggal 26 Januari 2026.\n\nBaca selengkapnya di:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

window.copyLink = function() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(err => {
        console.error('Gagal menyalin link: ', err);
        alert('Gagal menyalin link. Silakan coba lagi.');
    });
}

// Close modal when clicking outside
const shareModal = document.getElementById('shareModal');
if (shareModal) {
    shareModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeShareModal();
        }
    });
}

// ==================== PDF AUTHORIZATION FUNCTIONS ====================

// Security system variables
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
let isPasswordVisible = false;

// Generate security code berdasarkan format DDMMYYYY
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year;
}

// Check if user is locked out
function isLockedOut() {
    if (lockoutTime > 0) {
        const currentTime = new Date().getTime();
        const timeRemaining = lockoutTime - currentTime;
        
        if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);
            return {
                locked: true,
                message: `Akses terkunci. Silakan coba lagi dalam ${minutes} menit ${seconds} detik.`
            };
        } else {
            lockoutTime = 0;
            currentAttempts = 0;
            return { locked: false, message: '' };
        }
    }
    return { locked: false, message: '' };
}

// Toggle password visibility
window.togglePasswordVisibility = function() {
    const passwordInput = document.getElementById('securityCodeInput');
    const toggleIcon = document.querySelector('#passwordToggle i');
    
    if (!passwordInput || !toggleIcon) return;
    
    isPasswordVisible = !isPasswordVisible;
    
    if (isPasswordVisible) {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Open PDF authorization modal
window.openPdfAuthModal = function() {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        alert(lockoutStatus.message);
        return;
    }
    
    const input = document.getElementById('securityCodeInput');
    if (input) input.value = '';
    
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) errorMsg.style.display = 'none';
    
    const errorText = document.getElementById('errorText');
    if (errorText) errorText.textContent = 'Kode keamanan yang Anda masukkan salah. Silakan coba lagi.';
    
    const inputEl = document.getElementById('securityCodeInput');
    if (inputEl) inputEl.classList.remove('is-invalid');
    
    const attemptsLeft = document.getElementById('attemptsLeft');
    if (attemptsLeft) attemptsLeft.textContent = maxAttempts - currentAttempts;
    
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'flex';
    
    setTimeout(() => {
        const focusInput = document.getElementById('securityCodeInput');
        if (focusInput) focusInput.focus();
    }, 300);
}

// Close PDF authorization modal
window.closePdfAuthModal = function() {
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'none';
}

// Verify security code
window.verifySecurityCode = function() {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        const errorText = document.getElementById('errorText');
        if (errorText) errorText.textContent = lockoutStatus.message;
        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }
    
    const userInput = document.getElementById('securityCodeInput')?.value || '';
    const correctCode = generateSecurityCode();
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const inputElement = document.getElementById('securityCodeInput');
    
    if (!userInput || userInput.length !== 8) {
        if (errorText) errorText.textContent = 'Kode keamanan harus terdiri dari 8 digit angka.';
        if (errorMessage) errorMessage.style.display = 'block';
        if (inputElement) {
            inputElement.classList.add('is-invalid');
            inputElement.focus();
        }
        return;
    }
    
    if (userInput === correctCode) {
        currentAttempts = 0;
        closePdfAuthModal();
        generatePDFReport();
    } else {
        currentAttempts++;
        
        const attemptsLeft = maxAttempts - currentAttempts;
        const attemptsSpan = document.getElementById('attemptsLeft');
        if (attemptsSpan) attemptsSpan.textContent = attemptsLeft;
        
        if (currentAttempts >= maxAttempts) {
            lockoutTime = new Date().getTime() + lockoutDuration;
            if (errorText) errorText.textContent = 'Terlalu banyak percobaan gagal. Akses terkunci selama 5 menit.';
        } else {
            if (errorText) errorText.textContent = `Kode keamanan salah. Percobaan ${currentAttempts} dari ${maxAttempts}.`;
        }
        
        if (errorMessage) errorMessage.style.display = 'block';
        if (inputElement) {
            inputElement.classList.add('is-invalid');
            inputElement.style.animation = 'none';
            setTimeout(() => {
                inputElement.style.animation = 'shake 0.5s';
            }, 10);
            inputElement.value = '';
            inputElement.focus();
        }
    }
}

// ==================== PDF GENERATION FUNCTIONS ====================

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

window.openPdfPreview = function() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) modal.style.display = 'flex';
}

window.closePdfPreview = function() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) modal.style.display = 'none';
}

// Generate PDF report after successful authorization
function generatePDFReport() {
    showLoading();
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333;">
        <!-- Kop Surat -->
        <div style="margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 80px; vertical-align: middle; padding-top: 5px;">
                        <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/main/LOGO%20KABUPATEN%20SITUBONDO.png" 
                             alt="Logo Kabupaten Situbondo" 
                             style="width: 70px; height: 70px; object-fit: contain; display: block; border-radius: 0;">
                    </td>
                    <td style="vertical-align: middle; padding-left: 15px;">
                        <h2 style="margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">PEMERINTAH KABUPATEN SITUBONDO</h2>
                        <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #0a6e4a;">DINAS PETERNAKAN DAN PERIKANAN</h1>
                        <p style="margin: 0; font-size: 12px; letter-spacing: 0.3px; line-height: 1.5;">
                            Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664<br>
                            SITUBONDO 68312
                        </p>
                    </td>
                </tr>
            </table>
        </div>
        
        <!-- Judul Laporan -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold; color: #333;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #0a6e4a; line-height: 1.4;">
                PENYALURAN BANTUAN SOSIAL KEPADA KORBAN BANJIR<br>
                DI WILAYAH BESUKI KABUPATEN SITUBONDO
            </h1>
            <h3 style="font-size: 13px; font-weight: bold; margin-top: 10px; color: #333;">
                TANGGAL 26 JANUARI 2026
            </h3>
        </div>
        
        <!-- Isi Laporan -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">I. LATAR BELAKANG</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Beberapa waktu lalu, wilayah Besuki Kabupaten Situbondo mengalami bencana banjir bandang yang mengakibatkan kerusakan infrastruktur dan dampak sosial ekonomi terhadap masyarakat. Sebagai bentuk kepedulian dan tanggung jawab sosial, Dinas Perikanan Situbondo melalui keluarga besar pegawai mengadakan pengumpulan donasi internal untuk memberikan bantuan kepada korban banjir. Kegiatan ini dilaksanakan sebagai wujud nyata solidaritas dan gotong royong dalam membantu masyarakat yang sedang mengalami kesulitan.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">II. TUJUAN KEGIATAN</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Meringankan beban masyarakat korban banjir bandang di wilayah Besuki</li>
                <li style="margin-bottom: 10px; text-align: justify;">Memenuhi kebutuhan dasar pangan masyarakat yang kehilangan akses ekonomi akibat bencana</li>
                <li style="margin-bottom: 10px; text-align: justify;">Memberikan dukungan psikologis dan moral melalui kepedulian nyata instansi pemerintah</li>
                <li style="margin-bottom: 10px; text-align: justify;">Memperkuat sinergi dan kerjasama antar instansi dalam penanganan pasca bencana</li>
                <li style="margin-bottom: 0; text-align: justify;">Mewujudkan nilai-nilai kemanusiaan, solidaritas, dan gotong royong dalam kehidupan bermasyarakat</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">III. WAKTU DAN LOKASI KEGIATAN</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan penyaluran bantuan sosial dilaksanakan pada <strong>26 Januari 2026</strong> bertempat di <strong>dapur umum penanggulangan bencana di wilayah Besuki, Kabupaten Situbondo</strong>. Penyaluran dilakukan secara langsung door to door kepada masyarakat terdampak banjir dengan memperhatikan protokol penyaluran bantuan yang baik.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">IV. PESERTA KEGIATAN</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo)</li>
                <li style="margin-bottom: 10px; text-align: justify;">Staf Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo</li>
                <li style="margin-bottom: 10px; text-align: justify;">Tim DINSOS Kabupaten Situbondo</li>
                <li style="margin-bottom: 10px; text-align: justify;">Relawan dari keluarga besar Dinas Perikanan Situbondo</li>
                <li style="margin-bottom: 10px; text-align: justify;">Masyarakat korban banjir di wilayah Besuki</li>
                <li style="margin-bottom: 0; text-align: justify;">Perangkat desa setempat</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">V. JENIS BANTUAN YANG DISALURKAN</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Bantuan sosial yang disalurkan terdiri dari berbagai jenis kebutuhan dasar yang sangat diperlukan oleh masyarakat pasca bencana banjir:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Ikan Tawar Segar:</strong> Sebagai sumber protein hewani berkualitas untuk menjaga asupan gizi keluarga.</li>
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Mie Instan:</strong> Makanan praktis yang mudah diolah dengan peralatan terbatas di kondisi pasca bencana.</li>
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Telur Ayam:</strong> Sumber protein dengan harga terjangkau yang dapat dikonsumsi oleh semua kelompok usia.</li>
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Pakaian Layak Pakai:</strong> Untuk mengganti pakaian yang rusak atau hilang akibat terdampak banjir.</li>
                <li style="margin-bottom: 0; text-align: justify;"><strong>Bahan Pokok Tambahan:</strong> Sesuai dengan ketersediaan dan kebutuhan spesifik penerima bantuan.</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">VI. PROSES PENYALURAN</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Proses penyaluran bantuan dilaksanakan melalui beberapa tahapan yang terstruktur:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Koordinasi dengan DINSOS:</strong> Melakukan koordinasi dengan Badan Penanggulangan Bencana Daerah untuk menentukan lokasi dan penerima bantuan.</li>
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Verifikasi Penerima:</strong> Memastikan bantuan diberikan kepada masyarakat yang benar-benar terdampak dan membutuhkan.</li>
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Packing dan Distribusi:</strong> Mengemas bantuan menjadi paket-paket siap salur dan mendistribusikan ke lokasi.</li>
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Penyerahan Langsung:</strong> Menyerahkan bantuan secara langsung kepada penerima dengan sistem door to door.</li>
                <li style="margin-bottom: 0; text-align: justify;"><strong>Pendokumentasian:</strong> Mendokumentasikan seluruh proses penyaluran sebagai bentuk akuntabilitas.</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">VII. HASIL DAN DAMPAK</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan penyaluran bantuan sosial telah berhasil dilaksanakan dengan baik dan memberikan dampak positif:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Bantuan berhasil disalurkan kepada 150 kepala keluarga korban banjir di wilayah Besuki.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Kebutuhan pangan dasar masyarakat terpenuhi untuk beberapa hari ke depan.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Terjalin sinergi yang baik antara Dinas Perikanan Situbondo dengan DINSOS dalam penanganan bencana.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Masyarakat merasa mendapat dukungan moral dan psikologis dari pemerintah daerah.</li>
                <li style="margin-bottom: 0; text-align: justify;">Nilai-nilai gotong royong dan solidaritas sosial semakin menguat di masyarakat.</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0a6e4a;">VIII. KESIMPULAN DAN REKOMENDASI</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan penyaluran bantuan sosial kepada korban banjir di wilayah Besuki telah dilaksanakan dengan sukses dan memberikan manfaat nyata bagi masyarakat terdampak. Beberapa kesimpulan yang dapat diambil:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Solidaritas internal instansi pemerintah dapat menjadi sumber daya penting dalam penanganan bencana.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Kerjasama antar instansi meningkatkan efektivitas penyaluran bantuan.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Bantuan tepat sasaran memberikan dampak signifikan bagi pemulihan masyarakat pasca bencana.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Pendekatan door to door memastikan bantuan langsung sampai kepada yang membutuhkan.</li>
                <li style="margin-bottom: 0; text-align: justify;">Kegiatan seperti ini perlu dilakukan secara berkelanjutan dengan mekanisme yang lebih terstruktur.</li>
            </ol>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Direkomendasikan untuk membentuk tim khusus penanganan bencana di internal Dinas Perikanan Situbondo, serta mengembangkan sistem pengumpulan dan penyaluran bantuan yang lebih terstruktur untuk kesiapan menghadapi bencana di masa depan.
            </p>
        </div>
        
        <!-- Tanda Tangan -->
        <div style="display: flex; justify-content: space-between; margin-top: 80px; align-items: flex-start;">
            <div style="width: 60%;">
                <div style="margin-bottom: 10px;">
                    <p style="margin-bottom: 5px; font-size: 12px;">Situbondo, ${formattedDate}</p>
                    <p style="font-weight: bold; font-size: 12px; margin-top: 40px;">Pelapor,</p>
                </div>
            </div>
            <div style="width: 35%;"></div>
        </div>
        
        <!-- Footer dengan garis dan QR code -->
        <div style="margin-top: 100px; border-top: 1px solid #ddd; padding-top: 15px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; font-size: 10px; color: #666; width: 70%;">
                    <p style="margin-bottom: 5px;">Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo</p>
                    <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                </div>
                <div style="text-align: right; width: 25%;">
                    <div class="qr-code" style="background: #ffffff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); float: right;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=0a6e4a&bgcolor=ffffff" 
                             alt="QR Code Sumber Laporan" 
                             style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666; clear: both; text-align: right;">Scan untuk mengakses sumber laporan</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    const previewContainer = document.getElementById('pdfPreviewContent');
    if (previewContainer) previewContainer.innerHTML = pdfContent;
    
    hideLoading();
    openPdfPreview();
}

// Download PDF with jsPDF
window.downloadPDF = async function() {
    showLoading();
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const margin = 20;
        let yPos = margin;
        
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const logoWidth = 18;
        const logoHeight = 18;
        
        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = () => {
                    logoImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFjSURBVHgB7d2xTQNBEIXhsfAFARIgQzKgTToYAjg3j6JXODcPwdJgOSc/9Vx3/oPnOe6OnnH0l93Tsz+e3/kv3pnvxAAQIIAAIgwggAgDiCCAAAIIIICAIIAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hutb2vZ';
                    resolve();
                };
                logoImg.src = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/main/LOGO%20KABUPATEN%20SITUBONDO.png';
            });
            
            doc.addImage(logoImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        } catch (e) {
            console.log('Using placeholder logo');
            const placeholderImg = new Image();
            placeholderImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFjSURBVHgB7d2xTQNBEIXhsfAFARIgQzKgTToYAjg3j6JXODcPwdJgOSc/9Vx3/oPnOe6OnnH0l93Tsz+e3/kv3pnvxAAQIIAAIgwggAgDiCCAAAIIIICAIIAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hutb2vZ';
            await new Promise(resolve => {
                placeholderImg.onload = resolve;
            });
            doc.addImage(placeholderImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        }
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("PEMERINTAH KABUPATEN SITUBONDO", 105, yPos + 5, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text("DINAS PETERNAKAN DAN PERIKANAN", 105, yPos + 11, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664", 105, yPos + 17, { align: 'center' });
        doc.text("SITUBONDO 68312", 105, yPos + 22, { align: 'center' });
        
        yPos += 30;
        
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN KEGIATAN", 105, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setFontSize(14);
        const title1 = "PENYALURAN BANTUAN SOSIAL KEPADA KORBAN BANJIR";
        const title2 = "DI WILAYAH BESUKI KABUPATEN SITUBONDO";
        const title3 = "TANGGAL 26 JANUARI 2026";
        
        const titleLines1 = doc.splitTextToSize(title1, 170);
        const titleLines2 = doc.splitTextToSize(title2, 170);
        
        titleLines1.forEach(line => {
            doc.text(line, 105, yPos, { align: 'center' });
            yPos += 7;
        });
        
        titleLines2.forEach(line => {
            doc.text(line, 105, yPos, { align: 'center' });
            yPos += 7;
        });
        
        doc.setFontSize(12);
        doc.text(title3, 105, yPos, { align: 'center' });
        yPos += 10;
        
        function addText(title, content, isList = false, isNumberedList = false) {
            if (yPos > 270) {
                doc.addPage();
                yPos = margin;
            }
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(title, margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            
            if (isList) {
                const items = content.split('\n');
                items.forEach((item, index) => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = margin + 8;
                    }
                    const lines = doc.splitTextToSize(item, 160);
                    lines.forEach((line, lineIndex) => {
                        if (lineIndex === 0) {
                            if (isNumberedList) {
                                doc.text(`${index + 1}. ${line}`, margin + 5, yPos);
                            } else {
                                doc.text(`• ${line}`, margin + 5, yPos);
                            }
                        } else {
                            doc.text(line, margin + 10, yPos);
                        }
                        yPos += 6;
                    });
                });
            } else {
                const lines = doc.splitTextToSize(content, 170);
                lines.forEach(line => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = margin + 8;
                    }
                    doc.text(line, margin, yPos);
                    yPos += 6;
                });
            }
            
            yPos += 8;
        }
        
        addText("I. LATAR BELAKANG", 
            "Beberapa waktu lalu, wilayah Besuki Kabupaten Situbondo mengalami bencana banjir bandang yang mengakibatkan kerusakan infrastruktur dan dampak sosial ekonomi terhadap masyarakat. Sebagai bentuk kepedulian dan tanggung jawab sosial, Dinas Perikanan Situbondo melalui keluarga besar pegawai mengadakan pengumpulan donasi internal untuk memberikan bantuan kepada korban banjir. Kegiatan ini dilaksanakan sebagai wujud nyata solidaritas dan gotong royong dalam membantu masyarakat yang sedang mengalami kesulitan.");
        
        addText("II. TUJUAN KEGIATAN", 
            "Meringankan beban masyarakat korban banjir bandang di wilayah Besuki\nMemenuhi kebutuhan dasar pangan masyarakat yang kehilangan akses ekonomi akibat bencana\nMemberikan dukungan psikologis dan moral melalui kepedulian nyata instansi pemerintah\nMemperkuat sinergi dan kerjasama antar instansi dalam penanganan pasca bencana\nMewujudkan nilai-nilai kemanusiaan, solidaritas, dan gotong royong dalam kehidupan bermasyarakat", true, true);
        
        addText("III. WAKTU DAN LOKASI KEGIATAN", 
            "Kegiatan penyaluran bantuan sosial dilaksanakan pada 26 Januari 2026 bertempat di dapur umum penanggulangan bencana di wilayah Besuki, Kabupaten Situbondo. Penyaluran dilakukan secara langsung door to door kepada masyarakat terdampak banjir dengan memperhatikan protokol penyaluran bantuan yang baik.");
        
        addText("IV. PESERTA KEGIATAN", 
            "SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo)\nStaf Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo\nTim DINSOS Kabupaten Situbondo\nRelawan dari keluarga besar Dinas Perikanan Situbondo\nMasyarakat korban banjir di wilayah Besuki\nPerangkat desa setempat", true);
        
        addText("V. JENIS BANTUAN YANG DISALURKAN", 
            "Bantuan sosial yang disalurkan terdiri dari berbagai jenis kebutuhan dasar yang sangat diperlukan oleh masyarakat pasca bencana banjir:");
        
        addText("", 
            "Ikan Tawar Segar: Sebagai sumber protein hewani berkualitas untuk menjaga asupan gizi keluarga.\nMie Instan: Makanan praktis yang mudah diolah dengan peralatan terbatas di kondisi pasca bencana.\nTelur Ayam: Sumber protein dengan harga terjangkau yang dapat dikonsumsi oleh semua kelompok usia.\nPakaian Layak Pakai: Untuk mengganti pakaian yang rusak atau hilang akibat terdampak banjir.\nBahan Pokok Tambahan: Sesuai dengan ketersediaan dan kebutuhan spesifik penerima bantuan.", true, true);
        
        addText("VI. PROSES PENYALURAN", 
            "Proses penyaluran bantuan dilaksanakan melalui beberapa tahapan yang terstruktur:");
        
        addText("", 
            "Koordinasi dengan DINSOS: Melakukan koordinasi dengan Badan Penanggulangan Bencana Daerah untuk menentukan lokasi dan penerima bantuan.\nVerifikasi Penerima: Memastikan bantuan diberikan kepada masyarakat yang benar-benar terdampak dan membutuhkan.\nPacking dan Distribusi: Mengemas bantuan menjadi paket-paket siap salur dan mendistribusikan ke lokasi.\nPenyerahan Langsung: Menyerahkan bantuan secara langsung kepada penerima dengan sistem door to door.\nPendokumentasian: Mendokumentasikan seluruh proses penyaluran sebagai bentuk akuntabilitas.", true, true);
        
        addText("VII. HASIL DAN DAMPAK", 
            "Kegiatan penyaluran bantuan sosial telah berhasil dilaksanakan dengan baik dan memberikan dampak positif:");
        
        addText("", 
            "Bantuan berhasil disalurkan kepada 150 kepala keluarga korban banjir di wilayah Besuki.\nKebutuhan pangan dasar masyarakat terpenuhi untuk beberapa hari ke depan.\nTerjalin sinergi yang baik antara Dinas Perikanan Situbondo dengan DINSOS dalam penanganan bencana.\nMasyarakat merasa mendapat dukungan moral dan psikologis dari pemerintah daerah.\nNilai-nilai gotong royong dan solidaritas sosial semakin menguat di masyarakat.", true, true);
        
        addText("VIII. KESIMPULAN DAN REKOMENDASI", 
            "Kegiatan penyaluran bantuan sosial kepada korban banjir di wilayah Besuki telah dilaksanakan dengan sukses dan memberikan manfaat nyata bagi masyarakat terdampak. Beberapa kesimpulan yang dapat diambil:");
        
        addText("", 
            "Solidaritas internal instansi pemerintah dapat menjadi sumber daya penting dalam penanganan bencana.\nKerjasama antar instansi meningkatkan efektivitas penyaluran bantuan.\nBantuan tepat sasaran memberikan dampak signifikan bagi pemulihan masyarakat pasca bencana.\nPendekatan door to door memastikan bantuan langsung sampai kepada yang membutuhkan.\nKegiatan seperti ini perlu dilakukan secara berkelanjutan dengan mekanisme yang lebih terstruktur.", true, true);
        
        addText("", 
            "Direkomendasikan untuk membentuk tim khusus penanganan bencana di internal Dinas Perikanan Situbondo, serta mengembangkan sistem pengumpulan dan penyaluran bantuan yang lebih terstruktur untuk kesiapan menghadapi bencana di masa depan.");
        
        if (yPos > 250) {
            doc.addPage();
            yPos = margin;
        }
        
        doc.setFontSize(11);
        doc.text(`Situbondo, ${formattedDate}`, margin, yPos);
        yPos += 12;
        doc.setFont("helvetica", "bold");
        doc.text("Pelapor,", margin, yPos);
        yPos += 25;
        
        doc.setLineWidth(0.1);
        doc.line(margin, yPos, 210 - margin, yPos);
        
        yPos += 5;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo", margin, yPos);
        doc.text(`© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo`, margin, yPos + 4);
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=0a6e4a&bgcolor=ffffff`;
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            
            await new Promise(resolve => {
                qrImg.onload = resolve;
                qrImg.onerror = resolve;
                qrImg.src = qrCodeUrl;
            });
            
            const qrSize = 15;
            const qrX = 210 - margin - qrSize;
            const qrY = yPos - 9;
            
            if (qrImg.complete && qrImg.naturalHeight !== 0) {
                doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
                doc.setFontSize(6);
                doc.text("Scan untuk", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
                doc.text("mengakses", qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
            }
        } catch (e) {
            console.log('QR code generation failed, continuing without it');
        }
        
        const fileName = `Laporan_Bantuan_Sosial_Banjir_Besuki_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
        doc.save(fileName);
        
        hideLoading();
        closePdfPreview();
        
        setTimeout(() => {
            alert('Laporan PDF berhasil diunduh!');
        }, 500);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('PDF berhasil dibuat! Silakan cek folder download Anda.');
    }
}

// ==================== ADDITIONAL FUNCTIONS ====================

// Fix for footer positioning
function fixFooterPosition() {
    const footer = document.querySelector('.footer');
    const bodyHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    
    if (footer) {
        if (bodyHeight < windowHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.width = '100%';
        } else {
            footer.style.position = 'relative';
        }
    }
}

window.addEventListener('load', fixFooterPosition);
window.addEventListener('resize', fixFooterPosition);

// Initialize password toggle
const passwordToggle = document.getElementById('passwordToggle');
if (passwordToggle) {
    passwordToggle.addEventListener('click', togglePasswordVisibility);
}

// Allow pressing Enter to submit the security code
const securityInput = document.getElementById('securityCodeInput');
if (securityInput) {
    securityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifySecurityCode();
        }
    });
}

// Close PDF auth modal when clicking outside
const pdfAuthModal = document.getElementById('pdfAuthModal');
if (pdfAuthModal) {
    pdfAuthModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closePdfAuthModal();
        }
    });
}

// Restrict input to numbers only
const codeInput = document.getElementById('securityCodeInput');
if (codeInput) {
    codeInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeShareModal();
        closePdfPreview();
        closePdfAuthModal();
    }
});

// Hanya tampilkan kode keamanan di console untuk debugging (bisa dihapus pada production)
console.log("Kode keamanan hari ini:", generateSecurityCode());
