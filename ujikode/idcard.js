// ================================================
// ID CARD GENERATOR - SIMPADAN TANGKAP
// Versi: 4.0 - Fixed and Simplified
// ================================================

console.log('🚀 idcard.js loading...');

// ================================================
// 1. DEFINISI FUNGSI UTAMA DI GLOBAL SCOPE
// ================================================

/**
 * FUNGSI UTAMA - HARUS ADA DI WINDOW OBJECT
 */
window.safeGenerateIDCard = function(id) {
    console.log('🟢 safeGenerateIDCard DIPANGGIL dengan ID:', id);
    
    // Coba multiple ways untuk dapatkan data
    let data = null;
    
    // Way 1: Dari window.appData
    if (window.appData && Array.isArray(window.appData)) {
        data = window.appData.find(item => item && (item.id == id || item.id === id));
    }
    
    // Way 2: Dari localStorage
    if (!data) {
        try {
            const localData = localStorage.getItem('nelayanData');
            if (localData) {
                const parsedData = JSON.parse(localData);
                data = parsedData.find(item => item && (item.id == id || item.id === id));
            }
        } catch (e) {
            console.error('Error reading localStorage:', e);
        }
    }
    
    // Jika data tidak ditemukan
    if (!data) {
        alert('❌ Data tidak ditemukan untuk ID: ' + id);
        console.error('Data tidak ditemukan, appData:', window.appData);
        return;
    }
    
    console.log('📄 Data ditemukan:', data.nama);
    
    // Panggil fungsi generate
    generateIDCardNow(data);
};

// ================================================
// 2. FUNGSI GENERATE ID CARD
// ================================================

function generateIDCardNow(data) {
    console.log('🎨 Memulai generate ID Card untuk:', data.nama);
    
    // Validasi library
    if (typeof jspdf === 'undefined') {
        alert('❌ ERROR: Library jsPDF tidak ditemukan!\nPastikan script jsPDF sudah dimuat.');
        console.error('jspdf is undefined');
        return;
    }
    
    // Tampilkan loading
    showLoading(true);
    
    // Gunakan setTimeout agar UI tidak freeze
    setTimeout(() => {
        try {
            createIDCardPDF(data);
        } catch (error) {
            console.error('❌ Error saat membuat ID Card:', error);
            alert('Gagal membuat ID Card: ' + error.message);
            showLoading(false);
        }
    }, 100);
}

// ================================================
// 3. FUNGSI CREATE PDF
// ================================================

