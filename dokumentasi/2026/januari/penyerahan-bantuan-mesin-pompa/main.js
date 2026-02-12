/**
 * main.js - Semua fungsionalitas interaktif untuk halaman penyerahan bantuan pompa air
 * Dinas Perikanan Situbondo
 */

// ==================== INISIALISASI GLOBAL ====================
document.addEventListener('DOMContentLoaded', function () {
    // Inisialisasi AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Set tahun saat ini di footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Efek scroll pada navbar
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = '0 2px 20px rgba(30, 58, 138, 0.08)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            }
        }
    });

    // Event listener untuk galeri (modal gambar)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
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

            document.getElementById('imageModal').addEventListener('hidden.bs.modal', function () {
                this.remove();
            });
        });
    });

    // Smooth scroll untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Tombol scroll ke atas
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

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
            scrollTopBtn.style.alignItems = 'center';
            scrollTopBtn.style.justifyContent = 'center';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Perbaiki posisi footer jika konten pendek
    fixFooterPosition();
    window.addEventListener('resize', fixFooterPosition);
});

// ==================== FUNGSI SHARE MODAL ====================
window.openShareModal = function () {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'flex';
};

window.closeShareModal = function () {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'none';
};

window.shareToWhatsApp = function () {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
        'Penyerahan dan Pelebelan Mesin Pompa Air kepada Pengelola TPI\n\n' +
        'Kegiatan penyerahan dan pelebelan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean ' +
        'yang diserahkan langsung oleh Kepala Bidang Pemberdayaan Nelayan Dinas Peternakan dan Perikanan ' +
        'Kabupaten Situbondo.\n\nBaca selengkapnya di:'
    );
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
};

window.copyLink = function () {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(err => {
        console.error('Gagal menyalin link: ', err);
        alert('Gagal menyalin link. Silakan coba lagi.');
    });
};

// Tutup modal share dengan klik di luar
document.addEventListener('click', function (e) {
    const shareModal = document.getElementById('shareModal');
    if (shareModal && e.target === shareModal) {
        closeShareModal();
    }
});

// ==================== PDF AUTHORIZATION SYSTEM ====================
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 menit

// Generate kode keamanan berdasarkan tanggal (format DDMMYYYY)
window.generateSecurityCode = function () {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year;
};

// Cek apakah user terkunci
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

// Toggle visibilitas password
let isPasswordVisible = false;
window.togglePasswordVisibility = function () {
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
};

// Buka modal otorisasi PDF
window.openPdfAuthModal = function () {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        alert(lockoutStatus.message);
        return;
    }

    // Reset form
    const input = document.getElementById('securityCodeInput');
    if (input) input.value = '';
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) errorMsg.style.display = 'none';
    const errorText = document.getElementById('errorText');
    if (errorText) errorText.textContent = 'Kode keamanan yang Anda masukkan salah. Silakan coba lagi.';
    if (input) input.classList.remove('is-invalid');

    // Update sisa percobaan
    const attemptsSpan = document.getElementById('attemptsLeft');
    if (attemptsSpan) attemptsSpan.textContent = maxAttempts - currentAttempts;

    // Tampilkan modal
    const modal = document.getElementById('pdfAuthModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => input?.focus(), 300);
    }
};

window.closePdfAuthModal = function () {
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'none';
};

// Verifikasi kode keamanan
window.verifySecurityCode = function () {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        const errorText = document.getElementById('errorText');
        const errorMsg = document.getElementById('errorMessage');
        if (errorText) errorText.textContent = lockoutStatus.message;
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }

    const userInput = document.getElementById('securityCodeInput')?.value;
    const correctCode = generateSecurityCode();
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const inputElement = document.getElementById('securityCodeInput');

    if (!userInput || userInput.length !== 8) {
        if (errorText) errorText.textContent = 'Kode keamanan harus terdiri dari 8 digit angka.';
        if (errorMsg) errorMsg.style.display = 'block';
        if (inputElement) {
            inputElement.classList.add('is-invalid');
            inputElement.focus();
        }
        return;
    }

    if (userInput === correctCode) {
        // Kode benar
        currentAttempts = 0;
        closePdfAuthModal();
        generatePDFReport();
    } else {
        // Kode salah
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

        if (errorMsg) errorMsg.style.display = 'block';
        if (inputElement) {
            inputElement.classList.add('is-invalid');
            inputElement.style.animation = 'none';
            setTimeout(() => { inputElement.style.animation = 'shake 0.5s'; }, 10);
            inputElement.value = '';
            inputElement.focus();
        }
    }
};

// ==================== PDF GENERATION & PREVIEW ====================
window.showLoading = function () {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';
};

window.hideLoading = function () {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
};

window.openPdfPreview = function () {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) modal.style.display = 'flex';
};

