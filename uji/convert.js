/**
 * SIMATA CONVERT DATA TOOL - VERSI DISEMPURNAKAN
 * Konversi data antara format Excel (.xlsx) dan reload.js dengan fitur Impor Data Cepat
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 2.0 - Fitur Impor Data Cerdas
 */

// CSS untuk konverter
const converterCSS = `
/* CSS untuk Konverter Data */
.converter-container {
    font-family: 'Inter', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.converter-header {
    background: linear-gradient(135deg, #0c2461 0%, #4a69bd 100%);
    color: white;
    padding: 25px;
    border-radius: 15px;
    margin-bottom: 30px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(12, 36, 97, 0.2);
}

.converter-header h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
}

.converter-header p {
    margin: 10px 0 0;
    opacity: 0.9;
    font-size: 15px;
}

.converter-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
    margin-bottom: 30px;
}

.converter-card {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e9ecef;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.converter-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.converter-card h3 {
    color: #0c2461;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f6b93b;
    display: flex;
    align-items: center;
    gap: 10px;
}

.converter-card h3 i {
    font-size: 22px;
    color: #4a69bd;
}

.upload-area {
    border: 2px dashed #4a69bd;
    border-radius: 10px;
    padding: 40px 20px;
    text-align: center;
    background: #f8f9fa;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-area:hover {
    background: #e9ecef;
    border-color: #0c2461;
}

.upload-area i {
    font-size: 50px;
    color: #4a69bd;
    margin-bottom: 15px;
}

.upload-area p {
    margin: 10px 0;
    color: #495057;
}

.upload-area small {
    color: #6c757d;
    font-size: 13px;
}

.converter-buttons {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.converter-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.converter-btn-primary {
    background: linear-gradient(135deg, #0c2461 0%, #4a69bd 100%);
    color: white;
}

.converter-btn-primary:hover {
    background: linear-gradient(135deg, #091c4a 0%, #3a56a8 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(12, 36, 97, 0.2);
}

.converter-btn-secondary {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
}

.converter-btn-secondary:hover {
    background: #e9ecef;
    transform: translateY(-2px);
}

.converter-btn-success {
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    color: white;
}

.converter-btn-success:hover {
    background: linear-gradient(135deg, #219653 0%, #27ae60 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(39, 174, 96, 0.2);
}

.converter-result {
    margin-top: 30px;
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e9ecef;
    display: none;
}

.converter-result.active {
    display: block;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e9ecef;
}

.result-header h4 {
    margin: 0;
    color: #0c2461;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.result-content {
    max-height: 400px;
    overflow-y: auto;
}

.data-preview {
    margin-top: 20px;
}

.data-preview h5 {
    color: #495057;
    margin-bottom: 15px;
    font-size: 16px;
}

.preview-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.preview-table th {
    background: #f8f9fa;
    padding: 10px;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
}

.preview-table td {
    padding: 10px;
    border-bottom: 1px solid #e9ecef;
    color: #6c757d;
}

.preview-table tr:hover {
    background: #f8f9fa;
}

.converter-status {
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.converter-status.info {
    background: #e8f4fd;
    color: #0c2461;
    border-left: 4px solid #0c2461;
}

.converter-status.success {
    background: #e8f6f3;
    color: #27ae60;
    border-left: 4px solid #27ae60;
}

.converter-status.error {
    background: #fde8e8;
    color: #e74c3c;
    border-left: 4px solid #e74c3c;
}

.converter-status.warning {
    background: #fef5e7;
    color: #f39c12;
    border-left: 4px solid #f39c12;
}

.converter-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
    text-align: center;
    color: #6c757d;
    font-size: 13px;
}

/* Modal konfirmasi impor */
.confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.confirm-modal.active {
    display: flex;
    animation: fadeIn 0.3s ease;
}

.confirm-content {
    background: white;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.confirm-header {
    background: linear-gradient(135deg, #0c2461 0%, #4a69bd 100%);
    color: white;
    padding: 20px;
    border-radius: 15px 15px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.confirm-header h3 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.confirm-body {
    padding: 25px;
}

.confirm-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 20px 0;
}

.stat-box {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #0c2461;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 12px;
    color: #6c757d;
}

.confirm-footer {
    padding: 20px;
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.confirm-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.confirm-btn.primary {
    background: #0c2461;
    color: white;
}

.confirm-btn.primary:hover {
    background: #091c4a;
}

.confirm-btn.secondary {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
}

.confirm-btn.secondary:hover {
    background: #e9ecef;
}

/* Responsif */
@media (max-width: 768px) {
    .converter-cards {
        grid-template-columns: 1fr;
    }
    
    .converter-buttons {
        flex-direction: column;
    }
    
    .confirm-stats {
        grid-template-columns: 1fr;
    }
}

/* Loading spinner */
.converter-loading {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
}

.converter-loading.active {
    display: flex;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0c2461;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Fungsi utama untuk menginisialisasi konverter
function initConverter() {
    // Tambahkan CSS ke head
    const styleElement = document.createElement('style');
    styleElement.textContent = converterCSS;
    document.head.appendChild(styleElement);
    
    console.log('✅ SIMATA Converter initialized');
}

/**
 * Fungsi untuk membuat tab Impor Data di index.html
 */
function createImportDataTab() {
    // Cek apakah tab sudah ada
    if (document.getElementById('v-pills-import-tab')) {
        console.log('Tab Impor Data sudah ada');
        return;
    }
    
    // Tambahkan tab di sidebar
    const sidebar = document.querySelector('#v-pills-tab');
    if (!sidebar) return;
    
    // Buat elemen tab baru
    const importTab = document.createElement('button');
    importTab.className = 'nav-link';
    importTab.id = 'v-pills-import-tab';
    importTab.setAttribute('data-bs-toggle', 'pill');
    importTab.setAttribute('data-bs-target', '#v-pills-import');
    importTab.type = 'button';
    importTab.innerHTML = '<i class="fas fa-file-import"></i> Impor Data';
    
    // Sisipkan sebelum tab Pengaturan
    const settingsTab = document.getElementById('v-pills-settings-tab');
    if (settingsTab) {
        settingsTab.parentNode.insertBefore(importTab, settingsTab);
    } else {
        sidebar.appendChild(importTab);
    }
    
    // Tambahkan konten tab
    const tabContent = document.getElementById('v-pills-tabContent');
    if (!tabContent) return;
    
    const importContent = document.createElement('div');
    importContent.className = 'tab-pane fade';
    importContent.id = 'v-pills-import';
    importContent.innerHTML = `
        <h3 class="section-title">Impor Data Cerdas</h3>
        <div class="converter-container">
            <div class="converter-header">
                <h2><i class="fas fa-exchange-alt me-2"></i>Konverter & Impor Data SIMATA</h2>
                <p>Konversi data Excel ke format sistem dan impor data secara cepat</p>
            </div>
            
            <div class="converter-cards">
                <div class="converter-card">
                    <h3><i class="fas fa-file-excel"></i> Excel ke Reload.js</h3>
                    <p>Konversi file Excel hasil download dari menu Ekspor menjadi file <code>reload.js</code> yang bisa diupload ke GitHub atau direstore.</p>
                    
                    <div class="upload-area" id="excelUploadArea" onclick="document.getElementById('excelFileInput').click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p><strong>Klik untuk memilih file Excel</strong></p>
                        <p>Format: .xlsx, .xls</p>
                        <small>File Excel hasil download dari menu Ekspor Data</small>
                    </div>
                    
                    <input type="file" id="excelFileInput" accept=".xlsx,.xls" style="display:none" onchange="handleExcelFileSelect(event)">
                    
                    <div class="converter-buttons">
                        <button class="converter-btn converter-btn-primary" onclick="convertExcelToReload()" id="convertExcelBtn" disabled>
                            <i class="fas fa-sync-alt"></i> Konversi ke reload.js
                        </button>
                        <button class="converter-btn converter-btn-secondary" onclick="clearConverter()">
                            <i class="fas fa-times"></i> Reset
                        </button>
                    </div>
                </div>
                
                <div class="converter-card">
                    <h3><i class="fas fa-database"></i> Impor Data Cepat</h3>
                    <p>Impor data Excel langsung ke sistem. Data yang kosong dapat dilengkapi melalui menu Edit Data.</p>
                    
                    <div class="upload-area" id="importUploadArea" onclick="document.getElementById('importFileInput').click()">
                        <i class="fas fa-file-import"></i>
                        <p><strong>Klik untuk memilih file Excel</strong></p>
                        <p>Format: .xlsx, .xls</p>
                        <small>Template Excel dengan kolom sesuai format SIMATA</small>
                    </div>
                    
                    <input type="file" id="importFileInput" accept=".xlsx,.xls" style="display:none" onchange="handleImportFileSelect(event)">
                    
                    <div class="converter-buttons">
                        <button class="converter-btn converter-btn-success" onclick="importExcelToSystem()" id="importExcelBtn" disabled>
                            <i class="fas fa-upload"></i> Impor ke Sistem
                        </button>
                        <button class="converter-btn converter-btn-secondary" onclick="downloadTemplate()">
                            <i class="fas fa-download"></i> Download Template
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="converter-loading" id="converterLoading">
                <div class="spinner"></div>
                <h4>Memproses data...</h4>
                <p>Harap tunggu sebentar</p>
            </div>
            
            <div class="converter-result" id="converterResult">
                <div class="result-header">
                    <h4><i class="fas fa-check-circle text-success"></i> Hasil Konversi</h4>
                    <button class="btn btn-sm btn-outline-secondary" onclick="closeResult()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="result-content" id="resultContent">
                    <!-- Konten hasil akan dimuat di sini -->
                </div>
            </div>
            
            <div class="converter-status info" id="converterStatus">
                <i class="fas fa-info-circle"></i>
                <span>Belum ada file yang dipilih</span>
            </div>
            
            <div class="converter-footer">
                <p><i class="fas fa-lightbulb me-2"></i> Tips: Pastikan struktur kolom Excel sesuai dengan template untuk hasil terbaik</p>
            </div>
        </div>
        
        <!-- Modal konfirmasi impor -->
        <div class="confirm-modal" id="confirmModal">
            <div class="confirm-content">
                <div class="confirm-header">
                    <h3><i class="fas fa-check-circle"></i> Konfirmasi Impor Data</h3>
                    <button class="btn btn-sm btn-light" onclick="closeConfirmModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-body">
                    <p>Anda akan mengimpor data berikut ke sistem SIMATA:</p>
                    
                    <div class="confirm-stats" id="confirmStats">
                        <!-- Statistik akan dimuat di sini -->
                    </div>
                    
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Data dengan NIK yang sudah ada akan ditimpa. Data baru akan ditambahkan.
                    </div>
                </div>
                <div class="confirm-footer">
                    <button class="confirm-btn secondary" onclick="closeConfirmModal()">Batal</button>
                    <button class="confirm-btn primary" onclick="processImport()">Impor Data</button>
                </div>
            </div>
        </div>
    `;
    
    tabContent.appendChild(importContent);
    
    console.log('✅ Tab Impor Data berhasil dibuat');
}

/**
 * Handle pemilihan file Excel
 */
function handleExcelFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const status = document.getElementById('converterStatus');
    const convertBtn = document.getElementById('convertExcelBtn');
    
    if (file.name.match(/\.(xlsx|xls)$/i)) {
        status.className = 'converter-status success';
        status.innerHTML = `<i class="fas fa-check-circle"></i> File dipilih: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)`;
        convertBtn.disabled = false;
        
        // Preview data jika file kecil
        if (file.size < 1024 * 1024) { // < 1MB
            previewExcelData(file);
        }
    } else {
        status.className = 'converter-status error';
        status.innerHTML = `<i class="fas fa-times-circle"></i> Format file tidak didukung. Harap pilih file Excel (.xlsx atau .xls)`;
        convertBtn.disabled = true;
    }
}

/**
 * Handle pemilihan file untuk impor
 */
function handleImportFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const status = document.getElementById('converterStatus');
    const importBtn = document.getElementById('importExcelBtn');
    
    if (file.name.match(/\.(xlsx|xls)$/i)) {
        status.className = 'converter-status success';
        status.innerHTML = `<i class="fas fa-check-circle"></i> File untuk impor: <strong>${file.name}</strong>`;
        importBtn.disabled = false;
        
        // Tampilkan preview data
        previewImportData(file);
    } else {
        status.className = 'converter-status error';
        status.innerHTML = `<i class="fas fa-times-circle"></i> Format file tidak didukung`;
        importBtn.disabled = true;
    }
}

/**
 * Preview data Excel untuk konversi
 */
function previewExcelData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            // Ambil 5 baris pertama untuk preview
            const previewRows = jsonData.slice(0, 6);
            
            const status = document.getElementById('converterStatus');
            status.innerHTML += `<br><small><i class="fas fa-eye me-1"></i> Preview: ${previewRows.length - 1} baris data ditemukan</small>`;
            
        } catch (error) {
            console.error('Error previewing Excel:', error);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

/**
 * Preview data untuk impor
 */
function previewImportData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            const status = document.getElementById('converterStatus');
            status.innerHTML += `<br><small><i class="fas fa-database me-1"></i> Data terdeteksi: ${jsonData.length} records</small>`;
            
        } catch (error) {
            console.error('Error previewing import data:', error);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

/**
 * Konversi Excel ke reload.js
 */
function convertExcelToReload() {
    const fileInput = document.getElementById('excelFileInput');
    const loading = document.getElementById('converterLoading');
    const result = document.getElementById('converterResult');
    const resultContent = document.getElementById('resultContent');
    
    if (!fileInput.files.length) {
        showConverterStatus('Pilih file Excel terlebih dahulu!', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    loading.classList.add('active');
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
                throw new Error('File Excel tidak berisi data');
            }
            
            // Validasi dan konversi data
            const validatedData = validateAndConvertExcelData(jsonData);
            
            // Buat konten reload.js
            const encryptedData = btoa(JSON.stringify(validatedData));
            const reloadJsContent = `window.SIMATA_BACKUP_ENCRYPTED = '${encryptedData}';`;
            
            // Tampilkan hasil
            resultContent.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Konversi Berhasil!</strong><br>
                    <div class="mt-2">
                        <div><strong>File Input:</strong> ${file.name}</div>
                        <div><strong>Total Data:</strong> ${validatedData.length} records</div>
                        <div><strong>Format:</strong> SIMATA v5.3</div>
                        <div><strong>Waktu:</strong> ${new Date().toLocaleTimeString('id-ID')}</div>
                    </div>
                </div>
                
                <div class="data-preview">
                    <h5><i class="fas fa-table me-2"></i>Preview Data (5 baris pertama):</h5>
                    <div class="table-responsive">
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>NIK</th>
                                    <th>Profesi</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${validatedData.slice(0, 5).map((item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.nama || '-'}</td>
                                        <td>${item.nik ? item.nik.substring(0, 8) + '****' : '-'}</td>
                                        <td><span class="badge ${getProfesiBadgeClass(item.profesi)}">${item.profesi || '-'}</span></td>
                                        <td>${item.status || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="mt-4">
                    <p><strong>File <code>reload.js</code> siap untuk:</strong></p>
                    <ol class="mt-2" style="padding-left: 20px;">
                        <li>Diunggah ke repository GitHub untuk sinkronisasi</li>
                        <li>Direstore melalui menu <strong>Backup & Restore</strong></li>
                        <li>Digunakan untuk memperbarui data di sistem lain</li>
                    </ol>
                </div>
                
                <div class="d-grid gap-2 mt-4">
                    <button class="converter-btn converter-btn-primary" onclick="downloadReloadJs('${reloadJsContent.replace(/'/g, "\\'")}')">
                        <i class="fas fa-download me-2"></i>Download reload.js
                    </button>
                    <button class="converter-btn converter-btn-secondary" onclick="copyToClipboard('${reloadJsContent.replace(/'/g, "\\'")}')">
                        <i class="fas fa-copy me-2"></i>Salin ke Clipboard
                    </button>
                </div>
            `;
            
            result.classList.add('active');
            loading.classList.remove('active');
            showConverterStatus(`✅ ${validatedData.length} data berhasil dikonversi ke format reload.js`, 'success');
            
        } catch (error) {
            console.error('Konversi error:', error);
            resultContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-times-circle me-2"></i>
                    <strong>Konversi Gagal!</strong><br>
                    ${error.message}
                </div>
            `;
            result.classList.add('active');
            loading.classList.remove('active');
            showConverterStatus(`❌ ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        loading.classList.remove('active');
        showConverterStatus('Gagal membaca file Excel', 'error');
    };
    
    reader.readAsArrayBuffer(file);
}