function createIDCardPDF(data) {
    console.log('📄 Membuat PDF...');
    
    const { jsPDF } = window.jspdf;
    
    // Buat PDF dengan ukuran ID Card (85.6 x 54 mm)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54.0]
    });
    
    // =========== BACKGROUND ===========
    // Background putih
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54.0, 'F');
    
    // Border biru
    doc.setDrawColor(12, 36, 97); // #0c2461
    doc.setLineWidth(0.5);
    doc.rect(2, 2, 81.6, 50.0);
    
    // =========== HEADER ===========
    // Header biru
    doc.setFillColor(12, 36, 97);
    doc.rect(5, 5, 75.6, 8, 'F');
    
    // Logo/icon bulat
    doc.setFillColor(246, 185, 59); // #f6b93b
    doc.circle(9, 9, 3, 'F');
    
    // Judul
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("KARTU IDENTITAS NELAYAN", 85.6/2, 8.5, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text("SIMPADAN TANGKAP - DINAS PERIKANAN SITUBONDO", 85.6/2, 11, { align: 'center' });
    
    // =========== CONTENT AREA ===========
    const startY = 15;
    
    // --- KOLOM KIRI: FOTO ---
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(7, startY, 25, 30); // Kotak foto
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text("FOTO", 7 + 12.5, startY + 15, { align: 'center' });
    
    // --- KOLOM KANAN: DATA ---
    const dataX = 35;
    let currentY = startY;
    
    // Judul Data Pribadi
    doc.setTextColor(12, 36, 97);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("DATA PRIBADI", dataX, currentY);
    currentY += 5;
    
    // Nama
    addDataField(doc, "Nama", data.nama || "-", dataX, currentY);
    currentY += 5;
    
    // NIK
    addDataField(doc, "NIK", data.nik || "-", dataX, currentY);
    currentY += 5;
    
    // Usia
    const usia = data.usia ? `${data.usia} Tahun` : "-";
    addDataField(doc, "Usia", usia, dataX, currentY);
    currentY += 5;
    
    // Domisili
    const domisili = `${data.desa || "-"}, ${data.kecamatan || "-"}`;
    addDataField(doc, "Domisili", domisili, dataX, currentY);
    
    // =========== BOTTOM SECTION ===========
    const bottomY = startY + 32;
    
    // Garis pemisah
    doc.setDrawColor(12, 36, 97);
    doc.setLineWidth(0.3);
    doc.line(7, bottomY - 2, 78.6, bottomY - 2);
    
    // Data Profesi
    doc.setTextColor(12, 36, 97);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("DATA PROFESI", 7, bottomY);
    
    // Profesi
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text("Profesi:", 7, bottomY + 5);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(data.profesi || "-", 20, bottomY + 5);
    
    // Status
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text("Status:", 7, bottomY + 10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(data.status || "-", 20, bottomY + 10);
    
    // Alat Tangkap
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text("Alat Tangkap:", 40, bottomY + 5);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(data.alatTangkap || "-", 58, bottomY + 5);
    
    // =========== QR CODE ===========
    if (data.kodeValidasi && typeof QRCode !== 'undefined') {
        try {
            // Buat container untuk QR Code
            const qrDiv = document.createElement('div');
            qrDiv.style.position = 'absolute';
            qrDiv.style.left = '-1000px';
            qrDiv.style.top = '-1000px';
            qrDiv.style.width = '50px';
            qrDiv.style.height = '50px';
            document.body.appendChild(qrDiv);
            
            // Generate QR Code
            const qrData = `KIN:${data.kodeValidasi}|NIK:${data.nik}|NAMA:${data.nama}`;
            new QRCode(qrDiv, {
                text: qrData,
                width: 80,
                height: 80,
                colorDark: "#000000",
                colorLight: "#FFFFFF",
                correctLevel: QRCode.CorrectLevel.M
            });
            
            // Tunggu QR code render
            setTimeout(() => {
                const canvas = qrDiv.querySelector('canvas');
                if (canvas) {
                    const imgData = canvas.toDataURL('image/png');
                    doc.addImage(imgData, 'PNG', 65, bottomY, 15, 15);
                    
                    // Label QR
                    doc.setTextColor(100, 100, 100);
                    doc.setFontSize(6);
                    doc.setFont('helvetica', 'italic');
                    doc.text("Kode Validasi", 65 + 7.5, bottomY + 17, { align: 'center' });
                    
                    doc.setTextColor(12, 36, 97);
                    doc.setFont('helvetica', 'bold');
                    doc.text(data.kodeValidasi.substring(0, 10) + "...", 65 + 7.5, bottomY + 20, { align: 'center' });
                }
                
                document.body.removeChild(qrDiv);
                saveAndFinish(doc, data);
                
            }, 300);
            
        } catch (qrError) {
            console.warn('QR Code error:', qrError);
            saveAndFinish(doc, data);
        }
    } else {
        saveAndFinish(doc, data);
    }
}

// ================================================
// 4. HELPER FUNCTIONS
// ================================================

function addDataField(doc, label, value, x, y) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ":", x, y);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    // Potong teks jika terlalu panjang
    const maxWidth = 40;
    if (value.length > 30) {
        value = value.substring(0, 27) + "...";
    }
    
    doc.text(value, x + 15, y);
}

function saveAndFinish(doc, data) {
    // Footer
    const footerY = 50;
    doc.setDrawColor(246, 185, 59); // Warna emas
    doc.setLineWidth(0.5);
    doc.line(7, footerY, 78.6, footerY);
    
    // Tanggal cetak
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    doc.text(`Cetak: ${dateStr}`, 7, footerY + 3);
    
    // Watermark
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.text("SITUBONDO", 85.6/2, 27, { align: 'center', angle: 45 });
    doc.setGState(new doc.GState({ opacity: 1 }));
    
    // Nama file
    const safeName = data.nama.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const fileName = `IDCard_${safeName}_${data.nik.slice(-4)}.pdf`;
    
    // Simpan PDF
    doc.save(fileName);
    
    // Sembunyikan loading
    showLoading(false);
    
    // Notifikasi sukses
    if (typeof showNotification === 'function') {
        showNotification(`✅ ID Card berhasil dibuat: ${fileName}`, 'success');
    } else {
        alert(`✅ ID Card berhasil dibuat!\nFile: ${fileName}`);
    }
    
    console.log('🎉 ID Card selesai:', fileName);
}

