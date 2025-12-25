/**
 * SIMATA CONVERT DATA TOOL
 * Konversi data antara format Excel (.xlsx) dan reload.js
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Event listener untuk konversi Excel ke Reload.js
    document.getElementById('convertExcelToReloadBtn').addEventListener('click', convertExcelToReload);
    
    // Event listener untuk konversi Reload.js ke Excel
    document.getElementById('convertReloadToExcelBtn').addEventListener('click', convertReloadToExcel);
});

/**
 * Konversi file Excel (.xlsx) ke format reload.js
 */
function convertExcelToReload() {
    const fileInput = document.getElementById('excelToReloadInput');
    const statusDiv = document.getElementById('convertStatus');
    const resultDiv = document.getElementById('convertResult');
    const resultContent = document.getElementById('convertResultContent');
    
    if (!fileInput.files.length) {
        showConvertStatus('Pilih file Excel terlebih dahulu!', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            showConvertStatus('Memproses file Excel...', 'info');
            
            // Membaca file Excel
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Mengambil data dari sheet pertama
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Konversi ke JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
                showConvertStatus('File Excel tidak berisi data!', 'error');
                return;
            }
            
            // Validasi struktur data
            const validatedData = validateAndConvertExcelData(jsonData);
            
            // Membuat konten reload.js
            const reloadJsContent = `window.SIMATA_BACKUP_ENCRYPTED = ${JSON.stringify(validatedData, null, 2)};`;
            
            // Membuat file download
            const blob = new Blob([reloadJsContent], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reload_converted_${Date.now()}.js`;
            
            showConvertStatus(`✅ Berhasil mengkonversi ${validatedData.length} data`, 'success');
            
            resultContent.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Konversi Berhasil!</strong><br>
                    Total data: ${validatedData.length} record<br>
                    File: ${file.name}
                </div>
                <div class="d-grid gap-2">
                    <a href="${url}" download="${a.download}" class="btn btn-primary">
                        <i class="fas fa-download me-2"></i>Download reload.js
                    </a>
                    <button class="btn btn-outline-primary" onclick="copyToClipboard('${reloadJsContent.replace(/'/g, "\\'")}')">
                        <i class="fas fa-copy me-2"></i>Copy ke Clipboard
                    </button>
                </div>
                <div class="mt-3">
                    <small class="text-muted">File ini dapat diupload di menu <strong>Backup & Restore</strong> → <strong>Restore Data Encrypted</strong></small>
                </div>
            `;
            
            resultDiv.classList.remove('d-none');
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
        } catch (error) {
            console.error('Error converting Excel to reload.js:', error);
            showConvertStatus(`Gagal mengkonversi: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        showConvertStatus('Gagal membaca file!', 'error');
    };
    
    reader.readAsArrayBuffer(file);
}

/**
 * Konversi file reload.js ke format Excel (.xlsx)
 */
function convertReloadToExcel() {
    const fileInput = document.getElementById('reloadToExcelInput');
    const statusDiv = document.getElementById('convertStatus');
    const resultDiv = document.getElementById('convertResult');
    const resultContent = document.getElementById('convertResultContent');
    
    if (!fileInput.files.length) {
        showConvertStatus('Pilih file reload.js terlebih dahulu!', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            showConvertStatus('Memproses file reload.js...', 'info');
            
            const content = e.target.result;
            
            // Mengekstrak data dari reload.js
            const data = extractDataFromReloadJs(content);
            
            if (!data || data.length === 0) {
                showConvertStatus('Tidak ditemukan data SIMATA_BACKUP_ENCRYPTED dalam file!', 'error');
                return;
            }
            
            // Membuat worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);
            
            // Membuat workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data Nelayan");
            
            // Menambahkan header informasi
            addMetadataToWorkbook(workbook, data.length);
            
            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `data_nelayan_${new Date().toISOString().slice(0,10)}.xlsx`;
            
            showConvertStatus(`✅ Berhasil mengekstrak ${data.length} data`, 'success');
            
            resultContent.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Konversi Berhasil!</strong><br>
                    Total data: ${data.length} record<br>
                    Format: ${getFileFormatSummary(data[0])}
                </div>
                <div class="d-grid gap-2">
                    <a href="${url}" download="${a.download}" class="btn btn-success">
                        <i class="fas fa-file-excel me-2"></i>Download Excel
                    </a>
                    <button class="btn btn-outline-success" onclick="previewExcelData(${JSON.stringify(data.slice(0, 5)).replace(/</g, '\\u003c')})">
                        <i class="fas fa-eye me-2"></i>Preview Data (5 baris pertama)
                    </button>
                </div>
                <div class="mt-3">
                    <small class="text-muted">File Excel ini dapat diedit dan dikonversi kembali ke reload.js untuk import data baru</small>
                </div>
            `;
            
            resultDiv.classList.remove('d-none');
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
        } catch (error) {
            console.error('Error converting reload.js to Excel:', error);
            showConvertStatus(`Gagal mengkonversi: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        showConvertStatus('Gagal membaca file!', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * Mengekstrak data dari file reload.js
 */
function extractDataFromReloadJs(content) {
    try {
        // Method 1: Cari SIMATA_BACKUP_ENCRYPTED dengan regex
        const match = content.match(/window\.SIMATA_BACKUP_ENCRYPTED\s*=\s*(\[.*?\])\s*;/s);
        
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
        
        // Method 2: Jika regex tidak berhasil, coba evaluasi kode
        const originalContent = content;
        const sandbox = document.createElement('div');
        sandbox.style.display = 'none';
        document.body.appendChild(sandbox);
        
        // Simpan original SIMATA_BACKUP_ENCRYPTED jika ada
        const originalData = window.SIMATA_BACKUP_ENCRYPTED;
        
        try {
            // Jalankan script dalam try-catch
            const script = document.createElement('script');
            script.textContent = originalContent;
            sandbox.appendChild(script);
            
            if (window.SIMATA_BACKUP_ENCRYPTED) {
                const data = window.SIMATA_BACKUP_ENCRYPTED;
                // Reset ke original
                window.SIMATA_BACKUP_ENCRYPTED = originalData;
                sandbox.remove();
                return data;
            }
        } catch (e) {
            console.warn('Script evaluation failed:', e);
        }
        
        sandbox.remove();
        window.SIMATA_BACKUP_ENCRYPTED = originalData;
        
        throw new Error('Format file reload.js tidak valid');
        
    } catch (error) {
        console.error('Extraction error:', error);
        throw error;
    }
}

/**
 * Validasi dan konversi data Excel ke format SIMATA
 */
function validateAndConvertExcelData(excelData) {
    const convertedData = [];
    const errors = [];
    
    excelData.forEach((row, index) => {
        try {
            // Validasi field wajib
            if (!row.nik || !row.nama) {
                errors.push(`Baris ${index + 2}: NIK atau Nama kosong`);
                return;
            }
            
            // Konversi tipe data jika diperlukan
            const convertedRow = {
                id: row.id || Date.now() + index,
                nama: String(row.nama || ''),
                nik: String(row.nik || ''),
                whatsapp: String(row.whatsapp || row.telp || ''),
                profesi: row.profesi || 'Nelayan Penuh Waktu',
                status: row.status || 'Anak Buah Kapal',
                tahunLahir: parseInt(row.tahunLahir) || new Date().getFullYear() - 30,
                usia: parseInt(row.usia) || 30,
                kecamatan: row.kecamatan || '',
                desa: row.desa || '',
                alatTangkap: row.alatTangkap || row.API || '',
                namaKapal: row.namaKapal || '',
                jenisKapal: row.jenisKapal || '',
                jenisIkan: row.jenisIkan || row.ikan || '',
                usahaSampingan: row.usahaSampingan || '',
                tanggalValidasi: row.tanggalValidasi || new Date().toISOString().split('T')[0],
                validator: row.validator || 'System',
                driveLink: row.driveLink || '',
                kodeValidasi: row.kodeValidasi || `VLD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                keterangan: row.keterangan || ''
            };
            
            // Hitung usia jika tahunLahir ada
            if (row.tahunLahir && !row.usia) {
                const currentYear = new Date().getFullYear();
                convertedRow.usia = currentYear - parseInt(row.tahunLahir);
            }
            
            convertedData.push(convertedRow);
            
        } catch (error) {
            errors.push(`Baris ${index + 2}: ${error.message}`);
        }
    });
    
    if (errors.length > 0) {
        console.warn('Validation errors:', errors);
        showConvertStatus(`⚠️ ${convertedData.length} data berhasil, ${errors.length} error`, 'warning');
    }
    
    return convertedData;
}

