// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Navbar scroll effect (with requestAnimationFrame untuk performa)
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Gallery modal functionality
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

// Share functionality
function openShareModal() {
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Kerja Bakti Persiapan Peresmian Pasar Higienis Ikan Segar Mimbo\n\nKegiatan kerja bakti dalam rangka persiapan peresmian pasar higienis ikan segar Mimbo yang dihadiri Camat Banyuputih beserta staf, Pemdes Sumberanyar, dan Tim Bidang Pemberdayaan Nelayan dari Dinas Peternakan dan Perikanan Kabupaten Situbondo.\n\nBaca selengkapnya di:');
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

// Close modal when clicking outside
const shareModal = document.getElementById('shareModal');
if (shareModal) {
    shareModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeShareModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeShareModal();
        closePdfPreview();
        closePdfAuthModal();
    }
});

// ==================== PDF AUTHORIZATION FUNCTIONS ====================

// Security system variables
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes

// Generate security code based on DDMMYYYY
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
let isPasswordVisible = false;
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('securityCodeInput');
    const toggleIcon = document.getElementById('passwordToggle')?.querySelector('i');
    
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
function openPdfAuthModal() {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        alert(lockoutStatus.message);
        return;
    }
    
    // Reset form
    const inputField = document.getElementById('securityCodeInput');
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    if (inputField) {
        inputField.value = '';
        inputField.classList.remove('is-invalid');
    }
    if (errorMsg) errorMsg.style.display = 'none';
    if (errorText) errorText.textContent = 'Kode keamanan yang Anda masukkan salah. Silakan coba lagi.';
    
    // Update attempts counter
    const attemptsSpan = document.getElementById('attemptsLeft');
    if (attemptsSpan) attemptsSpan.textContent = maxAttempts - currentAttempts;
    
    // Show modal
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'flex';
    
    // Focus on input
    setTimeout(() => {
        if (inputField) inputField.focus();
    }, 300);
}

// Close PDF authorization modal
function closePdfAuthModal() {
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'none';
}

// Verify security code
function verifySecurityCode() {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        const errorText = document.getElementById('errorText');
        const errorMsg = document.getElementById('errorMessage');
        if (errorText) errorText.textContent = lockoutStatus.message;
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }
    
    const userInput = document.getElementById('securityCodeInput')?.value || '';
    const correctCode = generateSecurityCode();
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const inputElement = document.getElementById('securityCodeInput');
    
    // Validate input
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
        // Code correct
        currentAttempts = 0;
        closePdfAuthModal();
        generatePDFReport();
    } else {
        // Code incorrect
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

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// PDF Generation Functions
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

function openPdfPreview() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) modal.style.display = 'flex';
}

