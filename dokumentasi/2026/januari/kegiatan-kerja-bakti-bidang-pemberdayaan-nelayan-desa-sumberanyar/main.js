// ==================== GLOBAL VARIABLES ====================
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes
let isPasswordVisible = false;

// ==================== GLOBAL FUNCTIONS (called from HTML) ====================

// Share Modal
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
    const text = encodeURIComponent('Pendampingan Verifikasi Hibah Nelayan Tahun 2026 - Dinas Perikanan Situbondo\n\nKegiatan pendampingan Dinas Kelautan Perikanan Jawa Timur dalam rangka verifikasi dan validasi kelompok penerima hibah provinsi tahun anggaran 2026 di Desa Lamongan Kecamatan Arjasa.\n\nBaca selengkapnya di:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}
function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(() => {
        alert('Gagal menyalin link. Silakan coba lagi.');
    });
}

// PDF Authorization Modal
function openPdfAuthModal() {
    const lockStatus = isLockedOut();
    if (lockStatus.locked) {
        alert(lockStatus.message);
        return;
    }
    const input = document.getElementById('securityCodeInput');
    if (input) {
        input.value = '';
        input.classList.remove('is-invalid');
    }
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) errorMsg.style.display = 'none';
    const attemptsSpan = document.getElementById('attemptsLeft');
    if (attemptsSpan) attemptsSpan.textContent = maxAttempts - currentAttempts;
    const modal = document.getElementById('pdfAuthModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => input?.focus(), 300);
    }
}
function closePdfAuthModal() {
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'none';
}
function verifySecurityCode() {
    const lockStatus = isLockedOut();
    if (lockStatus.locked) {
        const errorText = document.getElementById('errorText');
        const errorMsg = document.getElementById('errorMessage');
        if (errorText) errorText.textContent = lockStatus.message;
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }
    const userInput = document.getElementById('securityCodeInput')?.value.trim() || '';
    const correctCode = generateSecurityCode();
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const inputEl = document.getElementById('securityCodeInput');
    const attemptsSpan = document.getElementById('attemptsLeft');

    // Validasi panjang dan angka (sudah difilter input)
    if (!userInput || userInput.length !== 8 || !/^\d+$/.test(userInput)) {
        if (errorText) errorText.textContent = 'Kode keamanan harus terdiri dari 8 digit angka.';
        if (errorMsg) errorMsg.style.display = 'block';
        if (inputEl) {
            inputEl.classList.add('is-invalid');
            inputEl.focus();
            // Animasi shake
            inputEl.style.animation = 'none';
            setTimeout(() => { inputEl.style.animation = 'shake 0.5s'; }, 10);
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

        if (errorMsg) errorMsg.style.display = 'block';
        if (inputEl) {
            inputEl.classList.add('is-invalid');
            inputEl.style.animation = 'none';
            setTimeout(() => { inputEl.style.animation = 'shake 0.5s'; }, 10);
            inputEl.value = '';
            inputEl.focus();
        }
    }
}
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('securityCodeInput');
    const toggleIcon = document.getElementById('passwordToggle')?.querySelector('i');
    if (!passwordInput || !toggleIcon) return;
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    toggleIcon.className = isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
}

// PDF Preview Modal
function openPdfPreview() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) modal.style.display = 'flex';
}
function closePdfPreview() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) modal.style.display = 'none';
}

// Loading Overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';
}
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

// Security Helpers
function isLockedOut() {
    if (lockoutTime > 0) {
        const now = new Date().getTime();
        const remaining = lockoutTime - now;
        if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            return {
                locked: true,
                message: `Akses terkunci. Silakan coba lagi dalam ${minutes} menit ${seconds} detik.`
            };
        } else {
            lockoutTime = 0;
            currentAttempts = 0;
        }
    }
    return { locked: false, message: '' };
}
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year;
}

