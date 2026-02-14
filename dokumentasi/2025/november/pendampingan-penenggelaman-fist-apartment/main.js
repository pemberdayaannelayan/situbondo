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
const REPORT_URL = 'https://dinasperikanansitubondo.com/dokumentasi/2025/november/penenggelaman-modul-rumah-ikan/';
let currentPaperSize = 'A4';
let historyStack = [], historyIndex = -1;
const MAX_HISTORY = 20;

// ========= FUNGSI UTAMA =========
function saveState() {
    const preview = document.getElementById('pdfPreviewContent');
    if (!preview) return;
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(preview.innerHTML);
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    historyIndex = historyStack.length - 1;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        document.getElementById('pdfPreviewContent').innerHTML = historyStack[historyIndex];
    }
}

function redo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        document.getElementById('pdfPreviewContent').innerHTML = historyStack[historyIndex];
    }
}

function execEditCommand(cmd, val) {
    document.execCommand(cmd, false, val);
    saveState();
}

function setFontSize(s) {
    execEditCommand('fontSize', s);
}

function setFontFamily(f) {
    execEditCommand('fontName', f);
}

function setFontColor(c) {
    execEditCommand('foreColor', c);
}

function setLineHeight(h) {
    document.execCommand('lineHeight', false, h);
    saveState();
}

function toggleEditPreview() {
    const preview = document.getElementById('pdfPreviewContent');
    const btn = document.getElementById('btnEditPreview');
    isEditMode = !isEditMode;
    if (isEditMode) {
        preview.contentEditable = true;
        preview.classList.add('editing-mode');
        btn.innerHTML = '<i class="fas fa-save"></i> Selesai Edit';
        document.getElementById('pdfEditToolbar').classList.add('show');
    } else {
        preview.contentEditable = false;
        preview.classList.remove('editing-mode');
        btn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        document.getElementById('pdfEditToolbar').classList.remove('show');
    }
}

function closeAudioPlayer() {
    document.getElementById('audioPlayerContainer').style.display = 'none';
    document.getElementById('audioPlayer').pause();
}

function generateSecurityCode() {
    const now = new Date();
    return String(now.getDate()).padStart(2,'0') + String(now.getMonth()+1).padStart(2,'0') + now.getFullYear();
}

function openPdfAuthModal() {
    document.getElementById('pdfAuthModal').style.display = 'flex';
}

function closePdfAuthModal() {
    document.getElementById('pdfAuthModal').style.display = 'none';
    document.getElementById('securityCodeInput').value = '';
    document.getElementById('errorMessage').style.display = 'none';
}

function verifySecurityCode() {
    const code = document.getElementById('securityCodeInput').value;
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const attemptsSpan = document.getElementById('attemptsLeft');
    
    if (lockoutTime > Date.now()) {
        errorText.innerText = 'Terlalu banyak percobaan. Coba lagi nanti.';
        errorMsg.style.display = 'block';
        return;
    }

    if (code === generateSecurityCode()) {
        closePdfAuthModal();
        openPdfDataFormModal();
    } else {
        currentAttempts++;
        const left = maxAttempts - currentAttempts;
        attemptsSpan.innerText = left;
        errorText.innerText = `Kode salah. Sisa percobaan: ${left}`;
        errorMsg.style.display = 'block';
        
        if (currentAttempts >= maxAttempts) {
            lockoutTime = Date.now() + lockoutDuration;
            errorText.innerText = 'Anda telah mencapai batas percobaan. Silakan coba lagi setelah 5 menit.';
            attemptsSpan.innerText = '0';
        }
    }
}

function openPdfDataFormModal() {
    document.getElementById('pdfDataFormModal').style.display = 'flex';
    // Generate random captcha (simple addition)
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    captchaResult = a + b;
    document.getElementById('captchaQuestion').innerText = `${a} + ${b} = ?`;
}

function closePdfDataFormModal() {
    document.getElementById('pdfDataFormModal').style.display = 'none';
    document.getElementById('pdfDataForm').reset();
    document.getElementById('captchaError').style.display = 'none';
}

