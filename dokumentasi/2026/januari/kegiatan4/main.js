// ==================== GLOBAL FUNCTIONS (dipanggil dari HTML) ====================

// Share functionality
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
    const text = encodeURIComponent('Penyerahan dan Pelebelan Mesin Pompa Air kepada Pengelola TPI\n\nKegiatan penyerahan dan pelebelan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean yang diserahkan langsung oleh Kepala Bidang Pemberdayaan Nelayan Dinas Peternakan dan Perikanan Kabupaten Situbondo.\n\nBaca selengkapnya di:');
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

// Security system variables
let maxAttempts = 3;
let currentAttempts = 0;
let lockoutTime = 0;
const lockoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

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
}

function openPdfAuthModal() {
    const lockoutStatus = isLockedOut();
    if (lockoutStatus.locked) {
        alert(lockoutStatus.message);
        return;
    }
    
    const modal = document.getElementById('pdfAuthModal');
    if (!modal) return;
    
    const input = document.getElementById('securityCodeInput');
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const attemptsSpan = document.getElementById('attemptsLeft');
    
    if (input) input.value = '';
    if (errorMsg) errorMsg.style.display = 'none';
    if (errorText) errorText.textContent = 'Kode keamanan yang Anda masukkan salah. Silakan coba lagi.';
    if (input) input.classList.remove('is-invalid');
    if (attemptsSpan) attemptsSpan.textContent = maxAttempts - currentAttempts;
    
    modal.style.display = 'flex';
    
    setTimeout(() => {
        if (input) input.focus();
    }, 300);
}

function closePdfAuthModal() {
    const modal = document.getElementById('pdfAuthModal');
    if (modal) modal.style.display = 'none';
}

