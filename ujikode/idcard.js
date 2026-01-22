// =============================================================
// idcard.js - SISTEM CETAK ID CARD NELAYAN SIMPADAN TANGKAP
// Versi: 3.0 - FULLY COMPATIBLE dengan SIMPADAN TANGKAP v5.9
// =============================================================

// Global variables untuk ID Card
let idCardGenerated = false;
let idCardProcessing = false;

/**
 * Fungsi utama untuk menghasilkan ID Card nelayan
 * Dipanggil dari sistem utama saat tombol ID Card diklik
 * Kompatibel dengan safeGenerateIDCard dari index.html
 */
function generateIDCard(id) {
    console.log('🔍 generateIDCard dipanggil dengan ID:', id);
    
    if (idCardProcessing) {
        showNotification('Sedang memproses ID Card sebelumnya. Mohon tunggu...', 'warning');
        return;
    }
    
    // Pastikan appData tersedia
    if (!window.appData || !Array.isArray(window.appData)) {
        console.error('appData tidak ditemukan atau bukan array');
        showNotification('Data aplikasi tidak tersedia. Silakan refresh halaman.', 'error');
        return;
    }
    
    // Cari data nelayan berdasarkan ID
    console.log('Mencari data nelayan dengan ID:', id);
    console.log('Jumlah data appData:', window.appData.length);
    
    const nelayanData = window.appData.find(item => {
        console.log('Item ID:', item.id, 'Type:', typeof item.id, 'Target ID:', id, 'Type:', typeof id);
        return String(item.id) === String(id);
    });
    
    if (!nelayanData) {
        console.error('Data nelayan tidak ditemukan untuk ID:', id);
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    console.log('Data ditemukan:', nelayanData.nama);
    
    // Validasi data required
    if (!nelayanData.nama || !nelayanData.nik) {
        showNotification('Data nama dan NIK harus diisi!', 'error');
        return;
    }
    
    // Tampilkan loading
    idCardProcessing = true;
    const loadingEl = document.getElementById('idcardLoading');
    if (loadingEl) {
        loadingEl.classList.add('active');
        const loadingText = loadingEl.querySelector('h6');
        if (loadingText) {
            loadingText.textContent = `Membuat ID Card untuk ${nelayanData.nama}`;
        }
    }
    
    // Panggil fungsi utama untuk membuat ID Card
    setTimeout(() => {
        generateSimataIDCard(nelayanData);
    }, 300);
}

/**
 * Fungsi alternatif untuk generateIDCard dari modal detail
 */
function safeGenerateIDCard(id) {
    console.log('🛡️ safeGenerateIDCard dipanggil dengan ID:', id);
    generateIDCard(id);
}

/**
 * Fungsi utama untuk menghasilkan ID Card nelayan dengan data lengkap
 */
function generateSimataIDCard(nelayanData) {
    console.log('🎨 generateSimataIDCard dipanggil untuk:', nelayanData.nama);
    
    if (!nelayanData || typeof nelayanData !== 'object') {
        console.error('Data nelayan tidak valid');
        showNotification('Data nelayan tidak valid!', 'error');
        idCardProcessing = false;
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) loadingEl.classList.remove('active');
        return;
    }
    
    try {
        // Validasi data required
        if (!nelayanData.nama || !nelayanData.nik) {
            showNotification('Data nama dan NIK harus diisi!', 'error');
            idCardProcessing = false;
            const loadingEl = document.getElementById('idcardLoading');
            if (loadingEl) loadingEl.classList.remove('active');
            return;
        }
        
        // Cek ketersediaan library
        if (typeof jspdf === 'undefined') {
            console.error('Library jsPDF tidak ditemukan');
            showNotification('Library PDF tidak tersedia. Pastikan jsPDF dimuat dengan benar.', 'error');
            idCardProcessing = false;
            const loadingEl = document.getElementById('idcardLoading');
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
        const qrData = `SIMPADAN-TANGKAP\nNama: ${nelayanData.nama}\nNIK: ${nelayanData.nik}\nKode: ${nelayanData.kodeValidasi || 'N/A'}\nValidasi: ${nelayanData.tanggalValidasi || ''}`;
        
        // Bersihkan container sebelumnya jika ada
        qrContainer.innerHTML = '';
        
        // Periksa apakah QRCode tersedia
        if (typeof QRCode === 'undefined') {
            console.warn('QRCode library tidak ditemukan, menggunakan fallback');
            generateIDCardPDFWithNewLayout(nelayanData, null);
            if (document.getElementById('idcardLoading')) {
                document.getElementById('idcardLoading').classList.remove('active');
            }
            idCardProcessing = false;
            if (document.body.contains(qrContainer)) {
                document.body.removeChild(qrContainer);
            }
            return;
        }
        
        // Buat QR Code dengan error handling
        try {
            console.log('Membuat QR Code...');
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
                console.log('Memproses PDF...');
                generateIDCardPDFWithNewLayout(nelayanData, qrContainer);
                if (document.body.contains(qrContainer)) {
                    document.body.removeChild(qrContainer);
                }
                const loadingEl = document.getElementById('idcardLoading');
                if (loadingEl) {
                    loadingEl.classList.remove('active');
                }
                idCardProcessing = false;
            }, 800);
            
        } catch (qrError) {
            console.warn('Error membuat QR Code:', qrError);
            generateIDCardPDFWithNewLayout(nelayanData, null);
            if (document.body.contains(qrContainer)) {
                document.body.removeChild(qrContainer);
            }
            const loadingEl = document.getElementById('idcardLoading');
            if (loadingEl) {
                loadingEl.classList.remove('active');
            }
            idCardProcessing = false;
        }
        
    } catch (error) {
        console.error('Error generating ID Card:', error);
        showNotification('Terjadi kesalahan saat membuat ID Card!', 'error');
        idCardProcessing = false;
        
        const loadingEl = document.getElementById('idcardLoading');
        if (loadingEl) loadingEl.classList.remove('active');
    }
}

