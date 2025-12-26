/**
 * SIMATA CONVERT DATA TOOL
 * Konversi data antara format Excel (.xlsx) dan reload.js
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 1.1 (Diperbaiki)
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
            
            if (validatedData.length === 0) {
                showConvertStatus('Tidak ada data yang valid untuk dikonversi!', 'error');
                return;
            }
            
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
            try {
                return JSON.parse(match[1]);
            } catch (e) {
                console.warn('JSON parse failed, trying alternative method');
            }
        }
        
        // Method 2: Coba parse sebagai JSON langsung
        try {
            const jsonData = JSON.parse(content);
            if (Array.isArray(jsonData)) return jsonData;
            if (jsonData.data && Array.isArray(jsonData.data)) return jsonData.data;
        } catch (e) {
            console.warn('Direct JSON parse failed');
        }
        
        // Method 3: Ekstrak menggunakan eval dengan sandboxing
        try {
            // Simpan original
            const originalData = window.SIMATA_BACKUP_ENCRYPTED;
            
            // Buat sandbox
            const sandbox = {};
            const code = content + '; sandbox.result = window.SIMATA_BACKUP_ENCRYPTED;';
            
            // Gunakan Function constructor untuk isolasi
            const extractFn = new Function('window', 'sandbox', code);
            extractFn({ SIMATA_BACKUP_ENCRYPTED: null }, sandbox);
            
            if (sandbox.result && Array.isArray(sandbox.result)) {
                window.SIMATA_BACKUP_ENCRYPTED = originalData;
                return sandbox.result;
            }
            
            window.SIMATA_BACKUP_ENCRYPTED = originalData;
        } catch (e) {
            console.warn('Sandboxed eval failed:', e);
        }
        
        throw new Error('Format file reload.js tidak valid');
        
    } catch (error) {
        console.error('Extraction error:', error);
        throw error;
    }
}

/**
 * Validasi dan konversi data Excel ke format SIMATA - DIPERBAIKI
 */
function validateAndConvertExcelData(excelData) {
    const convertedData = [];
    const errors = [];
    
    // Mapping kolom yang mungkin ada di Excel
    const columnMapping = {
        'Nama': 'nama',
        'nama': 'nama',
        'NIK': 'nik',
        'nik': 'nik',
        'WhatsApp': 'whatsapp',
        'whatsapp': 'whatsapp',
        'No HP': 'whatsapp',
        'no_hp': 'whatsapp',
        'Profesi': 'profesi',
        'profesi': 'profesi',
        'Status': 'status',
        'status': 'status',
        'Tahun Lahir': 'tahunLahir',
        'tahun_lahir': 'tahunLahir',
        'Usia': 'usia',
        'usia': 'usia',
        'Kecamatan': 'kecamatan',
        'kecamatan': 'kecamatan',
        'Desa': 'desa',
        'desa': 'desa',
        'Alat Tangkap': 'alatTangkap',
        'alat_tangkap': 'alatTangkap',
        'API': 'alatTangkap',
        'Nama Kapal': 'namaKapal',
        'nama_kapal': 'namaKapal',
        'Jenis Kapal': 'jenisKapal',
        'jenis_kapal': 'jenisKapal',
        'Jenis Ikan': 'jenisIkan',
        'jenis_ikan': 'jenisIkan',
        'Usaha Sampingan': 'usahaSampingan',
        'usaha_sampingan': 'usahaSampingan',
        'Tanggal Validasi': 'tanggalValidasi',
        'tanggal_validasi': 'tanggalValidasi',
        'Validator': 'validator',
        'validator': 'validator',
        'Kode Validasi': 'kodeValidasi',
        'kode_validasi': 'kodeValidasi',
        'Link Drive': 'driveLink',
        'drive_link': 'driveLink'
    };
    
    excelData.forEach((row, index) => {
        try {
            // Normalisasi nama kolom
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                const normalizedKey = columnMapping[key] || key.toLowerCase();
                normalizedRow[normalizedKey] = row[key];
            });
            
            // Validasi field wajib
            if (!normalizedRow.nik || !normalizedRow.nama) {
                errors.push(`Baris ${index + 2}: NIK atau Nama kosong`);
                return;
            }
            
            // Konversi tipe data
            const convertedRow = {
                id: normalizedRow.id || Date.now() + index,
                nama: String(normalizedRow.nama || ''),
                nik: String(normalizedRow.nik || ''),
                whatsapp: String(normalizedRow.whatsapp || normalizedRow.no_hp || ''),
                profesi: normalizedRow.profesi || 'Nelayan Penuh Waktu',
                status: normalizedRow.status || 'Anak Buah Kapal',
                tahunLahir: parseInt(normalizedRow.tahunLahir) || (normalizedRow.usia ? new Date().getFullYear() - parseInt(normalizedRow.usia) : new Date().getFullYear() - 30),
                usia: parseInt(normalizedRow.usia) || (normalizedRow.tahunLahir ? new Date().getFullYear() - parseInt(normalizedRow.tahunLahir) : 30),
                kecamatan: normalizedRow.kecamatan || '',
                desa: normalizedRow.desa || '',
                alatTangkap: normalizedRow.alatTangkap || normalizedRow.api || '',
                namaKapal: normalizedRow.namaKapal || '',
                jenisKapal: normalizedRow.jenisKapal || '',
                jenisIkan: normalizedRow.jenisIkan || '',
                usahaSampingan: normalizedRow.usahaSampingan || '',
                tanggalValidasi: normalizedRow.tanggalValidasi || new Date().toISOString().split('T')[0],
                validator: normalizedRow.validator || 'System',
                driveLink: normalizedRow.driveLink || '',
                kodeValidasi: normalizedRow.kodeValidasi || `VLD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                keterangan: normalizedRow.keterangan || ''
            };
            
            // Validasi NIK minimal 16 digit
            if (convertedRow.nik.length < 16) {
                errors.push(`Baris ${index + 2}: NIK kurang dari 16 digit`);
                return;
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
    if (!sampleData) return 'Tidak ada data';
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
            html += `<td title="${val}">${displayVal || '-'}</td>`;
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
window.extractDataFromReloadJs = extractDataFromReloadJs;

console.log('✅ SIMATA Convert Data Tool v1.1 loaded successfully');