function verifySecurityCode() {
    const lockoutStatus = isLockedOut();
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const inputElement = document.getElementById('securityCodeInput');
    const attemptsSpan = document.getElementById('attemptsLeft');
    
    if (lockoutStatus.locked) {
        if (errorText) errorText.textContent = lockoutStatus.message;
        if (errorMsg) errorMsg.style.display = 'block';
        return;
    }
    
    const userInput = inputElement ? inputElement.value : '';
    const correctCode = generateSecurityCode();
    
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
        if (inputElement) {
            inputElement.classList.add('is-invalid');
            inputElement.style.animation = 'none';
            setTimeout(() => {
                inputElement.style.animation = 'shake 0.5s';
            }, 10);
            inputElement.value = '';
            inputElement.focus();
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
                             style="width: 70px; height: 70px; object-fit: contain; display: block; border-radius: 0;"
                             onerror="this.onerror=null; this.src='https://placehold.co/70x70/1e3a8a/white?text=Logo';">
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
        
        <!-- Judul Laporan -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold; color: #333;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #1e3a8a; line-height: 1.4;">
                PENYERAHAN DAN PELEBELAN MESIN POMPA AIR<br>
                KEPADA PENGELOLA TEMPAT PELELANGAN IKAN (TPI)
            </h1>
        </div>
        
        <!-- Isi Laporan -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                I. LATAR BELAKANG
            </h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Dalam rangka mendukung operasional Tempat Pelelangan Ikan (TPI) dan meningkatkan kontribusi terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo, Dinas Peternakan dan Perikanan Kabupaten Situbondo melaksanakan kegiatan penyerahan dan pelebelan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean. Kegiatan ini merupakan bentuk komitmen pemerintah daerah dalam pengembangan infrastruktur perikanan dan pemberdayaan masyarakat pesisir.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                II. TUJUAN KEGIATAN
            </h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Meningkatkan kualitas operasional TPI dalam menjaga kebersihan dan higienitas area pelelangan ikan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Mendukung pengelola TPI dalam pelayanan kepada nelayan dan pembeli ikan</li>
                <li style="margin-bottom: 10px; text-align: justify;">Mengoptimalkan kontribusi TPI terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo</li>
                <li style="margin-bottom: 10px; text-align: justify;">Memastikan barang milik daerah (BMD) dikelola dengan baik dan berkelanjutan</li>
                <li style="margin-bottom: 0; text-align: justify;">Memperkuat sinergi antara pemerintah daerah dengan pengelola TPI dan stakeholder perikanan</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                III. WAKTU DAN LOKASI KEGIATAN
            </h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">
                    <strong>TPI Besuki:</strong> 21 Januari 2026<br>
                    <span style="padding-left: 20px;">Desa Pesisir, Kecamatan Besuki, Kabupaten Situbondo</span>
                </li>
                <li style="margin-bottom: 0; text-align: justify;">
                    <strong>TPI Pandean:</strong> 22 Januari 2026<br>
                    <span style="padding-left: 20px;">Desa Wonorejo, Kecamatan Banyuputih, Kabupaten Situbondo</span>
                </li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                IV. PELAKSANA KEGIATAN
            </h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px; text-align: justify;">Penanggung Jawab: Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M.</li>
                <li style="margin-bottom: 10px; text-align: justify;">Tim Aset Dinas Peternakan dan Perikanan Kabupaten Situbondo</li>
                <li style="margin-bottom: 0; text-align: justify;">Pengelola TPI Besuki dan TPI Pandean sebagai penerima bantuan</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                V. HASIL KEGIATAN
            </h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan penyerahan dan pelebelan mesin pompa air berlangsung dengan lancar sesuai jadwal yang telah ditetapkan. Proses penyerahan dilakukan langsung oleh Kepala Bidang Pemberdayaan Nelayan yang disertai dengan dialog mengenai kondisi operasional TPI dan perkembangan hasil tangkapan nelayan. Tim aset Dinas Peternakan dan Perikanan melakukan pelebelan mesin pompa air sebagai Barang Milik Daerah (BMD) serta memberikan arahan teknis mengenai perawatan dan penggunaan yang tepat.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a;">
                VI. KESIMPULAN DAN REKOMENDASI
            </h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Penyerahan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean telah berhasil dilaksanakan dengan baik. Bantuan ini diharapkan dapat meningkatkan kualitas operasional TPI, mendukung peningkatan Pendapatan Asli Daerah, dan memperkuat sinergi antara pemerintah daerah dengan stakeholder perikanan. Direkomendasikan untuk dilakukan monitoring berkala terhadap penggunaan dan kondisi mesin pompa air, serta evaluasi dampak bantuan terhadap kinerja TPI.
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
            </div>
        </div>
        
        <!-- Footer dengan QR code -->
        <div style="margin-top: 100px; border-top: 1px solid #ddd; padding-top: 15px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; font-size: 10px; color: #666; width: 70%;">
                    <p style="margin-bottom: 5px;">Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo</p>
                    <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                </div>
                <div style="text-align: right; width: 25%;">
                    <div class="qr-code" style="background: #ffffff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); float: right;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e3a8a&bgcolor=ffffff" 
                             alt="QR Code Sumber Laporan" 
                             style="width: 70px; height: 70px; object-fit: contain;"
                             onerror="this.onerror=null; this.src='https://placehold.co/80x80/1e3a8a/white?text=QR';">
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

// Placeholder logo untuk PDF fallback
const placeholderLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFjSURBVHgB7d2xTQNBEIXhsfAFARIgQzKgTToYAjg3j6JXODcPwdJgOSc/9Vx3/oPnOe6OnnH0l93Tsz+e3/kv3pnvxAAQIIAAIgwggAgDiCCAAAIIIICAIIAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQSRl/bVc52Z63K6r7c+87Nf3tpyuvfsbT3f2/Kje+6W073n9Tk9e/Z6Hv3wWIIYAAIIIMAABhBAgAEggAADQAABBoAAAggggAACCDAABBAQBBBAQBBAAAFBAAEEBAEEEBAEEECAAQygT+3b89J+PF+c7T37S/tX53vP3nLq2X09r+f7cua+/V7PW5/ZZ1/L6fXc1/Nx/Bj7O8/HXyIABBBCABnQEcTAACgYgAADQAABBBgAAggwAAQQYAATfLZXKSDj7SwAAAAASUVORK5CYII=';

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
        
        try {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = () => {
                    console.log('Logo error, using placeholder');
                    const placeholderImg = new Image();
                    placeholderImg.src = placeholderLogo;
                    placeholderImg.onload = () => {
                        doc.addImage(placeholderImg, 'PNG', margin, yPos, logoWidth, logoHeight);
                        resolve();
                    };
                    placeholderImg.onerror = resolve;
                };
                logoImg.src = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png';
            });
            
            doc.addImage(logoImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        } catch (e) {
            console.log('Using placeholder logo');
            const placeholderImg = new Image();
            placeholderImg.src = placeholderLogo;
            await new Promise(resolve => {
                placeholderImg.onload = resolve;
            });
            doc.addImage(placeholderImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        }
        
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
        const title1 = "PENYERAHAN DAN PELEBELAN MESIN POMPA AIR";
        const title2 = "KEPADA PENGELOLA TEMPAT PELELANGAN IKAN (TPI)";
        
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
            "Dalam rangka mendukung operasional Tempat Pelelangan Ikan (TPI) dan meningkatkan kontribusi terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo, Dinas Peternakan dan Perikanan Kabupaten Situbondo melaksanakan kegiatan penyerahan dan pelebelan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean. Kegiatan ini merupakan bentuk komitmen pemerintah daerah dalam pengembangan infrastruktur perikanan dan pemberdayaan masyarakat pesisir.");
        
        addText("II. TUJUAN KEGIATAN", 
            "Meningkatkan kualitas operasional TPI dalam menjaga kebersihan dan higienitas area pelelangan ikan\n" +
            "Mendukung pengelola TPI dalam pelayanan kepada nelayan dan pembeli ikan\n" +
            "Mengoptimalkan kontribusi TPI terhadap Pendapatan Asli Daerah (PAD) Kabupaten Situbondo\n" +
            "Memastikan barang milik daerah (BMD) dikelola dengan baik dan berkelanjutan\n" +
            "Memperkuat sinergi antara pemerintah daerah dengan pengelola TPI dan stakeholder perikanan", true, true);
        
        addText("III. WAKTU DAN LOKASI KEGIATAN", 
            "TPI Besuki: 21 Januari 2026\nDesa Pesisir, Kecamatan Besuki, Kabupaten Situbondo\n\nTPI Pandean: 22 Januari 2026\nDesa Wonorejo, Kecamatan Banyuputih, Kabupaten Situbondo", true);
        
        addText("IV. PELAKSANA KEGIATAN", 
            "Penanggung Jawab: Kepala Bidang Pemberdayaan Nelayan, SUGENG PURWO PRIYANTO, S.E., M.M.\n" +
            "Tim Aset Dinas Peternakan dan Perikanan Kabupaten Situbondo\n" +
            "Pengelola TPI Besuki dan TPI Pandean sebagai penerima bantuan", true);
        
        addText("V. HASIL KEGIATAN", 
            "Kegiatan penyerahan dan pelebelan mesin pompa air berlangsung dengan lancar sesuai jadwal yang telah ditetapkan. Proses penyerahan dilakukan langsung oleh Kepala Bidang Pemberdayaan Nelayan yang disertai dengan dialog mengenai kondisi operasional TPI dan perkembangan hasil tangkapan nelayan. Tim aset Dinas Peternakan dan Perikanan melakukan pelebelan mesin pompa air sebagai Barang Milik Daerah (BMD) serta memberikan arahan teknis mengenai perawatan dan penggunaan yang tepat.");
        
        addText("VI. KESIMPULAN DAN REKOMENDASI", 
            "Penyerahan mesin pompa air kepada pengelola TPI Besuki dan TPI Pandean telah berhasil dilaksanakan dengan baik. Bantuan ini diharapkan dapat meningkatkan kualitas operasional TPI, mendukung peningkatan Pendapatan Asli Daerah, dan memperkuat sinergi antara pemerintah daerah dengan stakeholder perikanan. Direkomendasikan untuk dilakukan monitoring berkala terhadap penggunaan dan kondisi mesin pompa air, serta evaluasi dampak bantuan terhadap kinerja TPI.");
        
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
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=1e3a8a&bgcolor=ffffff`;
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            
            await new Promise((resolve) => {
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
                doc.text("Scan untuk", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
                doc.text("mengakses", qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
            }
        } catch (e) {
            console.log('QR code generation failed, continuing without it');
        }
        
        const fileName = `Laporan_Penyerahan_Pompa_TPI_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
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

// ==================== GLOBAL IMAGE ERROR HANDLER ====================
function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
        // Skip jika sudah ada onerror handler
        if (img.hasAttribute('data-error-handled')) return;
        
        img.setAttribute('data-error-handled', 'true');
        
        img.addEventListener('error', function(e) {
            // Mencegah infinite loop
            if (this.src.includes('placehold.co') || this.src.includes('ui-avatars')) return;
            
            console.log('Image failed to load:', this.src);
            
            // Fallback default
            if (this.alt && this.alt.includes('Logo')) {
                this.src = 'https://placehold.co/200x80/1e3a8a/white?text=Logo';
            } else if (this.closest('.speaker-image')) {
                // Speaker image fallback
                const name = this.alt || 'Person';
                this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a8a&color=fff&size=400`;
            } else {
                // Generic fallback
                this.src = 'https://placehold.co/600x400/1e3a8a/white?text=Gambar+Tidak+Tersedia';
            }
        });
    });
}

// ==================== INITIALIZATION (DOMContentLoaded) ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
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

    // Gallery modal functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;
            
            const imgSrc = img.src;
            const imgAlt = img.alt;
            
            const modalHTML = `
            <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0">
                        <div class="modal-body p-0 position-relative">
                            <img src="${imgSrc}" alt="${imgAlt}" class="img-fluid w-100 rounded">
                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal" aria-label="Tutup"></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            if (typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(document.getElementById('imageModal'));
                modal.show();
                
                document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() {
                    this.remove();
                });
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll to top button
    if (!document.getElementById('scrollTopBtn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollTopBtn.id = 'scrollTopBtn';
        scrollTopBtn.className = 'btn btn-primary position-fixed bottom-3 end-3 rounded-circle shadow-lg';
        scrollTopBtn.style.width = '50px';
        scrollTopBtn.style.height = '50px';
        scrollTopBtn.style.zIndex = '1000';
        scrollTopBtn.style.display = 'none';
        scrollTopBtn.style.background = 'linear-gradient(135deg, var(--secondary-blue), var(--primary-blue))';
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
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeShareModal();
            closePdfPreview();
            closePdfAuthModal();
        }
    });

    // Initialize password toggle
    const toggleBtn = document.getElementById('passwordToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    // Allow pressing Enter to submit the security code
    const securityInput = document.getElementById('securityCodeInput');
    if (securityInput) {
        securityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifySecurityCode();
            }
        });
        
        // Restrict input to numbers only
        securityInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
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
            footer.style.left = '0';
            footer.style.right = '0';
        } else {
            footer.style.position = 'relative';
            footer.style.bottom = 'auto';
        }
    }

    fixFooterPosition();
    window.addEventListener('resize', fixFooterPosition);

    // Handle broken images globally
    handleImageErrors();

    // Debug: Tampilkan kode keamanan saat ini di console untuk testing
    console.log("Kode keamanan hari ini (testing):", generateSecurityCode());
});
