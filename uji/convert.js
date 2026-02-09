/**
 * SIMATA CONVERT DATA TOOL - VERSI DISEMPURNAKAN
 * Konversi data antara format Excel (.xlsx) dan reload.js dengan fitur Impor Data Cepat
 * Developer: Dinas Perikanan Kabupaten Situbondo
 * Version: 2.2 - Support Field Alamat Lengkap
 * Fixed Version: GitHub Compatible
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
    max-width: 600px;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin: 20px 0;
}

.stat-box {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e9ecef;
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
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
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

/* Badge untuk status data */
.data-status-badge {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 10px;
    margin-left: 5px;
}

.badge-lengkap {
    background-color: #d4edda;
    color: #155724;
}

.badge-tidak-lengkap {
    background-color: #fff3cd;
    color: #856404;
}

.badge-ganda {
    background-color: #f8d7da;
    color: #721c24;
}

/* Alert khusus */
.alert-data-tidak-lengkap {
    background-color: #fff3cd;
    border-color: #ffeaa7;
    color: #856404;
}

.alert-data-ganda {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
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
                        <strong>Perhatian:</strong><br>
                        1. Data dengan NIK yang sudah ada akan ditimpa<br>
                        2. Data baru akan ditambahkan ke sistem<br>
                        3. Data tidak lengkap akan ditandai dan bisa dilengkapi via menu Edit Data<br>
                        4. Data ganda akan ditandai dan harus diperbaiki
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
            if (typeof XLSX === 'undefined') {
                console.error('XLSX library tidak tersedia');
                return;
            }
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
            if (typeof XLSX === 'undefined') {
                console.error('XLSX library tidak tersedia');
                return;
            }
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
            if (typeof XLSX === 'undefined') {
                throw new Error('XLSX library tidak tersedia. Pastikan library xlsx telah dimuat.');
            }
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
            const incompleteCount = validatedData.filter(d => !d.isComplete).length;
            const duplicateNiks = getDuplicateNiks(validatedData);
            
            resultContent.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>Konversi Berhasil!</strong><br>
                    <div class="mt-2">
                        <div><strong>File Input:</strong> ${file.name}</div>
                        <div><strong>Total Data:</strong> ${validatedData.length} records</div>
                        <div><strong>Data Lengkap:</strong> ${validatedData.length - incompleteCount} records</div>
                        <div><strong>Data Tidak Lengkap:</strong> ${incompleteCount} records</div>
                        <div><strong>Potensi Duplikasi:</strong> ${duplicateNiks.size} NIK</div>
                        <div><strong>Waktu:</strong> ${new Date().toLocaleTimeString('id-ID')}</div>
                    </div>
                </div>
                
                ${incompleteCount > 0 ? `
                <div class="alert alert-data-tidak-lengkap">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Data Tidak Lengkap Ditemukan:</strong> ${incompleteCount} data memerlukan pelengkapan.
                    Data ini akan tetap diimpor tetapi ditandai khusus di database.
                </div>
                ` : ''}
                
                ${duplicateNiks.size > 0 ? `
                <div class="alert alert-data-ganda">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <strong>Potensi Data Ganda:</strong> ${duplicateNiks.size} NIK memiliki data ganda.
                    Harap periksa dan hapus duplikasi setelah impor.
                </div>
                ` : ''}
                
                <div class="data-preview">
                    <h5><i class="fas fa-table me-2"></i>Preview Data (5 baris pertama):</h5>
                    <div class="table-responsive">
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Alamat</th>
                                    <th>NIK</th>
                                    <th>Profesi</th>
                                    <th>Status</th>
                                    <th>Kelengkapan</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${validatedData.slice(0, 5).map((item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.nama || '-'}</td>
                                        <td>${item.alamat ? (item.alamat.length > 30 ? item.alamat.substring(0, 30) + '...' : item.alamat) : '-'}</td>
                                        <td>${item.nik ? item.nik.substring(0, 8) + '****' : '-'}</td>
                                        <td><span class="badge ${getProfesiBadgeClass(item.profesi)}">${item.profesi || '-'}</span></td>
                                        <td>${item.status || '-'}</td>
                                        <td>
                                            ${item.isComplete ? 
                                                '<span class="data-status-badge badge-lengkap">Lengkap</span>' : 
                                                '<span class="data-status-badge badge-tidak-lengkap">Tidak Lengkap</span>'
                                            }
                                            ${duplicateNiks.has(item.nik) ? 
                                                '<span class="data-status-badge badge-ganda">Ganda</span>' : 
                                                ''
                                            }
                                        </td>
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
                        <li>Diimpor melalui <strong>Impor Data Cepat</strong> di tab ini</li>
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
        if (typeof XLSX === 'undefined') {
            throw new Error('XLSX library tidak tersedia. Pastikan library xlsx telah dimuat.');
        }
        
        // Buat template Excel dengan kolom alamat
        const templateData = [
            {
                'nama': 'CONTOH: Ahmad Susanto',
                'nik': 'CONTOH: 3501010101010001',
                'whatsapp': 'CONTOH: 081234567890',
                'alamat': 'CONTOH: Jl. Raya Situbondo No. 123, RT 01 RW 02, Dusun Krajan',
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
            },
            {
                'nama': 'CONTOH: Budi Santoso',
                'nik': '3501010101010002',
                'whatsapp': '081234567891',
                'alamat': 'Jl. Raya Panarukan No. 45, RT 03 RW 01, Dusun Sumberejo',
                'profesi': 'Nelayan Sambilan Utama',
                'status': 'Anak Buah Kapal',
                'tahunLahir': '1990',
                'kecamatan': 'Panarukan',
                'desa': 'Kilensari',
                'alatTangkap': 'Pancing',
                'namaKapal': '',
                'jenisKapal': '',
                'jenisIkan': 'Ikan Tongkol',
                'usahaSampingan': '',
                'tanggalValidasi': '2025-01-15',
                'validator': 'Petugas Lapangan',
                'keterangan': ''
            }
        ];
        
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        
        // Tambahkan sheet petunjuk
        const instructions = [
            ['PANDUAN PENGISIAN TEMPLATE EXCEL UNTUK IMPOR DATA SIMATA'],
            [''],
            ['KOLOM WAJIB (harus diisi):', ''],
            ['1. nama', 'Nama lengkap sesuai KTP'],
            ['2. nik', '16 digit NIK (contoh: 3501010101010001)'],
            ['3. whatsapp', 'Nomor handphone aktif (contoh: 081234567890)'],
            ['4. alamat', 'Alamat lengkap (contoh: Jl. Raya Situbondo No. 123, RT 01 RW 02, Dusun Krajan)'],
            ['5. profesi', 'Pilihan: Nelayan Penuh Waktu, Nelayan Sambilan Utama, Nelayan Sambilan Tambahan'],
            ['6. status', 'Pilihan: Pemilik Kapal, Anak Buah Kapal'],
            ['7. tahunLahir', 'Tahun lahir (contoh: 1985)'],
            ['8. kecamatan', 'Nama kecamatan (sesuai daftar)'],
            ['9. desa', 'Nama desa/kelurahan (sesuai daftar)'],
            ['10. alatTangkap', 'Alat Penangkapan Ikan (contoh: Pukat Cincin, Pancing, dll)'],
            ['11. jenisIkan', 'Jenis ikan yang ditangkap, pisahkan dengan koma (contoh: Ikan Tongkol, Ikan Kembung)'],
            [''],
            ['KOLOM OPSIONAL (bisa dikosongkan):', ''],
            ['12. namaKapal', 'Nama kapal (hanya untuk Pemilik Kapal)'],
            ['13. jenisKapal', 'Jenis kapal (contoh: Perahu Jukung, Perahu Mayang, dll)'],
            ['14. usahaSampingan', 'Usaha sampingan (contoh: Warung, Ternak)'],
            ['15. tanggalValidasi', 'Format: YYYY-MM-DD (contoh: 2025-01-15)'],
            ['16. validator', 'Nama petugas validator'],
            ['17. keterangan', 'Keterangan tambahan'],
            [''],
            ['CATATAN PENTING:', ''],
            ['- Hapus baris contoh (baris 1 dan 2) sebelum mengisi data asli'],
            ['- Data yang tidak lengkap tetap bisa diimpor, tetapi akan ditandai khusus'],
            ['- NIK ganda akan ditimpa dengan data terbaru'],
            ['- Pastikan format tanggal sesuai YYYY-MM-DD'],
            ['- NIK harus 16 digit angka'],
            ['- Kolom profesi dan status harus sesuai pilihan yang tersedia'],
            ['- Kolom alamat harus diisi dengan alamat lengkap (jalan, RT/RW, dusun)'],
            [''],
            ['SETELAH PENGISIAN:', ''],
            ['1. Simpan file Excel'],
            ['2. Kembali ke tab Impor Data'],
            ['3. Gunakan fitur "Impor Data Cepat" untuk memasukkan data ke sistem']
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
            if (typeof XLSX === 'undefined') {
                throw new Error('XLSX library tidak tersedia. Pastikan library xlsx telah dimuat.');
            }
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
    const abk = data.filter(d => d.status === 'Anak Buah Kapal').length;
    
    // Hitung data tidak lengkap
    const incompleteData = data.filter(d => !d.isComplete).length;
    
    // Hitung data dengan alamat lengkap
    const alamatLengkap = data.filter(d => d.alamat && d.alamat.trim().length > 10).length;
    
    // Hitung duplikasi NIK dalam data yang akan diimpor
    const duplicateInImport = getDuplicateNiks(data).size;
    
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
            <div class="stat-value">${abk}</div>
            <div class="stat-label">Anak Buah Kapal</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${penuhWaktu}</div>
            <div class="stat-label">Penuh Waktu</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${alamatLengkap}</div>
            <div class="stat-label">Alamat Lengkap</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${incompleteData}</div>
            <div class="stat-label">Tidak Lengkap</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${duplicateInImport}</div>
            <div class="stat-label">Duplikasi NIK</div>
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
        const updatedData = [];
        
        // Filter data baru, timpa jika NIK sudah ada
        const mergedData = [...existingData];
        let added = 0;
        let updated = 0;
        let incompleteCount = 0;
        let alamatKosong = 0;
        
        newData.forEach(newItem => {
            // Hitung data tidak lengkap
            if (!newItem.isComplete) {
                incompleteCount++;
            }
            
            // Hitung data dengan alamat kosong
            if (!newItem.alamat || newItem.alamat.trim().length < 5) {
                alamatKosong++;
            }
            
            const existingIndex = mergedData.findIndex(d => d.nik === newItem.nik);
            
            if (existingIndex >= 0) {
                // Timpa data yang sudah ada
                mergedData[existingIndex] = {
                    ...mergedData[existingIndex],
                    ...newItem,
                    id: mergedData[existingIndex].id, // Pertahankan ID yang ada
                    updatedAt: new Date().toISOString(),
                    updatedBy: 'System Import'
                };
                updated++;
                duplicateNiks.add(newItem.nik);
                updatedData.push(newItem);
            } else {
                // Tambah data baru
                mergedData.push({
                    ...newItem,
                    id: Date.now() + Math.random(), // Generate ID baru
                    createdAt: new Date().toISOString(),
                    createdBy: 'System Import'
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
                    <div><strong>Data Tidak Lengkap:</strong> ${incompleteCount} records</div>
                    <div><strong>Alamat Kosong/Kurang Lengkap:</strong> ${alamatKosong} records</div>
                </div>
            </div>
            
            ${incompleteCount > 0 ? `
            <div class="alert alert-data-tidak-lengkap">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Data Tidak Lengkap:</strong> ${incompleteCount} data memerlukan pelengkapan.
                <ul class="mt-2 mb-1">
                    <li>Data yang tidak lengkap akan ditandai dengan <span class="badge bg-warning">warna kuning</span> di tabel</li>
                    <li>Lengkapi data melalui menu <strong>Edit Data</strong></li>
                    <li>Sistem akan terus mengingatkan hingga data lengkap</li>
                </ul>
            </div>
            ` : ''}
            
            ${alamatKosong > 0 ? `
            <div class="alert alert-warning">
                <i class="fas fa-home me-2"></i>
                <strong>Data Alamat Tidak Lengkap:</strong> ${alamatKosong} data memiliki alamat yang kosong atau kurang lengkap.
                <ul class="mt-2 mb-1">
                    <li>Alamat lengkap diperlukan untuk pemetaan dan validasi data</li>
                    <li>Lengkapi alamat melalui menu <strong>Edit Data</strong></li>
                    <li>Format alamat: Jalan, RT/RW, Dusun, Nomor Rumah</li>
                </ul>
            </div>
            ` : ''}
            
            ${duplicateNiks.size > 0 ? `
            <div class="alert alert-data-ganda">
                <i class="fas fa-exclamation-circle me-2"></i>
                <strong>Data Ganda Ditemukan:</strong> ${duplicateNiks.size} NIK memiliki data ganda.
                <ul class="mt-2 mb-1">
                    <li>Data ganda akan ditandai dengan <span class="badge bg-danger">warna merah</span> di tabel</li>
                    <li>Periksa dan hapus duplikasi melalui menu <strong>Filter & Validasi</strong> → <strong>Cek Data Ganda</strong></li>
                    <li>Hapus atau edit salah satu data ganda</li>
                </ul>
            </div>
            ` : ''}
            
            <div class="mt-3">
                <p><strong>Langkah selanjutnya:</strong></p>
                <ol style="padding-left: 20px;">
                    <li>Periksa data di menu <strong>Data Nelayan</strong></li>
                    ${incompleteCount > 0 ? '<li>Lengkapi data yang masih kosong melalui menu <strong>Edit Data</strong></li>' : ''}
                    ${alamatKosong > 0 ? '<li>Lengkapi alamat melalui menu <strong>Edit Data</strong></li>' : ''}
                    ${duplicateNiks.size > 0 ? '<li>Cek data duplikasi di menu <strong>Filter & Validasi</strong> → <strong>Cek Data Ganda</strong></li>' : ''}
                    <li>Validasi data melalui menu <strong>Filter & Validasi</strong></li>
                    <li>Cetak ID Card untuk data yang sudah lengkap</li>
                </ol>
            </div>
            
            <div class="d-grid gap-2 mt-4">
                <button class="converter-btn converter-btn-primary" onclick="goToDataTab()">
                    <i class="fas fa-database me-2"></i>Lihat Data Nelayan
                </button>
                ${incompleteCount > 0 ? `
                <button class="converter-btn converter-btn-warning" onclick="showIncompleteData()">
                    <i class="fas fa-exclamation-triangle me-2"></i>Lihat Data Tidak Lengkap
                </button>
                ` : ''}
                ${duplicateNiks.size > 0 ? `
                <button class="converter-btn converter-btn-danger" onclick="goToFilterTab()">
                    <i class="fas fa-filter me-2"></i>Cek Data Ganda
                </button>
                ` : ''}
            </div>
        `;
        
        result.classList.add('active');
        loading.classList.remove('active');
        
        // Simpan notifikasi untuk data tidak lengkap
        if (incompleteCount > 0) {
            localStorage.setItem('simata_incomplete_data', 'true');
            localStorage.setItem('simata_incomplete_count', incompleteCount.toString());
        }
        
        // Simpan notifikasi untuk data alamat tidak lengkap
        if (alamatKosong > 0) {
            localStorage.setItem('simata_alamat_kosong', 'true');
            localStorage.setItem('simata_alamat_kosong_count', alamatKosong.toString());
        }
        
        // Simpan notifikasi untuk data ganda
        if (duplicateNiks.size > 0) {
            localStorage.setItem('simata_duplicate_data', 'true');
            localStorage.setItem('simata_duplicate_count', duplicateNiks.size.toString());
        }
        
        showConverterStatus(`✅ ${added + updated} data berhasil diimpor ke sistem`, 'success');
        
        // Reset form
        document.getElementById('importFileInput').value = '';
        document.getElementById('importExcelBtn').disabled = true;
        
        // Tampilkan notifikasi global
        setTimeout(() => {
            if (typeof window.showNotification === 'function') {
                if (incompleteCount > 0) {
                    window.showNotification(`⚠️ ${incompleteCount} data tidak lengkap. Harap lengkapi melalui menu Edit Data.`, 'warning');
                }
                if (alamatKosong > 0) {
                    window.showNotification(`🏠 ${alamatKosong} data memiliki alamat tidak lengkap. Harap lengkapi alamat melalui menu Edit Data.`, 'warning');
                }
                if (duplicateNiks.size > 0) {
                    window.showNotification(`⚠️ ${duplicateNiks.size} data duplikasi ditemukan. Harap periksa di menu Filter & Validasi.`, 'error');
                }
            }
        }, 1000);
        
    } catch (error) {
        console.error('Process import error:', error);
        loading.classList.remove('active');
        showConverterStatus(`❌ Gagal mengimpor data: ${error.message}`, 'error');
    }
}

/**
 * Validasi dan konversi data Excel - DIPERBARUI untuk support field alamat
 */
function validateAndConvertExcelData(excelData) {
    const convertedData = [];
    const errors = [];
    const warnings = [];
    
    // Kolom wajib untuk data lengkap - DITAMBAHKAN alamat
    const requiredFields = ['nama', 'nik', 'whatsapp', 'alamat', 'profesi', 'status', 'tahunLahir', 'kecamatan', 'desa', 'alatTangkap'];
    
    excelData.forEach((row, index) => {
        try {
            // Skip jika row kosong atau baris contoh
            if ((!row.nik && !row.nama) || 
                (row.nik && row.nik.toString().includes('CONTOH')) ||
                (row.nama && row.nama.toString().includes('CONTOH'))) {
                return;
            }
            
            // Generate ID jika tidak ada
            const id = row.id || Date.now() + index + Math.random();
            
            // Hitung usia dari tahun lahir
            const tahunLahir = parseInt(row.tahunLahir) || 1980;
            const currentYear = new Date().getFullYear();
            const usia = currentYear - tahunLahir;
            
            // Validasi NIK
            const nik = String(row.nik || '').trim();
            if (nik && nik.length !== 16 && !isNaN(nik)) {
                warnings.push(`Baris ${index + 2}: NIK ${nik} harus 16 digit`);
            }
            
            // Validasi WhatsApp
            const whatsapp = String(row.whatsapp || row['no hp'] || row.telp || '').trim();
            
            // Validasi profesi
            const validProfesi = ['Nelayan Penuh Waktu', 'Nelayan Sambilan Utama', 'Nelayan Sambilan Tambahan'];
            const profesi = row.profesi || 'Nelayan Penuh Waktu';
            if (!validProfesi.includes(profesi)) {
                warnings.push(`Baris ${index + 2}: Profesi "${profesi}" tidak valid, diubah menjadi "Nelayan Penuh Waktu"`);
            }
            
            // Validasi status
            const validStatus = ['Pemilik Kapal', 'Anak Buah Kapal'];
            const status = row.status || 'Anak Buah Kapal';
            if (!validStatus.includes(status)) {
                warnings.push(`Baris ${index + 2}: Status "${status}" tidak valid, diubah menjadi "Anak Buah Kapal"`);
            }
            
            // Default values dengan DUKUNGAN ALAMAT
            const convertedRow = {
                id: id,
                nama: String(row.nama || '').trim(),
                nik: nik,
                whatsapp: whatsapp || '00000000',
                profesi: validProfesi.includes(profesi) ? profesi : 'Nelayan Penuh Waktu',
                status: validStatus.includes(status) ? status : 'Anak Buah Kapal',
                tahunLahir: tahunLahir,
                usia: usia,
                kecamatan: String(row.kecamatan || '').trim(),
                desa: String(row.desa || '').trim(),
                alamat: String(row.alamat || row['alamat lengkap'] || row.address || '').trim(), // DUKUNGAN ALAMAT
                alatTangkap: String(row.alatTangkap || row.API || 'Pancing').trim(),
                namaKapal: String(row.namaKapal || '').trim(),
                jenisKapal: String(row.jenisKapal || '').trim(),
                jenisIkan: String(row.jenisIkan || row.ikan || '').trim(),
                usahaSampingan: String(row.usahaSampingan || '').trim(),
                tanggalValidasi: row.tanggalValidasi || new Date().toISOString().split('T')[0],
                validator: String(row.validator || 'System Import').trim(),
                driveLink: String(row.driveLink || '').trim(),
                kodeValidasi: row.kodeValidasi || `IMP-${Date.now().toString(36).toUpperCase()}`,
                keterangan: String(row.keterangan || `Diimpor pada ${new Date().toLocaleString('id-ID')}`).trim(),
                importDate: new Date().toISOString()
            };
            
            // Cek kolom wajib untuk kelengkapan data - DITAMBAHKAN validasi alamat
            const missingFields = [];
            requiredFields.forEach(field => {
                const value = convertedRow[field];
                if (!value || value.toString().trim() === '' || 
                    (field === 'whatsapp' && value === '00000000') ||
                    (field === 'tahunLahir' && (value < 1900 || value > currentYear)) ||
                    (field === 'alamat' && value.trim().length < 5)) { // Validasi alamat minimal 5 karakter
                    missingFields.push(field);
                }
            });
            
            // Cek jenis ikan (wajib minimal satu)
            if (!convertedRow.jenisIkan || convertedRow.jenisIkan.trim() === '') {
                missingFields.push('jenisIkan');
            }
            
            // Tandai kelengkapan data
            convertedRow.missingFields = missingFields;
            convertedRow.isComplete = missingFields.length === 0;
            
            // Tambahkan pesan warning jika ada field yang tidak lengkap
            if (missingFields.length > 0) {
                convertedRow.keterangan += ` | Data tidak lengkap: ${missingFields.join(', ')}`;
            }
            
            // Tambahkan pesan khusus untuk alamat tidak lengkap
            if (!convertedRow.alamat || convertedRow.alamat.trim().length < 5) {
                convertedRow.keterangan += ` | Alamat tidak lengkap`;
            }
            
            convertedData.push(convertedRow);
            
        } catch (error) {
            errors.push(`Baris ${index + 2}: ${error.message}`);
        }
    });
    
    if (errors.length > 0 && convertedData.length === 0) {
        throw new Error(`Validasi gagal: ${errors.slice(0, 3).join(', ')}...`);
    }
    
    if (warnings.length > 0) {
        console.warn('Peringatan validasi:', warnings);
    }
    
    if (errors.length > 0) {
        console.error('Errors validasi:', errors);
    }
    
    return convertedData;
}

/**
 * Get duplicate NIKs from data
 */
function getDuplicateNiks(data) {
    const nikCounts = {};
    const duplicateNiks = new Set();
    
    data.forEach(d => {
        if (d.nik) {
            nikCounts[d.nik] = (nikCounts[d.nik] || 0) + 1;
            if (nikCounts[d.nik] > 1) {
                duplicateNiks.add(d.nik);
            }
        }
    });
    
    return duplicateNiks;
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
 * Show incomplete data
 */
function showIncompleteData() {
    const dataTab = document.getElementById('v-pills-data-tab');
    if (dataTab) {
        dataTab.click();
        
        // Set filter untuk menampilkan data tidak lengkap
        setTimeout(() => {
            const searchInput = document.getElementById('searchData');
            if (searchInput) {
                searchInput.value = '[TIDAK LENGKAP]';
                searchInput.dispatchEvent(new Event('input'));
                
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Menampilkan data yang tidak lengkap. Data ditandai dengan warna kuning.', 'info');
                }
            }
        }, 300);
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
    // Pastikan XLSX library tersedia
    if (typeof XLSX === 'undefined') {
        console.warn('XLSX library belum dimuat. Pastikan script xlsx.full.min.js sudah dimuat sebelum convert.js');
    }
    
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
    window.showIncompleteData = showIncompleteData;
    
    console.log('✅ SIMATA Convert Data Tool v2.2 loaded successfully (Support Field Alamat)');
});
