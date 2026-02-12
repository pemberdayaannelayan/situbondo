'use strict';

// ==================== INITIALIZATION & GLOBAL VARIABLES ====================

// Security system variables
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

// Password visibility state
let isPasswordVisible = false;

// Base64 encoded placeholder logo untuk menghindari CORS issues
const placeholderLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFjSURBVHgB7d2xTQNBEIXhsfAFARIgQzKgTToYAjg3j6JXODcPwdJgOSc/9Vx3/oPnOe6OnnH0l93Tsz+e3/kv3pnvxAAQIIAAIgwggAgDiCCAAAIIIICAIIAAAggggAACCCDAABBAgAEggAADQAABBoAAAggggAACCCCAABBAgAEggAACCAgCCCAgCCCAgCCAAAKCAAIICAIICDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQygT+3b89J+PF+c7T37S/tX53vP3nLq2X09r+f7cua+/V7PW5/ZZ1/L6fXc1/Nx/Bj7O8/HXyIABBBCABnQEcTAACgYgAADQAABBBgAAggwAAQQYAATfLZXKSDj7SwAAAAASUVORK5CYII=';

// ==================== AOS INITIALIZATION ====================
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// ==================== DOM CONTENT MANIPULATION ====================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ==================== NAVBAR SCROLL EFFECT ====================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
});

// ==================== GALLERY MODAL ====================
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const imgAlt = this.querySelector('img').alt;
        
        // Create modal
        const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0">
                    <div class="modal-body p-0 position-relative">
                        <img src="${imgSrc}" alt="${imgAlt}" class="img-fluid w-100 rounded">
                        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal"></button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
        
        // Remove modal when closed
        document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    });
});

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
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

// ==================== SCROLL TO TOP BUTTON ====================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollTopBtn.className = 'btn btn-primary position-fixed bottom-3 end-3 rounded-circle shadow-lg';
scrollTopBtn.style.width = '50px';
scrollTopBtn.style.height = '50px';
scrollTopBtn.style.zIndex = '1000';
scrollTopBtn.style.display = 'none';
scrollTopBtn.style.background = 'linear-gradient(135deg, var(--secondary-blue), var(--primary-blue))';
scrollTopBtn.style.border = 'none';

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
function openShareModal() {
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Kehadiran Dinas Peternakan & Perikanan Situbondo pada Acara Selametan Petik Laut Desa Ketah\n\nPartisipasi aktif Bidang Pemberdayaan Nelayan dalam kegiatan selametan petik laut yang diselenggarakan di Desa Ketah, Kecamatan Suboh, sebagai bentuk pelestarian budaya maritim dan pemberdayaan masyarakat nelayan.\n\nBaca selengkapnya di:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(err => {
        console.error('Gagal menyalin link: ', err);
        alert('Gagal menyalin link. Silakan coba lagi.');
    });
}

// Close share modal when clicking outside
document.getElementById('shareModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeShareModal();
    }
});

// ==================== GLOBAL KEYBOARD SHORTCUT (ESC) ====================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeShareModal();
        closePdfPreview();
        closePdfAuthModal();
    }
});

// ==================== PDF AUTHORIZATION FUNCTIONS ====================

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
            // Lockout period has ended
            lockoutTime = 0;
            currentAttempts = 0;
            return { locked: false, message: '' };
        }
    }
    return { locked: false, message: '' };
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('securityCodeInput');
    const toggleIcon = document.getElementById('passwordToggle').querySelector('i');
    
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
function openPdfAuthModal() {
    // Check if user is locked out
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        alert(lockoutStatus.message);
        return;
    }
    
    // Reset form
    document.getElementById('securityCodeInput').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('errorText').textContent = 'Kode keamanan yang Anda masukkan salah. Silakan coba lagi.';
    document.getElementById('securityCodeInput').classList.remove('is-invalid');
    
    // Update attempts counter
    document.getElementById('attemptsLeft').textContent = maxAttempts - currentAttempts;
    
    // Show modal
    document.getElementById('pdfAuthModal').style.display = 'flex';
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('securityCodeInput').focus();
    }, 300);
}

// Close PDF authorization modal
function closePdfAuthModal() {
    document.getElementById('pdfAuthModal').style.display = 'none';
}