/**
 * Download template Excel
 */
function downloadTemplate() {
    try {
        // Buat template Excel
        const templateData = [
            {
                'nama': 'CONTOH: Ahmad Susanto',
                'nik': 'CONTOH: 3501010101010001',
                'whatsapp': 'CONTOH: 081234567890',
                'profesi': 'CONTOH: Nelayan Penuh Waktu',
                'status': 'CONTOH: Pemilik Kapal',
                'tahunLahir': 'CONTOH: 1985',
                'kecamatan': 'CONTOH: Panarukan',
                'desa': 'CONTOH: Kilensari',
                'alatTangkap': 'CONTOH: Pukat Cincin',
                'namaKapal': 'CONTOH: Jaya Abadi 01',
                'jenisKapal': 'CONTOH: Perahu Jukung',
                'jenisIkan': 'CONTOH: Ikan Tongkol, Ikan Kembung',
                'usahaSampingan': 'CONTOH: Warung Kelontong',
                'tanggalValidasi': 'CONTOH: 2025-01-15',
                'validator': 'CONTOH: Petugas Lapangan',
                'keterangan': 'CONTOH: Data lengkap'
            }
        ];
        
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        
        // Tambahkan sheet petunjuk
        const instructions = [
            ['PANDUAN PENGISIAN TEMPLATE EXCEL'],
            [''],
            ['1. Kolom wajib diisi:', 'nama, nik, whatsapp, profesi, status, tahunLahir, kecamatan, desa, alatTangkap'],
            ['2. Kolom opsional:', 'namaKapal, jenisKapal, jenisIkan, usahaSampingan, tanggalValidasi, validator, keterangan'],
            ['3. Format tanggal:', 'YYYY-MM-DD (contoh: 2025-01-15)'],
            ['4. Pilihan profesi:', 'Nelayan Penuh Waktu, Nelayan Sambilan Utama, Nelayan Sambilan Tambahan'],
            ['5. Pilihan status:', 'Pemilik Kapal, Anak Buah Kapal'],
            ['6. NIK harus 16 digit angka'],
            ['7. Jenis ikan pisahkan dengan koma'],
            [''],
            ['CATATAN:', 'Hapus baris contoh sebelum mengisi data asli']
        ];
        
        const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
        XLSX.utils.book_append_sheet(workbook, instructionSheet, "Petunjuk");
        
        // Generate file
        XLSX.writeFile(workbook, 'Template_Impor_Data_SIMATA.xlsx');
        
        showConverterStatus('✅ Template Excel berhasil didownload', 'success');
        
    } catch (error) {
        console.error('Error creating template:', error);
        showConverterStatus('❌ Gagal membuat template', 'error');
    }
}

