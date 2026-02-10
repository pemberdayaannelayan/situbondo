// =====================================================
// KODE CETAK & EKSPOR APLIKASI SIMPADAN TANGKAP - VERSI 6.1 FINAL REVISI
// BAGIAN: PRINT & EXPORT FUNCTIONALITY
// REVISI: PEMISAHAN KODE KE FILE TERPISAH
// =====================================================

// --- FUNGSI BACKUP DATA YANG DISEMPURNAKAN (DENGAN LOADING EFFECT) ---
function backupData() {
    try {
        showLoading("Membuat Backup", "Sedang menyimpan data ke file backup. Mohon tunggu...");
        
        setTimeout(() => {
            let dataToBackup = appData;
            let backupFileName = 'reload.js';
            let backupContent = '';
            
            // Tentukan nama file berdasarkan mode
            if (currentWilayah.mode === 'desa' && currentWilayah.desaName) {
                backupFileName = currentWilayah.fileName;
                
                // Filter data hanya untuk desa yang dipilih
                dataToBackup = appData.filter(d => d.desa === currentWilayah.desaName);
                
                backupContent = `// DATA NELAYAN DESA ${currentWilayah.desaName.toUpperCase()}
// File: ${backupFileName}
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            } else if (currentWilayah.mode === 'kecamatan' && currentWilayah.kecamatanName) {
                backupFileName = currentWilayah.fileName;
                
                // Filter data hanya untuk kecamatan yang dipilih
                dataToBackup = appData.filter(d => d.kecamatan === currentWilayah.kecamatanName);
                
                backupContent = `// DATA NELAYAN KECAMATAN ${currentWilayah.kecamatanName.toUpperCase()}
// File: ${backupFileName}
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            } else {
                backupContent = `// DATA NELAYAN GLOBAL - SISTEM PEMETAAN NELAYAN
// File: reload.js
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
    if (!fileInput.files.length) {
        showNotification('Pilih file backup terlebih dahulu!', 'error');
        return;
    }
    
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
                    // Ekstrak data dari window.SIMATA_BACKUP_DATA menggunakan regex yang lebih aman
                    const regex = /window\.SIMATA_BACKUP_DATA\s*=\s*(\[.*?\])\s*;/s;
                    const match = content.match(regex);
                    
                    if (match && match[1]) {
                        try {
                            restoredData = JSON.parse(match[1]);
                        } catch (parseError) {
                            console.error('Error parsing backup data:', parseError);
                            throw new Error('Format data backup tidak valid');
                        }
                    } else {
                        throw new Error('Data backup tidak ditemukan dalam file');
                    }
                } else {
                    throw new Error('File bukan backup valid dari SIMPADAN TANGKAP');
                }
            }
            
            // Validasi data yang direstore
            if (!Array.isArray(restoredData)) {
                throw new Error('Data backup harus berupa array');
            }
            
            // Validasi minimal satu data
            if (restoredData.length === 0) {
                throw new Error('File backup tidak mengandung data');
            }
            
            // Validasi struktur data
            const requiredFields = ['nama', 'nik', 'profesi', 'kecamatan', 'desa'];
            const firstItem = restoredData[0];
            const missingFields = requiredFields.filter(field => !firstItem.hasOwnProperty(field));
            
            if (missingFields.length > 0) {
                throw new Error(`Data tidak lengkap. Field yang diperlukan: ${missingFields.join(', ')}`);
            }
            
            // Konfirmasi sebelum restore
            setTimeout(() => {
                hideLoading();
                
                const modalHTML = `
                <div class="modal fade" id="confirmRestoreModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-warning">
                                <h5 class="modal-title"><i class="fas fa-exclamation-triangle me-2"></i>Konfirmasi Restore Data</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-warning">
                                    <i class="fas fa-exclamation-circle me-2"></i>
                                    <strong>PERINGATAN:</strong> Data saat ini akan digantikan dengan data dari backup.
                                </div>
                                <div class="restore-info">
                                    <h6>Informasi Backup:</h6>
                                    <ul class="list-group">
                                        <li class="list-group-item d-flex justify-content-between">
                                            <span>Jumlah Data:</span>
                                            <strong>${restoredData.length} data</strong>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between">
                                            <span>File:</span>
                                            <code>${file.name}</code>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between">
                                            <span>Ukuran:</span>
                                            <span>${(file.size / 1024).toFixed(2)} KB</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="form-check mt-3">
                                    <input class="form-check-input" type="checkbox" id="confirmMergeData">
                                    <label class="form-check-label" for="confirmMergeData">
                                        Gabungkan dengan data yang ada (jika ada data dengan NIK yang sama, data backup akan diabaikan)
                                    </label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                                <button type="button" class="btn btn-warning" id="confirmRestoreBtn">Restore Data</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                
                // Tambahkan modal ke body jika belum ada
                let modalElement = document.getElementById('confirmRestoreModal');
                if (!modalElement) {
                    const modalDiv = document.createElement('div');
                    modalDiv.innerHTML = modalHTML;
                    document.body.appendChild(modalDiv);
                    modalElement = document.getElementById('confirmRestoreModal');
                }
                
                const restoreModal = new bootstrap.Modal(modalElement);
                restoreModal.show();
                
                // Setup event listener untuk tombol konfirmasi
                document.getElementById('confirmRestoreBtn').onclick = function() {
                    const mergeData = document.getElementById('confirmMergeData').checked;
                    executeRestore(restoredData, mergeData, file.name);
                    restoreModal.hide();
                };
                
            }, 500);
            
        } catch (error) {
            console.error('Restore error:', error);
            hideLoading();
            showNotification(`Gagal restore data: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        hideLoading();
        showNotification('Gagal membaca file. Pastikan file tidak rusak.', 'error');
    };
    
    reader.readAsText(file);
}

// Fungsi untuk menjalankan restore setelah konfirmasi
function executeRestore(restoredData, mergeData, fileName) {
    showLoading("Memproses Restore", "Sedang memproses data backup. Mohon tunggu...");
    
    setTimeout(() => {
        try {
            let finalData = [];
            let skippedData = [];
            let addedData = [];
            
            if (mergeData) {
                // Mode merge: gabungkan dengan data yang ada
                const existingData = [...appData];
                const existingMap = new Map();
                
                // Buat map dari data yang ada berdasarkan NIK
                existingData.forEach(item => {
                    existingMap.set(item.nik, item);
                });
                
                // Proses data baru
                restoredData.forEach(item => {
                    if (existingMap.has(item.nik)) {
                        skippedData.push({
                            nik: item.nik,
                            nama: item.nama,
                            reason: 'Data dengan NIK yang sama sudah ada'
                        });
                    } else {
                        addedData.push(item);
                        existingMap.set(item.nik, item);
                    }
                });
                
                // Konversi kembali ke array
                finalData = Array.from(existingMap.values());
                
            } else {
                // Mode replace: ganti semua data
                finalData = restoredData;
                addedData = restoredData;
            }
            
            // Update data aplikasi
            appData = finalData;
            saveData();
            
            // Update UI
            renderDataTable();
            updateDashboard();
            updateFilterDesaOptions();
            
            hideLoading();
            
            // Tampilkan laporan restore
            const reportHTML = `
                <div class="restore-report">
                    <h5><i class="fas fa-check-circle text-success me-2"></i>Restore Berhasil</h5>
                    <div class="alert alert-success">
                        <strong>File:</strong> ${fileName}<br>
                        <strong>Total Data di Sistem:</strong> ${appData.length} data<br>
                        <strong>Data Baru Ditambahkan:</strong> ${addedData.length} data
                        ${skippedData.length > 0 ? `<br><strong>Data Dilewati:</strong> ${skippedData.length} data (NIK duplikat)` : ''}
                    </div>
                    
                    ${skippedData.length > 0 ? `
                    <div class="skipped-data mt-3">
                        <h6>Data yang Dilewati (NIK Duplikat):</h6>
                        <div class="table-responsive">
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NIK</th>
                                        <th>Nama</th>
                                        <th>Alasan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${skippedData.slice(0, 10).map((item, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${maskData(item.nik)}</td>
                                            <td>${item.nama}</td>
                                            <td><span class="badge bg-warning">${item.reason}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ${skippedData.length > 10 ? `<p class="text-muted small">Dan ${skippedData.length - 10} data lainnya...</p>` : ''}
                    </div>
                    ` : ''}
                </div>
            `;
            
            // Tampilkan modal laporan
            const reportModal = document.getElementById('restoreReportModal');
            const reportBody = document.getElementById('restoreReportBody');
            
            if (reportBody) {
                reportBody.innerHTML = reportHTML;
                new bootstrap.Modal(reportModal).show();
            } else {
                showNotification(`Restore berhasil! ${addedData.length} data ditambahkan.`, 'success');
            }
            
            // Reset file input
            const fileInput = document.getElementById('restoreFileInput');
            if (fileInput) fileInput.value = '';
            
        } catch (error) {
            console.error('Execute restore error:', error);
            hideLoading();
            showNotification('Gagal memproses data restore', 'error');
        }
    }, 1000);
}

// --- FUNGSI PRINT DATA KE PDF ---
function printData() {
    if (appData.length === 0) {
        showNotification('Tidak ada data untuk dicetak', 'warning');
        return;
    }
    
    showLoading("Membuat PDF", "Sedang menyiapkan dokumen PDF. Mohon tunggu...");
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const margin = 15;
            const contentWidth = pageWidth - 2 * margin;
            
            // Header
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(appSettings.appName, pageWidth / 2, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(appSettings.appSubtitle, pageWidth / 2, 28, { align: 'center' });
            
            // Informasi cetak
            doc.setFontSize(10);
            doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, margin, 40);
            doc.text(`Jumlah Data: ${appData.length} nelayan`, pageWidth - margin, 40, { align: 'right' });
            
            // Garis pemisah
            doc.setLineWidth(0.5);
            doc.line(margin, 45, pageWidth - margin, 45);
            
            let yPos = 55;
            let page = 1;
            
            // Data table header
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            const headers = ['No', 'Nama', 'NIK', 'Desa', 'Kecamatan', 'Profesi', 'Status'];
            const colWidths = [10, 40, 30, 30, 30, 30, 20];
            
            // Draw header
            let xPos = margin;
            headers.forEach((header, i) => {
                doc.text(header, xPos + (colWidths[i] / 2), yPos, { align: 'center' });
                xPos += colWidths[i];
            });
            
            yPos += 10;
            
            // Draw data rows
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            
            appData.forEach((item, index) => {
                // Cek jika perlu halaman baru
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                    page++;
                    
                    // Header halaman baru
                    doc.setFontSize(10);
                    doc.text(`Halaman ${page}`, pageWidth / 2, 15, { align: 'center' });
                    yPos += 10;
                }
                
                xPos = margin;
                const rowData = [
                    (index + 1).toString(),
                    item.nama.substring(0, 20) + (item.nama.length > 20 ? '...' : ''),
                    maskData(item.nik),
                    item.desa.substring(0, 15) + (item.desa.length > 15 ? '...' : ''),
                    item.kecamatan.substring(0, 15) + (item.kecamatan.length > 15 ? '...' : ''),
                    item.profesi.substring(0, 15),
                    item.status
                ];
                
                rowData.forEach((data, i) => {
                    doc.text(data, xPos + 2, yPos, { align: 'left' });
                    xPos += colWidths[i];
                });
                
                yPos += 7;
            });
            
            // Footer
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
                doc.text(`© ${new Date().getFullYear()} SIMPADAN TANGKAP - Dinas Perikanan Kabupaten Situbondo`, pageWidth / 2, 295, { align: 'center' });
            }
            
            // Simpan PDF
            doc.save(`Data_Nelayan_${appSettings.appSubtitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
            
            hideLoading();
            showNotification('PDF berhasil dibuat dan didownload', 'success');
            
        } catch (error) {
            console.error('Print error:', error);
            hideLoading();
            showNotification('Gagal membuat PDF. Pastikan library jsPDF tersedia.', 'error');
        }
    }, 1500);
}

// --- FUNGSI GENERATE PDF TERFILTER ---
function generateFilteredPdf() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk filter yang dipilih', 'warning');
        return;
    }
    
    showLoading("Membuat PDF Terfilter", "Sedang menyiapkan dokumen PDF dengan data terfilter. Mohon tunggu...");
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const margin = 15;
            
            // Header
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text('LAPORAN DATA NELAYAN TERFILTER', pageWidth / 2, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(appSettings.appSubtitle, pageWidth / 2, 28, { align: 'center' });
            
            // Informasi filter
            doc.setFontSize(10);
            let filterInfo = 'Filter Aktif: ';
            const filterConditions = [];
            
            if (currentFilter.desa) filterConditions.push(`Desa: ${currentFilter.desa}`);
            if (currentFilter.profesi) filterConditions.push(`Profesi: ${currentFilter.profesi}`);
            if (currentFilter.status) filterConditions.push(`Status: ${currentFilter.status}`);
            if (currentFilter.jenisKapal) filterConditions.push(`Jenis Kapal: ${currentFilter.jenisKapal}`);
            if (currentFilter.alatTangkap) filterConditions.push(`Alat Tangkap: ${currentFilter.alatTangkap}`);
            if (currentFilter.usaha) filterConditions.push(`Usaha Sampingan: ${currentFilter.usaha}`);
            
            if (filterConditions.length > 0) {
                filterInfo += filterConditions.join(', ');
            } else {
                filterInfo += 'Semua Data';
            }
            
            doc.text(filterInfo, margin, 40, { maxWidth: pageWidth - 2 * margin });
            
            // Informasi cetak
            doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, margin, 50);
            doc.text(`Jumlah Data: ${filteredData.length} dari ${appData.length} total data`, margin, 56);
            
            // Garis pemisah
            doc.setLineWidth(0.5);
            doc.line(margin, 60, pageWidth - margin, 60);
            
            let yPos = 70;
            let page = 1;
            
            // Data table
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            
            const headers = ['No', 'Nama', 'NIK', 'Desa', 'Kecamatan', 'Profesi', 'Status'];
            const colWidths = [10, 40, 30, 25, 25, 25, 25];
            
            // Draw header
            let xPos = margin;
            headers.forEach((header, i) => {
                doc.text(header, xPos + (colWidths[i] / 2), yPos, { align: 'center' });
                xPos += colWidths[i];
            });
            
            yPos += 8;
            
            // Draw data rows
            doc.setFont("helvetica", "normal");
            
            filteredData.forEach((item, index) => {
                // Cek jika perlu halaman baru
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                    page++;
                    
                    // Header halaman baru
                    doc.setFontSize(10);
                    doc.text(`Halaman ${page} - Lanjutan Data Terfilter`, pageWidth / 2, 15, { align: 'center' });
                    yPos += 10;
                }
                
                xPos = margin;
                const rowData = [
                    (index + 1).toString(),
                    item.nama.substring(0, 18),
                    maskData(item.nik),
                    item.desa.substring(0, 12),
                    item.kecamatan.substring(0, 12),
                    item.profesi.substring(0, 12),
                    item.status.substring(0, 12)
                ];
                
                rowData.forEach((data, i) => {
                    doc.text(data, xPos + 2, yPos, { align: 'left' });
                    xPos += colWidths[i];
                });
                
                yPos += 7;
            });
            
            // Summary
            yPos += 5;
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text('RINGKASAN DATA TERFILTER:', margin, yPos);
            
            yPos += 7;
            doc.setFont("helvetica", "normal");
            
            // Hitung statistik
            const stats = {
                pemilik: filteredData.filter(d => d.status === 'Pemilik Kapal').length,
                abk: filteredData.filter(d => d.status === 'Anak Buah Kapal').length,
                penuhWaktu: filteredData.filter(d => d.profesi === 'Nelayan Penuh Waktu').length,
                sambilanUtama: filteredData.filter(d => d.profesi === 'Nelayan Sambilan Utama').length,
                sambilanTambahan: filteredData.filter(d => d.profesi === 'Nelayan Sambilan Tambahan').length
            };
            
            const statsText = [
                `• Pemilik Kapal: ${stats.pemilik} data`,
                `• Anak Buah Kapal: ${stats.abk} data`,
                `• Nelayan Penuh Waktu: ${stats.penuhWaktu} data`,
                `• Nelayan Sambilan Utama: ${stats.sambilanUtama} data`,
                `• Nelayan Sambilan Tambahan: ${stats.sambilanTambahan} data`
            ];
            
            statsText.forEach(text => {
                doc.text(text, margin + 5, yPos);
                yPos += 5;
            });
            
            // Footer
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Dicetak dari SIMPADAN TANGKAP - Halaman ${i}/${totalPages}`, pageWidth / 2, 290, { align: 'center' });
            }
            
            // Simpan PDF
            doc.save(`Data_Nelayan_Terfilter_${Date.now()}.pdf`);
            
            hideLoading();
            showNotification('PDF terfilter berhasil dibuat', 'success');
            
        } catch (error) {
            console.error('Generate filtered PDF error:', error);
            hideLoading();
            showNotification('Gagal membuat PDF terfilter', 'error');
        }
    }, 1500);
}

// --- FUNGSI GENERATE PDF TABEL DATA ---
function generateTabelPdf() {
    if (appData.length === 0) {
        showNotification('Tidak ada data untuk diekspor', 'warning');
        return;
    }
    
    showLoading("Membuat Tabel PDF", "Sedang menyiapkan tabel data dalam format PDF. Mohon tunggu...");
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 10;
            const contentWidth = pageWidth - 2 * margin;
            
            // Header
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text('TABEL DATA NELAYAN LENGKAP', pageWidth / 2, 15, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(appSettings.appSubtitle, pageWidth / 2, 22, { align: 'center' });
            
            // Informasi
            doc.setFontSize(8);
            doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, margin, 30);
            doc.text(`Total Data: ${appData.length}`, pageWidth - margin, 30, { align: 'right' });
            
            // Table header
            const headers = [
                'No', 'Nama', 'NIK', 'WhatsApp', 'Alamat', 'Desa', 'Kecamatan',
                'Profesi', 'Status', 'Alat Tangkap', 'Jenis Ikan'
            ];
            
            const colWidths = [
                8, 30, 25, 22, 40, 25, 25,
                25, 20, 25, 40
            ];
            
            let yPos = 40;
            let xPos = margin;
            
            // Draw table header
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            headers.forEach((header, i) => {
                doc.text(header, xPos + (colWidths[i] / 2), yPos, { align: 'center' });
                xPos += colWidths[i];
            });
            
            yPos += 6;
            
            // Draw horizontal line
            doc.setLineWidth(0.2);
            doc.line(margin, yPos - 3, pageWidth - margin, yPos - 3);
            
            // Draw data rows
            doc.setFont("helvetica", "normal");
            
            appData.forEach((item, index) => {
                // Cek jika perlu halaman baru
                if (yPos > pageHeight - 20) {
                    doc.addPage('landscape');
                    yPos = 20;
                    
                    // Header halaman baru
                    doc.setFontSize(10);
                    doc.text(`Lanjutan Tabel Data Nelayan - Halaman ${doc.internal.getNumberOfPages()}`, pageWidth / 2, 15, { align: 'center' });
                    yPos += 10;
                    
                    // Draw header again
                    doc.setFontSize(8);
                    doc.setFont("helvetica", "bold");
                    xPos = margin;
                    headers.forEach((header, i) => {
                        doc.text(header, xPos + (colWidths[i] / 2), yPos, { align: 'center' });
                        xPos += colWidths[i];
                    });
                    yPos += 6;
                    doc.line(margin, yPos - 3, pageWidth - margin, yPos - 3);
                    doc.setFont("helvetica", "normal");
                }
                
                xPos = margin;
                const rowData = [
                    (index + 1).toString(),
                    item.nama.substring(0, 18),
                    maskData(item.nik),
                    maskData(item.whatsapp),
                    (item.alamat || '').substring(0, 25),
                    item.desa.substring(0, 15),
                    item.kecamatan.substring(0, 15),
                    item.profesi.substring(0, 15),
                    item.status.substring(0, 12),
                    item.alatTangkap.substring(0, 15),
                    item.jenisIkan.substring(0, 25)
                ];
                
                rowData.forEach((data, i) => {
                    // Draw cell background for even rows
                    if (index % 2 === 0) {
                        doc.setFillColor(245, 245, 245);
                        doc.rect(xPos, yPos - 4, colWidths[i], 6, 'F');
                    }
                    
                    doc.text(data, xPos + 2, yPos, { align: 'left' });
                    xPos += colWidths[i];
                });
                
                yPos += 6;
            });
            
            // Footer
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(7);
                doc.text(`SIMPADAN TANGKAP v6.1 - Halaman ${i} dari ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
            }
            
            // Simpan PDF
            doc.save(`Tabel_Data_Nelayan_Lengkap_${Date.now()}.pdf`);
            
            hideLoading();
            showNotification('Tabel PDF berhasil dibuat', 'success');
            
        } catch (error) {
            console.error('Generate tabel PDF error:', error);
            hideLoading();
            showNotification('Gagal membuat tabel PDF', 'error');
        }
    }, 2000);
}