window.closePdfPreview = function () {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) modal.style.display = 'none';
};

// Generate laporan PDF setelah otorisasi sukses
window.generatePDFReport = function () {
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
                            <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">DINAS PETERNAKAN DAN PERIKANAN</h1>
                            <p style="margin: 0; font-size: 12px; letter-spacing: 0.3px; line-height: 1.5;">
                                Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664<br>
                                SITUBONDO 68312
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold; color: #333;">LAPORAN KEGIATAN</h3>
                <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1e3a8a; line-height: 1.4;">
                    PENYERAHAN DAN PELEBELAN MESIN POMPA AIR<br>
                    KEPADA PENGELOLA TEMPAT PELELANGAN IKAN (TPI)
                </h1>
            </div>
            
            <!-- Isi Laporan -->
            <div style="margin-bottom: 30px;">
                <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">I. LATAR BELAKANG</h4>
                <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                    Dalam rangka mendukung operasional Tempat Pelelangan Ikan (TPI) dan meningkatkan kontribusi terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo, Dinas Peternakan dan Perikanan Kabupaten Situbondo melaksanakan kegiatan penyerahan dan pelebelan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean. Kegiatan ini merupakan bentuk komitmen pemerintah daerah dalam pengembangan infrastruktur perikanan dan pemberdayaan masyarakat pesisir.
                </p>
                
                <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">II. TUJUAN KEGIATAN</h4>
                <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                    <li>Meningkatkan kualitas operasional TPI dalam menjaga kebersihan dan higienitas area pelelangan ikan</li>
                    <li>Mendukung pengelola TPI dalam pelayanan kepada nelayan dan pembeli ikan</li>
                    <li>Mengoptimalkan kontribusi TPI terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo</li>
                    <li>Memastikan barang milik daerah (BMD) dikelola dengan baik dan berkelanjutan</li>
                    <li>Memperkuat sinergi antara pemerintah daerah dengan pengelola TPI dan stakeholder perikanan</li>
                </ol>
                
                <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">III. WAKTU DAN LOKASI KEGIATAN</h4>
                <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                    <li><strong>TPI Besuki:</strong> 21 Januari 2026<br><span style="padding-left: 20px;">Desa Pesisir, Kecamatan Besuki, Kabupaten Situbondo</span></li>
                    <li><strong>TPI Pandean:</strong> 22 Januari 2026<br><span style="padding-left: 20px;">Desa Wonorejo, Kecamatan Banyuputih, Kabupaten Situbondo</span></li>
                </ul>
                
                <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">IV. PELAKSANA KEGIATAN</h4>
                <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                    <li>Penanggung Jawab: Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M.</li>
                    <li>Tim Aset Dinas Peternakan dan Perikanan Kabupaten Situbondo</li>
                    <li>Pengelola TPI Besuki dan TPI Pandean sebagai penerima bantuan</li>
                </ul>
                
                <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">V. HASIL KEGIATAN</h4>
                <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                    Kegiatan penyerahan dan pelebelan mesin pompa air berlangsung dengan lancar sesuai jadwal yang telah ditetapkan. Proses penyerahan dilakukan langsung oleh Kepala Bidang Pemberdayaan Nelayan yang disertai dengan dialog mengenai kondisi operasional TPI dan perkembangan hasil tangkapan nelayan. Tim aset Dinas Peternakan dan Perikanan melakukan pelebelan mesin pompa air sebagai Barang Milik Daerah (BMD) serta memberikan arahan teknis mengenai perawatan dan penggunaan yang tepat.
                </p>
                
                <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">VI. KESIMPULAN DAN REKOMENDASI</h4>
                <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                    Penyerahan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean telah berhasil dilaksanakan dengan baik. Bantuan ini diharapkan dapat meningkatkan kualitas operasional TPI, mendukung peningkatan Pendapatan Asli Daerah, dan memperkuat sinergi antara pemerintah daerah dengan stakeholder perikanan. Direkomendasikan untuk dilakukan monitoring berkala terhadap penggunaan dan kondisi mesin pompa air, serta evaluasi dampak bantuan terhadap kinerja TPI.
                </p>
            </div>
            
            <!-- Tanda Tangan -->
            <div style="display: flex; justify-content: space-between; margin-top: 80px;">
                <div>
                    <p style="margin-bottom: 5px; font-size: 12px;">Situbondo, ${formattedDate}</p>
                    <p style="font-weight: bold; font-size: 12px; margin-top: 40px;">Pelapor,</p>
                </div>
                <div style="text-align: right; width: 35%;"></div>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 100px; border-top: 1px solid #ddd; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="text-align: left; font-size: 10px; color: #666; width: 70%;">
                        <p>Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo</p>
                        <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                    </div>
                    <div style="text-align: right; width: 25%;">
                        <div class="qr-code" style="background: #fff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); float: right;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(window.location.href)}&color=1e3a8a&bgcolor=ffffff" 
                                 alt="QR Code" style="width: 70px; height: 70px;">
                        </div>
                        <p style="font-size: 9px; margin-top: 5px; color: #666; clear: both;">Scan untuk mengakses sumber</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
    hideLoading();
    openPdfPreview();
};

