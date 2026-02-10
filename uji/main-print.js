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
                    const match = content.match(/window\.SIMATA_BACKUP_DATA\s*=\s*(\[.*?