// --- FUNGSI DOWNLOAD SINGLE PDF (DETAIL) ---
function downloadSinglePdf(id) {
    const data = appData.find(item => item.id == id);
    if (!data) {
        showNotification('Data tidak ditemukan', 'error');
        return;
    }
    
    showLoading("Membuat ID Card", "Sedang menyiapkan ID Card dalam format PDF. Mohon tunggu...");
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            
            // Background design
            doc.setFillColor(240, 248, 255);
            doc.rect(0, 0, pageWidth, 297, 'F');
            
            // Header dengan gradasi
            doc.setFillColor(12, 36, 97); // Warna biru gelap
            doc.rect(0, 0, pageWidth, 40, 'F');
            
            // Logo/icon
            doc.setFontSize(24);
            doc.setTextColor(255, 255, 255);
            doc.text('🎣', 20, 25);
            
            // Judul
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text('KARTU IDENTITAS NELAYAN', pageWidth / 2, 25, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(appSettings.appSubtitle, pageWidth / 2, 32, { align: 'center' });
            
            // Card container
            const cardWidth = 160;
            const cardHeight = 90;
            const cardX = (pageWidth - cardWidth) / 2;
            const cardY = 60;
            
            // Card background
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'FD');
            
            // Card shadow
            doc.setFillColor(240, 240, 240);
            doc.roundedRect(cardX + 2, cardY + 2, cardWidth, cardHeight, 3, 3, 'F');
            
            // Card content
            const contentX = cardX + 15;
            let contentY = cardY + 20;
            
            // Header card
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(12, 36, 97);
            doc.text('INFORMASI NELAYAN', contentX, contentY);
            
            contentY += 15;
            
            // Data kiri
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(50, 50, 50);
            
            const leftData = [
                ['Nama Lengkap', data.nama],
                ['NIK', maskData(data.nik)],
                ['Alamat', data.alamat || '-'],
                ['Domisili', `${data.desa}, ${data.kecamatan}`]
            ];
            
            leftData.forEach(([label, value]) => {
                doc.text(`${label}:`, contentX, contentY);
                doc.setFont("helvetica", "normal");
                doc.text(value, contentX + 40, contentY);
                doc.setFont("helvetica", "bold");
                contentY += 7;
            });
            
            // Data kanan
            contentY = cardY + 35;
            const rightX = contentX + 90;
            
            const rightData = [
                ['Profesi', data.profesi],
                ['Status', data.status],
                ['Alat Tangkap', data.alatTangkap],
                ['Jenis Ikan', data.jenisIkan.substring(0, 30) + (data.jenisIkan.length > 30 ? '...' : '')]
            ];
            
            rightData.forEach(([label, value]) => {
                doc.text(`${label}:`, rightX, contentY);
                doc.setFont("helvetica", "normal");
                doc.text(value, rightX + 30, contentY);
                doc.setFont("helvetica", "bold");
                contentY += 7;
            });
            
            // Kode Validasi
            contentY = cardY + 75;
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "normal");
            doc.text(`Kode Validasi (KIN): ${data.kodeValidasi || 'Tidak Ada'}`, contentX, contentY);
            
            // QR Code area (placeholder)
            const qrX = cardX + cardWidth - 50;
            const qrY = cardY + 20;
            doc.setFillColor(245, 245, 245);
            doc.rect(qrX, qrY, 40, 40, 'F');
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('[QR Code]', qrX + 20, qrY + 20, { align: 'center' });
            
            // Footer card
            contentY = cardY + cardHeight + 20;
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`ID: ${data.id} | Validasi: ${data.tanggalValidasi} oleh ${data.validator}`, pageWidth / 2, contentY, { align: 'center' });
            
            // Informasi penting
            contentY += 10;
            doc.setFontSize(9);
            doc.setTextColor(12, 36, 97);
            doc.setFont("helvetica", "bold");
            doc.text('INFORMASI PENTING:', pageWidth / 2, contentY, { align: 'center' });
            
            contentY += 7;
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50, 50, 50);
            const infoLines = [
                '1. Kartu ini merupakan identitas resmi nelayan terdaftar',
                '2. Berlaku untuk keperluan administrasi dan bantuan pemerintah',
                '3. Harap disimpan dengan baik dan diperlihatkan saat diperlukan',
                `4. Masa berlaku: Sesuai ketentuan Dinas Perikanan Kab. Situbondo`
            ];
            
            infoLines.forEach(line => {
                doc.text(line, 20, contentY);
                contentY += 5;
            });
            
            // Tanda tangan
            contentY += 10;
            const signatureX = pageWidth - 60;
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text('Mengetahui,', signatureX, contentY);
            
            contentY += 20;
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(appSettings.officialName || 'SUGENG PURWO PRIYANTO, S.E, M.M', signatureX, contentY, { align: 'center' });
            
            contentY += 5;
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(appSettings.officialPosition || 'Kepala Bidang Pemberdayaan Nelayan', signatureX, contentY, { align: 'center' });
            
            // Footer halaman
            contentY += 15;
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text(`Dicetak dari SIMPADAN TANGKAP v6.1 pada ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, 290, { align: 'center' });
            
            // Simpan PDF
            doc.save(`ID_Card_${data.nama.replace(/\s+/g, '_')}_${data.nik.substring(12)}.pdf`);
            
            hideLoading();
            showNotification('ID Card PDF berhasil dibuat', 'success');
            
        } catch (error) {
            console.error('Download single PDF error:', error);
            hideLoading();
            showNotification('Gagal membuat ID Card PDF', 'error');
        }
    }, 1500);
}

// --- FUNGSI SAFE GENERATE ID CARD ---
function safeGenerateIDCard(id) {
    if (!id) {
        showNotification('ID data tidak valid', 'error');
        return;
    }
    
    // Cek apakah data ada
    const data = appData.find(item => item.id == id);
    if (!data) {
        showNotification('Data tidak ditemukan', 'error');
        return;
    }
    
    // Tampilkan konfirmasi
    const modalHTML = `
    <div class="modal fade" id="idCardConfirmModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"><i class="fas fa-id-card me-2"></i>Buat ID Card</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3">
                        <i class="fas fa-id-card fa-3x text-primary mb-3"></i>
                        <h5>${data.nama}</h5>
                        <p class="text-muted">${data.desa}, ${data.kecamatan}</p>
                    </div>
                    
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Anda akan membuat ID Card untuk nelayan di atas dalam format PDF.
                    </div>
                    
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="includePrivacy" checked>
                        <label class="form-check-label" for="includePrivacy">
                            Sembunyikan data sensitif (NIK, WhatsApp) sesuai mode privasi
                        </label>
                    </div>
                    
                    <div class="form-check mt-2">
                        <input class="form-check-input" type="checkbox" id="includeQR" checked>
                        <label class="form-check-label" for="includeQR">
                            Sertakan area QR Code (placeholder)
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary" id="confirmGenerateIDCard">Buat ID Card</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Tambahkan modal ke body jika belum ada
    let modalElement = document.getElementById('idCardConfirmModal');
    if (!modalElement) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        modalElement = document.getElementById('idCardConfirmModal');
    }
    
    const idCardModal = new bootstrap.Modal(modalElement);
    idCardModal.show();
    
    // Setup event listener untuk tombol konfirmasi
    document.getElementById('confirmGenerateIDCard').onclick = function() {
        idCardModal.hide();
        downloadSinglePdf(id);
    };
}

