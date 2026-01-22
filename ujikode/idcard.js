// =====================================================
// MODUL ID CARD NELAYAN - SIMPADAN TANGKAP V5.9 (FIXED VERSION)
// ID Card dengan layout yang benar dan data lengkap
// =====================================================

// Ukuran ID Card dalam mm (3.375 in x 2.125 in = 85.725mm x 53.975mm)
const ID_CARD = {
    width: 85.6,
    height: 53.98,
    margin: 2
};

// Fungsi utama untuk membuat ID Card
function generateIDCard(nelayanData) {
    if (!nelayanData) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }

    console.log('Generating ID Card for:', nelayanData);
    
    // Show loading
    document.getElementById('idcardLoading').style.display = 'flex';
    
    // Prepare data
    const data = prepareIDCardData(nelayanData);
    
    // Create ID Card after short delay
    setTimeout(() => {
        try {
            createIDCardPDF(data);
        } catch (error) {
            console.error('Error creating ID Card:', error);
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification('Gagal membuat ID Card: ' + error.message, 'error');
        }
    }, 100);
}

// Fungsi untuk mempersiapkan data ID Card
function prepareIDCardData(nelayanData) {
    return {
        nama: nelayanData.nama || 'Tidak Diketahui',
        nik: nelayanData.nik || 'Tidak Diketahui',
        usia: nelayanData.usia || 'Tidak Diketahui',
        tahunLahir: nelayanData.tahunLahir || 'Tidak Diketahui',
        kecamatan: nelayanData.kecamatan || 'Tidak Diketahui',
        desa: nelayanData.desa || 'Tidak Diketahui',
        profesi: nelayanData.profesi || 'Tidak Diketahui',
        status: nelayanData.status || 'Tidak Diketahui',
        alatTangkap: nelayanData.alatTangkap || 'Tidak Diketahui',
        namaKapal: nelayanData.namaKapal || '-',
        jenisKapal: nelayanData.jenisKapal || '-',
        jenisIkan: nelayanData.jenisIkan || 'Tidak Diketahui',
        usahaSampingan: nelayanData.usahaSampingan || '-',
        kodeValidasi: nelayanData.kodeValidasi || 'TIDAK ADA',
        tanggalValidasi: nelayanData.tanggalValidasi || 'Tidak Diketahui',
        validator: nelayanData.validator || 'Tidak Diketahui',
        whatsapp: nelayanData.whatsapp || '-'
    };
}