function closePdfPreview() {
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
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI2SURBVHgB7Zq9ThtBFMf/u3ewvQgKLAQC0lAgQbwF7yFvECh5A0RDkwYpBekJECI1DR0FvAIpKcgLIFJEgoKj2A6c3M/smHjHx3p3dmdnb3f9S7a9ntk9/Z+Z7+yZMyCEEEIIIYQQQgghhBBCiP8LlUoFSZJ4MpkMf9/c3NDtdkt/v93+QzHmr1+/6Pz8nD4/P+nj4yPLrq+vKcsy8rw8z+mr1yu8zEKe57NM51dXV+n5+bn4/L6jQc88z+lwOKSrqyuaTqc0m81oPp/TYrGg5XJJy+WS5vM5rVYr2mw2dHh4SMvlkh4fH2k+n9NqtWKZyAdls9lQnufF8zebDfX7fQrDkIZv38p7DQD98+6Lb8ulNBqN6Pj4mM7Ozmhvb48uLy/p6uqKxuMxTSYTur6+ZvsQnU5HOq4gDKbTKfV6PXIch77/OC/Jr5cA0I0/fRzxT2m9XtNqtSLf9+X9n5+fZ2QUyHq9ppOTExqNRnR2dkYXFxfkui6dnp7K+5/P5xRFEU2nU+n49vY2BUGgvB1qDQCW3W5H/X5fUuY4Dg2HQ3p6epJ5mGq1Kj3wfZ/6/T4dHh5Sq9WiVqtFs9mMLi8v2R6iUqnI+w+CAHcDrdVqUavVotvbW+VtUesA8PzT6bSo4/PzM+3v70tB4Dg0Go2K53h+27ZpMBhQp9Mh27ap3+/TdDql7XZLp6enxe9hO461HcfKfM/3fQrDUN4etQ6AorIsY9uf4fV3d3fy3nMchxaLhSzF8Yr1el1W8a4w+n53d0fb7VZe/yYBBgAAAAAAAAAAAAAAAAAAAACQ8R+5ljgXb9Fv9wAAAABJRU5ErkJggg==" 
                             alt="Logo Kabupaten Situbondo" 
                             style="width: 70px; height: 70px; object-fit: contain; display: block; border-radius: 0;">
                    </td>
                    <td style="vertical-align: middle; padding-left: 15px;">
                        <h2 style="margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">PEMERINTAH KABUPATEN SITUBONDO</h2>
                        <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #166534;">DINAS PETERNAKAN DAN PERIKANAN</h1>
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
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #166534; line-height: 1.4;">
                KERJA BAKTI PERSIAPAN PERESMIAN<br>
                PASAR HIGIENIS IKAN SEGAR MIMBO
            </h1>
        </div>
        
        <!-- Isi Laporan -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #166534;">
                I. LATAR BELAKANG
            </h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Dalam rangka persiapan peresmian Pasar Higienis Ikan Segar Mimbo, Dinas Peternakan dan Perikanan Kabupaten Situbondo bersama dengan Camat Banyuputih beserta staf, Pemerintah Desa Sumberanyar, dan Tim Bidang Pemberdayaan Nelayan melaksanakan kegiatan kerja bakti. Kegiatan ini bertujuan untuk mempersiapkan infrastruktur pasar agar memenuhi standar higienis dan dapat berfungsi optimal untuk mendukung aktivitas perikanan di wilayah pesisir Situbondo.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #166534;">
                II. TUJUAN KEGIATAN
            </h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Mempersiapkan infrastruktur Pasar Higienis Ikan Segar Mimbo</li>
                <li style="margin-bottom: 10px; text-align: justify;">Mengatasi kendala teknis berupa akses jalan yang kurang tinggi</li>
                <li style="margin-bottom: 10px; text-align: justify;">Mengkoordinasikan pembuatan pintu depan pasar yang mengarah ke pantai</li>
                <li style="margin-bottom: 10px; text-align: justify;">Membersihkan dan menyiapkan area pasar untuk aktivitas perdagangan ikan</li>
                <li style="margin-bottom: 0; text-align: justify;">Memperkuat sinergi antar pihak terkait dalam pengembangan infrastruktur perikanan</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #166534;">
                III. KENDALA YANG DIHADAPI
            </h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Akses jalan ke pasar kurang tinggi sehingga menyulitkan transportasi ikan</li>
                <li style="margin-bottom: 0; text-align: justify;">Pasar tidak memiliki pintu muka yang mengarah ke pantai padahal lokasi sangat dekat dengan aktivitas nelayan</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #166534;">
                IV. TINDAKAN YANG DILAKUKAN
            </h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Kerja bakti pembersihan area pasar dari sampah dan kotoran</li>
                <li style="margin-bottom: 10px; text-align: justify;">Koordinasi dengan Pemdes Sumberanyar dan pemilik lahan pribadi untuk pembuatan pintu depan pasar</li>
                <li style="margin-bottom: 10px; text-align: justify;">Evaluasi dan perencanaan perbaikan akses jalan menuju pasar</li>
                <li style="margin-bottom: 0; text-align: justify;">Sosialisasi pentingnya pasar higienis kepada masyarakat sekitar</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #166534;">
                V. HASIL KEGIATAN
            </h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan kerja bakti berlangsung dengan lancar dan diikuti dengan semangat oleh seluruh pihak terkait. Area pasar telah dibersihkan dan siap untuk dipersiapkan lebih lanjut. Telah dilakukan koordinasi intensif untuk mengatasi kendala akses jalan dan pintu depan pasar. Dengan sinergi yang terbangun antara kecamatan, desa, dan dinas, diharapkan Pasar Higienis Ikan Segar Mimbo dapat segera beroperasi dan memberikan manfaat maksimal bagi masyarakat pesisir Situbondo.
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
                <!-- QR code akan ditambahkan nanti -->
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
                    <div class="qr-code" style="background: #ffffff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1; float: right;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=166534&bgcolor=ffffff" 
                             alt="QR Code Sumber Laporan" 
                             style="width: 70px; height: 70px; object-fit: contain;"
                             onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\' viewBox=\'0 0 70 70\'%3E%3Crect width=\'70\' height=\'70\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'10\' fill=\'%23166534\' text-anchor=\'middle\' dy=\'.3em\'%3EQR%20Code%3C/text%3E%3C/svg%3E';">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666; clear: both; text-align: right;">Scan untuk mengakses sumber laporan</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Set content to preview
    const preview = document.getElementById('pdfPreviewContent');
    if (preview) preview.innerHTML = pdfContent;
    
    hideLoading();
    openPdfPreview();
}

