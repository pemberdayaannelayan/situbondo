// =====================================================
// EKSPOR DATA (Excel, Backup, Restore, dll)
// =====================================================

// --- FUNGSI BACKUP DATA YANG DIPERBAIKI ---
function backupData(filename = 'reload.js') {
    try {
        const encryptedData = btoa(JSON.stringify(appData));
        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID');
        const timeStr = now.toLocaleTimeString('id-ID');
        
        const backupContent = `/* PETUNJUK PENGGUNAAN RELOAD REPO:
    1. Ini adalah file backup otomatis dari Aplikasi.
    2. Jangan ubah kode di dalam tanda petik dua ("...") di bawah.
    3. Upload file ini ke hosting tempat aplikasi berjalan untuk fitur Reload Data.
    
    APP NAME : SISTEM PEMETAAN DATA NELAYAN
    INSTANSI : DINAS PERIKANAN KABUPATEN SITUBONDO
    TANGGAL  : ${dateStr}, ${timeStr}
*/

window.SIMATA_BACKUP_ENCRYPTED = '${encryptedData}';`;
        
        const blob = new Blob([backupContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(`Backup berhasil: ${filename}`, 'success');
    } catch (error) {
        console.error('Backup error:', error);
        showNotification('Gagal membuat backup. Silakan coba lagi.', 'error');
    }
}

// --- FUNGSI MERGE DATA UNTUK MENGHINDARI DUPLIKASI ---
function mergeData(existingData, newData) {
    // Buat map untuk data yang sudah ada dengan NIK sebagai key
    const dataMap = new Map();
    
    // Tambahkan data yang sudah ada ke map
    existingData.forEach(item => {
        dataMap.set(item.nik, item);
    });
    
    // Tambahkan atau timpa data baru (data baru akan menimpa data lama dengan NIK yang sama)
    newData.forEach(item => {
        dataMap.set(item.nik, item);
    });
    
    // Kembalikan sebagai array
    return Array.from(dataMap.values());
}

// --- FUNGSI RELOAD DATA YANG DIPERBAIKI ---
function handleReloadRepo() {
    const reloadBtn = document.getElementById('btn-reload-repo');
    const spinner = document.getElementById('reloadSpinner');
    
    // Tampilkan spinner dan nonaktifkan tombol
    spinner.classList.add('active');
    reloadBtn.disabled = true;
    reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Memuat Data... <span class="spinner-border spinner-border-sm reload-spinner active" id="reloadSpinner"></span>';
    
    showNotification('Memulai sinkronisasi data dari server...', 'info');
    
    // Coba load ulang file reload.js
    const script = document.createElement('script');
    script.src = 'reload.js?t=' + new Date().getTime(); // Tambahkan timestamp untuk cache busting
    script.onload = function() {
        console.log('File reload.js berhasil dimuat ulang');
        
        // Beri waktu untuk pemrosesan
        setTimeout(() => {
            if (typeof window.SIMATA_BACKUP_ENCRYPTED !== 'undefined' && window.SIMATA_BACKUP_ENCRYPTED) {
                try {
                    const restoredData = JSON.parse(atob(window.SIMATA_BACKUP_ENCRYPTED));
                    
                    // Merge data lama dengan data baru (data baru menimpa data lama dengan NIK yang sama)
                    const existingData = appData;
                    const mergedData = mergeData(existingData, restoredData);
                    
                    // Hitung perubahan
                    const newCount = restoredData.length;
                    const existingCount = existingData.length;
                    const mergedCount = mergedData.length;
                    const replacedCount = existingCount + newCount - mergedCount;
                    const addedCount = mergedCount - existingCount;
                    
                    // Update data aplikasi
                    appData = mergedData;
                    saveData();
                    renderDataTable();
                    updateDashboard();
                    
                    // Tampilkan notifikasi yang informatif
                    let message = '';
                    if (replacedCount > 0 && addedCount > 0) {
                        message = `Data berhasil disinkronisasi: ${replacedCount} data diperbarui, ${addedCount} data baru ditambahkan`;
                    } else if (replacedCount > 0) {
                        message = `Data berhasil disinkronisasi: ${replacedCount} data diperbarui`;
                    } else if (addedCount > 0) {
                        message = `Data berhasil disinkronisasi: ${addedCount} data baru ditambahkan`;
                    } else {
                        message = 'Data sudah up-to-date. Tidak ada perubahan.';
                    }
                    
                    showNotification(message, 'success');
                    
                } catch (error) {
                    console.error('Reload error:', error);
                    showNotification('Gagal memuat data dari repository. Format data tidak valid.', 'error');
                }
            } else {
                showNotification('Tidak ada data repository yang tersedia untuk dimuat', 'warning');
            }
            
            // Reset tombol
            spinner.classList.remove('active');
            reloadBtn.disabled = false;
            reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Reload Data <span class="spinner-border spinner-border-sm reload-spinner" id="reloadSpinner"></span>';
        }, 500);
    };
    
    script.onerror = function() {
        console.error('Gagal memuat file reload.js');
        showNotification('Gagal memuat data dari server. Pastikan koneksi internet aktif.', 'error');
        
        // Reset tombol
        spinner.classList.remove('active');
        reloadBtn.disabled = false;
        reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Reload Data <span class="spinner-border spinner-border-sm reload-spinner" id="reloadSpinner"></span>';
    };
    
    document.head.appendChild(script);
}

// --- FUNGSI RESTORE DATA YANG DIPERBAIKI ---
function restoreData() {
    const fileInput = document.getElementById('restoreFileInput');
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            // Coba ekstrak data dari file JS
            let encryptedData = '';
            if (content.includes('SIMATA_BACKUP_ENCRYPTED')) {
                const match = content.match(/window\.SIMATA_BACKUP_ENCRYPTED\s*=\s*'([^']+)'/);
                if (match) encryptedData = match[1];
            } else if (content.startsWith('window.SIMATA_BACKUP_ENCRYPTED')) {
                const match = content.match(/='([^']+)'/);
                if (match) encryptedData = match[1];
            } else {
                // Coba parse sebagai JSON langsung
                try {
                    const restoredData = JSON.parse(content);
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
                    
                    showNotification(message, 'success');
                    fileInput.value = '';
                    document.getElementById('restoreDataBtn').disabled = true;
                    return;
                } catch (jsonError) {
                    throw new Error('Format file tidak dikenali');
                }
            }
            
            if (!encryptedData) throw new Error('Data terenkripsi tidak ditemukan');
            
            const restoredData = JSON.parse(atob(encryptedData));
            
            // Merge data lama dengan data baru
            const existingData = appData;
            const mergedData = mergeData(existingData, restoredData);
            
            const newCount = restoredData.length;
            const existingCount = existingData.length;
            const mergedCount = mergedData.length;
            const replacedCount = existingCount + newCount - mergedCount;
            const addedCount = mergedCount - existingCount;
            
            if (newCount === 0) {
                showNotification('Tidak ada data baru untuk di-restore', 'warning');
                return;
            }
            
            appData = mergedData;
            saveData();
            renderDataTable();
            updateDashboard();
            
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
            
            showNotification(message, 'success');
            fileInput.value = '';
            document.getElementById('restoreDataBtn').disabled = true;
            
        } catch (error) {
            console.error('Restore error:', error);
            showNotification(`Gagal restore: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        showNotification('Gagal membaca file', 'error');
    };
    
    reader.readAsText(file);
}

// --- FUNGSI EKSPOR DATA KE EXCEL ---
function exportData(type) {
    if(appData.length === 0) return showNotification('Tidak ada data', 'error');
    const dataToExport = appData.map(d => ({
        ...d, nik: maskData(d.nik), whatsapp: maskData(d.whatsapp)
    }));
    const finalData = dataToExport.map(d => ({ ...d, NIK: `'${d.nik}`, WhatsApp: `'${d.whatsapp}` }));
    if(type === 'xlsx') {
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(finalData), "Data Nelayan");
        XLSX.writeFile(wb, `Nelayan_${appSettings.appSubtitle.slice(0,10)}_${Date.now()}.xlsx`);
        showNotification('Ekspor Excel berhasil.', 'success');
    }
}

// --- FUNGSI KIRIM DATA VIA WHATSAPP ---
function sendDataToWhatsapp() {
    const message = `Yth. Administrator Dinas Perikanan Kabupaten Situbondo,\n\nBerikut kami lampirkan data pembaruan Sistem Satu Data Nelayan dari:\n*${appSettings.appSubtitle}*\n\nTanggal Laporan: ${new Date().toLocaleDateString('id-ID')}\nTotal Data: ${appData.length} Records\n\nFile lampiran (reload.js) telah kami sertakan pada pesan ini untuk proses sinkronisasi data.\n\nTerima Kasih.`;
    const url = `https://wa.me/6287865614222?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Inisialisasi event listeners untuk ekspor
function initEkspor() {
    // Export Excel
    document.getElementById('exportExcelBtn').addEventListener('click', () => exportData('xlsx'));
    
    // Export Reload JS
    document.getElementById('exportReloadJsBtn').addEventListener('click', () => backupData('reload.js'));
    
    // Send WhatsApp
    document.getElementById('sendWaBtn').addEventListener('click', sendDataToWhatsapp);
    
    // Backup Data
    document.getElementById('backupDataBtn').addEventListener('click', () => backupData());
    
    // Restore Data
    document.getElementById('restoreFileInput').addEventListener('change', function() {
        document.getElementById('restoreDataBtn').disabled = !this.files.length;
    });
    document.getElementById('restoreDataBtn').addEventListener('click', restoreData);
    
    // Event listener untuk tombol Reload Data
    document.getElementById('btn-reload-repo').addEventListener('click', handleReloadRepo);
}

// Ekspos fungsi ke window
window.backupData = backupData;
window.restoreData = restoreData;
window.handleReloadRepo = handleReloadRepo;
window.mergeData = mergeData;
window.exportData = exportData;
window.sendDataToWhatsapp = sendDataToWhatsapp;

console.log('✅ Modul Ekspor berhasil dimuat');
