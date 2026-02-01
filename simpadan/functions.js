// =====================================================
// FUNCTIONS.JS - UTILITY FUNCTIONS FOR SIMPADAN TANGKAP
// PART 2: UTILITY FUNCTIONS
// =====================================================

// --- FUNGSI BACKUP DATA YANG DISEMPURNAKAN (DENGAN LOADING EFFECT) ---
function backupData(fileName = null) {
    try {
        showLoading("Membuat Backup", "Sedang menyimpan data ke file backup. Mohon tunggu...");
        
        setTimeout(() => {
            let dataToBackup = appData;
            let backupFileName = fileName || 'reload.js';
            let backupContent = '';
            
            // Tentukan nama file berdasarkan mode
            if (!fileName && currentWilayah.mode === 'desa' && currentWilayah.desaName) {
                backupFileName = currentWilayah.fileName;
                
                // Filter data hanya untuk desa yang dipilih
                dataToBackup = appData.filter(d => d.desa === currentWilayah.desaName);
                
                backupContent = `// DATA NELAYAN DESA ${currentWilayah.desaName.toUpperCase()}
// File: ${backupFileName}
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            } else {
                backupContent = `// DATA NELAYAN GLOBAL - SISTEM PEMETAAN NELAYAN
// File: ${backupFileName}
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            }
            
            // Buat dan download file
            const blob = new Blob([backupContent], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = backupFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            hideLoading();
            showNotification(`Backup berhasil: ${backupFileName} (${dataToBackup.length} data)`, 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Backup error:', error);
        hideLoading();
        showNotification('Gagal membuat backup. Silakan coba lagi.', 'error');
    }
}

// --- FUNGSI RESTORE DATA YANG DISEMPURNAKAN (DENGAN LOADING EFFECT) ---
function restoreData() {
    const fileInput = document.getElementById('restoreFileInput');
    if (!fileInput.files.length) return;
    
    showLoading("Restore Data", "Sedang memproses restore data. Mohon tunggu, proses ini mungkin memerlukan waktu beberapa saat...");
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let restoredData = [];
            
            // Coba parse sebagai JSON langsung
            try {
                restoredData = JSON.parse(content);
            } catch (jsonError) {
                // Jika bukan JSON, coba ekstrak dari JavaScript
                if (content.includes('SIMATA_BACKUP_DATA')) {
                    // Ekstrak data dari window.SIMATA_BACKUP_DATA
                    const match = content.match(/window\.SIMATA_BACKUP_DATA\s*=\s*(\[.*?\]);/s);
                    if (match) {
                        restoredData = JSON.parse(match[1]);
                    } else {
                        throw new Error('Format data tidak dikenali');
                    }
                } else {
                    throw new Error('File tidak berisi data SIMATA yang valid');
                }
            }
            
            if (!Array.isArray(restoredData)) {
                throw new Error('Data harus berupa array');
            }
            
            if (restoredData.length === 0) {
                hideLoading();
                showNotification('File tidak berisi data', 'warning');
                return;
            }
            
            // Merge data lama dengan data baru
            const existingData = appData;
            const mergedData = mergeData(existingData, restoredData);
            
            const newCount = restoredData.length;
            const existingCount = existingData.length;
            const mergedCount = mergedData.length;
            const replacedCount = existingCount + newCount - mergedCount;
            const addedCount = mergedCount - existingCount;
            
            appData = mergedData;
            saveData();
            renderDataTable();
            updateDashboard();
            updateFilterDesaOptions();
            
            let message = '';
            if (replacedCount > 0 && addedCount > 0) {
                message = `Restore berhasil: ${replacedCount} data diperbarui, ${addedCount} data baru ditambahkan`;
            } else if (replacedCount > 0) {
                message = `Restore berhasil: ${replacedCount} data diperbarui`;
            } else if (addedCount > 0) {
                message = `Restore berhasil: ${addedCount} data baru ditambahkan`;
            } else {
                message = 'Tidak ada data baru untuk di-restore';
            }
            
            hideLoading();
            showNotification(message, 'success');
            fileInput.value = '';
            document.getElementById('restoreDataBtn').disabled = true;
            
        } catch (error) {
            console.error('Restore error:', error);
            hideLoading();
            showNotification(`Gagal restore: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        hideLoading();
        showNotification('Gagal membaca file', 'error');
    };
    
    reader.readAsText(file);
}

// --- FUNGSI MERGE DATA ---
function mergeData(existingData, newData) {
    // Buat map untuk data yang sudah ada dengan NIK sebagai key
    const dataMap = new Map();
    
    // Tambahkan data yang sudah ada ke map
    existingData.forEach(item => {
        dataMap.set(item.nik, item);
    });
    
    // Tambahkan atau timpa data baru
    newData.forEach(item => {
        dataMap.set(item.nik, item);
    });
    
    // Kembalikan sebagai array
    return Array.from(dataMap.values());
}

// --- FUNGSI RELOAD DATA YANG DISEMPURNAKAN (DENGAN LOADING EFFECT) ---
function handleReloadRepo() {
    showLoading("Sinkronisasi Data", "Sedang melakukan sinkronisasi data dari server. Mohon tunggu, proses ini mungkin memerlukan waktu beberapa saat...");
    
    // Tentukan file yang akan dimuat berdasarkan mode
    const fileName = currentWilayah.mode === 'desa' ? currentWilayah.fileName : 'reload.js';
    
    // Coba load ulang file
    const script = document.createElement('script');
    script.src = fileName + '?t=' + new Date().getTime();
    
    script.onload = function() {
        console.log(`File ${fileName} berhasil dimuat ulang`);
        
        // Beri waktu untuk pemrosesan
        setTimeout(() => {
            if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                try {
                    // Ganti data dengan data baru
                    appData = window.SIMATA_BACKUP_DATA;
                    saveData();
                    renderDataTable();
                    updateDashboard();
                    updateFilterDesaOptions();
                    
                    hideLoading();
                    showNotification(`Data berhasil disinkronisasi dari ${fileName} (${appData.length} data)`, 'success');
                    
                } catch (error) {
                    console.error('Reload error:', error);
                    hideLoading();
                    showNotification('Gagal memuat data. Format data tidak valid.', 'error');
                }
            } else {
                hideLoading();
                showNotification(`Tidak ada data yang ditemukan di file ${fileName}`, 'warning');
            }
        }, 500);
    };
    
    script.onerror = function() {
        console.error(`Gagal memuat file ${fileName}`);
        hideLoading();
        showNotification(`Maaf, Data Tidak Ditemukan Di SIMPADAN TANGKAP`, 'error');
    };
    
    document.head.appendChild(script);
}

// --- FUNGSI VERIFIKASI KIN ---
function verifyKIN(input) {
    if (!input || input.trim() === '') {
        return { success: false, message: "Masukkan Kode Validasi (KIN) atau NIK untuk verifikasi" };
    }
    
    const cleanInput = input.trim().toUpperCase();
    
    // Cari berdasarkan Kode Validasi (KIN)
    const byKodeValidasi = appData.find(d => d.kodeValidasi && d.kodeValidasi.toUpperCase() === cleanInput);
    if (byKodeValidasi) {
        return { 
            success: true, 
            data: byKodeValidasi,
            type: 'kin',
            message: "Data ditemukan berdasarkan Kode Validasi (KIN)"
        };
    }
    
    // Cari berdasarkan NIK
    const byNIK = appData.find(d => d.nik === cleanInput);
    if (byNIK) {
        return { 
            success: true, 
            data: byNIK,
            type: 'nik',
            message: "Data ditemukan berdasarkan NIK"
        };
    }
    
    // Coba tanpa prefix VLD-
    if (cleanInput.startsWith('VLD-')) {
        const withoutPrefix = cleanInput.substring(4);
        const byKodeWithoutPrefix = appData.find(d => d.kodeValidasi && d.kodeValidasi.toUpperCase().endsWith(withoutPrefix));
        if (byKodeWithoutPrefix) {
            return { 
                success: true, 
                data: byKodeWithoutPrefix,
                type: 'kin',
                message: "Data ditemukan berdasarkan Kode Validasi (tanpa prefix VLD-)"
            };
        }
    }
    
    return { 
        success: false, 
        message: "Data tidak ditemukan. Pastikan Kode Validasi (KIN) atau NIK yang dimasukkan benar."
    };
}

function displayVerifyResult(result) {
    const card = document.getElementById('verifyResultCard');
    const header = document.getElementById('verifyResultHeader');
    const icon = document.getElementById('verifyResultIcon');
    const title = document.getElementById('verifyResultTitle');
    const subtitle = document.getElementById('verifyResultSubtitle');
    const content = document.getElementById('verifyResultContent');
    const detailBtn = document.getElementById('verifyDetailBtn');
    const idCardBtn = document.getElementById('verifyIdCardBtn');
    const allKinCard = document.getElementById('allKinCard');
    
    // Sembunyikan daftar semua KIN jika sedang ditampilkan
    if (allKinCard) allKinCard.style.display = 'none';
    
    if (result.success) {
        const data = result.data;
        verifyDataResult = data;
        
        // Update UI untuk hasil sukses
        card.className = 'card shadow-sm border-0 mb-4 verify-success';
        header.className = 'verify-result-header p-4 bg-success text-white';
        icon.innerHTML = '<i class="fas fa-check-circle fa-3x"></i>';
        title.textContent = 'VERIFIKASI BERHASIL';
        subtitle.textContent = result.message;
        
        // Isi konten
        content.innerHTML = `
            <div class="col-md-6">
                <div class="verify-result-item">
                    <div class="verify-result-label">Nama Lengkap</div>
                    <div class="verify-result-value fw-bold">${data.nama}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">NIK</div>
                    <div class="verify-result-value font-monospace">${maskData(data.nik)}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Kode Validasi (KIN)</div>
                    <div class="verify-result-value">
                        <span class="kin-badge">${data.kodeValidasi || 'Tidak Ada'}</span>
                    </div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Alamat Lengkap</div>
                    <div class="verify-result-value">${data.alamat || '-'}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Domisili</div>
                    <div class="verify-result-value">${data.desa}, ${data.kecamatan}</div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="verify-result-item">
                    <div class="verify-result-label">Profesi</div>
                    <div class="verify-result-value">
                        <span class="badge ${data.profesi === 'Nelayan Penuh Waktu' ? 'badge-profesi-penuh' : data.profesi === 'Nelayan Sambilan Utama' ? 'badge-profesi-sambilan-utama' : 'badge-profesi-sambilan-tambahan'}">
                            ${data.profesi}
                        </span>
                    </div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Status</div>
                    <div class="verify-result-value">
                        <span class="badge ${data.status === 'Pemilik Kapal' ? 'bg-info' : 'bg-secondary'}">
                            ${data.status}
                        </span>
                    </div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Alat Tangkap (API)</div>
                    <div class="verify-result-value">${data.alatTangkap}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Tanggal Validasi</div>
                    <div class="verify-result-value">${data.tanggalValidasi} oleh ${data.validator}</div>
                </div>
            </div>
        `;
        
        // Tampilkan tombol aksi
        detailBtn.style.display = 'inline-block';
        detailBtn.onclick = () => {
            viewDetail(data.id);
            detailModal.show();
        };
        
        idCardBtn.style.display = 'inline-block';
        idCardBtn.onclick = () => {
            safeGenerateIDCard(data.id);
        };
        
    } else {
        // Update UI untuk hasil gagal
        card.className = 'card shadow-sm border-0 mb-4 verify-error';
        header.className = 'verify-result-header p-4 bg-danger text-white';
        icon.innerHTML = '<i class="fas fa-times-circle fa-3x"></i>';
        title.textContent = 'VERIFIKASI GAGAL';
        subtitle.textContent = result.message;
        
        // Isi konten
        content.innerHTML = `
            <div class="col-md-12 text-center py-4">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Data Tidak Ditemukan</h5>
                <p class="text-muted">Kode Validasi (KIN) atau NIK yang dimasukkan tidak terdaftar dalam database.</p>
                <div class="alert alert-warning mt-3">
                    <i class="fas fa-lightbulb me-2"></i>
                    <strong>Saran:</strong> Periksa kembali ketikan atau gunakan fitur "Tampilkan Semua KIN" untuk melihat daftar kode validasi yang terdaftar.
                </div>
            </div>
        `;
        
        // Sembunyikan tombol aksi
        detailBtn.style.display = 'none';
        idCardBtn.style.display = 'none';
    }
    
    // Tampilkan kartu hasil
    card.style.display = 'block';
    
    // Scroll ke hasil dengan animasi smooth
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function setVerifyExample(type) {
    const input = document.getElementById('verifyInput');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    // Reset semua breadcrumb
    breadcrumbItems.forEach(item => item.classList.remove('active'));
    
    if (type === 'kin') {
        input.value = 'VLD-';
        input.placeholder = 'Masukkan Kode Validasi (contoh: VLD-ABC123)';
        input.focus();
        breadcrumbItems[0].classList.add('active');
    } else if (type === 'nik') {
        input.value = '';
        input.placeholder = 'Masukkan NIK 16 digit';
        input.focus();
        breadcrumbItems[1].classList.add('active');
    } else if (type === 'all') {
        breadcrumbItems[2].classList.add('active');
        showAllKIN();
    }
}

function showAllKIN() {
    const allKinCard = document.getElementById('allKinCard');
    const tbody = document.getElementById('allKinTableBody');
    const totalKinCount = document.getElementById('totalKinCount');
    const verifyResultCard = document.getElementById('verifyResultCard');
    
    // Sembunyikan hasil verifikasi individual
    if (verifyResultCard) verifyResultCard.style.display = 'none';
    
    // Filter data yang memiliki kode validasi
    const dataWithKIN = appData.filter(d => d.kodeValidasi && d.kodeValidasi.trim() !== '');
    
    // Update count
    totalKinCount.textContent = dataWithKIN.length;
    
    if (dataWithKIN.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="fas fa-info-circle me-2"></i>
                    Tidak ada data dengan Kode Validasi (KIN) yang terdaftar
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = '';
        dataWithKIN.sort((a, b) => a.kodeValidasi.localeCompare(b.kodeValidasi)).forEach((d, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <span class="kin-badge">${d.kodeValidasi}</span>
                    </td>
                    <td>
                        <div class="fw-bold">${d.nama}</div>
                        <small class="text-muted">${d.usia} Tahun</small>
                    </td>
                    <td class="font-monospace">${maskData(d.nik)}</td>
                    <td>
                        <div class="small">${d.alamat || '-'}</div>
                        <div class="small">${d.desa}</div>
                        <div class="small text-muted">${d.kecamatan}</div>
                    </td>
                    <td>
                        <span class="badge ${d.status === 'Pemilik Kapal' ? 'bg-info' : 'bg-secondary'}">
                            ${d.status}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="verifyKINAndShow('${d.kodeValidasi}')" title="Verifikasi">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-outline-info" onclick="viewDetail('${d.id}')" title="Detail">
                                <i class="fas fa-eye"></i></button>
                            <button class="btn btn-outline-success" onclick="safeGenerateIDCard('${d.id}')" title="ID Card">
                                <i class="fas fa-id-card"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }
    
    // Tampilkan kartu
    allKinCard.style.display = 'block';
    allKinCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function verifyKINAndShow(input) {
    const result = verifyKIN(input);
    displayVerifyResult(result);
    
    // Update input field
    document.getElementById('verifyInput').value = input;
}

function resetVerifyForm() {
    document.getElementById('verifyInput').value = '';
    document.getElementById('verifyInput').focus();
    document.getElementById('verifyResultCard').style.display = 'none';
    document.getElementById('allKinCard').style.display = 'none';
    
    // Reset breadcrumb ke pertama
    setVerifyExample('kin');
}

// --- FUNGSI GENERATE PDF TABEL DATA ---
function generateTabelPdf() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }
    
    // Ambil data sesuai dengan halaman dan jumlah baris per halaman
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMPADAN-TANGKAP-TABEL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd",
            colorLight: "#ffffff", 
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
    }

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            if (typeof jsPDF.API.autoTable !== 'function') {
                showNotification('Library PDF tidak lengkap. Silakan refresh halaman.', 'error');
                return;
            }

            const doc = new jsPDF('l', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Header
            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            // Judul utama
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('LAPORAN TABEL DATA NELAYAN', pageWidth/2, 48, { align: 'center' });
            
            // Informasi filter yang aktif
            let filterInfo = "Semua Data";
            if (Object.keys(currentFilter).length > 0 || document.getElementById('searchData').value) {
                filterInfo = "Data Terfilter: ";
                const filterParts = [];
                
                if (currentFilter.desa) filterParts.push(`Desa: ${currentFilter.desa}`);
                if (currentFilter.profesi) filterParts.push(`Profesi: ${currentFilter.profesi}`);
                if (currentFilter.status) filterParts.push(`Status: ${currentFilter.status}`);
                if (currentFilter.jenisKapal) filterParts.push(`Jenis Kapal: ${currentFilter.jenisKapal}`);
                if (currentFilter.alatTangkap) filterParts.push(`Alat Tangkap: ${currentFilter.alatTangkap}`);
                if (currentFilter.usaha) filterParts.push(`Usaha: ${currentFilter.usaha === 'Ada' ? 'Ada Usaha Sampingan' : 'Tidak Ada Usaha'}`);
                if (document.getElementById('searchData').value) filterParts.push(`Pencarian: "${document.getElementById('searchData').value}"`);
                
                filterInfo += filterParts.join(', ');
            }
            
            // Tambahkan informasi halaman dan jumlah baris
            filterInfo += ` | Halaman: ${currentPage}, Jumlah Baris: ${appSettings.itemsPerPage}`;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(filterInfo, pageWidth/2, 54, { align: 'center' });
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('TABEL DATA NELAYAN', pageWidth/2, 60, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, 66, { align: 'center' });

            // Siapkan data untuk tabel dengan kolom baru
            const tableRows = pageData.map((d, index) => [
                index + 1,
                d.nama,
                d.whatsapp === '00000000' || !d.whatsapp ? '-' : maskData(d.whatsapp),
                maskData(d.nik),
                d.alamat || '-',
                d.desa,
                d.kecamatan,
                d.status === 'Pemilik Kapal' ? (d.namaKapal || '-') : '-',
                d.kodeValidasi || '-'
            ]);

            // Tabel Data
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 15}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 45}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Alamat', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 50}},
                    {content: 'Desa', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kecamatan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Nama Perahu', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kode Validasi', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}}
                ]],
                body: tableRows,
                startY: 72,
                theme: 'grid',
                tableWidth: tableWidth,
                margin: { left: tableStartX, right: tableStartX },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 8,
                    cellPadding: 3,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    fillColor: [255, 255, 255],
                    cellPadding: 3,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 3,
                    fontSize: 8,
                    valign: 'middle',
                    halign: 'left'
                },
                columnStyles: {
                    0: {cellWidth: 15, halign: 'center'},
                    1: {cellWidth: 45, halign: 'left'},
                    2: {cellWidth: 30, halign: 'center'},
                    3: {cellWidth: 35, halign: 'center'},
                    4: {cellWidth: 50, halign: 'left'},
                    5: {cellWidth: 35, halign: 'left'},
                    6: {cellWidth: 35, halign: 'left'},
                    7: {cellWidth: 35, halign: 'left'},
                    8: {cellWidth: 30, halign: 'center'}
                }
            });

            // Setelah autoTable, kita atur footer
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

            // GARIS PEMISAH ANTARA TABEL DAN BAGIAN VALIDASI
            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

            // Bagian kiri: Validasi elektronik
            const leftX = 25;
            const leftY = separatorY + 12;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(12, 36, 97);
            doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX, leftY);
            doc.text("SECARA ELEKTRONIK OLEH", leftX, leftY + 4);
            doc.text("SISTEM SATU DATA NELAYAN (SIMPADAN TANGKAP)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simpadan", leftX, leftY + 18);

            // Bagian kanan: Tanda tangan dan QR Code
            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            // PERIODE/TANGGAL
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            // JABATAN
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            // QR Code dengan warna biru muda
            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    // QR code 25x25 mm
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            // GARIS TANDA TANGAN
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            // NAMA DAN NIP PEJABAT
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            // FOOTER DENGAN INFORMASI SISTEM
            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Informasi sistem di footer
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Data: ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} records | Baris/halaman: ${appSettings.itemsPerPage}`, pageWidth / 2, footerY + 5, { align: 'center' });

            // Simpan file PDF
            const fileName = `Tabel_Nelayan_${appSettings.appSubtitle.replace(/\s+/g, '_').slice(0,15)}_Halaman${currentPage}_${Date.now()}.pdf`;
            doc.save(fileName);
            document.getElementById('qr-right').innerHTML = "";
            
            showNotification(`Tabel PDF berhasil dibuat (${pageData.length} data dari halaman ${currentPage})`, 'success');
            
        } catch (error) {
            console.error("Error generating table PDF:", error);
            showNotification('Gagal membuat PDF tabel. Silakan coba lagi atau periksa konsol browser.', 'error');
        }
    }, 800);
}

// --- FUNGSI GENERATE PDF UNTUK DATA TERFILTER ---
function generateFilteredPdf() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }
    
    // Ambil data sesuai dengan halaman dan jumlah baris per halaman
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filteredData.slice(start, end);

    // Siapkan data untuk tabel dengan kolom baru
    const tableRows = pageData.map((d, index) => [
        index + 1, 
        d.nama,
        d.whatsapp === '00000000' || !d.whatsapp ? '-' : maskData(d.whatsapp),
        maskData(d.nik),
        d.alamat || '-',
        d.desa,
        d.kecamatan,
        d.status === 'Pemilik Kapal' ? (d.namaKapal || '-') : '-',
        d.kodeValidasi || '-'
    ]);

    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMPADAN-TANGKAP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd",
            colorLight: "#ffffff", 
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
    }

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            if (typeof jsPDF.API.autoTable !== 'function') {
                showNotification('Library PDF tidak lengkap. Silakan refresh halaman.', 'error');
                return;
            }

            const doc = new jsPDF('l', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Header
            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            // Judul utama
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('LAPORAN DATA NELAYAN TERFILTER', pageWidth/2, 48, { align: 'center' });
            
            // Informasi filter yang aktif
            let filterInfo = "Semua Data";
            if (Object.keys(currentFilter).length > 0 || document.getElementById('searchData').value) {
                filterInfo = "Data Terfilter: ";
                const filterParts = [];
                
                if (currentFilter.desa) filterParts.push(`Desa: ${currentFilter.desa}`);
                if (currentFilter.profesi) filterParts.push(`Profesi: ${currentFilter.profesi}`);
                if (currentFilter.status) filterParts.push(`Status: ${currentFilter.status}`);
                if (currentFilter.jenisKapal) filterParts.push(`Jenis Kapal: ${currentFilter.jenisKapal}`);
                if (currentFilter.alatTangkap) filterParts.push(`Alat Tangkap: ${currentFilter.alatTangkap}`);
                if (currentFilter.usaha) filterParts.push(`Usaha: ${currentFilter.usaha === 'Ada' ? 'Ada Usaha Sampingan' : 'Tidak Ada Usaha'}`);
                if (document.getElementById('searchData').value) filterParts.push(`Pencarian: "${document.getElementById('searchData').value}"`);
                
                filterInfo += filterParts.join(', ');
            }
            
            // Tambahkan informasi halaman dan jumlah baris
            filterInfo += ` | Halaman: ${currentPage}, Jumlah Baris: ${appSettings.itemsPerPage}`;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(filterInfo, pageWidth/2, 54, { align: 'center' });
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('TABEL DATA NELAYAN', pageWidth/2, 60, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, 66, { align: 'center' });

            // Tabel Data
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 15}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 45}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Alamat', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 50}},
                    {content: 'Desa', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kecamatan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Nama Perahu', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kode Validasi', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}}
                ]],
                body: tableRows,
                startY: 72,
                theme: 'grid',
                tableWidth: tableWidth,
                margin: { left: tableStartX, right: tableStartX },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 8,
                    cellPadding: 3,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    fillColor: [255, 255, 255],
                    cellPadding: 3,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 3,
                    fontSize: 8,
                    valign: 'middle',
                    halign: 'left'
                },
                columnStyles: {
                    0: {cellWidth: 15, halign: 'center'},
                    1: {cellWidth: 45, halign: 'left'},
                    2: {cellWidth: 30, halign: 'center'},
                    3: {cellWidth: 35, halign: 'center'},
                    4: {cellWidth: 50, halign: 'left'},
                    5: {cellWidth: 35, halign: 'left'},
                    6: {cellWidth: 35, halign: 'left'},
                    7: {cellWidth: 35, halign: 'left'},
                    8: {cellWidth: 30, halign: 'center'}
                }
            });

            // Setelah autoTable, kita atur footer
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

            // GARIS PEMISAH ANTARA TABEL DAN BAGIAN VALIDASI
            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

            // Bagian kiri: Validasi elektronik
            const leftX = 25;
            const leftY = separatorY + 12;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(12, 36, 97);
            doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX, leftY);
            doc.text("SECARA ELEKTRONIK OLEH", leftX, leftY + 4);
            doc.text("SISTEM SATU DATA NELAYAN (SIMPADAN TANGKAP)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simpadan", leftX, leftY + 18);

            // Bagian kanan: Tanda tangan dan QR Code
            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            // PERIODE/TANGGAL
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            // JABATAN
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            // QR Code dengan warna biru muda
            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    // QR code 25x25 mm
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            // GARIS TANDA TANGAN
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            // NAMA DAN NIP PEJABAT
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            // FOOTER DENGAN INFORMASI SISTEM
            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Informasi sistem di footer
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Data: ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} records | Baris/halaman: ${appSettings.itemsPerPage}`, pageWidth / 2, footerY + 5, { align: 'center' });

            // Simpan file PDF
            const fileName = `Laporan_Nelayan_Terfilter_${appSettings.appSubtitle.replace(/\s+/g, '_').slice(0,15)}_Halaman${currentPage}_${Date.now()}.pdf`;
            doc.save(fileName);
            document.getElementById('qr-right').innerHTML = "";
            
            showNotification(`Laporan PDF terfilter berhasil dibuat (${pageData.length} data dari halaman ${currentPage})`, 'success');
            
        } catch (error) {
            console.error("Error generating filtered PDF:", error);
            showNotification('Gagal membuat PDF. Silakan coba lagi atau periksa konsol browser.', 'error');
        }
    }, 800);
}

// --- FUNGSI PRINT DATA ---
function printData() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }

    // Hitung statistik per desa dari data terfilter
    const desaStats = {};
    filteredData.forEach(d => {
        const desa = d.desa || "Tidak Diketahui";
        if (!desaStats[desa]) {
            desaStats[desa] = { 
                count: 0, 
                owner: 0, 
                abk: 0, 
                penuhWaktu: 0, 
                sambilanUtama: 0, 
                sambilanTambahan: 0 
            };
        }
        desaStats[desa].count++;
        if(d.status === 'Pemilik Kapal') desaStats[desa].owner++; 
        else desaStats[desa].abk++;
        
        if(d.profesi === 'Nelayan Penuh Waktu') desaStats[desa].penuhWaktu++;
        else if(d.profesi === 'Nelayan Sambilan Utama') desaStats[desa].sambilanUtama++;
        else if(d.profesi === 'Nelayan Sambilan Tambahan') desaStats[desa].sambilanTambahan++;
    });

    // Siapkan data untuk tabel dengan kolom baru
    const tableRows = Object.keys(desaStats).sort().map((desa, index) => [
        index + 1, 
        desa,
        desaStats[desa].count, 
        desaStats[desa].owner,
        desaStats[desa].abk, 
        desaStats[desa].penuhWaktu, 
        desaStats[desa].sambilanUtama,
        desaStats[desa].sambilanTambahan
    ]);

    // Hitung total dari data terfilter
    const totalCount = tableRows.reduce((sum, row) => sum + row[2], 0);
    const totalOwner = tableRows.reduce((sum, row) => sum + row[3], 0);
    const totalAbk = tableRows.reduce((sum, row) => sum + row[4], 0);
    const totalPenuhWaktu = tableRows.reduce((sum, row) => sum + row[5], 0);
    const totalSambilanUtama = tableRows.reduce((sum, row) => sum + row[6], 0);
    const totalSambilanTambahan = tableRows.reduce((sum, row) => sum + row[7], 0);

    // Tambahkan baris total
    tableRows.push([
        "",
        "TOTAL KESELURUHAN",
        totalCount,
        totalOwner,
        totalAbk,
        totalPenuhWaktu,
        totalSambilanUtama,
        totalSambilanTambahan
    ]);

    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMPADAN-TANGKAP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd",
            colorLight: "#ffffff", 
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
    }

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            if (typeof jsPDF.API.autoTable !== 'function') {
                showNotification('Library PDF tidak lengkap. Silakan refresh halaman.', 'error');
                return;
            }

            const doc = new jsPDF('l', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Header
            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            // Judul utama
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('LAPORAN REKAPITULASI DATA NELAYAN', pageWidth/2, 48, { align: 'center' });
            
            // Informasi filter yang aktif
            let filterInfo = "Semua Data";
            if (Object.keys(currentFilter).length > 0 || document.getElementById('searchData').value) {
                filterInfo = "Data Terfilter: ";
                const filterParts = [];
                
                if (currentFilter.desa) filterParts.push(`Desa: ${currentFilter.desa}`);
                if (currentFilter.profesi) filterParts.push(`Profesi: ${currentFilter.profesi}`);
                if (currentFilter.status) filterParts.push(`Status: ${currentFilter.status}`);
                if (currentFilter.jenisKapal) filterParts.push(`Jenis Kapal: ${currentFilter.jenisKapal}`);
                if (currentFilter.alatTangkap) filterParts.push(`Alat Tangkap: ${currentFilter.alatTangkap}`);
                if (currentFilter.usaha) filterParts.push(`Usaha: ${currentFilter.usaha === 'Ada' ? 'Ada Usaha Sampingan' : 'Tidak Ada Usaha'}`);
                if (document.getElementById('searchData').value) filterParts.push(`Pencarian: "${document.getElementById('searchData').value}"`);
                
                filterInfo += filterParts.join(', ');
            }
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(filterInfo, pageWidth/2, 54, { align: 'center' });
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('REKAPITULASI PER DESA / KELURAHAN', pageWidth/2, 60, { align: 'center' });
    
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, 66, { align: 'center' });

            // Tabel Data dengan kolom baru
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 20}},
                    {content: 'Desa/Kelurahan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 50}},
                    {content: 'Total Nelayan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'Pemilik Kapal', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'ABK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 25}},
                    {content: 'Penuh Waktu', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'Sambilan Utama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'Sambilan Tambahan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}}
                ]],
                body: tableRows,
                startY: 72,
                theme: 'grid',
                tableWidth: tableWidth,
                margin: { left: tableStartX, right: tableStartX },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 9,
                    cellPadding: 4,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 9,
                    fillColor: [255, 255, 255],
                    cellPadding: 4,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 4,
                    fontSize: 9,
                    valign: 'middle',
                    halign: 'center'
                },
                columnStyles: {
                    0: {cellWidth: 20, halign: 'center'},
                    1: {cellWidth: 50, halign: 'left'},
                    2: {cellWidth: 30, halign: 'center'},
                    3: {cellWidth: 30, halign: 'center'},
                    4: {cellWidth: 25, halign: 'center'},
                    5: {cellWidth: 30, halign: 'center'},
                    6: {cellWidth: 30, halign: 'center'},
                    7: {cellWidth: 30, halign: 'center'}
                },
                willDrawCell: function(data) {
                    // Baris total dengan warna kuning
                    if (data.row.index === tableRows.length - 1) {
                        data.cell.styles.fillColor = [255, 235, 59];
                        data.cell.styles.textColor = [0, 0, 0];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.lineWidth = 0.5;
                        data.cell.styles.lineColor = [12, 36, 97];
                    }
                }
            });

            // Setelah autoTable, kita atur footer
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

            // GARIS PEMISAH ANTARA TABEL DAN BAGIAN VALIDASI
            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

            // Bagian kiri: Validasi elektronik
            const leftX = 25;
            const leftY = separatorY + 12;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(12, 36, 97);
            doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX, leftY);
            doc.text("SECARA ELEKTRONIK OLEH", leftX, leftY + 4);
            doc.text("SISTEM SATU DATA NELAYAN (SIMPADAN TANGKAP)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simpadan", leftX, leftY + 18);

            // Bagian kanan: Tanda tangan dan QR Code
            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            // PERIODE/TANGGAL
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            // JABATAN
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            // QR Code dengan warna biru muda
            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    // QR code 25x25 mm
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            // GARIS TANDA TANGAN
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            // NAMA DAN NIP PEJABAT
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            // FOOTER DENGAN INFORMASI SISTEM
            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Informasi sistem di footer
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Total Data Terfilter: ${filteredData.length} records`, pageWidth / 2, footerY + 5, { align: 'center' });

            // Simpan file PDF
            const fileName = `Laporan_Rekapitulasi_${appSettings.appSubtitle.replace(/\s+/g, '_').slice(0,15)}_${Date.now()}.pdf`;
            doc.save(fileName);
            document.getElementById('qr-right').innerHTML = "";
            
            showNotification(`Laporan PDF berhasil dibuat (${filteredData.length} data)`, 'success');
            
        } catch (error) {
            console.error("Error generating PDF:", error);
            showNotification('Gagal membuat PDF. Silakan coba lagi atau periksa konsol browser.', 'error');
        }
    }, 800);
}

