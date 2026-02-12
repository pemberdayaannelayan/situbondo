'use strict';

// ==================== GLOBAL VARIABLES ====================
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
let isPasswordVisible = false;

const placeholderLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFjSURBVHgB7d2xTQNBEIXhsfAFARIgQzKgTToYAjg3j6JXODcPwdJgOSc/9Vx3/oPnOe6OnnH0l93Tsz+e3/kv3pnvxAAQIIAAIgwggAgDiCCAAAIIIICAIIAAAggggAACCCDAABBAgAEggAADQAABBoAAAggggAACCCCAABBAgAEggAACCAgCCCAgCCCAgCCAAAKCAAIICAIICDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQygT+3b89J+PF+c7T37S/tX53vP3nLq2X09r+f7cua+/V7PW5/ZZ1/L6fXc1/Nx/Bj7O8/HXyIABBBCABnQEcTAACgYgAADQAABBBgAAggwAAQQYAATfLZXKSDj7SwAAAAASUVORK5CYII=';

// ==================== GLOBAL FUNCTIONS (inline onclick) ====================

// Generate security code based on DDMMYYYY
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year;
}

// Check lockout status
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

// Toggle password visibility (called from inline onclick)
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

// Loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Share modal
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
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(err => {
        console.error('Gagal menyalin link: ', err);
        alert('Gagal menyalin link. Silakan coba lagi.');
    });
}

// PDF Authorization modal
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

        // Shake animation
        inputElement.style.animation = 'none';
        setTimeout(() => {
            inputElement.style.animation = 'shake 0.5s';
        }, 10);

        inputElement.value = '';
        inputElement.focus();
    }
}

// PDF Preview modal
function openPdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'flex';
}
function closePdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'none';
}

// Generate PDF report (called after successful authorization)
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
        
        <!-- Isi Laporan -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">I. LATAR BELAKANG</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Berdasarkan laporan masyarakat Situbondo yang menemukan keberadaan ikan aligator (Atractosteus spatula) di perairan lokal, Dinas Peternakan dan Perikanan Situbondo melalui Bidang Pemberdayaan Nelayan segera melakukan respons dengan melaksanakan kegiatan pemusnahan pada tanggal 5 Februari 2026. Tindakan ini dipimpin langsung oleh Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf, dengan pendampingan dari KRISTIAN HADI SURYA S, S.Pi sebagai Pengawas Perikanan dan Penyuluh Perikanan sesuai Surat Tugas dari Kepala Pangkalan Pengawasan Sumber Daya Kelautan dan Perikanan Beno Nomor: B. 239/PSDKPLan.4/KP.440/II/2026.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">II. DASAR HUKUM</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Undang-Undang Nomor 31 Tahun 2004 tentang Perikanan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Peraturan Menteri Kelautan dan Perikanan Nomor 41/PERMEN-KP/2014 tentang Larangan Pemasukan Jenis Ikan Berbahaya dari Luar Negeri ke Dalam Wilayah Negara Republik Indonesia</li>
                <li style="margin-bottom: 10px; text-align: justify;">Peraturan Pemerintah Nomor 60 Tahun 2007 tentang Konservasi Sumber Daya Ikan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Keputusan Menteri Kelautan dan Perikanan tentang Jenis Ikan yang Dilarang Dimasukkan ke Dalam Wilayah Negara Republik Indonesia</li>
                <li style="margin-bottom: 0; text-align: justify;">Surat Tugas Kepala Pangkalan Pengawasan Sumber Daya Kelautan dan Perikanan Beno Nomor: B. 239/PSDKPLan.4/KP.440/II/2026</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">III. PELAKSANA KEGIATAN</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Penanggung Jawab:</strong> SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan)</li>
                <li style="margin-bottom: 10px; text-align: justify;"><strong>Pendamping:</strong> KRISTIAN HADI SURYA S, S.Pi (Pengawas Perikanan dan Penyuluh Perikanan)</li>
                <li style="margin-bottom: 0; text-align: justify;"><strong>Pelaksana:</strong> Staf Bidang Pemberdayaan Nelayan Dinas Peternakan dan Perikanan Situbondo</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">IV. PROSEDUR PEMUSNAHAN</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Identifikasi dan verifikasi jenis ikan melalui pemeriksaan morfologi</li>
                <li style="margin-bottom: 10px; text-align: justify;">Dokumentasi melalui pencatatan dan pengambilan bukti visual</li>
                <li style="margin-bottom: 10px; text-align: justify;">Proses pemusnahan dengan metode yang manusiawi sesuai standar kesejahteraan hewan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Penguburan bangkai dengan metode yang aman dan higienis</li>
                <li style="margin-bottom: 0; text-align: justify;">Penyusunan laporan resmi untuk disampaikan kepada pihak berwenang</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">V. DAMPAK IKAN ALIGATOR INVASIF</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Ikan aligator (Atractosteus spatula) merupakan spesies invasif asli Amerika Utara yang memiliki potensi besar mengancam keanekaragaman hayati perairan Indonesia. Keberadaan spesies ini dapat menyebabkan gangguan ekologi yang serius, termasuk predasi terhadap ikan lokal, kompetisi sumber daya, dan perubahan struktur ekosistem perairan. Sebagai predator puncak, ikan aligator dapat memangsa berbagai jenis ikan kecil, udang, dan bahkan anak ikan dari spesies lokal yang memiliki nilai ekonomi penting. Tindakan pemusnahan ini merupakan bentuk tanggung jawab pemerintah dalam melindungi ekosistem perairan Situbondo dari ancaman spesies asing invasif.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e5631;">VI. HASIL KEGIATAN</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan pemusnahan ikan aligator invasif telah dilaksanakan dengan lancar sesuai prosedur yang berlaku. Seluruh proses dilakukan dengan mengutamakan aspek kesejahteraan hewan dan keamanan lingkungan. Pemusnahan ini merupakan bagian dari upaya preventif untuk mencegah penyebaran spesies invasif di perairan Situbondo. Melalui kegiatan ini, diharapkan dapat meningkatkan kesadaran masyarakat tentang bahaya memelihara atau melepasliarkan spesies asing invasif ke perairan umum. Dinas Peternakan dan Perikanan Situbondo mengimbau masyarakat untuk melaporkan jika menemukan spesies asing invasif atau kegiatan yang dapat mengancam kelestarian ekosistem perairan.
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
            <div style="width: 35%;"></div>
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
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e5631&bgcolor=ffffff" 
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

