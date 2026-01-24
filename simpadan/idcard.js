// =====================================================
// ID CARD GENERATOR - SIMPADAN TANGKAP
// Ukuran Real: 85.6mm x 54mm (Standar ID Card)
// =====================================================

// Ekspos fungsi ke global scope untuk akses dari index.html
window.generateIDCard = function(data) {
    if (!data) {
        console.error('Data tidak valid untuk generate ID Card');
        showNotification('Data tidak ditemukan untuk generate ID Card', 'error');
        return;
    }

    // Tampilkan loading
    document.getElementById('idcardLoading').style.display = 'flex';
    
    // Delay untuk memastikan loading terlihat
    setTimeout(() => {
        try {
            // Gunakan jsPDF dari window
            const { jsPDF } = window.jspdf;
            
            // Buat PDF dengan ukuran ID Card (85.6mm x 54mm)
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [85.6, 54]
            });
            
            const cardWidth = 85.6;
            const cardHeight = 54;
            
            // ========== BACKGROUND DAN BORDER ==========
            // Background biru gradien
            doc.setFillColor(12, 36, 97); // Warna biru tua
            doc.rect(0, 0, cardWidth, cardHeight, 'F');
            
            // Border putih
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.rect(2, 2, cardWidth - 4, cardHeight - 4);
            
            // ========== HEADER ==========
            // Logo/Icon kiri atas
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('DINAS PERIKANAN', 5, 8);
            doc.text('KAB. SITUBONDO', 5, 11);
            
            // Judul utama
            doc.setFontSize(10);
            doc.text('KARTU IDENTITAS NELAYAN', cardWidth / 2, 8, { align: 'center' });
            
            // Garis aksen kuning di bawah judul
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(0.5);
            doc.line(cardWidth / 2 - 20, 10, cardWidth / 2 + 20, 10);
            
            // Slogan
            doc.setFontSize(6);
            doc.setFont('helvetica', 'italic');
            doc.text('"Situbondo Naik Kelas"', cardWidth / 2, 13, { align: 'center' });
            
            // ========== BAGIAN KIRI - DATA PRIBADI ==========
            const leftX = 5;
            let y = 18;
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59); // Warna kuning untuk label
            
            // Nama
            doc.text('NAMA:', leftX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            // Potong nama jika terlalu panjang
            const nama = data.nama.length > 20 ? data.nama.substring(0, 20) + '...' : data.nama;
            doc.text(nama, leftX + 15, y);
            y += 5;
            
            // NIK
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text('NIK:', leftX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text(data.nik, leftX + 15, y);
            y += 5;
            
            // Domisili
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text('DOMISILI:', leftX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            // Gabungkan desa dan kecamatan
            const domisili = `${data.desa}, ${data.kecamatan}`;
            const domisiliShort = domisili.length > 25 ? domisili.substring(0, 25) + '...' : domisili;
            doc.text(domisiliShort, leftX + 20, y);
            y += 5;
            
            // Kontak
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text('KONTAK:', leftX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            const kontak = data.whatsapp === '00000000' ? '-' : data.whatsapp;
            doc.text(kontak, leftX + 18, y);
            y += 5;
            
            // ========== BAGIAN KANAN - DATA PROFESI ==========
            const rightX = cardWidth / 2 + 5;
            y = 18;
            
            // Profesi dengan badge
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text('PROFESI:', rightX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            // Potong profesi jika terlalu panjang
            const profesi = data.profesi.length > 25 ? data.profesi.substring(0, 25) + '...' : data.profesi;
            doc.text(profesi, rightX + 15, y);
            y += 5;
            
            // Status
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text('STATUS:', rightX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text(data.status, rightX + 15, y);
            y += 5;
            
            // Alat Tangkap
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text('ALAT TANGKAP:', rightX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            const alatTangkap = data.alatTangkap.length > 20 ? data.alatTangkap.substring(0, 20) + '...' : data.alatTangkap;
            doc.text(alatTangkap, rightX + 25, y);
            y += 5;
            
            // Jenis Ikan (ditampilkan singkat)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text('JENIS IKAN:', rightX, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            // Ambil ikan pertama saja untuk ID Card
            const ikanPertama = data.jenisIkan ? data.jenisIkan.split(',')[0] : '-';
            const ikanDisplay = ikanPertama.length > 20 ? ikanPertama.substring(0, 20) + '...' : ikanPertama;
            doc.text(ikanDisplay, rightX + 20, y);
            
            // ========== BAGIAN BAWAH - INFORMASI SISTEM ==========
            // Garis pemisah
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(0.3);
            doc.line(5, 38, cardWidth - 5, 38);
            
            // Kode Validasi (KIN)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(246, 185, 59);
            doc.text('KODE VALIDASI:', cardWidth / 2, 43, { align: 'center' });
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            const kodeValidasi = data.kodeValidasi || 'BELUM TERDAFTAR';
            doc.text(kodeValidasi, cardWidth / 2, 48, { align: 'center' });
            
            // Informasi kecil di footer
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5);
            doc.setTextColor(200, 200, 200);
            doc.text('ID Card ini sah dan terdaftar di Sistem SIMPADAN TANGKAP', cardWidth / 2, 52, { align: 'center' });
            
            // ========== QR CODE (jika ada kode validasi) ==========
            if (data.kodeValidasi && data.kodeValidasi !== 'BELUM TERDAFTAR') {
                // Siapkan elemen untuk QR Code
                const qrContainer = document.createElement('div');
                qrContainer.id = 'qr-idcard-temp';
                qrContainer.style.position = 'absolute';
                qrContainer.style.left = '-9999px';
                document.body.appendChild(qrContainer);
                
                // Generate QR Code
                const qrText = `SIMPADAN TANGKAP\nKode: ${data.kodeValidasi}\nNama: ${data.nama}\nNIK: ${data.nik}\nValid: ${data.tanggalValidasi}`;
                const qrCode = new QRCode(qrContainer, {
                    text: qrText,
                    width: 20,
                    height: 20,
                    colorDark: "#0c2461",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
                
                // Tunggu QR Code digenerate
                setTimeout(() => {
                    try {
                        const canvas = qrContainer.querySelector('canvas');
                        if (canvas) {
                            const qrDataUrl = canvas.toDataURL('image/png');
                            // Tambahkan QR Code ke PDF (posisi kanan atas)
                            doc.addImage(qrDataUrl, 'PNG', cardWidth - 25, 5, 20, 20);
                        }
                    } catch (error) {
                        console.error('Error menambahkan QR Code:', error);
                    }
                    
                    // Hapus container sementara
                    document.body.removeChild(qrContainer);
                    
                    // Simpan PDF
                    const fileName = `ID_Card_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi}.pdf`;
                    doc.save(fileName);
                    
                    // Sembunyikan loading
                    document.getElementById('idcardLoading').style.display = 'none';
                    
                    showNotification(`ID Card untuk ${data.nama} berhasil di-generate`, 'success');
                    
                }, 500);
            } else {
                // Simpan PDF tanpa QR Code
                const fileName = `ID_Card_${data.nama.replace(/\s+/g, '_')}.pdf`;
                doc.save(fileName);
                
                // Sembunyikan loading
                document.getElementById('idcardLoading').style.display = 'none';
                
                showNotification(`ID Card untuk ${data.nama} berhasil di-generate`, 'success');
            }
            
        } catch (error) {
            console.error('Error generating ID Card:', error);
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification('Gagal membuat ID Card. Silakan coba lagi.', 'error');
        }
    }, 300);
};

// Fungsi untuk generate ID Card dari ID (kompatibilitas dengan kode yang ada)
window.safeGenerateIDCard = function(id) {
    console.log('Memanggil safeGenerateIDCard dengan ID:', id);
    
    // Cari data di localStorage atau variabel global
    let data = null;
    
    // Coba dari localStorage terlebih dahulu
    const storedData = localStorage.getItem('nelayanData');
    if (storedData) {
        try {
            const allData = JSON.parse(storedData);
            data = allData.find(item => item.id == id);
        } catch (error) {
            console.error('Error parsing data dari localStorage:', error);
        }
    }
    
    // Jika tidak ditemukan di localStorage, coba dari variabel global appData
    if (!data && typeof window.appData !== 'undefined') {
        data = window.appData.find(item => item.id == id);
    }
    
    // Jika masih tidak ditemukan, tampilkan error
    if (!data) {
        showNotification('Data tidak ditemukan untuk ID Card', 'error');
        return;
    }
    
    // Panggil fungsi generate ID Card
    window.generateIDCard(data);
};

// Fungsi helper untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback jika fungsi notifikasi tidak tersedia
        alert(message);
    }
}

// Fungsi untuk memastikan library tersedia
window.checkIDCardDependencies = function() {
    if (typeof window.jspdf === 'undefined') {
        console.error('Library jsPDF tidak ditemukan!');
        return false;
    }
    if (typeof QRCode === 'undefined') {
        console.error('Library QRCode tidak ditemukan!');
        return false;
    }
    return true;
};

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('ID Card Generator siap digunakan');
    
    // Periksa dependencies
    if (!window.checkIDCardDependencies()) {
        console.warn('Beberapa library untuk ID Card tidak tersedia');
    }
});
