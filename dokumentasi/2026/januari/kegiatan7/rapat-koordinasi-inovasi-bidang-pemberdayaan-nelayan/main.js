// ==================== GLOBAL INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = '0 2px 20px rgba(13, 110, 62, 0.08)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gallery modal functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
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
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
            
            document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() {
                this.remove();
            });
        });
    });

    // Create and add scroll to top button
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

    // Fix footer position if content is short
    function fixFooterPosition() {
        const footer = document.querySelector('.footer');
        const bodyHeight = document.body.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (bodyHeight < windowHeight) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.left = '0';
            footer.style.right = '0';
        } else {
            footer.style.position = 'relative';
        }
    }
    window.addEventListener('load', fixFooterPosition);
    window.addEventListener('resize', fixFooterPosition);
});

// ==================== SHARE MODAL FUNCTIONS ====================
function openShareModal() {
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Koordinasi Inovasi Aplikasi SIMPADAN Tangkap untuk Nelayan Situbondo\n\nKegiatan koordinasi peluncuran aplikasi SIMPADAN Tangkap sebagai platform digital inovatif untuk pemberdayaan nelayan Situbondo, dengan menghadirkan Ketua BIPPD dan Plt. Kepala Dinas Peternakan dan Perikanan.\n\nBaca selengkapnya di:');
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

// ==================== PDF AUTHORIZATION FUNCTIONS ====================
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes

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

let isPasswordVisible = false;
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('securityCodeInput');
    const toggleIcon = document.getElementById('passwordToggleBtn').querySelector('i');
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
                        <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png" 
                             alt="Logo Kabupaten Situbondo" 
                             style="width: 70px; height: 70px; object-fit: contain; display: block; border-radius: 0;">
                    </td>
                    <td style="vertical-align: middle; padding-left: 15px;">
                        <h2 style="margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">PEMERINTAH KABUPATEN SITUBONDO</h2>
                        <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #0d6e3e;">DINAS PETERNAKAN DAN PERIKANAN</h1>
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
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #0d6e3e; line-height: 1.4;">
                KOORDINASI INOVASI APLIKASI SIMPADAN TANGKAP<br>
                UNTUK PEMBERDAYAAN NELAYAN SITUBONDO
            </h1>
        </div>
        
        <!-- Isi Laporan -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0d6e3e;">I. LATAR BELAKANG</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Dalam rangka mengakselerasi transformasi digital sektor perikanan Kabupaten Situbondo, Dinas Peternakan dan Perikanan melaksanakan kegiatan koordinasi inovasi aplikasi SIMPADAN Tangkap. Kegiatan ini merupakan langkah strategis untuk mengembangkan platform digital yang komprehensif guna mendukung pemberdayaan nelayan, optimalisasi data perikanan, dan pengembangan UMKM pengolahan hasil perikanan. Aplikasi SIMPADAN Tangkap diluncurkan di website www.dinasperikanansitubondo.com sebagai wujud komitmen pemerintah daerah dalam menghadapi era digitalisasi.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0d6e3e;">II. TUJUAN KEGIATAN</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Mempresentasikan fitur dan manfaat aplikasi SIMPADAN Tangkap kepada seluruh stakeholder terkait</li>
                <li style="margin-bottom: 10px; text-align: justify;">Mendapatkan masukan dan apresiasi dari Ketua BIPPD Situbondo dan Plt. Kepala Dinas Peternakan dan Perikanan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Membahas rencana integrasi sistem satu data nelayan dalam platform aplikasi</li>
                <li style="margin-bottom: 10px; text-align: justify;">Menyusun strategi pengembangan aplikasi untuk mendukung UMKM pengolahan perikanan</li>
                <li style="margin-bottom: 0; text-align: justify;">Memastikan aspek keamanan, tampilan desain, dan fungsionalitas aplikasi yang optimal</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0d6e3e;">III. WAKTU DAN LOKASI KEGIATAN</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan koordinasi dilaksanakan pada <strong>29 Januari 2026</strong> bertempat di <strong>Kantor Dinas Peternakan dan Perikanan Kabupaten Situbondo</strong>, Jl. PB Sudirman No.77 C, Situbondo. Acara dimulai pukul 09.00 WIB dan berakhir pukul 12.00 WIB.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0d6e3e;">IV. PESERTA KEGIATAN</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Bapak Marlutfi (Ketua BIPPD Situbondo)</li>
                <li style="margin-bottom: 10px; text-align: justify;">Ir. Muh Abdul Rahman, M.Si (Plt. Kepala Dinas Peternakan dan Perikanan Kabupaten Situbondo)</li>
                <li style="margin-bottom: 10px; text-align: justify;">SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan)</li>
                <li style="margin-bottom: 10px; text-align: justify;">Muhammad S (Developer Aplikasi dan Staf Bidang Pemberdayaan Nelayan)</li>
                <li style="margin-bottom: 10px; text-align: justify;">Tim IT Dinas Peternakan dan Perikanan</li>
                <li style="margin-bottom: 0; text-align: justify;">Penyuluh Perikanan Kabupaten Situbondo</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0d6e3e;">V. HASIL DAN PEMBAHASAN</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan koordinasi berlangsung dengan lancar dan menghasilkan beberapa poin penting:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">
                    <strong>Presentasi Aplikasi SIMPADAN Tangkap:</strong> Muhammad S sebagai developer memaparkan secara detail fitur-fitur aplikasi, arsitektur sistem, dan roadmap pengembangan ke depan. Presentasi dilengkapi dengan demo langsung penggunaan aplikasi.
                </li>
                <li style="margin-bottom: 10px; text-align: justify;">
                    <strong>Diskusi Sistem Satu Data Nelayan:</strong> Peserta rapat sepakat tentang pentingnya mengintegrasikan seluruh data nelayan dalam satu platform terpadu untuk meningkatkan efektivitas pelayanan dan pengambilan kebijakan.
                </li>
                <li style="margin-bottom: 10px; text-align: justify;">
                    <strong>Dukungan UMKM Pengolahan Perikanan:</strong> Aplikasi akan dikembangkan untuk mendukung pengembangan UMKM di bidang pengolahan hasil perikanan melalui fitur pemasaran digital, manajemen inventori, dan akses pasar.
                </li>
                <li style="margin-bottom: 10px; text-align: justify;">
                    <strong>Penyempurnaan Aplikasi:</strong> Disepakati perlunya penyempurnaan aplikasi dari segi keamanan data, user interface, dan penambahan fitur-fitur yang sesuai dengan kebutuhan riil nelayan.
                </li>
                <li style="margin-bottom: 0; text-align: justify;">
                    <strong>Apresiasi dan Dukungan Stakeholder:</strong> Bapak Marlutfi memberikan apresiasi tinggi terhadap inisiatif digitalisasi ini dan berkomitmen menyampaikan hasil rapat kepada Bupati Situbondo. Plt. Kepala Dinas memberikan arahan strategis untuk pengembangan aplikasi yang benar-benar memberdayakan nelayan.
                </li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #0d6e3e;">VI. KESIMPULAN DAN REKOMENDASI</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan koordinasi inovasi aplikasi SIMPADAN Tangkap telah berhasil dilaksanakan dengan baik dan menghasilkan beberapa kesimpulan:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Aplikasi SIMPADAN Tangkap merupakan inisiatif strategis dalam mendukung transformasi digital sektor perikanan Situbondo.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Diperlukan integrasi sistem satu data nelayan untuk optimalisasi pelayanan dan pengambilan kebijakan.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Aplikasi perlu dikembangkan untuk mendukung pengembangan UMKM pengolahan hasil perikanan.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Perlu dilakukan penyempurnaan terus menerus terhadap aspek keamanan, desain, dan fungsionalitas aplikasi.</li>
                <li style="margin-bottom: 0; text-align: justify;">Diperlukan dukungan penuh dari seluruh stakeholder untuk keberhasilan implementasi aplikasi.</li>
            </ol>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Direkomendasikan untuk segera membentuk tim implementasi yang terdiri dari perwakilan Dinas Perikanan, BIPPD, dan stakeholder terkait untuk mengawal pengembangan dan penerapan aplikasi SIMPADAN Tangkap secara efektif.
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
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=0d6e3e&bgcolor=ffffff" 
                             alt="QR Code Sumber Laporan" 
                             style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666; clear: both; text-align: right;">Scan untuk mengakses sumber laporan</p>
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
        
        const logoWidth = 18;
        const logoHeight = 18;
        
        // Attempt to load the real logo; if it fails, proceed without it
        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = reject;
                logoImg.src = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png';
            });
            doc.addImage(logoImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        } catch (e) {
            // Logo gagal dimuat – tidak menambahkan logo, hanya teks kop surat
            console.warn('Logo tidak dapat dimuat, melanjutkan tanpa logo.');
        }
        
        // Add header text (always present)
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
        
        // Report title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN KEGIATAN", 105, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setFontSize(14);
        const title1 = "KOORDINASI INOVASI APLIKASI SIMPADAN TANGKAP";
        const title2 = "UNTUK PEMBERDAYAAN NELAYAN SITUBONDO";
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
        
        // Helper function to add sections
        function addText(title, content, isList = false, isNumberedList = false) {
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
                items.forEach((item, index) => {
                    if (item.trim() === '') return;
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
            "Dalam rangka mengakselerasi transformasi digital sektor perikanan Kabupaten Situbondo, Dinas Peternakan dan Perikanan melaksanakan kegiatan koordinasi inovasi aplikasi SIMPADAN Tangkap. Kegiatan ini merupakan langkah strategis untuk mengembangkan platform digital yang komprehensif guna mendukung pemberdayaan nelayan, optimalisasi data perikanan, dan pengembangan UMKM pengolahan hasil perikanan. Aplikasi SIMPADAN Tangkap diluncurkan di website www.dinasperikanansitubondo.com sebagai wujud komitmen pemerintah daerah dalam menghadapi era digitalisasi.");
        
        addText("II. TUJUAN KEGIATAN", 
            "Mempresentasikan fitur dan manfaat aplikasi SIMPADAN Tangkap kepada seluruh stakeholder terkait\n" +
            "Mendapatkan masukan dan apresiasi dari Ketua BIPPD Situbondo dan Plt. Kepala Dinas Peternakan dan Perikanan\n" +
            "Membahas rencana integrasi sistem satu data nelayan dalam platform aplikasi\n" +
            "Menyusun strategi pengembangan aplikasi untuk mendukung UMKM pengolahan perikanan\n" +
            "Memastikan aspek keamanan, tampilan desain, dan fungsionalitas aplikasi yang optimal", true, true);
        
        addText("III. WAKTU DAN LOKASI KEGIATAN", 
            "Kegiatan koordinasi dilaksanakan pada 29 Januari 2026 bertempat di Kantor Dinas Peternakan dan Perikanan Kabupaten Situbondo, Jl. PB Sudirman No.77 C, Situbondo. Acara dimulai pukul 09.00 WIB dan berakhir pukul 12.00 WIB.");
        
        addText("IV. PESERTA KEGIATAN", 
            "Bapak Marlutfi (Ketua BIPPD Situbondo)\n" +
            "Ir. Muh Abdul Rahman, M.Si (Plt. Kepala Dinas Peternakan dan Perikanan Kabupaten Situbondo)\n" +
            "SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan)\n" +
            "Muhammad S (Developer Aplikasi dan Staf Bidang Pemberdayaan Nelayan)\n" +
            "Tim IT Dinas Peternakan dan Perikanan\n" +
            "Penyuluh Perikanan Kabupaten Situbondo", true);
        
        addText("V. HASIL DAN PEMBAHASAN", 
            "Kegiatan koordinasi berlangsung dengan lancar dan menghasilkan beberapa poin penting:");
        
        addText("", 
            "Presentasi Aplikasi SIMPADAN Tangkap: Muhammad S sebagai developer memaparkan secara detail fitur-fitur aplikasi, arsitektur sistem, dan roadmap pengembangan ke depan. Presentasi dilengkapi dengan demo langsung penggunaan aplikasi.\n" +
            "Diskusi Sistem Satu Data Nelayan: Peserta rapat sepakat tentang pentingnya mengintegrasikan seluruh data nelayan dalam satu platform terpadu untuk meningkatkan efektivitas pelayanan dan pengambilan kebijakan.\n" +
            "Dukungan UMKM Pengolahan Perikanan: Aplikasi akan dikembangkan untuk mendukung pengembangan UMKM di bidang pengolahan hasil perikanan melalui fitur pemasaran digital, manajemen inventori, dan akses pasar.\n" +
            "Penyempurnaan Aplikasi: Disepakati perlunya penyempurnaan aplikasi dari segi keamanan data, user interface, dan penambahan fitur-fitur yang sesuai dengan kebutuhan riil nelayan.\n" +
            "Apresiasi dan Dukungan Stakeholder: Bapak Marlutfi memberikan apresiasi tinggi terhadap inisiatif digitalisasi ini dan berkomitmen menyampaikan hasil rapat kepada Bupati Situbondo. Plt. Kepala Dinas memberikan arahan strategis untuk pengembangan aplikasi yang benar-benar memberdayakan nelayan.", true, true);
        
        addText("VI. KESIMPULAN DAN REKOMENDASI", 
            "Kegiatan koordinasi inovasi aplikasi SIMPADAN Tangkap telah berhasil dilaksanakan dengan baik dan menghasilkan beberapa kesimpulan:");
        
        addText("", 
            "Aplikasi SIMPADAN Tangkap merupakan inisiatif strategis dalam mendukung transformasi digital sektor perikanan Situbondo.\n" +
            "Diperlukan integrasi sistem satu data nelayan untuk optimalisasi pelayanan dan pengambilan kebijakan.\n" +
            "Aplikasi perlu dikembangkan untuk mendukung pengembangan UMKM pengolahan hasil perikanan.\n" +
            "Perlu dilakukan penyempurnaan terus menerus terhadap aspek keamanan, desain, dan fungsionalitas aplikasi.\n" +
            "Diperlukan dukungan penuh dari seluruh stakeholder untuk keberhasilan implementasi aplikasi.", true, true);
        
        addText("", 
            "Direkomendasikan untuk segera membentuk tim implementasi yang terdiri dari perwakilan Dinas Perikanan, BIPPD, dan stakeholder terkait untuk mengawal pengembangan dan penerapan aplikasi SIMPADAN Tangkap secara efektif.");
        
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
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=0d6e3e&bgcolor=ffffff`;
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            await new Promise((resolve, reject) => {
                qrImg.onload = resolve;
                qrImg.onerror = reject;
                qrImg.src = qrCodeUrl;
            });
            const qrSize = 15;
            const qrX = 210 - margin - qrSize;
            const qrY = yPos - 9;
            doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
            doc.setFontSize(6);
            doc.text("Scan untuk", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
            doc.text("mengakses", qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
        } catch (e) {
            console.warn('QR code gagal dimuat, melanjutkan tanpa QR.');
        }
        
        const fileName = `Laporan_Koordinasi_SIMPADAN_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
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

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', function() {
    // --- SHARE MODAL ---
    const shareModal = document.getElementById('shareModal');
    const shareActivityBtn = document.getElementById('shareActivityBtn');
    const closeShareModalBtn = document.getElementById('closeShareModalBtn');
    const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    
    if (shareActivityBtn) shareActivityBtn.addEventListener('click', openShareModal);
    if (closeShareModalBtn) closeShareModalBtn.addEventListener('click', closeShareModal);
    if (shareWhatsAppBtn) shareWhatsAppBtn.addEventListener('click', shareToWhatsApp);
    if (copyLinkBtn) copyLinkBtn.addEventListener('click', copyLink);
    
    if (shareModal) {
        shareModal.addEventListener('click', function(e) {
            if (e.target === shareModal) closeShareModal();
        });
    }
    
    // --- PDF AUTHORIZATION MODAL ---
    const pdfAuthModal = document.getElementById('pdfAuthModal');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const closePdfAuthBtn = document.getElementById('closePdfAuthBtn');
    const verifyCodeBtn = document.getElementById('verifySecurityCodeBtn');
    const passwordToggleBtn = document.getElementById('passwordToggleBtn');
    const securityCodeInput = document.getElementById('securityCodeInput');
    
    if (downloadReportBtn) downloadReportBtn.addEventListener('click', openPdfAuthModal);
    if (closePdfAuthBtn) closePdfAuthBtn.addEventListener('click', closePdfAuthModal);
    if (verifyCodeBtn) verifyCodeBtn.addEventListener('click', verifySecurityCode);
    if (passwordToggleBtn) passwordToggleBtn.addEventListener('click', togglePasswordVisibility);
    
    if (securityCodeInput) {
        securityCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') verifySecurityCode();
        });
        securityCodeInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    if (pdfAuthModal) {
        pdfAuthModal.addEventListener('click', function(e) {
            if (e.target === pdfAuthModal) closePdfAuthModal();
        });
    }
    
    // --- PDF PREVIEW MODAL ---
    const pdfPreviewModal = document.getElementById('pdfPreviewModal');
    const closePdfPreviewBtn = document.getElementById('closePdfPreviewBtn');
    const closePdfPreviewFooterBtn = document.getElementById('closePdfPreviewFooterBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    if (closePdfPreviewBtn) closePdfPreviewBtn.addEventListener('click', closePdfPreview);
    if (closePdfPreviewFooterBtn) closePdfPreviewFooterBtn.addEventListener('click', closePdfPreview);
    if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPDF);
    
    if (pdfPreviewModal) {
        pdfPreviewModal.addEventListener('click', function(e) {
            if (e.target === pdfPreviewModal) closePdfPreview();
        });
    }
    
    // --- GLOBAL ESC KEY CLOSE ---
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfPreview();
            closePdfAuthModal();
        }
    });
});

// Debug: tampilkan kode keamanan di console untuk testing
console.log("Kode keamanan hari ini:", generateSecurityCode());
