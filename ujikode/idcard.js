// =====================================================
// MODUL ID CARD NELAYAN - SIMPADAN TANGKAP V5.9 (REVISI)
// ID Card dengan ukuran realistis (85.6mm x 53.98mm) dan layout yang teratur
// =====================================================

// Konstanta ukuran ID Card (credit card size)
const ID_CARD_WIDTH = 85.6;  // mm
const ID_CARD_HEIGHT = 53.98; // mm

// Fungsi utama untuk membuat ID Card dari data nelayan
function generateIDCard(nelayanData) {
    if (!nelayanData) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }

    console.log('Membuat ID Card untuk:', nelayanData.nama);
    
    // Tampilkan loading
    document.getElementById('idcardLoading').style.display = 'flex';
    
    // Siapkan data untuk ID Card (gunakan NIK lengkap, tidak disensor)
    const idCardData = {
        nama: nelayanData.nama || '-',
        nik: nelayanData.nik || '-', // Tampilkan NIK lengkap di ID Card
        usia: nelayanData.usia || '-',
        tahunLahir: nelayanData.tahunLahir || '-',
        kecamatan: nelayanData.kecamatan || '-',
        desa: nelayanData.desa || '-',
        profesi: nelayanData.profesi || '-',
        status: nelayanData.status || '-',
        alatTangkap: nelayanData.alatTangkap || '-',
        namaKapal: nelayanData.namaKapal || '-',
        jenisKapal: nelayanData.jenisKapal || '-',
        jenisIkan: nelayanData.jenisIkan || '-',
        usahaSampingan: nelayanData.usahaSampingan || '-',
        kodeValidasi: nelayanData.kodeValidasi || 'TIDAK ADA',
        tanggalValidasi: nelayanData.tanggalValidasi || '-',
        validator: nelayanData.validator || '-',
        whatsapp: nelayanData.whatsapp || '-'
    };

    // Tunggu sebentar untuk memastikan loading terlihat
    setTimeout(() => {
        createModernIDCard(idCardData);
    }, 300);
}