// --- FUNGSI EKSPOR KE EXCEL LANGSUNG ---
function exportDataToExcel() {
    if (appData.length === 0) {
        showNotification('Tidak ada data untuk diekspor', 'warning');
        return;
    }
    
    showLoading("Mengekspor ke Excel", "Sedang menyiapkan file Excel. Mohon tunggu...");
    
    setTimeout(() => {
        try {
            // Persiapan data
            const dataToExport = appData.map((d, index) => ({
                'No': index + 1,
                'Nama Lengkap': d.nama,
                'NIK': maskData(d.nik),
                'WhatsApp': maskData(d.whatsapp),
                'Alamat': d.alamat || '',
                'Desa': d.desa,
                'Kecamatan': d.kecamatan,
                'Profesi': d.profesi,
                'Status': d.status,
                'Alat Tangkap': d.alatTangkap,
                'Jenis Kapal': d.jenisKapal || '-',
                'Nama Kapal': d.namaKapal || '-',
                'Jenis Ikan': d.jenisIkan,
                'Usaha Sampingan': d.usahaSampingan || '-',
                'Tanggal Validasi': d.tanggalValidasi,
                'Validator': d.validator,
                'Kode Validasi (KIN)': d.kodeValidasi || '',
                'Keterangan': d.keterangan || '',
                'Drive Link': d.driveLink || ''
            }));
            
            // Buat worksheet
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            
            // Atur lebar kolom
            const wscols = [
                {wch: 5},   // No
                {wch: 25},  // Nama
                {wch: 20},  // NIK
                {wch: 15},  // WhatsApp
                {wch: 40},  // Alamat
                {wch: 20},  // Desa
                {wch: 20},  // Kecamatan
                {wch: 20},  // Profesi
                {wch: 15},  // Status
                {wch: 20},  // Alat Tangkap
                {wch: 20},  // Jenis Kapal
                {wch: 20},  // Nama Kapal
                {wch: 40},  // Jenis Ikan
                {wch: 25},  // Usaha Sampingan
                {wch: 15},  // Tanggal Validasi
                {wch: 20},  // Validator
                {wch: 20},  // Kode Validasi
                {wch: 30},  // Keterangan
                {wch: 40}   // Drive Link
            ];
            ws['!cols'] = wscols;
            
            // Buat workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data Nelayan');
            
            // Tambahkan sheet metadata
            const metadata = [
                ['Aplikasi', appSettings.appName],
                ['Instansi', appSettings.appSubtitle],
                ['Tanggal Ekspor', new Date().toLocaleString('id-ID')],
                ['Jumlah Data', appData.length],
                ['Mode Privasi', appSettings.privacyMode ? 'Aktif' : 'Non-Aktif'],
                ['', ''],
                ['Keterangan:', 'Data NIK dan WhatsApp disembunyikan sesuai pengaturan privasi']
            ];
            
            const ws2 = XLSX.utils.aoa_to_sheet(metadata);
            XLSX.utils.book_append_sheet(wb, ws2, 'Metadata');
            
            // Generate nama file
            const fileName = `Data_Nelayan_${appSettings.appSubtitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.xlsx`;
            
            // Simpan file
            XLSX.writeFile(wb, fileName);
            
            hideLoading();
            showNotification(`File Excel berhasil diunduh: ${fileName}`, 'success');
            
        } catch (error) {
            console.error('Export to Excel error:', error);
            hideLoading();
            showNotification('Gagal mengekspor ke Excel. Pastikan library SheetJS tersedia.', 'error');
        }
    }, 1500);
}

