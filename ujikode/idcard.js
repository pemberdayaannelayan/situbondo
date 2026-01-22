// =====================================================
// MODUL ID CARD NELAYAN - SIMPADAN TANGKAP V5.9
// =====================================================

// Fungsi utama untuk membuat ID Card dari data nelayan
function generateIDCard(nelayanData) {
    if (!nelayanData) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }

    // Tampilkan loading
    document.getElementById('idcardLoading').style.display = 'flex';
    
    // Siapkan data untuk ID Card
    const idCardData = {
        nama: nelayanData.nama || '-',
        nik: maskData(nelayanData.nik, false) || '-', // Tampilkan NIK lengkap di ID Card
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

    // Buat QR Code untuk ID Card
    const qrContent = generateQRContent(idCardData);
    
    // Tunggu sebentar untuk memastikan loading terlihat
    setTimeout(() => {
        createIDCardPDF(idCardData, qrContent);
    }, 500);
}

// Fungsi untuk membuat konten QR Code
function generateQRContent(data) {
    return `KARTU IDENTITAS NELAYAN\n` +
           `Nama: ${data.nama}\n` +
           `NIK: ${data.nik}\n` +
           `Desa: ${data.desa}, ${data.kecamatan}\n` +
           `Profesi: ${data.profesi}\n` +
           `Status: ${data.status}\n` +
           `API: ${data.alatTangkap}\n` +
           `Kode Validasi: ${data.kodeValidasi}\n` +
           `Validasi: ${data.tanggalValidasi}\n` +
           `Sistem: SIMPADAN TANGKAP v5.9`;
}