function showLoading(show) {
    const loadingEl = document.getElementById('idcardLoading');
    
    if (loadingEl) {
        loadingEl.style.display = show ? 'flex' : 'none';
    } else if (show) {
        // Buat elemen loading jika belum ada
        const div = document.createElement('div');
        div.id = 'idcardLoading';
        div.className = 'idcard-loading';
        div.innerHTML = `
            <div class="idcard-loading-content">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h6>Membuat ID Card...</h6>
                <p class="small text-muted">Harap tunggu sebentar</p>
            </div>
        `;
        div.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        const content = div.querySelector('.idcard-loading-content');
        if (content) {
            content.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            `;
        }
        
        document.body.appendChild(div);
    }
}

// ================================================
// 5. TEST FUNCTION - Untuk debugging
// ================================================

window.testIDCard = function() {
    console.log('🧪 Testing ID Card System...');
    
    // Cek dependencies
    const checks = {
        jsPDF: typeof jspdf !== 'undefined',
        QRCode: typeof QRCode !== 'undefined',
        appData: window.appData && Array.isArray(window.appData),
        safeGenerateIDCard: typeof safeGenerateIDCard === 'function'
    };
    
    console.log('Dependency checks:', checks);
    
    // Jika ada data, test dengan data pertama
    if (checks.appData && window.appData.length > 0) {
        const testData = window.appData[0];
        console.log('Test data:', testData);
        alert(`Test ID Card dengan data:\nNama: ${testData.nama}\nNIK: ${testData.nik}\nKlik OK untuk melanjutkan.`);
        safeGenerateIDCard(testData.id);
        return true;
    } else {
        alert('Tidak ada data untuk testing. Tambahkan data nelayan terlebih dahulu.');
        return false;
    }
};

// ================================================
// 6. FALLBACK FUNCTION - Jika ada masalah
// ================================================

// Buat fallback function yang selalu ada
if (typeof window.safeGenerateIDCard === 'undefined') {
    console.warn('⚠️ safeGenerateIDCard undefined, creating fallback');
    window.safeGenerateIDCard = function(id) {
        alert('⚠️ Sistem ID Card sedang dalam perbaikan.\nSilakan coba beberapa saat lagi atau hubungi administrator.\n\nID: ' + id);
    };
}

// ================================================
// 7. AUTO-INITIALIZE DAN VERIFIKASI
// ================================================

// Tunggu DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIDCard);
} else {
    initializeIDCard();
}

function initializeIDCard() {
    console.log('🔧 Initializing ID Card System...');
    
    // Verifikasi fungsi tersedia
    if (typeof window.safeGenerateIDCard === 'function') {
        console.log('✅ safeGenerateIDCard ready!');
        
        // Tambahkan event listener untuk semua tombol ID Card
        setTimeout(() => {
            setupIDCardButtonListeners();
        }, 2000);
    } else {
        console.error('❌ safeGenerateIDCard NOT ready!');
        
        // Buat emergency fallback
        window.safeGenerateIDCard = function(id) {
            const data = window.appData?.find(d => d.id == id);
            if (data) {
                const content = `
                KARTU IDENTITAS NELAYAN
                ========================
                Nama: ${data.nama}
                NIK: ${data.nik}
                Usia: ${data.usia || '-'} Tahun
                Domisili: ${data.desa || '-'}, ${data.kecamatan || '-'}
                Profesi: ${data.profesi || '-'}
                Status: ${data.status || '-'}
                Alat Tangkap: ${data.alatTangkap || '-'}
                Kode Validasi: ${data.kodeValidasi || '-'}
                ========================
                Dinas Perikanan Kabupaten Situbondo
                Cetak: ${new Date().toLocaleDateString('id-ID')}
                `;
                
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `IDCard_${data.nama}_${data.nik}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                
                alert('ID Card dibuat dalam format teks (PDF tidak tersedia)');
            } else {
                alert('Data tidak ditemukan');
            }
        };
    }
}

function setupIDCardButtonListeners() {
    console.log('🔗 Setting up ID Card button listeners...');
    
    // Tambahkan event listener untuk semua tombol dengan class btn-idcard
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-idcard') || 
                   (e.target.classList.contains('fa-id-card') && e.target.closest('button'));
        
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            
            // Cari ID dari baris tabel
            const row = btn.closest('tr');
            if (row) {
                const checkbox = row.querySelector('.row-checkbox');
                if (checkbox && checkbox.value) {
                    const id = checkbox.value;
                    console.log('🖱️ ID Card button clicked for ID:', id);
                    
                    if (typeof safeGenerateIDCard === 'function') {
                        safeGenerateIDCard(id);
                    } else {
                        alert('Fungsi ID Card belum siap. Silakan refresh halaman.');
                    }
                }
            }
        }
    });
    
    console.log('✅ ID Card button listeners setup complete');
}

// ================================================
// 8. EXPORT FUNCTIONS UNTUK TESTING
// ================================================

console.log('✅ idcard.js loaded successfully!');
console.log('🔧 Functions available: safeGenerateIDCard, testIDCard');

// Ekspos untuk testing di console
window.IDCardSystem = {
    version: '4.0',
    generate: window.safeGenerateIDCard,
    test: window.testIDCard,
    status: function() {
        return {
            jsPDF: typeof jspdf !== 'undefined',
            QRCode: typeof QRCode !== 'undefined',
            appData: window.appData ? `Array(${window.appData.length})` : 'undefined',
            safeGenerateIDCard: typeof safeGenerateIDCard
        };
    }
};