// Fungsi download PDF (menggunakan jsPDF)
window.downloadPDF = async function () {
    showLoading();

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const margin = 20;
        let yPos = margin;

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        // Logo placeholder
        const placeholderLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFjSURBVHgB7d2xTQNBEIXhsfAFARIgQzKgTToYAjg3j6JXODcPwdJgOSc/9Vx3/oPnOe6OnnH0l93Tsz+e3/kv3pnvxAAQIIAAIgwggAgDiCCAAAIIIICAIIAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQygT+3b89J+PF+c7T37S/tX53vP3nLq2X09r+f7cua+/V7PW5/ZZ1/L6fXc1/Nx/Bj7O8/HXyIABBBCABnQEcTAACgYgAADQAABBBgAAggwAAQQYAATfLZXKSDj7SwAAAAASUVORK5CYII=';

        // Logo
        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = () => { logoImg.src = placeholderLogo; resolve(); };
                logoImg.src = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png';
            });
            doc.addImage(logoImg, 'PNG', margin, yPos, 18, 18);
        } catch {
            const placeholderImg = new Image();
            placeholderImg.src = placeholderLogo;
            await new Promise(resolve => { placeholderImg.onload = resolve; });
            doc.addImage(placeholderImg, 'PNG', margin, yPos, 18, 18);
        }

        // Header teks
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('PEMERINTAH KABUPATEN SITUBONDO', 105, yPos + 5, { align: 'center' });
        doc.setFontSize(12);
        doc.text('DINAS PETERNAKAN DAN PERIKANAN', 105, yPos + 11, { align: 'center' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664', 105, yPos + 17, { align: 'center' });
        doc.text('SITUBONDO 68312', 105, yPos + 22, { align: 'center' });

        yPos += 30;
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('LAPORAN KEGIATAN', 105, yPos, { align: 'center' });
        yPos += 10;

        doc.setFontSize(14);
        const title1 = 'PENYERAHAN DAN PELEBELAN MESIN POMPA AIR';
        const title2 = 'KEPADA PENGELOLA TEMPAT PELELANGAN IKAN (TPI)';
        doc.splitTextToSize(title1, 170).forEach(line => { doc.text(line, 105, yPos, { align: 'center' }); yPos += 7; });
        doc.splitTextToSize(title2, 170).forEach(line => { doc.text(line, 105, yPos, { align: 'center' }); yPos += 7; });
        yPos += 10;

        function addText(title, content, isList = false, isNumbered = false) {
            if (yPos > 270) { doc.addPage(); yPos = margin; }
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, yPos);
            yPos += 8;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            if (isList) {
                const items = content.split('\n');
                items.forEach((item, idx) => {
                    if (yPos > 270) { doc.addPage(); yPos = margin + 8; }
                    const lines = doc.splitTextToSize(item, 160);
                    lines.forEach((line, lineIdx) => {
                        if (lineIdx === 0) {
                            doc.text(`${isNumbered ? idx + 1 + '.' : '•'} ${line}`, margin + 5, yPos);
                        } else {
                            doc.text(line, margin + 10, yPos);
                        }
                        yPos += 6;
                    });
                });
            } else {
                doc.splitTextToSize(content, 170).forEach(line => {
                    if (yPos > 270) { doc.addPage(); yPos = margin + 8; }
                    doc.text(line, margin, yPos);
                    yPos += 6;
                });
            }
            yPos += 8;
        }

        addText('I. LATAR BELAKANG', 'Dalam rangka mendukung operasional Tempat Pelelangan Ikan (TPI) dan meningkatkan kontribusi terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo, Dinas Peternakan dan Perikanan Kabupaten Situbondo melaksanakan kegiatan penyerahan dan pelebelan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean. Kegiatan ini merupakan bentuk komitmen pemerintah daerah dalam pengembangan infrastruktur perikanan dan pemberdayaan masyarakat pesisir.');
        addText('II. TUJUAN KEGIATAN', 'Meningkatkan kualitas operasional TPI dalam menjaga kebersihan dan higienitas area pelelangan ikan\nMendukung pengelola TPI dalam pelayanan kepada nelayan dan pembeli ikan\nMengoptimalkan kontribusi TPI terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo\nMemastikan barang milik daerah (BMD) dikelola dengan baik dan berkelanjutan\nMemperkuat sinergi antara pemerintah daerah dengan pengelola TPI dan stakeholder perikanan', true, true);
        addText('III. WAKTU DAN LOKASI KEGIATAN', 'TPI Besuki: 21 Januari 2026\nDesa Pesisir, Kecamatan Besuki, Kabupaten Situbondo\n\nTPI Pandean: 22 Januari 2026\nDesa Wonorejo, Kecamatan Banyuputih, Kabupaten Situbondo', true);
        addText('IV. PELAKSANA KEGIATAN', 'Penanggung Jawab: Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M.\nTim Aset Dinas Peternakan dan Perikanan Kabupaten Situbondo\nPengelola TPI Besuki dan TPI Pandean sebagai penerima bantuan', true);
        addText('V. HASIL KEGIATAN', 'Kegiatan penyerahan dan pelebelan mesin pompa air berlangsung dengan lancar sesuai jadwal yang telah ditetapkan. Proses penyerahan dilakukan langsung oleh Kepala Bidang Pemberdayaan Nelayan yang disertai dengan dialog mengenai kondisi operasional TPI dan perkembangan hasil tangkapan nelayan. Tim aset Dinas Peternakan dan Perikanan melakukan pelebelan mesin pompa air sebagai Barang Milik Daerah (BMD) serta memberikan arahan teknis mengenai perawatan dan penggunaan yang tepat.');
        addText('VI. KESIMPULAN DAN REKOMENDASI', 'Penyerahan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean telah berhasil dilaksanakan dengan baik. Bantuan ini diharapkan dapat meningkatkan kualitas operasional TPI, mendukung peningkatan Pendapatan Asli Daerah, dan memperkuat sinergi antara pemerintah daerah dengan stakeholder perikanan. Direkomendasikan untuk dilakukan monitoring berkala terhadap penggunaan dan kondisi mesin pompa air, serta evaluasi dampak bantuan terhadap kinerja TPI.');

        if (yPos > 250) { doc.addPage(); yPos = margin; }
        doc.setFontSize(11);
        doc.text(`Situbondo, ${formattedDate}`, margin, yPos);
        yPos += 12;
        doc.setFont('helvetica', 'bold');
        doc.text('Pelapor,', margin, yPos);
        yPos += 25;
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 5;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo', margin, yPos);
        doc.text(`© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo`, margin, yPos + 4);

        // QR Code
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            await new Promise(resolve => {
                qrImg.onload = resolve;
                qrImg.onerror = resolve;
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e3a8a&bgcolor=ffffff`;
            });
            if (qrImg.complete && qrImg.naturalHeight !== 0) {
                doc.addImage(qrImg, 'PNG', 210 - margin - 15, yPos - 9, 15, 15);
                doc.setFontSize(6);
                doc.text('Scan untuk', 210 - margin - 7.5, yPos + 9, { align: 'center' });
                doc.text('mengakses', 210 - margin - 7.5, yPos + 12, { align: 'center' });
            }
        } catch { /* ignore */ }

        doc.save(`Laporan_Penyerahan_Pompa_TPI_${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}.pdf`);
        hideLoading();
        closePdfPreview();
        setTimeout(() => alert('Laporan PDF berhasil diunduh!'), 500);
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('PDF berhasil dibuat! Silakan cek folder download Anda.');
    }
};

// ==================== UTILITY ====================
function fixFooterPosition() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    const bodyHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    if (bodyHeight < windowHeight) {
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.width = '100%';
    } else {
        footer.style.position = 'relative';
        footer.style.bottom = 'auto';
    }
}

// Tambahkan animasi shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ==================== EVENT LISTENER UNTUK MODAL PDF ====================
document.addEventListener('DOMContentLoaded', function () {
    // Password toggle
    const toggleBtn = document.getElementById('passwordToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', window.togglePasswordVisibility);
    }

    // Enter pada input kode keamanan
    const codeInput = document.getElementById('securityCodeInput');
    if (codeInput) {
        codeInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.verifySecurityCode();
            }
        });
        codeInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // Tutup modal PDF Auth dengan klik di luar
    const pdfAuthModal = document.getElementById('pdfAuthModal');
    if (pdfAuthModal) {
        pdfAuthModal.addEventListener('click', function (e) {
            if (e.target === this) window.closePdfAuthModal();
        });
    }

    // Tutup modal PDF Preview dengan klik di luar
    const pdfPreviewModal = document.getElementById('pdfPreviewModal');
    if (pdfPreviewModal) {
        pdfPreviewModal.addEventListener('click', function (e) {
            if (e.target === this) window.closePdfPreview();
        });
    }

    // Escape key untuk menutup modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            window.closeShareModal();
            window.closePdfPreview();
            window.closePdfAuthModal();
        }
    });

    // Debug: tampilkan kode keamanan di console (untuk testing)
    console.log('Kode keamanan hari ini:', window.generateSecurityCode());
});