// Fungsi untuk membuat ID Card PDF
function createIDCardPDF(data) {
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF library not loaded!');
    }
    
    const { jsPDF } = window.jspdf;
    
    // Create PDF with ID Card size (landscape)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [ID_CARD.width, ID_CARD.height]
    });
    
    console.log('Creating ID Card PDF with dimensions:', ID_CARD.width + 'mm x ' + ID_CARD.height + 'mm');
    
    // ==================== BACKGROUND & FRAME ====================
    drawBackground(doc);
    
    // ==================== HEADER SECTION ====================
    drawHeader(doc, data);
    
    // ==================== LEFT SECTION - PERSONAL DATA ====================
    drawPersonalData(doc, data);
    
    // ==================== RIGHT SECTION - QR CODE ====================
    drawQRCodeSection(doc, data);
    
    // ==================== FOOTER SECTION ====================
    drawFooter(doc, data);
    
    // Save the PDF
    const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || Date.now()}.pdf`;
    doc.save(fileName);
    
    // Hide loading
    document.getElementById('idcardLoading').style.display = 'none';
    
    showNotification(`ID Card ${data.nama} berhasil dibuat!`, 'success');
}

// Fungsi untuk menggambar background
function drawBackground(doc) {
    // Main background (dark blue)
    doc.setFillColor(12, 36, 97); // #0c2461
    doc.rect(0, 0, ID_CARD.width, ID_CARD.height, 'F');
    
    // Orange border
    doc.setDrawColor(246, 185, 59); // #f6b93b
    doc.setLineWidth(0.5);
    doc.rect(ID_CARD.margin, ID_CARD.margin, 
             ID_CARD.width - (ID_CARD.margin * 2), 
             ID_CARD.height - (ID_CARD.margin * 2));
    
    // Top strip (orange)
    doc.setFillColor(246, 185, 59);
    doc.rect(0, 0, ID_CARD.width, 7, 'F');
}

// Fungsi untuk menggambar header
function drawHeader(doc, data) {
    // Logo (try to load, but use text if fails)
    try {
        const logoUrl = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/logoku2.png';
        doc.addImage(logoUrl, 'PNG', ID_CARD.margin + 1, ID_CARD.margin + 0.5, 10, 10);
    } catch (e) {
        console.log('Logo tidak bisa dimuat, menggunakan teks');
    }
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text("KARTU IDENTITAS NELAYAN", ID_CARD.width / 2, 4.5, { align: 'center' });
    
    doc.setFontSize(6);
    doc.text("SIMPADAN TANGKAP - DINAS PERIKANAN SITUBONDO", ID_CARD.width / 2, 6.5, { align: 'center' });
}

// Fungsi untuk menggambar data pribadi
function drawPersonalData(doc, data) {
    const startX = ID_CARD.margin + 2;
    let startY = 10;
    
    // Name (larger and bold)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    
    // Truncate name if too long
    const displayName = data.nama.length > 25 ? data.nama.substring(0, 25) + '...' : data.nama;
    doc.text(displayName.toUpperCase(), startX, startY);
    
    // Draw line under name
    doc.setDrawColor(246, 185, 59);
    doc.setLineWidth(0.3);
    doc.line(startX, startY + 1, startX + 50, startY + 1);
    
    startY += 4;
    
    // Personal details table
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    
    const details = [
        { label: "NIK", value: data.nik },
        { label: "TTL", value: `${data.tahunLahir} (${data.usia} Thn)` },
        { label: "ALAMAT", value: `${data.desa}, ${data.kecamatan}` },
        { label: "PROFESI", value: data.profesi },
        { label: "STATUS", value: data.status },
        { label: "ALAT TANGKAP", value: data.alatTangkap }
    ];
    
    details.forEach(detail => {
        if (startY < ID_CARD.height - 15) {
            // Label in bold
            doc.setFont('helvetica', 'bold');
            doc.text(`${detail.label}:`, startX, startY);
            
            // Value
            doc.setFont('helvetica', 'normal');
            
            // Split value if too long
            let valueLines = [detail.value];
            if (detail.value.length > 35) {
                valueLines = splitText(detail.value, 35);
            }
            
            // Print each line
            valueLines.forEach(line => {
                doc.text(line, startX + 15, startY);
                startY += 3;
            });
            
            startY += 1; // Spacing between rows
        }
    });
    
    // Boat information if owner
    if (data.status === 'Pemilik Kapal' && data.namaKapal !== '-') {
        startY += 2;
        doc.setFont('helvetica', 'bold');
        doc.text("KAPAL:", startX, startY);
        doc.setFont('helvetica', 'normal');
        const kapalText = `${data.namaKapal} (${data.jenisKapal})`;
        doc.text(kapalText, startX + 12, startY);
    }
}

// Fungsi untuk menggambar QR Code section
function drawQRCodeSection(doc, data) {
    const qrSize = 22;
    const qrX = ID_CARD.width - qrSize - ID_CARD.margin - 2;
    const qrY = 12;
    
    // Generate QR Code content
    const qrContent = generateQRContent(data);
    
    // Create QR Code in hidden container
    const qrContainer = document.getElementById('qr-right');
    if (!qrContainer) {
        console.error('QR container not found!');
        return;
    }
    
    qrContainer.innerHTML = "";
    
    try {
        // Generate QR Code
        new QRCode(qrContainer, {
            text: qrContent,
            width: qrSize * 4,
            height: qrSize * 4,
            colorDark: "#0c2461",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
        
        // Wait for QR Code to render
        setTimeout(() => {
            const qrCanvas = qrContainer.querySelector('canvas');
            if (qrCanvas) {
                const qrDataUrl = qrCanvas.toDataURL('image/png');
                doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
                
                // QR Code label
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5);
                doc.setTextColor(12, 36, 97);
                doc.text("KODE QR RESMI", qrX + qrSize/2, qrY + qrSize + 2, { align: 'center' });
            }
            
            // Validation code
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(246, 185, 59);
            doc.text("KODE VALIDASI:", qrX, ID_CARD.height - 10);
            
            doc.setFontSize(8);
            doc.text(data.kodeValidasi || 'TIDAK ADA', qrX + 28, ID_CARD.height - 10, { align: 'right' });
            
        }, 300);
        
    } catch (error) {
        console.error('Error generating QR Code:', error);
        // Draw validation code even if QR fails
        drawValidationCodeOnly(doc, data, qrX, qrY, qrSize);
    }
}

// Fungsi untuk menggambar kode validasi saja (jika QR gagal)
function drawValidationCodeOnly(doc, data, x, y, size) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(246, 185, 59);
    doc.text("KODE VALIDASI:", x, y + size/2 - 3);
    
    doc.setFontSize(10);
    const code = data.kodeValidasi || 'TIDAK ADA';
    doc.text(code, x + size/2, y + size/2 + 3, { align: 'center' });
}

// Fungsi untuk menggambar footer
function drawFooter(doc, data) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(200, 200, 200);
    
    // Left footer - validation info
    doc.text(`Validasi: ${data.tanggalValidasi}`, ID_CARD.margin + 2, ID_CARD.height - 4);
    
    // Right footer - slogan
    doc.text("Situbondo Naik Kelas", ID_CARD.width - ID_CARD.margin - 2, ID_CARD.height - 4, { align: 'right' });
}

// Fungsi untuk membuat konten QR Code
function generateQRContent(data) {
    return `SIMPADAN TANGKAP - ID CARD NELAYAN
