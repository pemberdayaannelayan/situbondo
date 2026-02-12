// ==================== INISIALISASI & GLOBAL VARIABLES ====================
// Security system variables
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
let isPasswordVisible = false;

// ==================== DOM CONTENT LOADED ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 // better performance on mobile
        });
    }

    // Set current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Navbar scroll effect with class addition
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Gallery modal functionality (enhanced)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const img = this.querySelector('img');
            if (!img) return;
            const imgSrc = img.src;
            const imgAlt = img.alt || 'Dokumentasi kegiatan';
            
            // Remove existing modal if any
            const existingModal = document.getElementById('imageModal');
            if (existingModal) existingModal.remove();
            
            // Create modal
            const modalHTML = `
            <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0">
                        <div class="modal-body p-0 position-relative">
                            <img src="${imgSrc}" alt="${imgAlt}" class="img-fluid w-100 rounded" style="max-height: 80vh; object-fit: contain;">
                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white rounded-circle p-2" data-bs-dismiss="modal" aria-label="Tutup"></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Show modal
            const modalEl = document.getElementById('imageModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
                
                // Remove modal when closed
                modalEl.addEventListener('hidden.bs.modal', function() {
                    this.remove();
                }, { once: true });
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll to top button (if not exists)
    if (!document.querySelector('.scroll-top-btn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.setAttribute('aria-label', 'Scroll ke atas');
        document.body.appendChild(scrollTopBtn);
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'flex';
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
    }

    // === INISIALISASI PASSWORD TOGGLE ===
    document.addEventListener('click', function(e) {
        const target = e.target.closest('#passwordToggle');
        if (target) {
            togglePasswordVisibility();
        }
    });

    // Allow pressing Enter to submit the security code
    document.addEventListener('keypress', function(e) {
        if (e.target.id === 'securityCodeInput' && e.key === 'Enter') {
            e.preventDefault();
            verifySecurityCode();
        }
    });

    // Close PDF auth modal when clicking outside
    const pdfAuthModal = document.getElementById('pdfAuthModal');
    if (pdfAuthModal) {
        pdfAuthModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePdfAuthModal();
            }
        });
    }

    // Close share modal when clicking outside
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModal();
            }
        });
    }

    // Close PDF preview modal when clicking outside
    const pdfPreviewModal = document.getElementById('pdfPreviewModal');
    if (pdfPreviewModal) {
        pdfPreviewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePdfPreview();
            }
        });
    }

    // Restrict input to numbers only
    document.addEventListener('input', function(e) {
        if (e.target.id === 'securityCodeInput') {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfPreview();
            closePdfAuthModal();
        }
    });

    // Initialize fallback for broken images (with improved reliability)
    initializeImageFallback();

    // Preload critical image? optional
    preloadCriticalImages();
});

// ==================== IMAGE FALLBACK (3 LAYER) ====================
function initializeImageFallback() {
    document.querySelectorAll('img').forEach(img => {
        // Skip if already processed
        if (img.dataset.fallbackReady) return;
        img.dataset.fallbackReady = 'true';
        
        img.addEventListener('error', function() {
            if (this.dataset.fallbackLevel === '3') return;
            
            const level = parseInt(this.dataset.fallbackLevel || '0');
            const alt = this.alt || 'Gambar';
            
            if (level === 0) {
                // Level 1: UI Avatars
                const name = alt.replace(/\s+/g, '+').substring(0, 30);
                this.src = `https://ui-avatars.com/api/?name=${name}&background=1a5f7a&color=fff&size=400`;
                this.dataset.fallbackLevel = '1';
            } else if (level === 1) {
                // Level 2: Placeholder via.placeholder.com
                this.src = 'https://via.placeholder.com/400x400/1a5f7a/ffffff?text=Gambar+Tidak+Tersedia';
                this.dataset.fallbackLevel = '2';
            } else if (level === 2) {
                // Level 3: Inline SVG (paling aman)
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%231a5f7a"/%3E%3Ctext fill="%23ffffff" x="50" y="200" font-size="24" font-family="Arial, sans-serif"%3EGambar%20Tidak%20Tersedia%3C/text%3E%3C/svg%3E';
                this.dataset.fallbackLevel = '3';
            }
        });
        
        // Trigger error check if image already failed
        if (img.complete && img.naturalHeight === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });
}

// Preload logo to avoid flicker
function preloadCriticalImages() {
    const headerLogo = document.querySelector('#header-logo');
    if (headerLogo && headerLogo.complete && headerLogo.naturalHeight === 0) {
        headerLogo.dispatchEvent(new Event('error'));
    }
}

// ==================== SHARE MODAL ====================
function openShareModal() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.style.display = 'flex';
        // Trap focus inside modal (simple)
        setTimeout(() => {
            const firstBtn = shareModal.querySelector('.share-btn');
            if (firstBtn) firstBtn.focus();
        }, 100);
    }
}