// Verify security code
function verifySecurityCode() {
    // Check if user is locked out
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        document.getElementById('errorText').textContent = lockoutStatus.message;
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }
    
    const userInput = document.getElementById('securityCodeInput').value;
    const correctCode = generateSecurityCode();
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const inputElement = document.getElementById('securityCodeInput');
    
    // Validate input
    if (!userInput || userInput.length !== 8) {
        errorText.textContent = 'Kode keamanan harus terdiri dari 8 digit angka.';
        errorMessage.style.display = 'block';
        inputElement.classList.add('is-invalid');
        inputElement.focus();
        return;
    }
    
    if (userInput === correctCode) {
        // Code is correct - reset attempts
        currentAttempts = 0;
        closePdfAuthModal();
        generatePDFReport();
    } else {
        // Code is incorrect
        currentAttempts++;
        
        // Update attempts counter
        const attemptsLeft = maxAttempts - currentAttempts;
        document.getElementById('attemptsLeft').textContent = attemptsLeft;
        
        if (currentAttempts >= maxAttempts) {
            // Lock user out
            lockoutTime = new Date().getTime() + lockoutDuration;
            errorText.textContent = 'Terlalu banyak percobaan gagal. Akses terkunci selama 5 menit.';
        } else {
            errorText.textContent = `Kode keamanan salah. Percobaan ${currentAttempts} dari ${maxAttempts}.`;
        }
        
        errorMessage.style.display = 'block';
        inputElement.classList.add('is-invalid');
        
        // Shake animation for error
        inputElement.style.animation = 'none';
        setTimeout(() => {
            inputElement.style.animation = 'shake 0.5s';
        }, 10);
        
        // Clear input and focus
        inputElement.value = '';
        inputElement.focus();
    }
}

// Add shake animation (style element)
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ==================== PDF GENERATION FUNCTIONS ====================

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function openPdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'flex';
}

function closePdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'none';
}

// Generate PDF report after successful authorization
function generatePDFReport() {
    showLoading();
    
    // Get current date for report
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Create PDF content with formal format
    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333;">
        <!-- Kop Surat -->
        <div style="margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 80px; vertical-align: middle; padding-top: 5px;">
                        <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png" 
                             alt="Logo Kabupaten Situbondo" 
                             style="width: 70px; height: 70px; object-fit: contain; display: block; border-radius: 0;">
                    </td>
                    <td style="vertical-align: middle; padding-left: 15px;">
                        <h2 style="margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">PEMERINTAH KABUPATEN SITUBONDO</h2>
                        <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">DINAS PETERNAKAN DAN PERIKANAN</h1>
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
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1e3a8a; line-height: 1.4;">
                KEHADIRAN DINAS PETERNAKAN & PERIKANAN SITUBONDO PADA<br>
                ACARA SELAMETAN PETIK LAUT DESA KETAH
            </h1>
        </div>
        
        <!-- Isi Laporan -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                I. LATAR BELAKANG
            </h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Dalam rangka pelestarian budaya maritim dan pemberdayaan masyarakat nelayan, Dinas Perikanan Situbondo yang diwakili oleh Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf, menghadiri acara selametan petik laut di Desa Ketah, Kecamatan Suboh pada tanggal 2 Februari 2026. Kegiatan ini merupakan tradisi tahunan masyarakat pesisir Situbondo yang sarat dengan nilai-nilai kearifan lokal dan spiritualitas maritim.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                II. TUJUAN KEGIATAN
            </h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Melestarikan tradisi dan budaya maritim masyarakat pesisir Situbondo</li>
                <li style="margin-bottom: 10px; text-align: justify;">Memperkuat hubungan antara pemerintah dengan masyarakat nelayan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Menyosialisasikan program pemberdayaan nelayan Dinas Perikanan Situbondo</li>
                <li style="margin-bottom: 10px; text-align: justify;">Memberikan apresiasi terhadap kreativitas nelayan melalui perlombaan hiasan kapal</li>
                <li style="margin-bottom: 0; text-align: justify;">Meningkatkan kohesi sosial antar berbagai elemen masyarakat pesisir</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                III. PESERTA YANG HADIR
            </h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Kepala Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf</li>
                <li style="margin-bottom: 10px; text-align: justify;">Camat Suboh beserta jajarannya</li>
                <li style="margin-bottom: 10px; text-align: justify;">Kasipem Kecamatan Suboh</li>
                <li style="margin-bottom: 10px; text-align: justify;">Danramil dan Kapolsek Kecamatan Suboh</li>
                <li style="margin-bottom: 10px; text-align: justify;">Kasat Polairud Polres Situbondo</li>
                <li style="margin-bottom: 0; text-align: justify;">Masyarakat nelayan dari berbagai desa sekitar</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                IV. RAGAM KEGIATAN
            </h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Prosesi ritual selametan petik laut dengan pembacaan doa dan sesaji</li>
                <li style="margin-bottom: 10px; text-align: justify;">Perlombaan hiasan cantik kapal dan sampan yang diikuti 10 kapal dan 11 sampan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Pertunjukan kesenian ludruk sebagai representasi budaya lokal</li>
                <li style="margin-bottom: 10px; text-align: justify;">Sosialisasi program pemberdayaan nelayan oleh Dinas Perikanan Situbondo</li>
                <li style="margin-bottom: 0; text-align: justify;">Dialog interaktif antara pemerintah dengan masyarakat nelayan</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                V. HASIL KEGIATAN
            </h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan selametan petik laut berlangsung dengan lancar dan meriah, diikuti dengan antusiasme tinggi dari seluruh peserta. Kehadiran langsung jajaran Dinas Perikanan Situbondo telah memperkuat hubungan antara pemerintah dengan masyarakat nelayan. Perlombaan hiasan kapal dan sampan berhasil memacu kreativitas nelayan dengan hadiah uang tunai senilai jutaan rupiah bagi pemenang. Pertunjukan ludruk tidak hanya menjadi hiburan tetapi juga media pelestarian budaya lokal. Melalui kegiatan ini, Dinas Perikanan Situbondo berkomitmen untuk terus mendukung pelestarian budaya maritim sekaligus memperkuat program pemberdayaan nelayan yang berkelanjutan.
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
            <div style="width: 35%;">
                <!-- Kosongkan untuk QR code nanti -->
            </div>
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
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e3a8a&bgcolor=ffffff" 
                             alt="QR Code Sumber Laporan" 
                             style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666; clear: both; text-align: right;">Scan untuk mengakses sumber laporan</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Set content to preview
    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
    
    hideLoading();
    openPdfPreview();
}