// Fungsi untuk membuat ID Card dengan desain modern
function createModernIDCard(data) {
    try {
        const { jsPDF } = window.jspdf;
        
        if (!jsPDF) {
            throw new Error('Library jsPDF tidak tersedia');
        }

        // Buat PDF dengan ukuran ID Card (landscape)
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [ID_CARD_WIDTH, ID_CARD_HEIGHT]
        });

        console.log('Membuat ID Card dengan ukuran:', ID_CARD_WIDTH, 'x', ID_CARD_HEIGHT, 'mm');
        
        // ======================== BACKGROUND DAN FRAME ========================
        
        // Background utama (biru tua)
        doc.setFillColor(12, 36, 97); // #0c2461
        doc.rect(0, 0, ID_CARD_WIDTH, ID_CARD_HEIGHT, 'F');
        
        // Border oranye
        doc.setDrawColor(246, 185, 59); // #f6b93b
        doc.setLineWidth(1);
        doc.rect(1, 1, ID_CARD_WIDTH - 2, ID_CARD_HEIGHT - 2);
        
        // Strip oranye di atas
        doc.setFillColor(246, 185, 59);
        doc.rect(0, 0, ID_CARD_WIDTH, 8, 'F');
        
        // ======================== HEADER ========================
        
        // Logo (kiri atas)
        try {
            // Logo Dinas Perikanan
            const logoUrl = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/logoku2.png';
            doc.addImage(logoUrl, 'PNG', 3, 1.5, 12, 12, 'logo');
        } catch (e) {
            console.log('Logo tidak dapat dimuat, menggunakan teks alternatif');
        }
        
        // Judul utama
        doc.setTextColor(255, 255, 255); // Putih
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text("KARTU IDENTITAS NELAYAN", ID_CARD_WIDTH / 2, 5, { align: 'center' });
        
        doc.setFontSize(7);
        doc.text("SISTEM SATU DATA NELAYAN", ID_CARD_WIDTH / 2, 7.5, { align: 'center' });
        
        // ======================== BAGIAN KIRI (DATA NELAYAN) ========================
        
        // Area data (kiri)
        const dataStartX = 3;
        let dataY = 12;
        
        // Nama (lebih besar dan bold)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const namaLines = doc.splitTextToSize(data.nama.toUpperCase(), 50);
        doc.text(namaLines, dataStartX, dataY);
        dataY += (namaLines.length * 4) + 2;
        
        // Garis pemisah di bawah nama
        doc.setDrawColor(246, 185, 59);
        doc.setLineWidth(0.5);
        doc.line(dataStartX, dataY - 1, 50, dataY - 1);
        
        // Data detail
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        
        const detailFields = [
            { label: "NIK", value: data.nik },
            { label: "TTL", value: `${data.tahunLahir} (${data.usia} Thn)` },
            { label: "ALAMAT", value: `${data.desa}, ${data.kecamatan}` },
            { label: "PROFESI", value: data.profesi },
            { label: "STATUS", value: data.status },
            { label: "ALAT TANGKAP", value: data.alatTangkap }
        ];
        
        detailFields.forEach(field => {
            if (dataY < ID_CARD_HEIGHT - 15) {
                doc.setFont('helvetica', 'bold');
                doc.text(`${field.label}:`, dataStartX, dataY);
                doc.setFont('helvetica', 'normal');
                
                // Split teks jika terlalu panjang
                const valueLines = doc.splitTextToSize(field.value, 45);
                doc.text(valueLines, dataStartX + 15, dataY);
                dataY += (valueLines.length * 3.5) + 1;
            }
        });
        
        // Jika pemilik kapal, tambahkan data kapal
        if (data.status === 'Pemilik Kapal' && data.namaKapal && data.namaKapal !== '-') {
            dataY += 2;
            doc.setFont('helvetica', 'bold');
            doc.text("KAPAL:", dataStartX, dataY);
            doc.setFont('helvetica', 'normal');
            doc.text(`${data.namaKapal} (${data.jenisKapal})`, dataStartX + 10, dataY);
            dataY += 4;
        }
        
        // ======================== BAGIAN KANAN (QR CODE DAN KODE VALIDASI) ========================
        
        // Area QR Code (kanan)
        const qrSize = 25;
        const qrX = ID_CARD_WIDTH - qrSize - 5;
        const qrY = 12;
        
        // Buat konten QR Code
        const qrContent = generateQRContent(data);
        
        // Buat QR Code di elemen tersembunyi
        const qrContainer = document.getElementById('qr-right');
        qrContainer.innerHTML = "";
        
        try {
            new QRCode(qrContainer, {
                text: qrContent,
                width: qrSize * 4,
                height: qrSize * 4,
                colorDark: "#0c2461",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
            
            // Tunggu QR code digenerate
            setTimeout(() => {
                const qrCanvas = qrContainer.querySelector('canvas');
                if (qrCanvas) {
                    const qrDataUrl = qrCanvas.toDataURL('image/png');
                    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
                    
                    // Teks di bawah QR
                    doc.setTextColor(12, 36, 97);
                    doc.setFontSize(5);
                    doc.text("KODE QR VALIDASI", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
                }
                
                // Kode Validasi (kanan bawah)
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7);
                doc.setTextColor(246, 185, 59);
                doc.text("KODE VALIDASI:", qrX, ID_CARD_HEIGHT - 8);
                
                doc.setFontSize(8);
                doc.text(data.kodeValidasi || 'TIDAK ADA', qrX + 25, ID_CARD_HEIGHT - 8, { align: 'right' });
                
                // Footer
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(5);
                doc.setTextColor(200, 200, 200);
                doc.text(`Validasi: ${data.tanggalValidasi} oleh ${data.validator}`, 3, ID_CARD_HEIGHT - 3);
                doc.text("Situbondo Naik Kelas", ID_CARD_WIDTH - 3, ID_CARD_HEIGHT - 3, { align: 'right' });
                
                // Simpan file PDF
                const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || Date.now()}.pdf`;
                doc.save(fileName);
                
                // Sembunyikan loading dan bersihkan
                document.getElementById('idcardLoading').style.display = 'none';
                document.getElementById('qr-right').innerHTML = "";
                
                showNotification(`ID Card ${data.nama} berhasil dibuat!`, 'success');
                
            }, 500);
            
        } catch (error) {
            console.error('Error membuat QR code:', error);
            // Jika QR gagal, tetap lanjutkan
            createFallbackIDCard(doc, data);
        }
        
    } catch (error) {
        console.error('Error membuat ID Card:', error);
        document.getElementById('idcardLoading').style.display = 'none';
        showNotification('Gagal membuat ID Card. Silakan coba lagi.', 'error');
    }
}

// Fungsi untuk membuat konten QR Code
function generateQRContent(data) {
    return `KARTU IDENTITAS NELAYAN
Nama: ${data.nama}
NIK: ${data.nik}
Desa: ${data.desa}
Kecamatan: ${data.kecamatan}
Profesi: ${data.profesi}
Status: ${data.status}
Alat Tangkap: ${data.alatTangkap}
Kode Validasi: ${data.kodeValidasi}
Validasi: ${data.tanggalValidasi}
Sistem: SIMPADAN TANGKAP v5.9`;
}

// Fungsi fallback jika QR gagal
function createFallbackIDCard(doc, data) {
    // Area untuk kode validasi saja
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(246, 185, 59);
    doc.text("KODE VALIDASI:", ID_CARD_WIDTH - 40, ID_CARD_HEIGHT - 15);
    
    doc.setFontSize(10);
    doc.text(data.kodeValidasi || 'TIDAK ADA', ID_CARD_WIDTH - 40, ID_CARD_HEIGHT - 10);
    
    // Simpan
    const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || Date.now()}.pdf`;
    doc.save(fileName);
    
    document.getElementById('idcardLoading').style.display = 'none';
    showNotification(`ID Card ${data.nama} berhasil dibuat (tanpa QR)!`, 'success');
}

// Fungsi alternatif: ID Card dengan desain vertikal (portrait)
function generateVerticalIDCard(nelayanData) {
    if (!nelayanData) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }

    console.log('Membuat ID Card vertikal untuk:', nelayanData.nama);
    
    document.getElementById('idcardLoading').style.display = 'flex';
    
    const data = {
        nama: nelayanData.nama || '-',
        nik: nelayanData.nik || '-',
        usia: nelayanData.usia || '-',
        tahunLahir: nelayanData.tahunLahir || '-',
        kecamatan: nelayanData.kecamatan || '-',
        desa: nelayanData.desa || '-',
        profesi: nelayanData.profesi || '-',
        status: nelayanData.status || '-',
        alatTangkap: nelayanData.alatTangkap || '-',
        namaKapal: nelayanData.namaKapal || '-',
        jenisKapal: nelayanData.jenisKapal || '-',
        kodeValidasi: nelayanData.kodeValidasi || 'TIDAK ADA',
        tanggalValidasi: nelayanData.tanggalValidasi || '-'
    };

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            // Portrait dengan ukuran sedikit lebih tinggi
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [60, 90] // Lebih tinggi dari lebar
            });

            const width = 60;
            const height = 90;
            
            // Background
            doc.setFillColor(12, 36, 97);
            doc.rect(0, 0, width, height, 'F');
            
            // Header strip
            doc.setFillColor(246, 185, 59);
            doc.rect(0, 0, width, 10, 'F');
            
            // Judul
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text("KARTU IDENTITAS NELAYAN", width/2, 7, { align: 'center' });
            
            // Data nelayan
            let yPos = 15;
            doc.setFontSize(8);
            
            // Nama
            doc.setFontSize(10);
            const namaLines = doc.splitTextToSize(data.nama.toUpperCase(), 50);
            doc.text(namaLines, width/2, yPos, { align: 'center' });
            yPos += (namaLines.length * 4) + 5;
            
            // Garis
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(0.5);
            doc.line(10, yPos, width - 10, yPos);
            yPos += 5;
            
            // Detail data
            doc.setFontSize(7);
            const details = [
                `NIK: ${data.nik}`,
                `TTL: ${data.tahunLahir} (${data.usia} Thn)`,
                `Alamat: ${data.desa}, ${data.kecamatan}`,
                `Profesi: ${data.profesi}`,
                `Status: ${data.status}`,
                `Alat Tangkap: ${data.alatTangkap}`
            ];
            
            details.forEach(detail => {
                doc.text(detail, 10, yPos);
                yPos += 5;
            });
            
            // Jika pemilik kapal
            if (data.status === 'Pemilik Kapal' && data.namaKapal !== '-') {
                yPos += 2;
                doc.text(`Kapal: ${data.namaKapal}`, 10, yPos);
                yPos += 4;
            }
            
            // QR Code di bagian bawah
            const qrSize = 20;
            const qrX = (width - qrSize) / 2;
            const qrY = yPos + 5;
            
            const qrContainer = document.getElementById('qr-right');
            qrContainer.innerHTML = "";
            
            const qrContent = `ID NELAYAN:${data.kodeValidasi}`;
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
                
                // Kode validasi
                doc.setFontSize(6);
                doc.setTextColor(246, 185, 59);
                doc.text(`Kode: ${data.kodeValidasi}`, width/2, qrY + qrSize + 5, { align: 'center' });
                
                // Footer
                doc.setFontSize(5);
                doc.setTextColor(200, 200, 200);
                doc.text("SIMPADAN TANGKAP - Situbondo Naik Kelas", width/2, height - 5, { align: 'center' });
                
                // Simpan
                const fileName = `IDCard_Vertikal_${data.nama.replace(/\s+/g, '_')}.pdf`;
                doc.save(fileName);
                
                document.getElementById('idcardLoading').style.display = 'none';
                document.getElementById('qr-right').innerHTML = "";
                
                showNotification(`ID Card vertikal ${data.nama} berhasil dibuat!`, 'success');
                
            }, 500);
            
        } catch (error) {
            console.error('Error membuat ID Card vertikal:', error);
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification('Gagal membuat ID Card vertikal.', 'error');
        }
    }, 300);
}

