/**
 * SIMATA ID Card Generator - VERSI DISEMPURNAKAN & DIPERBAIKI
 * File: idcard.js
 * Fungsi untuk menghasilkan ID Card nelayan profesional
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 3.1 - Desain Premium & Responsif - DIPERBAIKI
 */

// Style CSS khusus untuk ID Card - DIOPTIMALKAN
const IDCardStyles = `
/* ID Card Styles - Terpisah dari index.html - DIPERBAIKI */
.id-card-container {
    font-family: 'Arial', sans-serif;
    max-width: 100%;
    margin: 0 auto;
}

.id-card-preview-container {
    width: 340px;
    height: 215px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 12px;
    padding: 12px;
    color: #333;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(12, 36, 97, 0.15);
    border: 2px solid #0c2461;
    margin: 10px auto;
    transition: all 0.3s ease;
    font-size: 11px;
}

.id-card-preview-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(12, 36, 97, 0.2);
}

.id-card-header {
    background: linear-gradient(90deg, #0c2461 0%, #1e3799 100%);
    margin: -12px -12px 10px -12px;
    padding: 10px;
    text-align: center;
    border-bottom: 2px solid #f6b93b;
}

.id-card-title {
    margin: 0;
    color: white;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.2;
}

.id-card-subtitle {
    margin: 2px 0 0 0;
    color: #f6b93b;
    font-size: 9px;
    font-weight: 500;
}

.id-card-content {
    display: flex;
    gap: 10px;
    height: 135px;
    position: relative;
}

.id-card-logo-area {
    flex: 0 0 70px;
    text-align: center;
}

.id-card-logo-box {
    width: 65px;
    height: 65px;
    background: white;
    border-radius: 6px;
    border: 2px solid #0c2461;
    margin: 0 auto 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    padding: 3px;
}

.id-card-logo-img {
    width: 55px;
    height: 55px;
    object-fit: contain;
    border-radius: 4px;
}

.id-card-logo-label {
    font-size: 8px;
    color: #666;
    font-weight: 600;
    margin-top: 2px;
}

.id-card-info-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 70px;
}

.id-card-name {
    margin: 0 0 6px 0;
    font-size: 13px;
    color: #0c2461;
    font-weight: 700;
    border-bottom: 1px solid #e0e6f0;
    padding-bottom: 3px;
    line-height: 1.2;
}

.id-card-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.id-card-detail-row {
    display: flex;
    margin-bottom: 3px;
    font-size: 9px;
    line-height: 1.3;
}

.id-card-detail-label {
    font-weight: 600;
    color: #0c2461;
    min-width: 50px;
    flex-shrink: 0;
}

.id-card-detail-value {
    color: #333;
    flex: 1;
    word-break: break-word;
}

.id-card-profesi-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-top: 2px;
}

.id-card-footer {
    position: absolute;
    bottom: 6px;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 0 12px;
}

.id-card-id-number {
    font-size: 8px;
    color: #0c2461;
    font-weight: 700;
    letter-spacing: 0.8px;
    background: rgba(12, 36, 97, 0.08);
    padding: 3px 8px;
    border-radius: 8px;
    display: inline-block;
    margin-bottom: 2px;
    border: 1px solid rgba(12, 36, 97, 0.1);
}

.id-card-copyright {
    font-size: 7px;
    color: #888;
    margin-top: 1px;
}

.id-card-qr-area {
    position: absolute;
    right: 12px;
    bottom: 30px;
    width: 55px;
    height: 55px;
    background: white;
    border: 1.5px solid #0c2461;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 3px;
}

.id-card-qr-label {
    position: absolute;
    bottom: -18px;
    left: 0;
    width: 100%;
    font-size: 6px;
    color: #666;
    text-align: center;
    font-weight: 500;
}

.id-card-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 48px;
    color: rgba(12, 36, 97, 0.04);
    font-weight: 900;
    letter-spacing: 4px;
    z-index: 0;
    white-space: nowrap;
    opacity: 0.5;
}

.id-card-photo-placeholder {
    width: 65px;
    height: 80px;
    background: linear-gradient(135deg, #f1f2f6 0%, #dfe6e9 100%);
    border: 1px dashed #b2bec3;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #636e72;
    font-size: 8px;
    text-align: center;
    margin: 0 auto 4px;
}

.id-card-photo-placeholder i {
    font-size: 16px;
    margin-bottom: 4px;
    color: #74b9ff;
}

.id-card-status-badge {
    display: inline-block;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 7px;
    font-weight: 600;
    margin-left: 4px;
}

/* Warna berdasarkan profesi - DIPERBAIKI */
.profesi-penuh { background: #0c2461; color: white; }
.profesi-sambilan-utama { background: #e58e26; color: white; }
.profesi-sambilan-tambahan { background: #27ae60; color: white; }

/* Warna berdasarkan status - DIPERBAIKI */
.status-pemilik { background: #0984e3; color: white; }
.status-abk { background: #a55eea; color: white; }

/* Responsif untuk ID Card preview - DIPERBAIKI */
@media (max-width: 400px) {
    .id-card-preview-container {
        width: 300px;
        height: 190px;
        padding: 10px;
    }
    
    .id-card-content {
        height: 115px;
        gap: 8px;
    }
    
    .id-card-logo-area {
        flex: 0 0 60px;
    }
    
    .id-card-logo-box {
        width: 55px;
        height: 55px;
    }
    
    .id-card-logo-img {
        width: 45px;
        height: 45px;
    }
    
    .id-card-name {
        font-size: 11px;
        margin-bottom: 4px;
    }
    
    .id-card-detail-row {
        font-size: 8px;
        margin-bottom: 2px;
    }
    
    .id-card-detail-label {
        min-width: 45px;
    }
    
    .id-card-qr-area {
        width: 45px;
        height: 45px;
        right: 8px;
        bottom: 25px;
    }
    
    .id-card-title {
        font-size: 12px;
    }
    
    .id-card-subtitle {
        font-size: 8px;
    }
}
`;