// ==================== PDF DOWNLOAD ====================
async function downloadPDF() {
    showLoading();
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set margins
        const margin = 20;
        let yPos = margin;
        
        // Current date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Logo dimensions
        const logoWidth = 18;
        const logoHeight = 18;
        
        // Try to load real logo, fallback to placeholder
        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = () => {
                    // Use placeholder if real logo fails
                    logoImg.src = placeholderLogo;
                    resolve();
                };
                logoImg.src = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png';
            });
            
            // Add logo at the top-left
            doc.addImage(logoImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        } catch (e) {
            console.log('Using placeholder logo');
            const placeholderImg = new Image();
            placeholderImg.src = placeholderLogo;
            await new Promise(resolve => {
                placeholderImg.onload = resolve;
            });
            doc.addImage(placeholderImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        }
        
        // Add header text to the right of the logo
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
        
        // Add horizontal line
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 15;
        
        // Report title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN KEGIATAN", 105, yPos, { align: 'center' });
        yPos += 10;
        
        // Main title
        doc.setFontSize(14);
        const title1 = "KEHADIRAN DINAS PETERNAKAN & PERIKANAN SITUBONDO PADA";
        const title2 = "ACARA SELAMETAN PETIK LAUT DESA KETAH";
        
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
        
        yPos += 10;
        
        // Helper function untuk menambahkan teks dengan pemisahan yang baik
        function addText(title, content, isList = false, isNumberedList = false) {
            // Check for page break
            if (yPos > 270) {
                doc.addPage();
                yPos = margin;
            }
            
            // Add title
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(title, margin, yPos);
            yPos += 8;
            
            // Add content
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
        
        // Add content sections
        addText("I. LATAR BELAKANG", 
            "Dalam rangka pelestarian budaya maritim dan pemberdayaan masyarakat nelayan, Dinas Perikanan Situbondo yang diwakili oleh Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf, menghadiri acara selametan petik laut di Desa Ketah, Kecamatan Suboh pada tanggal 2 Februari 2026. Kegiatan ini merupakan tradisi tahunan masyarakat pesisir Situbondo yang sarat dengan nilai-nilai kearifan lokal dan spiritualitas maritim.");
        
        addText("II. TUJUAN KEGIATAN", 
            "Melestarikan tradisi dan budaya maritim masyarakat pesisir Situbondo\n" +
            "Memperkuat hubungan antara pemerintah dengan masyarakat nelayan\n" +
            "Menyosialisasikan program pemberdayaan nelayan Dinas Perikanan Situbondo\n" +
            "Memberikan apresiasi terhadap kreativitas nelayan melalui perlombaan hiasan kapal\n" +
            "Meningkatkan kohesi sosial antar berbagai elemen masyarakat pesisir", true, true);
        
        addText("III. PESERTA YANG HADIR", 
            "Kepala Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf\n" +
            "Camat Suboh beserta jajarannya\n" +
            "Kasipem Kecamatan Suboh\n" +
            "Danramil dan Kapolsek Kecamatan Suboh\n" +
            "Kasat Polairud Polres Situbondo\n" +
            "Masyarakat nelayan dari berbagai desa sekitar", true);
        
        addText("IV. RAGAM KEGIATAN", 
            "Prosesi ritual selametan petik laut dengan pembacaan doa dan sesaji\n" +
            "Perlombaan hiasan cantik kapal dan sampan yang diikuti 10 kapal dan 11 sampan\n" +
            "Pertunjukan kesenian ludruk sebagai representasi budaya lokal\n" +
            "Sosialisasi program pemberdayaan nelayan oleh Dinas Perikanan Situbondo\n" +
            "Dialog interaktif antara pemerintah dengan masyarakat nelayan", true);
        
        addText("V. HASIL KEGIATAN", 
            "Kegiatan selametan petik laut berlangsung dengan lancar dan meriah, diikuti dengan antusiasme tinggi dari seluruh peserta. Kehadiran langsung jajaran Dinas Perikanan Situbondo telah memperkuat hubungan antara pemerintah dengan masyarakat nelayan. Perlombaan hiasan kapal dan sampan berhasil memacu kreativitas nelayan dengan hadiah uang tunai senilai jutaan rupiah bagi pemenang. Pertunjukan ludruk tidak hanya menjadi hiburan tetapi juga media pelestarian budaya lokal. Melalui kegiatan ini, Dinas Perikanan Situbondo berkomitmen untuk terus mendukung pelestarian budaya maritim sekaligus memperkuat program pemberdayaan nelayan yang berkelanjutan.");
        
        // Add signature section
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
        
        // Draw a line above the footer
        doc.setLineWidth(0.1);
        doc.line(margin, yPos, 210 - margin, yPos);
        
        // Add footer text on the left
        yPos += 5;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo", margin, yPos);
        doc.text(`© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo`, margin, yPos + 4);
        
        // Add QR Code on the right side, below the line
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e3a8a&bgcolor=ffffff`;
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
        
        // Save the PDF
        const fileName = `Laporan_Selametan_Petik_Laut_Desa_Ketah_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
        doc.save(fileName);
        
        hideLoading();
        closePdfPreview();
        
        // Show success message
        setTimeout(() => {
            alert('Laporan PDF berhasil diunduh!');
        }, 500);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('PDF berhasil dibuat! Silakan cek folder download Anda.');
    }
}

// ==================== FOOTER POSITION FIX ====================
function fixFooterPosition() {
    const footer = document.querySelector('.footer');
    const bodyHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    
    if (bodyHeight < windowHeight) {
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
    } else {
        footer.style.position = 'relative';
    }
}

window.addEventListener('load', fixFooterPosition);
window.addEventListener('resize', fixFooterPosition);

// ==================== PASSWORD TOGGLE EVENT ====================
document.getElementById('passwordToggle').addEventListener('click', togglePasswordVisibility);

// ==================== SECURITY CODE INPUT EVENTS ====================
document.getElementById('securityCodeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verifySecurityCode();
    }
});

document.getElementById('securityCodeInput').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// ==================== CLOSE PDF AUTH MODAL WHEN CLICKING OUTSIDE ====================
document.getElementById('pdfAuthModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePdfAuthModal();
    }
});

// ==================== DEBUG: Tampilkan kode keamanan hari ini di console ====================
console.log("Kode keamanan hari ini:", generateSecurityCode());