/**
 * Generate PDF untuk ID Card dengan LAYOUT BARU
 */
function generateIDCardPDFWithNewLayout(nelayanData, qrContainer) {
    console.log('📄 Membuat PDF ID Card...');
    
    // Validasi library jsPDF
    if (typeof jspdf === 'undefined') {
        console.error('jsPDF tidak ditemukan');
        showNotification('Library PDF tidak tersedia!', 'error');
        idCardProcessing = false;
        return;
    }
    
    const { jsPDF } = window.jspdf;
    
    try {
        // Buat PDF dengan orientasi landscape untuk kartu ID (ukuran kartu ID standar: 85.6 x 54 mm)
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [85.6, 54] // Ukuran kartu ID
        });
        
        // Warna tema SIMPADAN TANGKAP
        const primaryColor = [12, 36, 97]; // Biru tua
        const accentColor = [246, 185, 59]; // Kuning emas
        const lightBlue = [240, 248, 255]; // Biru muda untuk background
        const white = [255, 255, 255];
        const darkGray = [33, 37, 41];
        
        // 1. BACKGROUND UTAMA
        doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
        doc.rect(0, 0, 85.6, 54, 'F');
        
        // 2. HEADER dengan warna biru tua
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.roundedRect(2, 2, 81.6, 10, 2, 2, 'F');
        
        // Garis aksen di header (kuning emas)
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
        doc.text("SIMPADAN TANGKAP - DINAS PERIKANAN SITUBONDO", 42.8, 9, { align: 'center' });
        
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
        
        // Nama (dipotong jika terlalu panjang)
        let namaDisplay = (nelayanData.nama || '').toUpperCase();
        if (namaDisplay.length > 22) {
            namaDisplay = namaDisplay.substring(0, 20) + '...';
        }
        doc.text(`Nama: ${namaDisplay}`, leftX, currentY);
        currentY += lineHeight;
        
        // NIK
        const displayNik = maskData ? maskData(nelayanData.nik) : nelayanData.nik;
        doc.text(`NIK: ${displayNik || ''}`, leftX, currentY);
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
        
        // Kolom Kanan: Data Kapal dan Profesi
        currentY = 16;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("DATA PROFESI", rightX, currentY);
        currentY += 3.5;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        // Profesi dengan warna yang sesuai
        const profesi = nelayanData.profesi || '';
        let profesiColor = [74, 105, 189]; // Default blue
        
        if (profesi === "Nelayan Penuh Waktu") {
            profesiColor = [12, 36, 97]; // Biru tua
        } else if (profesi === "Nelayan Sambilan Utama") {
            profesiColor = [230, 126, 34]; // Oranye
        } else if (profesi === "Nelayan Sambilan Tambahan") {
            profesiColor = [39, 174, 96]; // Hijau
        }
        
        doc.setFillColor(profesiColor[0], profesiColor[1], profesiColor[2]);
        doc.roundedRect(rightX, currentY - 2, 35, 4, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.text((profesi || '-').toUpperCase(), rightX + 17.5, currentY, { align: 'center' });
        
        currentY += lineHeight + 1;
        
        // Tampilkan data kapal hanya jika status pemilik kapal
        const status = nelayanData.status || '';
        if (status === "Pemilik Kapal") {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("KAPAL DIMILIKI:", rightX, currentY);
            currentY += 3;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5.5);
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            
            // Nama Kapal
            let namaKapal = nelayanData.namaKapal || '-';
            if (namaKapal.length > 25) {
                namaKapal = namaKapal.substring(0, 23) + '...';
            }
            doc.text(`Nama: ${namaKapal}`, rightX, currentY);
            currentY += lineHeight - 1;

            // Jenis Kapal
            let jenisKapal = nelayanData.jenisKapal || '-';
            if (jenisKapal.length > 25) {
                jenisKapal = jenisKapal.substring(0, 23) + '...';
            }
            doc.text(`Jenis: ${jenisKapal}`, rightX, currentY);
            currentY += lineHeight - 1;
        } else {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("STATUS:", rightX, currentY);
            currentY += 3;
            
            // Status pekerjaan
            let statusColor = [74, 105, 189];
            if (status === "Pemilik Kapal") {
                statusColor = [9, 132, 227];
            } else if (status === "Anak Buah Kapal") {
                statusColor = [142, 68, 173];
            }
            
            doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.roundedRect(rightX, currentY - 2, 35, 4, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.text((status || '-').toUpperCase(), rightX + 17.5, currentY, { align: 'center' });
            
            currentY += lineHeight;
        }
        
        // Alat Tangkap
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        
        let alatTangkap = nelayanData.alatTangkap || '-';
        if (alatTangkap.length > 25) {
            alatTangkap = alatTangkap.substring(0, 23) + '...';
        }
        doc.text(`Alat Tangkap: ${alatTangkap}`, rightX, currentY);
        
        // 5. ID VALIDASI DI KIRI BAWAH
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(230, 126, 34); // Warna oranye
        const kodeValidasi = nelayanData.kodeValidasi || '';
        const idNumber = kodeValidasi || `SIMPADAN-${(nelayanData.nik || '').substring(12)}`;
        doc.text(`ID: ${idNumber}`, 5, 45);
        
        // 6. TEKS "Kartu Identitas Resmi - Berlaku Selamanya"
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(4.5);
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
                    doc.setFontSize(4);
                    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                    doc.setFont('helvetica', 'bold');
                    doc.text("SCAN VERIFIKASI", 72.5, 52, { align: 'center' });
                } catch (e) {
                    console.warn('QR Code gagal ditambahkan:', e);
                    qrAdded = false;
                }
            }
        }
        
        if (!qrAdded) {
            createFallbackQRCode(doc, 65, 35, 15, 15, 72.5, 52);
        }
        
        // 8. BORDER KARTU dengan warna tema
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.8);
        doc.roundedRect(1, 1, 83.6, 52, 3, 3);
        
        // 9. SIMPAN FILE
        const safeFileName = (nelayanData.nama || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_').toUpperCase();
        const fileName = `ID_CARD_${safeFileName}_${nelayanData.nik || 'unknown'}.pdf`;
        
        setTimeout(() => {
            try {
                console.log('Menyimpan file PDF:', fileName);
                doc.save(fileName);
                idCardGenerated = true;
                
                showNotification(`✅ ID Card ${nelayanData.nama} berhasil dibuat!`, 'success');
            } catch (saveError) {
                console.error('Error saving PDF:', saveError);
                showNotification('Gagal menyimpan ID Card. Silakan coba lagi!', 'error');
            }
        }, 500);
        
    } catch (error) {
        console.error('Error dalam generateIDCardPDFWithNewLayout:', error);
        showNotification('Terjadi kesalahan saat membuat PDF!', 'error');
        idCardProcessing = false;
    }
}

