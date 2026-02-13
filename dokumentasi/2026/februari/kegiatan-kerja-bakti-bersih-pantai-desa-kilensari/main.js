// ===== main.js – VERSI FINAL LENGKAP =====
// PERBAIKAN:
// 1. QR Code: regenerate & load ulang saat download agar pasti tercetak
// 2. Edit Preview: tambah indikator halaman (sticky header), tidak mengganggu layout
// 3. Preview PDF: padding 10mm, max-width 210mm, konsisten dengan hasil download

// ========= INISIALISASI AOS =========
AOS.init({ duration: 800, once: true, offset: 100 });
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ========= DATA PEGAWAI UNTUK DROPDOWN =========
const pegawaiList = [
    { nama: "SUGENG PURWO PRIYANTO, S.E., M.M.", nip: "197611032009031001" },
    { nama: "MULYONO, S.H.", nip: "196901171990031002" },
    { nama: "FERI ZAINUR ROFIQ, S.Pi., M.Si.", nip: "198203062010011023" },
    { nama: "LEDY MATMIRA, S.Pi.", nip: "199806142022042002" },
    { nama: "ARSYA CHAIRUL FAJRI, S.Sos.", nip: "199511122025211087" },
    { nama: "FRANKY ARIS SANDI, S.Pd.", nip: "199211212025211100" },
    { nama: "SIRRY NURIL FIJRIYA, S.E.", nip: "199209242025212099" },
    { nama: "MUHAMMAD SALAM", nip: "198809122025211130" },
    { nama: "IMAM ARSIDI, S.E.", nip: "197107072007011021" },
    { nama: "AKHMAD FAUZI", nip: "196905052007011039" },
    { nama: "YUSUF PRIADI", nip: "198004082010011002" },
    { nama: "CHAIRUL IMAN TARYANTO", nip: "197604302014061001" },
    { nama: "ANDI FEBRIYANTO, A.Md.Pi.", nip: "199402262023211013" },
    { nama: "META HARIADI", nip: "197705142007011015" }
];

// ========= GLOBAL VARIABLES =========
let maxAttempts = 3, currentAttempts = 0, lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000;
let captchaResult = 0;
let isEditMode = false;
const REPORT_URL = 'https://www.dinasperikanansitubondo.com/dokumentasi/2026/februari/kegiatan-kerja-bakti-bersih-pantai-desa-kilensari';

// ========= NAVBAR SCROLL EFFECT =========
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
        navbar.style.backgroundColor = 'rgba(255,255,255,0.98)';
    } else {
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.05)';
        navbar.style.backgroundColor = 'rgba(255,255,255,0.98)';
    }
});

// ========= GALLERY MODAL =========
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
                        <img src="${imgSrc}" alt="${imgAlt}" class="img-fluid w-100 rounded" style="border-radius:16px !important;">
                        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white rounded-circle p-2" style="width:40px; height:40px;" data-bs-dismiss="modal"></button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
        document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() { this.remove(); });
    });
});

// ========= SMOOTH SCROLL =========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if(targetElement) window.scrollTo({ top: targetElement.offsetTop - 100, behavior: 'smooth' });
    });
});

// ========= SCROLL TO TOP BUTTON =========
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollTopBtn.className = 'btn btn-primary position-fixed bottom-3 end-3 rounded-circle shadow-lg';
scrollTopBtn.style.width = '50px'; scrollTopBtn.style.height = '50px'; scrollTopBtn.style.zIndex = '9999'; scrollTopBtn.style.display = 'none';
scrollTopBtn.style.background = 'linear-gradient(135deg, #f97316, #f59e0b)'; scrollTopBtn.style.border = 'none';
scrollTopBtn.style.bottom = '30px'; scrollTopBtn.style.right = '30px';
document.body.appendChild(scrollTopBtn);
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex'; scrollTopBtn.style.alignItems = 'center'; scrollTopBtn.style.justifyContent = 'center';
    } else { scrollTopBtn.style.display = 'none'; }
});
scrollTopBtn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ========= SHARE FUNCTIONS =========
function openShareModal() { document.getElementById('shareModal').style.display = 'flex'; }
function closeShareModal() { document.getElementById('shareModal').style.display = 'none'; }
function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Dinas Peternakan & Perikanan Situbondo turut serta dalam Karya Bakti Bersih Pantai Desa Kilensari, Kamis 12 Februari 2026. Simak selengkapnya:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link berhasil disalin!'); closeShareModal();
    }).catch(() => alert('Gagal menyalin link.'));
}
document.getElementById('shareModal').addEventListener('click', function(e) { if (e.target === this) closeShareModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeShareModal(); closePdfAuthModal(); closePdfPreview(); closePdfDataFormModal(); } });