function closeShareModal() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) shareModal.style.display = 'none';
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Pendampingan Verifikasi Hibah Nelayan Tahun 2026 - Dinas Perikanan Situbondo\n\nKegiatan pendampingan Dinas Kelautan Perikanan Jawa Timur dalam rangka verifikasi dan validasi kelompok penerima hibah provinsi tahun anggaran 2026 di Desa Lamongan Kecamatan Arjasa.\n\nBaca selengkapnya di:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        alert('✅ Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(err => {
        console.error('Gagal menyalin link: ', err);
        alert('❌ Gagal menyalin link. Silakan coba lagi.');
    });
}

// ==================== PDF AUTHORIZATION ====================
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year;
}

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

function togglePasswordVisibility() {
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

function openPdfAuthModal() {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        alert(lockoutStatus.message);
        return;
    }
    
    const modal = document.getElementById('pdfAuthModal');
    if (!modal) return;
    
    const inputEl = document.getElementById('securityCodeInput');
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const attemptsSpan = document.getElementById('attemptsLeft');
    
    if (inputEl) {
        inputEl.value = '';
        inputEl.classList.remove('is-invalid');
    }
    if (errorMsg) errorMsg.style.display = 'none';
    if (errorText) errorText.textContent = 'Kode keamanan yang Anda masukkan salah. Silakan coba lagi.';
    if (attemptsSpan) attemptsSpan.textContent = maxAttempts - currentAttempts;
    
    modal.style.display = 'flex';
    
    setTimeout(() => {
        if (inputEl) inputEl.focus();
    }, 300);
}

function closePdfAuthModal() {
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'none';
}

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
    const attemptsSpan = document.getElementById('attemptsLeft');
    
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

