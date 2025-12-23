/**
 * SIMATA ID Card Generator - VERSI DISEMPURNAKAN & DIPERBAIKI
 * File: idcard.js
 * Fungsi untuk menghasilkan ID Card nelayan profesional
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 6.0 - Desain Premium & Responsif (FIXED)
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
    width: 360px;
    height: 225px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 15px;
    padding: 15px;
    color: #333;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(12, 36, 97, 0.18);
    border: 3px solid #0c2461;
    margin: 15px auto;
    transition: all 0.3s ease;
    font-size: 11px;
}

.id-card-preview-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(12, 36, 97, 0.25);
}

.id-card-header {
    background: linear-gradient(90deg, #0c2461 0%, #1e3799 100%);
    margin: -15px -15px 12px -15px;
    padding: 12px;
    text-align: center;
    border-bottom: 3px solid #f6b93b;
    position: relative;
    overflow: hidden;
}

.id-card-title {
    margin: 0;
    color: white;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.8px;
    line-height: 1.2;
    text-transform: uppercase;
}

.id-card-subtitle {
    margin: 3px 0 0 0;
    color: #f6b93b;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.id-card-content {
    display: flex;
    gap: 12px;
    height: 145px;
    position: relative;
    margin-top: 5px;
}

.id-card-logo-area {
    flex: 0 0 80px;
    text-align: center;
}

.id-card-logo-box {
    width: 75px;
    height: 75px;
    background: white;
    border-radius: 8px;
    border: 2px solid #0c2461;
    margin: 0 auto 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    padding: 4px;
}

.id-card-logo-img {
    width: 65px;
    height: 65px;
    object-fit: contain;
    border-radius: 5px;
}

.id-card-logo-label {
    font-size: 9px;
    color: #666;
    font-weight: 700;
    margin-top: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.id-card-info-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 80px;
}

.id-card-name {
    margin: 0 0 8px 0;
    font-size: 15px;
    color: #0c2461;
    font-weight: 800;
    border-bottom: 2px solid #e0e6f0;
    padding-bottom: 5px;
    line-height: 1.3;
    text-transform: uppercase;
}

.id-card-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.id-card-detail-row {
    display: flex;
    margin-bottom: 4px;
    font-size: 10px;
    line-height: 1.4;
    align-items: flex-start;
}

.id-card-detail-label {
    font-weight: 700;
    color: #0c2461;
    min-width: 55px;
    flex-shrink: 0;
    text-transform: uppercase;
}

.id-card-detail-value {
    color: #333;
    flex: 1;
    word-break: break-word;
    font-weight: 500;
}

.id-card-profesi-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.id-card-footer {
    position: absolute;
    bottom: 8px;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 0 15px;
}

.id-card-id-number {
    font-size: 9px;
    color: #0c2461;
    font-weight: 800;
    letter-spacing: 1px;
    background: rgba(12, 36, 97, 0.1);
    padding: 4px 12px;
    border-radius: 10px;
    display: inline-block;
    margin-bottom: 3px;
    border: 1px solid rgba(12, 36, 97, 0.15);
    text-transform: uppercase;
}

.id-card-copyright {
    font-size: 8px;
    color: #888;
    margin-top: 2px;
    letter-spacing: 0.5px;
}

.id-card-qr-area {
    position: absolute;
    right: 15px;
    bottom: 35px;
    width: 65px;
    height: 65px;
    background: white;
    border: 2px solid #0c2461;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 4px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.id-card-qr-label {
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    font-size: 7px;
    color: #666;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
}

.id-card-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 72px;
    color: rgba(12, 36, 97, 0.05);
    font-weight: 900;
    letter-spacing: 8px;
    z-index: 0;
    white-space: nowrap;
    opacity: 0.4;
    text-transform: uppercase;
}

.id-card-photo-placeholder {
    width: 75px;
    height: 90px;
    background: linear-gradient(135deg, #f1f2f6 0%, #dfe6e9 100%);
    border: 2px dashed #b2bec3;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #636e72;
    font-size: 9px;
    text-align: center;
    margin: 0 auto 6px;
}

.id-card-photo-placeholder i {
    font-size: 20px;
    margin-bottom: 6px;
    color: #74b9ff;
}

.id-card-status-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 5px;
    font-size: 8px;
    font-weight: 700;
    margin-left: 5px;
    text-transform: uppercase;
}

/* Warna berdasarkan profesi - DIPERBAIKI */
.profesi-penuh { background: linear-gradient(135deg, #0c2461 0%, #1e3799 100%); color: white; }
.profesi-sambilan-utama { background: linear-gradient(135deg, #e58e26 0%, #f39c12 100%); color: white; }
.profesi-sambilan-tambahan { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; }

/* Warna berdasarkan status - DIPERBAIKI */
.status-pemilik { background: linear-gradient(135deg, #0984e3 0%, #74b9ff 100%); color: white; }
.status-abk { background: linear-gradient(135deg, #a55eea 0%, #8854d0 100%); color: white; }

/* Loading untuk ID Card */
.idcard-loading {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.85);
    z-index: 9999;
    align-items: center;
    justify-content: center;
}

.idcard-loading.active {
    display: flex;
}

.idcard-loading-content {
    background: white;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    border: 3px solid #0c2461;
    max-width: 350px;
    width: 90%;
}

.idcard-loading-content .spinner-border {
    width: 60px;
    height: 60px;
    border-width: 5px;
}

.idcard-loading-content h6 {
    margin-top: 20px;
    color: #0c2461;
    font-weight: 700;
}

.idcard-loading-content p {
    color: #666;
    font-size: 14px;
}

/* Responsif untuk ID Card preview - DIPERBAIKI */
@media (max-width: 400px) {
    .id-card-preview-container {
        width: 320px;
        height: 200px;
        padding: 12px;
    }
    
    .id-card-content {
        height: 125px;
        gap: 10px;
    }
    
    .id-card-logo-area {
        flex: 0 0 70px;
    }
    
    .id-card-logo-box {
        width: 65px;
        height: 65px;
    }
    
    .id-card-logo-img {
        width: 55px;
        height: 55px;
    }
    
    .id-card-name {
        font-size: 13px;
        margin-bottom: 6px;
    }
    
    .id-card-detail-row {
        font-size: 9px;
        margin-bottom: 3px;
    }
    
    .id-card-detail-label {
        min-width: 50px;
    }
    
    .id-card-qr-area {
        width: 55px;
        height: 55px;
        right: 10px;
        bottom: 30px;
    }
    
    .id-card-title {
        font-size: 14px;
    }
    
    .id-card-subtitle {
        font-size: 9px;
    }
    
    .id-card-watermark {
        font-size: 60px;
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
        if (loadingEl) {
            loadingEl.classList.add('active');
            // Update loading text dengan nama nelayan
            const loadingText = loadingEl.querySelector('h6');
            if (loadingText) {
                loadingText.textContent = `Membuat ID Card untuk ${nelayanData.nama}`;
            }
        }
        
        // Buat elemen sementara untuk QR Code
        const qrContainer = document.createElement('div');
        qrContainer.id = 'idcard-qr-temp';
        qrContainer.style.position = 'absolute';
        qrContainer.style.left = '-9999px';
        qrContainer.style.width = '200px';
        qrContainer.style.height = '200px';
        qrContainer.style.zIndex = '-9999';
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
                width: 200,
                height: 200,
                colorDark: "#0c2461",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (qrError) {
            console.error('Error membuat QR Code:', qrError);
            // Fallback jika QR gagal
            qrContainer.innerHTML = '<div style="background:#0c2461;color:white;width:200px;height:200px;display:flex;align-items:center;justify-content:center;font-size:14px;border-radius:5px;font-weight:bold;">SIMATA ID</div>';
        }
        
        // Tunggu QR Code digenerate, lalu buat PDF
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
        nama: nelayanData.nama.toUpperCase(),
        profesi: nelayanData.profesi,
        status: nelayanData.status,
        kodeValidasi: nelayanData.kodeValidasi || 'N/A',
        tanggalValidasi: nelayanData.tanggalValidasi,
        domisili: `${nelayanData.desa}, ${nelayanData.kecamatan}`.toUpperCase(),
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
            canvas.width = 150;
            canvas.height = 150;
            
            // Draw logo dengan background putih
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Hitung posisi untuk centering
            const size = Math.min(canvas.width, canvas.height) * 0.85;
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
    const lightBlue = [240, 245, 255];    // #f0f5ff
    const white = [255, 255, 255];
    const darkGray = [40, 40, 40];
    const lightGray = [240, 240, 240];
    
    // 1. BACKGROUND UTAMA dengan gradient
    doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // 2. HEADER BIRU dengan pola lebih rapi
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(2, 2, 81.6, 10, 2, 2, 'F');
    
    // Garis emas di header
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.line(2, 12, 83.6, 12);
    
    // 3. JUDUL UTAMA
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text("KARTU IDENTITAS NELAYAN", 42.8, 6.5, { align: 'center' });
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text("SISTEM INFORMASI PEMETAAN DATA NELAYAN", 42.8, 8.5, { align: 'center' });
    doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", 42.8, 10, { align: 'center' });
    
    // 4. AREA LOGO (Kiri)
    doc.setFillColor(white[0], white[1], white[2]);
    doc.roundedRect(5, 15, 20, 20, 2, 2, 'F');
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(5, 15, 20, 20, 2, 2);
    
    // Tambahkan logo jika berhasil dimuat
    if (logoDataUrl) {
        try {
            doc.addImage(logoDataUrl, 'PNG', 6, 16, 18, 18);
        } catch (e) {
            console.warn('Gagal menambahkan logo:', e);
            drawFallbackLogo(doc, 15, 25);
        }
    } else {
        drawFallbackLogo(doc, 15, 25);
    }
    
    // 5. TEKS "LOGO RESMI"
    doc.setFontSize(4.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text("LOGO RESMI", 15, 36.5, { align: 'center' });
    
    // 6. INFORMASI NELAYAN (Tengah)
    const infoStartX = 28;
    let currentY = 16;
    
    // Nama Lengkap (Besar)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    
    // Potong nama jika terlalu panjang
    let namaDisplay = nelayanData.nama.toUpperCase();
    if (namaDisplay.length > 20) {
        namaDisplay = namaDisplay.substring(0, 18) + '...';
    }
    doc.text(namaDisplay, infoStartX, currentY);
    
    currentY += 5;
    
    // Garis bawah nama
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.2);
    doc.line(infoStartX, currentY - 1, 70, currentY - 1);
    
    // Informasi detail
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    const lineHeight = 4.5;
    
    // NIK
    doc.text(`NIK: ${nelayanData.nik}`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Usia
    doc.text(`Usia: ${nelayanData.usia} Tahun`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Domisili
    const domisili = `${nelayanData.desa}, ${nelayanData.kecamatan}`;
    let domisiliDisplay = domisili;
    if (domisiliDisplay.length > 25) {
        domisiliDisplay = domisiliDisplay.substring(0, 23) + '...';
    }
    doc.text(`Domisili: ${domisiliDisplay}`, infoStartX, currentY);
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
    doc.roundedRect(infoStartX - 0.5, currentY - 2.8, 22, 4.5, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    
    // Potong teks profesi jika terlalu panjang
    let profesiDisplay = profesiText.toUpperCase();
    if (profesiDisplay.length > 20) {
        profesiDisplay = profesiDisplay.substring(0, 18) + '...';
    }
    doc.text(profesiDisplay, infoStartX + 10.5, currentY - 0.5, { align: 'center' });
    
    // Status pekerjaan
    let statusColor = [74, 105, 189]; // Default biru
    if (nelayanData.status === "Pemilik Kapal") {
        statusColor = [9, 132, 227]; // Biru terang
    } else if (nelayanData.status === "Anak Buah Kapal") {
        statusColor = [165, 94, 234]; // Ungu
    }
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(infoStartX + 24, currentY - 2.8, 18, 4.5, 2, 2, 'F');
    doc.text(nelayanData.status.toUpperCase(), infoStartX + 33, currentY - 0.5, { align: 'center' });
    
    currentY += lineHeight;
    
    // Alat Tangkap
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    
    let alatTangkap = nelayanData.alatTangkap;
    if (alatTangkap.length > 20) {
        alatTangkap = alatTangkap.substring(0, 18) + '...';
    }
    doc.text(`Alat: ${alatTangkap}`, infoStartX, currentY);
    
    // 7. QR CODE AREA (Kanan)
    const qrCanvas = qrContainer.querySelector('canvas');
    if (qrCanvas) {
        try {
            const qrDataUrl = qrCanvas.toDataURL('image/png');
            
            // Background putih untuk QR Code
            doc.setFillColor(white[0], white[1], white[2]);
            doc.roundedRect(62, 15, 18, 18, 2, 2, 'F');
            
            // Tambahkan QR Code
            doc.addImage(qrDataUrl, 'PNG', 63, 16, 16, 16);
            
            // Border QR Code
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setLineWidth(0.4);
            doc.roundedRect(62, 15, 18, 18, 2, 2);
            
            // Teks di bawah QR
            doc.setFontSize(4);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'bold');
            doc.text("SCAN UNTUK", 71, 35, { align: 'center' });
            doc.text("VERIFIKASI", 71, 37.5, { align: 'center' });
        } catch (e) {
            console.warn('QR Code gagal ditambahkan:', e);
            // Fallback untuk QR
            doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
            doc.roundedRect(62, 15, 18, 18, 2, 2, 'F');
            doc.setDrawColor(200, 200, 200);
            doc.roundedRect(62, 15, 18, 18, 2, 2);
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(6);
            doc.setFont('helvetica', 'bold');
            doc.text("QR", 71, 23, { align: 'center' });
            doc.text("CODE", 71, 26, { align: 'center' });
        }
    }
    
    // 8. FOOTER INFORMASI
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 15);
    doc.roundedRect(2, 38, 81.6, 8, 2, 2, 'F');
    
    // Nomor ID Card
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    const idNumber = nelayanData.kodeValidasi || `SIMATA-${nelayanData.nik.substring(12)}`;
    let idNumberDisplay = `ID: ${idNumber}`;
    if (idNumberDisplay.length > 25) {
        idNumberDisplay = idNumberDisplay.substring(0, 23) + '...';
    }
    doc.text(idNumberDisplay, 42.8, 42, { align: 'center' });
    
    // Masa berlaku
    const today = new Date();
    const expireDate = new Date(today);
    expireDate.setFullYear(today.getFullYear() + 2);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(80, 80, 80);
    doc.text(`Berlaku: ${formatDate(today)} - ${formatDate(expireDate)}`, 42.8, 45.5, { align: 'center' });
    
    // 9. WATERMARK BACKGROUND
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2], 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text("SIMATA", 42.8, 28, { align: 'center', angle: 30 });
    
    // 10. BORDER KARTU
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(1, 1, 83.6, 52, 3, 3);
    
    // 11. SIMPAN FILE
    const fileName = `ID_CARD_${nelayanData.nama.replace(/\s+/g, '_').toUpperCase()}_${nelayanData.nik}.pdf`;
    
    // Tunggu sejenak sebelum menyimpan
    setTimeout(() => {
        try {
            doc.save(fileName);
            idCardGenerated = true;
            
            // Tampilkan notifikasi sukses
            if (typeof showNotification === 'function') {
                showNotification(`✅ ID Card ${nelayanData.nama} berhasil dibuat!`, 'success');
            }
        } catch (saveError) {
            console.error('Error saving PDF:', saveError);
            showNotification('Gagal menyimpan ID Card. Coba lagi!', 'error');
        }
    }, 500);
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
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(x - 8, y - 6, 16, 12, 1, 1, 'F');
    
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
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
    let namaDisplay = nelayanData.nama.toUpperCase();
    if (namaDisplay.length > 22) {
        namaDisplay = namaDisplay.substring(0, 20) + '...';
    }
    
    // Potong domisili jika terlalu panjang
    let domisiliDisplay = `${nelayanData.desa}, ${nelayanData.kecamatan}`.toUpperCase();
    if (domisiliDisplay.length > 28) {
        domisiliDisplay = domisiliDisplay.substring(0, 26) + '...';
    }
    
    // Potong alat tangkap jika terlalu panjang
    let alatTangkapDisplay = nelayanData.alatTangkap;
    if (alatTangkapDisplay.length > 22) {
        alatTangkapDisplay = alatTangkapDisplay.substring(0, 20) + '...';
    }
    
    // Format NIK untuk display
    const nikDisplay = nelayanData.nik;
    
    return `
    <div class="id-card-container">
        <div class="id-card-preview-container">
            <div class="id-card-watermark">SIMATA</div>
            
            <div class="id-card-header">
                <h4 class="id-card-title">KARTU IDENTITAS NELAYAN</h4>
                <p class="id-card-subtitle">DINAS PERIKANAN KABUPATEN SITUBONDO</p>
            </div>
            
            <div class="id-card-content">
                <div class="id-card-logo-area">
                    <div class="id-card-logo-box">
                        <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png" 
                             class="id-card-logo-img" 
                             alt="Logo Situbondo"
                             onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#0c2461;font-weight:bold;font-size:10px;text-align:center;\\'><div>LOGO</div><div>KABUPATEN</div><div>SITUBONDO</div></div>';">
                    </div>
                    <div class="id-card-logo-label">LOGO RESMI</div>
                </div>
                
                <div class="id-card-info-area">
                    <h5 class="id-card-name">${namaDisplay}</h5>
                    
                    <div class="id-card-details">
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">NIK:</span>
                            <span class="id-card-detail-value">${nikDisplay}</span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">USIA:</span>
                            <span class="id-card-detail-value">${nelayanData.usia} TAHUN</span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">DOMISILI:</span>
                            <span class="id-card-detail-value">${domisiliDisplay}</span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">PROFESI:</span>
                            <span class="id-card-detail-value">
                                <span class="id-card-profesi-badge ${profesiClass}">${nelayanData.profesi.toUpperCase()}</span>
                            </span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">STATUS:</span>
                            <span class="id-card-detail-value">
                                <span class="id-card-status-badge ${statusClass}">${nelayanData.status.toUpperCase()}</span>
                            </span>
                        </div>
                        <div class="id-card-detail-row">
                            <span class="id-card-detail-label">ALAT TANGKAP:</span>
                            <span class="id-card-detail-value">${alatTangkapDisplay}</span>
                        </div>
                    </div>
                </div>
                
                <div class="id-card-qr-area">
                    <div style="width: 45px; height: 45px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #ccc; border-radius: 4px; border: 1px solid #ddd;">
                        <i class="fas fa-qrcode fa-lg"></i>
                    </div>
                    <div class="id-card-qr-label">SCAN UNTUK VERIFIKASI</div>
                </div>
            </div>
            
            <div class="id-card-footer">
                <div class="id-card-id-number">ID: ${nelayanData.kodeValidasi || 'SIMATA'}</div>
                <div class="id-card-copyright">© ${new Date().getFullYear()} SIMATA - DINAS PERIKANAN KAB. SITUBONDO</div>
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
        setTimeout(processNext, 1500);
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
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"><i class="fas fa-id-card me-2"></i>Preview ID Card</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    ${previewIDCardHTML(nelayanData)}
                    <div class="alert alert-info mt-3 mb-0">
                        <i class="fas fa-info-circle me-2"></i>
                        Ini adalah preview ID Card. Klik "Download" untuk mendapatkan versi PDF resmi.
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    <button type="button" class="btn btn-primary" onclick="generateSimataIDCard(${JSON.stringify(nelayanData).replace(/'/g, "\\'")})">
                        <i class="fas fa-download me-2"></i>Download ID Card (PDF)
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

console.log('✅ SIMATA ID Card Generator v6.0 loaded successfully - DESIGN IMPROVED & FIXED');
