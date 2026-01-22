// idcard.js - FITUR CETAK ID CARD NELAYAN
// Kompatibel dengan SIMPADAN TANGKAP v5.9
// Dikembangkan oleh Dinas Perikanan Kabupaten Situbondo

// =====================================================
// KONFIGURASI DAN INISIALISASI
// =====================================================

// Cek ketersediaan library yang diperlukan
function checkIDCardLibraries() {
    const missing = [];
    
    if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
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

// Inisialisasi status ID Card
let idCardGenerated = false;

// =====================================================
// FUNGSI UTAMA GENERATE ID CARD
// =====================================================

/**
 * Fungsi utama untuk menghasilkan ID Card nelayan
 * @param {string|object} idOrData - ID nelayan atau data nelayan langsung
 */
function generateIDCard(idOrData) {
    try {
        // Tampilkan loading
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) {
            loadingEl.classList.add('active');
            const loadingText = loadingEl.querySelector('h6');
            if (loadingText) {
                loadingText.textContent = 'Mempersiapkan ID Card...';
            }
        }
        
        let nelayanData;
        
        // Cari data nelayan berdasarkan parameter
        if (typeof idOrData === 'string' || typeof idOrData === 'number') {
            // Parameter adalah ID
            nelayanData = window.appData?.find(item => item.id == idOrData);
            if (!nelayanData) {
                throw new Error(`Data nelayan dengan ID ${idOrData} tidak ditemukan`);
            }
        } else if (typeof idOrData === 'object' && idOrData !== null) {
            // Parameter adalah data langsung
            nelayanData = idOrData;
        } else {
            throw new Error('Parameter tidak valid');
        }
        
        // Validasi data required
        if (!nelayanData.nama || !nelayanData.nik) {
            throw new Error('Data nama dan NIK harus diisi');
        }
        
        // Update teks loading dengan nama nelayan
        if (loadingEl) {
            const loadingText = loadingEl.querySelector('h6');
            if (loadingText) {
                loadingText.textContent = `Membuat ID Card untuk ${nelayanData.nama}`;
            }
        }
        
        // Cek library yang diperlukan
        if (!checkIDCardLibraries()) {
            showNotification('Library PDF/QR Code tidak tersedia. Silakan refresh halaman.', 'error');
            if (loadingEl) loadingEl.classList.remove('active');
            return;
        }
        
        // Buat elemen sementara untuk QR Code
        const qrContainer = document.createElement('div');
        qrContainer.id = 'idcard-qr-temp-' + Date.now();
        qrContainer.style.position = 'absolute';
        qrContainer.style.left = '-9999px';
        qrContainer.style.width = '200px';
        qrContainer.style.height = '200px';
        qrContainer.style.zIndex = '-9999';
        document.body.appendChild(qrContainer);
        
        // Generate QR Code untuk ID Card
        const qrData = `SIMPADAN-TANGKAP-VERIFIKASI\nKode: ${nelayanData.kodeValidasi || nelayanData.nik}\nNama: ${nelayanData.nama}\nNIK: ${nelayanData.nik}\n${new Date().toISOString().split('T')[0]}`;
        
        // Bersihkan container sebelumnya jika ada
        qrContainer.innerHTML = '';
        
        try {
            new QRCode(qrContainer, {
                text: qrData,
                width: 200,
                height: 200,
                colorDark: "#0c2461",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Tunggu QR Code digenerate
            setTimeout(() => {
                generateIDCardPDF(nelayanData, qrContainer);
                
                // Hapus container setelah selesai
                setTimeout(() => {
                    if (document.body.contains(qrContainer)) {
                        document.body.removeChild(qrContainer);
                    }
                }, 1000);
                
                if (loadingEl) loadingEl.classList.remove('active');
            }, 800);
            
        } catch (qrError) {
            console.warn('Error membuat QR Code:', qrError);
            // Lanjutkan tanpa QR Code
            generateIDCardPDF(nelayanData, null);
            if (document.body.contains(qrContainer)) {
                document.body.removeChild(qrContainer);
            }
            if (loadingEl) loadingEl.classList.remove('active');
        }
        
    } catch (error) {
        console.error('Error generating ID Card:', error);
        showNotification(`Gagal membuat ID Card: ${error.message}`, 'error');
        
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) loadingEl.classList.remove('active');
    }
}

/**
 * Fungsi untuk menghasilkan ID Card dengan desain modern
 */
function generateIDCardPDF(nelayanData, qrContainer) {
    try {
        const { jsPDF } = window.jspdf;
        
        // Buat PDF dengan orientasi landscape untuk kartu ID
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [85.6, 54] // Ukuran kartu ID standar
        });
        
        // Warna tema
        const primaryColor = [12, 36, 97];    // Biru tua
        const secondaryColor = [246, 185, 59]; // Kuning/oren
        const lightColor = [240, 248, 255];    // Biru muda
        const white = [255, 255, 255];
        
        // 1. BACKGROUND UTAMA
        doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        doc.rect(0, 0, 85.6, 54, 'F');
        
        // 2. HEADER DENGAN GRADIEN
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.roundedRect(2, 2, 81.6, 10, 2, 2, 'F');
        
        // Garis aksen di header
        doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
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
        
        // 4. INFORMASI NELAYAN
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
        doc.setTextColor(33, 37, 41); // Abu tua
        
        // Nama (dipotong jika terlalu panjang)
        let namaDisplay = (nelayanData.nama || '').toUpperCase();
        if (namaDisplay.length > 22) {
            namaDisplay = namaDisplay.substring(0, 20) + '...';
        }
        doc.text(`Nama: ${namaDisplay}`, leftX, currentY);
        currentY += lineHeight;
        
        // NIK
        doc.text(`NIK: ${nelayanData.nik || ''}`, leftX, currentY);
        currentY += lineHeight;
        
        // Usia
        doc.text(`Usia: ${nelayanData.usia || 0} Tahun`, leftX, currentY);
        currentY += lineHeight;
        
        // Domisili
        const desa = nelayanData.desa || '';
        const kecamatan = nelayanData.kecamatan || '';
        const domisili = `${desa}, ${kecamatan}`;
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
        doc.setTextColor(33, 37, 41);
        
        // Tampilkan data kapal hanya jika status pemilik kapal
        const status = nelayanData.status || '';
        if (status === "Pemilik Kapal") {
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
        
        // Badge Status
        let statusColor = [74, 105, 189]; // Default biru
        if (status === "Pemilik Kapal") {
            statusColor = [9, 132, 227]; // Biru terang
        } else if (status === "Anak Buah Kapal") {
            statusColor = [142, 68, 173]; // Ungu
        }
        
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.roundedRect(rightX, currentY - 2, 35, 4, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.text((status || '-').toUpperCase(), rightX + 17.5, currentY, { align: 'center' });
        
        currentY += lineHeight;
        
        // Alat Tangkap
        doc.setTextColor(33, 37, 41);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        
        let alatTangkap = nelayanData.alatTangkap || '-';
        if (alatTangkap.length > 25) {
            alatTangkap = alatTangkap.substring(0, 23) + '...';
        }
        doc.text(`Alat Tangkap: ${alatTangkap}`, rightX, currentY);
        
        // 5. ID VALIDASI DI KIRI BAWAH
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(230, 126, 34); // Orange
        const kodeValidasi = nelayanData.kodeValidasi || '';
        const idNumber = kodeValidasi || `SIMPADAN-${(nelayanData.nik || '').substring(12)}`;
        doc.text(`ID: ${idNumber}`, 5, 45);
        
        // 6. TEKS "Kartu Identitas Resmi"
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5);
        doc.setTextColor(100, 100, 100);
        doc.text("Kartu Identitas Resmi - Berlaku Selamanya", 5, 47.5);
        
        // 7. QR CODE DI KANAN BAWAH
        let qrAdded = false;
        if (qrContainer) {
            const qrCanvas = qrContainer.querySelector('canvas');
            if (qrCanvas && typeof qrCanvas.toDataURL === 'function') {
                try {
                    const qrDataUrl = qrCanvas.toDataURL('image/png', 1.0);
                    doc.addImage(qrDataUrl, 'PNG', 65, 35, 15, 15);
                    qrAdded = true;
                    
                    // Teks "SCAN VERIFIKASI" di bawah QR Code
                    doc.setFontSize(5);
                    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                    doc.setFont('helvetica', 'bold');
                    doc.text("SCAN VERIFIKASI", 72.5, 52, { align: 'center' });
                } catch (e) {
                    console.warn('QR Code gagal ditambahkan:', e);
                    qrAdded = false;
                }
            }
        }
        
        // Fallback jika QR Code tidak bisa dibuat
        if (!qrAdded) {
            doc.setFillColor(240, 248, 255);
            doc.roundedRect(65, 35, 15, 15, 2, 2, 'F');
            doc.setTextColor(12, 36, 97);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text("QR", 72.5, 41, { align: 'center' });
            doc.text("CODE", 72.5, 45, { align: 'center' });
            doc.setFontSize(5);
            doc.text("SCAN VERIFIKASI", 72.5, 52, { align: 'center' });
        }
        
        // 8. BORDER KARTU
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.8);
        doc.roundedRect(1, 1, 83.6, 52, 3, 3);
        
        // 9. SIMPAN FILE
        const safeFileName = (nelayanData.nama || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();
        const fileName = `ID_CARD_${safeFileName}_${nelayanData.nik || 'unknown'}.pdf`;
        
        setTimeout(() => {
            try {
                doc.save(fileName);
                idCardGenerated = true;
                
                // Notifikasi sukses
                showNotification(`✅ ID Card ${nelayanData.nama} berhasil dibuat!`, 'success');
                
                // Log untuk debugging
                console.log(`ID Card berhasil dibuat: ${fileName}`);
            } catch (saveError) {
                console.error('Error saving PDF:', saveError);
                showNotification('Gagal menyimpan ID Card. Coba lagi!', 'error');
            }
        }, 500);
        
    } catch (error) {
        console.error('Error dalam generateIDCardPDF:', error);
        showNotification('Terjadi kesalahan saat membuat PDF!', 'error');
        throw error;
    }
}