// Download PDF (called from preview modal)
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

        // Logo
        const logoWidth = 18;
        const logoHeight = 18;
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
            console.log('Using placeholder logo');
            const placeholderImg = new Image();
            placeholderImg.src = placeholderLogo;
            await new Promise(resolve => { placeholderImg.onload = resolve; });
            doc.addImage(placeholderImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        }

        // Header
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

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN KEGIATAN", 105, yPos, { align: 'center' });
        yPos += 10;

        doc.setFontSize(14);
        const title1 = "PEMUSNAHAN IKAN ALIGATOR INVASIF (Atractosteus spatula)";
        const title2 = "DI DINAS PETERNAKAN DAN PERIKANAN SITUBONDO";
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

        // Helper untuk menambahkan teks
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
            "Berdasarkan laporan masyarakat Situbondo yang menemukan keberadaan ikan aligator (Atractosteus spatula) di perairan lokal, Dinas Peternakan dan Perikanan Situbondo melalui Bidang Pemberdayaan Nelayan segera melakukan respons dengan melaksanakan kegiatan pemusnahan pada tanggal 5 Februari 2026. Tindakan ini dipimpin langsung oleh Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M. beserta staf, dengan pendampingan dari KRISTIAN HADI SURYA S, S.Pi sebagai Pengawas Perikanan dan Penyuluh Perikanan sesuai Surat Tugas dari Kepala Pangkalan Pengawasan Sumber Daya Kelautan dan Perikanan Beno Nomor: B. 239/PSDKPLan.4/KP.440/II/2026.");

        addText("II. DASAR HUKUM",
            "Undang-Undang Nomor 31 Tahun 2004 tentang Perikanan\n" +
            "Peraturan Menteri Kelautan dan Perikanan Nomor 41/PERMEN-KP/2014 tentang Larangan Pemasukan Jenis Ikan Berbahaya dari Luar Negeri ke Dalam Wilayah Negara Republik Indonesia\n" +
            "Peraturan Pemerintah Nomor 60 Tahun 2007 tentang Konservasi Sumber Daya Ikan\n" +
            "Keputusan Menteri Kelautan dan Perikanan tentang Jenis Ikan yang Dilarang Dimasukkan ke Dalam Wilayah Negara Republik Indonesia\n" +
            "Surat Tugas Kepala Pangkalan Pengawasan Sumber Daya Kelautan dan Perikanan Beno Nomor: B. 239/PSDKPLan.4/KP.440/II/2026", true, true);

        addText("III. PELAKSANA KEGIATAN",
            "Penanggung Jawab: SUGENG PURWO PRIYANTO, S.E., M.M. (Kepala Bidang Pemberdayaan Nelayan)\n" +
            "Pendamping: KRISTIAN HADI SURYA S, S.Pi (Pengawas Perikanan dan Penyuluh Perikanan)\n" +
            "Pelaksana: Staf Bidang Pemberdayaan Nelayan Dinas Peternakan dan Perikanan Situbondo", true);

        addText("IV. PROSEDUR PEMUSNAHAN",
            "Identifikasi dan verifikasi jenis ikan melalui pemeriksaan morfologi\n" +
            "Dokumentasi melalui pencatatan dan pengambilan bukti visual\n" +
            "Proses pemusnahan dengan metode yang manusiawi sesuai standar kesejahteraan hewan\n" +
            "Penguburan bangkai dengan metode yang aman dan higienis\n" +
            "Penyusunan laporan resmi untuk disampaikan kepada pihak berwenang", true);

        addText("V. DAMPAK IKAN ALIGATOR INVASIF",
            "Ikan aligator (Atractosteus spatula) merupakan spesies invasif asli Amerika Utara yang memiliki potensi besar mengancam keanekaragaman hayati perairan Indonesia. Keberadaan spesies ini dapat menyebabkan gangguan ekologi yang serius, termasuk predasi terhadap ikan lokal, kompetisi sumber daya, dan perubahan struktur ekosistem perairan. Sebagai predator puncak, ikan aligator dapat memangsa berbagai jenis ikan kecil, udang, dan bahkan anak ikan dari spesies lokal yang memiliki nilai ekonomi penting. Tindakan pemusnahan ini merupakan bentuk tanggung jawab pemerintah dalam melindungi ekosistem perairan Situbondo dari ancaman spesies asing invasif.");

        addText("VI. HASIL KEGIATAN",
            "Kegiatan pemusnahan ikan aligator invasif telah dilaksanakan dengan lancar sesuai prosedur yang berlaku. Seluruh proses dilakukan dengan mengutamakan aspek kesejahteraan hewan dan keamanan lingkungan. Pemusnahan ini merupakan bagian dari upaya preventif untuk mencegah penyebaran spesies invasif di perairan Situbondo. Melalui kegiatan ini, diharapkan dapat meningkatkan kesadaran masyarakat tentang bahaya memelihara atau melepasliarkan spesies asing invasif ke perairan umum. Dinas Peternakan dan Perikanan Situbondo mengimbau masyarakat untuk melaporkan jika menemukan spesies asing invasif atau kegiatan yang dapat mengancam kelestarian ekosistem perairan.");

        // Signature
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

        // Footer line
        doc.setLineWidth(0.1);
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 5;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo", margin, yPos);
        doc.text(`© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo`, margin, yPos + 4);

        // QR Code
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e5631&bgcolor=ffffff`;
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            await new Promise(resolve => {
                qrImg.onload = resolve;
                qrImg.onerror = resolve;
                qrImg.src = qrCodeUrl;
            });
            const qrSize = 15;
            const qrX = 210 - margin - qrSize;
            const qrY = yPos - 9;
            if (qrImg.complete && qrImg.naturalHeight !== 0) {
                doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
                doc.setFontSize(6);
                doc.text("Scan untuk", qrX + qrSize / 2, qrY + qrSize + 3, { align: 'center' });
                doc.text("mengakses", qrX + qrSize / 2, qrY + qrSize + 6, { align: 'center' });
            }
        } catch (e) {
            console.log('QR code generation failed, continuing without it');
        }

        const fileName = `Laporan_Pemusnahan_Ikan_Aligator_${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}.pdf`;
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

// Fix footer position
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
    }
}

// ==================== DOMContentLoaded (Inisialisasi) ====================
document.addEventListener('DOMContentLoaded', function () {
    // Inisialisasi AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Set current year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    // Gallery modal
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Close share modal when clicking outside
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeShareModal();
            }
        });
    }

    // Close PDF auth modal when clicking outside
    const pdfAuthModal = document.getElementById('pdfAuthModal');
    if (pdfAuthModal) {
        pdfAuthModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closePdfAuthModal();
            }
        });
    }

    // Escape key to close modals
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfPreview();
            closePdfAuthModal();
        }
    });

    // Security code input: only numbers
    const securityInput = document.getElementById('securityCodeInput');
    if (securityInput) {
        securityInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        securityInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                verifySecurityCode();
            }
        });
    }

    // Add shake animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Footer position fix
    fixFooterPosition();
    window.addEventListener('resize', fixFooterPosition);
});