// Fungsi wrapper untuk memanggil dari kode utama dengan aman
function safeGenerateIDCard(id) {
    console.log('safeGenerateIDCard dipanggil dengan ID:', id);
    
    // Cari data nelayan berdasarkan ID
    let nelayanData;
    
    if (typeof id === 'string' || typeof id === 'number') {
        nelayanData = window.appData.find(item => item.id == id);
    } else if (typeof id === 'object') {
        nelayanData = id;
    }
    
    if (!nelayanData) {
        console.error('Data nelayan tidak ditemukan untuk ID:', id);
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }
    
    console.log('Data ditemukan:', nelayanData.nama);
    
    // Tampilkan pilihan format ID Card
    const choice = confirm(
        'Pilih format ID Card:\n\n' +
        'Klik OK untuk format LANDSCAPE (seperti kartu kredit)\n' +
        'Klik Cancel untuk format PORTRAIT (vertikal)'
    );
    
    if (choice) {
        generateIDCard(nelayanData);
    } else {
        generateVerticalIDCard(nelayanData);
    }
}

// Fungsi untuk membuat ID Card dari hasil verifikasi
function generateIDCardFromVerify() {
    if (window.verifyDataResult) {
        safeGenerateIDCard(window.verifyDataResult);
    } else {
        showNotification('Tidak ada data verifikasi yang tersedia!', 'error');
    }
}