// =====================================================
// FUNGSI BATCH GENERATE (MULTIPLE ID CARDS)
// =====================================================

/**
 * Fungsi untuk batch generate ID Cards (multiple)
 * @param {Array} nelayanIds - Array ID nelayan
 */
function batchGenerateIDCards(nelayanIds) {
    if (!nelayanIds || !Array.isArray(nelayanIds) || nelayanIds.length === 0) {
        showNotification('Tidak ada data nelayan yang dipilih!', 'warning');
        return;
    }
    
    if (!confirm(`Anda akan membuat ${nelayanIds.length} ID Card. Lanjutkan?`)) {
        return;
    }
    
    showNotification(`Memproses ${nelayanIds.length} ID Card...`, 'info');
    
    const appData = window.appData || [];
    const selectedNelayan = appData.filter(n => n && n.id && nelayanIds.includes(n.id.toString()));
    
    if (selectedNelayan.length === 0) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    let processed = 0;
    const processNext = () => {
        if (processed >= selectedNelayan.length) {
            showNotification(`✅ ${selectedNelayan.length} ID Card siap diunduh!`, 'success');
            return;
        }
        
        const nelayan = selectedNelayan[processed];
        if (nelayan) {
            // Delay antara setiap generate untuk menghindari overload
            setTimeout(() => {
                generateIDCard(nelayan);
                processed++;
                
                if (processed < selectedNelayan.length) {
                    // Delay sebelum memproses berikutnya
                    setTimeout(processNext, 1500);
                } else {
                    processNext();
                }
            }, 500);
        } else {
            processed++;
            processNext();
        }
    };
    
    processNext();
}