/**
 * Menambahkan metadata ke workbook Excel
 */
function addMetadataToWorkbook(workbook, dataCount) {
    // Membuat sheet metadata
    const metadata = [
        ['INFORMASI FILE'],
        ['Aplikasi', 'SIMATA - Sistem Pemetaan Nelayan'],
        ['Tanggal Konversi', new Date().toLocaleString('id-ID')],
        ['Total Data', dataCount],
        [''],
        ['PANDUAN EDIT DATA'],
        ['1. Jangan hapus atau ubah nama kolom'],
        ['2. Format NIK harus 16 digit angka'],
        ['3. Untuk tanggal gunakan format YYYY-MM-DD'],
        ['4. Setelah edit, konversi kembali ke reload.js'],
        ['5. Upload file reload.js ke menu Restore']
    ];
    
    const metadataSheet = XLSX.utils.aoa_to_sheet(metadata);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Panduan");
}

/**
 * Menampilkan status konversi
 */
function showConvertStatus(message, type = 'info') {
    const statusDiv = document.getElementById('convertStatus');
    let icon = 'info-circle';
    let color = 'secondary';
    
    switch(type) {
        case 'success':
            icon = 'check-circle';
            color = 'success';
            break;
        case 'error':
            icon = 'exclamation-circle';
            color = 'danger';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            color = 'warning';
            break;
    }
    
    statusDiv.innerHTML = `<i class="fas fa-${icon} me-2 text-${color}"></i>${message}`;
    statusDiv.className = `alert alert-${color}`;
}