/**
 * Impor Excel ke sistem
 */
function importExcelToSystem() {
    const fileInput = document.getElementById('importFileInput');
    
    if (!fileInput.files.length) {
        showConverterStatus('Pilih file Excel terlebih dahulu!', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
                throw new Error('File Excel tidak berisi data');
            }
            
            // Validasi dan konversi data
            const validatedData = validateAndConvertExcelData(jsonData);
            
            // Tampilkan modal konfirmasi
            showImportConfirmation(validatedData);
            
        } catch (error) {
            console.error('Import error:', error);
            showConverterStatus(`❌ ${error.message}`, 'error');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

/**
 * Tampilkan modal konfirmasi impor
 */
function showImportConfirmation(data) {
    const modal = document.getElementById('confirmModal');
    const stats = document.getElementById('confirmStats');
    
    // Hitung statistik
    const totalData = data.length;
    const pemilikKapal = data.filter(d => d.status === 'Pemilik Kapal').length;
    const penuhWaktu = data.filter(d => d.profesi === 'Nelayan Penuh Waktu').length;
    const sambilanUtama = data.filter(d => d.profesi === 'Nelayan Sambilan Utama').length;
    const sambilanTambahan = data.filter(d => d.profesi === 'Nelayan Sambilan Tambahan').length;
    
    stats.innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${totalData}</div>
            <div class="stat-label">Total Data</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${pemilikKapal}</div>
            <div class="stat-label">Pemilik Kapal</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${penuhWaktu}</div>
            <div class="stat-label">Penuh Waktu</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${sambilanUtama + sambilanTambahan}</div>
            <div class="stat-label">Sambilan</div>
        </div>
    `;
    
    // Simpan data untuk diproses nanti
    window.importData = data;
    
    modal.classList.add('active');
}

/**
 * Proses impor data ke sistem
 */
function processImport() {
    const modal = document.getElementById('confirmModal');
    const loading = document.getElementById('converterLoading');
    
    if (!window.importData || window.importData.length === 0) {
        showConverterStatus('Tidak ada data untuk diimpor', 'error');
        return;
    }
    
    modal.classList.remove('active');
    loading.classList.add('active');
    
    try {
        // Dapatkan appData dari localStorage (sama seperti di index.html)
        const existingData = JSON.parse(localStorage.getItem('nelayanData') || '[]');
        
        // Data yang akan diimpor
        const newData = window.importData;
        
        // Cek duplikasi berdasarkan NIK
        const existingNiks = new Set(existingData.map(d => d.nik));
        const duplicateNiks = new Set();
        
        // Filter data baru, timpa jika NIK sudah ada
        const mergedData = [...existingData];
        let added = 0;
        let updated = 0;
        
        newData.forEach(newItem => {
            const existingIndex = mergedData.findIndex(d => d.nik === newItem.nik);
            
            if (existingIndex >= 0) {
                // Timpa data yang sudah ada
                mergedData[existingIndex] = {
                    ...mergedData[existingIndex],
                    ...newItem,
                    id: mergedData[existingIndex].id // Pertahankan ID yang ada
                };
                updated++;
                duplicateNiks.add(newItem.nik);
            } else {
                // Tambah data baru
                mergedData.push({
                    ...newItem,
                    id: Date.now() + Math.random() // Generate ID baru
                });
                added++;
            }
        });
        
        // Simpan ke localStorage
        localStorage.setItem('nelayanData', JSON.stringify(mergedData));
        
        // Update UI di index.html jika fungsi tersedia
        if (typeof window.renderDataTable === 'function') {
            window.renderDataTable();
        }
        
        if (typeof window.updateDashboard === 'function') {
            window.updateDashboard();
        }
        
        // Tampilkan hasil
        const result = document.getElementById('converterResult');
        const resultContent = document.getElementById('resultContent');
        
        resultContent.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>
                <strong>Impor Data Berhasil!</strong><br>
                <div class="mt-2">
                    <div><strong>Data Baru:</strong> ${added} records ditambahkan</div>
                    <div><strong>Data Diperbarui:</strong> ${updated} records diperbarui</div>
                    <div><strong>Total Data Sistem:</strong> ${mergedData.length} records</div>
                    <div><strong>Duplikasi Ditemukan:</strong> ${duplicateNiks.size} NIK</div>
                </div>
            </div>
            
            <div class="alert ${duplicateNiks.size > 0 ? 'alert-warning' : 'alert-info'}">
                <i class="fas fa-info-circle me-2"></i>
                ${duplicateNiks.size > 0 
                    ? `Data dengan NIK yang sudah ada (${duplicateNiks.size} records) telah diperbarui.` 
                    : 'Semua data berhasil ditambahkan tanpa duplikasi.'}
            </div>
            
            <div class="mt-3">
                <p><strong>Langkah selanjutnya:</strong></p>
                <ol style="padding-left: 20px;">
                    <li>Periksa data di menu <strong>Data Nelayan</strong></li>
                    <li>Lengkapi data yang masih kosong melalui menu <strong>Edit Data</strong></li>
                    <li>Validasi data melalui menu <strong>Filter & Validasi</strong></li>
                    ${duplicateNiks.size > 0 ? '<li>Cek data duplikasi di menu <strong>Filter & Validasi</strong> → <strong>Cek Data Ganda</strong></li>' : ''}
                </ol>
            </div>
            
            <div class="d-grid gap-2 mt-4">
                <button class="converter-btn converter-btn-primary" onclick="goToDataTab()">
                    <i class="fas fa-database me-2"></i>Lihat Data Nelayan
                </button>
                <button class="converter-btn converter-btn-secondary" onclick="goToFilterTab()">
                    <i class="fas fa-filter me-2"></i>Cek Data Ganda
                </button>
            </div>
        `;
        
        result.classList.add('active');
        loading.classList.remove('active');
        
        showConverterStatus(`✅ ${added + updated} data berhasil diimpor ke sistem`, 'success');
        
        // Reset form
        document.getElementById('importFileInput').value = '';
        document.getElementById('importExcelBtn').disabled = true;
        
    } catch (error) {
        console.error('Process import error:', error);
        loading.classList.remove('active');
        showConverterStatus(`❌ Gagal mengimpor data: ${error.message}`, 'error');
    }
}

/**
 * Validasi dan konversi data Excel
 */
function validateAndConvertExcelData(excelData) {
    const convertedData = [];
    const errors = [];
    
    excelData.forEach((row, index) => {
        try {
            // Skip jika row kosong
            if (!row.nik && !row.nama) {
                return;
            }
            
            // Generate ID jika tidak ada
            const id = row.id || Date.now() + index + Math.random();
            
            // Hitung usia dari tahun lahir
            const tahunLahir = parseInt(row.tahunLahir) || 1980;
            const currentYear = new Date().getFullYear();
            const usia = currentYear - tahunLahir;
            
            // Default values
            const convertedRow = {
                id: id,
                nama: String(row.nama || ''),
                nik: String(row.nik || ''),
                whatsapp: String(row.whatsapp || row['no hp'] || row.telp || '00000000'),
                profesi: row.profesi || 'Nelayan Penuh Waktu',
                status: row.status || 'Anak Buah Kapal',
                tahunLahir: tahunLahir,
                usia: usia,
                kecamatan: row.kecamatan || '',
                desa: row.desa || '',
                alatTangkap: row.alatTangkap || row.API || 'Pancing',
                namaKapal: row.namaKapal || '',
                jenisKapal: row.jenisKapal || '',
                jenisIkan: row.jenisIkan || row.ikan || '',
                usahaSampingan: row.usahaSampingan || '',
                tanggalValidasi: row.tanggalValidasi || new Date().toISOString().split('T')[0],
                validator: row.validator || 'System Import',
                driveLink: row.driveLink || '',
                kodeValidasi: row.kodeValidasi || `IMP-${Date.now().toString(36).toUpperCase()}`,
                keterangan: row.keterangan || `Diimpor pada ${new Date().toLocaleString('id-ID')}`
            };
            
            // Validasi NIK
            if (convertedRow.nik.length !== 16 && convertedRow.nik !== 'CONTOH: 3501010101010001') {
                errors.push(`Baris ${index + 2}: NIK ${convertedRow.nik} harus 16 digit`);
            }
            
            convertedData.push(convertedRow);
            
        } catch (error) {
            errors.push(`Baris ${index + 2}: ${error.message}`);
        }
    });
    
    if (errors.length > 0 && convertedData.length === 0) {
        throw new Error(`Validasi gagal: ${errors.slice(0, 3).join(', ')}...`);
    }
    
    if (errors.length > 0) {
        console.warn('Peringatan validasi:', errors);
    }
    
    return convertedData;
}

/**
 * Download file reload.js
 */
function downloadReloadJs(content) {
    try {
        const blob = new Blob([content], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reload_${Date.now()}.js`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showConverterStatus('✅ File reload.js berhasil didownload', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showConverterStatus('❌ Gagal mendownload file', 'error');
    }
}

/**
 * Copy ke clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showConverterStatus('✅ Teks berhasil disalin ke clipboard', 'success');
    }).catch(err => {
        showConverterStatus('❌ Gagal menyalin ke clipboard', 'error');
    });
}

/**
 * Clear konverter
 */
function clearConverter() {
    document.getElementById('excelFileInput').value = '';
    document.getElementById('importFileInput').value = '';
    document.getElementById('convertExcelBtn').disabled = true;
    document.getElementById('importExcelBtn').disabled = true;
    document.getElementById('converterResult').classList.remove('active');
    
    showConverterStatus('<i class="fas fa-info-circle"></i> Konverter siap digunakan', 'info');
}

/**
 * Close hasil
 */
function closeResult() {
    document.getElementById('converterResult').classList.remove('active');
}

/**
 * Close modal konfirmasi
 */
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    delete window.importData;
}

/**
 * Show status konverter
 */
function showConverterStatus(message, type = 'info') {
    const status = document.getElementById('converterStatus');
    let icon = 'info-circle';
    
    switch(type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'times-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
    }
    
    status.className = `converter-status ${type}`;
    status.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
}

/**
 * Navigasi ke tab Data
 */
function goToDataTab() {
    const dataTab = document.getElementById('v-pills-data-tab');
    if (dataTab) {
        dataTab.click();
    }
}

/**
 * Navigasi ke tab Filter
 */
function goToFilterTab() {
    const filterTab = document.getElementById('v-pills-filter-tab');
    if (filterTab) {
        filterTab.click();
        // Trigger cek data ganda setelah 500ms
        setTimeout(() => {
            const cekGandaBtn = document.getElementById('btnCekGanda');
            if (cekGandaBtn) {
                cekGandaBtn.click();
            }
        }, 500);
    }
}

/**
 * Get badge class untuk profesi
 */
function getProfesiBadgeClass(profesi) {
    switch(profesi) {
        case 'Nelayan Penuh Waktu':
            return 'badge-profesi-penuh';
        case 'Nelayan Sambilan Utama':
            return 'badge-profesi-sambilan-utama';
        case 'Nelayan Sambilan Tambahan':
            return 'badge-profesi-sambilan-tambahan';
        default:
            return 'bg-secondary';
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initConverter();
    createImportDataTab();
    
    // Ekspor fungsi ke global scope
    window.convertExcelToReload = convertExcelToReload;
    window.importExcelToSystem = importExcelToSystem;
    window.downloadTemplate = downloadTemplate;
    window.clearConverter = clearConverter;
    window.processImport = processImport;
    window.closeConfirmModal = closeConfirmModal;
    window.handleExcelFileSelect = handleExcelFileSelect;
    window.handleImportFileSelect = handleImportFileSelect;
    
    console.log('✅ SIMATA Convert Data Tool v2.0 loaded successfully');
});