// ========= PDF AUTHORIZATION =========
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2,'0');
    const month = String(now.getMonth()+1).padStart(2,'0');
    const year = now.getFullYear();
    return day + month + year;
}

function isLockedOut() {
    if (lockoutTime > 0) {
        const timeRemaining = lockoutTime - new Date().getTime();
        if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);
            return { locked: true, message: `Akses terkunci. Coba lagi dalam ${minutes} menit ${seconds} detik.` };
        } else { lockoutTime = 0; currentAttempts = 0; }
    }
    return { locked: false, message: '' };
}

let isPasswordVisible = false;
function togglePasswordVisibility() {
    const input = document.getElementById('securityCodeInput');
    const icon = document.getElementById('passwordToggle').querySelector('i');
    isPasswordVisible = !isPasswordVisible;
    input.type = isPasswordVisible ? 'text' : 'password';
    icon.className = isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
}

function openPdfAuthModal() {
    const lock = isLockedOut();
    if (lock.locked) { alert(lock.message); return; }
    document.getElementById('securityCodeInput').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('securityCodeInput').classList.remove('is-invalid');
    document.getElementById('attemptsLeft').textContent = maxAttempts - currentAttempts;
    document.getElementById('pdfAuthModal').style.display = 'flex';
    setTimeout(() => document.getElementById('securityCodeInput').focus(), 300);
}

function closePdfAuthModal() { document.getElementById('pdfAuthModal').style.display = 'none'; }

function verifySecurityCode() {
    const lock = isLockedOut();
    if (lock.locked) {
        document.getElementById('errorText').textContent = lock.message;
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }
    const userInput = document.getElementById('securityCodeInput').value;
    const correctCode = generateSecurityCode();
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const inputEl = document.getElementById('securityCodeInput');
    
    if (!userInput || userInput.length !== 8) {
        errorText.textContent = 'Kode harus 8 digit angka.';
        errorMsg.style.display = 'block'; inputEl.classList.add('is-invalid'); inputEl.focus(); return;
    }
    if (userInput === correctCode) {
        currentAttempts = 0;
        closePdfAuthModal();
        openPdfDataFormModal();
    } else {
        currentAttempts++;
        document.getElementById('attemptsLeft').textContent = maxAttempts - currentAttempts;
        if (currentAttempts >= maxAttempts) {
            lockoutTime = new Date().getTime() + lockoutDuration;
            errorText.textContent = 'Terlalu banyak gagal. Akses terkunci 5 menit.';
        } else {
            errorText.textContent = `Kode salah. Percobaan ${currentAttempts} dari ${maxAttempts}.`;
        }
        errorMsg.style.display = 'block'; inputEl.classList.add('is-invalid');
        inputEl.style.animation = 'none'; setTimeout(() => inputEl.style.animation = 'shake 0.5s', 10);
        inputEl.value = ''; inputEl.focus();
    }
}

