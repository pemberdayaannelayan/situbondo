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
const REPORT_URL = window.location.href; // Gunakan URL halaman saat ini
let currentPaperSize = 'A4';
let currentZoom = 100;
let currentDocId = '';
let currentReportTitle = '';

// ========= UNDO / REDO HISTORY =========
let historyStack = [];
let historyIndex = -1;
const MAX_HISTORY = 20;

function saveState() {
    if (!isEditMode) return;
    const previewDiv = document.getElementById('pdfPreviewContent');
    if (!previewDiv) return;
    const state = previewDiv.innerHTML;
    if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, historyIndex + 1);
    }
    historyStack.push(state);
    if (historyStack.length > MAX_HISTORY) {
        historyStack.shift();
    } else {
        historyIndex++;
    }
}

function undo() {
    if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(historyIndex);
    } else {
        alert('Tidak ada yang dapat di-undo.');
    }
}

function redo() {
    if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        restoreState(historyIndex);
    } else {
        alert('Tidak ada yang dapat di-redo.');
    }
}

function restoreState(index) {
    const previewDiv = document.getElementById('pdfPreviewContent');
    previewDiv.innerHTML = historyStack[index];
    drawQRCodeOnCanvas('qrCodeCanvas', REPORT_URL, 300);
    protectQRCode();
}

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
    const text = encodeURIComponent('Dinas Perikanan Situbondo salurkan bantuan sosial korban banjir Besuki. Simak selengkapnya:');
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

// ========= QR CODE CANVAS DRAW =========
function drawQRCodeOnCanvas(canvasElementOrId, text, size = 300) {
    let canvas;
    if (typeof canvasElementOrId === 'string') {
        canvas = document.getElementById(canvasElementOrId);
        if (!canvas) return false;
    } else {
        canvas = canvasElementOrId;
    }
    
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const qrlib = (typeof qrcode !== 'undefined') ? qrcode : (window.qrcode || null);
    
    if (!qrlib || typeof qrlib !== 'function') {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold ' + (size/20) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('QR Unavailable', size/2, size/2 - 10);
        ctx.font = (size/30) + 'px Arial';
        ctx.fillText(text.substring(0, 22) + '...', size/2, size/2 + 15);
        return false;
    }
    
    try {
        const qr = qrlib(0, 'H');
        qr.addData(text);
        qr.make();
        const moduleCount = qr.getModuleCount();
        const cellSize = size / moduleCount;
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                ctx.fillStyle = qr.isDark(row, col) ? '#1e3a8a' : '#ffffff';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
        return true;
    } catch (e) {
        console.error('QR Code error:', e);
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold ' + (size/20) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Error', size/2, size/2);
        return false;
    }
}