// =====================================================
// FUNGSI PREVIEW ID CARD (HTML)
// =====================================================

/**
 * Fungsi untuk menghasilkan preview ID Card dalam format HTML
 * @param {object} nelayanData - Data nelayan
 * @returns {string} HTML untuk preview
 */
function previewIDCardHTML(nelayanData) {
    if (!nelayanData) return '<div class="alert alert-danger">Data tidak tersedia</div>';
    
    let statusClass = 'status-pemilik';
    if (nelayanData.status === "Anak Buah Kapal") statusClass = 'status-abk';
    
    let namaDisplay = (nelayanData.nama || '').toUpperCase();
    if (namaDisplay.length > 22) {
        namaDisplay = namaDisplay.substring(0, 20) + '...';
    }
    
    const desa = nelayanData.desa || '';
    const kecamatan = nelayanData.kecamatan || '';
    let domisiliDisplay = `${desa}, ${kecamatan}`.toUpperCase();
    if (domisiliDisplay.length > 28) {
        domisiliDisplay = domisiliDisplay.substring(0, 26) + '...';
    }
    
    let alatTangkapDisplay = nelayanData.alatTangkap || '';
    if (alatTangkapDisplay.length > 22) {
        alatTangkapDisplay = alatTangkapDisplay.substring(0, 20) + '...';
    }
    
    const nikDisplay = nelayanData.nik || '';
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
                            <span class="id-card-improved-value">${nelayanData.usia || 0} TAHUN</span>
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
                                <span class="id-card-improved-badge ${statusClass}">${(nelayanData.status || '').toUpperCase()}</span>
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
                <span class="id-card-id-number-left">ID: ${nelayanData.kodeValidasi || 'SIMPADAN'}</span>
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
 * Fungsi untuk menampilkan preview modal ID Card
 * @param {object} nelayanData - Data nelayan
 */
function showIDCardPreview(nelayanData) {
    if (!nelayanData) {
        showNotification('Data nelayan tidak tersedia!', 'error');
        return;
    }
    
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
                    <button type="button" class="btn btn-primary" onclick="generateIDCard(${JSON.stringify(nelayanData).replace(/"/g, '&quot;').replace(/'/g, "\\'")})">
                        <i class="fas fa-download me-2"></i>Download ID Card (PDF)
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Hapus modal sebelumnya jika ada
    const existingModal = document.getElementById('idCardPreviewModal');
    if (existingModal) {
        const modalInstance = bootstrap.Modal.getInstance(existingModal);
        if (modalInstance) modalInstance.hide();
        existingModal.remove();
    }
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    const modalElement = document.getElementById('idCardPreviewModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        modalElement.addEventListener('hidden.bs.modal', function() {
            if (modalContainer && modalContainer.parentNode) {
                document.body.removeChild(modalContainer);
            }
        });
    }
}

