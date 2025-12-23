/**
 * SIMATA ID Card Generator - VERSI DISEMPURNAKAN
 * File: idcard.js
 * Fungsi untuk menghasilkan ID Card nelayan profesional
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 2.0 - Perbaikan Desain & Logo Resmi
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
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    try {
        // Tampilkan loading
        showNotification('Sedang membuat ID Card...', 'info');
        
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
            width: 120,
            height: 120,
            colorDark: "#0c2461",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Tunggu QR Code digenerate
        setTimeout(() => {
            generateIDCardPDF(nelayanData, qrContainer);
            document.body.removeChild(qrContainer);
        }, 800);
        
    } catch (error) {
        console.error('Error generating ID Card:', error);
        showNotification('Terjadi kesalahan saat membuat ID Card!', 'error');
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
        timestamp: new Date().toISOString(),
        verification_url: "https://disnakansitubondo.com/simata/verify"
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
            canvas.width = 150;
            canvas.height = 150;
            
            // Draw logo dengan background putih
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 25, 25, 100, 100);
            
            resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = function() {
            // Fallback jika logo gagal load
            console.warn('Logo tidak dapat dimuat, menggunakan fallback');
            resolve(null);
        };
        
        img.src = logoUrl;
    });
}

/**
 * Generate PDF untuk ID Card (DESAIN BARU & PROFESIONAL)
 */