/**
 * Fungsi untuk membuat QR Code fallback jika library QRCode tidak tersedia
 */
function createFallbackQRCode(doc, x, y, width, height, textX, textY) {
    try {
        doc.setFillColor(240, 248, 255);
        doc.roundedRect(x, y, width, height, 2, 2, 'F');
        doc.setDrawColor(12, 36, 97);
        doc.setLineWidth(0.5);
        doc.rect(x, y, width, height);
        
        // Gambar kotak-kotak sederhana sebagai simulasi QR Code
        doc.setFillColor(12, 36, 97);
        doc.rect(x + 3, y + 3, 3, 3, 'F');
        doc.rect(x + width - 6, y + 3, 3, 3, 'F');
        doc.rect(x + 3, y + height - 6, 3, 3, 'F');
        
        doc.setTextColor(12, 36, 97);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text("QR", textX, y + height/2 - 2, { align: 'center' });
        doc.text("CODE", textX, y + height/2 + 2, { align: 'center' });
        doc.setFontSize(4);
        doc.text("SCAN VERIFIKASI", textX, textY, { align: 'center' });
    } catch (error) {
        console.warn('Gagal membuat fallback QR code:', error);
    }
}

/**
 * Fungsi untuk menghasilkan preview ID Card dalam format HTML
 */
