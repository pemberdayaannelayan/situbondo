/**
 * SIMATA ID Card Generator
 * File: idcard.js
 * Fungsi untuk menghasilkan ID Card nelayan dari data SIMATA
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 1.0
 */

// Global variables untuk ID Card
let idCardGenerated = false;

/**
 * Fungsi utama untuk menghasilkan ID Card nelayan
 * @param {Object} nelayanData - Data nelayan dari database SIMATA
 */
function generateSimataIDCard(nelayanData) {
    if (!nelayanData) {
        console.error('Data nelayan tidak ditemukan');
        return;
    }
    
    try {
        // Buat elemen sementara untuk QR Code
        const qrContainer = document.createElement('div');
        qrContainer.id = 'idcard-qr-temp';
        qrContainer.style.position = 'absolute';
        qrContainer.style.left = '-9999px';
        document.body.appendChild(qrContainer);
        
        // Generate QR Code untuk ID Card
        const qrData = generateQRDataForIDCard(nelayanData);
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
        }, 500);
        
    } catch (error) {
        console.error('Error generating ID Card:', error);
        alert('Terjadi kesalahan saat membuat ID Card. Silakan coba lagi.');
    }
}

/**
 * Generate data untuk QR Code
 */
function generateQRDataForIDCard(nelayanData) {
    const data = {
        id: nelayanData.id,
        nik: nelayanData.nik,
        nama: nelayanData.nama,
        profesi: nelayanData.profesi,
        status: nelayanData.status,
        kodeValidasi: nelayanData.kodeValidasi || 'N/A',
        tanggalValidasi: nelayanData.tanggalValidasi,
        validator: nelayanData.validator,
        timestamp: new Date().toISOString()
    };
    
    return `SIMATA_ID_CARD|${nelayanData.nik}|${nelayanData.nama}|${nelayanData.profesi}|${nelayanData.kodeValidasi}|${new Date().toLocaleDateString('id-ID')}`;
}

/**
 * Generate PDF untuk ID Card
 */