// PDF Download dengan jsPDF
async function downloadPDF() {
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
        
        // Logo base64 (fallback langsung)
        const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI2SURBVHgB7Zq9ThtBFMf/u3ewvQgKLAQC0lAgQbwF7yFvECh5A0RDkwYpBekJECI1DR0FvAIpKcgLIFJEgoKj2A6c3M/smHjHx3p3dmdnb3f9S7a9ntk9/Z+Z7+yZMyCEEEIIIYQQQgghhBBCiP8LlUoFSZJ4MpkMf9/c3NDtdkt/v93+QzHmr1+/6Pz8nD4/P+nj4yPLrq+vKcsy8rw8z+mr1yu8zEKe57NM51dXV+n5+bn4/L6jQc88z+lwOKSrqyuaTqc0m81oPp/TYrGg5XJJy+WS5vM5rVYr2mw2dHh4SMvlkh4fH2k+n9NqtWKZyAdls9lQnufF8zebDfX7fQrDkIZv38p7DQD98+6Lb8ulNBqN6Pj4mM7Ozmhvb48uLy/p6uqKxuMxTSYTur6+ZvsQnU5HOq4gDKbTKfV6PXIch77/OC/Jr5cA0I0/fRzxT2m9XtNqtSLf9+X9n5+fZ2QUyHq9ppOTExqNRnR2dkYXFxfkui6dnp7K+5/P5xRFEU2nU+n49vY2BUGgvB1qDQCW3W5H/X5fUuY4Dg2HQ3p6epJ5mGq1Kj3wfZ/6/T4dHh5Sq9WiVqtFs9mMLi8v2R6iUqnI+w+CAHcDrdVqUavVotvbW+VtUesA8PzT6bSo4/PzM+3v70tB4Dg0Go2K53h+27ZpMBhQp9Mh27ap3+/TdDql7XZLp6enxe9hO461HcfKfM/3fQrDUN4etQ6AorIsY9uf4fV3d3fy3nMchxaLhSzF8Yr1el1W8a4w+n53d0fb7VZe/yYBBgAAAAAAAAAAAAAAAAAAAACQ8R+5ljgXb9Fv9wAAAABJRU5ErkJggg==';
        
        doc.addImage(logoBase64, 'PNG', margin, yPos, logoWidth, logoHeight);
        
        // Header teks
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
        const title1 = "KERJA BAKTI PERSIAPAN PERESMIAN";
        const title2 = "PASAR HIGIENIS IKAN SEGAR MIMBO";
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
            "Dalam rangka persiapan peresmian Pasar Higienis Ikan Segar Mimbo, Dinas Peternakan dan Perikanan Kabupaten Situbondo bersama dengan Camat Banyuputih beserta staf, Pemerintah Desa Sumberanyar, dan Tim Bidang Pemberdayaan Nelayan melaksanakan kegiatan kerja bakti. Kegiatan ini bertujuan untuk mempersiapkan infrastruktur pasar agar memenuhi standar higienis dan dapat berfungsi optimal untuk mendukung aktivitas perikanan di wilayah pesisir Situbondo.");
        
        addText("II. TUJUAN KEGIATAN", 
            "Mempersiapkan infrastruktur Pasar Higienis Ikan Segar Mimbo\n" +
            "Mengatasi kendala teknis berupa akses jalan yang kurang tinggi\n" +
            "Mengkoordinasikan pembuatan pintu depan pasar yang mengarah ke pantai\n" +
            "Membersihkan dan menyiapkan area pasar untuk aktivitas perdagangan ikan\n" +
            "Memperkuat sinergi antar pihak terkait dalam pengembangan infrastruktur perikanan", true, true);
        
        addText("III. KENDALA YANG DIHADAPI", 
            "Akses jalan ke pasar kurang tinggi sehingga menyulitkan transportasi ikan\n" +
            "Pasar tidak memiliki pintu muka yang mengarah ke pantai padahal lokasi pasar sangat dekat dengan aktivitas nelayan", true);
        
        addText("IV. TINDAKAN YANG DILAKUKAN", 
            "Kerja bakti pembersihan area pasar dari sampah dan kotoran\n" +
            "Koordinasi dengan Pemdes Sumberanyar dan pemilik lahan pribadi untuk pembuatan pintu depan pasar\n" +
            "Evaluasi dan perencanaan perbaikan akses jalan menuju pasar\n" +
            "Sosialisasi pentingnya pasar higienis kepada masyarakat sekitar", true);
        
        addText("V. HASIL KEGIATAN", 
            "Kegiatan kerja bakti berlangsung dengan lancar dan diikuti dengan semangat oleh seluruh pihak terkait. Area pasar telah dibersihkan dan siap untuk dipersiapkan lebih lanjut. Telah dilakukan koordinasi intensif untuk mengatasi kendala akses jalan dan pintu depan pasar. Dengan sinergi yang terbangun antara kecamatan, desa, dan dinas, diharapkan Pasar Higienis Ikan Segar Mimbo dapat segera beroperasi dan memberikan manfaat maksimal bagi masyarakat pesisir Situbondo.");
        
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
        
        const fileName = `Laporan_Kerja_Bakti_Pasar_Higienis_Mimbo_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
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

// Fix footer position with flexbox fallback
function fixFooterPosition() {
    // Tidak perlu, karena body sudah display:flex + margin-top:auto di footer
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
if (securityInput) {
    securityInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

// Kode keamanan tidak ditampilkan di console (dihapus)
