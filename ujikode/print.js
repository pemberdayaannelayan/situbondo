// =====================================================
// FILE: print.js - FUNGSI CETAK LAPORAN PDF
// =====================================================

// Fungsi untuk generate PDF tabel data
function generateTabelPdf() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }
    
    // Ambil data sesuai dengan halaman dan jumlah baris per halaman
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMPADAN-TANGKAP-TABEL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd",
            colorLight: "#ffffff", 
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
    }

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            if (typeof jsPDF.API.autoTable !== 'function') {
                showNotification('Library PDF tidak lengkap. Silakan refresh halaman.', 'error');
                return;
            }

            const doc = new jsPDF('l', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Header
            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            // Judul utama - DIPERBAIKI TIDAK TERPOTONG
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14); // Dikurangi dari 16
            doc.setFont('helvetica', 'bold');
            
            // Pisahkan judul menjadi dua baris agar tidak terpotong
            const judulLine1 = 'SISTEM MANAJEMEN & PEMETAAN DATA';
            const judulLine2 = 'PEMBERDAYAAN NELAYAN TANGKAP';
            
            doc.text(judulLine1, pageWidth/2, 18, { align: 'center' });
            doc.text(judulLine2, pageWidth/2, 24, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(11); // Dikurangi dari 12
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 30, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9); // Dikurangi dari 10
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 35, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 40, pageWidth - 20, 40);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16); // Dikurangi dari 18
            doc.text('LAPORAN TABEL DATA NELAYAN', pageWidth/2, 48, { align: 'center' });
            
            // Informasi filter yang aktif
            let filterInfo = "Semua Data";
            if (Object.keys(currentFilter).length > 0 || document.getElementById('searchData').value) {
                filterInfo = "Data Terfilter: ";
                const filterParts = [];
                
                if (currentFilter.desa) filterParts.push(`Desa: ${currentFilter.desa}`);
                if (currentFilter.profesi) filterParts.push(`Profesi: ${currentFilter.profesi}`);
                if (currentFilter.status) filterParts.push(`Status: ${currentFilter.status}`);
                if (currentFilter.jenisKapal) filterParts.push(`Jenis Kapal: ${currentFilter.jenisKapal}`);
                if (currentFilter.alatTangkap) filterParts.push(`Alat Tangkap: ${currentFilter.alatTangkap}`);
                if (currentFilter.usaha) filterParts.push(`Usaha: ${currentFilter.usaha === 'Ada' ? 'Ada Usaha Sampingan' : 'Tidak Ada Usaha'}`);
                if (document.getElementById('searchData').value) filterParts.push(`Pencarian: "${document.getElementById('searchData').value}"`);
                
                filterInfo += filterParts.join(', ');
            }
            
            // Tambahkan informasi halaman dan jumlah baris
            filterInfo += ` | Halaman: ${currentPage}, Jumlah Baris: ${appSettings.itemsPerPage}`;
            
            doc.setFontSize(9); // Dikurangi dari 10
            doc.setFont('helvetica', 'normal');
            // Pisahkan filter info jika terlalu panjang
            const filterLines = doc.splitTextToSize(filterInfo, pageWidth - 40);
            let filterY = 54;
            filterLines.forEach(line => {
                doc.text(line, pageWidth/2, filterY, { align: 'center' });
                filterY += 5;
            });
            
            doc.setFontSize(12); // Dikurangi dari 14
            doc.setFont('helvetica', 'bold');
            doc.text('TABEL DATA NELAYAN', pageWidth/2, filterY + 2, { align: 'center' });
            
            doc.setFontSize(9); // Dikurangi dari 10
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, filterY + 8, { align: 'center' });

            // Siapkan data untuk tabel dengan kolom baru
            const tableRows = pageData.map((d, index) => [
                index + 1,
                d.nama,
                d.whatsapp === '00000000' || !d.whatsapp ? '-' : maskData(d.whatsapp),
                maskData(d.nik),
                d.desa,
                d.kecamatan,
                d.status === 'Pemilik Kapal' ? (d.namaKapal || '-') : '-',
                d.kodeValidasi || '-'
            ]);

            // Tabel Data
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;
            const startY = filterY + 14; // Sesuaikan posisi awal tabel

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 15}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 45}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Desa', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kecamatan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Nama Perahu', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kode Validasi', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}}
                ]],
                body: tableRows,
                startY: startY,
                theme: 'grid',
                tableWidth: tableWidth,
                margin: { left: tableStartX, right: tableStartX },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 8,
                    cellPadding: 3,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    fillColor: [255, 255, 255],
                    cellPadding: 3,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 3,
                    fontSize: 8,
                    valign: 'middle',
                    halign: 'left'
                },
                columnStyles: {
                    0: {cellWidth: 15, halign: 'center'},
                    1: {cellWidth: 45, halign: 'left'},
                    2: {cellWidth: 30, halign: 'center'},
                    3: {cellWidth: 35, halign: 'center'},
                    4: {cellWidth: 35, halign: 'left'},
                    5: {cellWidth: 35, halign: 'left'},
                    6: {cellWidth: 35, halign: 'left'},
                    7: {cellWidth: 30, halign: 'center'}
                }
            });

            // Setelah autoTable, kita atur footer
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : startY + 100;

            // GARIS PEMISAH ANTARA TABEL DAN BAGIAN VALIDASI
            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

            // Bagian kiri: Validasi elektronik
            const leftX = 25;
            const leftY = separatorY + 12;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(12, 36, 97);
            doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX, leftY);
            doc.text("SECARA ELEKTRONIK OLEH", leftX, leftY + 4);
            doc.text("SISTEM SATU DATA NELAYAN (SIMPADAN TANGKAP)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simpadan", leftX, leftY + 18);

            // Bagian kanan: Tanda tangan dan QR Code
            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            // PERIODE/TANGGAL
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            // JABATAN
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            // QR Code dengan warna biru muda
            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    // QR code 25x25 mm
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            // GARIS TANDA TANGAN
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            // NAMA DAN NIP PEJABAT
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            // FOOTER DENGAN INFORMASI SISTEM
            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Informasi sistem di footer
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Data: ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} records | Baris/halaman: ${appSettings.itemsPerPage}`, pageWidth / 2, footerY + 5, { align: 'center' });

            // Simpan file PDF
            const fileName = `Tabel_Nelayan_${appSettings.appSubtitle.replace(/\s+/g, '_').slice(0,15)}_Halaman${currentPage}_${Date.now()}.pdf`;
            doc.save(fileName);
            document.getElementById('qr-right').innerHTML = "";
            
            showNotification(`Tabel PDF berhasil dibuat (${pageData.length} data dari halaman ${currentPage})`, 'success');
            
        } catch (error) {
            console.error("Error generating table PDF:", error);
            showNotification('Gagal membuat PDF tabel. Silakan coba lagi atau periksa konsol browser.', 'error');
        }
    }, 800);
}

// Fungsi untuk generate PDF data terfilter
function generateFilteredPdf() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }
    
    // Ambil data sesuai dengan halaman dan jumlah baris per halaman
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filteredData.slice(start, end);

    // Siapkan data untuk tabel dengan kolom baru
    const tableRows = pageData.map((d, index) => [
        index + 1, 
        d.nama,
        d.whatsapp === '00000000' || !d.whatsapp ? '-' : maskData(d.whatsapp),
        maskData(d.nik),
        d.desa,
        d.kecamatan,
        d.status === 'Pemilik Kapal' ? (d.namaKapal || '-') : '-',
        d.kodeValidasi || '-'
    ]);

    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMPADAN-TANGKAP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd",
            colorLight: "#ffffff", 
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
    }

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            if (typeof jsPDF.API.autoTable !== 'function') {
                showNotification('Library PDF tidak lengkap. Silakan refresh halaman.', 'error');
                return;
            }

            const doc = new jsPDF('l', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Header
            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            // Judul utama - DIPERBAIKI TIDAK TERPOTONG
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14); // Dikurangi dari 16
            doc.setFont('helvetica', 'bold');
            
            // Pisahkan judul menjadi dua baris agar tidak terpotong
            const judulLine1 = 'SISTEM MANAJEMEN & PEMETAAN DATA';
            const judulLine2 = 'PEMBERDAYAAN NELAYAN TANGKAP';
            
            doc.text(judulLine1, pageWidth/2, 18, { align: 'center' });
            doc.text(judulLine2, pageWidth/2, 24, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(11); // Dikurangi dari 12
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 30, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9); // Dikurangi dari 10
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 35, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 40, pageWidth - 20, 40);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16); // Dikurangi dari 18
            doc.text('LAPORAN DATA NELAYAN TERFILTER', pageWidth/2, 48, { align: 'center' });
            
            // Informasi filter yang aktif
            let filterInfo = "Semua Data";
            if (Object.keys(currentFilter).length > 0 || document.getElementById('searchData').value) {
                filterInfo = "Data Terfilter: ";
                const filterParts = [];
                
                if (currentFilter.desa) filterParts.push(`Desa: ${currentFilter.desa}`);
                if (currentFilter.profesi) filterParts.push(`Profesi: ${currentFilter.profesi}`);
                if (currentFilter.status) filterParts.push(`Status: ${currentFilter.status}`);
                if (currentFilter.jenisKapal) filterParts.push(`Jenis Kapal: ${currentFilter.jenisKapal}`);
                if (currentFilter.alatTangkap) filterParts.push(`Alat Tangkap: ${currentFilter.alatTangkap}`);
                if (currentFilter.usaha) filterParts.push(`Usaha: ${currentFilter.usaha === 'Ada' ? 'Ada Usaha Sampingan' : 'Tidak Ada Usaha'}`);
                if (document.getElementById('searchData').value) filterParts.push(`Pencarian: "${document.getElementById('searchData').value}"`);
                
                filterInfo += filterParts.join(', ');
            }
            
            // Tambahkan informasi halaman dan jumlah baris
            filterInfo += ` | Halaman: ${currentPage}, Jumlah Baris: ${appSettings.itemsPerPage}`;
            
            doc.setFontSize(9); // Dikurangi dari 10
            doc.setFont('helvetica', 'normal');
            // Pisahkan filter info jika terlalu panjang
            const filterLines = doc.splitTextToSize(filterInfo, pageWidth - 40);
            let filterY = 54;
            filterLines.forEach(line => {
                doc.text(line, pageWidth/2, filterY, { align: 'center' });
                filterY += 5;
            });
            
            doc.setFontSize(12); // Dikurangi dari 14
            doc.setFont('helvetica', 'bold');
            doc.text('TABEL DATA NELAYAN', pageWidth/2, filterY + 2, { align: 'center' });
            
            doc.setFontSize(9); // Dikurangi dari 10
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, filterY + 8, { align: 'center' });

            // Tabel Data
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;
            const startY = filterY + 14; // Sesuaikan posisi awal tabel

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 15}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 45}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Desa', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kecamatan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Nama Perahu', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kode Validasi', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}}
                ]],
                body: tableRows,
                startY: startY,
                theme: 'grid',
                tableWidth: tableWidth,
                margin: { left: tableStartX, right: tableStartX },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 8,
                    cellPadding: 3,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 8,
                    fillColor: [255, 255, 255],
                    cellPadding: 3,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 3,
                    fontSize: 8,
                    valign: 'middle',
                    halign: 'left'
                },
                columnStyles: {
                    0: {cellWidth: 15, halign: 'center'},
                    1: {cellWidth: 45, halign: 'left'},
                    2: {cellWidth: 30, halign: 'center'},
                    3: {cellWidth: 35, halign: 'center'},
                    4: {cellWidth: 35, halign: 'left'},
                    5: {cellWidth: 35, halign: 'left'},
                    6: {cellWidth: 35, halign: 'left'},
                    7: {cellWidth: 30, halign: 'center'}
                }
            });

            // Setelah autoTable, kita atur footer
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : startY + 100;

            // GARIS PEMISAH ANTARA TABEL DAN BAGIAN VALIDASI
            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

            // Bagian kiri: Validasi elektronik
            const leftX = 25;
            const leftY = separatorY + 12;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(12, 36, 97);
            doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX, leftY);
            doc.text("SECARA ELEKTRONIK OLEH", leftX, leftY + 4);
            doc.text("SISTEM SATU DATA NELAYAN (SIMPADAN TANGKAP)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simpadan", leftX, leftY + 18);

            // Bagian kanan: Tanda tangan dan QR Code
            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            // PERIODE/TANGGAL
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            // JABATAN
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            // QR Code dengan warna biru muda
            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    // QR code 25x25 mm
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            // GARIS TANDA TANGAN
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            // NAMA DAN NIP PEJABAT
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            // FOOTER DENGAN INFORMASI SISTEM
            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Informasi sistem di footer
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Data: ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} records | Baris/halaman: ${appSettings.itemsPerPage}`, pageWidth / 2, footerY + 5, { align: 'center' });

            // Simpan file PDF
            const fileName = `Laporan_Nelayan_Terfilter_${appSettings.appSubtitle.replace(/\s+/g, '_').slice(0,15)}_Halaman${currentPage}_${Date.now()}.pdf`;
            doc.save(fileName);
            document.getElementById('qr-right').innerHTML = "";
            
            showNotification(`Laporan PDF terfilter berhasil dibuat (${pageData.length} data dari halaman ${currentPage})`, 'success');
            
        } catch (error) {
            console.error("Error generating filtered PDF:", error);
            showNotification('Gagal membuat PDF. Silakan coba lagi atau periksa konsol browser.', 'error');
        }
    }, 800);
}