Nama: ${data.nama}
NIK: ${data.nik}
Desa: ${data.desa}
Kecamatan: ${data.kecamatan}
Profesi: ${data.profesi}
Status: ${data.status}
Kode Validasi: ${data.kodeValidasi}
Tanggal Validasi: ${data.tanggalValidasi}
Validator: ${data.validator}
Sistem: SIMPADAN TANGKAP v5.9`;
}

// Fungsi untuk memotong teks yang terlalu panjang
function splitText(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            if (currentLine !== '') {
                lines.push(currentLine);
            }
            currentLine = word;
        }
    });
    
    if (currentLine !== '') {
        lines.push(currentLine);
    }
    
    return lines;
}

// Fungsi untuk membuat ID Card sederhana (fallback)
function generateSimpleIDCard(nelayanData) {
    if (!nelayanData) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    console.log('Generating Simple ID Card for:', nelayanData.nama);
    
    document.getElementById('idcardLoading').style.display = 'flex';
    
    const data = prepareIDCardData(nelayanData);
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            // Simple A6 size (105mm x 148mm)
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a6' // 105 x 148 mm
            });
            
            const width = doc.internal.pageSize.width;
            const height = doc.internal.pageSize.height;
            
            // Background
            doc.setFillColor(12, 36, 97);
            doc.rect(0, 0, width, height, 'F');
            
            // Header
            doc.setFillColor(246, 185, 59);
            doc.rect(0, 0, width, 15, 'F');
            
            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text("KARTU IDENTITAS NELAYAN", width/2, 9, { align: 'center' });
            
            doc.setFontSize(8);
            doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", width/2, 13, { align: 'center' });
            
            // Data section
            let y = 25;
            
            // Name
            doc.setFontSize(12);
            doc.text(`NAMA: ${data.nama.toUpperCase()}`, 10, y);
            y += 8;
            
            // Personal details
            doc.setFontSize(9);
            const details = [
                `NIK: ${data.nik}`,
                `TTL: ${data.tahunLahir} (${data.usia} Tahun)`,
                `ALAMAT: ${data.desa}, ${data.kecamatan}`,
                `PROFESI: ${data.profesi}`,
                `STATUS: ${data.status}`,
                `ALAT TANGKAP: ${data.alatTangkap}`
            ];
            
            details.forEach(detail => {
                if (y < height - 30) {
                    doc.text(detail, 10, y);
                    y += 6;
                }
            });
            
            // Boat info if owner
            if (data.status === 'Pemilik Kapal' && data.namaKapal !== '-') {
                y += 3;
                doc.text(`KAPAL: ${data.namaKapal} (${data.jenisKapal})`, 10, y);
                y += 6;
            }
            
            // QR Code at bottom
            const qrSize = 30;
            const qrX = (width - qrSize) / 2;
            const qrY = y + 5;
            
            // Generate QR Code
            const qrContainer = document.getElementById('qr-right');
            qrContainer.innerHTML = "";
            
            const qrContent = generateQRContent(data);
            new QRCode(qrContainer, {
                text: qrContent,
                width: qrSize * 4,
                height: qrSize * 4,
                colorDark: "#0c2461",
                colorLight: "#ffffff"
            });
            
            setTimeout(() => {
                const qrCanvas = qrContainer.querySelector('canvas');
                if (qrCanvas) {
                    const qrDataUrl = qrCanvas.toDataURL('image/png');
                    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
                }
                
                // Validation code
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(246, 185, 59);
                doc.text(`KODE: ${data.kodeValidasi}`, width/2, qrY + qrSize + 8, { align: 'center' });
                
                // Footer
                doc.setFontSize(7);
                doc.setTextColor(200, 200, 200);
                doc.text("SIMPADAN TANGKAP - Situbondo Naik Kelas", width/2, height - 5, { align: 'center' });
                
                // Save
                const fileName = `IDCard_Simple_${data.nama.replace(/\s+/g, '_')}.pdf`;
                doc.save(fileName);
                
                document.getElementById('idcardLoading').style.display = 'none';
                document.getElementById('qr-right').innerHTML = "";
                
                showNotification(`ID Card sederhana ${data.nama} berhasil dibuat!`, 'success');
                
            }, 300);
            
        } catch (error) {
            console.error('Error creating simple ID Card:', error);
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification('Gagal membuat ID Card sederhana.', 'error');
        }
    }, 100);
}

// ==================== WRAPPER FUNCTIONS ====================

// Main wrapper function - safe to call from anywhere
function safeGenerateIDCard(id) {
    console.log('safeGenerateIDCard called with:', id);
    
    let nelayanData = null;
    
    // Find data based on parameter type
    if (typeof id === 'string' || typeof id === 'number') {
        nelayanData = window.appData.find(item => item.id == id);
    } else if (typeof id === 'object' && id !== null) {
        nelayanData = id;
    }
    
    if (!nelayanData) {
        console.error('Nelayan data not found!');
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    console.log('Found data:', nelayanData);
    
    // Ask user which format they want
    const choice = confirm(
        'Pilih format ID Card:\n\n' +
        'Klik OK untuk format STANDARD (ukuran kartu)\n' +
        'Klik Cancel untuk format SIMPLE (ukuran A6)'
    );
    
    if (choice) {
        generateIDCard(nelayanData);
    } else {
        generateSimpleIDCard(nelayanData);
    }
}

// Function to generate ID Card from verification result
function generateIDCardFromVerify() {
    if (window.verifyDataResult) {
        safeGenerateIDCard(window.verifyDataResult);
    } else {
        showNotification('Tidak ada data verifikasi yang tersedia!', 'error');
    }
}

// Function to generate multiple ID Cards
function generateBatchIDCards() {
    if (!window.appData || window.appData.length === 0) {
        showNotification('Tidak ada data nelayan!', 'error');
        return;
    }
    
    const count = window.appData.length;
    
    if (!confirm(`Anda akan membuat ${count} ID Card. Proses ini mungkin memerlukan waktu. Lanjutkan?`)) {
        return;
    }
    
    document.getElementById('idcardLoading').style.display = 'flex';
    
    // Use simple format for batch
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            let y = 20;
            let page = 1;
            
            window.appData.forEach((data, index) => {
                // Add new page if needed
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                    page++;
                }
                
                // Draw simple ID Card on page
                drawSimpleCardOnPage(doc, data, y);
                
                y += 60; // Move down for next card
                
                // Update progress every 5 cards
                if (index % 5 === 0) {
                    console.log(`Generated ${index + 1} of ${count} ID Cards`);
                }
            });
            
            // Save batch file
            const fileName = `Batch_IDCards_${count}_nelayan_${new Date().getTime()}.pdf`;
            doc.save(fileName);
            
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification(`Berhasil membuat ${count} ID Card dalam file batch!`, 'success');
            
        } catch (error) {
            console.error('Error creating batch ID Cards:', error);
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification('Gagal membuat batch ID Card.', 'error');
        }
    }, 500);
}

// Helper function for batch generation
function drawSimpleCardOnPage(doc, data, y) {
    const width = doc.internal.pageSize.width;
    
    // Card background
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y, width - 40, 50, 'F');
    
    // Border
    doc.setDrawColor(12, 36, 97);
    doc.setLineWidth(0.5);
    doc.rect(20, y, width - 40, 50);
    
    // Content
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(12, 36, 97);
    doc.text(`ID NELAYAN: ${data.kodeValidasi || 'N/A'}`, 25, y + 8);
    
    doc.setFontSize(12);
    doc.text(data.nama, 25, y + 16);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`NIK: ${data.nik}`, 25, y + 24);
    doc.text(`Desa: ${data.desa}, ${data.kecamatan}`, 25, y + 30);
    doc.text(`Profesi: ${data.profesi}`, 25, y + 36);
    doc.text(`Alat Tangkap: ${data.alatTangkap}`, 25, y + 42);
}

// ==================== INITIALIZATION ====================

// Make functions globally available
window.generateIDCard = generateIDCard;
window.safeGenerateIDCard = safeGenerateIDCard;
window.generateSimpleIDCard = generateSimpleIDCard;
window.generateIDCardFromVerify = generateIDCardFromVerify;
window.generateBatchIDCards = generateBatchIDCards;

console.log('ID Card Module v2.0 loaded successfully!');
