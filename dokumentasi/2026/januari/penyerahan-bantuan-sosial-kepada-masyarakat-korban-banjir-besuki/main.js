// ==================== GLOBAL VARIABLES ====================
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 menit
let isPasswordVisible = false;

// ==================== SHARE MODAL ====================
function openShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'flex';
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'none';
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
        'Penyaluran Bantuan Sosial Korban Banjir Besuki - Dinas Perikanan Situbondo\n\n' +
        'Kegiatan kemanusiaan Dinas Perikanan Situbondo bersama DINSOS dalam rangka memberikan ' +
        'bantuan sosial kepada warga korban banjir bandang di wilayah Besuki pada tanggal 26 Januari 2026.\n\n' +
        'Baca selengkapnya di:'
    );
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
        .then(() => {
            alert('Link berhasil disalin ke clipboard!');
            closeShareModal();
        })
        .catch(() => {
            alert('Gagal menyalin link. Silakan coba lagi.');
        });
}

// ==================== PDF AUTHORIZATION ====================
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year; // format: DDMMYYYY
}

function isLockedOut() {
    if (lockoutTime > 0) {
        const remaining = lockoutTime - new Date().getTime();
        if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            return {
                locked: true,
                message: `Akses terkunci. Coba lagi dalam ${minutes} menit ${seconds} detik.`
            };
        } else {
            lockoutTime = 0;
            currentAttempts = 0;
        }
    }
    return { locked: false, message: '' };
}

function togglePasswordVisibility() {
    const input = document.getElementById('securityCodeInput');
    const icon = document.querySelector('#passwordToggle i');
    if (!input || !icon) return;
    isPasswordVisible = !isPasswordVisible;
    input.type = isPasswordVisible ? 'text' : 'password';
    icon.className = isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
}

function openPdfAuthModal() {
    const lock = isLockedOut();
    if (lock.locked) {
        alert(lock.message);
        return;
    }

    const modal = document.getElementById('pdfAuthModal');
    const input = document.getElementById('securityCodeInput');
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const attemptsSpan = document.getElementById('attemptsLeft');

    if (input) input.value = '';
    if (errorMsg) errorMsg.style.display = 'none';
    if (errorText) errorText.textContent = 'Kode keamanan salah. Silakan coba lagi.';
    if (input) input.classList.remove('is-invalid');
    if (attemptsSpan) attemptsSpan.textContent = maxAttempts - currentAttempts;
    if (modal) modal.style.display = 'flex';
    setTimeout(() => input?.focus(), 300);
}

function closePdfAuthModal() {
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'none';
}