// ========= GENERATE ID DOKUMEN UNIK =========
function generateDocumentId() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BSB-${day}${month}${year}-${random}`;
}

// ========= LOADING OVERLAY =========
function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }

// ========= MODAL PREVIEW =========
function openPdfPreview() { 
    document.getElementById('pdfPreviewModal').style.display = 'flex'; 
    initEditControls();
    protectQRCode();
    if (historyStack.length === 0) {
        saveState();
    }
}
function closePdfPreview() { 
    document.getElementById('pdfPreviewModal').style.display = 'none';
    if (isEditMode) toggleEditPreview();
}

// ========= FITUR EDIT PREVIEW =========
function toggleEditPreview() {
    const previewDiv = document.getElementById('pdfPreviewContent');
    const btnEdit = document.getElementById('btnEditPreview');
    const toolbar = document.getElementById('pdfEditToolbar');
    if (!previewDiv || !btnEdit || !toolbar) return;
    
    isEditMode = !isEditMode;
    
    if (isEditMode) {
        previewDiv.contentEditable = "true";
        previewDiv.classList.add('editing-mode');
        previewDiv.focus();
        
        btnEdit.innerHTML = '<i class="fas fa-lock me-2"></i>Selesai Edit';
        btnEdit.classList.add('btn-success');
        
        toolbar.classList.add('show');
        protectQRCode();
        
        historyStack = [];
        historyIndex = -1;
        saveState();
    } else {
        previewDiv.contentEditable = "false";
        previewDiv.classList.remove('editing-mode');
        
        btnEdit.innerHTML = '<i class="fas fa-pencil-alt me-2"></i>Edit';
        btnEdit.classList.remove('btn-success');
        
        toolbar.classList.remove('show');
    }
}

function execEditCommand(command, value = null) {
    if (!isEditMode) {
        alert('Aktifkan mode edit terlebih dahulu.');
        return;
    }
    const previewDiv = document.getElementById('pdfPreviewContent');
    previewDiv.focus();
    document.execCommand(command, false, value);
    saveState();
}

function setFontSize(size) {
    if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
    applyStyleToSelection('fontSize', size + 'px');
}

function setFontFamily(family) {
    if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
    applyStyleToSelection('fontFamily', family);
}

function setFontColor(color) {
    if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
    applyStyleToSelection('color', color);
}

function setLineHeight(value) {
    if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
    applyStyleToSelection('lineHeight', value);
}

function applyStyleToSelection(styleProp, value) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        alert('Silakan pilih teks terlebih dahulu.');
        return;
    }
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
        alert('Silakan pilih teks terlebih dahulu.');
        return;
    }
    
    const previewDiv = document.getElementById('pdfPreviewContent');
    if (!previewDiv.contains(range.commonAncestorContainer)) {
        alert('Pilihan teks harus berada di dalam area preview.');
        return;
    }
    
    const span = document.createElement('span');
    span.style[styleProp] = value;
    
    try {
        range.surroundContents(span);
    } catch (e) {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
    }
    
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
    
    saveState();
}

// ========= PAPER SIZE =========
function initEditControls() {
    const paperSelect = document.getElementById('paperSizeSelect');
    const previewDiv = document.getElementById('pdfPreviewContent');
    
    if (paperSelect) {
        paperSelect.value = currentPaperSize;
        paperSelect.onchange = function() {
            currentPaperSize = this.value;
            let width = '210mm';
            if (currentPaperSize === 'Letter') width = '216mm';
            else if (currentPaperSize === 'Legal') width = '216mm';
            previewDiv.style.width = width;
            saveState();
        };
    }
}

// ========= PERLINDUNGAN QR CODE =========
function protectQRCode() {
    const previewDiv = document.getElementById('pdfPreviewContent');
    if (!previewDiv) return;
    const qrCanvas = previewDiv.querySelector('#qrCodeCanvas');
    if (qrCanvas) {
        qrCanvas.setAttribute('contenteditable', 'false');
        qrCanvas.removeAttribute('draggable');
    }
    const footers = previewDiv.querySelectorAll('.pdf-footer');
    footers.forEach(el => {
        el.setAttribute('contenteditable', 'false');
    });
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

// ========= GENERATE PDF REPORT =========
function generatePDFReport(namaPelapor, nipPelapor) {
    showLoading();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const docId = generateDocumentId();
    currentDocId = docId;

    const titleElement = document.getElementById('reportTitle');
    let rawTitle = titleElement ? titleElement.innerText.trim() : "PENYALURAN BANTUAN SOSIAL KORBAN BANJIR BESUKI";
    const displayTitle = rawTitle.toUpperCase();
    currentReportTitle = rawTitle.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

    const kopSuratHTML = `
        <div style="margin-bottom: 30px; text-align: center;">
            <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/kop-surat-resmi-dinas-peternakan-perikanan-situbondo.png" 
                 alt="Kop Surat Dinas Perikanan Situbondo" 
                 style="width: 100%; max-width: 100%; height: auto; display: block; margin: 0 auto;"
                 crossorigin="anonymous">
        </div>
    `;

    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: #333; padding: 0; display: flex; flex-direction: column; min-height: 100%;">
        ${kopSuratHTML}
        
        <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold; text-transform: uppercase;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1e3a8a; margin-bottom: 5px;">
                ${displayTitle}
            </h1>
            <h2 style="font-size: 15px; font-weight: bold; color: #1e3a8a; margin-top: 0;">BESUKI, SITUBONDO</h2>
        </div>
        
        <div style="margin-bottom: 25px; flex: 1;">
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">I. DASAR PELAKSANAAN</h4>
            <p style="text-align:justify; margin-bottom:15px; font-size:12px; text-indent:30px;">
                Kegiatan penyaluran bantuan sosial ini merupakan bentuk kepedulian dan solidaritas Dinas Perikanan Situbondo terhadap masyarakat yang terdampak bencana banjir bandang di wilayah Besuki. Kegiatan dilaksanakan secara langsung di dapur umum penanggulangan bencana yang bekerja sama dengan DINSOS Kabupaten Situbondo.
            </p>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">II. WAKTU DAN TEMPAT</h4>
            <ul style="font-size:12px; line-height:1.6; padding-left: 20px;">
                <li>Hari/Tanggal : Senin, 26 Januari 2026</li>
                <li>Waktu        : 08.00 WIB – selesai</li>
                <li>Tempat       : Wilayah Besuki, Kabupaten Situbondo (dapur umum dan door to door)</li>
            </ul>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">III. PERSONEL DAN MATERIIL</h4>
            <ul style="font-size:12px; line-height:1.6; padding-left: 20px;">
                <li>Dinas Perikanan Situbondo : dipimpin Kabid Pemberdayaan Nelayan, Sugeng Purwo Priyanto, S.E., M.M. beserta staf.</li>
                <li>DINSOS Kab. Situbondo : tim pendamping dan koordinator lapangan.</li>
                <li>Jenis bantuan : Ikan tawar segar, mie instan, telur ayam, pakaian layak pakai, dan bahan pokok tambahan.</li>
            </ul>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:10px; color:#1e3a8a; border-bottom: 1px solid #ccc; padding-bottom: 5px;">IV. HASIL KEGIATAN</h4>
            <p style="text-align:justify; font-size:12px; text-indent:30px; margin-bottom:15px;">
                Kegiatan berjalan lancar dan tertib. Bantuan disalurkan melalui dapur umum dan sistem door to door kepada warga terdampak banjir di wilayah Besuki. Sinergi antara Dinas Perikanan, DINSOS, dan masyarakat terjalin dengan sangat baik. Kepala Bidang Pemberdayaan Nelayan menyampaikan bahwa bantuan ini merupakan wujud nyata kepedulian keluarga besar Dinas Perikanan Situbondo terhadap sesama.
            </p>
            <p style="text-align:justify; font-size:12px; text-indent:30px;">
                Perwakilan DINSOS Situbondo mengapresiasi kontribusi nyata Dinas Perikanan dalam penanganan pasca bencana. Kerja sama antar instansi seperti ini sangat penting untuk mempercepat proses pemulihan masyarakat terdampak.
            </p>
        </div>
        
        <!-- TANDA TANGAN PELAPOR (KIRI) -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;">
            <div style="width: 60%;">
                <p style="margin-bottom:5px; font-size:12px;">Situbondo, ${formattedDate}</p>
                <p style="font-weight:bold; font-size:12px; margin-top:20px;">Pelapor,</p>
                <p style="margin-top:40px; font-size:12px; font-weight: bold;">${namaPelapor || '______________________'}</p>
                <p style="font-size:11px; color: #555;">NIP. ${nipPelapor || '______________________'}</p>
            </div>
            <div style="width: 35%;"></div>
        </div>
        
        <!-- FOOTER DENGAN QR CODE -->
        <div class="pdf-footer" style="margin-top: 30px; border-top:1px solid #ddd; padding-top:15px; display: flex; justify-content: space-between; align-items: center;">
            <div style="text-align:left; font-size:10px; color:#666;">
                <p><strong>Dokumen ini dicetak secara elektronik dan merupakan dokumen resmi.</strong></p>
                <p>ID Verifikasi: ${docId} | Tanggal Cetak: ${formattedDate}</p>
                <p>© ${currentDate.getFullYear()} – Dinas Perikanan Kabupaten Situbondo</p>
            </div>
            <div style="text-align:right;">
                <canvas id="qrCodeCanvas" width="300" height="300" style="width:100px; height:100px; display:block; margin-bottom:5px;"></canvas>
                <p style="font-size:8px; margin:0;">Scan untuk akses laporan daring</p>
                <p style="font-size:7px; color:#999; margin-top:2px;">${REPORT_URL}</p>
            </div>
        </div>
    </div>
    `;
    
    const previewDiv = document.getElementById('pdfPreviewContent');
    previewDiv.innerHTML = pdfContent;
    
    drawQRCodeOnCanvas('qrCodeCanvas', REPORT_URL, 300);
    
    let width = '210mm';
    if (currentPaperSize === 'Letter') width = '216mm';
    else if (currentPaperSize === 'Legal') width = '216mm';
    previewDiv.style.width = width;
    
    if (isEditMode) {
        toggleEditPreview();
    }
    hideLoading();
    openPdfPreview();
}