function submitPdfDataForm() {
    const nama = document.getElementById('namaPelapor').value.trim();
    const nip = document.getElementById('nipPelapor').value.trim();
    const captcha = document.getElementById('captchaInput').value.trim();
    const agreement = document.getElementById('agreementCheck').checked;

    // Validasi
    if (!nama || !nip || !captcha || !agreement) {
        alert('Harap isi semua field dan centang persetujuan.');
        return;
    }

    if (nip.length !== 18 || !/^\d+$/.test(nip)) {
        alert('NIP harus 18 digit angka.');
        return;
    }

    if (parseInt(captcha) !== captchaResult) {
        document.getElementById('captchaError').style.display = 'block';
        return;
    }

    document.getElementById('captchaError').style.display = 'none';
    closePdfDataFormModal();
    generatePDFReport(nama, nip);
}

function generatePDFReport(namaPelapor, nipPelapor) {
    showLoading();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const docId = 'RIF-' + Math.random().toString(36).substring(2,10).toUpperCase();
    const titleDisplay = 'PENENGGELAMAN MODUL RUMAH IKAN SITUBONDO';

    const kopSuratHTML = `<div style="margin-bottom:30px;text-align:center;"><img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/kop-surat-resmi-dinas-peternakan-perikanan-situbondo.png" style="width:100%;max-width:100%;height:auto;"></div>`;

    const pdfContent = `
    <div style="font-family:'Times New Roman', Times, serif; line-height:1.5; color:#333;">
        ${kopSuratHTML}
        <div style="text-align:center; margin-bottom:25px;">
            <h3 style="font-size:14px; font-weight:bold;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size:16px; font-weight:bold; text-decoration:underline; color:#1e3a8a;">${titleDisplay}</h1>
        </div>
        <div style="margin-bottom:20px;">
            <h4 style="font-size:13px; font-weight:bold; color:#1e3a8a; border-bottom:1px solid #ccc;">I. DASAR PELAKSANAAN</h4>
            <p style="text-align:justify; text-indent:30px;">Kegiatan ini dilaksanakan berdasarkan program konservasi Dinas Kelautan dan Perikanan Provinsi Jawa Timur dan Dinas Peternakan dan Perikanan Kabupaten Situbondo dalam rangka pelestarian ekosistem laut melalui penenggelaman modul rumah ikan (artificial reef).</p>
            
            <h4 style="font-size:13px; font-weight:bold; color:#1e3a8a; border-bottom:1px solid #ccc;">II. WAKTU DAN TEMPAT</h4>
            <ul><li>Hari/Tanggal : Kamis, 20 November 2025 (Pasir Putih) & Rabu, 26 November 2025 (Kalianget)</li>
            <li>Lokasi : Desa Pasir Putih (Kec. Bungatan) dan Desa Kalianget (Kec. Banyuglugur)</li></ul>
            
            <h4 style="font-size:13px; font-weight:bold; color:#1e3a8a; border-bottom:1px solid #ccc;">III. PERSONEL DAN MATERIIL</h4>
            <ul><li>DKP Provinsi Jatim : 15 personel</li><li>Disnakan Situbondo : 20 personel</li><li>Nelayan & Pokmaswas : 30 orang</li><li>Armada : 2 kapal nelayan, 1 speedboat pengawal</li></ul>
            
            <h4 style="font-size:13px; font-weight:bold; color:#1e3a8a; border-bottom:1px solid #ccc;">IV. HASIL KEGIATAN</h4>
            <p style="text-align:justify; text-indent:30px;">Telah ditenggelamkan sebanyak 15 unit modul rumah ikan pada kedalaman ±50 meter di dua lokasi. Proses berjalan aman dan lancar. Monitoring berkala akan dilakukan untuk mengevaluasi efektivitas rumah ikan sebagai habitat baru.</p>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:40px;">
            <div><p>Situbondo, ${formattedDate}<br>Pelapor,<br><br><span style="font-weight:bold;">${namaPelapor}</span><br>NIP. ${nipPelapor}</p></div>
            <div></div>
        </div>
        <div class="pdf-footer" style="margin-top:30px; border-top:1px solid #ddd; padding-top:15px; display:flex; justify-content:space-between;">
            <div style="font-size:10px;"><p>ID Verifikasi: ${docId} | Tanggal Cetak: ${formattedDate}</p></div>
            <div><canvas id="qrCodeCanvas" width="300" height="300" style="width:100px; height:100px;"></canvas><p style="font-size:8px;">Scan untuk akses daring</p></div>
        </div>
    </div>`;

    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
    drawQRCodeOnCanvas('qrCodeCanvas', REPORT_URL, 300);
    hideLoading();
    openPdfPreview();
}