// --- FUNGSI UNTUK MEMBUAT REPORT MODAL ---
function showRestoreReportModal() {
    const modalHTML = `
    <div class="modal fade" id="restoreReportModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title"><i class="fas fa-file-alt me-2"></i>Laporan Restore Data</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="restoreReportBody">
                    <!-- Content akan diisi oleh fungsi restore -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    <button type="button" class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-sync-alt me-1"></i> Refresh Halaman
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    let modalElement = document.getElementById('restoreReportModal');
    if (!modalElement) {
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
    }
}

// --- INISIALISASI FUNGSI PRINT & EXPORT ---
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi modal laporan restore
    showRestoreReportModal();
    
    // Setup event listeners untuk tombol print dan export
    const printPdfBtn = document.getElementById('printPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const unduhFilteredPdfBtn = document.getElementById('btnUnduhFilteredPdf');
    const unduhTabelPdfBtn = document.getElementById('btnUnduhTabelPdf');
    const backupDataBtn = document.getElementById('backupDataBtn');
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    const restoreFileInput = document.getElementById('restoreFileInput');
    
    if (printPdfBtn) {
        printPdfBtn.addEventListener('click', printData);
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportDataToExcel);
    }
    
    if (unduhFilteredPdfBtn) {
        unduhFilteredPdfBtn.addEventListener('click', generateFilteredPdf);
    }
    
    if (unduhTabelPdfBtn) {
        unduhTabelPdfBtn.addEventListener('click', generateTabelPdf);
    }
    
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
    }
    
    if (restoreDataBtn) {
        restoreDataBtn.addEventListener('click', restoreData);
    }
    
    if (restoreFileInput) {
        restoreFileInput.addEventListener('change', function() {
            if (restoreDataBtn) {
                restoreDataBtn.disabled = !this.files.length;
            }
        });
    }
    
    // Setup drag and drop untuk restore file
    const restoreDropZone = document.getElementById('restoreDropZone');
    if (restoreDropZone) {
        restoreDropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('dropzone-active');
        });
        
        restoreDropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('dropzone-active');
        });
        
        restoreDropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('dropzone-active');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = document.getElementById('restoreFileInput');
                if (fileInput) {
                    // Clear existing files
                    fileInput.files = files;
                    
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                    
                    showNotification(`File ${files[0].name} siap untuk restore`, 'success');
                }
            }
        });
    }
});

// Ekspos fungsi ke window object
window.backupData = backupData;
window.restoreData = restoreData;
window.printData = printData;
window.generateFilteredPdf = generateFilteredPdf;
window.generateTabelPdf = generateTabelPdf;
window.downloadSinglePdf = downloadSinglePdf;
window.safeGenerateIDCard = safeGenerateIDCard;
window.exportDataToExcel = exportDataToExcel;