// ========= DOWNLOAD PDF =========
async function downloadPDF() {
    showLoading();
    try {
        const { jsPDF } = window.jspdf;
        let format = 'a4';
        if (currentPaperSize === 'Letter') format = 'letter';
        else if (currentPaperSize === 'Legal') format = 'legal';
        
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: format
        });

        const element = document.getElementById('pdfPreviewContent');
        if (!element) throw new Error('Preview tidak ditemukan');

        const originalWidth = element.style.width;
        const originalPadding = element.style.padding;
        const originalBg = element.style.backgroundColor;
        const originalTransform = element.style.transform;
        
        if (format === 'a4') element.style.width = '210mm';
        else if (format === 'letter') element.style.width = '216mm';
        else if (format === 'legal') element.style.width = '216mm';
        element.style.padding = '10mm';
        element.style.backgroundColor = 'white';
        element.style.transform = 'scale(1)';
        
        const images = element.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }));

        await new Promise(resolve => setTimeout(resolve, 300));

        const canvas = await html2canvas(element, {
            scale: 3,
            logging: false,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
        });

        element.style.width = originalWidth;
        element.style.padding = originalPadding;
        element.style.backgroundColor = originalBg;
        element.style.transform = originalTransform;

        const imgWidth = format === 'a4' ? 210 : 216;
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

        const fileName = `LAPORAN_${currentReportTitle}_${currentDocId}.pdf`;
        doc.save(fileName);
        hideLoading();
        closePdfPreview();
        alert('PDF berhasil diunduh!');
    } catch (err) {
        console.error('PDF Error:', err);
        hideLoading();
        alert('Gagal mengunduh PDF. Silakan coba lagi.');
    }
}

