// ===== main.js – Semua fungsi dan event handler =====
// TIDAK ADA PENGHAPUSAN FITUR, HANYA PENYEMPURNAAN

AOS.init({ duration: 800, once: true, offset: 100 });
document.getElementById('currentYear').textContent = new Date().getFullYear();

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
let maxAttempts = 3, currentAttempts = 0, lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000;

function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2,'0');
    const month = String(now.getMonth()+1).padStart(2,'0');
    const year = now.getFullYear();
    return day + month + year; // DDMMYYYY
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
        openPdfDataFormModal(); // BUKA FORM PELAPOR
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

// ========= FORM DATA PELAPOR =========
let captchaResult = 0;

function openPdfDataFormModal() {
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

    if (!nip || nip.length !== 18) {
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
function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }
function openPdfPreview() { document.getElementById('pdfPreviewModal').style.display = 'flex'; }
function closePdfPreview() { document.getElementById('pdfPreviewModal').style.display = 'none'; }

function generatePDFReport(namaPelapor, nipPelapor) {
    showLoading();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const kopSuratHTML = `
        <div style="margin-bottom: 30px; text-align: center;">
            <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/kop-surat-resmi-dinas-peternakan-perikanan-situbondo.png" 
                 alt="Kop Surat Dinas Peternakan dan Perikanan Situbondo" 
                 style="width: 100%; max-width: 100%; height: auto; display: block; margin: 0 auto;">
        </div>
    `;

    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333; padding: 20px;">
        ${kopSuratHTML}
        
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1e3a8a;">
                KARYA BAKTI BERSIH PANTAI DESA KILENSARI<br>DERMAGA LAMA PANARUKAN
            </h1>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:15px; color:#1e3a8a;">I. DASAR PELAKSANAAN</h4>
            <p style="text-align:justify; margin-bottom:20px; font-size:12px; text-indent:30px;">
                Surat Komando Distrik Militer 0823 Nomor <strong>B/99/II/2026</strong> tanggal 11 Februari 2026 perihal Permohonan Bantuan Personel, 
                sebagai tindak lanjut Instruksi Presiden RI pada Rakornas Pusat dan Daerah serta Telegram Danrem 083/Bdj Nomor ST/108/2026.
            </p>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:15px; color:#1e3a8a;">II. WAKTU DAN TEMPAT</h4>
            <ul style="font-size:12px; line-height:1.7;">
                <li>Hari/Tanggal : Kamis, 12 Februari 2026</li>
                <li>Waktu        : 06.00 WIB – selesai</li>
                <li>Tempat       : Dermaga Lama Panarukan, Desa Kilensari, Kecamatan Panarukan</li>
            </ul>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:15px; color:#1e3a8a;">III. PERSONEL DAN MATERIIL</h4>
            <ul style="font-size:12px; line-height:1.7;">
                <li>Dinas Peternakan & Perikanan : 20 personel + Kabid Pemberdayaan Nelayan</li>
                <li>Seluruh OPD Kab. Situbondo : masing-masing 20 personel (kecuali DLH 50, Dishub 10+5, Dinkes 20+tim)</li>
                <li>Alat yang digunakan : sapu lidi, cangkul, sabit, mesin rumput, kantong sampah, 5 unit truk (DLH), unit ambulan (Dinkes)</li>
            </ul>
            
            <h4 style="font-size:13px; font-weight:bold; margin-bottom:15px; color:#1e3a8a;">IV. HASIL KEGIATAN</h4>
            <p style="text-align:justify; font-size:12px; text-indent:30px;">
                Kegiatan berjalan lancar dan tertib. Kawasan Dermaga Lama Panarukan yang sebelumnya tampak kumuh dan dipenuhi sampah 
                serta rumput liar berhasil dibersihkan secara signifikan. Sinergi antara TNI, Polri, Pemerintah Daerah, dan masyarakat 
                terjalin dengan sangat baik. Dinas Peternakan dan Perikanan turut serta membersihkan area pendaratan ikan dan memberikan 
                edukasi singkat kepada nelayan sekitar.
            </p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 80px;">
            <div style="width: 60%;">
                <p style="margin-bottom:5px; font-size:12px;">Situbondo, ${formattedDate}</p>
                <p style="font-weight:bold; font-size:12px; margin-top:40px;">Pelapor,</p>
                <p style="margin-top:60px; font-size:12px; font-weight: bold;">${namaPelapor || '______________________'}</p>
                <p style="font-size:11px; color: #555;">NIP. ${nipPelapor || '______________________'}</p>
                <p style="margin-top:5px; font-size:12px;">Kepala Bidang Pemberdayaan Nelayan</p>
            </div>
            <div style="width: 35%; text-align: right;">
                <div style="background:white; padding:5px; border-radius:4px; box-shadow:0 2px 5px rgba(0,0,0,0.1); float:right;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e3a8a&bgcolor=ffffff" 
                         alt="QR Code" style="width:70px; height:70px;">
                </div>
                <p style="font-size:9px; margin-top:5px; clear:both; text-align:right;">Scan untuk akses laporan</p>
            </div>
        </div>
        <div style="margin-top:100px; border-top:1px solid #ddd; padding-top:15px;">
            <div style="text-align:left; font-size:10px; color:#666;">
                <p>Laporan resmi Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                <p>© ${currentDate.getFullYear()} – Dokumentasi Karya Bakti Kodim 0823</p>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
    hideLoading();
    openPdfPreview();
}

// ========= DOWNLOAD PDF =========
async function downloadPDF() {
    showLoading();
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const element = document.getElementById('pdfPreviewContent');
        if (!element) throw new Error('Preview tidak ditemukan');
        const canvas = await html2canvas(element, { scale: 2, logging: false, useCORS: true, allowTaint: false });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        doc.save(`Laporan_Karya_Bakti_Panarukan_${new Date().getTime()}.pdf`);
        hideLoading();
        closePdfPreview();
        alert('PDF berhasil diunduh!');
    } catch (err) {
        console.error(err);
        hideLoading();
        alert('Gagal mengunduh PDF. Silakan coba lagi.');
    }
}

// ========= EVENT LISTENERS =========
document.getElementById('passwordToggle').addEventListener('click', togglePasswordVisibility);
document.getElementById('securityCodeInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') verifySecurityCode(); });
document.getElementById('pdfAuthModal').addEventListener('click', function(e) { if (e.target === this) closePdfAuthModal(); });
document.getElementById('securityCodeInput').addEventListener('input', function(e) { this.value = this.value.replace(/[^0-9]/g, ''); });
document.getElementById('pdfDataFormModal').addEventListener('click', function(e) { if (e.target === this) closePdfDataFormModal(); });
document.getElementById('pdfPreviewModal').addEventListener('click', function(e) { if (e.target === this) closePdfPreview(); });

console.log("Kode hari ini:", generateSecurityCode());