function downloadSinglePdf(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;

    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `DOKUMEN SAH\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nRef: ${d.kodeValidasi || 'N/A'}`;
    new QRCode(document.getElementById("qr-right"), { 
        text: signatureText, width: 256, height: 256,
        colorDark: "#0984e3",
        colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M
    });

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        
        doc.setDrawColor(12, 36, 97);
        doc.setLineWidth(1);
        doc.rect(10, 10, 190, 277);

        doc.setFillColor(12, 36, 97);
        doc.rect(10, 10, 190, 40, 'F');
        
        // PERBAIKAN: Format teks judul agar tidak terpotong
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12); 
        doc.setFont('helvetica', 'bold');
        
        // Judul utama dibagi menjadi 2 baris
        const titleLines = doc.splitTextToSize('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', 180);
        let titleY = 18;
        
        // Tampilkan judul baris demi baris
        for (let i = 0; i < titleLines.length; i++) {
            doc.text(titleLines[i], 105, titleY + (i * 6), { align: 'center' });
        }
        
        // Hitung posisi Y setelah judul
        const titleEndY = titleY + (titleLines.length * 6);
        
        doc.setFontSize(14);
        doc.text('DINAS PERIKANAN', 105, titleEndY + 5, { align: 'center' });
        doc.setTextColor(246, 185, 59);
        doc.setFont('times', 'italic'); 
        doc.setFontSize(12);
        doc.text('"Situbondo Naik Kelas"', 105, titleEndY + 12, { align: 'center' });
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(appSettings.appSubtitle, 105, titleEndY + 18, { align: 'center' });
        
        doc.setTextColor(0, 0, 0); 
        doc.setFont('helvetica', 'bold'); 
        doc.setFontSize(14);
        doc.text('BIODATA NELAYAN TERDAFTAR', 105, titleEndY + 30, { align: 'center' });
        doc.setLineWidth(0.5); 
        doc.line(70, titleEndY + 33, 140, titleEndY + 33);

        let y = titleEndY + 40;
        const lineHeight = 7;
        
        const checkPage = (heightNeeded) => {
            if (y + heightNeeded > 250) { 
                doc.addPage();
                doc.setDrawColor(12, 36, 97); 
                doc.setLineWidth(1); 
                doc.rect(10, 10, 190, 277);
                y = 30; 
            }
        };

        // PERBAIKAN: Gunakan maskData untuk NIK dan WhatsApp di PDF
        const displayNik = maskData(d.nik);
        const displayWa = maskData(d.whatsapp);

        const printLine = (label, value) => {
            checkPage(lineHeight);
            doc.setFont('helvetica', 'normal'); 
            doc.text(label, 25, y);
            doc.setFont('helvetica', 'bold'); 
            
            if (label === 'Alamat' || label === 'Domisili' || value.length > 50) {
                const splitText = doc.splitTextToSize(': ' + value, 110);
                doc.text(splitText, 80, y);
                y += (splitText.length * 6);
            } else {
                doc.text(': ' + value, 80, y);
                y += lineHeight;
            }
        };

        checkPage(30);
        doc.setFontSize(11); 
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('I. IDENTITAS PRIBADI', 22, y); 
        y += 12;
        
        doc.setFontSize(10);
        printLine('Nama Lengkap', d.nama);
        printLine('NIK', displayNik); // Gunakan NIK yang sudah disensor
        printLine('Tempat / Tgl Lahir', `${d.tahunLahir} (Usia: ${d.usia} Thn)`);
        printLine('Alamat Lengkap', d.alamat || '-'); // TAMBAHAN: Alamat
        printLine('Domisili', `${d.desa}, ${d.kecamatan}`);
        printLine('No. Handphone', displayWa); // Gunakan WhatsApp yang sudah disensor
        y += 8;

        checkPage(30);
        doc.setFontSize(11); 
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('II. PROFESI & EKONOMI', 22, y); 
        y += 12;

        doc.setFontSize(10);
        printLine('Status Profesi', d.profesi);
        printLine('Posisi Kerja', d.status);
        printLine('Alat Penangkapan Ikan (API)', d.alatTangkap);
        printLine('Usaha Sampingan', d.usahaSampingan || '-');
        y += 8;

        checkPage(30);
        doc.setFontSize(11); 
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('III. JENIS IKAN TANGKAPAN UTAMA', 22, y); 
        y += 12;

        doc.setFontSize(10);
        const fishList = d.jenisIkan ? d.jenisIkan.split(', ') : [];
        fishList.forEach((fish, idx) => {
            printLine(`Ikan ${idx + 1}`, fish);
        });
        y += 8;

        if(d.status === 'Pemilik Kapal') {
            checkPage(30);
            doc.setFontSize(11); 
            doc.setFillColor(230, 230, 230);
            doc.rect(20, y-4, 170, 6, 'F');
            doc.text('IV. DATA ASET KAPAL', 22, y); 
            y += 12;

            doc.setFontSize(10);
            printLine('Nama Kapal', d.namaKapal);
            printLine('Jenis Kapal', d.jenisKapal);
        }

        if(y > 210) doc.addPage();

        const footerY = 230; 
        const sigCenterX = 150; 
        const leftX = 25;

        doc.setDrawColor(150);
        doc.setLineWidth(0.5);
        doc.rect(leftX, footerY, 70, 30);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX + 35, footerY + 6, {align: 'center'});
        doc.text("SECARA ELEKTRONIK OLEH", leftX + 35, footerY + 10, {align: 'center'});
        doc.text("SISTEM SATU DATA (SIMPADAN TANGKAP)", leftX + 35, footerY + 14, {align: 'center'});
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text("Dinas Perikanan Kabupaten Situbondo", leftX + 35, footerY + 20, {align: 'center'});
        doc.setTextColor(0, 0, 255);
        doc.text("www.dinasperikanansitubondo.com/simpadan", leftX + 35, footerY + 25, {align: 'center'});

        doc.setFontSize(10); 
        doc.setTextColor(0,0,0); 
        doc.setFont('helvetica', 'normal');
        const dateStr = new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
        doc.text(`Situbondo, ${dateStr}`, sigCenterX, footerY - 5, {align: 'center'});
        doc.text('Diketahui Oleh :', sigCenterX, footerY, {align: 'center'});
        doc.setFont('helvetica', 'bold');
        doc.text(appSettings.officialPosition, sigCenterX, footerY + 5, {align: 'center'});

        const qrRightCanvas = document.querySelector('#qr-right canvas');
        if(qrRightCanvas) {
            const imgRight = qrRightCanvas.toDataURL("image/png");
            doc.addImage(imgRight, 'PNG', sigCenterX - 12.5, footerY + 8, 25, 25); 
        }

        const nameY = footerY + 38; 
        doc.text(appSettings.officialName, sigCenterX, nameY, {align: 'center'});
        doc.setFont('helvetica', 'normal');
        doc.text(`NIP. ${appSettings.officialNip}`, sigCenterX, nameY + 5, {align: 'center'});

        doc.setFontSize(7); 
        doc.setTextColor(150);
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} | Ref ID: ${d.kodeValidasi || '-'}`, 105, 285, {align:'center'});

        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Dokumen ini saling berhubungan - Halaman ${i} dari ${totalPages}`, 105, 292, { align: 'center' });
        }

        doc.save(`${d.nama}_${d.nik}.pdf`);
        document.getElementById('qr-right').innerHTML = "";

    }, 500);
}