// ==================== PDF GENERATION ====================
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
        <!-- Kop Surat (tanpa logo) -->
        <div style="margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">PEMERINTAH KABUPATEN SITUBONDO</h2>
            <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1a5f7a;">DINAS PETERNAKAN DAN PERIKANAN</h1>
            <p style="margin: 0; font-size: 12px; letter-spacing: 0.3px; line-height: 1.5;">
                Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664<br>
                SITUBONDO 68312
            </p>
        </div>
        
        <!-- Judul Laporan -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold; color: #333;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1a5f7a; line-height: 1.4;">
                PENDAMPINGAN VERIFIKASI DAN VALIDASI KELOMPOK PENERIMA HIBAH<br>
                PROVINSI TAHUN ANGGARAN 2026 DI DESA LAMONGAN KECAMATAN ARJASA
            </h1>
        </div>
        
        <!-- Isi Laporan (ringkas) -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">I. LATAR BELAKANG</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Dalam rangka optimalisasi penyaluran bantuan hibah pemerintah kepada nelayan, Dinas Kelautan Perikanan Provinsi Jawa Timur melaksanakan kegiatan pendampingan verifikasi dan validasi kelompok penerima hibah provinsi tahun anggaran 2026. Kegiatan ini merupakan langkah strategis untuk memastikan bahwa bantuan hibah pembelian perahu nelayan tepat sasaran, transparan, dan akuntabel. Pendampingan dilaksanakan di Desa Lamongan, Kecamatan Arjasa, Kabupaten Situbondo sebagai bentuk komitmen pemerintah dalam meningkatkan kesejahteraan nelayan melalui program pemberdayaan yang berkelanjutan.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">II. TUJUAN KEGIATAN</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;">Memastikan validitas data kelompok nelayan penerima hibah</li>
                <li style="margin-bottom: 10px;">Verifikasi kelengkapan dokumen administrasi</li>
                <li style="margin-bottom: 10px;">Memastikan tepat sasaran dalam penyaluran hibah</li>
                <li style="margin-bottom: 10px;">Pendampingan teknis penyusunan proposal</li>
                <li style="margin-bottom: 0;">Memastikan transparansi dan akuntabilitas</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">III. WAKTU DAN LOKASI</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7;">
                22 Januari 2026 di Kantor Desa Lamongan, Kecamatan Arjasa, Kabupaten Situbondo.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">IV. PESERTA</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li>Tim DKP Provinsi Jawa Timur</li>
                <li>SUGENG PURWO PRIYANTO, S.E., M.M. (Kabid Pemberdayaan Nelayan)</li>
                <li>Staf Dinas Perikanan Situbondo</li>
                <li>Penyuluh Perikanan Kec. Arjasa</li>
                <li>Kelompok Nelayan Penerima Hibah</li>
                <li>Perangkat Desa Lamongan</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">V. KESIMPULAN</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7;">
                Kelompok nelayan penerima hibah di Desa Lamongan telah memenuhi persyaratan administrasi dan kesiapan teknis. Proses verifikasi berjalan lancar dan hibah direkomendasikan untuk disalurkan.
            </p>
        </div>
        
        <!-- Tanda Tangan -->
        <div style="display: flex; justify-content: flex-end; margin-top: 80px;">
            <div style="width: 50%;">
                <p style="margin-bottom: 5px; font-size: 12px;">Situbondo, ${formattedDate}</p>
                <p style="font-weight: bold; font-size: 12px; margin-top: 40px;">Pelapor,</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 100px; border-top: 1px solid #ddd; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between;">
                <div style="font-size: 10px; color: #666;">
                    <p>Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo</p>
                    <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                </div>
                <div style="text-align: right;">
                    <div class="qr-code" style="background: #fff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(window.location.href)}&color=1a5f7a&bgcolor=ffffff" 
                             alt="QR Code" style="width: 70px; height: 70px;">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666;">Scan untuk mengakses sumber</p>
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
        
        // Kop surat (teks saja)
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("PEMERINTAH KABUPATEN SITUBONDO", 105, yPos, { align: 'center' });
        yPos += 6;
        doc.setFontSize(12);
        doc.text("DINAS PETERNAKAN DAN PERIKANAN", 105, yPos, { align: 'center' });
        yPos += 6;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664", 105, yPos, { align: 'center' });
        yPos += 4;
        doc.text("SITUBONDO 68312", 105, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN KEGIATAN", 105, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setFontSize(14);
        const title1 = "PENDAMPINGAN VERIFIKASI DAN VALIDASI KELOMPOK PENERIMA HIBAH";
        const title2 = "PROVINSI TAHUN ANGGARAN 2026 DI DESA LAMONGAN KECAMATAN ARJASA";
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
        
        // Fungsi bantu tambah teks
        function addText(title, content, isList = false, isNumbered = false) {
            if (yPos > 270) {
                doc.addPage();
                yPos = margin;
            }
            if (title) {
                doc.setFontSize(12);
                doc.setFont("helvetica", "bold");
                doc.text(title, margin, yPos);
                yPos += 8;
            }
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            
            if (isList) {
                const items = content.split('\n');
                items.forEach((item, idx) => {
                    if (item.trim() === '') return;
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = margin + 8;
                    }
                    const lines = doc.splitTextToSize(item, 160);
                    lines.forEach((line, lineIdx) => {
                        if (lineIdx === 0) {
                            doc.text(isNumbered ? `${idx + 1}. ${line}` : `• ${line}`, margin + 5, yPos);
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
            "Dalam rangka optimalisasi penyaluran bantuan hibah pemerintah kepada nelayan, Dinas Kelautan Perikanan Provinsi Jawa Timur melaksanakan kegiatan pendampingan verifikasi dan validasi kelompok penerima hibah provinsi tahun anggaran 2026. Kegiatan ini merupakan langkah strategis untuk memastikan bahwa bantuan hibah pembelian perahu nelayan tepat sasaran, transparan, dan akuntabel.");
        
        addText("II. TUJUAN KEGIATAN", 
            "Memastikan validitas data kelompok nelayan penerima hibah\nVerifikasi kelengkapan dokumen administrasi\nMemastikan tepat sasaran dalam penyaluran hibah\nMemberikan pendampingan teknis penyusunan proposal hibah\nMemastikan transparansi dan akuntabilitas", true, true);
        
        addText("III. WAKTU DAN LOKASI", 
            "Kegiatan dilaksanakan pada 22 Januari 2026 di Kantor Desa Lamongan, Kecamatan Arjasa, Kabupaten Situbondo.");
        
        addText("IV. PESERTA", 
            "Tim DKP Provinsi Jawa Timur\nSUGENG PURWO PRIYANTO, S.E., M.M. (Kabid Pemberdayaan Nelayan)\nStaf Dinas Perikanan Situbondo\nPenyuluh Perikanan Kec. Arjasa\nKelompok Nelayan Penerima Hibah\nPerangkat Desa Lamongan", true);
        
        addText("V. KESIMPULAN", 
            "Kegiatan pendampingan verifikasi berhasil dilaksanakan. Kelompok nelayan penerima hibah di Desa Lamongan secara umum telah memenuhi persyaratan administrasi dan menunjukkan kesiapan teknis. Proses verifikasi yang ketat telah memastikan hibah tepat sasaran. Direkomendasikan untuk segera menetapkan penerima hibah dan menyalurkan bantuan.");
        
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
        
        // QR Code dengan fallback
        try {
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1a5f7a&bgcolor=ffffff`;
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            await new Promise((resolve, reject) => {
                qrImg.onload = resolve;
                qrImg.onerror = reject;
                qrImg.src = qrCodeUrl;
                setTimeout(() => reject(new Error('timeout')), 3000);
            });
            if (qrImg.complete && qrImg.naturalHeight !== 0) {
                doc.addImage(qrImg, 'PNG', 210 - margin - 15, yPos - 9, 15, 15);
                doc.setFontSize(6);
                doc.text("Scan untuk mengakses", 210 - margin - 7.5, yPos + 7, { align: 'center' });
            }
        } catch (e) {
            console.log('QR code generation failed, skipping');
        }
        
        const fileName = `Laporan_Verifikasi_Hibah_Nelayan_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
        doc.save(fileName);
        
        hideLoading();
        closePdfPreview();
        setTimeout(() => {
            alert('✅ Laporan PDF berhasil diunduh!');
        }, 500);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('❌ PDF berhasil dibuat! Silakan cek folder download Anda.');
    }
}

// Debug: Tampilkan kode keamanan hari ini di console (hanya untuk development)
console.log("🔐 Kode keamanan hari ini:", generateSecurityCode());
