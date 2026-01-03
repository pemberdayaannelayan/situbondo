// idcard.js
// Fungsi ID Card dan Verifikasi KIN untuk SIMATA

/**
 * SIMATA ID Card Generator - VERSI DISEMPURNAKAN & DIPERBAIKI
 * Fungsi untuk menghasilkan ID Card nelayan profesional
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 10.1 - Layout Revisi (ID di kiri bawah, QR di kanan bawah)
 */

// Global variables untuk ID Card
let idCardGenerated = false;

/**
 * Fungsi utama untuk menghasilkan ID Card nelayan
 */
function generateSimataIDCard(nelayanData) {
    if (!nelayanData) {
        console.error('Data nelayan tidak ditemukan');
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    try {
        // Tampilkan loading
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) {
            loadingEl.classList.add('active');
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
        const qrData = "www.dinasperikanansitubondo.com/simata/#verifikasi";
        
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
            // Buat QR Code dengan kualitas tinggi
            new QRCode(qrContainer, {
                text: qrData,
                width: 200,
                height: 200,
                colorDark: "#0c2461",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
                useSVG: false
            });
            
            // Tunggu QR Code digenerate
            setTimeout(() => {
                generateIDCardPDFWithNewLayout(nelayanData, qrContainer);
                document.body.removeChild(qrContainer);
                
                if (loadingEl) loadingEl.classList.remove('active');
            }, 800);
            
        } catch (qrError) {
            console.error('Error membuat QR Code:', qrError);
            // Fallback tanpa QR Code
            generateIDCardPDFWithNewLayout(nelayanData, null);
            document.body.removeChild(qrContainer);
            if (loadingEl) loadingEl.classList.remove('active');
        }
        
    } catch (error) {
        console.error('Error generating ID Card:', error);
        showNotification('Terjadi kesalahan saat membuat ID Card!', 'error');
        
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) loadingEl.classList.remove('active');
    }
}

/**
 * Generate PDF untuk ID Card dengan LAYOUT BARU
 */