// Style shake
const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 10%,30%,50%,70%,90%{transform:translateX(-5px)} 20%,40%,60%,80%{transform:translateX(5px)} }`;
document.head.appendChild(style);

// ========= DROPDOWN NAMA OTOMATIS =========
function populateSelectNama() {
    const selectEl = document.getElementById('selectNamaPelapor');
    if (!selectEl) return;
    selectEl.innerHTML = '<option value="" selected disabled>-- Pilih Nama --</option>';
    pegawaiList.forEach(pegawai => {
        const option = document.createElement('option');
        option.value = pegawai.nip;
        option.textContent = pegawai.nama;
        selectEl.appendChild(option);
    });
}

function initDropdownListener() {
    const selectEl = document.getElementById('selectNamaPelapor');
    if (selectEl) {
        selectEl.addEventListener('change', function(e) {
            const selectedNip = this.value;
            if (!selectedNip) {
                document.getElementById('namaPelapor').value = '';
                document.getElementById('nipPelapor').value = '';
                return;
            }
            const pegawai = pegawaiList.find(p => p.nip === selectedNip);
            if (pegawai) {
                document.getElementById('namaPelapor').value = pegawai.nama;
                document.getElementById('nipPelapor').value = pegawai.nip;
            }
        });
    }
}

// ========= QR CODE GENERATOR (FIX: METHOD RESMI) =========
function generateQRDataURL(text = REPORT_URL, size = 100) {
    const qrlib = (typeof qrcode !== 'undefined') ? qrcode : 
                  (typeof window.qrcode !== 'undefined' ? window.qrcode : null);
    if (!qrlib || typeof qrlib !== 'function') {
        console.warn('QR Code library tidak tersedia, menggunakan fallback.');
        return generateFallbackQR(size);
    }

    try {
        const qr = qrlib(0, 'H');
        qr.addData(text);
        qr.make();

        const moduleCount = qr.getModuleCount();
        const cellSize = 5;
        const canvas = document.createElement('canvas');
        canvas.width = moduleCount * cellSize;
        canvas.height = moduleCount * cellSize;
        const ctx = canvas.getContext('2d');

        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                ctx.fillStyle = qr.isDark(row, col) ? '#1e3a8a' : '#ffffff';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = size;
        resizedCanvas.height = size;
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, size, size);
        
        return resizedCanvas.toDataURL('image/png');
    } catch (e) {
        console.error('Gagal generate QR code:', e);
        return generateFallbackQR(size);
    }
}

function generateFallbackQR(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('QR', size/2, size/2);
    return canvas.toDataURL('image/png');
}

// ========= GENERATE ID DOKUMEN UNIK =========
function generateDocumentId() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `KBK-${day}${month}${year}-${random}`;
}

// ========= LOADING OVERLAY =========
function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }

// ========= MODAL PREVIEW =========
function openPdfPreview() { 
    document.getElementById('pdfPreviewModal').style.display = 'flex';
    if (isEditMode) updatePageInfo(); // hitung halaman awal
}
function closePdfPreview() { 
    document.getElementById('pdfPreviewModal').style.display = 'none';
    if (isEditMode) toggleEditPreview(); // matikan mode edit jika aktif
}

// ========= FITUR EDIT PREVIEW + INDIKATOR HALAMAN =========
function toggleEditPreview() {
    const previewDiv = document.getElementById('pdfPreviewContent');
    const btnEdit = document.getElementById('btnEditPreview');
    const headerInfo = document.getElementById('pdfPreviewHeader');
    if (!previewDiv || !btnEdit || !headerInfo) return;
    
    isEditMode = !isEditMode;
    if (isEditMode) {
        previewDiv.contentEditable = "true";
        previewDiv.classList.add('editing-mode');
        btnEdit.innerHTML = '<i class="fas fa-lock me-2"></i>Selesai Edit';
        btnEdit.classList.remove('btn-warning');
        btnEdit.classList.add('btn-success');
        headerInfo.style.display = 'flex'; // tampilkan header

        // Event listener untuk update halaman saat scroll & edit
        previewDiv.addEventListener('scroll', updatePageInfo);
        previewDiv.addEventListener('input', updatePageInfo);
        updatePageInfo(); // hitung awal
    } else {
        previewDiv.contentEditable = "false";
        previewDiv.classList.remove('editing-mode');
        btnEdit.innerHTML = '<i class="fas fa-pencil-alt me-2"></i>Edit';
        btnEdit.classList.remove('btn-success');
        btnEdit.classList.add('btn-warning');
        headerInfo.style.display = 'none';

        previewDiv.removeEventListener('scroll', updatePageInfo);
        previewDiv.removeEventListener('input', updatePageInfo);
    }
}

// Fungsi menghitung perkiraan halaman A4 dan halaman aktif berdasarkan scroll
function updatePageInfo() {
    const previewDiv = document.getElementById('pdfPreviewContent');
    if (!previewDiv) return;

    // Tinggi konten sebenarnya
    const contentHeight = previewDiv.scrollHeight;
    // Tinggi 1 halaman A4 dalam pixel (mengacu pada lebar 210mm, rasio 297/210)
    const pageWidthPx = previewDiv.clientWidth; // lebar elemen (bisa 210mm ≈ ?)
    // Asumsi tinggi halaman = (297/210) * lebar (dalam pixel)
    const pageHeightPx = (297 / 210) * pageWidthPx;
    
    const totalPages = Math.max(1, Math.ceil(contentHeight / pageHeightPx));
    const scrollTop = previewDiv.scrollTop;
    let currentPage = Math.floor(scrollTop / pageHeightPx) + 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const pageInfoEl = document.getElementById('pageInfo');
    if (pageInfoEl) {
        pageInfoEl.innerHTML = `Halaman: ${currentPage} / ${totalPages}`;
    }
}

// ========= FORM DATA PELAPOR =========
function openPdfDataFormModal() {
    populateSelectNama();
    initDropdownListener();
    
    const num1 = Math.floor(Math.random() * 5) + 3;
    const num2 = Math.floor(Math.random() * 5) + 2;
    captchaResult = num1 + num2;
    document.getElementById('captchaQuestion').innerHTML = `${num1} + ${num2} = ?`;
    
    document.getElementById('pdfDataForm').reset();
    document.getElementById('namaPelapor').classList.remove('is-invalid');
    document.getElementById('nipPelapor').classList.remove('is-invalid');
    document.getElementById('captchaInput').classList.remove('is-invalid');
    document.getElementById('captchaError').style.display = 'none';
    
    document.getElementById('pdfDataFormModal').style.display = 'flex';
}

function closePdfDataFormModal() {
    document.getElementById('pdfDataFormModal').style.display = 'none';
}

function submitPdfDataForm() {
    const nama = document.getElementById('namaPelapor').value.trim();
    const nip = document.getElementById('nipPelapor').value.trim();
    const captchaAnswer = document.getElementById('captchaInput').value.trim();
    const agreement = document.getElementById('agreementCheck').checked;

    let isValid = true;
    if (!nama) {
        document.getElementById('namaPelapor').classList.add('is-invalid');
        isValid = false;
    } else { document.getElementById('namaPelapor').classList.remove('is-invalid'); }

    if (!nip || nip.length !== 18 || !/^\d{18}$/.test(nip)) {
        document.getElementById('nipPelapor').classList.add('is-invalid');
        isValid = false;
    } else { document.getElementById('nipPelapor').classList.remove('is-invalid'); }

    if (!captchaAnswer || parseInt(captchaAnswer) !== captchaResult) {
        document.getElementById('captchaInput').classList.add('is-invalid');
        document.getElementById('captchaError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('captchaInput').classList.remove('is-invalid');
        document.getElementById('captchaError').style.display = 'none';
    }

    if (!agreement) {
        alert('Anda harus menyetujui pernyataan sebelum dapat mengunduh laporan.');
        isValid = false;
    }

    if (!isValid) return;

    closePdfDataFormModal();
    generatePDFReport(nama, nip);
}

// ========= GENERATE PDF REPORT (ISI LAPORAN) =========
function generatePDFReport(namaPelapor, nipPelapor) {
    showLoading();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const qrDataURL = generateQRDataURL(REPORT_URL, 100);
    const docId = generateDocumentId();

    const kopSuratHTML = `
        <div style="margin-bottom: 30px; text-align: center;">
            <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/kop-surat-resmi-dinas-peternakan-perikanan-situbondo.png" 
                 alt="Kop Surat Dinas Peternakan dan Perikanan Situbondo" 
                 style="width: 100%; max-width: 100%; height: auto; display: block; margin: 0 auto;">
        </div>
    `;

    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: #333; padding: 0;">
        ${kopSuratHTML}
        
        <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold; text-transform: uppercase;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1e3a8a; margin-bottom: 5px;">
                KARYA BAKTI BERSIH PANTAI DESA KILENSARI
            </h1>
            <h2 style="font-size: 15px; font-weight: bold; color: #1e3a8a; margin-top: 0;">DERMAGA LAMA PANARUKAN</h2>
        </div>
        
        <div style="margin-bottom: 25px;">
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">I. DASAR PELAKSANAAN</h4>
            <p style="text-align:justify; margin-bottom:15px; font-size:12px; text-indent:30px;">
                Kegiatan ini dilaksanakan berdasarkan Surat Komando Distrik Militer 0823 Nomor <strong>B/99/II/2026</strong> tanggal 11 Februari 2026 perihal Permohonan Bantuan Personel dalam rangka Gerakan ASRI (Aman, Sehat, Resik, Indah). Kegiatan juga merupakan tindak lanjut Instruksi Presiden RI pada Rakornas Pusat dan Daerah serta Telegram Danrem 083/Bdj Nomor ST/108/2026.
            </p>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">II. WAKTU DAN TEMPAT</h4>
            <ul style="font-size:12px; line-height:1.6; padding-left: 20px;">
                <li>Hari/Tanggal : Kamis, 12 Februari 2026</li>
                <li>Waktu        : 06.00 WIB – selesai</li>
                <li>Tempat       : Dermaga Lama Panarukan, Desa Kilensari, Kecamatan Panarukan, Kabupaten Situbondo</li>
            </ul>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">III. PERSONEL DAN MATERIIL</h4>
            <ul style="font-size:12px; line-height:1.6; padding-left: 20px;">
                <li>Dinas Peternakan & Perikanan : 20 personel dipimpin Kabid Pemberdayaan Nelayan, Sugeng Purwo Priyanto, S.E., M.M.</li>
                <li>Seluruh OPD Kab. Situbondo : masing-masing 20 personel (kecuali DLH 50, Dishub 10+5, Dinkes 20+tim medis)</li>
                <li>Alat yang digunakan : sapu lidi, cangkul, sabit, mesin rumput, kantong sampah, 5 unit truk (DLH), 2 unit ambulan (Dinkes)</li>
            </ul>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">IV. HASIL KEGIATAN</h4>
            <p style="text-align:justify; font-size:12px; text-indent:30px; margin-bottom:15px;">
                Kegiatan berjalan lancar dan tertib. Kawasan Dermaga Lama Panarukan yang sebelumnya tampak kumuh dan dipenuhi sampah serta rumput liar berhasil dibersihkan secara signifikan. Sinergi antara TNI, Polri, Pemerintah Daerah, dan masyarakat terjalin dengan sangat baik. Dinas Peternakan dan Perikanan turut serta membersihkan area pendaratan ikan dan memberikan edukasi singkat kepada nelayan sekitar.
            </p>
            <p style="text-align:justify; font-size:12px; text-indent:30px;">
                Kegiatan ditutup dengan apel bersama yang dipimpin oleh Kepala Staf Kodim 0823. Apresiasi disampaikan kepada seluruh pihak, khususnya Dinas Peternakan dan Perikanan yang telah menunjukkan dedikasi tinggi dalam mendukung program kebersihan lingkungan pesisir.
            </p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 60px;">
            <div style="width: 60%;">
                <p style="margin-bottom:5px; font-size:12px;">Situbondo, ${formattedDate}</p>
                <p style="font-weight:bold; font-size:12px; margin-top:40px;">Pelapor,</p>
                <p style="margin-top:60px; font-size:12px; font-weight: bold;">${namaPelapor || '______________________'}</p>
                <p style="font-size:11px; color: #555;">NIP. ${nipPelapor || '______________________'}</p>
            </div>
            <div style="width: 35%; text-align: right;">
                <div style="background:white; padding:5px; border-radius:4px; box-shadow:0 2px 5px rgba(0,0,0,0.1); display:inline-block;">
                    <img src="${qrDataURL}" alt="QR Code Laporan" style="width:100px; height:100px; display:block;">
                </div>
                <p style="font-size:9px; margin-top:5px; clear:both; text-align:right;">Scan untuk akses laporan daring</p>
            </div>
        </div>
        <div style="margin-top:80px; border-top:1px solid #ddd; padding-top:15px;">
            <div style="text-align:left; font-size:10px; color:#666;">
                <p><strong>Dokumen ini dicetak secara elektronik dan merupakan dokumen resmi.</strong></p>
                <p>ID Verifikasi: ${docId} | Tanggal Cetak: ${formattedDate}</p>
                <p>© ${currentDate.getFullYear()} – Dinas Peternakan & Perikanan Kabupaten Situbondo</p>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
    if (isEditMode) toggleEditPreview(); // pastikan mode edit mati saat generate baru
    hideLoading();
    openPdfPreview();
}

// ========= DOWNLOAD PDF (QR CODE DIPASTIKAN TERCETAK) =========
async function downloadPDF() {
    showLoading();
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const element = document.getElementById('pdfPreviewContent');
        if (!element) throw new Error('Preview tidak ditemukan');

        // --- PERBAIKAN QR CODE: regenerate dan tunggu load ---
        const qrImg = element.querySelector('img[alt="QR Code Laporan"]');
        if (qrImg) {
            const newQR = generateQRDataURL(REPORT_URL, 100);
            qrImg.src = newQR;
            await new Promise(resolve => {
                if (qrImg.complete) resolve();
                else {
                    qrImg.onload = resolve;
                    qrImg.onerror = resolve;
                }
            });
        }

        // Simpan style asli
        const originalWidth = element.style.width;
        const originalPadding = element.style.padding;
        const originalBg = element.style.backgroundColor;
        
        // Set sementara ke ukuran A4 untuk capture
        element.style.width = '210mm';
        element.style.padding = '10mm';
        element.style.backgroundColor = 'white';

        // Tunggu semua gambar (kop surat, dll) selesai dimuat
        const images = element.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }));

        // Delay tambahan untuk rendering
        await new Promise(resolve => setTimeout(resolve, 300));

        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
        });

        // Kembalikan style
        element.style.width = originalWidth;
        element.style.padding = originalPadding;
        element.style.backgroundColor = originalBg;

        const imgWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const maxHeight = pageHeight - margin * 2;

        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 0;
        let pageCount = 1;

        while (position < imgHeight) {
            const canvasPage = document.createElement('canvas');
            const ctx = canvasPage.getContext('2d');
            const heightRatio = canvas.height / imgHeight;
            const pageHeightPx = maxHeight * heightRatio;
            const startY = position * heightRatio;
            
            canvasPage.width = canvas.width;
            canvasPage.height = Math.min(pageHeightPx, canvas.height - startY);
            
            ctx.drawImage(canvas, 0, startY, canvas.width, canvasPage.height, 0, 0, canvas.width, canvasPage.height);
            
            const imgData = canvasPage.toDataURL('image/png');
            
            if (position > 0) doc.addPage();
            doc.addImage(imgData, 'PNG', 0, margin, imgWidth, (canvasPage.height * imgWidth) / canvas.width, undefined, 'FAST');
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Halaman ${pageCount}`, imgWidth - 20, pageHeight - 5);
            
            position += maxHeight;
            pageCount++;
        }

        doc.save(`Laporan_Karya_Bakti_Kilensari_${new Date().getTime()}.pdf`);
        hideLoading();
        closePdfPreview();
        alert('PDF berhasil diunduh!');
    } catch (err) {
        console.error('PDF Error:', err);
        hideLoading();
        alert('Gagal mengunduh PDF. Silakan coba lagi.');
    }
}