// Fungsi utama untuk cetak laporan data
function printData() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }

    // Hitung statistik per desa dari data terfilter
    const desaStats = {};
    filteredData.forEach(d => {
        const desa = d.desa || "Tidak Diketahui";
        if (!desaStats[desa]) {
            desaStats[desa] = { 
                count: 0, 
                owner: 0, 
                abk: 0, 
                penuhWaktu: 0, 
                sambilanUtama: 0, 
                sambilanTambahan: 0 
            };
        }
        desaStats[desa].count++;
        if(d.status === 'Pemilik Kapal') desaStats[desa].owner++; 
        else desaStats[desa].abk++;
        
        if(d.profesi === 'Nelayan Penuh Waktu') desaStats[desa].penuhWaktu++;
        else if(d.profesi === 'Nelayan Sambilan Utama') desaStats[desa].sambilanUtama++;
        else if(d.profesi === 'Nelayan Sambilan Tambahan') desaStats[desa].sambilanTambahan++;
    });

    // Siapkan data untuk tabel dengan kolom baru
    const tableRows = Object.keys(desaStats).sort().map((desa, index) => [
        index + 1, 
        desa,
        desaStats[desa].count, 
        desaStats[desa].owner,
        desaStats[desa].abk, 
        desaStats[desa].penuhWaktu, 
        desaStats[desa].sambilanUtama,
        desaStats[desa].sambilanTambahan
    ]);

    // Hitung total dari data terfilter
    const totalCount = tableRows.reduce((sum, row) => sum + row[2], 0);
    const totalOwner = tableRows.reduce((sum, row) => sum + row[3], 0);
    const totalAbk = tableRows.reduce((sum, row) => sum + row[4], 0);
    const totalPenuhWaktu = tableRows.reduce((sum, row) => sum + row[5], 0);
    const totalSambilanUtama = tableRows.reduce((sum, row) => sum + row[6], 0);
    const totalSambilanTambahan = tableRows.reduce((sum, row) => sum + row[7], 0);

    // Tambahkan baris total
    tableRows.push([
        "",
        "TOTAL KESELURUHAN",
        totalCount,
        totalOwner,
        totalAbk,
        totalPenuhWaktu,
        totalSambilanUtama,
        totalSambilanTambahan
    ]);

    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMPADAN-TANGKAP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd",
            colorLight: "#ffffff", 
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
    }

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            
            if (typeof jsPDF.API.autoTable !== 'function') {
                showNotification('Library PDF tidak lengkap. Silakan refresh halaman.', 'error');
                return;
            }

            const doc = new jsPDF('l', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Header
            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            // Judul utama - DIPERBAIKI TIDAK TERPOTONG
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14); // Dikurangi dari 16
            doc.setFont('helvetica', 'bold');
            
            // Pisahkan judul menjadi dua baris agar tidak terpotong
            const judulLine1 = 'SISTEM MANAJEMEN & PEMETAAN DATA';
            const judulLine2 = 'PEMBERDAYAAN NELAYAN TANGKAP';
            
            doc.text(judulLine1, pageWidth/2, 18, { align: 'center' });
            doc.text(judulLine2, pageWidth/2, 24, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(11); // Dikurangi dari 12
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 30, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9); // Dikurangi dari 10
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 35, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 40, pageWidth - 20, 40);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16); // Dikurangi dari 18
            doc.text('LAPORAN REKAPITULASI DATA NELAYAN', pageWidth/2, 48, { align: 'center' });
            
            // Informasi filter yang aktif
            let filterInfo = "Semua Data";
            if (Object.keys(currentFilter).length > 0 || document.getElementById('searchData').value) {
                filterInfo = "Data Terfilter: ";
                const filterParts = [];
                
                if (currentFilter.desa) filterParts.push(`Desa: ${currentFilter.desa}`);
                if (currentFilter.profesi) filterParts.push(`Profesi: ${currentFilter.profesi}`);
                if (currentFilter.status) filterParts.push(`Status: ${currentFilter.status}`);
                if (currentFilter.jenisKapal) filterParts.push(`Jenis Kapal: ${currentFilter.jenisKapal}`);
                if (currentFilter.alatTangkap) filterParts.push(`Alat Tangkap: ${currentFilter.alatTangkap}`);
                if (currentFilter.usaha) filterParts.push(`Usaha: ${currentFilter.usaha === 'Ada' ? 'Ada Usaha Sampingan' : 'Tidak Ada Usaha'}`);
                if (document.getElementById('searchData').value) filterParts.push(`Pencarian: "${document.getElementById('searchData').value}"`);
                
                filterInfo += filterParts.join(', ');
            }
            
            doc.setFontSize(9); // Dikurangi dari 10
            doc.setFont('helvetica', 'normal');
            // Pisahkan filter info jika terlalu panjang
            const filterLines = doc.splitTextToSize(filterInfo, pageWidth - 40);
            let filterY = 54;
            filterLines.forEach(line => {
                doc.text(line, pageWidth/2, filterY, { align: 'center' });
                filterY += 5;
            });
            
            doc.setFontSize(12); // Dikurangi dari 14
            doc.setFont('helvetica', 'bold');
            doc.text('REKAPITULASI PER DESA / KELURAHAN', pageWidth/2, filterY + 2, { align: 'center' });
            
            doc.setFontSize(9); // Dikurangi dari 10
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, filterY + 8, { align: 'center' });

            // Tabel Data dengan kolom baru
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;
            const startY = filterY + 14; // Sesuaikan posisi awal tabel

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 20}},
                    {content: 'Desa/Kelurahan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 50}},
                    {content: 'Total Nelayan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'Pemilik Kapal', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'ABK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 25}},
                    {content: 'Penuh Waktu', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'Sambilan Utama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'Sambilan Tambahan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}}
                ]],
                body: tableRows,
                startY: startY,
                theme: 'grid',
                tableWidth: tableWidth,
                margin: { left: tableStartX, right: tableStartX },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 9,
                    cellPadding: 4,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 9,
                    fillColor: [255, 255, 255],
                    cellPadding: 4,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 4,
                    fontSize: 9,
                    valign: 'middle',
                    halign: 'center'
                },
                columnStyles: {
                    0: {cellWidth: 20, halign: 'center'},
                    1: {cellWidth: 50, halign: 'left'},
                    2: {cellWidth: 30, halign: 'center'},
                    3: {cellWidth: 30, halign: 'center'},
                    4: {cellWidth: 25, halign: 'center'},
                    5: {cellWidth: 30, halign: 'center'},
                    6: {cellWidth: 30, halign: 'center'},
                    7: {cellWidth: 30, halign: 'center'}
                },
                willDrawCell: function(data) {
                    // Baris total dengan warna kuning
                    if (data.row.index === tableRows.length - 1) {
                        data.cell.styles.fillColor = [255, 235, 59];
                        data.cell.styles.textColor = [0, 0, 0];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.lineWidth = 0.5;
                        data.cell.styles.lineColor = [12, 36, 97];
                    }
                }
            });

            // Setelah autoTable, kita atur footer
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : startY + 100;

            // GARIS PEMISAH ANTARA TABEL DAN BAGIAN VALIDASI
            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

            // Bagian kiri: Validasi elektronik
            const leftX = 25;
            const leftY = separatorY + 12;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(12, 36, 97);
            doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX, leftY);
            doc.text("SECARA ELEKTRONIK OLEH", leftX, leftY + 4);
            doc.text("SISTEM SATU DATA NELAYAN (SIMPADAN TANGKAP)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simpadan", leftX, leftY + 18);

            // Bagian kanan: Tanda tangan dan QR Code
            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            // PERIODE/TANGGAL
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            // JABATAN
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            // QR Code dengan warna biru muda
            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    // QR code 25x25 mm
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            // GARIS TANDA TANGAN
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            // NAMA DAN NIP PEJABAT
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            // FOOTER DENGAN INFORMASI SISTEM
            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Informasi sistem di footer
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Total Data Terfilter: ${filteredData.length} records`, pageWidth / 2, footerY + 5, { align: 'center' });

            // Simpan file PDF
            const fileName = `Laporan_Rekapitulasi_${appSettings.appSubtitle.replace(/\s+/g, '_').slice(0,15)}_${Date.now()}.pdf`;
            doc.save(fileName);
            document.getElementById('qr-right').innerHTML = "";
            
            showNotification(`Laporan PDF berhasil dibuat (${filteredData.length} data)`, 'success');
            
        } catch (error) {
            console.error("Error generating PDF:", error);
            showNotification('Gagal membuat PDF. Silakan coba lagi atau periksa konsol browser.', 'error');
        }
    }, 800);
}

// Fungsi untuk download PDF detail per nelayan
function downloadSinglePdf(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;

    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `DOKUMEN SAH\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nRef: ${d.kodeValidasi || 'N/A'}`;
    new QRCode(document.getElementById("qr-right"), { 
        text: signatureText, width: 256, height: 256,
        colorDark: "#0984e3",
        colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M
    });

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        
        doc.setDrawColor(12, 36, 97);
        doc.setLineWidth(1);
        doc.rect(10, 10, 190, 277);

        doc.setFillColor(12, 36, 97);
        doc.rect(10, 10, 190, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        
        // Pisahkan judul menjadi dua baris agar tidak terpotong
        const judulLine1 = 'SISTEM MANAJEMEN & PEMETAAN DATA';
        const judulLine2 = 'PEMBERDAYAAN NELAYAN TANGKAP';
        
        doc.text(judulLine1, 105, 22, { align: 'center' });
        doc.text(judulLine2, 105, 28, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text('DINAS PERIKANAN', 105, 36, { align: 'center' });
        doc.setTextColor(246, 185, 59);
        doc.setFont('times', 'italic'); doc.setFontSize(12);
        doc.text('"Situbondo Naik Kelas"', 105, 42, { align: 'center' });
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(appSettings.appSubtitle, 105, 48, { align: 'center' });
        
        doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
        doc.text('BIODATA NELAYAN TERDAFTAR', 105, 65, { align: 'center' });
        doc.setLineWidth(0.5); doc.line(70, 68, 140, 68);

        let y = 80;
        const lineHeight = 7;
        
        const checkPage = (heightNeeded) => {
            if (y + heightNeeded > 250) { 
                doc.addPage();
                doc.setDrawColor(12, 36, 97); doc.setLineWidth(1); doc.rect(10, 10, 190, 277);
                y = 30; 
            }
        };

        const printLine = (label, value) => {
            checkPage(lineHeight);
            doc.setFont('helvetica', 'normal'); doc.text(label, 25, y);
            doc.setFont('helvetica', 'bold'); 
            
            if (label === 'Domisili' || value.length > 50) {
                const splitText = doc.splitTextToSize(': ' + value, 110);
                doc.text(splitText, 80, y);
                y += (splitText.length * 6);
            } else {
                doc.text(': ' + value, 80, y);
                y += lineHeight;
            }
        };

        checkPage(30);
        doc.setFontSize(11); doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('I. IDENTITAS PRIBADI', 22, y); y += 12;
        
        doc.setFontSize(10);
        printLine('Nama Lengkap', d.nama);
        printLine('NIK', d.nik); // Di PDF tetap tampilkan asli
        printLine('Tempat / Tgl Lahir', `${d.tahunLahir} (Usia: ${d.usia} Thn)`);
        printLine('Domisili', `${d.desa}, ${d.kecamatan}`);
        printLine('No. Handphone', d.whatsapp); // Di PDF tetap tampilkan asli
        y += 8;

        checkPage(30);
        doc.setFontSize(11); doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('II. PROFESI & EKONOMI', 22, y); y += 12;

        doc.setFontSize(10);
        printLine('Status Profesi', d.profesi);
        printLine('Posisi Kerja', d.status);
        printLine('Alat Penangkapan Ikan (API)', d.alatTangkap);
        printLine('Usaha Sampingan', d.usahaSampingan || '-');
        y += 8;

        checkPage(30);
        doc.setFontSize(11); doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('III. JENIS IKAN TANGKAPAN UTAMA', 22, y); y += 12;

        doc.setFontSize(10);
        const fishList = d.jenisIkan ? d.jenisIkan.split(', ') : [];
        fishList.forEach((fish, idx) => {
            printLine(`Ikan ${idx + 1}`, fish);
        });
        y += 8;

        if(d.status === 'Pemilik Kapal') {
            checkPage(30);
            doc.setFontSize(11); doc.setFillColor(230, 230, 230);
            doc.rect(20, y-4, 170, 6, 'F');
            doc.text('IV. DATA ASET KAPAL', 22, y); y += 12;

            doc.setFontSize(10);
            printLine('Nama Kapal', d.namaKapal);
            printLine('Jenis Kapal', d.jenisKapal);
        }

        if(y > 210) doc.addPage();

        const footerY = 230; 
        const sigCenterX = 150; 
        const leftX = 25;

        doc.setDrawColor(150);
        doc.setLineWidth(0.5);
        doc.rect(leftX, footerY, 70, 30);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("DOKUMEN INI TELAH DIVALIDASI", leftX + 35, footerY + 6, {align: 'center'});
        doc.text("SECARA ELEKTRONIK OLEH", leftX + 35, footerY + 10, {align: 'center'});
        doc.text("SISTEM SATU DATA (SIMPADAN TANGKAP)", leftX + 35, footerY + 14, {align: 'center'});
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text("Dinas Perikanan Kabupaten Situbondo", leftX + 35, footerY + 20, {align: 'center'});
        doc.setTextColor(0, 0, 255);
        doc.text("www.dinasperikanansitubondo.com/simpadan", leftX + 35, footerY + 25, {align: 'center'});

        doc.setFontSize(10); doc.setTextColor(0,0,0); doc.setFont('helvetica', 'normal');
        const dateStr = new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
        doc.text(`Situbondo, ${dateStr}`, sigCenterX, footerY - 5, {align: 'center'});
        doc.text('Diketahui Oleh :', sigCenterX, footerY, {align: 'center'});
        doc.setFont('helvetica', 'bold');
        doc.text(appSettings.officialPosition, sigCenterX, footerY + 5, {align: 'center'});

        const qrRightCanvas = document.querySelector('#qr-right canvas');
        if(qrRightCanvas) {
            const imgRight = qrRightCanvas.toDataURL("image/png");
            doc.addImage(imgRight, 'PNG', sigCenterX - 12.5, footerY + 8, 25, 25); 
        }

        const nameY = footerY + 38; 
        doc.text(appSettings.officialName, sigCenterX, nameY, {align: 'center'});
        doc.setFont('helvetica', 'normal');
        doc.text(`NIP. ${appSettings.officialNip}`, sigCenterX, nameY + 5, {align: 'center'});

        doc.setFontSize(7); doc.setTextColor(150);
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} | Ref ID: ${d.kodeValidasi || '-'}`, 105, 285, {align:'center'});

        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Dokumen ini saling berhubungan - Halaman ${i} dari ${totalPages}`, 105, 292, { align: 'center' });
        }

        doc.save(`${d.nama}_${d.nik}.pdf`);
        document.getElementById('qr-right').innerHTML = "";

    }, 500);
}