// ========= NOTIFIKASI AWAL (AUDIO) =========
function showWelcomeNotification() {
    if (sessionStorage.getItem('welcomeShown')) return;
    
    const notif = document.getElementById('welcomeNotification');
    if (!notif) return;
    
    notif.style.display = 'flex';
    
    document.getElementById('laterButton').addEventListener('click', function() {
        notif.style.display = 'none';
        sessionStorage.setItem('welcomeShown', 'true');
    });
    
    document.getElementById('playAudioButton').addEventListener('click', function() {
        notif.style.display = 'none';
        sessionStorage.setItem('welcomeShown', 'true');
        
        const audioContainer = document.getElementById('audioPlayerContainer');
        const audio = document.getElementById('audioPlayer');
        if (audioContainer && audio) {
            audioContainer.style.display = 'block';
            audio.play().catch(error => {
                console.warn('Gagal memutar audio:', error);
                alert('Maaf, audio tidak dapat diputar. Mungkin terjadi masalah jaringan atau format tidak didukung.');
            });
        }
    });
}

// ========= CLOSE AUDIO PLAYER =========
function closeAudioPlayer() {
    const container = document.getElementById('audioPlayerContainer');
    const audio = document.getElementById('audioPlayer');
    if (container) {
        container.style.display = 'none';
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

// ========= EVENT LISTENERS =========
document.addEventListener('DOMContentLoaded', function() {
    const selectEl = document.getElementById('selectNamaPelapor');
    if (selectEl) {
        populateSelectNama();
        initDropdownListener();
    }
    const pwToggle = document.getElementById('passwordToggle');
    if (pwToggle) pwToggle.addEventListener('click', togglePasswordVisibility);
    
    const codeInput = document.getElementById('securityCodeInput');
    if (codeInput) {
        codeInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') verifySecurityCode(); });
        codeInput.addEventListener('input', function(e) { this.value = this.value.replace(/[^0-9]/g, ''); });
    }
    
    document.getElementById('pdfAuthModal')?.addEventListener('click', function(e) { if (e.target === this) closePdfAuthModal(); });
    document.getElementById('pdfDataFormModal')?.addEventListener('click', function(e) { if (e.target === this) closePdfDataFormModal(); });
    document.getElementById('pdfPreviewModal')?.addEventListener('click', function(e) { if (e.target === this) closePdfPreview(); });
    
    showWelcomeNotification();
});

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
window.execEditCommand = execEditCommand;
window.setLineHeight = setLineHeight;
window.setFontSize = setFontSize;
window.setFontFamily = setFontFamily;
window.setFontColor = setFontColor;
window.undo = undo;
window.redo = redo;
window.closeAudioPlayer = closeAudioPlayer;

console.log("Kode hari ini:", generateSecurityCode());
console.log("QR Code akan berisi URL:", REPORT_URL);
