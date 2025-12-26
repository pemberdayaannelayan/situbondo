// reload.js
// File untuk backup dan restore data

// Variabel untuk data backup
let SIMATA_BACKUP_ENCRYPTED = null;

// Fungsi untuk backup data
function backupData(filename = 'reload.js') {
    const data = {
        appData: JSON.parse(localStorage.getItem('nelayanData') || '[]'),
        appSettings: JSON.parse(localStorage.getItem('nelayanSettings') || '{}'),
        timestamp: new Date().toISOString(),
        version: '5.3'
    };
    
    const encrypted = btoa(JSON.stringify(data));
    const content = `// SIMATA Backup File (Encrypted)
// Generated on ${new Date().toLocaleString()}

const SIMATA_BACKUP_ENCRYPTED = "${encrypted}";

// Jika Anda ingin restore data, gunakan fungsi restoreData() di aplikasi SIMATA.`;
    
    const blob = new Blob([content], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (typeof showNotification === 'function') {
        showNotification(`Backup data berhasil (${data.appData.length} records)`, 'success');
    }
}

// Fungsi untuk restore data
function restoreData() {
    const fileInput = document.getElementById('restoreFileInput');
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            // Cari variabel SIMATA_BACKUP_ENCRYPTED
            const match = content.match(/const SIMATA_BACKUP_ENCRYPTED = "([^"]+)"/);
            if (!match) {
                throw new Error('Format file backup tidak valid');
            }
            
            const encrypted = match[1];
            const decrypted = JSON.parse(atob(encrypted));
            
            if (!decrypted.appData || !Array.isArray(decrypted.appData)) {
                throw new Error('Data backup tidak valid');
            }
            
            // Merge data
            const existingData = JSON.parse(localStorage.getItem('nelayanData') || '[]');
            const existingIds = existingData.map(d => d.id);
            
            let newCount = 0;
            decrypted.appData.forEach(item => {
                if (!existingIds.includes(item.id)) {
                    existingData.push(item);
                    newCount++;
                }
            });
            
            localStorage.setItem('nelayanData', JSON.stringify(existingData));
            
            if (decrypted.appSettings) {
                const existingSettings = JSON.parse(localStorage.getItem('nelayanSettings') || '{}');
                const mergedSettings = { ...existingSettings, ...decrypted.appSettings };
                localStorage.setItem('nelayanSettings', JSON.stringify(mergedSettings));
            }
            
            // Reload aplikasi
            location.reload();
            
        } catch (error) {
            console.error('Restore error:', error);
            if (typeof showNotification === 'function') {
                showNotification(`Gagal restore: ${error.message}`, 'error');
            }
        }
    };
    
    reader.readAsText(file);
}

// Fungsi untuk handle reload dari repository
function handleReloadRepo() {
    if (typeof SIMATA_BACKUP_ENCRYPTED !== 'undefined' && SIMATA_BACKUP_ENCRYPTED) {
        try {
            const decrypted = JSON.parse(atob(SIMATA_BACKUP_ENCRYPTED));
            
            if (!decrypted.appData || !Array.isArray(decrypted.appData)) {
                throw new Error('Data backup tidak valid');
            }
            
            // Merge data
            const existingData = JSON.parse(localStorage.getItem('nelayanData') || '[]');
            const existingIds = existingData.map(d => d.id);
            
            let newCount = 0;
            decrypted.appData.forEach(item => {
                if (!existingIds.includes(item.id)) {
                    existingData.push(item);
                    newCount++;
                }
            });
            
            localStorage.setItem('nelayanData', JSON.stringify(existingData));
            
            if (decrypted.appSettings) {
                const existingSettings = JSON.parse(localStorage.getItem('nelayanSettings') || '{}');
                const mergedSettings = { ...existingSettings, ...decrypted.appSettings };
                localStorage.setItem('nelayanSettings', JSON.stringify(mergedSettings));
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`Berhasil sinkronisasi: ${newCount} data baru ditambahkan`, 'success');
            }
            
            // Refresh aplikasi
            setTimeout(() => location.reload(), 1500);
            
        } catch (error) {
            console.error('Reload error:', error);
            if (typeof showNotification === 'function') {
                showNotification(`Gagal sinkronisasi: ${error.message}`, 'error');
            }
        }
    } else {
        if (typeof showNotification === 'function') {
            showNotification('Tidak ada data sinkronisasi tersedia', 'info');
        }
    }
}

// Ekspor fungsi ke global scope
window.SIMATA_BACKUP_ENCRYPTED = SIMATA_BACKUP_ENCRYPTED;
window.backupData = backupData;
window.restoreData = restoreData;
window.handleReloadRepo = handleReloadRepo;
