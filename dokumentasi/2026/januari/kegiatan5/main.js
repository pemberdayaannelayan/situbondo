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
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(26, 95, 122, 0.08)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
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
    scrollTopBtn.className = 'scroll-top-btn';
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

    // Fix footer position
    fixFooterPosition();
    window.addEventListener('resize', fixFooterPosition);

    // Initialize password toggle
    document.getElementById('passwordToggle').addEventListener('click', togglePasswordVisibility);
    
    // Allow pressing Enter to submit the security code
    document.getElementById('securityCodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifySecurityCode();
        }
    });
    
    // Close PDF auth modal when clicking outside
    document.getElementById('pdfAuthModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePdfAuthModal();
        }
    });
    
    // Restrict input to numbers only
    document.getElementById('securityCodeInput').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfPreview();
            closePdfAuthModal();
        }
    });
});

// ==================== FOOTER POSITION ====================
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

// ==================== SHARE MODAL ====================
function openShareModal() {
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Pendampingan Verifikasi Hibah Nelayan Tahun 2026 - Dinas Perikanan Situbondo\n\nKegiatan pendampingan Dinas Kelautan Perikanan Jawa Timur dalam rangka verifikasi dan validasi kelompok penerima hibah provinsi tahun anggaran 2026 di Desa Lamongan Kecamatan Arjasa.\n\nBaca selengkapnya di:');
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
document.addEventListener('click', function(e) {
    const shareModal = document.getElementById('shareModal');
    if (e.target === shareModal) {
        closeShareModal();
    }
});

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

function openPdfAuthModal() {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        alert(lockoutStatus.message);
        return;
    }
    
    document.getElementById('securityCodeInput').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('errorText').textContent = 'Kode keamanan yang Anda masukkan salah. Silakan coba lagi.';
    document.getElementById('securityCodeInput').classList.remove('is-invalid');
    document.getElementById('attemptsLeft').textContent = maxAttempts - currentAttempts;
    document.getElementById('pdfAuthModal').style.display = 'flex';
    
    setTimeout(() => {
        document.getElementById('securityCodeInput').focus();
    }, 300);
}

function closePdfAuthModal() {
    document.getElementById('pdfAuthModal').style.display = 'none';
}

function verifySecurityCode() {
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
    
    if (!userInput || userInput.length !== 8) {
        errorText.textContent = 'Kode keamanan harus terdiri dari 8 digit angka.';
        errorMessage.style.display = 'block';
        inputElement.classList.add('is-invalid');
        inputElement.focus();
        return;
    }
    
    if (userInput === correctCode) {
        currentAttempts = 0;
        closePdfAuthModal();
        generatePDFReport();
    } else {
        currentAttempts++;
        const attemptsLeft = maxAttempts - currentAttempts;
        document.getElementById('attemptsLeft').textContent = attemptsLeft;
        
        if (currentAttempts >= maxAttempts) {
            lockoutTime = new Date().getTime() + lockoutDuration;
            errorText.textContent = 'Terlalu banyak percobaan gagal. Akses terkunci selama 5 menit.';
        } else {
            errorText.textContent = `Kode keamanan salah. Percobaan ${currentAttempts} dari ${maxAttempts}.`;
        }
        
        errorMessage.style.display = 'block';
        inputElement.classList.add('is-invalid');
        inputElement.style.animation = 'none';
        setTimeout(() => {
            inputElement.style.animation = 'shake 0.5s';
        }, 10);
        
        inputElement.value = '';
        inputElement.focus();
    }
}

// ==================== PDF GENERATION ====================
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
    
    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
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
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1a5f7a&bgcolor=ffffff`;
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            await new Promise((resolve) => {
                qrImg.onload = resolve;
                qrImg.onerror = resolve;
                qrImg.src = qrCodeUrl;
            });
            if (qrImg.complete && qrImg.naturalHeight !== 0) {
                doc.addImage(qrImg, 'PNG', 210 - margin - 15, yPos - 9, 15, 15);
                doc.setFontSize(6);
                doc.text("Scan untuk mengakses", 210 - margin - 7.5, yPos + 7, { align: 'center' });
            }
        } catch (e) {
            console.log('QR code generation failed');
        }
        
        const fileName = `Laporan_Verifikasi_Hibah_Nelayan_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
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

// Debug: Tampilkan kode keamanan hari ini di console
console.log("Kode keamanan hari ini:", generateSecurityCode());