// =====================================================
// FUNGSI HELPER DAN UTILITAS
// =====================================================

/**
 * Helper function untuk mendapatkan warna berdasarkan profesi
 * @param {string} profesi - Profesi nelayan
 * @returns {string} Kode warna HEX
 */
function getProfesiColor(profesi) {
    if (!profesi) return '#4a69bd';
    
    switch(profesi) {
        case 'Nelayan Penuh Waktu': return '#0c2461';
        case 'Nelayan Sambilan Utama': return '#e67e22';
        case 'Nelayan Sambilan Tambahan': return '#27ae60';
        default: return '#4a69bd';
    }
}

/**
 * Helper function untuk mendapatkan warna berdasarkan status
 * @param {string} status - Status nelayan
 * @returns {string} Kode warna HEX
 */
function getStatusColor(status) {
    if (!status) return '#4a69bd';
    
    switch(status) {
        case 'Pemilik Kapal': return '#0984e3';
        case 'Anak Buah Kapal': return '#8e44ad';
        default: return '#4a69bd';
    }
}

/**
 * Fungsi aman untuk generate ID Card (dengan error handling)
 * @param {string} id - ID nelayan
 */
function safeGenerateIDCard(id) {
    try {
        if (!id) {
            showNotification('ID nelayan tidak valid!', 'error');
            return;
        }
        
        generateIDCard(id);
    } catch (error) {
        console.error('Error in safeGenerateIDCard:', error);
        showNotification(`Gagal membuat ID Card: ${error.message}`, 'error');
    }
}

// =====================================================
// FUNGSI NOTIFIKASI FALLBACK
// =====================================================

/**
 * Fungsi fallback untuk notifikasi jika tidak ada di window
 * @param {string} message - Pesan notifikasi
 * @param {string} type - Tipe notifikasi (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Coba gunakan fungsi showNotification dari window jika ada
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback menggunakan alert
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Buat toast Bootstrap sederhana
    const toastContainer = document.querySelector('.toast-container') || document.createElement('div');
    if (!document.querySelector('.toast-container')) {
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1100';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'} text-white">
            <strong class="me-auto">${type === 'success' ? 'Berhasil' : type === 'error' ? 'Error' : type === 'warning' ? 'Peringatan' : 'Info'}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    if (toastElement && typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // Hapus toast setelah 5 detik
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 5000);
    } else {
        alert(message);
    }
}

// =====================================================
// INISIALISASI DAN EKSPOR FUNGSI
// =====================================================

// Cek dan inisialisasi saat file dimuat
console.log('✅ SIMPADAN TANGKAP - ID Card Generator loaded');

// Ekspor fungsi ke global scope untuk akses dari file lain
if (typeof window !== 'undefined') {
    window.generateIDCard = generateIDCard;
    window.safeGenerateIDCard = safeGenerateIDCard;
    window.batchGenerateIDCards = batchGenerateIDCards;
    window.previewIDCardHTML = previewIDCardHTML;
    window.showIDCardPreview = showIDCardPreview;
    window.getProfesiColor = getProfesiColor;
    window.getStatusColor = getStatusColor;
    window.checkIDCardLibraries = checkIDCardLibraries;
    
    // Alias untuk kompatibilitas dengan kode lama
    window.generateSimataIDCard = generateIDCard;
}

// Auto-initialize jika diperlukan
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ ID Card Generator initialized successfully');
    });
} else {
    console.log('✅ ID Card Generator initialized successfully');
}