// PDF Generation
function generatePDFReport() {
    showLoading();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333;">
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
                        <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1a5f7a;">DINAS PETERNAKAN DAN PERIKANAN</h1>
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
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1a5f7a; line-height: 1.4;">
                PENDAMPINGAN VERIFIKASI DAN VALIDASI KELOMPOK PENERIMA HIBAH<br>
                PROVINSI TAHUN ANGGARAN 2026 DI DESA LAMONGAN KECAMATAN ARJASA
            </h1>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">I. LATAR BELAKANG</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Dalam rangka optimalisasi penyaluran bantuan hibah pemerintah kepada nelayan, Dinas Kelautan Perikanan Provinsi Jawa Timur melaksanakan kegiatan pendampingan verifikasi dan validasi kelompok penerima hibah provinsi tahun anggaran 2026. Kegiatan ini merupakan langkah strategis untuk memastikan bahwa bantuan hibah pembelian perahu nelayan tepat sasaran, transparan, dan akuntabel. Pendampingan dilaksanakan di Desa Lamongan, Kecamatan Arjasa, Kabupaten Situbondo sebagai bentuk komitmen pemerintah dalam meningkatkan kesejahteraan nelayan melalui program pemberdayaan yang berkelanjutan.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">II. TUJUAN KEGIATAN</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;">Memastikan validitas data kelompok nelayan penerima hibah pembelian perahu tahun anggaran 2026</li>
                <li style="margin-bottom: 10px;">Verifikasi kelengkapan dokumen administrasi yang dibutuhkan dalam proses pengajuan hibah</li>
                <li style="margin-bottom: 10px;">Memastikan tepat sasaran dalam penyaluran hibah untuk pembelian perahu nelayan</li>
                <li style="margin-bottom: 10px;">Memberikan pendampingan teknis dalam penyusunan proposal hibah yang sesuai dengan kebutuhan riil</li>
                <li style="margin-bottom: 0;">Memastikan transparansi dan akuntabilitas dalam setiap tahapan proses penyaluran hibah</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">III. WAKTU DAN LOKASI KEGIATAN</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan pendampingan verifikasi dilaksanakan pada <strong>22 Januari 2026</strong> bertempat di <strong>Kantor Desa Lamongan, Kecamatan Arjasa, Kabupaten Situbondo</strong>. Acara dimulai pukul 09.00 WIB dan berakhir pukul 15.00 WIB.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">IV. PESERTA KEGIATAN</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;">Tim dari Dinas Kelautan Perikanan Provinsi Jawa Timur (Verifikator dan Validator)</li>
                <li style="margin-bottom: 10px;">SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo)</li>
                <li style="margin-bottom: 10px;">Staf Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo</li>
                <li style="margin-bottom: 10px;">Penyuluh Perikanan Kecamatan Arjasa</li>
                <li style="margin-bottom: 10px;">Kelompok Nelayan Penerima Hibah Desa Lamongan</li>
                <li style="margin-bottom: 0;">Perangkat Desa Lamongan</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">V. HASIL DAN PEMBAHASAN</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan pendampingan verifikasi berlangsung dengan lancar dan menghasilkan beberapa poin penting:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;"><strong>Verifikasi Administrasi:</strong> Tim DKP Provinsi Jawa Timur melakukan pemeriksaan mendetail terhadap kelengkapan dokumen administrasi kelompok nelayan penerima hibah, meliputi KTP, KK, Surat Keterangan Usaha, dan proposal hibah.</li>
                <li style="margin-bottom: 10px;"><strong>Validasi Data Kelompok:</strong> Dilakukan validasi terhadap keanggotaan kelompok, struktur organisasi, dan kesiapan teknis dalam pengelolaan hibah pembelian perahu.</li>
                <li style="margin-bottom: 10px;"><strong>Pendampingan Teknis:</strong> Tim memberikan pendampingan teknis dalam penyempurnaan proposal hibah agar sesuai dengan format dan ketentuan yang berlaku.</li>
                <li style="margin-bottom: 10px;"><strong>Verifikasi Kebutuhan Riil:</strong> Dilakukan analisis terhadap kebutuhan riil kelompok nelayan terhadap perahu baru, mempertimbangkan kondisi perahu existing, kapasitas tangkapan, dan potensi pengembangan.</li>
                <li style="margin-bottom: 0;"><strong>Koordinasi dan Sinergi:</strong> Terjalin koordinasi yang baik antara Tim DKP Provinsi Jawa Timur, Dinas Perikanan Situbondo, penyuluh perikanan, dan kelompok nelayan dalam proses verifikasi.</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1a5f7a;">VI. KESIMPULAN DAN REKOMENDASI</h4>
            <p style="text-align: justify; margin-bottom: 15px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan pendampingan verifikasi dan validasi kelompok penerima hibah telah berhasil dilaksanakan dengan baik dan menghasilkan beberapa kesimpulan:
            </p>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;">Kelompok nelayan penerima hibah di Desa Lamongan secara umum telah memenuhi persyaratan administrasi yang dibutuhkan.</li>
                <li style="margin-bottom: 10px;">Dokumen yang diajukan telah memenuhi standar kelengkapan sesuai dengan ketentuan yang berlaku.</li>
                <li style="margin-bottom: 10px;">Kebutuhan terhadap perahu baru benar-benar riil dan mendesak untuk meningkatkan produktivitas tangkapan.</li>
                <li style="margin-bottom: 10px;">Kelompok nelayan telah menunjukkan kesiapan teknis dalam pengelolaan hibah dan pengoperasian perahu baru.</li>
                <li style="margin-bottom: 0;">Proses verifikasi yang ketat telah memastikan bahwa hibah akan tepat sasaran dan memberikan manfaat optimal.</li>
            </ol>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Direkomendasikan untuk segera melakukan proses penetapan penerima hibah berdasarkan hasil verifikasi ini, dilanjutkan dengan proses penyaluran dana hibah sesuai dengan prosedur yang berlaku. Perlu juga dilakukan monitoring dan evaluasi pasca penyaluran hibah untuk memastikan keberlanjutan program.
            </p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 80px; align-items: flex-start;">
            <div style="width: 60%;">
                <div style="margin-bottom: 10px;">
                    <p style="margin-bottom: 5px; font-size: 12px;">Situbondo, ${formattedDate}</p>
                    <p style="font-weight: bold; font-size: 12px; margin-top: 40px;">Pelapor,</p>
                </div>
            </div>
            <div style="width: 35%;"></div>
        </div>
        
        <div style="margin-top: 100px; border-top: 1px solid #ddd; padding-top: 15px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; font-size: 10px; color: #666; width: 70%;">
                    <p style="margin-bottom: 5px;">Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo</p>
                    <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                </div>
                <div style="text-align: right; width: 25%;">
                    <div class="qr-code" style="background: #ffffff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); float: right;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1a5f7a&bgcolor=ffffff" 
                             alt="QR Code Sumber Laporan" 
                             style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666; clear: both; text-align: right;">Scan untuk mengakses sumber laporan</p>
                </div>
            </div>
        </div>
    </div>
    `;

    const previewContent = document.getElementById('pdfPreviewContent');
    if (previewContent) previewContent.innerHTML = pdfContent;
    hideLoading();
    openPdfPreview();
}

async function downloadPDF() {
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

        // Logo - coba muat gambar, jika gagal lewati
        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = reject;
                logoImg.src = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png';
            });
            doc.addImage(logoImg, 'PNG', margin, yPos, 18, 18);
        } catch (e) {
            console.log('Logo tidak dapat dimuat, melanjutkan tanpa logo');
        }

        // Kop surat teks
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

        doc.setLineWidth(0.5);
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 15;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('LAPORAN KEGIATAN', 105, yPos, { align: 'center' });
        yPos += 10;

        doc.setFontSize(14);
        const title1 = 'PENDAMPINGAN VERIFIKASI DAN VALIDASI KELOMPOK PENERIMA HIBAH';
        const title2 = 'PROVINSI TAHUN ANGGARAN 2026 DI DESA LAMONGAN KECAMATAN ARJASA';
        doc.splitTextToSize(title1, 170).forEach(line => { doc.text(line, 105, yPos, { align: 'center' }); yPos += 7; });
        doc.splitTextToSize(title2, 170).forEach(line => { doc.text(line, 105, yPos, { align: 'center' }); yPos += 7; });
        yPos += 10;

        // Helper untuk menambahkan teks
        function addText(title, content, isList = false, isNumberedList = false) {
            if (yPos > 270) { doc.addPage(); yPos = margin; }
            if (title) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(title, margin, yPos);
                yPos += 8;
            }
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');

            if (isList) {
                const items = content.split('\n');
                items.forEach((item, idx) => {
                    if (yPos > 270) { doc.addPage(); yPos = margin + 8; }
                    const lines = doc.splitTextToSize(item, 160);
                    lines.forEach((line, lineIdx) => {
                        if (lineIdx === 0) {
                            const prefix = isNumberedList ? `${idx + 1}. ` : '• ';
                            doc.text(prefix + line, margin + 5, yPos);
                        } else {
                            doc.text(line, margin + 10, yPos);
                        }
                        yPos += 6;
                    });
                });
            } else {
                doc.splitTextToSize(content, 170).forEach(line => {
                    if (yPos > 270) { doc.addPage(); yPos = margin; }
                    doc.text(line, margin, yPos);
                    yPos += 6;
                });
            }
            yPos += 8;
        }

        // Isi laporan
        addText('I. LATAR BELAKANG', 'Dalam rangka optimalisasi penyaluran bantuan hibah pemerintah kepada nelayan, Dinas Kelautan Perikanan Provinsi Jawa Timur melaksanakan kegiatan pendampingan verifikasi dan validasi kelompok penerima hibah provinsi tahun anggaran 2026. Kegiatan ini merupakan langkah strategis untuk memastikan bahwa bantuan hibah pembelian perahu nelayan tepat sasaran, transparan, dan akuntabel. Pendampingan dilaksanakan di Desa Lamongan, Kecamatan Arjasa, Kabupaten Situbondo sebagai bentuk komitmen pemerintah dalam meningkatkan kesejahteraan nelayan melalui program pemberdayaan yang berkelanjutan.');
        addText('II. TUJUAN KEGIATAN', 
            'Memastikan validitas data kelompok nelayan penerima hibah pembelian perahu tahun anggaran 2026\n' +
            'Verifikasi kelengkapan dokumen administrasi yang dibutuhkan dalam proses pengajuan hibah\n' +
            'Memastikan tepat sasaran dalam penyaluran hibah untuk pembelian perahu nelayan\n' +
            'Memberikan pendampingan teknis dalam penyusunan proposal hibah yang sesuai dengan kebutuhan riil\n' +
            'Memastikan transparansi dan akuntabilitas dalam setiap tahapan proses penyaluran hibah', true, true);
        addText('III. WAKTU DAN LOKASI KEGIATAN', 'Kegiatan pendampingan verifikasi dilaksanakan pada 22 Januari 2026 bertempat di Kantor Desa Lamongan, Kecamatan Arjasa, Kabupaten Situbondo. Acara dimulai pukul 09.00 WIB dan berakhir pukul 15.00 WIB.');
        addText('IV. PESERTA KEGIATAN', 
            'Tim dari Dinas Kelautan Perikanan Provinsi Jawa Timur (Verifikator dan Validator)\n' +
            'SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo)\n' +
            'Staf Bidang Pemberdayaan Nelayan Dinas Perikanan Situbondo\n' +
            'Penyuluh Perikanan Kecamatan Arjasa\n' +
            'Kelompok Nelayan Penerima Hibah Desa Lamongan\n' +
            'Perangkat Desa Lamongan', true);
        addText('V. HASIL DAN PEMBAHASAN', 'Kegiatan pendampingan verifikasi berlangsung dengan lancar dan menghasilkan beberapa poin penting:');
        addText('', 
            'Verifikasi Administrasi: Tim DKP Provinsi Jawa Timur melakukan pemeriksaan mendetail terhadap kelengkapan dokumen administrasi kelompok nelayan penerima hibah, meliputi KTP, KK, Surat Keterangan Usaha, dan proposal hibah.\n' +
            'Validasi Data Kelompok: Dilakukan validasi terhadap keanggotaan kelompok, struktur organisasi, dan kesiapan teknis dalam pengelolaan hibah pembelian perahu.\n' +
            'Pendampingan Teknis: Tim memberikan pendampingan teknis dalam penyempurnaan proposal hibah agar sesuai dengan format dan ketentuan yang berlaku.\n' +
            'Verifikasi Kebutuhan Riil: Dilakukan analisis terhadap kebutuhan riil kelompok nelayan terhadap perahu baru, mempertimbangkan kondisi perahu existing, kapasitas tangkapan, dan potensi pengembangan.\n' +
            'Koordinasi dan Sinergi: Terjalin koordinasi yang baik antara Tim DKP Provinsi Jawa Timur, Dinas Perikanan Situbondo, penyuluh perikanan, dan kelompok nelayan dalam proses verifikasi.', true, true);
        addText('VI. KESIMPULAN DAN REKOMENDASI', 'Kegiatan pendampingan verifikasi dan validasi kelompok penerima hibah telah berhasil dilaksanakan dengan baik dan menghasilkan beberapa kesimpulan:');
        addText('', 
            'Kelompok nelayan penerima hibah di Desa Lamongan secara umum telah memenuhi persyaratan administrasi yang dibutuhkan.\n' +
            'Dokumen yang diajukan telah memenuhi standar kelengkapan sesuai dengan ketentuan yang berlaku.\n' +
            'Kebutuhan terhadap perahu baru benar-benar riil dan mendesak untuk meningkatkan produktivitas tangkapan.\n' +
            'Kelompok nelayan telah menunjukkan kesiapan teknis dalam pengelolaan hibah dan pengoperasian perahu baru.\n' +
            'Proses verifikasi yang ketat telah memastikan bahwa hibah akan tepat sasaran dan memberikan manfaat optimal.', true, true);
        addText('', 'Direkomendasikan untuk segera melakukan proses penetapan penerima hibah berdasarkan hasil verifikasi ini, dilanjutkan dengan proses penyaluran dana hibah sesuai dengan prosedur yang berlaku. Perlu juga dilakukan monitoring dan evaluasi pasca penyaluran hibah untuk memastikan keberlanjutan program.');

        // Tanda tangan
        if (yPos > 250) { doc.addPage(); yPos = margin; }
        doc.setFontSize(11);
        doc.text(`Situbondo, ${formattedDate}`, margin, yPos);
        yPos += 12;
        doc.setFont('helvetica', 'bold');
        doc.text('Pelapor,', margin, yPos);
        yPos += 25;

        // Footer
        doc.setLineWidth(0.1);
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
            await new Promise((resolve, reject) => {
                qrImg.onload = resolve;
                qrImg.onerror = reject;
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1a5f7a&bgcolor=ffffff`;
            });
            const qrSize = 15;
            const qrX = 210 - margin - qrSize;
            const qrY = yPos - 9;
            doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
            doc.setFontSize(6);
            doc.text('Scan untuk', qrX + qrSize / 2, qrY + qrSize + 3, { align: 'center' });
            doc.text('mengakses', qrX + qrSize / 2, qrY + qrSize + 6, { align: 'center' });
        } catch (e) {
            console.log('QR Code gagal dimuat, melanjutkan tanpa QR');
        }

        const fileName = `Laporan_Verifikasi_Hibah_Nelayan_${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}.pdf`;
        doc.save(fileName);
        hideLoading();
        closePdfPreview();
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('Maaf, terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }

    // Tahun dinamis di footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Efek scroll navbar
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 50
                ? '0 5px 20px rgba(0, 0, 0, 0.1)'
                : '0 2px 20px rgba(26, 95, 122, 0.08)';
        }
    });

    // Gallery modal
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (!img) return;
            const imgSrc = img.src;
            const imgAlt = img.alt;
            const modalHTML = `
            <div class="modal fade" id="imageModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0">
                        <div class="modal-body p-0 position-relative">
                            <img src="${imgSrc}" alt="${imgAlt}" class="img-fluid w-100 rounded">
                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal" aria-label="Tutup"></button>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modalElement = document.getElementById('imageModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                modalElement.addEventListener('hidden.bs.modal', function () {
                    this.remove();
                });
            }
        });
    });

    // Smooth scroll untuk anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target === '#') return;
            const el = document.querySelector(target);
            if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
        });
    });

    // Tombol scroll to top
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'btn btn-primary position-fixed bottom-3 end-3 rounded-circle shadow-lg';
    scrollBtn.style.width = '50px';
    scrollBtn.style.height = '50px';
    scrollBtn.style.zIndex = '1000';
    scrollBtn.style.display = 'none';
    scrollBtn.style.background = 'linear-gradient(135deg, var(--secondary-blue), var(--primary-blue))';
    scrollBtn.style.border = 'none';
    scrollBtn.style.alignItems = 'center';
    scrollBtn.style.justifyContent = 'center';
    scrollBtn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function () {
        scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Tutup modal dengan klik di luar atau ESC
    function closeModalOnOutsideClick(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === this) this.style.display = 'none';
            });
        }
    }
    closeModalOnOutsideClick('shareModal');
    closeModalOnOutsideClick('pdfAuthModal');
    closeModalOnOutsideClick('pdfPreviewModal');

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfAuthModal();
            closePdfPreview();
        }
    });

    // Event listeners untuk PDF Auth
    const passToggle = document.getElementById('passwordToggle');
    if (passToggle) passToggle.addEventListener('click', togglePasswordVisibility);

    const secInput = document.getElementById('securityCodeInput');
    if (secInput) {
        // Hanya angka
        secInput.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        secInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') verifySecurityCode();
        });
    }

    // Debug: tampilkan kode hari ini di console
    console.log('Kode keamanan hari ini:', generateSecurityCode());
});

// Animasi shake (didefinisikan sekali)
if (!document.querySelector('#shakeAnimation')) {
    const styleShake = document.createElement('style');
    styleShake.id = 'shakeAnimation';
    styleShake.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(styleShake);
}
