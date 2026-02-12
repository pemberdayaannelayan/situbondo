// ==================== GLOBAL FUNCTIONS (for inline event handlers) ====================

// PDF Authorization System
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes

// Generate security code based on DDMMYYYY
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year;
}

// Check if user is locked out
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

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('securityCodeInput');
    const toggleIcon = document.querySelector('#passwordToggle i');
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    toggleIcon.className = isVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// Open PDF authorization modal
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

// Close PDF authorization modal
function closePdfAuthModal() {
    document.getElementById('pdfAuthModal').style.display = 'none';
}

// Verify security code
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

// Loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// PDF Preview
function openPdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'flex';
}
function closePdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'none';
}

// Generate PDF report (preview)
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
                        <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1e5631;">DINAS PETERNAKAN DAN PERIKANAN</h1>
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
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1e5631; line-height: 1.4;">
                PEMUSNAHAN IKAN ALIGATOR INVASIF (Atractosteus spatula)<br>
                DI DINAS PETERNAKAN DAN PERIKANAN SITUBONDO
            </h1>
        </div>
        
        <!-- Isi Laporan (ringkas) -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">I. LATAR BELAKANG</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Berdasarkan laporan masyarakat Situbondo yang menemukan keberadaan ikan aligator (Atractosteus spatula) di perairan lokal, Dinas Peternakan dan Perikanan Situbondo melalui Bidang Pemberdayaan Nelayan segera melakukan respons dengan melaksanakan kegiatan pemusnahan pada tanggal 5 Februari 2026. Tindakan ini dipimpin langsung oleh Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf, dengan pendampingan dari KRISTIAN HADI SURYA S, S.Pi sebagai Pengawas Perikanan dan Penyuluh Perikanan sesuai Surat Tugas dari Kepala Pangkalan Pengawasan Sumber Daya Kelautan dan Perikanan Beno Nomor: B. 239/PSDKPLan.4/KP.440/II/2026.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">II. DASAR HUKUM</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li>Undang-Undang Nomor 31 Tahun 2004 tentang Perikanan</li>
                <li>Peraturan Menteri Kelautan dan Perikanan Nomor 41/PERMEN-KP/2014</li>
                <li>Peraturan Pemerintah Nomor 60 Tahun 2007</li>
                <li>Keputusan Menteri Kelautan dan Perikanan tentang Jenis Ikan yang Dilarang</li>
                <li>Surat Tugas Nomor: B. 239/PSDKPLan.4/KP.440/II/2026</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">III. PELAKSANA KEGIATAN</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li><strong>Penanggung Jawab:</strong> SUGENG PURWO PRIYANTO, S.E., M.M.</li>
                <li><strong>Pendamping:</strong> KRISTIAN HADI SURYA S, S.Pi</li>
                <li><strong>Pelaksana:</strong> Staf Bidang Pemberdayaan Nelayan</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">IV. PROSEDUR PEMUSNAHAN</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li>Identifikasi dan verifikasi jenis ikan</li>
                <li>Dokumentasi visual</li>
                <li>Proses pemusnahan dengan metode manusiawi</li>
                <li>Penguburan bangkai secara aman dan higienis</li>
                <li>Penyusunan laporan resmi</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">V. HASIL KEGIATAN</h4>
            <p style="text-align: justify; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan pemusnahan ikan aligator invasif telah dilaksanakan dengan lancar sesuai prosedur. Pemusnahan ini merupakan bagian dari upaya preventif untuk mencegah penyebaran spesies invasif di perairan Situbondo. Dinas Peternakan dan Perikanan Situbondo mengimbau masyarakat untuk melaporkan jika menemukan spesies asing invasif.
            </p>
        </div>
        
        <!-- Tanda Tangan -->
        <div style="display: flex; justify-content: space-between; margin-top: 80px;">
            <div style="width: 60%;">
                <p style="font-size: 12px;">Situbondo, ${formattedDate}</p>
                <p style="font-weight: bold; font-size: 12px; margin-top: 40px;">Pelapor,</p>
            </div>
            <div style="width: 35%;"></div>
        </div>
        
        <!-- Footer QR -->
        <div style="margin-top: 100px; border-top: 1px solid #ddd; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 10px; color: #666;">
                    <p>Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo</p>
                    <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                </div>
                <div style="text-align: right;">
                    <div class="qr-code" style="background: #fff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e5631&bgcolor=ffffff" 
                             alt="QR Code" style="width: 70px; height: 70px;">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666;">Scan untuk mengakses sumber laporan</p>
                </div>
            </div>
        </div>
    </div>
    `;

    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
    hideLoading();
    openPdfPreview();
}

// Download PDF using jsPDF
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

        // Logo (fallback jika gagal)
        const logoWidth = 18;
        const logoHeight = 18;
        const placeholderLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFjSURBVHgB7d2xTQNBEIXhsfAFARIgQzKgTToYAjg3j6JXODcPwdJgOSc/9Vx3/oPnOe6OnnH0l93Tsz+e3/kv3pnvxAAQIIAAIgwggAgDiCCAAAIIIICAIIAAAggggAACCCDAABBAgAEggAADQAABBoAAAggggAACCCCAABBAgAEggAACCAgCCCAgCCCAgCCAAAKCAAIICAIICDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQygT+3b89J+PF+c7T37S/tX53vP3nLq2X09r+f7cua+/V7PW5/ZZ1/L6fXc1/Nx/Bj7O8/HXyIABBBCABnQEcTAACgYgAADQAABBBgAAggwAAQQYAATfLZXKSDj7SwAAAAASUVORK5CYII=';

        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = () => {
                    logoImg.src = placeholderLogo;
                    resolve();
                };
                logoImg.src = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png';
            });
            doc.addImage(logoImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        } catch (e) {
            const placeholderImg = new Image();
            placeholderImg.src = placeholderLogo;
            await new Promise(resolve => { placeholderImg.onload = resolve; });
            doc.addImage(placeholderImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        }

        // Header text
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

        // Title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN KEGIATAN", 105, yPos, { align: 'center' });
        yPos += 10;
        doc.setFontSize(14);
        const title1 = "PEMUSNAHAN IKAN ALIGATOR INVASIF (Atractosteus spatula)";
        const title2 = "DI DINAS PETERNAKAN DAN PERIKANAN SITUBONDO";
        doc.text(title1, 105, yPos, { align: 'center' });
        yPos += 7;
        doc.text(title2, 105, yPos, { align: 'center' });
        yPos += 15;

        // Helper to add sections
        function addText(title, content, isList = false, isNumberedList = false) {
            if (yPos > 270) {
                doc.addPage();
                yPos = margin;
            }
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(title, margin, yPos);
            yPos += 8;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            if (isList) {
                const items = content.split('\n');
                items.forEach((item, index) => {
                    if (yPos > 270) { doc.addPage(); yPos = margin + 8; }
                    const lines = doc.splitTextToSize(item, 160);
                    lines.forEach((line, lineIndex) => {
                        if (lineIndex === 0) {
                            if (isNumberedList) doc.text(`${index + 1}. ${line}`, margin + 5, yPos);
                            else doc.text(`• ${line}`, margin + 5, yPos);
                        } else {
                            doc.text(line, margin + 10, yPos);
                        }
                        yPos += 6;
                    });
                });
            } else {
                const lines = doc.splitTextToSize(content, 170);
                lines.forEach(line => {
                    if (yPos > 270) { doc.addPage(); yPos = margin + 8; }
                    doc.text(line, margin, yPos);
                    yPos += 6;
                });
            }
            yPos += 8;
        }

        addText("I. LATAR BELAKANG", 
            "Berdasarkan laporan masyarakat Situbondo yang menemukan keberadaan ikan aligator (Atractosteus spatula) di perairan lokal, Dinas Peternakan dan Perikanan Situbondo melalui Bidang Pemberdayaan Nelayan segera melakukan respons dengan melaksanakan kegiatan pemusnahan pada tanggal 5 Februari 2026. Tindakan ini dipimpin langsung oleh Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf, dengan pendampingan dari KRISTIAN HADI SURYA S, S.Pi sebagai Pengawas Perikanan dan Penyuluh Perikanan sesuai Surat Tugas dari Kepala Pangkalan Pengawasan Sumber Daya Kelautan dan Perikanan Beno Nomor: B. 239/PSDKPLan.4/KP.440/II/2026.");

        addText("II. DASAR HUKUM", 
            "Undang-Undang Nomor 31 Tahun 2004 tentang Perikanan\nPeraturan Menteri Kelautan dan Perikanan Nomor 41/PERMEN-KP/2014\nPeraturan Pemerintah Nomor 60 Tahun 2007\nKeputusan Menteri Kelautan dan Perikanan tentang Jenis Ikan yang Dilarang\nSurat Tugas Nomor: B. 239/PSDKPLan.4/KP.440/II/2026", true, true);

        addText("III. PELAKSANA KEGIATAN", 
            "Penanggung Jawab: SUGENG PURWO PRIYANTO, S.E., M.M.\nPendamping: KRISTIAN HADI SURYA S, S.Pi\nPelaksana: Staf Bidang Pemberdayaan Nelayan", true);

        addText("IV. PROSEDUR PEMUSNAHAN", 
            "Identifikasi dan verifikasi jenis ikan\nDokumentasi melalui pencatatan dan pengambilan bukti visual\nProses pemusnahan dengan metode manusiawi\nPenguburan bangkai dengan metode aman dan higienis\nPenyusunan laporan resmi", true);

        addText("V. HASIL KEGIATAN", 
            "Kegiatan pemusnahan ikan aligator invasif telah dilaksanakan dengan lancar sesuai prosedur yang berlaku. Pemusnahan ini merupakan bagian dari upaya preventif untuk mencegah penyebaran spesies invasif di perairan Situbondo. Dinas Peternakan dan Perikanan Situbondo mengimbau masyarakat untuk melaporkan jika menemukan spesies asing invasif.");

        // Signature
        if (yPos > 250) { doc.addPage(); yPos = margin; }
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

        // QR Code
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            await new Promise(resolve => {
                qrImg.onload = resolve;
                qrImg.onerror = resolve;
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e5631&bgcolor=ffffff`;
            });
            if (qrImg.complete && qrImg.naturalHeight !== 0) {
                const qrSize = 15;
                const qrX = 210 - margin - qrSize;
                const qrY = yPos - 9;
                doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
                doc.setFontSize(6);
                doc.text("Scan untuk", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
                doc.text("mengakses", qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
            }
        } catch (e) {}

        const fileName = `Laporan_Pemusnahan_Ikan_Aligator_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
        doc.save(fileName);
        hideLoading();
        closePdfPreview();
        setTimeout(() => alert('Laporan PDF berhasil diunduh!'), 500);
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('PDF berhasil dibuat! Silakan cek folder download Anda.');
    }
}

// Share Modal
function openShareModal() {
    document.getElementById('shareModal').style.display = 'flex';
}
function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}
function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Pemusnahan Ikan Aligator Invasif di Situbondo - Dinas Peternakan & Perikanan\n\nTindakan tegas dalam memusnahkan ikan aligator invasif yang dilaporkan masyarakat, sesuai peraturan kelautan dan perikanan untuk menjaga keseimbangan ekosistem perairan lokal.\n\nBaca selengkapnya di:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(() => alert('Gagal menyalin link. Silakan coba lagi.'));
}

// Fix footer position
function fixFooterPosition() {
    const footer = document.querySelector('.footer');
    const bodyHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    footer.style.position = bodyHeight < windowHeight ? 'fixed' : 'relative';
    footer.style.bottom = bodyHeight < windowHeight ? '0' : 'auto';
}

// ==================== INITIALIZATION (run after DOM loaded) ====================
document.addEventListener('DOMContentLoaded', function() {
    // AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Gallery modal
    document.querySelectorAll('.gallery-item').forEach(item => {
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

    // Scroll to top button
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Close modals when clicking outside
    document.getElementById('shareModal').addEventListener('click', function(e) {
        if (e.target === this) closeShareModal();
    });
    document.getElementById('pdfAuthModal').addEventListener('click', function(e) {
        if (e.target === this) closePdfAuthModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfPreview();
            closePdfAuthModal();
        }
    });

    // Password toggle listener
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }

    // Security code input: numbers only
    const securityInput = document.getElementById('securityCodeInput');
    if (securityInput) {
        securityInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        securityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') verifySecurityCode();
        });
    }

    // Footer position
    fixFooterPosition();
    window.addEventListener('resize', fixFooterPosition);

    // Debug: tampilkan kode keamanan hari ini di console
    console.log("Kode keamanan hari ini:", generateSecurityCode());
});