// --- FUNGSI ID CARD YANG DISEMPURNAKAN (REVISI PERBAIKAN) ---
function generateIDCard(id) {
    const data = appData.find(item => item.id == id);
    if (!data) {
        alert('Data tidak ditemukan!');
        return;
    }

    // Tampilkan loading
    const loadingEl = document.getElementById('idcardLoading');
    if (loadingEl) loadingEl.style.display = 'flex';

    // Buat PDF dengan ukuran ID Card (85.6mm x 54mm) - ukuran standar ID Card
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54]
    });

    // PERBAIKAN: Background warna abu-abu muda untuk halaman
    doc.setFillColor(240, 240, 240); // Abu-abu muda (#f0f0f0)
    doc.rect(0, 0, 85.6, 54, 'F');

    // Area putih untuk ID Card dengan bayangan
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    
    // Tambahkan efek bayangan
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(3.5, 3.5, 80.6, 49, 3, 3, 'F');
    
    // Area utama ID Card (putih)
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(12, 36, 97); // Biru tua untuk border
    doc.setLineWidth(0.5);
    doc.roundedRect(2.5, 2.5, 80.6, 49, 3, 3, 'FD'); // FD: Fill and Draw
    
    // Header ID Card dengan warna biru muda (#4a69bd)
    doc.setFillColor(74, 105, 189);  // Biru muda (#4a69bd)
    doc.roundedRect(2.5, 2.5, 80.6, 10, 3, 3, 'F');
    
    // Teks header dengan warna putih
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('DINAS PERIKANAN', 42.8, 6, { align: 'center' });
    doc.text('KABUPATEN SITUBONDO', 42.8, 8.5, { align: 'center' });

    // Garis pemisah dengan warna aksen oranye
    doc.setDrawColor(246, 185, 59);
    doc.setLineWidth(0.5);
    doc.line(5, 11, 80, 11);

    // PERBAIKAN: Judul ID Card diturunkan agar tidak tumpang tindih
    doc.setTextColor(12, 36, 97);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('KARTU IDENTITAS NELAYAN TERDAFTAR', 42.8, 15, { align: 'center' }); // Diturunkan dari 14 ke 15

    // Garis dekoratif tipis di bawah judul
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(15, 16, 70, 16); // Diturunkan dari 15 ke 16

    // Container untuk data pribadi (kiri) - posisi lebih ke bawah
    const leftX = 5;
    const dataY = 20; // Diturunkan dari 18 ke 20
    const lineHeight = 3.2;

    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    
    // Fungsi untuk menampilkan data dengan label yang lebih rapi
    const drawData = (label, value, y, isImportant = false) => {
        doc.text(label + ':', leftX, y);
        doc.setFont('helvetica', isImportant ? 'bold' : 'normal');
        
        // Potong teks jika terlalu panjang
        let displayValue = value;
        if (value && value.length > 25) {
            displayValue = value.substring(0, 25) + '...';
        }
        
        doc.text(displayValue, leftX + 18, y);
        doc.setFont('helvetica', 'normal');
    };

    // Data pribadi dengan warna yang berbeda untuk label dan nilai
    doc.setTextColor(100, 100, 100); // Abu-abu untuk label
    
    // Baris 1: Nama Lengkap
    drawData('Nama Lengkap', data.nama, dataY, true);
    
    // Baris 2: NIK (dengan mask data)
    const displayNik = maskData(data.nik);
    drawData('NIK', displayNik, dataY + lineHeight);
    
    // Baris 3: TTL / Usia
    drawData('TTL / Usia', `${data.tahunLahir} (${data.usia} Tahun)`, dataY + lineHeight * 2);
    
    // Baris 4: Alamat
    doc.text('Alamat:', leftX, dataY + lineHeight * 3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97); // Biru untuk nilai
    
    const alamatText = data.alamat || `${data.desa}, ${data.kecamatan}`;
    if (alamatText.length > 25) {
        // Split alamat menjadi dua baris
        const words = alamatText.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (const word of words) {
            if ((line1 + ' ' + word).length <= 25) {
                line1 += (line1 ? ' ' : '') + word;
            } else {
                line2 += (line2 ? ' ' : '') + word;
            }
        }
        
        doc.text(line1, leftX + 18, dataY + lineHeight * 3);
        if (line2) {
            doc.text(line2, leftX + 18, dataY + lineHeight * 3.7);
        }
    } else {
        doc.text(alamatText, leftX + 18, dataY + lineHeight * 3);
    }
    doc.setTextColor(100, 100, 100); // Kembali ke abu-abu untuk label berikutnya

    // REVISI: Baris 5: Domisili (menggantikan Profesi)
    doc.text('Domisili:', leftX, dataY + lineHeight * 4.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    doc.text(`${data.desa}, ${data.kecamatan}`, leftX + 18, dataY + lineHeight * 4.3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    // REVISI: Baris 6: Status Pekerjaan (menggantikan Alat Tangkap)
    doc.text('Status Pekerjaan:', leftX, dataY + lineHeight * 5.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    
    // Tentukan warna berdasarkan status
    if (data.status === 'Pemilik Kapal') {
        doc.setTextColor(41, 128, 185); // Biru untuk Pemilik Kapal
    } else {
        doc.setTextColor(39, 174, 96); // Hijau untuk Anak Buah Kapal
    }
    
    doc.text(data.status, leftX + 18, dataY + lineHeight * 5.3);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    // Baris 7: Kode Validasi dengan styling khusus
    const kodeY = dataY + lineHeight * 6.3;
    doc.text('Kode Validasi:', leftX, kodeY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    
    // Background untuk kode validasi
    doc.setFillColor(240, 245, 255);
    const textWidth = doc.getTextWidth(data.kodeValidasi || '-');
    doc.roundedRect(leftX + 18, kodeY - 1.5, textWidth + 2, 2.5, 1, 1, 'F');
    
    doc.text(data.kodeValidasi || '-', leftX + 19, kodeY);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');

    // QR Code (kanan) - ukuran lebih kecil dan profesional
    const qrSize = 16; // QR Code 16x16 mm (lebih kecil)
    const qrX = 85.6 - qrSize - 8; // Posisi X: kanan dengan margin 8mm
    const qrY = 20; // Posisi Y: sejajar dengan data (diturunkan dari 18 ke 20)

    // PERBAIKAN: Generate QR Code dengan informasi validasi dan link website
    const qrCodeData = `SIMPADAN TANGKAP - ${data.kodeValidasi || data.nik}\nNama: ${data.nama}\nNIK: ${data.nik}\nAlamat: ${data.alamat || data.desa}\nDesa: ${data.desa}\nStatus: ${data.status}\nValidasi: ${data.tanggalValidasi}\n\n=== INFORMASI VALIDASI ===\nData ini VALID dan terdaftar secara resmi\npada Sistem Satu Data Nelayan (SIMPADAN TANGKAP)\nDinas Perikanan Kabupaten Situbondo\n\nUntuk verifikasi keaslian ID Card ini,\nkunjungi:\nwww.dinasperikanansitubondo.com/simpadan`;
    
    // Buat container sementara untuk QR Code
    const qrContainer = document.createElement('div');
    qrContainer.id = 'temp-qr-container-idcard';
    qrContainer.style.width = qrSize + 'mm';
    qrContainer.style.height = qrSize + 'mm';
    qrContainer.style.position = 'absolute';
    qrContainer.style.left = '-1000px';
    qrContainer.style.top = '-1000px';
    document.body.appendChild(qrContainer);

    try {
        new QRCode(qrContainer, {
            text: qrCodeData,
            width: 160, // Resolusi lebih tinggi untuk kualitas baik
            height: 160,
            colorDark: "#0c2461", // Warna biru yang sesuai dengan tema
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        // Tunggu QR Code selesai dibuat
        setTimeout(() => {
            const qrCanvas = qrContainer.querySelector('canvas');
            if (qrCanvas) {
                const imgData = qrCanvas.toDataURL('image/png');
                
                // Border biru di sekitar QR Code
                doc.setDrawColor(12, 36, 97);
                doc.setLineWidth(0.3);
                doc.roundedRect(qrX - 0.5, qrY - 0.5, qrSize + 1, qrSize + 1, 1, 1);
                
                // Tambahkan QR Code ke PDF
                doc.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);
                
                // PERBAIKAN: Label di bawah QR Code diperbarui
                doc.setFontSize(4);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(100, 100, 100);
                doc.text('Pindai untuk verifikasi keaslian', qrX + qrSize/2, qrY + qrSize + 2, { align: 'center' });
            }

            // Hapus elemen sementara
            document.body.removeChild(qrContainer);

            // PERBAIKAN: Garis pemisah horizontal antara data dan footer - DINAIIKAN ke atas
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.2);
            const separatorY = 44; // Dinaikkan dari 45 ke 44 (lebih ke atas)
            doc.line(5, separatorY, 80, separatorY);

            // PERBAIKAN: Footer dengan informasi validasi - DINAIIKAN ke atas
            const footerY = separatorY + 2; // Dinaikkan dari separatorY + 3 ke separatorY + 2
            doc.setFontSize(4);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(150, 150, 150);
            
            // Perbaikan: Teks footer diatur dengan wrap agar tidak keluar
            const footerText1 = 'Kartu ini diterbitkan secara elektronik oleh Sistem Satu Data Nelayan (SIMPADAN TANGKAP)';
            const footerText2 = `Validasi: ${data.tanggalValidasi} | ${data.validator}`;
            
            // Split teks jika terlalu panjang
            const splitFooter1 = doc.splitTextToSize(footerText1, 75);
            doc.text(splitFooter1, 42.8, footerY, { align: 'center' });
            
            // Hitung tinggi teks pertama untuk posisi teks kedua
            const textHeight1 = splitFooter1.length * 1.5;
            doc.text(footerText2, 42.8, footerY + textHeight1 + 1, { align: 'center' });

            // Simpan PDF
            const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || data.nik.substring(0, 8)}.pdf`;
            doc.save(fileName);

            // Sembunyikan loading
            if (loadingEl) loadingEl.style.display = 'none';
            
            showNotification(`ID Card untuk ${data.nama} berhasil dibuat`, 'success');
        }, 500);
    } catch (error) {
        console.error("Error generating QR code:", error);
        
        // Jika QR code error, buat placeholder yang lebih rapi
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(qrX, qrY, qrSize, qrSize, 1, 1, 'F');
        doc.setFontSize(4);
        doc.setTextColor(180, 180, 180);
        doc.text('QR Code', qrX + qrSize/2, qrY + qrSize/2 - 1, { align: 'center' });
        doc.text('tidak tersedia', qrX + qrSize/2, qrY + qrSize/2 + 1.5, { align: 'center' });

        // PERBAIKAN: Garis pemisah horizontal
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        const separatorY = 44; // Dinaikkan dari 45 ke 44
        doc.line(5, separatorY, 80, separatorY);

        // PERBAIKAN: Footer - DINAIIKAN ke atas
        const footerY = separatorY + 2;
        doc.setFontSize(4);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        
        // Perbaikan: Teks footer diatur dengan wrap agar tidak keluar
        const footerText1 = 'Kartu ini diterbitkan secara elektronik oleh Sistem Satu Data Nelayan (SIMPADAN TANGKAP)';
        const footerText2 = `Validasi: ${data.tanggalValidasi} | ${data.validator}`;
        
        // Split teks jika terlalu panjang
        const splitFooter1 = doc.splitTextToSize(footerText1, 75);
        doc.text(splitFooter1, 42.8, footerY, { align: 'center' });
        
        // Hitung tinggi teks pertama untuk posisi teks kedua
        const textHeight1 = splitFooter1.length * 1.5;
        doc.text(footerText2, 42.8, footerY + textHeight1 + 1, { align: 'center' });

        // Simpan PDF
        const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || data.nik.substring(0, 8)}.pdf`;
        doc.save(fileName);

        // Sembunyikan loading
        if (loadingEl) loadingEl.style.display = 'none';
        
        showNotification(`ID Card untuk ${data.nama} berhasil dibuat (tanpa QR Code)`, 'success');
        
        // Hapus elemen sementara
        if (document.body.contains(qrContainer)) {
            document.body.removeChild(qrContainer);
        }
    }
}

// --- EKSPOS FUNGSI KE WINDOW ---
window.backupData = backupData;
window.restoreData = restoreData;
window.mergeData = mergeData;
window.handleReloadRepo = handleReloadRepo;
window.verifyKIN = verifyKIN;
window.displayVerifyResult = displayVerifyResult;
window.setVerifyExample = setVerifyExample;
window.showAllKIN = showAllKIN;
window.verifyKINAndShow = verifyKINAndShow;
window.resetVerifyForm = resetVerifyForm;
window.generateTabelPdf = generateTabelPdf;
window.generateFilteredPdf = generateFilteredPdf;
window.printData = printData;
window.downloadSinglePdf = downloadSinglePdf;
window.generateIDCard = generateIDCard;

// Console log untuk debug
console.log('Functions.js loaded successfully');