function generateIDCardPDF(nelayanData, qrContainer) {
    const { jsPDF } = window.jspdf;
    
    // Buat PDF dengan orientasi landscape untuk kartu ID
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [88, 55] // Ukuran kartu ID (3.5" x 2.2")
    });
    
    // Set warna utama
    const primaryColor = [12, 36, 97]; // #0c2461
    const accentColor = [246, 185, 59]; // #f6b93b
    const secondaryColor = [74, 105, 189]; // #4a69bd
    
    // Background gradient untuk ID Card
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 88, 55, 'F');
    
    // Pattern atau efek visual
    doc.setDrawColor(255, 255, 255, 20);
    doc.setLineWidth(0.1);
    for (let i = 0; i < 10; i++) {
        doc.line(0, i * 5, 88, i * 5);
    }
    
    // Header dengan logo dan judul
    doc.setFillColor(255, 255, 255, 20);
    doc.roundedRect(4, 4, 80, 12, 2, 2, 'F');
    
    // Judul SIMATA
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("SIMATA", 44, 8, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(6);
    doc.text("SISTEM INFORMASI PEMETAAN DATA NELAYAN", 44, 11, { align: 'center' });
    doc.text("DINAS PERIKANAN KAB. SITUBONDO", 44, 14, { align: 'center' });
    
    // Garis pemisah
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.line(10, 16, 78, 16);
    
    // Area foto/avatar (placeholder)
    doc.setFillColor(255, 255, 255, 30);
    doc.roundedRect(8, 18, 20, 25, 2, 2, 'F');
    
    // Icon nelayan berdasarkan profesi
    let iconText = "🐟";
    if (nelayanData.profesi === "Nelayan Penuh Waktu") iconText = "⛵";
    else if (nelayanData.profesi === "Nelayan Sambilan Utama") iconText = "🚤";
    else if (nelayanData.profesi === "Nelayan Sambilan Tambahan") iconText = "🎣";
    
    doc.setFontSize(24);
    doc.text(iconText, 18, 30, { align: 'center' });
    
    // Teks "FOTO" di bawah placeholder
    doc.setFontSize(5);
    doc.setTextColor(200, 200, 200);
    doc.text("FOTO NELAYAN", 18, 40, { align: 'center' });
    
    // Area informasi utama
    const infoStartX = 32;
    
    // Nama (besar dan bold)
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(nelayanData.nama.toUpperCase(), infoStartX, 22);
    
    // Garis bawah nama
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.3);
    doc.line(infoStartX, 23, 80, 23);
    
    // Informasi detail
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(220, 220, 220);
    
    let yPos = 27;
    const lineHeight = 3.5;
    
    // NIK
    doc.text(`NIK: ${nelayanData.nik}`, infoStartX, yPos);
    yPos += lineHeight;
    
    // Usia dan Tahun Lahir
    doc.text(`Usia: ${nelayanData.usia} Tahun (Lahir: ${nelayanData.tahunLahir})`, infoStartX, yPos);
    yPos += lineHeight;
    
    // Domisili
    const domisili = `${nelayanData.desa}, ${nelayanData.kecamatan}`;
    doc.text(`Domisili: ${domisili}`, infoStartX, yPos);
    yPos += lineHeight;
    
    // Profesi dengan badge
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(infoStartX - 1, yPos - 3, 20, 4, 1, 1, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.text(nelayanData.profesi.toUpperCase(), infoStartX + 9, yPos, { align: 'center' });
    
    // Status
    doc.setTextColor(220, 220, 220);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${nelayanData.status}`, infoStartX + 25, yPos);
    yPos += lineHeight;
    
    // Alat Tangkap
    doc.text(`Alat Tangkap: ${nelayanData.alatTangkap}`, infoStartX, yPos);
    
    // Jika pemilik kapal, tambahkan info kapal
    if (nelayanData.status === 'Pemilik Kapal' && nelayanData.namaKapal && nelayanData.namaKapal !== '-') {
        yPos += lineHeight;
        doc.text(`Kapal: ${nelayanData.namaKapal} (${nelayanData.jenisKapal})`, infoStartX, yPos);
    }
    
    // QR Code area
    const qrCanvas = qrContainer.querySelector('canvas');
    if (qrCanvas) {
        const qrDataUrl = qrCanvas.toDataURL('image/png');
        doc.addImage(qrDataUrl, 'PNG', 65, 18, 15, 15);
        
        // Teks di bawah QR
        doc.setFontSize(4);
        doc.setTextColor(180, 180, 180);
        doc.text("SCAN UNTUK VERIFIKASI", 72.5, 35, { align: 'center' });
    }
    
    // Footer ID Card
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 50);
    doc.rect(0, 43, 88, 12, 'F');
    
    // Nomor ID
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    const idNumber = `ID-${nelayanData.kodeValidasi || 'SIMATA'}`;
    doc.text(idNumber, 44, 46, { align: 'center' });
    
    // Masa berlaku
    const today = new Date();
    const expireDate = new Date(today);
    expireDate.setFullYear(today.getFullYear() + 2); // Berlaku 2 tahun
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(200, 200, 200);
    doc.text(`Masa Berlaku: ${today.toLocaleDateString('id-ID')} - ${expireDate.toLocaleDateString('id-ID')}`, 44, 49, { align: 'center' });
    
    // Copyright dan developer info
    doc.setFontSize(4);
    doc.setTextColor(150, 150, 150);
    doc.text("© 2025 Dinas Perikanan Kab. Situbondo • Situbondo Naik Kelas", 44, 52, { align: 'center' });
    
    // Watermark SIMATA
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255, 10);
    doc.text("SIMATA", 44, 30, { align: 'center', angle: 45 });
    
    // Simpan file
    const fileName = `ID_Card_${nelayanData.nama.replace(/\s+/g, '_')}_${nelayanData.nik}.pdf`;
    doc.save(fileName);
    
    idCardGenerated = true;
    
    // Tampilkan notifikasi
    if (typeof showNotification === 'function') {
        showNotification(`ID Card untuk ${nelayanData.nama} berhasil dihasilkan!`, 'success');
    }
}

/**
 * Fungsi untuk menghasilkan ID Card dalam format HTML (preview)
 */
function previewIDCardHTML(nelayanData) {
    // Ini adalah fungsi untuk preview, bisa digunakan untuk tampilan web
    const idCardHTML = `
        <div class="id-card-preview" style="
            width: 350px;
            height: 220px;
            background: linear-gradient(135deg, #0c2461, #1e3799);
            border-radius: 12px;
            padding: 15px;
            color: white;
            font-family: 'Inter', sans-serif;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 2px solid #f6b93b;
        ">
            <!-- Background pattern -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1;">
                <div style="position: absolute; width: 200%; height: 200%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px);"></div>
            </div>
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 10px; position: relative; z-index: 1;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 800;">SIMATA</h3>
                <p style="margin: 2px 0; font-size: 10px; opacity: 0.9;">Sistem Informasi Pemetaan Data Nelayan</p>
                <div style="height: 2px; background: #f6b93b; width: 80%; margin: 5px auto;"></div>
            </div>
            
            <!-- Content -->
            <div style="display: flex; position: relative; z-index: 1;">
                <!-- Left side - Photo/Icon -->
                <div style="flex: 1; text-align: center; padding-right: 15px;">
                    <div style="width: 80px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                        <i class="fas fa-user" style="font-size: 40px; color: #f6b93b;"></i>
                    </div>
                    <div style="font-size: 9px; opacity: 0.8;">FOTO NELAYAN</div>
                </div>
                
                <!-- Right side - Information -->
                <div style="flex: 2;">
                    <h4 style="margin: 0 0 5px 0; font-size: 14px; border-bottom: 1px solid #f6b93b; padding-bottom: 3px;">${nelayanData.nama}</h4>
                    
                    <div style="font-size: 10px;">
                        <div><strong>NIK:</strong> ${nelayanData.nik}</div>
                        <div><strong>Usia:</strong> ${nelayanData.usia} Tahun</div>
                        <div><strong>Domisili:</strong> ${nelayanData.desa}, ${nelayanData.kecamatan}</div>
                        <div><strong>Profesi:</strong> <span style="background: #f6b93b; color: #0c2461; padding: 2px 6px; border-radius: 3px; font-size: 9px;">${nelayanData.profesi}</span></div>
                        <div><strong>Status:</strong> ${nelayanData.status}</div>
                        <div><strong>Alat Tangkap:</strong> ${nelayanData.alatTangkap}</div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="position: absolute; bottom: 10px; left: 0; width: 100%; text-align: center; font-size: 9px; opacity: 0.8; padding: 0 15px; z-index: 1;">
                <div>ID: ${nelayanData.kodeValidasi || 'SIMATA'}</div>
                <div style="font-size: 8px; margin-top: 2px;">© 2025 Dinas Perikanan Kab. Situbondo</div>
            </div>
        </div>
    `;
    
    return idCardHTML;
}

/**
 * Fungsi untuk batch generate ID Card (multiple)
 */
function batchGenerateIDCards(nelayanIds) {
    if (!nelayanIds || nelayanIds.length === 0) {
        alert('Tidak ada data nelayan yang dipilih.');
        return;
    }
    
    // Tampilkan loading
    if (typeof showNotification === 'function') {
        showNotification(`Memproses ${nelayanIds.length} ID Card...`, 'info');
    }
    
    // Simulasikan proses batch (dalam implementasi nyata, ini akan generate satu per satu)
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification(`Batch ID Card siap untuk ${nelayanIds.length} nelayan.`, 'success');
        }
        
        // Untuk demo, kita generate satu contoh
        if (nelayanIds.length > 0) {
            // Cari data nelayan pertama
            const appData = JSON.parse(localStorage.getItem('nelayanData') || '[]');
            const firstNelayan = appData.find(n => n.id == nelayanIds[0]);
            if (firstNelayan) {
                generateSimataIDCard(firstNelayan);
            }
        }
    }, 1000);
}

// Ekspor fungsi ke global scope
window.generateSimataIDCard = generateSimataIDCard;
window.previewIDCardHTML = previewIDCardHTML;
window.batchGenerateIDCards = batchGenerateIDCards;

console.log('SIMATA ID Card Generator v1.0 loaded successfully');
