// dataglobal.js - MODUL PENGELOLAAN DATA GLOBAL

// Fungsi untuk sinkronisasi data dari server (reload.js)
function handleReloadRepo() {
    if (window.showLoading) {
        window.showLoading("Sinkronisasi Data", "Sedang melakukan sinkronisasi data dari server. Mohon tunggu, proses ini mungkin memerlukan waktu beberapa saat...");
    }
    
    // Tentukan file yang akan dimuat berdasarkan mode
    const fileName = window.currentWilayah && window.currentWilayah.mode === 'desa' ? 
        window.currentWilayah.fileName : 'reload.js';
    
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
                    if (window.appData) {
                        window.appData = window.SIMATA_BACKUP_DATA;
                    }
                    if (window.saveData) window.saveData();
                    if (window.renderDataTable) window.renderDataTable();
                    if (window.updateDashboard) window.updateDashboard();
                    if (window.updateFilterDesaOptions) window.updateFilterDesaOptions();
                    
                    if (window.hideLoading) window.hideLoading();
                    if (window.showNotification) {
                        window.showNotification(`Data berhasil disinkronisasi dari ${fileName} (${window.SIMATA_BACKUP_DATA.length} data)`, 'success');
                    }
                    
                } catch (error) {
                    console.error('Reload error:', error);
                    if (window.hideLoading) window.hideLoading();
                    if (window.showNotification) {
                        window.showNotification('Gagal memuat data. Format data tidak valid.', 'error');
                    }
                }
            } else {
                if (window.hideLoading) window.hideLoading();
                if (window.showNotification) {
                    window.showNotification(`Tidak ada data yang ditemukan di file ${fileName}`, 'warning');
                }
            }
        }, 500);
    };
    
    script.onerror = function() {
        console.error(`Gagal memuat file ${fileName}`);
        if (window.hideLoading) window.hideLoading();
        if (window.showNotification) {
            window.showNotification(`Maaf, Data Tidak Ditemukan Di SIMPADAN TANGKAP`, 'error');
        }
    };
    
    document.head.appendChild(script);
}

// Fungsi untuk merge data (digunakan di restore)
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

// Fungsi untuk membuat backup data
function backupData() {
    try {
        if (window.showLoading) {
            window.showLoading("Membuat Backup", "Sedang menyimpan data ke file backup. Mohon tunggu...");
        }
        
        setTimeout(() => {
            let dataToBackup = window.appData || [];
            let backupFileName = 'reload.js';
            let backupContent = '';
            
            // Tentukan nama file berdasarkan mode
            if (window.currentWilayah && window.currentWilayah.mode === 'desa' && window.currentWilayah.desaName) {
                backupFileName = window.currentWilayah.fileName;
                
                // Filter data hanya untuk desa yang dipilih
                dataToBackup = dataToBackup.filter(d => d.desa === window.currentWilayah.desaName);
                
                backupContent = `// DATA NELAYAN DESA ${window.currentWilayah.desaName.toUpperCase()}
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
            
            if (window.hideLoading) window.hideLoading();
            if (window.showNotification) {
                window.showNotification(`Backup berhasil: ${backupFileName} (${dataToBackup.length} data)`, 'success');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Backup error:', error);
        if (window.hideLoading) window.hideLoading();
        if (window.showNotification) {
            window.showNotification('Gagal membuat backup. Silakan coba lagi.', 'error');
        }
    }
}

// Fungsi untuk restore data
function restoreData() {
    const fileInput = document.getElementById('restoreFileInput');
    if (!fileInput.files.length) return;
    
    if (window.showLoading) {
        window.showLoading("Restore Data", "Sedang memproses restore data. Mohon tunggu, proses ini mungkin memerlukan waktu beberapa saat...");
    }
    
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
                if (window.hideLoading) window.hideLoading();
                if (window.showNotification) {
                    window.showNotification('File tidak berisi data', 'warning');
                }
                return;
            }
            
            // Merge data lama dengan data baru
            const existingData = window.appData || [];
            const mergedData = mergeData(existingData, restoredData);
            
            const newCount = restoredData.length;
            const existingCount = existingData.length;
            const mergedCount = mergedData.length;
            const replacedCount = existingCount + newCount - mergedCount;
            const addedCount = mergedCount - existingCount;
            
            window.appData = mergedData;
            if (window.saveData) window.saveData();
            if (window.renderDataTable) window.renderDataTable();
            if (window.updateDashboard) window.updateDashboard();
            if (window.updateFilterDesaOptions) window.updateFilterDesaOptions();
            
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
            
            if (window.hideLoading) window.hideLoading();
            if (window.showNotification) {
                window.showNotification(message, 'success');
            }
            fileInput.value = '';
            const restoreDataBtn = document.getElementById('restoreDataBtn');
            if (restoreDataBtn) restoreDataBtn.disabled = true;
            
        } catch (error) {
            console.error('Restore error:', error);
            if (window.hideLoading) window.hideLoading();
            if (window.showNotification) {
                window.showNotification(`Gagal restore: ${error.message}`, 'error');
            }
        }
    };
    
    reader.onerror = function() {
        if (window.hideLoading) window.hideLoading();
        if (window.showNotification) {
            window.showNotification('Gagal membaca file', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Inisialisasi event listener untuk fungsi Global
function initGlobalEventListeners() {
    // Event listener untuk tombol Reload Data
    const reloadRepoBtn = document.getElementById('btn-reload-repo');
    if (reloadRepoBtn) {
        reloadRepoBtn.addEventListener('click', handleReloadRepo);
    }
    
    // Tombol FAB Reload
    const fabReload = document.getElementById('fabReload');
    if (fabReload) {
        fabReload.addEventListener('click', (e) => {
            e.preventDefault(); 
            handleReloadRepo();
        });
    }
    
    // Tombol Backup Data
    const backupDataBtn = document.getElementById('backupDataBtn');
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
    }
    
    // Tombol Export Reload.js
    const exportReloadJsBtn = document.getElementById('exportReloadJsBtn');
    if (exportReloadJsBtn) {
        exportReloadJsBtn.addEventListener('click', backupData);
    }
    
    // Tombol Restore Data
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    if (restoreDataBtn) {
        restoreDataBtn.addEventListener('click', restoreData);
    }
    
    // Input file restore
    const restoreFileInput = document.getElementById('restoreFileInput');
    if (restoreFileInput) {
        restoreFileInput.addEventListener('change', function() {
            if (restoreDataBtn) {
                restoreDataBtn.disabled = !this.files.length;
            }
        });
    }
}

// Ekspos fungsi ke global scope
window.handleReloadRepo = handleReloadRepo;
window.mergeData = mergeData;
window.backupData = backupData;
window.restoreData = restoreData;
window.initGlobalEventListeners = initGlobalEventListeners;

// Inisialisasi saat dokumen siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initGlobalEventListeners();
    });
} else {
    initGlobalEventListeners();
}