// Inject styles ke dalam dokumen
function injectIDCardStyles() {
    if (!document.querySelector('#id-card-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'id-card-styles';
        styleElement.textContent = IDCardStyles;
        document.head.appendChild(styleElement);
    }
}

// Global variables untuk ID Card
let idCardGenerated = false;

/**
 * Fungsi utama untuk menghasilkan ID Card nelayan - DIPERBAIKI
 * @param {Object} nelayanData - Data nelayan dari database SIMATA
 */
function generateSimataIDCard(nelayanData) {
    if (!nelayanData) {
        console.error('Data nelayan tidak ditemukan');
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    try {
        // Inject styles jika belum ada
        injectIDCardStyles();
        
        // Tampilkan loading
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) loadingEl.classList.add('active');
        
        // Buat elemen sementara untuk QR Code
        const qrContainer = document.createElement('div');
        qrContainer.id = 'idcard-qr-temp';
        qrContainer.style.position = 'absolute';
        qrContainer.style.left = '-9999px';
        qrContainer.style.width = '150px';
        qrContainer.style.height = '150px';
        document.body.appendChild(qrContainer);
        
        // Generate QR Code untuk ID Card
        const qrData = generateQRDataForIDCard(nelayanData);
        
        // Bersihkan container sebelumnya jika ada
        qrContainer.innerHTML = '';
        
        // Periksa apakah QRCode tersedia
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library tidak ditemukan');
            showNotification('Library QRCode tidak tersedia!', 'error');
            if (loadingEl) loadingEl.classList.remove('active');
            document.body.removeChild(qrContainer);
            return;
        }
        
        // Buat QR Code dengan error handling
        try {
            new QRCode(qrContainer, {
                text: qrData,
                width: 150,
                height: 150,
                colorDark: "#0c2461",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (qrError) {
            console.error('Error membuat QR Code:', qrError);
            // Fallback jika QR gagal
            qrContainer.innerHTML = '<div style="background:#0c2461;color:white;width:150px;height:150px;display:flex;align-items:center;justify-content:center;font-size:12px;">QR ERROR</div>';
        }
        
        // Tunggu QR Code digenerate
        setTimeout(() => {
            generateIDCardPDF(nelayanData, qrContainer);
            document.body.removeChild(qrContainer);
            
            // Sembunyikan loading
            if (loadingEl) loadingEl.classList.remove('active');
        }, 800);
        
    } catch (error) {
        console.error('Error generating ID Card:', error);
        showNotification('Terjadi kesalahan saat membuat ID Card!', 'error');
        
        // Sembunyikan loading jika error
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) loadingEl.classList.remove('active');
    }
}

/**
 * Generate data untuk QR Code - DIPERBAIKI
 */
function generateQRDataForIDCard(nelayanData) {
    const data = {
        system: "SIMATA",
        id: nelayanData.id,
        nik: nelayanData.nik,
        nama: nelayanData.nama,
        profesi: nelayanData.profesi,
        status: nelayanData.status,
        kodeValidasi: nelayanData.kodeValidasi || 'N/A',
        tanggalValidasi: nelayanData.tanggalValidasi,
        domisili: `${nelayanData.desa}, ${nelayanData.kecamatan}`,
        alatTangkap: nelayanData.alatTangkap,
        timestamp: new Date().toISOString(),
        verification_url: "https://simata.disnakansitubondo.com/verify"
    };
    
    return JSON.stringify(data);
}

/**
 * Load logo untuk ID Card - DIPERBAIKI
 */
function loadLogoForIDCard() {
    return new Promise((resolve, reject) => {
        const logoUrl = "https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png";
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = function() {
            // Buat canvas untuk memproses logo
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set ukuran canvas
            canvas.width = 120;
            canvas.height = 120;
            
            // Draw logo dengan background putih
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Hitung posisi untuk centering
            const size = Math.min(canvas.width, canvas.height) * 0.8;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;
            
            ctx.drawImage(img, x, y, size, size);
            
            resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = function() {
            // Fallback jika logo gagal load
            console.warn('Logo tidak dapat dimuat, menggunakan fallback');
            resolve(null);
        };
        
        // Tambahkan timestamp untuk cache busting
        img.src = logoUrl + '?t=' + Date.now();
    });
}

/**
 * Generate PDF untuk ID Card (DESAIN PREMIUM DIPERBAIKI)
 */
async function generateIDCardPDF(nelayanData, qrContainer) {
    // Pastikan jsPDF tersedia
    if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
        console.error('jsPDF tidak ditemukan');
        showNotification('Library PDF tidak tersedia!', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    
    // Muat logo terlebih dahulu
    const logoDataUrl = await loadLogoForIDCard();
    
    // Buat PDF dengan orientasi landscape untuk kartu ID (ukuran CR80: 85.6x54 mm)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54] // Ukuran standar kartu ID
    });
    
    // Warna tema SIMATA
    const primaryColor = [12, 36, 97];    // #0c2461
    const accentColor = [246, 185, 59];   // #f6b93b
    const secondaryColor = [74, 105, 189]; // #4a69bd
    const lightBlue = [240, 245, 255];    // #e8f0f9 lebih terang
    const white = [255, 255, 255];
    const darkGray = [60, 60, 60];
    
    // 1. BACKGROUND UTAMA dengan gradient yang lebih halus
    doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // 2. HEADER BIRU dengan pola lebih rapi
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(2, 2, 81.6, 12, 2, 2, 'F');
    
    // Garis emas di header
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.4);
    doc.line(2, 14, 83.6, 14);
    
    // 3. JUDUL UTAMA - lebih proporsional
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text("KARTU IDENTITAS NELAYAN", 42.8, 7, { align: 'center' });
    
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.text("SISTEM INFORMASI PEMETAAN DATA NELAYAN", 42.8, 9.5, { align: 'center' });
    doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", 42.8, 11.5, { align: 'center' });
    
    // 4. AREA FOTO/LOGO (Kiri) - diperbaiki posisi
    doc.setFillColor(white[0], white[1], white[2]);
    doc.roundedRect(5, 18, 22, 22, 2, 2, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.roundedRect(5, 18, 22, 22, 2, 2);
    
    // Tambahkan logo jika berhasil dimuat
    if (logoDataUrl) {
        try {
            doc.addImage(logoDataUrl, 'PNG', 7, 20, 18, 18);
        } catch (e) {
            console.warn('Gagal menambahkan logo:', e);
            drawFallbackLogo(doc, 16, 29);
        }
    } else {
        drawFallbackLogo(doc, 16, 29);
    }
    
    // 5. TEKS "LOGO RESMI"
    doc.setFontSize(4);
    doc.setTextColor(100, 100, 100);
    doc.text("LOGO RESMI", 16, 41, { align: 'center' });
    
    // 6. INFORMASI NELAYAN (Tengah) - layout diperbaiki
    const infoStartX = 30;
    let currentY = 19;
    
    // Nama Lengkap (Besar)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    
    // Potong nama jika terlalu panjang
    let namaDisplay = nelayanData.nama.toUpperCase();
    if (namaDisplay.length > 22) {
        namaDisplay = namaDisplay.substring(0, 20) + '...';
    }
    doc.text(namaDisplay, infoStartX, currentY);
    
    currentY += 4.5;
    
    // Garis bawah nama lebih tipis
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.2);
    doc.line(infoStartX, currentY - 0.5, 75, currentY - 0.5);
    
    // Informasi detail - font lebih kecil
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    const lineHeight = 3.8;
    
    // NIK
    doc.text(`NIK: ${nelayanData.nik}`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Usia & Tempat Lahir
    doc.text(`Usia: ${nelayanData.usia} Tahun`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Domisili
    const domisili = `${nelayanData.desa}, ${nelayanData.kecamatan}`;
    doc.text(`Domisili: ${domisili}`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Profesi dengan badge warna
    let profesiColor = primaryColor;
    let profesiText = nelayanData.profesi;
    
    if (nelayanData.profesi === "Nelayan Penuh Waktu") {
        profesiColor = [12, 36, 97]; // Biru tua
    } else if (nelayanData.profesi === "Nelayan Sambilan Utama") {
        profesiColor = [229, 142, 38]; // Orange
    } else if (nelayanData.profesi === "Nelayan Sambilan Tambahan") {
        profesiColor = [39, 174, 96]; // Hijau
    }
    
    doc.setFillColor(profesiColor[0], profesiColor[1], profesiColor[2]);
    doc.roundedRect(infoStartX - 0.5, currentY - 2.5, 20, 4, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.5);
    
    // Potong teks profesi jika terlalu panjang
    let profesiDisplay = profesiText.toUpperCase();
    if (profesiDisplay.length > 25) {
        profesiDisplay = profesiDisplay.substring(0, 22) + '...';
    }
    doc.text(profesiDisplay, infoStartX + 9.5, currentY, { align: 'center' });
    
    // Status pekerjaan
    let statusColor = [74, 105, 189]; // Default biru
    if (nelayanData.status === "Pemilik Kapal") {
        statusColor = [9, 132, 227]; // Biru terang
    } else if (nelayanData.status === "Anak Buah Kapal") {
        statusColor = [165, 94, 234]; // Ungu
    }
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(infoStartX + 22, currentY - 2.5, 16, 4, 2, 2, 'F');
    doc.text(nelayanData.status.toUpperCase(), infoStartX + 30, currentY, { align: 'center' });
    
    currentY += lineHeight;
    
    // Alat Tangkap
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    
    let alatTangkap = nelayanData.alatTangkap;
    if (alatTangkap.length > 25) {
        alatTangkap = alatTangkap.substring(0, 23) + '...';
    }
    doc.text(`Alat: ${alatTangkap}`, infoStartX, currentY);
    
    // 7. QR CODE AREA (Kanan) - posisi lebih baik
    const qrCanvas = qrContainer.querySelector('canvas');
    if (qrCanvas) {
        try {
            const qrDataUrl = qrCanvas.toDataURL('image/png');
            doc.addImage(qrDataUrl, 'PNG', 63, 18, 16, 16);
            
            // Border QR Code lebih tipis
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setLineWidth(0.3);
            doc.rect(63, 18, 16, 16);
            
            // Teks di bawah QR
            doc.setFontSize(3.5);
            doc.setTextColor(100, 100, 100);
            doc.text("SCAN UNTUK VERIFIKASI", 71, 36, { align: 'center' });
        } catch (e) {
            console.warn('QR Code gagal ditambahkan:', e);
            // Fallback untuk QR
            doc.setFillColor(240, 240, 240);
            doc.rect(63, 18, 16, 16, 'F');
            doc.setDrawColor(200, 200, 200);
            doc.rect(63, 18, 16, 16);
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(4);
            doc.text("QR", 71, 26, { align: 'center' });
            doc.text("CODE", 71, 29, { align: 'center' });
        }
    }
    
    // 8. FOOTER INFORMASI - lebih sederhana
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 15);
    doc.rect(2, 42, 81.6, 8, 'F');
    
    // Nomor ID Card
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    const idNumber = nelayanData.kodeValidasi || `SIMATA-${nelayanData.nik.substring(12)}`;
    doc.text(`ID: ${idNumber}`, 42.8, 46, { align: 'center' });
    
    // Masa berlaku
    const today = new Date();
    const expireDate = new Date(today);
    expireDate.setFullYear(today.getFullYear() + 2);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4);
    doc.setTextColor(80, 80, 80);
    doc.text(`Berlaku: ${formatDate(today)} - ${formatDate(expireDate)}`, 42.8, 49, { align: 'center' });
    
    // 9. BORDER KARTU dengan efek lebih halus
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(1, 1, 83.6, 52, 3, 3);
    
    // 10. SIMPAN FILE
    const fileName = `ID_Card_${nelayanData.nama.replace(/\s+/g, '_')}_${nelayanData.nik}.pdf`;
    
    // Tunggu sejenak sebelum menyimpan
    setTimeout(() => {
        doc.save(fileName);
        idCardGenerated = true;
        
        // Tampilkan notifikasi sukses
        if (typeof showNotification === 'function') {
            showNotification(`✅ ID Card ${nelayanData.nama} berhasil dibuat!`, 'success');
        }
    }, 300);
}

/**
 * Format tanggal untuk ID Card - DIPERBAIKI
 */
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substring(2);
    return `${day}/${month}/${year}`;
}

/**
 * Gambar logo fallback - DIPERBAIKI
 */
function drawFallbackLogo(doc, x, y) {
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    doc.text("LOGO", x, y - 3, { align: 'center' });
    doc.text("KABUPATEN", x, y, { align: 'center' });
    doc.text("SITUBONDO", x, y + 3, { align: 'center' });
}

/**
 * Fungsi untuk menghasilkan preview ID Card dalam format HTML - DIPERBAIKI
 */
function previewIDCardHTML(nelayanData) {
    // Warna berdasarkan profesi
    let profesiClass = 'profesi-penuh';
    if (nelayanData.profesi === "Nelayan Sambilan Utama") profesiClass = 'profesi-sambilan-utama';
    else if (nelayanData.profesi === "Nelayan Sambilan Tambahan") profesiClass = 'profesi-sambilan-tambahan';
    
    // Warna berdasarkan status
    let statusClass = 'status-pemilik';
    if (nelayanData.status === "Anak Buah Kapal") statusClass = 'status-abk';
    
    // Potong nama jika terlalu panjang
    let namaDisplay = nelayanData.nama;
    if (namaDisplay.length > 25) {
        namaDisplay = namaDisplay.substring(0, 23) + '...';
    }
    
    // Potong domisili jika terlalu panjang
    let domisiliDisplay = `${nelayanData.desa}, ${nelayanData.kecamatan}`;
    if (domisiliDisplay.length > 30) {
        domisiliDisplay = domisiliDisplay.substring(0, 28) + '...';
    }
    
    // Potong alat tangkap jika terlalu panjang
    let alatTangkapDisplay = nelayanData.alatTangkap;
    if (alatTangkapDisplay.length > 20) {
        alatTangkapDisplay = alatTangkapDisplay.substring(0, 18) + '...';
    }
    
    return `
    <div class="id-card-container">
        <div class="id-card-preview-container">
            <div class="id-card-watermark">SIMATA</div>
            
            <div class="id-card-header">
                <h4 class="id-card-title">KARTU IDENTITAS NELAYAN</h4>
                <p class="id-card-subtitle">Dinas Perikanan Kab. Situbondo</p>
            </div>
            
            <div class="id-card-content">
                <div class="id-card-logo-area">
                    <div class="id-card-logo-box">
                        <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png" 
                             class="id-card-logo-img" 
                             alt="Logo Situbondo"
                             onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'color:#666;font-size:8px;padding:5px;text-align:center;\\'><strong>LOGO</strong><br>KABUPATEN<br>SITUBONDO</div>';">
                    </div>
                    <div class="id-card-logo-label">LOGO RESMI</div>
                </div>
                
                <div class="id-card-info-area">
                    <h5 class="id-card-name">${namaDisplay}</h5>
                    
                    <div class="id-card-details">
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">NIK:</span>
                            <span class="id-card-detail-value">${nelayanData.nik}</span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">Usia:</span>
                            <span class="id-card-detail-value">${nelayanData.usia} Tahun</span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">Domisili:</span>
                            <span class="id-card-detail-value">${domisiliDisplay}</span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">Profesi:</span>
                            <span class="id-card-detail-value">
                                <span class="id-card-profesi-badge ${profesiClass}">${nelayanData.profesi}</span>
                            </span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">Status:</span>
                            <span class="id-card-detail-value">
                                <span class="id-card-status-badge ${statusClass}">${nelayanData.status}</span>
                            </span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">Alat Tangkap:</span>
                            <span class="id-card-detail-value">${alatTangkapDisplay}</span>
                        </div>
                    </div>
                </div>
                
                <div class="id-card-qr-area">
                    <div style="width: 35px; height: 35px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #ccc; border-radius: 3px;">
                        <i class="fas fa-qrcode fa-lg"></i>
                    </div>
                    <div class="id-card-qr-label">SCAN UNTUK VERIFIKASI</div>
                </div>
            </div>
            
            <div class="id-card-footer">
                <div class="id-card-id-number">ID: ${nelayanData.kodeValidasi || 'SIMATA'}</div>
                <div class="id-card-copyright">© ${new Date().getFullYear()} SIMATA - Dinas Perikanan Kab. Situbondo</div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Fungsi untuk batch generate ID Card (multiple) - DIPERBAIKI
 */
function batchGenerateIDCards(nelayanIds) {
    if (!nelayanIds || nelayanIds.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Tidak ada data nelayan yang dipilih!', 'warning');
        }
        return;
    }
    
    // Tampilkan konfirmasi
    if (!confirm(`Anda akan membuat ${nelayanIds.length} ID Card. Lanjutkan?`)) {
        return;
    }
    
    if (typeof showNotification === 'function') {
        showNotification(`Memproses ${nelayanIds.length} ID Card...`, 'info');
    }
    
    // Ambil data dari localStorage
    const appData = JSON.parse(localStorage.getItem('nelayanData') || '[]');
    
    // Filter data yang dipilih
    const selectedNelayan = appData.filter(n => nelayanIds.includes(n.id.toString()));
    
    if (selectedNelayan.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Data nelayan tidak ditemukan!', 'error');
        }
        return;
    }
    
    // Generate ID Card untuk setiap nelayan
    let processed = 0;
    const processNext = () => {
        if (processed >= selectedNelayan.length) {
            if (typeof showNotification === 'function') {
                showNotification(`✅ ${selectedNelayan.length} ID Card siap diunduh!`, 'success');
            }
            return;
        }
        
        const nelayan = selectedNelayan[processed];
        generateSimataIDCard(nelayan);
        processed++;
        
        // Tunggu sebelum memproses berikutnya
        setTimeout(processNext, 1000);
    };
    
    // Mulai proses
    processNext();
}

/**
 * Fungsi untuk menampilkan preview modal ID Card - DIPERBAIKI
 */
function showIDCardPreview(nelayanData) {
    // Inject styles terlebih dahulu
    injectIDCardStyles();
    
    // Buat modal preview
    const modalHTML = `
    <div class="modal fade" id="idCardPreviewModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"><i class="fas fa-id-card me-2"></i>Preview ID Card</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    ${previewIDCardHTML(nelayanData)}
                    <p class="text-muted small mt-3">Ini adalah preview ID Card. Klik "Download" untuk versi PDF.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    <button type="button" class="btn btn-primary" onclick="generateSimataIDCard(${JSON.stringify(nelayanData).replace(/'/g, "\\'")})">
                        <i class="fas fa-download me-2"></i>Download ID Card
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Tambahkan modal ke body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Tampilkan modal
    const modalElement = document.getElementById('idCardPreviewModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Hapus modal setelah ditutup
    modalElement.addEventListener('hidden.bs.modal', function() {
        if (modalContainer && modalContainer.parentNode) {
            document.body.removeChild(modalContainer);
        }
    });
}

/**
 * Helper function untuk mendapatkan warna berdasarkan profesi - DIPERBAIKI
 */
function getProfesiColor(profesi) {
    switch(profesi) {
        case 'Nelayan Penuh Waktu': return '#0c2461';
        case 'Nelayan Sambilan Utama': return '#e58e26';
        case 'Nelayan Sambilan Tambahan': return '#27ae60';
        default: return '#4a69bd';
    }
}

/**
 * Helper function untuk mendapatkan warna berdasarkan status - DIPERBAIKI
 */
function getStatusColor(status) {
    switch(status) {
        case 'Pemilik Kapal': return '#0984e3';
        case 'Anak Buah Kapal': return '#a55eea';
        default: return '#4a69bd';
    }
}

/**
 * Fungsi untuk mengecek ketersediaan library yang diperlukan - BARU
 */
function checkRequiredLibraries() {
    const missing = [];
    
    if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
        missing.push('jsPDF');
    }
    
    if (typeof QRCode === 'undefined') {
        missing.push('QRCode');
    }
    
    if (missing.length > 0) {
        console.warn(`Library yang diperlukan tidak ditemukan: ${missing.join(', ')}`);
        return false;
    }
    
    return true;
}

// Ekspor fungsi ke global scope
window.generateSimataIDCard = generateSimataIDCard;
window.previewIDCardHTML = previewIDCardHTML;
window.batchGenerateIDCards = batchGenerateIDCards;
window.showIDCardPreview = showIDCardPreview;
window.getProfesiColor = getProfesiColor;
window.getStatusColor = getStatusColor;
window.checkRequiredLibraries = checkRequiredLibraries;

// Inject styles saat file dimuat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectIDCardStyles);
} else {
    injectIDCardStyles();
}

console.log('✅ SIMATA ID Card Generator v3.1 loaded successfully - DESIGN IMPROVED');