// Fungsi utama untuk membuat PDF ID Card
function createIDCardPDF(data, qrContent) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [85.6, 53.98] // Ukuran standar ID Card (credit card size)
        });

        const cardWidth = 85.6;
        const cardHeight = 53.98;
        
        // ======================== HALAMAN DEPAN ========================
        
        // Background dengan gradien biru
        doc.setFillColor(12, 36, 97); // Biru tua
        doc.rect(0, 0, cardWidth, cardHeight, 'F');
        
        // Garis aksen oranye di atas
        doc.setDrawColor(246, 185, 59);
        doc.setLineWidth(2);
        doc.line(0, 10, cardWidth, 10);
        
        // Logo Dinas Perikanan (kiri atas)
        try {
            // Tambahkan logo jika tersedia, atau gunakan placeholder
            const logoUrl = 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/logoku2.png';
            doc.addImage(logoUrl, 'PNG', 5, 3, 15, 15, 'logo');
        } catch (e) {
            console.log('Logo tidak dapat dimuat, menggunakan teks alternatif');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text("DINAS PERIKANAN", 10, 10);
        }
        
        // Header dengan teks besar
        doc.setTextColor(246, 185, 59); // Oranye
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text("KARTU IDENTITAS NELAYAN", cardWidth/2, 15, { align: 'center' });
        
        doc.setTextColor(255, 255, 255); // Putih
        doc.setFontSize(8);
        doc.text("SISTEM PEMETAAN NELAYAN TERPADU", cardWidth/2, 20, { align: 'center' });
        doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", cardWidth/2, 24, { align: 'center' });
        
        // Garis pemisah
        doc.setDrawColor(246, 185, 59);
        doc.setLineWidth(0.5);
        doc.line(5, 28, cardWidth-5, 28);
        
        // Foto placeholder (area untuk foto)
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(240, 240, 240);
        doc.rect(5, 30, 25, 30, 'F');
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(6);
        doc.text("FOTO 3x4", 17.5, 45, { align: 'center' });
        doc.text("(TEMPAT FOTO)", 17.5, 48, { align: 'center' });
        
        // Data nelayan (sebelah kanan foto)
        let yPos = 32;
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        
        // Nama lengkap (lebih besar dan bold)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        const namaLines = doc.splitTextToSize(data.nama, 45);
        doc.text(namaLines, 35, yPos);
        yPos += (namaLines.length * 3.5);
        
        // Data lainnya
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        
        const dataFields = [
            { label: "NIK", value: data.nik },
            { label: "Usia", value: `${data.usia} Tahun (${data.tahunLahir})` },
            { label: "Domisili", value: `${data.desa}, ${data.kecamatan}` }
        ];
        
        dataFields.forEach(field => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${field.label}:`, 35, yPos);
            doc.setFont('helvetica', 'normal');
            const valueLines = doc.splitTextToSize(field.value, 45);
            doc.text(valueLines, 45, yPos);
            yPos += (valueLines.length * 3) + 1;
        });
        
        // QR Code untuk ID Card (kanan bawah)
        const qrSize = 20;
        const qrX = cardWidth - qrSize - 5;
        const qrY = 30;
        
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
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Tunggu QR code digenerate
            setTimeout(() => {
                const qrCanvas = qrContainer.querySelector('canvas');
                if (qrCanvas) {
                    const qrDataUrl = qrCanvas.toDataURL('image/png');
                    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
                    
                    // Teks di bawah QR
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(5);
                    doc.text("KODE QR RESMI", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
                    
                    // Tambahkan halaman belakang
                    createIDCardBackPage(doc, cardWidth, cardHeight, data);
                    
                } else {
                    console.error('QR Canvas tidak ditemukan');
                    createIDCardBackPage(doc, cardWidth, cardHeight, data);
                }
            }, 300);
            
        } catch (error) {
            console.error('Error membuat QR code:', error);
            createIDCardBackPage(doc, cardWidth, cardHeight, data);
        }
        
    } catch (error) {
        console.error('Error membuat ID Card:', error);
        document.getElementById('idcardLoading').style.display = 'none';
        showNotification('Gagal membuat ID Card. Silakan coba lagi.', 'error');
    }
}

// Fungsi untuk membuat halaman belakang ID Card
function createIDCardBackPage(doc, cardWidth, cardHeight, data) {
    // Tambah halaman baru untuk belakang kartu
    doc.addPage([cardWidth, cardHeight]);
    
    // Background biru yang sama
    doc.setFillColor(12, 36, 97);
    doc.rect(0, 0, cardWidth, cardHeight, 'F');
    
    // Garis oranye di atas
    doc.setDrawColor(246, 185, 59);
    doc.setLineWidth(2);
    doc.line(0, 10, cardWidth, 10);
    
    // Judul halaman belakang
    doc.setTextColor(246, 185, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("INFORMASI PROFESI & KAPAL", cardWidth/2, 20, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("SIMPADAN TANGKAP - SISTEM SATU DATA NELAYAN", cardWidth/2, 25, { align: 'center' });
    
    // Garis pemisah
    doc.setDrawColor(246, 185, 59);
    doc.setLineWidth(0.5);
    doc.line(5, 30, cardWidth-5, 30);
    
    // Data profesi dan kapal
    let yPos = 35;
    doc.setFontSize(7);
    
    const backDataFields = [
        { label: "PROFESI", value: data.profesi, icon: "fas fa-user-tie" },
        { label: "STATUS", value: data.status, icon: "fas fa-briefcase" },
        { label: "ALAT TANGKAP", value: data.alatTangkap, icon: "fas fa-fish" }
    ];
    
    // Tampilkan data profesi
    backDataFields.forEach(field => {
        doc.setFont('helvetica', 'bold');
        doc.text(field.label, 10, yPos);
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(field.value, 65);
        doc.text(valueLines, 35, yPos);
        yPos += (valueLines.length * 3.5) + 2;
    });
    
    // Jika pemilik kapal, tampilkan data kapal
    if (data.status === 'Pemilik Kapal' && (data.namaKapal || data.jenisKapal)) {
        yPos += 3;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(246, 185, 59);
        doc.text("DATA KAPAL", 10, yPos);
        yPos += 4;
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        
        if (data.namaKapal && data.namaKapal !== '-') {
            doc.setFont('helvetica', 'bold');
            doc.text("Nama Kapal:", 10, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(data.namaKapal, 30, yPos);
            yPos += 4;
        }
        
        if (data.jenisKapal && data.jenisKapal !== '-') {
            doc.setFont('helvetica', 'bold');
            doc.text("Jenis Kapal:", 10, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(data.jenisKapal, 30, yPos);
            yPos += 4;
        }
    }
    
    // Jenis ikan tangkapan
    if (data.jenisIkan && data.jenisIkan !== '-') {
        yPos += 3;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(246, 185, 59);
        doc.text("JENIS IKAN TANGKAPAN", 10, yPos);
        yPos += 4;
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        
        const fishList = data.jenisIkan.split(', ');
        fishList.forEach((fish, index) => {
            if (yPos < cardHeight - 10) {
                doc.text(`• ${fish.trim()}`, 10, yPos);
                yPos += 3;
            }
        });
    }
    
    // Footer dengan kode validasi
    doc.setFontSize(6);
    doc.setTextColor(200, 200, 200);
    doc.text("Kode Validasi:", 5, cardHeight - 10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(246, 185, 59);
    doc.text(data.kodeValidasi, 25, cardHeight - 10);
    
    // Garis batas bawah
    doc.setDrawColor(246, 185, 59);
    doc.setLineWidth(0.5);
    doc.line(5, cardHeight - 7, cardWidth - 5, cardHeight - 7);
    
    // Info validasi
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(200, 200, 200);
    doc.text(`Validasi: ${data.tanggalValidasi} oleh ${data.validator}`, cardWidth/2, cardHeight - 3, { align: 'center' });
    
    // Simpan file PDF
    setTimeout(() => {
        const fileName = `ID_Card_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || Date.now()}.pdf`;
        doc.save(fileName);
        
        // Sembunyikan loading
        document.getElementById('idcardLoading').style.display = 'none';
        
        // Bersihkan QR container
        document.getElementById('qr-right').innerHTML = "";
        
        showNotification(`ID Card ${data.nama} berhasil dibuat!`, 'success');
    }, 500);
}

// Fungsi untuk membuat ID Card dengan desain alternatif (lebih sederhana)
function generateSimpleIDCard(nelayanData) {
    if (!nelayanData) {
        showNotification('Data nelayan tidak ditemukan!', 'error');
        return;
    }

    document.getElementById('idcardLoading').style.display = 'flex';
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [85.6, 53.98]
            });

            const width = 85.6;
            const height = 53.98;
            
            // Background dengan gradien
            const gradient = doc.context2d.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, '#0c2461');
            gradient.addColorStop(1, '#1e3799');
            doc.setFillColor(gradient);
            doc.rect(0, 0, width, height, 'F');
            
            // Border oranye
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(2);
            doc.rect(2, 2, width-4, height-4);
            
            // Header
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text("KARTU IDENTITAS NELAYAN", width/2, 10, { align: 'center' });
            
            doc.setFontSize(7);
            doc.text("DINAS PERIKANAN KABUPATEN SITUBONDO", width/2, 15, { align: 'center' });
            
            // Garis pemisah
            doc.setDrawColor(246, 185, 59);
            doc.line(5, 20, width-5, 20);
            
            // Data utama
            let y = 25;
            doc.setFontSize(8);
            
            // Nama (lebih besar)
            doc.setFontSize(10);
            doc.text(`Nama: ${nelayanData.nama}`, 10, y);
            y += 8;
            
            // Data lainnya
            doc.setFontSize(7);
            const fields = [
                `NIK: ${maskData(nelayanData.nik, false)}`,
                `TTL: ${nelayanData.tahunLahir} (${nelayanData.usia} Tahun)`,
                `Alamat: ${nelayanData.desa}, ${nelayanData.kecamatan}`,
                `Profesi: ${nelayanData.profesi}`,
                `Status: ${nelayanData.status}`,
                `Alat Tangkap: ${nelayanData.alatTangkap}`
            ];
            
            fields.forEach(field => {
                doc.text(field, 10, y);
                y += 5;
            });
            
            // QR Code di sebelah kanan
            const qrSize = 25;
            const qrX = width - qrSize - 10;
            const qrY = 25;
            
            // Buat QR Code
            const qrContainer = document.getElementById('qr-right');
            qrContainer.innerHTML = "";
            
            const qrContent = `SIMPADAN-TANGKAP-ID\nNama:${nelayanData.nama}\nNIK:${nelayanData.nik}\nKode:${nelayanData.kodeValidasi || 'N/A'}`;
            
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
                
                // Footer
                doc.setFontSize(6);
                doc.setTextColor(200, 200, 200);
                doc.text(`Kode Validasi: ${nelayanData.kodeValidasi || 'TIDAK ADA'}`, 10, height - 8);
                doc.text(`Valid: ${nelayanData.tanggalValidasi}`, width - 20, height - 8, { align: 'right' });
                
                // Simpan
                const fileName = `ID_${nelayanData.nama.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
                doc.save(fileName);
                
                document.getElementById('idcardLoading').style.display = 'none';
                document.getElementById('qr-right').innerHTML = "";
                
                showNotification(`ID Card sederhana untuk ${nelayanData.nama} berhasil dibuat!`, 'success');
                
            }, 300);
            
        } catch (error) {
            console.error('Error membuat ID Card sederhana:', error);
            document.getElementById('idcardLoading').style.display = 'none';
            showNotification('Gagal membuat ID Card.', 'error');
        }
    }, 500);
}

// Fungsi wrapper untuk memanggil dari kode utama dengan aman
function safeGenerateIDCard(id) {
    // Cari data nelayan berdasarkan ID
    const nelayanData = window.appData.find(item => item.id == id);
    
    if (!nelayanData) {
        // Coba cari dengan parameter langsung (jika id adalah objek data)
        if (typeof id === 'object') {
            generateIDCard(id);
        } else {
            showNotification('Data nelayan tidak ditemukan!', 'error');
        }
        return;
    }
    
    // Tampilkan konfirmasi pilihan desain
    if (confirm('Buat ID Card dengan desain lengkap (2 halaman)? Klik OK untuk desain lengkap, Cancel untuk desain sederhana.')) {
        generateIDCard(nelayanData);
    } else {
        generateSimpleIDCard(nelayanData);
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

// Ekspos fungsi ke global scope
window.generateIDCard = generateIDCard;
window.safeGenerateIDCard = safeGenerateIDCard;
window.generateSimpleIDCard = generateSimpleIDCard;
window.generateIDCardFromVerify = generateIDCardFromVerify;

console.log('Modul ID Card SIMPADAN TANGKAP loaded successfully');