async function generateIDCardPDFWithNewLayout(nelayanData, qrContainer) {
    if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
        console.error('jsPDF tidak ditemukan');
        showNotification('Library PDF tidak tersedia!', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    
    // Buat PDF dengan orientasi landscape untuk kartu ID
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54]
    });
    
    // Warna tema
    const primaryColor = [12, 36, 97];
    const accentColor = [246, 185, 59];
    const lightBlue = [240, 248, 255];
    const white = [255, 255, 255];
    const darkGray = [33, 37, 41];
    
    // 1. BACKGROUND UTAMA
    doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // 2. HEADER
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(2, 2, 81.6, 10, 2, 2, 'F');
    
    // Garis aksen di header
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.8);
    doc.line(2, 12, 83.6, 12);
    
    // 3. JUDUL UTAMA
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text("KARTU IDENTITAS NELAYAN", 42.8, 6.5, { align: 'center' });
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", 42.8, 9, { align: 'center' });
    
    // 4. INFORMASI NELAYAN (dua kolom)
    let leftX = 5;
    let rightX = 45;
    let currentY = 16;
    const lineHeight = 5;
    
    // Kolom Kiri: Data Pribadi
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("DATA PRIBADI", leftX, currentY);
    currentY += 3.5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    // Nama
    let namaDisplay = nelayanData.nama.toUpperCase();
    if (namaDisplay.length > 22) {
        namaDisplay = namaDisplay.substring(0, 20) + '...';
    }
    doc.text(`Nama: ${namaDisplay}`, leftX, currentY);
    currentY += lineHeight;
    
    // NIK
    doc.text(`NIK: ${nelayanData.nik}`, leftX, currentY);
    currentY += lineHeight;
    
    // Usia
    doc.text(`Usia: ${nelayanData.usia} Tahun`, leftX, currentY);
    currentY += lineHeight;
    
    // Domisili
    const domisili = `${nelayanData.desa}, ${nelayanData.kecamatan}`;
    let domisiliDisplay = domisili;
    if (domisiliDisplay.length > 28) {
        domisiliDisplay = domisiliDisplay.substring(0, 26) + '...';
    }
    doc.text(`Domisili: ${domisiliDisplay}`, leftX, currentY);
    
    // Kolom Kanan: Data Kapal
    currentY = 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("DATA KAPAL", rightX, currentY);
    currentY += 3.5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    // Tampilkan data kapal hanya jika status pemilik kapal
    if (nelayanData.status === "Pemilik Kapal") {
        // Nama Kapal
        let namaKapal = nelayanData.namaKapal || '-';
        if (namaKapal.length > 25) {
            namaKapal = namaKapal.substring(0, 23) + '...';
        }
        doc.text(`Nama: ${namaKapal}`, rightX, currentY);
        currentY += lineHeight;

        // Jenis Kapal
        let jenisKapal = nelayanData.jenisKapal || '-';
        if (jenisKapal.length > 25) {
            jenisKapal = jenisKapal.substring(0, 23) + '...';
        }
        doc.text(`Jenis: ${jenisKapal}`, rightX, currentY);
    } else {
        doc.text("Tidak Tersedia", rightX, currentY);
        currentY += lineHeight;
    }
    
    currentY += lineHeight;
    
    // Status pekerjaan
    let statusColor = [74, 105, 189];
    if (nelayanData.status === "Pemilik Kapal") {
        statusColor = [9, 132, 227];
    } else if (nelayanData.status === "Anak Buah Kapal") {
        statusColor = [142, 68, 173];
    }
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(rightX, currentY - 2, 35, 4, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text(nelayanData.status.toUpperCase(), rightX + 17.5, currentY, { align: 'center' });
    
    currentY += lineHeight;
    
    // Alat Tangkap
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    
    let alatTangkap = nelayanData.alatTangkap;
    if (alatTangkap.length > 25) {
        alatTangkap = alatTangkap.substring(0, 23) + '...';
    }
    doc.text(`Alat Tangkap: ${alatTangkap}`, rightX, currentY);
    
    // 5. ID VALIDASI DI KIRI BAWAH
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(230, 126, 34);
    const idNumber = nelayanData.kodeValidasi || `SIMATA-${nelayanData.nik.substring(12)}`;
    doc.text(`ID: ${idNumber}`, 5, 45);
    
    // 6. TEKS "Kartu Identitas Resmi - Berlaku Selamanya"
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    doc.text("Kartu Identitas Resmi - Berlaku Selamanya", 5, 47.5);
    
    // 7. QR CODE DI KANAN BAWAH
    if (qrContainer) {
        const qrCanvas = qrContainer.querySelector('canvas');
        if (qrCanvas) {
            try {
                const qrDataUrl = qrCanvas.toDataURL('image/png', 1.0);
                
                // QR Code di kanan bawah, ukuran 15x15mm
                doc.addImage(qrDataUrl, 'PNG', 65, 35, 15, 15);
                
                // Teks "SCAN VERIFIKASI" di bawah QR Code
                doc.setFontSize(5);
                doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.setFont('helvetica', 'bold');
                doc.text("SCAN VERIFIKASI", 72.5, 52, { align: 'center' });
            } catch (e) {
                console.warn('QR Code gagal ditambahkan:', e);
                createFallbackQRCode(doc, 65, 35, 15, 15, 72.5, 52);
            }
        } else {
            createFallbackQRCode(doc, 65, 35, 15, 15, 72.5, 52);
        }
    } else {
        createFallbackQRCode(doc, 65, 35, 15, 15, 72.5, 52);
    }
    
    // 8. BORDER KARTU
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(1, 1, 83.6, 52, 3, 3);
    
    // 9. SIMPAN FILE
    const fileName = `ID_CARD_${nelayanData.nama.replace(/\s+/g, '_').toUpperCase()}_${nelayanData.nik}.pdf`;
    
    setTimeout(() => {
        try {
            doc.save(fileName);
            idCardGenerated = true;
            
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
 * Fungsi untuk membuat QR Code fallback
 */
function createFallbackQRCode(doc, x, y, width, height, textX, textY) {
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(x, y, width, height, 2, 2, 'F');
    doc.setTextColor(12, 36, 97);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text("QR", textX, y + height/2 - 2, { align: 'center' });
    doc.text("CODE", textX, y + height/2 + 2, { align: 'center' });
    doc.setFontSize(5);
    doc.text("SCAN VERIFIKASI", textX, textY, { align: 'center' });
}

/**
 * Fungsi untuk menghasilkan preview ID Card dalam format HTML
 */
function previewIDCardHTML(nelayanData) {
    let statusClass = 'status-pemilik';
    if (nelayanData.status === "Anak Buah Kapal") statusClass = 'status-abk';
    
    let namaDisplay = nelayanData.nama.toUpperCase();
    if (namaDisplay.length > 22) {
        namaDisplay = namaDisplay.substring(0, 20) + '...';
    }
    
    let domisiliDisplay = `${nelayanData.desa}, ${nelayanData.kecamatan}`.toUpperCase();
    if (domisiliDisplay.length > 28) {
        domisiliDisplay = domisiliDisplay.substring(0, 26) + '...';
    }
    
    let alatTangkapDisplay = nelayanData.alatTangkap;
    if (alatTangkapDisplay.length > 22) {
        alatTangkapDisplay = alatTangkapDisplay.substring(0, 20) + '...';
    }
    
    const nikDisplay = nelayanData.nik;
    const isPemilikKapal = nelayanData.status === "Pemilik Kapal";
    
    return `
    <div class="id-card-container">
        <div class="id-card-improved">
            <div class="id-card-improved-header">
                <h4 class="id-card-improved-title">KARTU IDENTITAS NELAYAN</h4>
                <p class="id-card-improved-subtitle">DINAS PERIKANAN KABUPATEN SITUBONDO</p>
            </div>
            
            <div class="id-card-improved-content">
                <div class="id-card-improved-left">
                    <h5 class="id-card-improved-name">${namaDisplay}</h5>
                    
                    <div class="id-card-improved-details">
                        <div class="id-card-improved-detail">
                            <span class="id-card-improved-label">NIK:</span>
                            <span class="id-card-improved-value">${nikDisplay}</span>
                        </div>
                        <div class="id-card-improved-detail">
                            <span class="id-card-improved-label">USIA:</span>
                            <span class="id-card-improved-value">${nelayanData.usia} TAHUN</span>
                        </div>
                        <div class="id-card-improved-detail">
                            <span class="id-card-improved-label">DOMISILI:</span>
                            <span class="id-card-improved-value">${domisiliDisplay}</span>
                        </div>
                        <div class="id-card-improved-detail">
                            <span class="id-card-improved-label">KAPAL:</span>
                            <span class="id-card-improved-value">
                                ${isPemilikKapal ? 
                                    `<div>${nelayanData.namaKapal || '-'}</div><div class="small">${nelayanData.jenisKapal || '-'}</div>` 
                                    : 'Tidak Tersedia'}
                            </span>
                        </div>
                        <div class="id-card-improved-detail">
                            <span class="id-card-improved-label">STATUS:</span>
                            <span class="id-card-improved-value">
                                <span class="id-card-improved-badge ${statusClass}">${nelayanData.status.toUpperCase()}</span>
                            </span>
                        </div>
                        <div class="id-card-improved-detail">
                            <span class="id-card-improved-label">ALAT TANGKAP:</span>
                            <span class="id-card-improved-value">${alatTangkapDisplay}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="id-card-improved-id-left">
                <span class="id-card-id-number-left">ID: ${nelayanData.kodeValidasi || 'SIMATA'}</span>
                <span class="id-card-validity-text">Kartu Identitas Resmi - Berlaku Selamanya</span>
            </div>
            
            <div class="id-card-improved-qr-right">
                <div style="width: 100%; height: 100%; background: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                    <i class="fas fa-qrcode" style="color: #0c2461; font-size: 24px;"></i>
                </div>
                <div class="id-card-scan-text">SCAN VERIFIKASI</div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Fungsi untuk batch generate ID Cards (multiple)
 */
function batchGenerateIDCards(nelayanIds) {
    if (!nelayanIds || nelayanIds.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Tidak ada data nelayan yang dipilih!', 'warning');
        }
        return;
    }
    
    if (!confirm(`Anda akan membuat ${nelayanIds.length} ID Card. Lanjutkan?`)) {
        return;
    }
    
    if (typeof showNotification === 'function') {
        showNotification(`Memproses ${nelayanIds.length} ID Card...`, 'info');
    }
    
    const appData = window.appData ? window.appData : [];
    const selectedNelayan = appData.filter(n => nelayanIds.includes(n.id.toString()));
    
    if (selectedNelayan.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Data nelayan tidak ditemukan!', 'error');
        }
        return;
    }
    
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
        
        setTimeout(processNext, 1500);
    };
    
    processNext();
}

/**
 * Fungsi untuk menampilkan preview modal ID Card
 */
function showIDCardPreview(nelayanData) {
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
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    const modalElement = document.getElementById('idCardPreviewModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    modalElement.addEventListener('hidden.bs.modal', function() {
        if (modalContainer && modalContainer.parentNode) {
            document.body.removeChild(modalContainer);
        }
    });
}

/**
 * Helper function untuk mendapatkan warna berdasarkan profesi
 */
function getProfesiColor(profesi) {
    switch(profesi) {
        case 'Nelayan Penuh Waktu': return '#0c2461';
        case 'Nelayan Sambilan Utama': return '#e67e22';
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
        case 'Anak Buah Kapal': return '#8e44ad';
        default: return '#4a69bd';
    }
}

/**
 * Fungsi untuk mengecek ketersediaan library yang diperlukan
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

// ================================
// FUNGSI VERIFIKASI KIN BARU TANPA SCAN QR CODE
// ================================

/**
 * Fungsi untuk verifikasi KIN berdasarkan NIK atau kode validasi
 */
function verifyKIN() {
    const verifyInput = document.getElementById('verifyInput').value.trim();
    const verifyLoading = document.getElementById('verifyLoading');
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const verifyButton = document.getElementById('verifyButton');
    
    if (!verifyInput) {
        showNotification('Masukkan NIK atau kode validasi terlebih dahulu!', 'error');
        return;
    }
    
    // Tampilkan loading
    verifyLoading.style.display = 'block';
    verifyButton.disabled = true;
    
    // Simulasi loading
    setTimeout(() => {
        const appData = window.appData ? window.appData : [];
        
        // Cari nelayan berdasarkan NIK atau kode validasi
        let foundNelayan = null;
        
        if (verifyInput.length === 16 && /^\d+$/.test(verifyInput)) {
            // Jika input 16 digit angka, cari berdasarkan NIK
            foundNelayan = appData.find(n => n.nik === verifyInput);
        } else {
            // Jika tidak, cari berdasarkan kode validasi
            foundNelayan = appData.find(n => n.kodeValidasi === verifyInput);
        }
        
        // Sembunyikan loading
        verifyLoading.style.display = 'none';
        verifyButton.disabled = false;
        
        // Tampilkan hasil verifikasi
        if (foundNelayan) {
            showVerificationResult(foundNelayan, true);
        } else {
            showVerificationResult(null, false, verifyInput);
        }
    }, 1500);
}

/**
 * Fungsi untuk menampilkan hasil verifikasi
 */
function showVerificationResult(nelayanData, isValid, input = '') {
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    // Update breadcrumb
    breadcrumbItems[0].classList.remove('active');
    breadcrumbItems[1].classList.add('active');
    
    if (isValid && nelayanData) {
        // Format timestamp
        const now = new Date();
        const timestamp = now.toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Tampilkan hasil valid
        verifyResultContainer.innerHTML = `
            <div class="verify-result-card verify-result-success">
                <div class="verify-icon-container verify-success-icon verify-success-animation">
                    <i class="fas fa-check"></i>
                </div>
                
                <h3 class="verify-result-title">✅ KARTU IDENTITAS NELAYAN VALID</h3>
                
                <div class="verify-result-message">
                    <p class="mb-3">Sistem telah memverifikasi bahwa <strong>${nelayanData.nama}</strong> tercatat sebagai nelayan resmi yang terdaftar di Sistem Informasi Pemetaan Data Nelayan Terpadu (SIMATA) Dinas Perikanan Kabupaten Situbondo.</p>
                    
                    <div class="alert alert-success mb-0">
                        <i class="fas fa-certificate me-2"></i>
                        <strong>STATUS VERIFIKASI:</strong> BERHASIL - Data sesuai dan tervalidasi
                    </div>
                </div>
                
                <div class="verify-details">
                    <h6 class="fw-bold text-primary mb-3">DETAIL IDENTITAS NELAYAN</h6>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Nama Lengkap</span>
                        <span class="verify-detail-value">${nelayanData.nama}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">NIK</span>
                        <span class="verify-detail-value">${nelayanData.nik}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Domisili</span>
                        <span class="verify-detail-value">${nelayanData.desa}, ${nelayanData.kecamatan}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Profesi</span>
                        <span class="verify-detail-value">
                            <span class="badge ${nelayanData.profesi === 'Nelayan Penuh Waktu' ? 'badge-profesi-penuh' : nelayanData.profesi === 'Nelayan Sambilan Utama' ? 'badge-profesi-sambilan-utama' : 'badge-profesi-sambilan-tambahan'}">${nelayanData.profesi}</span>
                        </span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Status</span>
                        <span class="verify-detail-value">${nelayanData.status}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Kode Validasi</span>
                        <span class="verify-detail-value fw-bold text-primary">${nelayanData.kodeValidasi || 'Tidak tersedia'}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Tanggal Validasi</span>
                        <span class="verify-detail-value">${nelayanData.tanggalValidasi}</span>
                    </div>
                </div>
                
                <div class="verify-timestamp">
                    <i class="fas fa-clock me-1"></i> Waktu Verifikasi: ${timestamp}
                </div>
                
                <div class="verify-actions">
                    <button type="button" class="btn btn-primary verify-action-btn" onclick="generateSimataIDCard(${JSON.stringify(nelayanData).replace(/'/g, "\\'")})">
                        <i class="fas fa-id-card me-1"></i> Cetak KIN
                    </button>
                    <button type="button" class="btn btn-outline-primary verify-action-btn" onclick="window.viewDetail && window.viewDetail('${nelayanData.id}')">
                        <i class="fas fa-eye me-1"></i> Lihat Detail Lengkap
                    </button>
                    <button type="button" class="btn btn-outline-secondary verify-action-btn" onclick="resetVerification()">
                        <i class="fas fa-redo me-1"></i> Verifikasi Lagi
                    </button>
                </div>
            </div>
        `;
        
        // Scroll ke hasil
        verifyResultContainer.scrollIntoView({ behavior: 'smooth' });
        
    } else {
        // Tampilkan hasil tidak valid
        verifyResultContainer.innerHTML = `
            <div class="verify-result-card verify-result-error verify-error-animation">
                <div class="verify-icon-container verify-error-icon">
                    <i class="fas fa-times"></i>
                </div>
                
                <h3 class="verify-result-title">❌ KARTU IDENTITAS TIDAK TERDAFTAR</h3>
                
                <div class="verify-result-message">
                    <p class="mb-3">Sistem <strong>TIDAK DAPAT</strong> menemukan data nelayan dengan identitas <strong>"${input}"</strong> dalam database Sistem Informasi Pemetaan Data Nelayan Terpadu (SIMATA) Dinas Perikanan Kabupaten Situbondo.</p>
                    
                    <div class="alert alert-danger mb-0">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>STATUS VERIFIKASI:</strong> GAGAL - Data tidak ditemukan dalam sistem
                    </div>
                </div>
                
                <div class="verify-details">
                    <h6 class="fw-bold text-danger mb-3">KEMUNGKINAN PENYEBAB</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> NIK atau kode validasi salah</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Data belum terdaftar dalam sistem</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Kartu identitas tidak valid atau kadaluarsa</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Kesalahan input data</li>
                    </ul>
                </div>
                
                <div class="verify-timestamp">
                    <i class="fas fa-clock me-1"></i> Waktu Verifikasi: ${new Date().toLocaleString('id-ID')}
                </div>
                
                <div class="verify-actions">
                    <button type="button" class="btn btn-danger verify-action-btn" onclick="resetVerification()">
                        <i class="fas fa-redo me-1"></i> Coba Lagi
                    </button>
                    <button type="button" class="btn btn-outline-secondary verify-action-btn" onclick="document.getElementById('v-pills-input-tab').click()">
                        <i class="fas fa-user-plus me-1"></i> Daftarkan Nelayan Baru
                    </button>
                </div>
            </div>
        `;
        
        // Scroll ke hasil
        verifyResultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    verifyResultContainer.style.display = 'block';
}

/**
 * Fungsi untuk reset form verifikasi
 */
function resetVerification() {
    const verifyInput = document.getElementById('verifyInput');
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    // Reset input
    verifyInput.value = '';
    
    // Sembunyikan hasil
    verifyResultContainer.style.display = 'none';
    verifyResultContainer.innerHTML = '';
    
    // Reset breadcrumb
    breadcrumbItems[0].classList.add('active');
    breadcrumbItems[1].classList.remove('active');
    
    // Fokus ke input
    verifyInput.focus();
}

/**
 * Fungsi untuk toggle FAQ
 */
function toggleFAQ(id) {
    const answer = document.getElementById(`faqAnswer${id}`);
    const icon = document.querySelector(`#faqAnswer${id}`).parentElement.querySelector('i');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

/**
 * Fungsi untuk menangani hash routing
 */
function handleHashRouting() {
    const hash = window.location.hash;
    
    if (hash === '#verifikasi') {
        // Aktifkan tab verifikasi
        const verifyTab = document.getElementById('v-pills-verify-tab');
        if (verifyTab) {
            verifyTab.click();
            
            // Scroll ke bagian verifikasi
            setTimeout(() => {
                const verifySection = document.getElementById('v-pills-verify');
                if (verifySection) {
                    verifySection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }
}

// Helper function untuk notifikasi
function showNotification(message, type = 'info') {
    // Gunakan fungsi showNotification dari index.html jika tersedia
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        // Fallback jika fungsi tidak tersedia
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }
}

// Ekspor fungsi ke global scope
window.generateSimataIDCard = generateSimataIDCard;
window.previewIDCardHTML = previewIDCardHTML;
window.batchGenerateIDCards = batchGenerateIDCards;
window.showIDCardPreview = showIDCardPreview;
window.getProfesiColor = getProfesiColor;
window.getStatusColor = getStatusColor;
window.checkRequiredLibraries = checkRequiredLibraries;
window.verifyKIN = verifyKIN;
window.toggleFAQ = toggleFAQ;
window.resetVerification = resetVerification;
window.handleHashRouting = handleHashRouting;

console.log('✅ SIMATA ID Card Generator v10.1 & Verifikasi KIN loaded successfully');