// ========= EVENT LISTENERS =========
document.addEventListener('DOMContentLoaded', function() {
    const selectEl = document.getElementById('selectNamaPelapor');
    if (selectEl) {
        populateSelectNama();
        initDropdownListener();
    }
});

document.getElementById('passwordToggle').addEventListener('click', togglePasswordVisibility);
document.getElementById('securityCodeInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') verifySecurityCode(); });
document.getElementById('pdfAuthModal').addEventListener('click', function(e) { if (e.target === this) closePdfAuthModal(); });
document.getElementById('securityCodeInput').addEventListener('input', function(e) { this.value = this.value.replace(/[^0-9]/g, ''); });
document.getElementById('pdfDataFormModal').addEventListener('click', function(e) { if (e.target === this) closePdfDataFormModal(); });
document.getElementById('pdfPreviewModal').addEventListener('click', function(e) { if (e.target === this) closePdfPreview(); });

// ========= EXPOSE FUNCTIONS KE GLOBAL =========
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.shareToWhatsApp = shareToWhatsApp;
window.copyLink = copyLink;
window.openPdfAuthModal = openPdfAuthModal;
window.closePdfAuthModal = closePdfAuthModal;
window.verifySecurityCode = verifySecurityCode;
window.togglePasswordVisibility = togglePasswordVisibility;
window.openPdfDataFormModal = openPdfDataFormModal;
window.closePdfDataFormModal = closePdfDataFormModal;
window.submitPdfDataForm = submitPdfDataForm;
window.toggleEditPreview = toggleEditPreview;
window.downloadPDF = downloadPDF;
window.closePdfPreview = closePdfPreview;
window.openPdfPreview = openPdfPreview;
window.generatePDFReport = generatePDFReport;

console.log("Kode hari ini:", generateSecurityCode());
console.log("QR Code akan berisi URL:", REPORT_URL);