function previewIDCardHTML(nelayanData) {
    if (!nelayanData) return '<div class="alert alert-danger">Data tidak tersedia</div>';
    
    // Tentukan class status berdasarkan profesi
    let statusClass = 'badge-profesi-penuh';
    if (nelayanData.profesi === "Nelayan Sambilan Utama") {
        statusClass = 'badge-profesi-sambilan-utama';
    } else if (nelayanData.profesi === "Nelayan Sambilan Tambahan") {
        statusClass = 'badge-profesi-sambilan-tambahan';
    }
    
    // Potong teks jika terlalu panjang
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
    
    const nikDisplay = maskData ? maskData(nelayanData.nik) : nelayanData.nik;
    const isPemilikKapal = nelayanData.status === "Pemilik Kapal";
    
    return `
    <div class="id-card-container">
        <div class="id-card-improved">
            <div class="id-card-improved-header">
                <h4 class="id-card-improved-title">KARTU IDENTITAS NELAYAN</h4>
                <p class="id-card-improved-subtitle">SIMPADAN TANGKAP - DINAS PERIKANAN SITUBONDO</p>
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
                            <span class="id-card-improved-label">PROFESI:</span>
                            <span class="id-card-improved-value">
                                <span class="badge ${statusClass}">${(nelayanData.profesi || '').toUpperCase()}</span>
                            </span>
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
 * Fungsi untuk batch generate ID Cards (multiple)
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
    
    const appData = window.appData ? window.appData : [];
    const selectedNelayan = appData.filter(n => n && n.id && nelayanIds.includes(String(n.id)));
    
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
            // Gunakan setTimeout untuk memberikan jeda antara pembuatan ID Card
            setTimeout(() => {
                generateSimataIDCard(nelayan);
            }, processed * 1000);
        }
        processed++;
        
        // Proses berikutnya dengan jeda 1.5 detik
        setTimeout(processNext, 1500);
    };
    
    processNext();
}

/**
 * Fungsi untuk menampilkan preview modal ID Card
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
                    <button type="button" class="btn btn-primary" onclick="generateIDCard('${nelayanData.id || ''}')">
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

/**
 * Fungsi untuk mencetak ID Card langsung dari data yang ditampilkan di modal detail
 */
function printIDCardFromDetail() {
    if (window.currentDetailId) {
        generateIDCard(window.currentDetailId);
    } else {
        showNotification('Tidak ada data nelayan yang dipilih!', 'error');
    }
}

/**
 * Helper function untuk mendapatkan warna berdasarkan profesi
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
 * Fungsi untuk mengecek ketersediaan library yang diperlukan
 */
function checkRequiredLibraries() {
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

// ================================
// FUNGSI NOTIFIKASI (Fallback)
// ================================

/**
 * Fungsi notifikasi fallback jika tidak tersedia dari sistem utama
 */
function showNotification(message, type = 'info') {
    // Jika fungsi showNotification sudah ada di window, gunakan itu
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback: buat notifikasi sederhana
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Coba gunakan Bootstrap Toast jika tersedia
    const toastContainer = document.querySelector('.toast-container');
    if (toastContainer && typeof bootstrap !== 'undefined') {
        const toastId = 'idcard-toast-' + Date.now();
        const toastHTML = `
        <div class="toast notification-toast" id="${toastId}" role="alert">
            <div class="toast-header">
                <strong class="me-auto">
                    ${type === 'success' ? '<i class="fas fa-check-circle me-2 text-success"></i>Berhasil' : 
                      type === 'error' ? '<i class="fas fa-exclamation-circle me-2 text-danger"></i>Error' : 
                      type === 'warning' ? '<i class="fas fa-exclamation-triangle me-2 text-warning"></i>Peringatan' : 
                      '<i class="fas fa-info-circle me-2 text-info"></i>Informasi'}
                </strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
            
            // Hapus toast setelah 5 detik
            setTimeout(() => {
                if (toastElement && toastElement.parentNode) {
                    toastElement.parentNode.removeChild(toastElement);
                }
            }, 5000);
        }
    } else {
        // Fallback paling dasar: alert
        alert(message);
    }
}

