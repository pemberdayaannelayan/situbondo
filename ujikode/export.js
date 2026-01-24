// =====================================================
// FILE: export.js - FUNGSI EKSPOR DATA
// =====================================================

// Fungsi untuk ekspor data ke Excel
function exportData(type) {
    if(appData.length === 0) {
        showNotification('Tidak ada data', 'error');
        return;
    }
    
    const dataToExport = appData.map(d => ({
        ...d, nik: maskData(d.nik), whatsapp: maskData(d.whatsapp)
    }));
    const finalData = dataToExport.map(d => ({ ...d, NIK: `'${d.nik}`, WhatsApp: `'${d.whatsapp}` }));
    
    if(type === 'xlsx') {
        try {
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(finalData), "Data Nelayan");
            XLSX.writeFile(wb, `Nelayan_${appSettings.appSubtitle.replace(/\s+/g, '_').slice(0,15)}_${Date.now()}.xlsx`);
            showNotification('File Excel berhasil diunduh', 'success');
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            showNotification('Gagal membuat file Excel', 'error');
        }
    }
}

// Fungsi untuk kirim data via WhatsApp
function sendDataToWhatsapp() {
    // Buat backup data terlebih dahulu
    backupData('reload.js');
    
    // Tunggu sebentar agar file backup selesai
    setTimeout(() => {
        const phoneNumber = "6287865614222"; // Nomor WhatsApp admin
        const message = `Halo Admin Dinas Perikanan Situbondo,\n\nSaya ingin melaporkan sinkronisasi data SIMPADAN TANGKAP.\n\n*Detail Laporan:*\n- Aplikasi: SIMPADAN TANGKAP v5.9\n- Total Data: ${appData.length} nelayan\n- Tanggal: ${new Date().toLocaleDateString('id-ID')}\n- Mode: ${currentWilayah.mode === 'desa' ? 'Desa ' + currentWilayah.desaName : 'Global'}\n\nSaya telah melampirkan file reload.js sebagai bukti sinkronisasi data.\n\nSalam,\nOperator SIMPADAN TANGKAP`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        showNotification('Membuka WhatsApp untuk pengiriman laporan', 'info');
    }, 1000);
}

// Fungsi untuk ekspor file reload.js
function exportReloadJs() {
    backupData('reload.js');
}
