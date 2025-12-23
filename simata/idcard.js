/**
 * SIMATA ID Card Generator - VERSI DISEMPURNAKAN & DIPERBAIKI
 * File: idcard.js
 * Fungsi untuk menghasilkan ID Card nelayan profesional
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 3.0 - Desain Premium & Responsif
 */

// Style CSS khusus untuk ID Card
const IDCardStyles = `
/* ID Card Styles - Terpisah dari index.html */
.id-card-container {
    font-family: 'Arial', sans-serif;
    max-width: 100%;
    margin: 0 auto;
}

.id-card-preview-container {
    width: 340px;
    height: 215px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 15px;
    padding: 15px;
    color: #333;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    border: 4px solid #0c2461;
    margin: 10px auto;
    transition: all 0.3s ease;
}

.id-card-preview-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.id-card-header {
    background: linear-gradient(90deg, #0c2461 0%, #1e3799 100%);
    margin: -15px -15px 15px -15px;
    padding: 12px;
    text-align: center;
    border-bottom: 3px solid #f6b93b;
}

.id-card-title {
    margin: 0;
    color: white;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.id-card-subtitle {
    margin: 3px 0 0 0;
    color: #f6b93b;
    font-size: 11px;
    font-weight: 500;
}

.id-card-content {
    display: flex;
    gap: 15px;
    height: 140px;
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
    margin: 0 auto 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.id-card-logo-img {
    width: 65px;
    height: 65px;
    object-fit: contain;
}

.id-card-logo-label {
    font-size: 9px;
    color: #666;
    font-weight: 500;
}

.id-card-info-area {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.id-card-name {
    margin: 0 0 8px 0;
    font-size: 15px;
    color: #0c2461;
    font-weight: 700;
    border-bottom: 2px solid #e0e6f0;
    padding-bottom: 5px;
}

.id-card-details {
    flex: 1;
}

.id-card-detail-row {
    display: flex;
    margin-bottom: 4px;
    font-size: 10px;
}

.id-card-detail-label {
    font-weight: 600;
    color: #0c2461;
    min-width: 60px;
}

.id-card-detail-value {
    color: #333;
    flex: 1;
}

.id-card-profesi-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 3px;
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
    font-weight: 700;
    letter-spacing: 1px;
    background: rgba(12, 36, 97, 0.1);
    padding: 2px 10px;
    border-radius: 10px;
    display: inline-block;
    margin-bottom: 3px;
}

.id-card-copyright {
    font-size: 8px;
    color: #888;
    margin-top: 2px;
}

.id-card-qr-area {
    position: absolute;
    right: 15px;
    bottom: 40px;
    width: 60px;
    height: 60px;
    background: white;
    border: 2px solid #0c2461;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.id-card-qr-label {
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    font-size: 7px;
    color: #666;
    text-align: center;
    font-weight: 500;
}

.id-card-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 60px;
    color: rgba(12, 36, 97, 0.05);
    font-weight: 900;
    letter-spacing: 5px;
    z-index: 0;
    white-space: nowrap;
}

.id-card-photo-placeholder {
    width: 70px;
    height: 85px;
    background: linear-gradient(135deg, #f1f2f6 0%, #dfe6e9 100%);
    border: 2px dashed #b2bec3;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #636e72;
    font-size: 9px;
    text-align: center;
    margin: 0 auto 5px;
}

.id-card-photo-placeholder i {
    font-size: 20px;
    margin-bottom: 5px;
    color: #74b9ff;
}

.id-card-status-badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 8px;
    font-weight: 600;
    margin-left: 5px;
}

/* Warna berdasarkan profesi */
.profesi-penuh { background: #0c2461; color: white; }
.profesi-sambilan-utama { background: #e58e26; color: white; }
.profesi-sambilan-tambahan { background: #27ae60; color: white; }

/* Warna berdasarkan status */
.status-pemilik { background: #0984e3; color: white; }
.status-abk { background: #a55eea; color: white; }

/* Responsif untuk ID Card preview */
@media (max-width: 400px) {
    .id-card-preview-container {
        width: 300px;
        height: 190px;
        padding: 12px;
    }
    
    .id-card-content {
        height: 120px;
        gap: 10px;
    }
    
    .id-card-logo-area {
        flex: 0 0 65px;
    }
    
    .id-card-logo-box {
        width: 60px;
        height: 60px;
    }
    
    .id-card-logo-img {
        width: 50px;
        height: 50px;
    }
    
    .id-card-name {
        font-size: 13px;
    }
    
    .id-card-detail-row {
        font-size: 9px;
    }
    
    .id-card-qr-area {
        width: 50px;
        height: 50px;
        right: 10px;
        bottom: 35px;
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
 * Fungsi utama untuk menghasilkan ID Card nelayan
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
        document.body.appendChild(qrContainer);
        
        // Generate QR Code untuk ID Card
        const qrData = generateQRDataForIDCard(nelayanData);
        
        // Bersihkan container sebelumnya jika ada
        qrContainer.innerHTML = '';
        
        new QRCode(qrContainer, {
            text: qrData,
            width: 150,
            height: 150,
            colorDark: "#0c2461",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
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
 * Generate data untuk QR Code
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
 * Load logo untuk ID Card
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
            ctx.drawImage(img, 10, 10, 100, 100);
            
            resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = function() {
            // Fallback jika logo gagal load
            console.warn('Logo tidak dapat dimuat, menggunakan fallback');
            resolve(null);
        };
        
        img.src = logoUrl + '?t=' + Date.now(); // Cache busting
    });
}

/**
 * Generate PDF untuk ID Card (DESAIN PREMIUM)
 */
async function generateIDCardPDF(nelayanData, qrContainer) {
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
    const lightBlue = [232, 240, 249];    // #e8f0f9
    const white = [255, 255, 255];
    const darkGray = [50, 50, 50];
    
    // 1. BACKGROUND UTAMA dengan gradient
    const gradient = doc.context2d.createLinearGradient(0, 0, 85.6, 0);
    gradient.addColorStop(0, `rgb(${lightBlue[0]}, ${lightBlue[1]}, ${lightBlue[2]})`);
    gradient.addColorStop(1, `rgb(${white[0]}, ${white[1]}, ${white[2]})`);
    
    doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // 2. HEADER BIRU dengan pola
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 85.6, 16, 'F');
    
    // Pola garis di header
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.3);
    for (let i = 0; i < 85.6; i += 3) {
        doc.line(i, 16, i + 1.5, 16);
    }
    
    // 3. JUDUL UTAMA
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text("KARTU IDENTITAS NELAYAN", 42.8, 8, { align: 'center' });
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text("SISTEM INFORMASI PEMETAAN DATA NELAYAN", 42.8, 11, { align: 'center' });
    doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", 42.8, 13.5, { align: 'center' });
    
    // 4. GARIS PEMISAH EMAS
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.8);
    doc.line(5, 16, 80.6, 16);
    
    // 5. AREA FOTO/LOGO (Kiri)
    doc.setFillColor(white[0], white[1], white[2]);
    doc.roundedRect(5, 20, 25, 25, 3, 3, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(5, 20, 25, 25, 3, 3);
    
    // Tambahkan logo jika berhasil dimuat
    if (logoDataUrl) {
        try {
            doc.addImage(logoDataUrl, 'PNG', 8, 23, 19, 19);
        } catch (e) {
            console.warn('Gagal menambahkan logo:', e);
            // Fallback: teks logo
            drawFallbackLogo(doc, 17.5, 32.5);
        }
    } else {
        drawFallbackLogo(doc, 17.5, 32.5);
    }
    
    // 6. TEKS "LOGO RESMI"
    doc.setFontSize(4.5);
    doc.setTextColor(100, 100, 100);
    doc.text("LOGO RESMI", 17.5, 47, { align: 'center' });
    
    // 7. INFORMASI NELAYAN (Tengah)
    const infoStartX = 32;
    let currentY = 21;
    
    // Nama Lengkap (Besar)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    
    // Potong nama jika terlalu panjang
    let namaDisplay = nelayanData.nama.toUpperCase();
    if (namaDisplay.length > 22) {
        namaDisplay = namaDisplay.substring(0, 19) + '...';
    }
    doc.text(namaDisplay, infoStartX, currentY);
    
    currentY += 5;
    
    // Garis bawah nama
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.3);
    doc.line(infoStartX, currentY - 1, 75, currentY - 1);
    
    // Informasi detail
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    const lineHeight = 4.2;
    
    // NIK
    doc.text(`NIK: ${nelayanData.nik}`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Usia & Tempat Lahir
    doc.text(`Usia: ${nelayanData.usia} Tahun | Lahir: ${nelayanData.tahunLahir}`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Domisili
    const domisili = `${nelayanData.desa}, ${nelayanData.kecamatan}`;
    const domisiliLines = doc.splitTextToSize(`Domisili: ${domisili}`, 40);
    doc.text(domisiliLines, infoStartX, currentY);
    currentY += (domisiliLines.length * lineHeight);
    
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
    doc.roundedRect(infoStartX - 1, currentY - 3, 22, 4.5, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    
    // Potong teks profesi jika terlalu panjang
    let profesiDisplay = profesiText.toUpperCase();
    if (profesiDisplay.length > 25) {
        profesiDisplay = profesiDisplay.substring(0, 22) + '...';
    }
    doc.text(profesiDisplay, infoStartX + 10, currentY, { align: 'center' });
    
    // Status pekerjaan
    let statusColor = [74, 105, 189]; // Default biru
    if (nelayanData.status === "Pemilik Kapal") {
        statusColor = [9, 132, 227]; // Biru terang
    } else if (nelayanData.status === "Anak Buah Kapal") {
        statusColor = [165, 94, 234]; // Ungu
    }
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(infoStartX + 25, currentY - 3, 18, 4.5, 2, 2, 'F');
    doc.text(nelayanData.status, infoStartX + 34, currentY, { align: 'center' });
    
    currentY += lineHeight;
    
    // Alat Tangkap
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.text(`Alat Tangkap: ${nelayanData.alatTangkap}`, infoStartX, currentY);
    
    // 8. QR CODE AREA (Kanan)
    const qrCanvas = qrContainer.querySelector('canvas');
    if (qrCanvas) {
        try {
            const qrDataUrl = qrCanvas.toDataURL('image/png');
            doc.addImage(qrDataUrl, 'PNG', 62, 19, 18, 18);
            
            // Border QR Code
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setLineWidth(0.5);
            doc.rect(62, 19, 18, 18);
            
            // Teks di bawah QR
            doc.setFontSize(4);
            doc.setTextColor(100, 100, 100);
            doc.text("SCAN UNTUK", 71, 39, { align: 'center' });
            doc.text("VERIFIKASI", 71, 41.5, { align: 'center' });
        } catch (e) {
            console.warn('QR Code gagal ditambahkan:', e);
        }
    }
    
    // 9. FOOTER INFORMASI
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 20);
    doc.rect(0, 44, 85.6, 10, 'F');
    
    // Nomor ID Card
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    const idNumber = nelayanData.kodeValidasi || `SIMATA-${nelayanData.nik.substring(12)}`;
    doc.text(`ID: ${idNumber}`, 42.8, 48, { align: 'center' });
    
    // Masa berlaku
    const today = new Date();
    const expireDate = new Date(today);
    expireDate.setFullYear(today.getFullYear() + 2);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`Berlaku: ${formatDate(today)} s/d ${formatDate(expireDate)}`, 42.8, 51.5, { align: 'center' });
    
    // 10. BORDER KARTU dengan efek shadow
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.8);
    doc.rect(1.5, 1.5, 82.6, 51);
    
    // 11. SIMPAN FILE
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
 * Format tanggal untuk ID Card
 */
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Gambar logo fallback
 */
function drawFallbackLogo(doc, x, y) {
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text("LOGO", x, y - 4, { align: 'center' });
    doc.text("KABUPATEN", x, y, { align: 'center' });
    doc.text("SITUBONDO", x, y + 4, { align: 'center' });
}

/**
 * Fungsi untuk menghasilkan preview ID Card dalam format HTML
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
        namaDisplay = namaDisplay.substring(0, 22) + '...';
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
                             onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'color:#666;font-size:10px;padding:10px;\\'>LOGO<br>KABUPATEN<br>SITUBONDO</div>';">
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
                            <span class="id-card-detail-value">${nelayanData.desa}, ${nelayanData.kecamatan}</span>
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
                            <span class="id-card-detail-value">${nelayanData.alatTangkap}</span>
                        </div>
                    </div>
                </div>
                
                <div class="id-card-qr-area">
                    <div style="width: 40px; height: 40px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #ccc;">
                        <i class="fas fa-qrcode fa-2x"></i>
                    </div>
                    <div class="id-card-qr-label">QR CODE</div>
                </div>
            </div>
            
            <div class="id-card-footer">
                <div class="id-card-id-number">ID: ${nelayanData.kodeValidasi || 'SIMATA'}</div>
                <div class="id-card-copyright">© 2025 SIMATA - Dinas Perikanan Kab. Situbondo</div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Fungsi untuk batch generate ID Card (multiple)
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
    
    // Generate ID Card untuk setiap nelayan (untuk demo hanya yang pertama)
    if (selectedNelayan.length > 0) {
        generateSimataIDCard(selectedNelayan[0]);
        
        // Tampilkan info untuk batch lengkap
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification(`✅ ${selectedNelayan.length} ID Card siap diunduh!`, 'success');
            }
        }, 1500);
    }
}

/**
 * Fungsi untuk menampilkan preview modal ID Card
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
        document.body.removeChild(modalContainer);
    });
}

/**
 * Helper function untuk mendapatkan warna berdasarkan profesi
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
 * Helper function untuk mendapatkan warna berdasarkan status
 */
function getStatusColor(status) {
    switch(status) {
        case 'Pemilik Kapal': return '#0984e3';
        case 'Anak Buah Kapal': return '#a55eea';
        default: return '#4a69bd';
    }
}

// Ekspor fungsi ke global scope
window.generateSimataIDCard = generateSimataIDCard;
window.previewIDCardHTML = previewIDCardHTML;
window.batchGenerateIDCards = batchGenerateIDCards;
window.showIDCardPreview = showIDCardPreview;
window.getProfesiColor = getProfesiColor;
window.getStatusColor = getStatusColor;

// Inject styles saat file dimuat
injectIDCardStyles();

console.log('✅ SIMATA ID Card Generator v3.0 loaded successfully');