// ================================
// MASK DATA HELPER (Fallback)
// ================================

/**
 * Fungsi maskData fallback jika tidak tersedia dari sistem utama
 */
function maskData(data, force = false) {
    if (!data) return "-";
    if (data === '00000000') return "Tidak Ada";
    
    // Gunakan privacyMode dari appSettings jika tersedia
    const privacyMode = window.appSettings ? window.appSettings.privacyMode : true;
    
    if (!privacyMode && !force) return data.toString();
    
    let str = data.toString();
    if (str.length <= 4) return str;
    
    const maskedLength = Math.min(4, str.length);
    const visiblePart = str.slice(0, -maskedLength);
    const maskedPart = '*'.repeat(maskedLength);
    return visiblePart + maskedPart;
}

// ================================
// INISIALISASI DAN EKSPOR FUNGSI
// ================================

// Periksa ketersediaan library saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ SIMPADAN TANGKAP ID Card Generator v3.0 loaded');
    console.log('appData tersedia:', !!window.appData);
    console.log('appSettings tersedia:', !!window.appSettings);
    console.log('jspdf tersedia:', typeof jspdf !== 'undefined');
    console.log('QRCode tersedia:', typeof QRCode !== 'undefined');
    
    // Periksa library yang diperlukan
    const libsAvailable = checkRequiredLibraries();
    if (!libsAvailable) {
        console.warn('Beberapa library tidak tersedia. Fitur ID Card mungkin terbatas.');
    }
    
    // Tambahkan style untuk ID Card preview jika belum ada
    if (!document.getElementById('idcard-styles')) {
        const style = document.createElement('style');
        style.id = 'idcard-styles';
        style.textContent = `
            .id-card-container {
                display: flex;
                justify-content: center;
                padding: 20px;
            }
            
            .id-card-improved {
                width: 340px;
                height: 216px;
                background: linear-gradient(135deg, #f0f8ff 0%, #e6f0ff 100%);
                border-radius: 12px;
                border: 2px solid #0c2461;
                position: relative;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(12, 36, 97, 0.2);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .id-card-improved-header {
                background: #0c2461;
                color: white;
                padding: 12px;
                text-align: center;
                border-bottom: 3px solid #f6b93b;
            }
            
            .id-card-improved-title {
                font-size: 14px;
                font-weight: 800;
                margin: 0;
                letter-spacing: 0.5px;
            }
            
            .id-card-improved-subtitle {
                font-size: 9px;
                margin: 2px 0 0;
                opacity: 0.9;
            }
            
            .id-card-improved-content {
                display: flex;
                padding: 15px;
            }
            
            .id-card-improved-left {
                flex: 1;
            }
            
            .id-card-improved-name {
                color: #0c2461;
                font-size: 18px;
                font-weight: 800;
                margin: 0 0 10px;
                border-bottom: 2px solid #f6b93b;
                padding-bottom: 5px;
            }
            
            .id-card-improved-details {
                margin-top: 5px;
            }
            
            .id-card-improved-detail {
                display: flex;
                margin-bottom: 6px;
                font-size: 11px;
            }
            
            .id-card-improved-label {
                font-weight: 700;
                color: #0c2461;
                min-width: 70px;
            }
            
            .id-card-improved-value {
                color: #333;
                flex: 1;
            }
            
            .id-card-improved-id-left {
                position: absolute;
                bottom: 10px;
                left: 15px;
            }
            
            .id-card-id-number-left {
                display: block;
                font-size: 12px;
                font-weight: 800;
                color: #e67e22;
            }
            
            .id-card-validity-text {
                display: block;
                font-size: 8px;
                color: #666;
                margin-top: 2px;
            }
            
            .id-card-improved-qr-right {
                position: absolute;
                bottom: 15px;
                right: 15px;
                width: 70px;
                text-align: center;
            }
            
            .id-card-scan-text {
                font-size: 7px;
                color: #0c2461;
                font-weight: 700;
                margin-top: 4px;
            }
            
            /* Loading untuk ID Card */
            .idcard-loading {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999;
                align-items: center;
                justify-content: center;
            }
            
            .idcard-loading.active {
                display: flex;
            }
            
            .idcard-loading-content {
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                max-width: 300px;
            }
        `;
        document.head.appendChild(style);
    }
});

// Ekspor fungsi ke global scope untuk akses dari file lain
if (typeof window !== 'undefined') {
    window.generateIDCard = generateIDCard;
    window.safeGenerateIDCard = safeGenerateIDCard;
    window.generateSimataIDCard = generateSimataIDCard;
    window.previewIDCardHTML = previewIDCardHTML;
    window.batchGenerateIDCards = batchGenerateIDCards;
    window.showIDCardPreview = showIDCardPreview;
    window.printIDCardFromDetail = printIDCardFromDetail;
    window.getProfesiColor = getProfesiColor;
    window.getStatusColor = getStatusColor;
    window.checkRequiredLibraries = checkRequiredLibraries;
    window.showNotification = showNotification;
    window.maskData = maskData;
}

console.log('✅ SIMPADAN TANGKAP ID Card Generator v3.0 siap digunakan');
console.log('🎯 Fungsi tersedia: generateIDCard, safeGenerateIDCard');
