// ID CARD GENERATOR UNTUK SISTEM SIMPADAN TANGKAP
// Versi: 2.0 - Optimized untuk ukuran ID Card realistis

// =====================================================
// KONFIGURASI ID CARD - UKURAN REALISTIS (85.6mm x 54mm)
// =====================================================
const ID_CARD_CONFIG = {
    width: 85.6,  // mm (ukuran standar kartu kredit/ID)
    height: 54.0, // mm
    margin: 5,     // mm margin keseluruhan
    fontSize: {
        title: 10,
        header: 9,
        normal: 8,
        small: 7,
        xsmall: 6
    },
    colors: {
        primary: [12, 36, 97],    // Biru tua (#0c2461)
        secondary: [246, 185, 59], // Emas (#f6b93b)
        background: [255, 255, 255], // Putih
        text: [0, 0, 0],           // Hitam
        accent: [74, 105, 189]     // Biru muda (#4a69bd)
    }
};

// =====================================================
// FUNGSI UTAMA GENERATE ID CARD
// =====================================================

/**
 * Fungsi utama untuk membuat ID Card nelayan
 * @param {string|number} id - ID nelayan
 */
function safeGenerateIDCard(id) {
    // Cari data nelayan berdasarkan ID
    const data = window.appData?.find(item => item.id == id);
    
    if (!data) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    // Validasi data minimal yang dibutuhkan
    if (!data.nama || !data.nik || !data.desa || !data.kecamatan) {
        showNotification('Data nelayan tidak lengkap untuk membuat ID Card!', 'error');
        return;
    }
    
    // Tampilkan loading
    const loadingElement = document.getElementById('idcardLoading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
    
    // Gunakan setTimeout untuk menghindari blocking UI
    setTimeout(() => {
        try {
            generateIDCardPDF(data);
        } catch (error) {
            console.error('Error generating ID Card:', error);
            showNotification('Gagal membuat ID Card: ' + error.message, 'error');
        } finally {
            // Sembunyikan loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    }, 100);
}

/**
 * Generate PDF ID Card dengan ukuran realistis
 * @param {Object} data - Data nelayan
 */
function generateIDCardPDF(data) {
    const { jsPDF } = window.jspdf;
    
    // Buat dokumen PDF dengan ukuran ID Card (mm)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [ID_CARD_CONFIG.width, ID_CARD_CONFIG.height],
        compress: true
    });
    
    const margin = ID_CARD_CONFIG.margin;
    const pageWidth = ID_CARD_CONFIG.width;
    const pageHeight = ID_CARD_CONFIG.height;
    
    // =====================================================
    // 1. BACKGROUND & BORDER
    // =====================================================
    
    // Background utama (putih)
    doc.setFillColor(...ID_CARD_CONFIG.colors.background);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Border biru
    doc.setDrawColor(...ID_CARD_CONFIG.colors.primary);
    doc.setLineWidth(0.5);
    doc.rect(1, 1, pageWidth - 2, pageHeight - 2);
    
    // =====================================================
    // 2. HEADER - LOGO & JUDUL
    // =====================================================
    
    // Garis header
    doc.setFillColor(...ID_CARD_CONFIG.colors.primary);
    doc.rect(margin, margin, pageWidth - (margin * 2), 8, 'F');
    
    // Logo kiri (simbol)
    doc.setFillColor(...ID_CARD_CONFIG.colors.secondary);
    doc.circle(margin + 4, margin + 4, 3, 'F');
    
    // Text header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.title);
    doc.setFont('helvetica', 'bold');
    doc.text("KARTU IDENTITAS NELAYAN", pageWidth / 2, margin + 5, { align: 'center' });
    
    // Subjudul
    doc.setFontSize(ID_CARD_CONFIG.fontSize.small);
    doc.setFont('helvetica', 'normal');
    doc.text("SIMPADAN TANGKAP - DINAS PERIKANAN SITUBONDO", pageWidth / 2, margin + 8, { align: 'center' });
    
    // =====================================================
    // 3. BAGIAN KIRI - FOTO & DATA PRIBADI
    // =====================================================
    
    const leftColumnX = margin + 2;
    const contentStartY = margin + 12;
    
    // Kotak tempat foto (kosong - sesuai permintaan)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(leftColumnX, contentStartY, 25, 30);
    
    // Text "FOTO" di tengah kotak
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.small);
    doc.setFont('helvetica', 'italic');
    doc.text("TEMPAT FOTO", leftColumnX + 12.5, contentStartY + 15, { align: 'center' });
    
    // =====================================================
    // 4. BAGIAN KANAN - DATA DETAIL
    // =====================================================
    
    const rightColumnX = leftColumnX + 30;
    let currentY = contentStartY;
    
    // Judul data pribadi
    doc.setTextColor(...ID_CARD_CONFIG.colors.primary);
    doc.setFontSize(ID_CARD_CONFIG.fontSize.header);
    doc.setFont('helvetica', 'bold');
    doc.text("DATA PRIBADI", rightColumnX, currentY);
    
    currentY += 4;
    
    // Fungsi helper untuk menampilkan data
    const addDataRow = (label, value, yPos) => {
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(ID_CARD_CONFIG.fontSize.small);
        doc.setFont('helvetica', 'bold');
        doc.text(label + ":", rightColumnX, yPos);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        const textWidth = pageWidth - rightColumnX - margin - 5;
        const lines = doc.splitTextToSize(value, textWidth);
        
        if (lines.length > 1) {
            doc.text(lines[0], rightColumnX + 20, yPos);
            for (let i = 1; i < lines.length; i++) {
                doc.text(lines[i], rightColumnX + 5, yPos + (i * 3));
            }
            return yPos + (lines.length * 3);
        } else {
            doc.text(value, rightColumnX + 20, yPos);
            return yPos + 4;
        }
    };
    
    // Nama
    currentY = addDataRow("NAMA", data.nama.toUpperCase(), currentY);
    
    // NIK
    currentY = addDataRow("NIK", data.nik, currentY);
    
    // Usia
    const usiaText = data.usia ? `${data.usia} Tahun` : "-";
    currentY = addDataRow("USIA", usiaText, currentY);
    
    // Domisili
    const domisili = `${data.desa}, ${data.kecamatan}`;
    currentY = addDataRow("DOMISILI", domisili, currentY);
    
    // =====================================================
    // 5. BAGIAN BAWAH - DATA PROFESI
    // =====================================================
    
    const bottomStartY = contentStartY + 32;
    
    // Garis pemisah
    doc.setDrawColor(...ID_CARD_CONFIG.colors.primary);
    doc.setLineWidth(0.3);
    doc.line(margin, bottomStartY - 2, pageWidth - margin, bottomStartY - 2);
    
    // Judul data profesi
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
    
    // =====================================================
    // 6. BAGIAN KANAN BAWAH - KODE VALIDASI
    // =====================================================
    
    const qrSize = 15;
    const qrX = pageWidth - margin - qrSize - 2;
    const qrY = bottomStartY;
    
    // Generate QR Code
    try {
        const qrContainer = document.createElement('div');
        qrContainer.style.display = 'none';
        document.body.appendChild(qrContainer);
        
        // Data untuk QR Code
        const qrData = {
            name: data.nama,
            nik: data.nik,
            kin: data.kodeValidasi || 'TIDAK ADA',
            date: new Date().toISOString().split('T')[0]
        };
        
        const qrText = `SIMPADAN TANGKAP\nNama: ${qrData.name}\nNIK: ${qrData.nik}\nKIN: ${qrData.kin}\nValid: ${qrData.date}`;
        
        new QRCode(qrContainer, {
            text: qrText,
            width: qrSize * 4,
            height: qrSize * 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
        
        // Tunggu QR code selesai digambar
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
                
                if (data.kodeValidasi) {
                    doc.setTextColor(...ID_CARD_CONFIG.colors.primary);
                    doc.setFont('helvetica', 'bold');
                    doc.text(data.kodeValidasi, qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
                }
            }
            
            // Hapus container
            document.body.removeChild(qrContainer);
            
            // =====================================================
            // 7. FOOTER & FINALISASI
            // =====================================================
            
            // Garis footer
            doc.setDrawColor(...ID_CARD_CONFIG.colors.secondary);
            doc.setLineWidth(0.5);
            doc.line(margin, pageHeight - margin - 5, pageWidth - margin, pageHeight - margin - 5);
            
            // Text footer
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(ID_CARD_CONFIG.fontSize.xsmall);
            doc.setFont('helvetica', 'normal');
            
            // Tanggal cetak
            const now = new Date();
            const printDate = now.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            doc.text(`Cetak: ${printDate}`, margin, pageHeight - margin - 2);
            
            // ID unik
            const uniqueId = `ID-${data.id}-${Date.now().toString().slice(-6)}`;
            doc.text(uniqueId, pageWidth - margin, pageHeight - margin - 2, { align: 'right' });
            
            // Watermark (transparan)
            doc.setTextColor(200, 200, 200);
            doc.setFontSize(40);
            doc.setFont('helvetica', 'bold');
            doc.setGState(new doc.GState({ opacity: 0.1 }));
            doc.text("SITUBONDO", pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
            doc.setGState(new doc.GState({ opacity: 1 }));
            
            // =====================================================
            // 8. SIMPAN FILE
            // =====================================================
            
            // Nama file
            const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.nik.slice(-4)}.pdf`;
            
            // Simpan PDF
            doc.save(fileName);
            
            // Notifikasi sukses
            showNotification(`ID Card berhasil dibuat: ${fileName}`, 'success');
            
        }, 300);
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        
        // Jika QR code gagal, tetap simpan PDF tanpa QR
        const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.nik.slice(-4)}.pdf`;
        doc.save(fileName);
        showNotification(`ID Card dibuat (tanpa QR Code): ${fileName}`, 'warning');
    }
}

/**
 * Fungsi untuk generate ID Card dari data yang diberikan
 * @param {Object} data - Data nelayan lengkap
 */
function generateIDCardFromData(data) {
    if (!data || typeof data !== 'object') {
        showNotification('Data tidak valid untuk membuat ID Card!', 'error');
        return;
    }
    
    // Tampilkan loading
    const loadingElement = document.getElementById('idcardLoading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
    
    setTimeout(() => {
        try {
            generateIDCardPDF(data);
        } catch (error) {
            console.error('Error generating ID Card from data:', error);
            showNotification('Gagal membuat ID Card: ' + error.message, 'error');
        } finally {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    }, 100);
}

/**
 * Fungsi untuk preview ID Card di browser (tanpa download)
 * @param {string|number} id - ID nelayan
 */
function previewIDCard(id) {
    const data = window.appData?.find(item => item.id == id);
    
    if (!data) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    // Tampilkan loading
    const loadingElement = document.getElementById('idcardLoading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [ID_CARD_CONFIG.width, ID_CARD_CONFIG.height],
                compress: true
            });
            
            // Generate ID Card (sama seperti fungsi utama)
            // ... (kode generate sama seperti di atas)
            
            // Buka di tab baru
            const pdfData = doc.output('datauristring');
            const newWindow = window.open();
            newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
            
        } catch (error) {
            console.error('Error previewing ID Card:', error);
            showNotification('Gagal menampilkan preview ID Card!', 'error');
        } finally {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    }, 100);
}

/**
 * Fungsi untuk generate ID Card dalam format gambar (PNG)
 * @param {string|number} id - ID nelayan
 */
function generateIDCardImage(id) {
    showNotification('Fitur generate gambar sedang dalam pengembangan.', 'info');
    // Implementasi untuk generate PNG akan ditambahkan kemudian
}

// =====================================================
// INISIALISASI DAN INTEGRASI
// =====================================================

/**
 * Cek ketersediaan library yang diperlukan
 */
function checkIDCardDependencies() {
    const dependencies = {
        jsPDF: typeof window.jspdf !== 'undefined',
        QRCode: typeof QRCode !== 'undefined',
        appData: typeof window.appData !== 'undefined'
    };
    
    const missing = Object.keys(dependencies).filter(key => !dependencies[key]);
    
    if (missing.length > 0) {
        console.warn('ID Card dependencies missing:', missing);
        return false;
    }
    
    return true;
}

/**
 * Setup event listeners untuk ID Card
 */
function setupIDCardListeners() {
    // Event listener untuk tombol ID Card di tabel
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-idcard') || 
            (e.target.classList.contains('fa-id-card') && e.target.closest('button'))) {
            const button = e.target.closest('button');
            if (button && button.onclick && button.onclick.toString().includes('safeGenerateIDCard')) {
                // Biarkan event handler asli yang berjalan
                return;
            }
        }
    });
    
    // Tambahkan style untuk loading ID Card
    if (!document.querySelector('#idcard-styles')) {
        const style = document.createElement('style');
        style.id = 'idcard-styles';
        style.textContent = `
            .idcard-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
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
        `;
        document.head.appendChild(style);
    }
}

/**
 * Inisialisasi ID Card Generator
 */
function initIDCardGenerator() {
    console.log('ID Card Generator initialized');
    
    // Cek dependencies
    if (!checkIDCardDependencies()) {
        console.warn('Some dependencies for ID Card are missing. Some features may not work.');
    }
    
    // Setup event listeners
    setupIDCardListeners();
    
    // Ekspos fungsi ke global scope
    window.safeGenerateIDCard = safeGenerateIDCard;
    window.generateIDCardFromData = generateIDCardFromData;
    window.previewIDCard = previewIDCard;
    window.generateIDCardImage = generateIDCardImage;
}

// =====================================================
// AUTO INITIALIZATION
// =====================================================

// Tunggu sampai DOM siap dan library terload
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIDCardGenerator);
} else {
    // Jika DOM sudah siap, langsung init
    setTimeout(initIDCardGenerator, 1000);
}

// Fallback initialization
window.addEventListener('load', function() {
    if (typeof safeGenerateIDCard === 'undefined') {
        initIDCardGenerator();
    }
});

// Ekspos fungsi untuk akses manual
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        safeGenerateIDCard,
        generateIDCardFromData,
        previewIDCard,
        generateIDCardImage,
        initIDCardGenerator
    };
}