/**
 * Mendapatkan ringkasan format file
 */
function getFileFormatSummary(sampleData) {
    const fields = Object.keys(sampleData).slice(0, 5);
    return `${fields.join(', ')}... (Total: ${Object.keys(sampleData).length} field)`;
}

/**
 * Preview data Excel
 */
function previewExcelData(data) {
    const resultContent = document.getElementById('convertResultContent');
    let html = `<h6>Preview Data (${data.length} baris pertama):</h6>`;
    html += `<div class="table-responsive mt-2"><table class="table table-sm table-bordered">`;
    
    // Header
    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        html += '<thead><tr>';
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead>';
    }
    
    // Data
    html += '<tbody>';
    data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => {
            const displayVal = typeof val === 'string' && val.length > 20 ? val.substring(0, 20) + '...' : val;
            html += `<td title="${val}">${displayVal}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    resultContent.innerHTML = html + resultContent.innerHTML;
}

/**
 * Copy teks ke clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showConvertStatus('✅ Teks berhasil disalin ke clipboard!', 'success');
    }).catch(err => {
        showConvertStatus('❌ Gagal menyalin ke clipboard', 'error');
    });
}

/**
 * Clear hasil konversi
 */
function clearConvertResult() {
    document.getElementById('convertResult').classList.add('d-none');
    document.getElementById('convertResultContent').innerHTML = '';
    document.getElementById('excelToReloadInput').value = '';
    document.getElementById('reloadToExcelInput').value = '';
    showConvertStatus('<i class="fas fa-info-circle me-2"></i> Belum ada proses konversi', 'secondary');
}

/**
 * Ekspor fungsi ke global scope
 */
window.convertExcelToReload = convertExcelToReload;
window.convertReloadToExcel = convertReloadToExcel;
window.previewExcelData = previewExcelData;
window.copyToClipboard = copyToClipboard;
window.clearConvertResult = clearConvertResult;

console.log('✅ SIMATA Convert Data Tool v1.0 loaded successfully');