function drawQRCodeOnCanvas(id, text, size) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (typeof qrcode !== 'undefined') {
        try {
            const qr = qrcode(0, 'H');
            qr.addData(text);
            qr.make();
            const mod = qr.getModuleCount();
            const cell = size / mod;
            for (let r=0; r<mod; r++) for (let c=0; c<mod; c++) {
                ctx.fillStyle = qr.isDark(r,c) ? '#1e3a8a' : '#fff';
                ctx.fillRect(c*cell, r*cell, cell, cell);
            }
        } catch(e) { console.error(e); }
    } else {
        ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0,0,size,size);
        ctx.fillStyle = '#1e3a8a'; ctx.font = 'bold 14px Arial'; ctx.fillText('QR Unavailable', 20, size/2);
    }
}

function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }
function openPdfPreview() { document.getElementById('pdfPreviewModal').style.display = 'flex'; }
function closePdfPreview() { document.getElementById('pdfPreviewModal').style.display = 'none'; }

function downloadPDF() {
    alert('Fungsi download PDF akan segera diaktifkan.');
}

// ========= SHARE =========
function openShareModal() { document.getElementById('shareModal').style.display = 'flex'; }
function closeShareModal() { document.getElementById('shareModal').style.display = 'none'; }

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Simak program konservasi rumah ikan di Situbondo:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => { 
        alert('Link disalin!'); 
        closeShareModal(); 
    });
}

// ========= WELCOME NOTIFICATION & AUDIO =========
function showWelcomeNotification() {
    if (sessionStorage.getItem('welcomeShown')) return;
    const notif = document.getElementById('welcomeNotification');
    if (!notif) return;
    notif.style.display = 'flex';
    document.getElementById('laterButton').onclick = function() {
        notif.style.display = 'none';
        sessionStorage.setItem('welcomeShown', 'true');
    };
    document.getElementById('playAudioButton').onclick = function() {
        notif.style.display = 'none';
        sessionStorage.setItem('welcomeShown', 'true');
        document.getElementById('audioPlayerContainer').style.display = 'block';
        document.getElementById('audioPlayer').play().catch(() => alert('Audio tidak dapat diputar.'));
    };
}

// ========= POPULATE DROPDOWN =========
function populateSelectNama() {
    const select = document.getElementById('selectNamaPelapor');
    if (!select) return;
    select.innerHTML = '<option value="" selected disabled>-- Pilih Nama --</option>';
    pegawaiList.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.nip;
        opt.textContent = p.nama;
        select.appendChild(opt);
    });
}

document.getElementById('selectNamaPelapor')?.addEventListener('change', function(e) {
    const nip = this.value;
    const peg = pegawaiList.find(p => p.nip === nip);
    if (peg) {
        document.getElementById('namaPelapor').value = peg.nama;
        document.getElementById('nipPelapor').value = peg.nip;
    }
});

// ========= INIT =========
document.addEventListener('DOMContentLoaded', function() {
    populateSelectNama();
    document.getElementById('passwordToggle')?.addEventListener('click', function() {
        const input = document.getElementById('securityCodeInput');
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    });
    showWelcomeNotification();
});

// Expose functions globally
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.shareToWhatsApp = shareToWhatsApp;
window.copyLink = copyLink;
window.openPdfAuthModal = openPdfAuthModal;
window.closePdfAuthModal = closePdfAuthModal;
window.verifySecurityCode = verifySecurityCode;
window.openPdfDataFormModal = openPdfDataFormModal;
window.closePdfDataFormModal = closePdfDataFormModal;
window.submitPdfDataForm = submitPdfDataForm;
window.toggleEditPreview = toggleEditPreview;
window.downloadPDF = downloadPDF;
window.closePdfPreview = closePdfPreview;
window.execEditCommand = execEditCommand;
window.setLineHeight = setLineHeight;
window.setFontSize = setFontSize;
window.setFontFamily = setFontFamily;
window.setFontColor = setFontColor;
window.undo = undo;
window.redo = redo;
window.closeAudioPlayer = closeAudioPlayer;