function verifySecurityCode() {
    const lock = isLockedOut();
    if (lock.locked) {
        const errorText = document.getElementById('errorText');
        const errorMsg = document.getElementById('errorMessage');
        if (errorText) errorText.textContent = lock.message;
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }

    const input = document.getElementById('securityCodeInput');
    const userCode = input?.value || '';
    const correctCode = generateSecurityCode();
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const attemptsSpan = document.getElementById('attemptsLeft');

    if (!userCode || userCode.length !== 8) {
        if (errorText) errorText.textContent = 'Kode harus 8 digit angka.';
        if (errorMsg) errorMsg.style.display = 'block';
        input?.classList.add('is-invalid');
        input?.focus();
        return;
    }

    if (userCode === correctCode) {
        currentAttempts = 0;
        closePdfAuthModal();
        generatePDFReport();
    } else {
        currentAttempts++;
        const remaining = maxAttempts - currentAttempts;
        if (attemptsSpan) attemptsSpan.textContent = remaining;

        if (currentAttempts >= maxAttempts) {
            lockoutTime = new Date().getTime() + lockoutDuration;
            if (errorText) errorText.textContent = 'Terlalu banyak gagal. Akses dikunci 5 menit.';
        } else {
            if (errorText) errorText.textContent = `Kode salah. Percobaan ${currentAttempts} dari ${maxAttempts}.`;
        }

        if (errorMsg) errorMsg.style.display = 'block';
        input?.classList.add('is-invalid');
        if (input) {
            input.style.animation = 'none';
            setTimeout(() => input.style.animation = 'shake 0.5s', 10);
            input.value = '';
            input.focus();
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
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333;">
        <!-- Kop Surat -->
        <div style="margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 80px; vertical-align: middle;">
                        <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png" 
                             alt="Logo" style="width: 70px; height: 70px; object-fit: contain;">
                    </td>
                    <td style="vertical-align: middle; padding-left: 15px;">
                        <h2 style="margin:0; font-size:16px; font-weight:bold;">PEMERINTAH KABUPATEN SITUBONDO</h2>
                        <h1 style="margin:5px 0; font-size:18px; font-weight:bold; color:#0a6e4a;">DINAS PETERNAKAN DAN PERIKANAN</h1>
                        <p style="margin:0; font-size:12px;">Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664<br>SITUBONDO 68312</p>
                    </td>
                </tr>
            </table>
        </div>
        
        <!-- Judul Laporan -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="margin-bottom:10px; font-size:14px; font-weight:bold;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size:16px; font-weight:bold; text-decoration:underline; color:#0a6e4a;">
                PENYALURAN BANTUAN SOSIAL KEPADA KORBAN BANJIR<br>DI WILAYAH BESUKI KABUPATEN SITUBONDO
            </h1>
            <h3 style="font-size:13px; font-weight:bold; margin-top:10px;">TANGGAL 26 JANUARI 2026</h3>
        </div>

        <!-- Isi Laporan (ringkas agar tidak terlalu panjang di preview) -->
        <div style="margin-bottom:30px;">
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">I. LATAR BELAKANG</h4>
            <p style="text-align:justify; font-size:12px; line-height:1.7; text-indent:30px;">
                Banjir bandang melanda wilayah Besuki, Situbondo. Dinas Perikanan bersama DINSOS menyalurkan bantuan sosial dari donasi internal pegawai.
            </p>
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">II. TUJUAN</h4>
            <p style="text-align:justify; font-size:12px;">Meringankan beban korban, memenuhi kebutuhan dasar, dan memperkuat sinergi antar instansi.</p>
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">III. WAKTU & LOKASI</h4>
            <p style="text-align:justify; font-size:12px;">26 Januari 2026 di dapur umum Besuki, Situbondo.</p>
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">IV. PESERTA</h4>
            <p style="text-align:justify; font-size:12px;">Kabid Pemberdayaan Nelayan (Sugeng Purwo Priyanto), staf Dinas Perikanan, Tim DINSOS, relawan, masyarakat terdampak.</p>
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">V. JENIS BANTUAN</h4>
            <p style="text-align:justify; font-size:12px;">Ikan tawar segar, mie instan, telur ayam, pakaian layak pakai, bahan pokok tambahan.</p>
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">VI. PROSES PENYALURAN</h4>
            <p style="text-align:justify; font-size:12px;">Koordinasi dengan DINSOS, verifikasi penerima, sortir & packing, distribusi, penyerahan door to door.</p>
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">VII. HASIL & DAMPAK</h4>
            <p style="text-align:justify; font-size:12px;">150 KK terbantu, kebutuhan pangan terpenuhi, sinergi meningkat, dukungan moral dan penguatan gotong royong.</p>
            <h4 style="font-size:13px; font-weight:bold; color:#0a6e4a;">VIII. KESIMPULAN</h4>
            <p style="text-align:justify; font-size:12px;">Kegiatan sukses, perlu dibentuk tim khusus penanganan bencana dan sistem penyaluran lebih terstruktur.</p>
        </div>

        <!-- Tanda Tangan -->
        <div style="display: flex; justify-content: space-between; margin-top: 80px;">
            <div style="width: 60%;">
                <p style="margin-bottom:5px; font-size:12px;">Situbondo, ${formattedDate}</p>
                <p style="font-weight:bold; font-size:12px; margin-top:40px;">Pelapor,</p>
            </div>
            <div style="width:35%;"></div>
        </div>

        <!-- Footer dengan QR -->
        <div style="margin-top: 80px; border-top:1px solid #ddd; padding-top:15px; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:10px; color:#666; width:70%;">
                <p style="margin-bottom:5px;">Laporan dibuat otomatis oleh sistem Dinas Perikanan Situbondo</p>
                <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kab. Situbondo</p>
            </div>
            <div style="width:25%; text-align:right;">
                <div style="background:#fff; padding:5px; border-radius:4px; box-shadow:0 2px 5px rgba(0,0,0,0.1); display:inline-block;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(window.location.href)}&color=0a6e4a" 
                         alt="QR" style="width:70px; height:70px;">
                </div>
                <p style="font-size:8px; margin-top:5px;">Scan untuk sumber laporan</p>
            </div>
        </div>
    </div>
    `;

    const preview = document.getElementById('pdfPreviewContent');
    if (preview) preview.innerHTML = pdfContent;
    hideLoading();
    openPdfPreview();
}

async function downloadPDF() {
    showLoading();

    // Cek apakah jsPDF tersedia
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        hideLoading();
        alert('Library PDF belum dimuat. Silakan refresh halaman.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 20;
    let y = margin;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // --- Header ---
    // Logo (gunakan placeholder sederhana, hindari base64 panjang)
    try {
        const logoUrl = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png';
        const logoImg = new Image();
        logoImg.crossOrigin = 'Anonymous';
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = reject;
            logoImg.src = logoUrl;
        });
        doc.addImage(logoImg, 'PNG', margin, y, 18, 18);
    } catch {
        // Jika logo gagal, lanjut tanpa gambar
        console.warn('Logo tidak dapat dimuat, melanjutkan tanpa logo.');
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PEMERINTAH KABUPATEN SITUBONDO', 105, y + 5, { align: 'center' });
    doc.setFontSize(12);
    doc.text('DINAS PETERNAKAN DAN PERIKANAN', 105, y + 11, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664', 105, y + 17, { align: 'center' });
    doc.text('SITUBONDO 68312', 105, y + 22, { align: 'center' });

    y += 30;
    doc.setLineWidth(0.5);
    doc.line(margin, y, 210 - margin, y);
    y += 15;

    // Judul
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN KEGIATAN', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(14);
    const title1 = 'PENYALURAN BANTUAN SOSIAL KEPADA KORBAN BANJIR';
    const title2 = 'DI WILAYAH BESUKI KABUPATEN SITUBONDO';
    const title3 = 'TANGGAL 26 JANUARI 2026';

    doc.splitTextToSize(title1, 170).forEach(line => {
        doc.text(line, 105, y, { align: 'center' });
        y += 7;
    });
    doc.splitTextToSize(title2, 170).forEach(line => {
        doc.text(line, 105, y, { align: 'center' });
        y += 7;
    });
    doc.setFontSize(12);
    doc.text(title3, 105, y, { align: 'center' });
    y += 10;

    // Fungsi bantu untuk menambah konten
    function addSection(title, content, isList = false, numbered = false) {
        if (y > 270) {
            doc.addPage();
            y = margin;
        }

        if (title) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, y);
            y += 8;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        if (isList) {
            const items = content.split('\n');
            items.forEach((item, idx) => {
                if (y > 270) {
                    doc.addPage();
                    y = margin + 8;
                }
                const lines = doc.splitTextToSize(item, 160);
                lines.forEach((line, lineIdx) => {
                    const prefix = (lineIdx === 0) ? (numbered ? `${idx + 1}. ` : '• ') : '  ';
                    doc.text(prefix + line, margin + 5, y);
                    y += 6;
                });
            });
        } else {
            const lines = doc.splitTextToSize(content, 170);
            lines.forEach(line => {
                if (y > 270) {
                    doc.addPage();
                    y = margin + 8;
                }
                doc.text(line, margin, y);
                y += 6;
            });
        }
        y += 8;
    }

    // Isi laporan
    addSection('I. LATAR BELAKANG', 'Banjir bandang melanda Besuki. Dinas Perikanan bersama DINSOS menyalurkan bantuan dari donasi internal.');
    addSection('II. TUJUAN KEGIATAN',
        'Meringankan beban korban banjir\nMemenuhi kebutuhan pangan\nDukungan psikologis\nSinergi antar instansi\nGotong royong', true, true);
    addSection('III. WAKTU DAN LOKASI', '26 Januari 2026 di dapur umum Besuki, Situbondo. Penyaluran door to door.');
    addSection('IV. PESERTA KEGIATAN',
        'SUGENG PURWO PRIYANTO, S.E., M.M. (Kabid Pemberdayaan Nelayan)\nStaf Dinas Perikanan\nTim DINSOS Situbondo\nRelawan\nMasyarakat korban banjir\nPerangkat desa', true);
    addSection('V. JENIS BANTUAN', 'Ikan Tawar Segar, Mie Instan, Telur Ayam, Pakaian Layak Pakai, Bahan Pokok Tambahan');
    addSection('', 
        'Ikan Tawar Segar: sumber protein\nMie Instan: makanan praktis\nTelur Ayam: protein terjangkau\nPakaian Layak Pakai: ganti pakaian rusak\nBahan Pokok Tambahan', true, true);
    addSection('VI. PROSES PENYALURAN', 
        'Koordinasi dengan DINSOS\nVerifikasi penerima\nPacking dan distribusi\nPenyerahan langsung\nPendokumentasian', true, true);
    addSection('VII. HASIL DAN DAMPAK',
        '150 KK menerima bantuan\nKebutuhan pangan terpenuhi\nSinergi meningkat\nDukungan moral\nGotong royong menguat', true, true);
    addSection('VIII. KESIMPULAN DAN REKOMENDASI',
        'Solidaritas internal penting\nKerjasama antar instansi efektif\nBantuan tepat sasaran\nDoor to door efektif\nPerlu tim khusus dan sistem terstruktur', true, true);
    addSection('', 'Direkomendasikan pembentukan tim khusus penanganan bencana dan pengembangan sistem penyaluran yang lebih terstruktur.');

    // Tanda tangan
    if (y > 250) {
        doc.addPage();
        y = margin;
    }
    doc.setFontSize(11);
    doc.text(`Situbondo, ${formattedDate}`, margin, y);
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Pelapor,', margin, y);
    y += 25;

    // Garis footer
    doc.setLineWidth(0.1);
    doc.line(margin, y, 210 - margin, y);
    y += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Laporan ini dibuat otomatis oleh sistem Dinas Perikanan Situbondo', margin, y);
    doc.text(`© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo`, margin, y + 4);

    // QR Code
    try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(window.location.href)}&color=0a6e4a`;
        const qrImg = new Image();
        qrImg.crossOrigin = 'Anonymous';
        await new Promise((resolve, reject) => {
            qrImg.onload = resolve;
            qrImg.onerror = reject;
            qrImg.src = qrUrl;
        });
        const qrSize = 15;
        const qrX = 210 - margin - qrSize;
        const qrY = y - 9;
        doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
        doc.setFontSize(6);
        doc.text('Scan untuk', qrX + qrSize / 2, qrY + qrSize + 3, { align: 'center' });
        doc.text('mengakses', qrX + qrSize / 2, qrY + qrSize + 6, { align: 'center' });
    } catch {
        console.warn('QR Code gagal dimuat, dilewati.');
    }

    // Simpan PDF
    const fileName = `Laporan_Bantuan_Sosial_Banjir_Besuki_${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}.pdf`;
    doc.save(fileName);

    hideLoading();
    closePdfPreview();
    setTimeout(() => alert('Laporan PDF berhasil diunduh!'), 200);
}

// ==================== UI & UTILITY ====================
function fixFooterPosition() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    const bodyHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    footer.style.position = bodyHeight < windowHeight ? 'fixed' : 'relative';
    footer.style.bottom = bodyHeight < windowHeight ? '0' : 'auto';
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }

    // Tahun di footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 50
                ? '0 5px 20px rgba(0,0,0,0.1)'
                : '0 2px 20px rgba(10,110,74,0.08)';
            navbar.style.backgroundColor = 'rgba(255,255,255,0.98)';
        }
    });

    // Gallery modal (Bootstrap)
    if (typeof bootstrap !== 'undefined') {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function () {
                const img = this.querySelector('img');
                if (!img) return;
                const modalHtml = `
                <div class="modal fade" id="imageModal" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content border-0">
                            <div class="modal-body p-0 position-relative">
                                <img src="${img.src}" alt="${img.alt}" class="img-fluid w-100 rounded">
                                <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal"></button>
                            </div>
                        </div>
                    </div>
                </div>`;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                const modalEl = document.getElementById('imageModal');
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
                modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Tombol scroll to top
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg';
    scrollBtn.style.width = '50px';
    scrollBtn.style.height = '50px';
    scrollBtn.style.background = 'linear-gradient(135deg, #1da084, #0a6e4a)';
    scrollBtn.style.border = 'none';
    scrollBtn.style.display = 'none';
    scrollBtn.style.zIndex = '9999';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        scrollBtn.style.alignItems = 'center';
        scrollBtn.style.justifyContent = 'center';
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Tutup modal dengan klik luar
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.addEventListener('click', e => { if (e.target === shareModal) closeShareModal(); });
    }
    const pdfAuthModal = document.getElementById('pdfAuthModal');
    if (pdfAuthModal) {
        pdfAuthModal.addEventListener('click', e => { if (e.target === pdfAuthModal) closePdfAuthModal(); });
    }

    // Tombol Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfPreview();
            closePdfAuthModal();
        }
    });

    // Password toggle
    const toggleBtn = document.getElementById('passwordToggle');
    if (toggleBtn) toggleBtn.addEventListener('click', togglePasswordVisibility);

    // Input kode keamanan
    const securityInput = document.getElementById('securityCodeInput');
    if (securityInput) {
        securityInput.addEventListener('keypress', e => { if (e.key === 'Enter') verifySecurityCode(); });
        securityInput.addEventListener('input', function () { this.value = this.value.replace(/[^0-9]/g, ''); });
    }

    // Footer position
    fixFooterPosition();
    window.addEventListener('resize', fixFooterPosition);

    // Animasi shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%,100% { transform: translateX(0); }
            10%,30%,50%,70%,90% { transform: translateX(-5px); }
            20%,40%,60%,80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Debug code
    console.log('Kode keamanan hari ini:', generateSecurityCode());
});