async function generateIDCardPDF(nelayanData, qrContainer) {
    const { jsPDF } = window.jspdf;
    
    // Muat logo terlebih dahulu
    const logoDataUrl = await loadLogoForIDCard();
    
    // Buat PDF dengan orientasi landscape untuk kartu ID
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54] // Ukuran standar kartu ID (CR80)
    });
    
    // Warna tema SIMATA
    const primaryColor = [12, 36, 97];    // #0c2461
    const accentColor = [246, 185, 59];   // #f6b93b
    const secondaryColor = [74, 105, 189]; // #4a69bd
    const lightBlue = [232, 240, 249];    // #e8f0f9
    
    // 1. BACKGROUND UTAMA
    doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // 2. HEADER BIRU ATAS
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 85.6, 15, 'F');
    
    // 3. JUDUL UTAMA
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text("KARTU IDENTITAS NELAYAN", 42.8, 7, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text("SISTEM INFORMASI PEMETAAN DATA NELAYAN (SIMATA)", 42.8, 10, { align: 'center' });
    doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", 42.8, 12.5, { align: 'center' });
    
    // 4. GARIS PEMISAH EMAS
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.8);
    doc.line(5, 15, 80.6, 15);
    
    // 5. AREA FOTO/LOGO
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(5, 18, 25, 25, 2, 2, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(5, 18, 25, 25, 2, 2);
    
    // Tambahkan logo jika berhasil dimuat
    if (logoDataUrl) {
        try {
            doc.addImage(logoDataUrl, 'PNG', 8, 21, 19, 19);
        } catch (e) {
            console.warn('Gagal menambahkan logo:', e);
            // Fallback: teks "LOGO"
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text("LOGO", 17.5, 30, { align: 'center' });
            doc.text("KABUPATEN", 17.5, 34, { align: 'center' });
            doc.text("SITUBONDO", 17.5, 38, { align: 'center' });
        }
    }
    
    // 6. TEKS "FOTO RESMI"
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    doc.text("LOGO RESMI", 17.5, 44, { align: 'center' });
    
    // 7. INFORMASI NELAYAN (Bagian Kanan)
    const infoStartX = 32;
    let currentY = 20;
    
    // Nama Lengkap (Besar)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    
    // Potong nama jika terlalu panjang
    let namaDisplay = nelayanData.nama.toUpperCase();
    if (namaDisplay.length > 25) {
        namaDisplay = namaDisplay.substring(0, 22) + '...';
    }
    doc.text(namaDisplay, infoStartX, currentY);
    
    currentY += 6;
    
    // Garis bawah nama
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.3);
    doc.line(infoStartX, currentY - 1.5, 80, currentY - 1.5);
    
    // Informasi detail
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(50, 50, 50);
    
    const lineHeight = 4;
    
    // NIK
    doc.text(`NIK: ${nelayanData.nik}`, infoStartX, currentY);
    currentY += lineHeight;
    
    // Usia & Tempat Lahir
    doc.text(`Usia: ${nelayanData.usia} Tahun | Lahir: ${nelayanData.tahunLahir}`, infoStartX, currentY);
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
    doc.roundedRect(infoStartX - 1, currentY - 3.5, 20, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    
    // Potong teks profesi jika terlalu panjang
    let profesiDisplay = profesiText.toUpperCase();
    if (profesiDisplay.length > 20) {
        profesiDisplay = profesiDisplay.substring(0, 17) + '...';
    }
    doc.text(profesiDisplay, infoStartX + 9, currentY, { align: 'center' });
    
    // Status pekerjaan
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text(`Status: ${nelayanData.status}`, infoStartX + 25, currentY);
    currentY += lineHeight;
    
    // Alat Tangkap
    doc.text(`Alat Tangkap: ${nelayanData.alatTangkap}`, infoStartX, currentY);
    
    // 8. QR CODE AREA (Bagian Bawah Kanan)
    const qrCanvas = qrContainer.querySelector('canvas');
    if (qrCanvas) {
        try {
            const qrDataUrl = qrCanvas.toDataURL('image/png');
            doc.addImage(qrDataUrl, 'PNG', 60, 18, 18, 18);
            
            // Border QR Code
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setLineWidth(0.5);
            doc.rect(60, 18, 18, 18);
            
            // Teks di bawah QR
            doc.setFontSize(4);
            doc.setTextColor(100, 100, 100);
            doc.text("SCAN UNTUK VERIFIKASI", 69, 38, { align: 'center' });
        } catch (e) {
            console.warn('QR Code gagal ditambahkan:', e);
        }
    }
    
    // 9. FOOTER INFORMASI
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2], 30);
    doc.rect(0, 42, 85.6, 12, 'F');
    
    // Nomor ID Card
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    const idNumber = nelayanData.kodeValidasi || `SIMATA-${nelayanData.nik.substring(8, 12)}`;
    doc.text(`ID: ${idNumber}`, 42.8, 46, { align: 'center' });
    
    // Masa berlaku
    const today = new Date();
    const expireDate = new Date(today);
    expireDate.setFullYear(today.getFullYear() + 2);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(80, 80, 80);
    doc.text(`Berlaku: ${today.toLocaleDateString('id-ID')} s/d ${expireDate.toLocaleDateString('id-ID')}`, 42.8, 50, { align: 'center' });
    
    // Copyright
    doc.setFontSize(4);
    doc.setTextColor(120, 120, 120);
    doc.text("© 2025 Dinas Perikanan Kab. Situbondo - Sistem Satu Data Nelayan", 42.8, 53, { align: 'center' });
    
    // 10. BORDER KARTU
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.8);
    doc.rect(2, 2, 81.6, 50);
    
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
 * Fungsi untuk menghasilkan ID Card dalam format HTML (preview)
 */
