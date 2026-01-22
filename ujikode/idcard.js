// ID CARD GENERATOR UNTUK SISTEM SIMPADAN TANGKAP
// Versi: 3.0 - Fix Integration Issues

// =====================================================
// KONFIGURASI ID CARD - UKURAN REALISTIS (85.6mm x 54mm)
// =====================================================
const ID_CARD_CONFIG = {
    width: 85.6,
    height: 54.0,
    margin: 5,
    fontSize: {
        title: 10,
        header: 9,
        normal: 8,
        small: 7,
        xsmall: 6
    },
    colors: {
        primary: [12, 36, 97],
        secondary: [246, 185, 59],
        background: [255, 255, 255],
        text: [0, 0, 0],
        accent: [74, 105, 189]
    }
};

// =====================================================
// FUNGSI UTAMA - HARUS DI-SCOPE GLOBAL
// =====================================================

/**
 * Fungsi utama untuk membuat ID Card nelayan - VERSI SIMPLIFIED
 * @param {string|number} id - ID nelayan
 */
window.safeGenerateIDCard = function(id) {
    console.log('🔵 safeGenerateIDCard dipanggil dengan ID:', id);
    
    // Cek apakah appData tersedia
    if (!window.appData || !Array.isArray(window.appData)) {
        alert('ERROR: Data aplikasi belum dimuat. Silakan refresh halaman atau login kembali.');
        console.error('appData tidak tersedia:', window.appData);
        return;
    }
    
    // Cari data nelayan
    const data = window.appData.find(item => {
        return item && (item.id == id || item.nik == id);
    });
    
    if (!data) {
        alert('Data nelayan tidak ditemukan dengan ID: ' + id);
        console.error('Data tidak ditemukan untuk ID:', id);
        return;
    }
    
    console.log('📋 Data ditemukan:', data.nama);
    
    // Tampilkan loading
    const loadingElement = document.getElementById('idcardLoading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    } else {
        // Buat elemen loading jika tidak ada
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'idcard-loading';
        loadingDiv.id = 'idcardLoading';
        loadingDiv.innerHTML = `
            <div class="idcard-loading-content">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h6>Membuat ID Card...</h6>
                <p class="small text-muted">Harap tunggu sebentar</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }
    
    // Delay untuk memastikan UI updated
    setTimeout(() => {
        try {
            generateIDCardPDF(data);
        } catch (error) {
            console.error('❌ Error generating ID Card:', error);
            alert('Gagal membuat ID Card: ' + error.message);
        } finally {
            // Sembunyikan loading
            const loadingEl = document.getElementById('idcardLoading');
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
        }
    }, 100);
};

/**
 * Generate PDF ID Card
 */
function generateIDCardPDF(data) {
    console.log('🔄 Memulai generate PDF untuk:', data.nama);
    
    // Validasi library
    if (typeof jspdf === 'undefined') {
        throw new Error('Library jsPDF tidak ditemukan. Pastikan script jsPDF sudah dimuat.');
    }
    
    const { jsPDF } = window.jspdf;
    
    // Buat dokumen PDF
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [ID_CARD_CONFIG.width, ID_CARD_CONFIG.height]
    });
    
    const margin = ID_CARD_CONFIG.margin;
    const pageWidth = ID_CARD_CONFIG.width;
    const pageHeight = ID_CARD_CONFIG.height;
    
    // 1. BACKGROUND & BORDER
    doc.setFillColor(...ID_CARD_CONFIG.colors.background);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setDrawColor(...ID_CARD_CONFIG.colors.primary);
    doc.setLineWidth(0.5);
    doc.rect(1, 1, pageWidth - 2, pageHeight - 2);
    
    // 2. HEADER
    doc.setFillColor(...ID_CARD_CONFIG.colors.primary);
    doc.rect(margin, margin, pageWidth - (margin * 2), 8, 'F');
    
    doc.setFillColor(...ID_CARD_CONFIG.colors.secondary);
    doc.circle(margin + 4, margin + 4, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.title);
    doc.setFont('helvetica', 'bold');
    doc.text("KARTU IDENTITAS NELAYAN", pageWidth / 2, margin + 5, { align: 'center' });
    
    doc.setFontSize(ID_CARD_CONFIG.fontSize.small);
    doc.setFont('helvetica', 'normal');
    doc.text("SIMPADAN TANGKAP - DINAS PERIKANAN SITUBONDO", pageWidth / 2, margin + 8, { align: 'center' });
    
    // 3. BAGIAN KIRI - FOTO
    const leftColumnX = margin + 2;
    const contentStartY = margin + 12;
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(leftColumnX, contentStartY, 25, 30);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.small);
    doc.setFont('helvetica', 'italic');
    doc.text("FOTO", leftColumnX + 12.5, contentStartY + 15, { align: 'center' });
    
    // 4. BAGIAN KANAN - DATA
    const rightColumnX = leftColumnX + 30;
    let currentY = contentStartY;
    
    doc.setTextColor(...ID_CARD_CONFIG.colors.primary);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.header);
    doc.setFont('helvetica', 'bold');
    doc.text("DATA PRIBADI", rightColumnX, currentY);
    
    currentY += 4;
    
    // Helper function untuk menampilkan data
    function addDataRow(label, value, yPos) {
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(ID_CARD_CONFIG.fontSize.small);
        doc.setFont('helvetica', 'bold');
        doc.text(label + ":", rightColumnX, yPos);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text(value, rightColumnX + 20, yPos);
        return yPos + 4;
    }
    
    // Nama
    currentY = addDataRow("NAMA", data.nama.toUpperCase(), currentY);
    
    // NIK
    const displayNik = data.nik ? data.nik : '-';
    currentY = addDataRow("NIK", displayNik, currentY);
    
    // Usia
    const usiaText = data.usia ? `${data.usia} Tahun` : '-';
    currentY = addDataRow("USIA", usiaText, currentY);
    
    // Domisili
    const domisili = `${data.desa || '-'}, ${data.kecamatan || '-'}`;
    currentY = addDataRow("DOMISILI", domisili, currentY);
    
    // 5. BAGIAN BAWAH - PROFESI
    const bottomStartY = contentStartY + 32;
    
    doc.setDrawColor(...ID_CARD_CONFIG.colors.primary);
    doc.setLineWidth(0.3);
    doc.line(margin, bottomStartY - 2, pageWidth - margin, bottomStartY - 2);
    
    doc.setTextColor(...ID_CARD_CONFIG.colors.primary);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.header);
    doc.setFont('helvetica', 'bold');
    doc.text("DATA PROFESI", leftColumnX, bottomStartY);
    
    // Profesi
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.small);
    doc.setFont('helvetica', 'bold');
    doc.text("PROFESI:", leftColumnX, bottomStartY + 5);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(data.profesi || "-", leftColumnX + 15, bottomStartY + 5);
    
    // Status
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text("STATUS:", leftColumnX, bottomStartY + 10);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(data.status || "-", leftColumnX + 15, bottomStartY + 10);
    
    // Alat Tangkap
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text("ALAT TANGKAP:", leftColumnX + 40, bottomStartY + 5);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(data.alatTangkap || "-", leftColumnX + 60, bottomStartY + 5);
    
    // 6. QR CODE (Jika tersedia)
    if (typeof QRCode !== 'undefined' && data.kodeValidasi) {
        try {
            const qrSize = 15;
            const qrX = pageWidth - margin - qrSize - 2;
            const qrY = bottomStartY;
            
            // Buat container sementara untuk QR Code
            const qrContainer = document.createElement('div');
            qrContainer.style.position = 'absolute';
            qrContainer.style.left = '-9999px';
            qrContainer.style.width = qrSize + 'mm';
            qrContainer.style.height = qrSize + 'mm';
            document.body.appendChild(qrContainer);
            
            // Generate QR Code
            const qrData = `SIMPADAN:${data.kodeValidasi}:${data.nik}:${data.nama}`;
            new QRCode(qrContainer, {
                text: qrData,
                width: 100,
                height: 100,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
            
            // Tunggu sebentar lalu ambil gambar
            setTimeout(() => {
                const canvas = qrContainer.querySelector('canvas');
                if (canvas) {
                    const imgData = canvas.toDataURL('image/png');
                    doc.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);
                    
                    // Label QR Code
                    doc.setTextColor(100, 100, 100);
                    doc.setFontSize(ID_CARD_CONFIG.fontSize.xsmall);
                    doc.setFont('helvetica', 'italic');
                    doc.text("KODE VALIDASI", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
                    
                    doc.setTextColor(...ID_CARD_CONFIG.colors.primary);
                    doc.setFont('helvetica', 'bold');
                    doc.text(data.kodeValidasi, qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
                }
                
                // Hapus container
                document.body.removeChild(qrContainer);
                
                // Simpan PDF
                savePDF(doc, data);
                
            }, 300);
            
        } catch (qrError) {
            console.warn('QR Code gagal, lanjut tanpa QR:', qrError);
            savePDF(doc, data);
        }
    } else {
        // Simpan tanpa QR Code
        savePDF(doc, data);
    }
}

/**
 * Simpan PDF setelah selesai
 */
function savePDF(doc, data) {
    // Tambahkan footer
    const margin = ID_CARD_CONFIG.margin;
    const pageWidth = ID_CARD_CONFIG.width;
    const pageHeight = ID_CARD_CONFIG.height;
    
    // Garis footer
    doc.setDrawColor(...ID_CARD_CONFIG.colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - margin - 5, pageWidth - margin, pageHeight - margin - 5);
    
    // Tanggal cetak
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.xsmall);
    doc.setFont('helvetica', 'normal');
    
    const now = new Date();
    const printDate = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    doc.text(`Cetak: ${printDate}`, margin, pageHeight - margin - 2);
    
    // ID unik
    const uniqueId = `ID-${data.id || Date.now()}`;
    doc.text(uniqueId, pageWidth - margin, pageHeight - margin - 2, { align: 'right' });
    
    // Nama file
    const fileName = `IDCard_${data.nama.replace(/[^a-z0-9]/gi, '_')}_${data.nik ? data.nik.slice(-4) : Date.now().toString().slice(-4)}.pdf`;
    
    // Simpan PDF
    doc.save(fileName);
    
    console.log('✅ ID Card berhasil dibuat:', fileName);
    
    // Tampilkan notifikasi
    if (typeof showNotification === 'function') {
        showNotification(`ID Card berhasil dibuat: ${fileName}`, 'success');
    } else {
        alert(`ID Card berhasil dibuat: ${fileName}`);
    }
}

/**
 * Fungsi fallback jika ada masalah dengan tombol ID Card di tabel
 */
function initIDCardFallback() {
    console.log('🔄 Menginisialisasi ID Card Fallback...');
    
    // Tambahkan event listener untuk semua tombol ID Card
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Cek jika mengklik tombol ID Card atau ikon di dalamnya
        if (target.closest('.btn-idcard') || 
            (target.classList.contains('fa-id-card') && target.closest('button'))) {
            
            e.preventDefault();
            e.stopPropagation();
            
            const button = target.closest('button');
            if (!button) return;
            
            // Cari ID dari baris tabel
            const row = button.closest('tr');
            if (!row) return;
            
            const checkbox = row.querySelector('.row-checkbox');
            if (!checkbox) return;
            
            const id = checkbox.value;
            if (id) {
                console.log('🎯 Tombol ID Card diklik, ID:', id);
                if (typeof safeGenerateIDCard === 'function') {
                    safeGenerateIDCard(id);
                } else {
                    alert('Fungsi ID Card belum siap. Silakan refresh halaman.');
                }
            }
        }
    });
    
    console.log('✅ ID Card Fallback diinisialisasi');
}

/**
 * Inisialisasi ID Card System
 */
function initIDCardSystem() {
    console.log('🚀 Menginisialisasi Sistem ID Card...');
    
    // Pastikan fungsi tersedia di global scope
    if (typeof safeGenerateIDCard !== 'function') {
        window.safeGenerateIDCard = function(id) {
            alert('Sistem ID Card sedang dimuat...\nSilakan tunggu sebentar dan coba lagi.');
            console.log('Fungsi safeGenerateIDCard dipanggil tapi belum siap');
        };
    }
    
    // Setup fallback event listeners
    setTimeout(initIDCardFallback, 1000);
    
    console.log('✅ Sistem ID Card siap digunakan');
}

// =====================================================
// AUTO INITIALIZATION
// =====================================================

// Tunggu sampai DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM Content Loaded - Inisialisasi ID Card');
        setTimeout(initIDCardSystem, 500);
    });
} else {
    // Jika DOM sudah siap
    console.log('⚡ DOM sudah siap - Inisialisasi ID Card langsung');
    setTimeout(initIDCardSystem, 1000);
}

// Inisialisasi ulang saat window load
window.addEventListener('load', function() {
    console.log('🔄 Window Loaded - Final check ID Card System');
    
    // Final check: pastikan fungsi tersedia
    if (typeof safeGenerateIDCard === 'undefined') {
        window.safeGenerateIDCard = function(id) {
            const data = window.appData?.find(item => item.id == id);
            if (data) {
                alert(`ID Card untuk ${data.nama}\nFitur sedang dalam perbaikan.\nSilakan coba beberapa saat lagi.`);
            } else {
                alert('Data tidak ditemukan.');
            }
        };
        console.warn('⚠️ safeGenerateIDCard di-definisi ulang sebagai fallback');
    }
    
    // Tambahkan CSS untuk loading jika belum ada
    if (!document.querySelector('#idcard-css')) {
        const style = document.createElement('style');
        style.id = 'idcard-css';
        style.textContent = `
            .idcard-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .idcard-loading-content {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            .btn-idcard {
                background-color: #4a69bd !important;
                color: white !important;
                border: none !important;
            }
            .btn-idcard:hover {
                background-color: #3c5aa8 !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Ekspos fungsi untuk debugging
window._debugIDCard = {
    version: '3.0',
    config: ID_CARD_CONFIG,
    test: function() {
        if (window.appData && window.appData.length > 0) {
            const testData = window.appData[0];
            console.log('Test ID Card dengan data:', testData);
            safeGenerateIDCard(testData.id);
            return true;
        }
        return false;
    },
    checkDependencies: function() {
        return {
            jsPDF: typeof jspdf !== 'undefined',
            QRCode: typeof QRCode !== 'undefined',
            appData: Array.isArray(window.appData),
            safeGenerateIDCard: typeof safeGenerateIDCard === 'function'
        };
    }
};

console.log('✅ idcard.js loaded successfully');