// Fungsi untuk mencetak ID Card untuk semua nelayan (batch)
function generateBatchIDCards() {
    if (!window.appData || window.appData.length === 0) {
        showNotification('Tidak ada data nelayan!', 'error');
        return;
    }
    
    if (window.appData.length > 10) {
        if (!confirm(`Anda akan mencetak ${window.appData.length} ID Card. Proses ini mungkin memerlukan waktu. Lanjutkan?`)) {
            return;
        }
    }
    
    document.getElementById('idcardLoading').style.display = 'flex';
    document.getElementById('idcardLoading').querySelector('h6').textContent = `Menyiapkan ${window.appData.length} ID Card...`;
    
    // Untuk batch, gunakan format vertikal yang lebih sederhana
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            // Buat PDF baru untuk batch
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            
            let currentX = 10;
            let currentY = 15;
            const cardWidth = 85;
            const cardHeight = 54;
            let cardIndex = 0;
            
            window.appData.forEach((data, index) => {
                // Jika sudah penuh halaman, buat halaman baru
                if (currentY + cardHeight > pageHeight - 10) {
                    currentY = 15;
                    currentX += cardWidth + 5;
                    
                    // Jika kolom juga penuh, buat halaman baru
                    if (currentX + cardWidth > pageWidth - 10) {
                        doc.addPage();
                        currentX = 10;
                        currentY = 15;
                    }
                }
                
                // Gambar ID Card sederhana
                doc.setFillColor(12, 36, 97);
                doc.rect(currentX, currentY, cardWidth, cardHeight, 'F');
                
                doc.setFillColor(246, 185, 59);
                doc.rect(currentX, currentY, cardWidth, 8, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.text("ID NELAYAN", currentX + cardWidth/2, currentY + 5, { align: 'center' });
                
                doc.setFontSize(8);
                doc.text(data.nama.substring(0, 20), currentX + 5, currentY + 15);
                doc.setFontSize(6);
                doc.text(`NIK: ${data.nik.substring(0, 12)}...`, currentX + 5, currentY + 20);
                doc.text(`Desa: ${data.desa}`, currentX + 5, currentY + 25);
                doc.text(`Profesi: ${data.profesi}`, currentX + 5, currentY + 30);
                
                doc.setFontSize(5);
                doc.setTextColor(200, 200, 200);
                doc.text(`Kode: ${data.kodeValidasi || 'N/A'}`, currentX + 5, currentY + cardHeight - 5);
                
                currentY += cardHeight + 5;
                cardIndex++;
                
                // Update loading message setiap 10 kartu
                if (cardIndex % 10 === 0) {
                    document.getElementById('idcardLoading').querySelector('p').textContent = 
                        `Telah dibuat ${cardIndex} dari ${window.appData.length} ID Card...`;
                }
            });
            
            // Simpan file batch
            const fileName = `IDCards_Batch_${new Date().toISOString().slice(0,10)}.pdf`;
            doc.save(fileName);
            
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification(`Berhasil membuat ${window.appData.length} ID Card dalam satu file!`, 'success');
            
        } catch (error) {
            console.error('Error membuat batch ID Cards:', error);
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification('Gagal membuat batch ID Card.', 'error');
        }
    }, 500);
}

// Ekspos fungsi ke global scope
window.generateIDCard = generateIDCard;
window.safeGenerateIDCard = safeGenerateIDCard;
window.generateVerticalIDCard = generateVerticalIDCard;
window.generateIDCardFromVerify = generateIDCardFromVerify;
window.generateBatchIDCards = generateBatchIDCards;

console.log('Modul ID Card SIMPADAN TANGKAP (Revisi) loaded successfully');