function previewIDCardHTML(nelayanData) {
    // Warna berdasarkan profesi
    let badgeColor = '#0c2461';
    if (nelayanData.profesi === "Nelayan Penuh Waktu") badgeColor = '#0c2461';
    else if (nelayanData.profesi === "Nelayan Sambilan Utama") badgeColor = '#e58e26';
    else if (nelayanData.profesi === "Nelayan Sambilan Tambahan") badgeColor = '#27ae60';
    
    const idCardHTML = `
    <div class="id-card-preview" style="
        width: 320px;
        height: 200px;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-radius: 10px;
        padding: 12px;
        color: #333;
        font-family: 'Inter', sans-serif;
        position: relative;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        border: 3px solid #0c2461;
        margin: 10px auto;
    ">
        <!-- Header -->
        <div style="background: #0c2461; margin: -12px -12px 10px -12px; padding: 8px; text-align: center;">
            <h4 style="margin: 0; color: white; font-size: 14px;">KARTU IDENTITAS NELAYAN</h4>
            <p style="margin: 2px 0 0 0; color: #f6b93b; font-size: 9px;">Dinas Perikanan Kab. Situbondo</p>
        </div>
        
        <!-- Content -->
        <div style="display: flex;">
            <!-- Logo Area -->
            <div style="flex: 1; padding-right: 10px; text-align: center;">
                <div style="width: 70px; height: 70px; background: white; border-radius: 5px; border: 1px solid #ddd; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center;">
                    <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/LOGO%20KABUPATEN%20SITUBONDO.png" 
                         style="width: 60px; height: 60px; object-fit: contain;" 
                         alt="Logo Situbondo"
                         onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=color:#666;font-size:10px;>LOGO<br>SITUBONDO</div>';">
                </div>
                <div style="font-size: 8px; color: #666;">LOGO RESMI</div>
            </div>
            
            <!-- Information -->
            <div style="flex: 2;">
                <h5 style="margin: 0 0 5px 0; font-size: 13px; color: #0c2461; border-bottom: 1px solid #ddd; padding-bottom: 3px;">${nelayanData.nama}</h5>
                
                <table style="font-size: 9px; width: 100%;">
                    <tr><td style="width: 60px;"><strong>NIK:</strong></td><td>${nelayanData.nik}</td></tr>
                    <tr><td><strong>Usia:</strong></td><td>${nelayanData.usia} Tahun</td></tr>
                    <tr><td><strong>Domisili:</strong></td><td>${nelayanData.desa}, ${nelayanData.kecamatan}</td></tr>
                    <tr><td><strong>Profesi:</strong></td>
                        <td><span style="background: ${badgeColor}; color: white; padding: 1px 6px; border-radius: 3px; font-size: 8px;">${nelayanData.profesi}</span></td>
                    </tr>
                    <tr><td><strong>Status:</strong></td><td>${nelayanData.status}</td></tr>
                </table>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="position: absolute; bottom: 5px; left: 0; width: 100%; text-align: center; font-size: 8px; color: #666; padding: 0 10px;">
            <div>ID: ${nelayanData.kodeValidasi || 'SIMATA'}</div>
            <div style="font-size: 7px; margin-top: 2px;">© 2025 SIMATA - Dinas Perikanan Kab. Situbondo</div>
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
        showNotification('Tidak ada data nelayan yang dipilih!', 'warning');
        return;
    }
    
    // Tampilkan konfirmasi
    if (!confirm(`Anda akan membuat ${nelayanIds.length} ID Card. Lanjutkan?`)) {
        return;
    }
    
    showNotification(`Memproses ${nelayanIds.length} ID Card...`, 'info');
    
    // Ambil data dari localStorage
    const appData = JSON.parse(localStorage.getItem('nelayanData') || '[]');
    
    // Filter data yang dipilih
    const selectedNelayan = appData.filter(n => nelayanIds.includes(n.id.toString()));
    
    if (selectedNelayan.length === 0) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    // Generate ID Card untuk setiap nelayan (untuk demo hanya yang pertama)
    if (selectedNelayan.length > 0) {
        generateSimataIDCard(selectedNelayan[0]);
        
        // Tampilkan info untuk batch lengkap
        setTimeout(() => {
            showNotification(`✅ ${selectedNelayan.length} ID Card siap diunduh!`, 'success');
        }, 1500);
    }
}

/**
 * Fungsi untuk menampilkan preview modal ID Card
 */
function showIDCardPreview(nelayanData) {
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
                    <button type="button" class="btn btn-primary" onclick="generateSimataIDCard(${JSON.stringify(nelayanData)})">
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
    const modal = new bootstrap.Modal(document.getElementById('idCardPreviewModal'));
    modal.show();
    
    // Hapus modal setelah ditutup
    document.getElementById('idCardPreviewModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}

// Ekspor fungsi ke global scope
window.generateSimataIDCard = generateSimataIDCard;
window.previewIDCardHTML = previewIDCardHTML;
window.batchGenerateIDCards = batchGenerateIDCards;
window.showIDCardPreview = showIDCardPreview;

console.log('✅ SIMATA ID Card Generator v2.0 loaded successfully');
