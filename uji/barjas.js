// barjas.js - Sistem Bantuan Nelayan Kab. Situbondo - VERSI TERINTEGRASI
// Versi 3.3 - Fixed Edition (All Functions Working)
// Tanggal: 2025
// Developer: Dinas Perikanan Kabupaten Situbondo

(function() {
    'use strict';

    // --- CEK APAKAH SUDAH ADA SISTEM BARJAS YANG BERJALAN ---
    if (window.BARJAS_INITIALIZED) {
        console.warn('Sistem BARJAS sudah diinisialisasi sebelumnya.');
        return;
    }

    // --- INJECT CSS STYLES KHUSUS BARJAS ---
    const barjasStyles = `
        /* BARJAS CUSTOM STYLES - TIDAK BERTABRAKAN DENGAN SIMATA */
        .barjas-container {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: 100vh;
            padding: 20px 0;
            overflow-x: hidden;
            color: #333;
        }
        
        .barjas-app-wrapper {
            max-width: 1600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 20px 25px rgba(0,0,0,0.15);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.5);
            position: relative;
            z-index: 10;
        }
        
        /* Header BARJAS dengan Menu Bar */
        .barjas-header {
            background: linear-gradient(120deg, #003049 0%, #005f73 40%, #0a9396 70%, #ca6702 100%);
            color: white;
            padding: 20px 20px 0 20px;
            position: relative;
            overflow: hidden;
            border-bottom: 4px solid #ee9b00;
        }
        
        .barjas-header::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
        }
        
        .barjas-logo {
            font-size: 3.5rem;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            animation: barjas-float 6s ease-in-out infinite;
        }

        @keyframes barjas-float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        .barjas-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.6rem;
            font-weight: 800;
            margin: 0;
            position: relative;
            z-index: 1;
            text-transform: uppercase;
            letter-spacing: 1px;
            line-height: 1.4;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
        }
        
        .barjas-subtitle {
            font-family: 'Montserrat', sans-serif;
            font-size: 1rem;
            opacity: 0.95;
            position: relative;
            z-index: 1;
            font-weight: 500;
            letter-spacing: 0.5px;
            margin-top: 5px;
            color: #ffecd1;
        }
        
        /* Menu Bar Horizontal */
        .barjas-menu-bar {
            display: flex;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px 10px 0 0;
            padding: 0;
            margin-top: 15px;
            overflow-x: auto;
        }

        .barjas-menu-pills {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .barjas-menu-pills .barjas-menu-link {
            border-radius: 10px 10px 0 0;
            margin: 0;
            padding: 12px 20px;
            font-weight: 600;
            color: white;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            border-bottom: 4px solid transparent;
            text-decoration: none;
            cursor: pointer;
            background-color: transparent;
            white-space: nowrap;
        }
        
        .barjas-menu-pills .barjas-menu-link:hover {
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffecd1;
        }
        
        .barjas-menu-pills .barjas-menu-link.active {
            background-color: rgba(255, 255, 255, 0.9);
            border-bottom: 4px solid #ee9b00;
            color: #005f73;
        }

        /* Tombol Buat Permohonan */
        .barjas-permohonan-btn {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            font-weight: bold;
            padding: 12px 24px;
            font-size: 1.1rem;
            margin-top: 20px;
            border-radius: 8px;
            border: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .barjas-permohonan-btn:hover {
            background: linear-gradient(135deg, #218838, #1e9e8a);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(40, 167, 69, 0.4);
            color: white;
        }

        /* Content BARJAS */
        .barjas-section-title {
            font-family: 'Montserrat', sans-serif;
            border-left: 5px solid #ee9b00;
            padding-left: 15px;
            margin: 25px 0;
            font-weight: 700;
            color: #001219;
            font-size: 1.6rem;
            position: relative;
            background: linear-gradient(to right, rgba(238, 155, 0, 0.1), transparent);
            padding-top: 5px;
            padding-bottom: 5px;
            border-radius: 0 8px 8px 0;
        }
        
        /* Buttons BARJAS */
        .barjas-btn {
            border-radius: 8px;
            font-weight: 600;
            font-family: 'Montserrat', sans-serif;
            letter-spacing: 0.5px;
            padding: 10px 20px;
            border: none;
            transition: all 0.3s ease;
        }

        .barjas-btn-primary {
            background: linear-gradient(135deg, #001219 0%, #005f73 50%, #0a9396 100%);
            color: white;
            box-shadow: 0 4px 6px rgba(0, 95, 115, 0.3);
        }
        
        .barjas-btn-primary:hover {
            background: linear-gradient(135deg, #001219 0%, #004d40 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 95, 115, 0.4);
            color: white;
        }
        
        .barjas-btn-success {
            background: linear-gradient(135deg, #0a9396, #94d2bd);
            color: white;
        }
        
        .barjas-btn-warning {
            background: linear-gradient(135deg, #ca6702, #ee9b00);
            color: white;
        }

        /* Forms BARJAS */
        .barjas-form-label {
            font-weight: 600;
            color: #2b2d42;
            font-size: 0.9rem;
        }
        
        .barjas-form-control, 
        .barjas-form-select {
            border-radius: 8px;
            padding: 12px 15px;
            border: 1px solid #ced4da;
            font-size: 0.95rem;
            background-color: #fdfdfd;
        }
        
        .barjas-form-control:focus, 
        .barjas-form-select:focus {
            border-color: #0a9396;
            box-shadow: 0 0 0 3px rgba(10, 147, 150, 0.2);
            background-color: white;
        }
        
        /* Tables BARJAS */
        .barjas-data-table {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: none;
            white-space: nowrap;
            width: 100%;
        }
        
        .barjas-data-table th {
            background: linear-gradient(90deg, #005f73, #0a9396) !important;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
            padding: 15px 10px;
            border: none;
        }
        
        .barjas-data-table td {
            border-bottom: 1px solid #e9ecef;
            padding: 12px 10px;
            font-size: 0.9rem;
        }

        .barjas-data-table tr:hover {
            background-color: #e0f2f1;
        }
        
        /* Cards & Stats BARJAS */
        .barjas-card {
            border-radius: 15px;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            background: white;
        }
        
        .barjas-card-header {
            background: linear-gradient(90deg, #005f73, #001219);
            color: white;
            font-weight: 600;
            border-radius: 15px 15px 0 0 !important;
            padding: 15px 20px;
        }
        
        .barjas-stats-box {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
            border-left: 5px solid #ca6702;
            transition: transform 0.3s;
        }
        
        .barjas-stats-box:hover {
            transform: translateY(-5px);
        }

        .barjas-stats-number {
            color: #005f73;
            font-family: 'Montserrat', sans-serif;
        }
        
        /* Utils BARJAS */
        .barjas-notification-toast { 
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            z-index: 1050; 
            min-width: 280px; 
        }
        
        .barjas-input-error { 
            border-color: #dc3545 !important; 
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important; 
        }
        
        .barjas-error-message { 
            color: #dc3545; 
            font-size: 0.8rem; 
            margin-top: 5px; 
            display: none; 
            font-weight: 500; 
        }
        
        .barjas-watermark { 
            position: absolute; 
            bottom: 10px; 
            right: 15px; 
            opacity: 0.8; 
            font-size: 0.8rem; 
            color: rgba(255,255,255,0.7); 
            font-weight: 300; 
            letter-spacing: 1px;
        }
        
        /* Modal BARJAS */
        .barjas-modal-content {
            border-radius: 20px;
            overflow: hidden;
        }
        
        .barjas-detail-modal-label {
            font-weight: 600;
            color: #005f73;
            margin-bottom: 5px;
        }
        
        .barjas-detail-modal-value {
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 3px solid #0a9396;
            margin-bottom: 15px;
        }
        
        .barjas-whatsapp-link { 
            color: #25D366; 
            text-decoration: none; 
        }
        
        .barjas-whatsapp-number { 
            color: #25D366; 
            cursor: pointer; 
            text-decoration: underline; 
            font-weight: 500;
        }
        
        .barjas-drive-link { 
            color: #005f73; 
            font-weight: 600; 
            text-decoration: none; 
        }
        
        /* Tab Content */
        .barjas-tab-content {
            display: none;
            padding: 20px;
            animation: barjas-fadeIn 0.5s ease;
        }
        
        .barjas-tab-content.active {
            display: block;
        }
        
        /* Responsive BARJAS */
        @media (max-width: 991.98px) {
            .barjas-app-wrapper { 
                margin: 0; 
                border-radius: 0; 
            }
            
            .barjas-menu-pills {
                flex-direction: column;
            }
            
            .barjas-menu-pills .barjas-menu-link {
                border-radius: 10px;
                margin-bottom: 5px;
                border-bottom: none;
                border-left: 4px solid transparent;
                padding: 10px 15px;
            }
            
            .barjas-menu-pills .barjas-menu-link.active {
                border-left: 4px solid #ee9b00;
                border-bottom: none;
            }
            
            .barjas-title { 
                font-size: 1.3rem; 
                line-height: 1.2; 
            }
            
            .barjas-logo { 
                font-size: 2.5rem; 
                margin-bottom: 5px; 
            }
            
            .barjas-header { 
                padding: 40px 15px 15px 15px; 
            }
            
            .barjas-table-responsive { 
                overflow-x: auto; 
                -webkit-overflow-scrolling: touch; 
            }
        }
        
        /* Animation BARJAS */
        @keyframes barjas-fadeIn { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        
        .barjas-animate-fadeIn { 
            animation: barjas-fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
        }
    `;

    // Inject styles ke dalam dokumen
    const barjasStyleElement = document.createElement('style');
    barjasStyleElement.id = 'barjas-styles';
    barjasStyleElement.textContent = barjasStyles;
    document.head.appendChild(barjasStyleElement);

    // --- KONSTANTA DAN KONFIGURASI BARJAS ---
    const BARJAS_CONFIG = {
        APP_NAME: 'SISTEM BANTUAN NELAYAN (BARJAS)',
        APP_SUBTITLE: 'Aplikasi Permohonan Bantuan Barang',
        VERSION: '3.3',
        SECURITY_PIN: '17081945',
        EXTRACT_CODE: '19450817',
        WHATSAPP_ADMIN: '6287865614222',
        
        // Warna tema
        COLORS: {
            PRIMARY: '#005f73',
            SECONDARY: '#0a9396',
            ACCENT: '#ca6702',
            DARK: '#001219',
            LIGHT: '#f8f9fa',
            SUCCESS: '#0a9396',
            WARNING: '#ca6702',
            DANGER: '#dc3545'
        },
        
        // Data wilayah
        KECAMATAN_DATA: {
            "Arjasa": ["Arjasa", "Bayeman", "Curah Tatal", "Jatisari", "Kayumas", "Kedungdowo", "Ketowan", "Lamongan"],
            "Asembagus": ["Asembagus", "Awar-awar", "Bantal", "Gudang", "Kedunglo", "Kertosari", "Mojosari", "Parante", "Trigonco", "Wringin Anom"],
            "Banyuglugur": ["Banyuglugur", "Kalianget", "Kalisari", "Lubawang", "Selobanteng", "Telempong", "Tepos"],
            "Banyuputih": ["Banyuputih", "Sumberanyar", "Sumberejo", "Sumberwaru", "Wonorejo"],
            "Besuki": ["Besuki", "Blimbing", "Bloro", "Demung", "Jetis", "Kalimas", "Langkap", "Pesisir", "Sumberejo", "Widoropayung"],
            "Bungatan": ["Bletok", "Bungatan", "Mlandingan Wetan", "Pasir Putih", "Patemon", "Selowogo", "Sumbertengah"],
            "Jangkar": ["Agel", "Curah Kalak", "Gadingan", "Jangkar", "Kumbangsari", "Palangan", "Pesanggrahan", "Sopet"],
            "Jatibanteng": ["Curahsuri", "Jatibanteng", "Kembangsari", "Pategalan", "Patemon", "Semambung", "Sumberanyar", "Wringinanom"],
            "Kapongan": ["Curah Cottok", "Gebangan", "Kandang", "Kapongan", "Kesambi Rampak", "Landangan", "Peleyan", "Pokaan", "Seletreng", "Wonokoyo"],
            "Kendit": ["Balung", "Bugeman", "Kendit", "Klatakan", "Kukusan", "Rajekwesi", "Tambak Ukir"],
            "Mangaran": ["Mangaran", "Semiring", "Tanjung Glugur", "Tanjung Kamal", "Tanjung Pecinan", "Trebungan"],
            "Mlandingan": ["Alas Bayur", "Campoan", "Mlandingan Kulon", "Selomukti", "Sumberanyar", "Sumber Pinang", "Trebungan"],
            "Panarukan": ["Alasmalang", "Duwet", "Gelung", "Kilensari", "Paowan", "Peleyan", "Sumberkolak", "Wringinanom"],
            "Panji": ["Battal", "Curah Jeru", "Juglangan", "Kayu Putih", "Klampokan", "Panji Kidul", "Panji Lor", "Sliwung", "Tenggir", "Tokelan", "Ardirejo", "Mimbaan"],
            "Situbondo": ["Kalibagor", "Kotakan", "Olean", "Talkandang", "Dawuhan", "Patokan"],
            "Suboh": ["Buduan", "Cemara", "Dawuan", "Gunung Malang", "Gunung Putri", "Ketah", "Mojodungkol", "Suboh"],
            "Sumbermalang": ["Alastengah", "Baderan", "Kalirejo", "Plalangan", "Sumberargo", "Taman", "Tamankursi", "Tamansari", "Tlogosari"]
        },
        
        // Jenis bantuan (HANYA BARANG)
        JENIS_BANTUAN: [
            "Bibit Ikan",
            "Pakan Ikan",
            "Alat Tangkap",
            "Kapal/Perahu",
            "Mesin Tempel",
            "Cold Storage",
            "Jaring Nelayan",
            "Peralatan Keselamatan",
            "Bahan Bakar Kapal",
            "Lainnya"
        ],
        
        // Jabatan dalam kelompok
        JABATAN_LIST: [
            "Ketua",
            "Sekretaris",
            "Bendahara",
            "Anggota",
            "Individu"
        ],
        
        // Satuan bantuan
        SATUAN_LIST: [
            "Ekor",
            "Kilogram",
            "Liter",
            "Unit",
            "Paket",
            "Set",
            "Buah",
            "Meter",
            "Roll"
        ]
    };

    // --- STATE MANAGEMENT BARJAS ---
    let barjasState = {
        data: [],
        settings: {
            itemsPerPage: 25,
            notifications: true,
            privacyMode: true,
            lastBackupDate: '-'
        },
        currentPage: 1,
        generatedCodes: {},
        activeFilters: {},
        currentDetailId: null,
        isInitialized: false,
        lastSavedData: null
    };

    // --- FUNGSI UTILITAS BARJAS ---
    const BarjasUtils = {
        formatDate(dateString) {
            if (!dateString) return '-';
            try {
                return new Date(dateString).toLocaleDateString('id-ID', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                });
            } catch (error) {
                return dateString;
            }
        },

        formatNumber(num) {
            if (isNaN(num) || num === undefined || num === null) return num;
            try {
                return new Intl.NumberFormat('id-ID').format(num);
            } catch (error) {
                return num;
            }
        },

        formatPrivacy(value) {
            if (!barjasState.settings.privacyMode) return value;
            if (!value) return '-';
            const str = String(value);
            if (str.length <= 4) return '****';
            return str.slice(0, -4) + '****';
        },

        showNotification(message, type = 'info') {
            if (!barjasState.settings.notifications) return;
            
            // Buat toast container jika belum ada
            let toastContainer = document.querySelector('.barjas-toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'barjas-toast-container position-fixed bottom-0 end-0 p-3';
                toastContainer.style.zIndex = '1100';
                document.body.appendChild(toastContainer);
            }
            
            const toastId = 'barjas-toast-' + Date.now();
            const toastHTML = `
                <div id="${toastId}" class="toast barjas-notification-toast" role="alert">
                    <div class="toast-header ${type === 'success' ? 'bg-success text-white' : type === 'error' ? 'bg-danger text-white' : 'bg-primary text-white'}">
                        <strong class="me-auto">${type === 'success' ? 'Berhasil!' : type === 'error' ? 'Error!' : 'Info'}</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;
            
            toastContainer.insertAdjacentHTML('beforeend', toastHTML);
            const toastElement = document.getElementById(toastId);
            
            // Gunakan Bootstrap Toast jika tersedia, jika tidak gunakan timeout
            if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
                const toast = new bootstrap.Toast(toastElement);
                toast.show();
                
                toastElement.addEventListener('hidden.bs.toast', function() {
                    this.remove();
                });
            } else {
                // Fallback jika Bootstrap tidak tersedia
                toastElement.style.display = 'block';
                setTimeout(() => {
                    toastElement.remove();
                }, 3000);
            }
        },

        downloadFile(content, mimeType, filename) {
            try {
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                return true;
            } catch (error) {
                console.error('Gagal mengunduh file:', error);
                return false;
            }
        }
    };

    // --- PERSISTENCE MANAGER BARJAS ---
    const BarjasStorage = {
        saveData() {
            try {
                localStorage.setItem('barjas_app_data', JSON.stringify(barjasState.data));
                localStorage.setItem('barjas_generated_codes', JSON.stringify(barjasState.generatedCodes));
                return true;
            } catch (e) {
                console.error('Gagal menyimpan data BARJAS:', e);
                BarjasUtils.showNotification('Gagal menyimpan data ke penyimpanan lokal', 'error');
                return false;
            }
        },

        loadData() {
            try {
                const savedData = localStorage.getItem('barjas_app_data');
                const savedCodes = localStorage.getItem('barjas_generated_codes');
                
                barjasState.data = savedData ? JSON.parse(savedData) : [];
                barjasState.generatedCodes = savedCodes ? JSON.parse(savedCodes) : {};
                return true;
            } catch (e) {
                console.error('Gagal memuat data BARJAS:', e);
                BarjasUtils.showNotification('Gagal memuat data dari penyimpanan lokal', 'error');
                barjasState.data = [];
                barjasState.generatedCodes = {};
                return false;
            }
        },

        saveSettings() {
            try {
                localStorage.setItem('barjas_settings', JSON.stringify(barjasState.settings));
                return true;
            } catch (e) {
                console.error('Gagal menyimpan pengaturan BARJAS:', e);
                return false;
            }
        },

        loadSettings() {
            try {
                const savedSettings = localStorage.getItem('barjas_settings');
                if (savedSettings) {
                    barjasState.settings = { ...barjasState.settings, ...JSON.parse(savedSettings) };
                }
                return true;
            } catch (e) {
                console.error('Gagal memuat pengaturan BARJAS:', e);
                return false;
            }
        },

        clearAll() {
            try {
                localStorage.removeItem('barjas_app_data');
                localStorage.removeItem('barjas_generated_codes');
                localStorage.removeItem('barjas_settings');
                barjasState.data = [];
                barjasState.generatedCodes = {};
                return true;
            } catch (e) {
                console.error('Gagal reset data BARJAS:', e);
                return false;
            }
        }
    };

    // --- FORM HANDLER BARJAS ---
    const BarjasFormHandler = {
        initForm() {
            this.fillDropdowns();
            this.setupFormValidation();
            this.setupFormEvents();
            
            // Set tanggal default
            const tanggalField = document.getElementById('barjas-tanggal-terima');
            if (tanggalField) {
                tanggalField.value = new Date().toISOString().split('T')[0];
            }
        },

        fillDropdowns() {
            // Isi dropdown kecamatan
            const kecamatanSelect = document.getElementById('barjas-kecamatan');
            if (kecamatanSelect) {
                kecamatanSelect.innerHTML = '<option value="">Pilih Kecamatan</option>';
                Object.keys(BARJAS_CONFIG.KECAMATAN_DATA).sort().forEach(kec => {
                    kecamatanSelect.add(new Option(kec, kec));
                });
                
                // Tambahkan event listener
                kecamatanSelect.addEventListener('change', (e) => this.updateDesaDropdown(e.target.value));
            }

            // Isi dropdown desa
            const desaSelect = document.getElementById('barjas-desa');
            if (desaSelect) {
                desaSelect.innerHTML = '<option value="">Pilih Desa</option>';
                desaSelect.disabled = true;
            }

            // Isi dropdown tahun
            const tahunSelect = document.getElementById('barjas-tahun-anggaran');
            if (tahunSelect) {
                const currentYear = new Date().getFullYear();
                tahunSelect.innerHTML = '<option value="">Pilih Tahun</option>';
                for (let year = currentYear; year >= currentYear - 5; year--) {
                    tahunSelect.add(new Option(year.toString(), year.toString()));
                }
                tahunSelect.value = currentYear.toString();
            }

            // Isi dropdown jenis bantuan
            const jenisSelect = document.getElementById('barjas-jenis-bantuan');
            if (jenisSelect) {
                jenisSelect.innerHTML = '<option value="">Pilih Jenis Bantuan</option>';
                BARJAS_CONFIG.JENIS_BANTUAN.forEach(jenis => {
                    jenisSelect.add(new Option(jenis, jenis));
                });
            }

            // Isi dropdown jabatan
            const jabatanSelect = document.getElementById('barjas-jabatan');
            if (jabatanSelect) {
                jabatanSelect.innerHTML = '<option value="">Pilih Jabatan</option>';
                BARJAS_CONFIG.JABATAN_LIST.forEach(jabatan => {
                    jabatanSelect.add(new Option(jabatan, jabatan));
                });
            }

            // Isi dropdown satuan
            const satuanSelect = document.getElementById('barjas-satuan-bantuan');
            if (satuanSelect) {
                satuanSelect.innerHTML = '<option value="">Pilih Satuan</option>';
                BARJAS_CONFIG.SATUAN_LIST.forEach(satuan => {
                    satuanSelect.add(new Option(satuan, satuan));
                });
            }
        },

        updateDesaDropdown(kecamatan) {
            const desaSelect = document.getElementById('barjas-desa');
            if (!desaSelect) return;

            desaSelect.innerHTML = '<option value="">Pilih Desa</option>';
            
            if (kecamatan && BARJAS_CONFIG.KECAMATAN_DATA[kecamatan]) {
                desaSelect.disabled = false;
                BARJAS_CONFIG.KECAMATAN_DATA[kecamatan].sort().forEach(desa => {
                    desaSelect.add(new Option(desa, desa));
                });
            } else {
                desaSelect.disabled = true;
            }
        },

        setNoWhatsApp() {
            const waInput = document.getElementById('barjas-whatsapp');
            const btnNoWA = document.getElementById('barjas-btn-no-wa');
            
            if (waInput && btnNoWA) {
                if (waInput.value === 'TIDAK ADA') {
                    waInput.value = '';
                    waInput.removeAttribute('readonly');
                    btnNoWA.textContent = 'Tidak Ada WhatsApp';
                    btnNoWA.classList.remove('active', 'btn-secondary');
                    btnNoWA.classList.add('btn-outline-secondary');
                } else {
                    waInput.value = 'TIDAK ADA';
                    waInput.setAttribute('readonly', true);
                    btnNoWA.textContent = 'Batal';
                    btnNoWA.classList.add('active', 'btn-secondary');
                    btnNoWA.classList.remove('btn-outline-secondary');
                }
            }
        },

        setBukanKelompok() {
            const kelompokInput = document.getElementById('barjas-nama-kelompok');
            const jabatanSelect = document.getElementById('barjas-jabatan');
            
            if (kelompokInput && jabatanSelect) {
                if (kelompokInput.value === 'INDIVIDU') {
                    kelompokInput.value = '';
                    kelompokInput.removeAttribute('readonly');
                    jabatanSelect.disabled = false;
                    jabatanSelect.value = '';
                } else {
                    kelompokInput.value = 'INDIVIDU';
                    kelompokInput.setAttribute('readonly', true);
                    jabatanSelect.value = 'Individu';
                    jabatanSelect.disabled = true;
                }
            }
        },

        generateKodeValidasi() {
            const kodeInput = document.getElementById('barjas-kode-validasi');
            const nikInput = document.getElementById('barjas-nik');
            
            if (!kodeInput || !nikInput) return;
            
            if (kodeInput.value && kodeInput.value.trim() !== '') {
                BarjasUtils.showNotification('Kode validasi sudah digenerate!', 'warning');
                return;
            }
            
            if (nikInput.value.length !== 16) {
                BarjasUtils.showNotification('NIK harus 16 digit terlebih dahulu!', 'error');
                nikInput.focus();
                return;
            }
            
            const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
            kodeInput.value = 'BRJ-' + randomPart;
            
            BarjasUtils.showNotification('Kode validasi berhasil digenerate', 'success');
        },

        autoGenerateKode() {
            const kodeInput = document.getElementById('barjas-kode-validasi');
            const nikInput = document.getElementById('barjas-nik');
            
            if (!kodeInput || !nikInput) return;
            
            // Hanya generate jika kode belum ada
            if (!kodeInput.value.trim() && nikInput.value.length === 16) {
                const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
                kodeInput.value = 'BRJ-' + randomPart;
                BarjasUtils.showNotification('Kode validasi otomatis digenerate dari NIK', 'info');
            }
        },

        updateSatuanBantuan() {
            const jenisSelect = document.getElementById('barjas-jenis-bantuan');
            const satuanSelect = document.getElementById('barjas-satuan-bantuan');
            
            if (!jenisSelect || !satuanSelect) return;
            
            const jenis = jenisSelect.value;
            
            // Mapping jenis bantuan ke satuan default
            const mapping = {
                'Bibit Ikan': 'Ekor',
                'Pakan Ikan': 'Kilogram',
                'Alat Tangkap': 'Unit',
                'Kapal/Perahu': 'Unit',
                'Mesin Tempel': 'Unit',
                'Cold Storage': 'Unit',
                'Jaring Nelayan': 'Meter',
                'Peralatan Keselamatan': 'Set',
                'Bahan Bakar Kapal': 'Liter',
                'Lainnya': 'Unit'
            };
            
            if (mapping[jenis]) {
                satuanSelect.value = mapping[jenis];
            }
        },

        setupFormValidation() {
            const form = document.getElementById('barjas-input-form');
            if (!form) return;

            // Validasi real-time
            const validateField = (field) => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    field.classList.add('barjas-input-error');
                    return false;
                } else {
                    field.classList.remove('barjas-input-error');
                    return true;
                }
            };

            // Tambahkan event listener untuk validasi real-time
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => {
                    if (field.value.trim()) {
                        field.classList.remove('barjas-input-error');
                    }
                });
            });

            // Validasi NIK khusus
            const nikField = document.getElementById('barjas-nik');
            if (nikField) {
                nikField.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16);
                });
            }

            form.addEventListener('submit', (e) => this.handleSubmit(e));
            form.addEventListener('reset', () => this.resetForm());
        },

        setupFormEvents() {
            // Event untuk tombol tidak ada WhatsApp
            const btnNoWA = document.getElementById('barjas-btn-no-wa');
            if (btnNoWA) {
                btnNoWA.addEventListener('click', () => this.setNoWhatsApp());
            }

            // Event untuk tombol bukan kelompok
            const btnNonGroup = document.getElementById('barjas-btn-bukan-kelompok');
            if (btnNonGroup) {
                btnNonGroup.addEventListener('click', () => this.setBukanKelompok());
            }

            // Event untuk generate kode validasi
            const btnGenerate = document.getElementById('barjas-generate-kode-btn');
            if (btnGenerate) {
                btnGenerate.addEventListener('click', () => this.generateKodeValidasi());
            }

            // Event untuk jenis bantuan -> satuan
            const jenisBantuan = document.getElementById('barjas-jenis-bantuan');
            if (jenisBantuan) {
                jenisBantuan.addEventListener('change', () => this.updateSatuanBantuan());
            }

            // Event untuk NIK -> generate kode
            const nikField = document.getElementById('barjas-nik');
            if (nikField) {
                nikField.addEventListener('blur', () => {
                    if (nikField.value.length === 16) {
                        this.autoGenerateKode();
                    }
                });
            }
        },

        handleSubmit(e) {
            e.preventDefault();
            
            if (!this.validateForm()) {
                BarjasUtils.showNotification('Harap periksa kembali form yang diisi', 'error');
                return;
            }
            
            const formData = this.collectFormData();
            const editId = document.getElementById('barjas-input-form').getAttribute('data-edit-id');
            
            // Cek duplikasi NIK (kecuali edit)
            if (!editId) {
                const existing = barjasState.data.find(item => item.nik === formData.nik);
                if (existing) {
                    BarjasUtils.showNotification('NIK sudah terdaftar dalam sistem!', 'error');
                    return;
                }
            }
            
            if (editId) {
                // Update existing data
                const index = barjasState.data.findIndex(item => item.id == editId);
                if (index > -1) {
                    barjasState.data[index] = formData;
                    BarjasUtils.showNotification('Data berhasil diperbarui!', 'success');
                }
            } else {
                // Add new data
                formData.id = Date.now();
                barjasState.data.push(formData);
                BarjasUtils.showNotification('Data berhasil disimpan!', 'success');
                
                // Save generated code
                if (formData.kodeValidasi && formData.nik) {
                    barjasState.generatedCodes[formData.nik] = {
                        kode: formData.kodeValidasi,
                        tanggal: new Date().toISOString()
                    };
                }
            }
            
            BarjasStorage.saveData();
            
            // Simpan data terakhir untuk permohonan
            barjasState.lastSavedData = formData;
            
            // Tampilkan tombol Buat Permohonan
            this.showPermohonanButton();
            
            // Render ulang tabel dan update dashboard
            BarjasTableView.renderTable();
            BarjasDashboard.updateDashboard();
            
            // Reset form setelah submit
            setTimeout(() => {
                if (!editId) {
                    this.resetForm();
                }
            }, 500);
        },

        showPermohonanButton() {
            const formContainer = document.querySelector('#barjas-input .card-body');
            let permohonanButton = document.getElementById('barjas-buat-permohonan-btn');
            
            if (!permohonanButton) {
                permohonanButton = document.createElement('button');
                permohonanButton.id = 'barjas-buat-permohonan-btn';
                permohonanButton.className = 'btn barjas-permohonan-btn w-100 mt-4';
                permohonanButton.innerHTML = '<i class="fas fa-file-pdf me-2"></i> Buat Permohonan (PDF)';
                permohonanButton.addEventListener('click', () => this.buatPermohonan());
                formContainer.appendChild(permohonanButton);
            }
            
            permohonanButton.style.display = 'block';
            permohonanButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },

        buatPermohonan() {
            if (!barjasState.lastSavedData) {
                BarjasUtils.showNotification('Tidak ada data yang disimpan untuk dibuat permohonan', 'error');
                return;
            }
            
            // Generate PDF
            BarjasPermohonan.generatePermohonanPDF(barjasState.lastSavedData);
        },

        collectFormData() {
            const today = new Date().toISOString().split('T')[0];
            
            return {
                id: document.getElementById('barjas-input-form').getAttribute('data-edit-id') || Date.now(),
                nama: document.getElementById('barjas-nama').value.trim(),
                nik: document.getElementById('barjas-nik').value.trim(),
                whatsapp: document.getElementById('barjas-whatsapp').value === 'TIDAK ADA' ? '' : document.getElementById('barjas-whatsapp').value.replace(/\D/g, ''),
                namaKelompok: document.getElementById('barjas-nama-kelompok').value.trim() || 'Individu',
                jabatan: document.getElementById('barjas-jabatan').value,
                tahunAnggaran: document.getElementById('barjas-tahun-anggaran').value,
                kecamatan: document.getElementById('barjas-kecamatan').value,
                desa: document.getElementById('barjas-desa').value,
                alamat: document.getElementById('barjas-alamat').value.trim(),
                jenisBantuan: document.getElementById('barjas-jenis-bantuan').value,
                namaBantuan: document.getElementById('barjas-nama-bantuan').value.trim(),
                jumlahBantuan: document.getElementById('barjas-jumlah-bantuan').value,
                satuanBantuan: document.getElementById('barjas-satuan-bantuan').value,
                tanggalTerima: document.getElementById('barjas-tanggal-terima').value,
                namaPetugas: document.getElementById('barjas-nama-petugas').value.trim(),
                driveLink: document.getElementById('barjas-drive-link').value.trim(),
                kodeValidasi: document.getElementById('barjas-kode-validasi').value,
                keterangan: document.getElementById('barjas-keterangan').value.trim(),
                tanggalInput: today,
                status: 'Menunggu'
            };
        },

        validateForm() {
            const requiredFields = [
                'barjas-nama', 'barjas-nik', 'barjas-kecamatan', 'barjas-desa',
                'barjas-jenis-bantuan', 'barjas-nama-bantuan', 'barjas-jumlah-bantuan',
                'barjas-nama-petugas', 'barjas-kode-validasi'
            ];
            
            let isValid = true;
            
            for (const fieldId of requiredFields) {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    field.classList.add('barjas-input-error');
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    isValid = false;
                } else if (field) {
                    field.classList.remove('barjas-input-error');
                }
            }
            
            // Validasi NIK harus 16 digit
            const nikField = document.getElementById('barjas-nik');
            if (nikField && nikField.value.length !== 16) {
                nikField.classList.add('barjas-input-error');
                BarjasUtils.showNotification('NIK harus 16 digit angka!', 'error');
                isValid = false;
            }
            
            // Validasi WhatsApp jika diisi
            const waField = document.getElementById('barjas-whatsapp');
            if (waField && waField.value !== 'TIDAK ADA' && waField.value.trim() && !waField.value.match(/^[0-9]{10,13}$/)) {
                waField.classList.add('barjas-input-error');
                BarjasUtils.showNotification('Nomor WhatsApp harus 10-13 digit angka!', 'error');
                isValid = false;
            }
            
            return isValid;
        },

        resetForm() {
            const form = document.getElementById('barjas-input-form');
            if (form) {
                form.reset();
                form.removeAttribute('data-edit-id');
                
                // Reset dropdown desa
                const desaSelect = document.getElementById('barjas-desa');
                if (desaSelect) {
                    desaSelect.innerHTML = '<option value="">Pilih Desa</option>';
                    desaSelect.disabled = true;
                }
                
                // Reset tanggal
                const tanggalField = document.getElementById('barjas-tanggal-terima');
                if (tanggalField) {
                    tanggalField.value = new Date().toISOString().split('T')[0];
                }
                
                // Reset tombol
                const btnNoWA = document.getElementById('barjas-btn-no-wa');
                if (btnNoWA) {
                    btnNoWA.textContent = 'Tidak Ada WhatsApp';
                    btnNoWA.classList.remove('active', 'btn-secondary');
                    btnNoWA.classList.add('btn-outline-secondary');
                }
                
                const btnNonGroup = document.getElementById('barjas-btn-bukan-kelompok');
                if (btnNonGroup) {
                    btnNonGroup.textContent = 'Bukan Kelompok (Individu)';
                }
                
                // Reset kelompok
                const kelompokInput = document.getElementById('barjas-nama-kelompok');
                const jabatanSelect = document.getElementById('barjas-jabatan');
                if (kelompokInput && jabatanSelect) {
                    kelompokInput.value = '';
                    kelompokInput.removeAttribute('readonly');
                    jabatanSelect.disabled = false;
                    jabatanSelect.value = '';
                }
                
                // Reset kode validasi
                const kodeInput = document.getElementById('barjas-kode-validasi');
                if (kodeInput) {
                    kodeInput.value = '';
                }
            }
            
            // Sembunyikan tombol Buat Permohonan
            const permohonanButton = document.getElementById('barjas-buat-permohonan-btn');
            if (permohonanButton) {
                permohonanButton.style.display = 'none';
            }
        },

        editData(id) {
            const data = barjasState.data.find(item => item.id == id);
            if (!data) {
                BarjasUtils.showNotification('Data tidak ditemukan', 'error');
                return;
            }
            
            // Switch to input tab
            this.switchToTab('barjas-input');
            
            // Tunggu sebentar untuk memastikan tab sudah aktif
            setTimeout(() => {
                // Isi form dengan data
                document.getElementById('barjas-nama').value = data.nama || '';
                document.getElementById('barjas-nik').value = data.nik || '';
                document.getElementById('barjas-whatsapp').value = data.whatsapp || '';
                document.getElementById('barjas-nama-kelompok').value = data.namaKelompok || '';
                document.getElementById('barjas-jabatan').value = data.jabatan || '';
                document.getElementById('barjas-tahun-anggaran').value = data.tahunAnggaran || '';
                document.getElementById('barjas-kecamatan').value = data.kecamatan || '';
                
                // Update dropdown desa
                this.updateDesaDropdown(data.kecamatan);
                
                setTimeout(() => {
                    document.getElementById('barjas-desa').value = data.desa || '';
                }, 100);
                
                document.getElementById('barjas-alamat').value = data.alamat || '';
                document.getElementById('barjas-jenis-bantuan').value = data.jenisBantuan || '';
                document.getElementById('barjas-nama-bantuan').value = data.namaBantuan || '';
                document.getElementById('barjas-jumlah-bantuan').value = data.jumlahBantuan || '';
                document.getElementById('barjas-satuan-bantuan').value = data.satuanBantuan || '';
                document.getElementById('barjas-tanggal-terima').value = data.tanggalTerima || '';
                document.getElementById('barjas-nama-petugas').value = data.namaPetugas || '';
                document.getElementById('barjas-drive-link').value = data.driveLink || '';
                document.getElementById('barjas-kode-validasi').value = data.kodeValidasi || '';
                document.getElementById('barjas-keterangan').value = data.keterangan || '';
                
                // Set edit mode
                document.getElementById('barjas-input-form').setAttribute('data-edit-id', id);
                
                // Handle WhatsApp button state
                const waInput = document.getElementById('barjas-whatsapp');
                const btnNoWA = document.getElementById('barjas-btn-no-wa');
                if (data.whatsapp === '' || data.whatsapp === 'TIDAK ADA') {
                    waInput.value = 'TIDAK ADA';
                    waInput.setAttribute('readonly', true);
                    btnNoWA.textContent = 'Batal';
                    btnNoWA.classList.add('active', 'btn-secondary');
                    btnNoWA.classList.remove('btn-outline-secondary');
                }
                
                // Handle kelompok state
                if (data.namaKelompok === 'Individu') {
                    const kelompokInput = document.getElementById('barjas-nama-kelompok');
                    const jabatanSelect = document.getElementById('barjas-jabatan');
                    if (kelompokInput && jabatanSelect) {
                        kelompokInput.value = 'INDIVIDU';
                        kelompokInput.setAttribute('readonly', true);
                        jabatanSelect.value = 'Individu';
                        jabatanSelect.disabled = true;
                    }
                }
                
                // Simpan data terakhir untuk permohonan
                barjasState.lastSavedData = data;
                
                // Tampilkan tombol Buat Permohonan
                this.showPermohonanButton();
                
                BarjasUtils.showNotification('Mode edit diaktifkan', 'info');
            }, 300);
        },

        switchToTab(tabId) {
            const menuLinks = document.querySelectorAll('.barjas-menu-link');
            const tabContents = document.querySelectorAll('.barjas-tab-content');
            
            // Update active menu link
            menuLinks.forEach(menu => menu.classList.remove('active'));
            const targetLink = document.querySelector(`.barjas-menu-link[data-target="${tabId}"]`);
            if (targetLink) targetLink.classList.add('active');
            
            // Show target tab content
            tabContents.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === tabId) {
                    tab.classList.add('active');
                }
            });
        }
    };

    // --- TABLE VIEW HANDLER BARJAS ---
    const BarjasTableView = {
        renderTable() {
            const tableBody = document.getElementById('barjas-data-table-body');
            if (!tableBody) return;
            
            const searchTerm = document.getElementById('barjas-search-data')?.value.toLowerCase() || '';
            let filteredData = barjasState.data;
            
            // Apply search filter
            if (searchTerm) {
                filteredData = barjasState.data.filter(item => 
                    Object.values(item).some(value => 
                        String(value).toLowerCase().includes(searchTerm)
                    )
                );
            }
            
            // Apply additional filters
            filteredData = this.applyAdditionalFilters(filteredData);
            
            // Sort by tanggalInput descending (terbaru pertama)
            filteredData.sort((a, b) => new Date(b.tanggalInput) - new Date(a.tanggalInput));
            
            // Pagination
            const totalItems = filteredData.length;
            const startIndex = (barjasState.currentPage - 1) * barjasState.settings.itemsPerPage;
            const endIndex = startIndex + barjasState.settings.itemsPerPage;
            const pageData = filteredData.slice(startIndex, endIndex);
            
            // Render table
            if (pageData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center py-5 text-muted">
                            <i class="fas fa-database fa-2x mb-3 d-block"></i>
                            Tidak ada data ditemukan
                        </td>
                    </tr>
                `;
            } else {
                tableBody.innerHTML = pageData.map((item, index) => `
                    <tr>
                        <td class="text-center">${startIndex + index + 1}</td>
                        <td>
                            <div class="fw-bold">${item.nama}</div>
                            <small class="text-muted">${BarjasUtils.formatPrivacy(item.nik)}</small>
                        </td>
                        <td>
                            <div>${item.desa}, ${item.kecamatan}</div>
                            <small class="text-muted">${item.namaKelompok}</small>
                        </td>
                        <td>${item.jenisBantuan}</td>
                        <td>
                            <div class="fw-bold">${item.namaBantuan}</div>
                            <small class="text-muted">${item.jumlahBantuan} ${item.satuanBantuan}</small>
                        </td>
                        <td>${BarjasUtils.formatDate(item.tanggalTerima)}</td>
                        <td>${item.namaPetugas}</td>
                        <td class="text-center">
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-info text-white" onclick="window.BARJAS.showDetail(${item.id})" title="Detail">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-warning text-white" onclick="window.BARJAS.editData(${item.id})" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger" onclick="window.BARJAS.deleteData(${item.id})" title="Hapus">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
            
            // Update pagination
            this.updatePagination(totalItems);
            
            // Update info text
            const infoText = document.getElementById('barjas-table-info');
            if (infoText) {
                infoText.textContent = `Menampilkan ${pageData.length} dari ${totalItems} data`;
            }
        },

        applyAdditionalFilters(data) {
            let filtered = [...data];
            
            // Filter by kecamatan
            const filterKecamatan = document.getElementById('barjas-filter-kecamatan')?.value;
            if (filterKecamatan) {
                filtered = filtered.filter(item => item.kecamatan === filterKecamatan);
            }
            
            // Filter by desa
            const filterDesa = document.getElementById('barjas-filter-desa')?.value;
            if (filterDesa) {
                filtered = filtered.filter(item => item.desa === filterDesa);
            }
            
            // Filter by jenis bantuan
            const filterJenis = document.getElementById('barjas-filter-jenis')?.value;
            if (filterJenis) {
                filtered = filtered.filter(item => item.jenisBantuan === filterJenis);
            }
            
            // Filter by tahun
            const filterTahun = document.getElementById('barjas-filter-tahun')?.value;
            if (filterTahun) {
                filtered = filtered.filter(item => item.tahunAnggaran === filterTahun);
            }
            
            return filtered;
        },

        updatePagination(totalItems) {
            const paginationContainer = document.getElementById('barjas-pagination');
            if (!paginationContainer) return;
            
            const totalPages = Math.ceil(totalItems / barjasState.settings.itemsPerPage);
            
            if (totalPages <= 1) {
                paginationContainer.innerHTML = '';
                return;
            }
            
            let paginationHTML = '';
            
            // Previous button
            paginationHTML += `
                <li class="page-item ${barjasState.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="window.BARJAS.changePage(${barjasState.currentPage - 1}); return false;">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
            `;
            
            // Page numbers
            const maxVisiblePages = 5;
            let startPage = Math.max(1, barjasState.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += `
                    <li class="page-item ${barjasState.currentPage === i ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="window.BARJAS.changePage(${i}); return false;">${i}</a>
                    </li>
                `;
            }
            
            // Next button
            paginationHTML += `
                <li class="page-item ${barjasState.currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="window.BARJAS.changePage(${barjasState.currentPage + 1}); return false;">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;
            
            paginationContainer.innerHTML = paginationHTML;
        },

        setupFilters() {
            // Setup kecamatan filter
            const kecamatanFilter = document.getElementById('barjas-filter-kecamatan');
            if (kecamatanFilter) {
                kecamatanFilter.innerHTML = '<option value="">Semua Kecamatan</option>';
                Object.keys(BARJAS_CONFIG.KECAMATAN_DATA).sort().forEach(kec => {
                    kecamatanFilter.add(new Option(kec, kec));
                });
                
                kecamatanFilter.addEventListener('change', () => {
                    this.updateDesaFilter();
                    this.renderTable();
                });
            }
            
            // Setup desa filter
            const desaFilter = document.getElementById('barjas-filter-desa');
            if (desaFilter) {
                desaFilter.innerHTML = '<option value="">Semua Desa</option>';
                desaFilter.disabled = true;
                
                desaFilter.addEventListener('change', () => this.renderTable());
            }
            
            // Setup jenis filter
            const jenisFilter = document.getElementById('barjas-filter-jenis');
            if (jenisFilter) {
                jenisFilter.innerHTML = '<option value="">Semua Jenis</option>';
                BARJAS_CONFIG.JENIS_BANTUAN.forEach(jenis => {
                    jenisFilter.add(new Option(jenis, jenis));
                });
                
                jenisFilter.addEventListener('change', () => this.renderTable());
            }
            
            // Setup tahun filter
            const tahunFilter = document.getElementById('barjas-filter-tahun');
            if (tahunFilter) {
                const currentYear = new Date().getFullYear();
                tahunFilter.innerHTML = '<option value="">Semua Tahun</option>';
                for (let year = currentYear; year >= currentYear - 5; year--) {
                    tahunFilter.add(new Option(year.toString(), year.toString()));
                }
                
                tahunFilter.addEventListener('change', () => this.renderTable());
            }
            
            // Setup search
            const searchInput = document.getElementById('barjas-search-data');
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    barjasState.currentPage = 1;
                    this.renderTable();
                });
            }
            
            // Setup clear filter button
            const clearFilterBtn = document.getElementById('barjas-clear-filter-btn');
            if (clearFilterBtn) {
                clearFilterBtn.addEventListener('click', () => this.clearFilters());
            }
        },

        updateDesaFilter() {
            const kecamatanFilter = document.getElementById('barjas-filter-kecamatan');
            const desaFilter = document.getElementById('barjas-filter-desa');
            
            if (!kecamatanFilter || !desaFilter) return;
            
            const selectedKecamatan = kecamatanFilter.value;
            desaFilter.innerHTML = '<option value="">Semua Desa</option>';
            
            if (selectedKecamatan && BARJAS_CONFIG.KECAMATAN_DATA[selectedKecamatan]) {
                desaFilter.disabled = false;
                BARJAS_CONFIG.KECAMATAN_DATA[selectedKecamatan].sort().forEach(desa => {
                    desaFilter.add(new Option(desa, desa));
                });
            } else {
                desaFilter.disabled = true;
            }
        },

        clearFilters() {
            const filters = [
                'barjas-filter-kecamatan',
                'barjas-filter-desa',
                'barjas-filter-jenis',
                'barjas-filter-tahun',
                'barjas-search-data'
            ];
            
            filters.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.tagName === 'SELECT') {
                        element.value = '';
                    } else if (element.tagName === 'INPUT') {
                        element.value = '';
                    }
                }
            });
            
            const desaFilter = document.getElementById('barjas-filter-desa');
            if (desaFilter) {
                desaFilter.disabled = true;
                desaFilter.innerHTML = '<option value="">Semua Desa</option>';
            }
            
            barjasState.currentPage = 1;
            this.renderTable();
            BarjasUtils.showNotification('Filter berhasil direset', 'success');
        }
    };

    // --- DASHBOARD HANDLER BARJAS ---
    const BarjasDashboard = {
        updateDashboard() {
            this.updateStats();
            this.updateCharts();
        },

        updateStats() {
            const totalData = barjasState.data.length;
            const totalKecamatan = new Set(barjasState.data.map(item => item.kecamatan)).size;
            const totalDesa = new Set(barjasState.data.map(item => item.desa)).size;
            const totalJenisBantuan = new Set(barjasState.data.map(item => item.jenisBantuan)).size;
            
            // Update stat cards
            const stats = {
                'barjas-total-data': totalData,
                'barjas-total-kecamatan': totalKecamatan,
                'barjas-total-desa': totalDesa,
                'barjas-total-jenis': totalJenisBantuan
            };
            
            Object.keys(stats).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = BarjasUtils.formatNumber(stats[id]);
                }
            });
            
            // Update summary info
            const summaryElement = document.getElementById('barjas-summary-info');
            if (summaryElement) {
                const lastUpdated = barjasState.data.length > 0 
                    ? BarjasUtils.formatDate(barjasState.data[0].tanggalInput) // Data terbaru
                    : '-';
                
                summaryElement.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <i class="fas fa-calendar-check me-2"></i>
                            <strong>Update Terakhir:</strong> ${lastUpdated}
                        </div>
                        <div class="col-md-6">
                            <i class="fas fa-database me-2"></i>
                            <strong>Total Record:</strong> ${totalData} data
                        </div>
                    </div>
                `;
            }
        },

        updateCharts() {
            // Chart data untuk jenis bantuan
            this.updateJenisBantuanChart();
            
            // Chart data untuk kecamatan
            this.updateKecamatanChart();
        },

        updateJenisBantuanChart() {
            const ctx = document.getElementById('barjas-jenis-chart');
            if (!ctx) return;
            
            // Hitung distribusi jenis bantuan
            const jenisCount = {};
            barjasState.data.forEach(item => {
                jenisCount[item.jenisBantuan] = (jenisCount[item.jenisBantuan] || 0) + 1;
            });
            
            const labels = Object.keys(jenisCount);
            const data = Object.values(jenisCount);
            const colors = this.generateColors(labels.length);
            
            // Destroy chart jika sudah ada
            if (window.barjasJenisChart) {
                window.barjasJenisChart.destroy();
            }
            
            window.barjasJenisChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        title: {
                            display: true,
                            text: 'Distribusi Jenis Bantuan',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            });
        },

        updateKecamatanChart() {
            const ctx = document.getElementById('barjas-kecamatan-chart');
            if (!ctx) return;
            
            // Hitung distribusi kecamatan
            const kecamatanCount = {};
            barjasState.data.forEach(item => {
                kecamatanCount[item.kecamatan] = (kecamatanCount[item.kecamatan] || 0) + 1;
            });
            
            // Ambil 10 kecamatan teratas
            const sortedKecamatan = Object.entries(kecamatanCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            
            const labels = sortedKecamatan.map(item => item[0]);
            const data = sortedKecamatan.map(item => item[1]);
            const colors = this.generateColors(labels.length, true);
            
            // Destroy chart jika sudah ada
            if (window.barjasKecamatanChart) {
                window.barjasKecamatanChart.destroy();
            }
            
            window.barjasKecamatanChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Jumlah Penerima',
                        data: data,
                        backgroundColor: colors,
                        borderColor: colors.map(color => this.adjustColor(color, -20)),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top 10 Kecamatan Penerima Bantuan',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            });
        },

        generateColors(count, isBar = false) {
            const baseColors = isBar 
                ? ['#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226']
                : ['#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226'];
            
            const colors = [];
            for (let i = 0; i < count; i++) {
                colors.push(baseColors[i % baseColors.length]);
            }
            return colors;
        },

        adjustColor(color, amount) {
            const hex = color.replace('#', '');
            const num = parseInt(hex, 16);
            const r = Math.max(0, Math.min(255, (num >> 16) + amount));
            const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
            const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
            return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        }
    };

    // --- EXPORT HANDLER BARJAS ---
    const BarjasExportHandler = {
        exportToExcel() {
            if (barjasState.data.length === 0) {
                BarjasUtils.showNotification('Tidak ada data untuk diekspor', 'warning');
                return;
            }
            
            try {
                // Check if XLSX is available
                if (typeof XLSX === 'undefined') {
                    BarjasUtils.showNotification('Library Excel tidak tersedia', 'error');
                    return;
                }
                
                const dataToExport = barjasState.data.map(item => ({
                    'Nama': item.nama,
                    'NIK': BarjasUtils.formatPrivacy(item.nik),
                    'WhatsApp': item.whatsapp ? BarjasUtils.formatPrivacy(item.whatsapp) : 'TIDAK ADA',
                    'Kelompok': item.namaKelompok,
                    'Jabatan': item.jabatan,
                    'Kecamatan': item.kecamatan,
                    'Desa': item.desa,
                    'Alamat': item.alamat,
                    'Jenis Bantuan': item.jenisBantuan,
                    'Nama Bantuan': item.namaBantuan,
                    'Jumlah': item.jumlahBantuan,
                    'Satuan': item.satuanBantuan,
                    'Tanggal Permohonan': item.tanggalTerima,
                    'Petugas': item.namaPetugas,
                    'Kode Validasi': item.kodeValidasi,
                    'Keterangan': item.keterangan,
                    'Tahun Anggaran': item.tahunAnggaran,
                    'Status': item.status || 'Menunggu'
                }));
                
                // Convert to worksheet
                const ws = XLSX.utils.json_to_sheet(dataToExport);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Data Bantuan Nelayan');
                
                // Generate filename
                const dateStr = new Date().toISOString().split('T')[0];
                const filename = `BARJAS_Data_${dateStr}.xlsx`;
                
                // Save file
                XLSX.writeFile(wb, filename);
                BarjasUtils.showNotification('Data berhasil diekspor ke Excel', 'success');
            } catch (error) {
                console.error('Error exporting to Excel:', error);
                BarjasUtils.showNotification('Gagal mengekspor ke Excel', 'error');
            }
        },

        exportToPDF() {
            if (barjasState.data.length === 0) {
                BarjasUtils.showNotification('Tidak ada data untuk dicetak', 'warning');
                return;
            }
            
            try {
                const { jsPDF } = window.jspdf;
                if (!jsPDF) {
                    BarjasUtils.showNotification('Library PDF tidak tersedia', 'error');
                    return;
                }
                
                const doc = new jsPDF('p', 'mm', 'a4');
                const pageWidth = doc.internal.pageSize.width;
                
                // Header
                doc.setFillColor(5, 95, 115);
                doc.rect(0, 0, pageWidth, 40, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text('LAPORAN DATA BANTUAN NELAYAN', pageWidth / 2, 20, { align: 'center' });
                doc.setFontSize(12);
                doc.text('Dinas Perikanan Kabupaten Situbondo', pageWidth / 2, 28, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 35, { align: 'center' });
                
                // Table
                let y = 50;
                const rowHeight = 8;
                const headers = ['No', 'Nama', 'Desa/Kec', 'Jenis Bantuan', 'Jumlah', 'Tanggal', 'Petugas'];
                const colWidths = [10, 40, 35, 30, 20, 25, 30];
                
                // Table header
                doc.setFillColor(230, 230, 230);
                doc.rect(10, y, pageWidth - 20, rowHeight, 'F');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                
                let x = 10;
                headers.forEach((header, i) => {
                    doc.text(header, x + 2, y + 5);
                    x += colWidths[i];
                });
                
                y += rowHeight;
                
                // Table content
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                
                barjasState.data.slice(0, 20).forEach((item, index) => {
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }
                    
                    const rowData = [
                        (index + 1).toString(),
                        item.nama ? item.nama.substring(0, 20) : '-',
                        `${item.desa ? item.desa.substring(0, 10) : '-'}/${item.kecamatan ? item.kecamatan.substring(0, 8) : '-'}`,
                        item.jenisBantuan ? item.jenisBantuan.substring(0, 15) : '-',
                        `${item.jumlahBantuan || '-'} ${item.satuanBantuan ? item.satuanBantuan.substring(0, 3) : ''}`,
                        item.tanggalTerima || '-',
                        item.namaPetugas ? item.namaPetugas.substring(0, 15) : '-'
                    ];
                    
                    x = 10;
                    rowData.forEach((cell, i) => {
                        doc.text(cell, x + 2, y + 5);
                        x += colWidths[i];
                    });
                    
                    y += rowHeight;
                    
                    // Alternating row color
                    if (index % 2 === 0) {
                        doc.setFillColor(250, 250, 250);
                        doc.rect(10, y - rowHeight, pageWidth - 20, rowHeight, 'F');
                    }
                    
                    doc.setTextColor(0, 0, 0);
                });
                
                // Footer
                y = Math.max(y, 270);
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(`Total Data: ${barjasState.data.length} | Dicetak oleh: Sistem BARJAS v${BARJAS_CONFIG.VERSION}`, 
                        pageWidth / 2, y + 10, { align: 'center' });
                
                // Save PDF
                doc.save(`BARJAS_Laporan_${new Date().toISOString().split('T')[0]}.pdf`);
                BarjasUtils.showNotification('Laporan PDF berhasil diunduh', 'success');
            } catch (error) {
                console.error('Error exporting to PDF:', error);
                BarjasUtils.showNotification('Gagal membuat PDF', 'error');
            }
        }
    };

    // --- PERMOHONAN HANDLER ---
    const BarjasPermohonan = {
        generatePermohonanPDF(data) {
            if (!data) {
                BarjasUtils.showNotification('Tidak ada data untuk dibuat permohonan', 'error');
                return;
            }
            
            try {
                const { jsPDF } = window.jspdf;
                if (!jsPDF) {
                    BarjasUtils.showNotification('Library PDF tidak tersedia', 'error');
                    return;
                }
                
                const doc = new jsPDF('p', 'mm', 'a4');
                const pageWidth = doc.internal.pageSize.width;
                
                // Header
                doc.setFillColor(5, 95, 115);
                doc.rect(0, 0, pageWidth, 40, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('FORMULIR PERMOHONAN BANTUAN NELAYAN', pageWidth / 2, 20, { align: 'center' });
                doc.setFontSize(12);
                doc.text('Dinas Perikanan Kabupaten Situbondo', pageWidth / 2, 28, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Nomor: ${data.kodeValidasi || 'BRJ-XXXXXX'}`, pageWidth / 2, 35, { align: 'center' });
                
                // Content
                let y = 50;
                const lineHeight = 8;
                
                const addField = (label, value) => {
                    if (y > 250) {
                        doc.addPage();
                        y = 20;
                    }
                    
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(10);
                    doc.text(label, 20, y);
                    
                    doc.setFont('helvetica', 'normal');
                    doc.text(`: ${value || '-'}`, 60, y);
                    
                    y += lineHeight;
                };
                
                addField('Nama Lengkap', data.nama);
                addField('NIK', data.nik);
                addField('WhatsApp', data.whatsapp || 'Tidak Ada');
                addField('Kelompok', data.namaKelompok);
                addField('Jabatan', data.jabatan);
                addField('Kecamatan', data.kecamatan);
                addField('Desa', data.desa);
                addField('Alamat', data.alamat);
                addField('Jenis Bantuan', data.jenisBantuan);
                addField('Nama Bantuan', data.namaBantuan);
                addField('Jumlah', `${data.jumlahBantuan} ${data.satuanBantuan}`);
                addField('Tanggal Permohonan', data.tanggalTerima);
                addField('Petugas Validasi', data.namaPetugas);
                addField('Keterangan', data.keterangan);
                addField('Tahun Anggaran', data.tahunAnggaran);
                
                y += 10;
                
                // Footer dan tanda tangan
                const footerY = 200;
                doc.setFontSize(10);
                doc.text('Hormat kami,', 20, footerY);
                doc.text('Pemohon,', 20, footerY + 20);
                doc.text(`(${data.nama})`, 20, footerY + 40);
                
                doc.text('Mengetahui,', pageWidth - 60, footerY);
                doc.text('Petugas Dinas Perikanan,', pageWidth - 60, footerY + 20);
                doc.text(`(${data.namaPetugas})`, pageWidth - 60, footerY + 40);
                
                // Informasi WhatsApp
                y = 270;
                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.text(`Setelah mengunduh, silakan kirim formulir ini ke WhatsApp Admin: ${BARJAS_CONFIG.WHATSAPP_ADMIN}`, 
                        pageWidth / 2, y, { align: 'center' });
                doc.text('Jangan lupa sertakan file scan proposal dan dokumen pendukung lainnya.', 
                        pageWidth / 2, y + 5, { align: 'center' });
                
                // Save PDF
                const safeName = data.nama ? data.nama.replace(/[^a-zA-Z0-9]/g, '_') : 'Permohonan';
                const filename = `Permohonan_Bantuan_${safeName}_${data.kodeValidasi || 'NOKODE'}.pdf`;
                doc.save(filename);
                
                // Tampilkan notifikasi untuk mengirim ke WhatsApp
                this.showWhatsAppNotification(data, filename);
                
            } catch (error) {
                console.error('Error generating PDF:', error);
                BarjasUtils.showNotification('Gagal membuat PDF permohonan', 'error');
            }
        },
        
        showWhatsAppNotification(data, filename) {
            const message = `Yth. Admin Dinas Perikanan Kabupaten Situbondo,\n\nSaya mengajukan permohonan bantuan nelayan dengan detail sebagai berikut:\n\nNama: ${data.nama}\nNIK: ${data.nik}\nJenis Bantuan: ${data.jenisBantuan}\nNama Bantuan: ${data.namaBantuan}\nJumlah: ${data.jumlahBantuan} ${data.satuanBantuan}\nKode Validasi: ${data.kodeValidasi}\n\nSaya telah melampirkan formulir permohonan dalam format PDF. Silakan diperiksa.\n\nTerima kasih.`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${BARJAS_CONFIG.WHATSAPP_ADMIN}?text=${encodedMessage}`;
            
            // Tampilkan modal notifikasi
            const modalHTML = `
                <div class="modal fade" id="barjasPermohonanModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content barjas-modal-content">
                            <div class="modal-header bg-success text-white">
                                <h5 class="modal-title">
                                    <i class="fas fa-check-circle me-2"></i>Permohonan Berhasil Dibuat
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p>Formulir permohonan bantuan telah berhasil diunduh dengan nama file: <strong>${filename}</strong></p>
                                <p>Silakan kirim formulir ini ke WhatsApp Admin Dinas Perikanan untuk proses selanjutnya.</p>
                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle me-2"></i>
                                    Jangan lupa untuk melampirkan file scan proposal dan dokumen pendukung lainnya.
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                <a href="${whatsappUrl}" target="_blank" class="btn btn-success">
                                    <i class="fab fa-whatsapp me-2"></i> Kirim ke WhatsApp Admin
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Tambahkan modal ke DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            
            // Tampilkan modal
            const modalElement = document.getElementById('barjasPermohonanModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Hapus modal setelah ditutup
                modalElement.addEventListener('hidden.bs.modal', function() {
                    document.body.removeChild(modalContainer);
                });
            }
        }
    };

    // --- MAIN BARJAS APPLICATION ---
    const BarjasApp = {
        init(containerId) {
            if (barjasState.isInitialized) {
                console.warn('BARJAS sudah diinisialisasi');
                return;
            }
            
            console.log('Inisialisasi Sistem BARJAS v' + BARJAS_CONFIG.VERSION + '...');
            
            // Load data dan settings
            BarjasStorage.loadData();
            BarjasStorage.loadSettings();
            
            // Render UI
            this.renderUI(containerId);
            
            // Setup semua handler
            BarjasFormHandler.initForm();
            BarjasTableView.setupFilters();
            BarjasTableView.renderTable();
            BarjasDashboard.updateDashboard();
            
            // Setup event listeners
            this.setupEventListeners();
            this.setupTabSwitching(); // Setup tab switching
            
            barjasState.isInitialized = true;
            BarjasUtils.showNotification('Sistem BARJAS siap digunakan', 'success');
            
            // Auto-focus pada tab dashboard
            setTimeout(() => {
                const firstMenu = document.querySelector('.barjas-menu-link');
                if (firstMenu) firstMenu.click();
            }, 100);
        },

        renderUI(containerId) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Container BARJAS tidak ditemukan');
                return;
            }
            
            container.className = 'barjas-container';
            container.innerHTML = `
                <div class="barjas-app-wrapper animate-fadeIn">
                    <!-- Header dengan Menu Bar -->
                    <div class="barjas-header">
                        <div class="barjas-logo">
                            <i class="fas fa-hand-holding-usd"></i>
                        </div>
                        <h1 class="barjas-title">${BARJAS_CONFIG.APP_NAME}</h1>
                        <p class="barjas-subtitle">${BARJAS_CONFIG.APP_SUBTITLE} - V${BARJAS_CONFIG.VERSION}</p>
                        
                        <!-- Menu Bar Horizontal -->
                        <nav class="barjas-menu-bar">
                            <ul class="barjas-menu-pills">
                                <li>
                                    <button class="barjas-menu-link active" data-target="barjas-dashboard">
                                        <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                                    </button>
                                </li>
                                <li>
                                    <button class="barjas-menu-link" data-target="barjas-input">
                                        <i class="fas fa-edit me-2"></i> Input Data
                                    </button>
                                </li>
                                <li>
                                    <button class="barjas-menu-link" data-target="barjas-data">
                                        <i class="fas fa-database me-2"></i> Data Bantuan
                                    </button>
                                </li>
                                <li>
                                    <button class="barjas-menu-link" data-target="barjas-export">
                                        <i class="fas fa-file-export me-2"></i> Ekspor Data
                                    </button>
                                </li>
                                <li>
                                    <button class="barjas-menu-link" data-target="barjas-settings">
                                        <i class="fas fa-cog me-2"></i> Pengaturan
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        
                        <div class="barjas-watermark">v${BARJAS_CONFIG.VERSION}</div>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="p-4">
                        <!-- Dashboard Tab -->
                        <div class="barjas-tab-content active" id="barjas-dashboard">
                            <h3 class="barjas-section-title">Dashboard Bantuan Nelayan</h3>
                            
                            <!-- Stats Cards -->
                            <div class="row g-3 mb-4">
                                <div class="col-6 col-lg-3">
                                    <div class="barjas-stats-box p-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted small">Total Data</span>
                                            <i class="fas fa-database text-primary fa-2x"></i>
                                        </div>
                                        <h2 class="barjas-stats-number mb-0" id="barjas-total-data">0</h2>
                                    </div>
                                </div>
                                <div class="col-6 col-lg-3">
                                    <div class="barjas-stats-box p-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted small">Kecamatan</span>
                                            <i class="fas fa-map-marked-alt text-success fa-2x"></i>
                                        </div>
                                        <h2 class="barjas-stats-number mb-0" id="barjas-total-kecamatan">0</h2>
                                    </div>
                                </div>
                                <div class="col-6 col-lg-3">
                                    <div class="barjas-stats-box p-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted small">Desa</span>
                                            <i class="fas fa-map-marker-alt text-warning fa-2x"></i>
                                        </div>
                                        <h2 class="barjas-stats-number mb-0" id="barjas-total-desa">0</h2>
                                    </div>
                                </div>
                                <div class="col-6 col-lg-3">
                                    <div class="barjas-stats-box p-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted small">Jenis Bantuan</span>
                                            <i class="fas fa-gift text-danger fa-2x"></i>
                                        </div>
                                        <h2 class="barjas-stats-number mb-0" id="barjas-total-jenis">0</h2>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Summary Info -->
                            <div class="barjas-card p-3 mb-4">
                                <div id="barjas-summary-info"></div>
                            </div>
                            
                            <!-- Charts -->
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="barjas-card">
                                        <div class="barjas-card-header">
                                            <i class="fas fa-chart-pie me-2"></i> Distribusi Jenis Bantuan
                                        </div>
                                        <div class="card-body">
                                            <canvas id="barjas-jenis-chart" height="250"></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="barjas-card">
                                        <div class="barjas-card-header">
                                            <i class="fas fa-chart-bar me-2"></i> Top 10 Kecamatan
                                        </div>
                                        <div class="card-body">
                                            <canvas id="barjas-kecamatan-chart" height="250"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Input Data Tab -->
                        <div class="barjas-tab-content" id="barjas-input">
                            <h3 class="barjas-section-title">Formulir Input Data Permohonan</h3>
                            <div class="barjas-card">
                                <div class="barjas-card-header">
                                    <i class="fas fa-file-alt me-2"></i> Entri Data Permohonan Baru
                                </div>
                                <div class="card-body p-4">
                                    <form id="barjas-input-form" novalidate>
                                        <div class="alert alert-info small mb-4">
                                            <i class="fas fa-info-circle me-2"></i>
                                            Semua kolom bertanda <span class="text-danger">*</span> wajib diisi. Setelah data disimpan, klik tombol "Buat Permohonan" untuk membuat dokumen PDF.
                                        </div>
                                        
                                        <!-- Data Pemohon -->
                                        <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">DATA PEMOHON BANTUAN</h6>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Nama Lengkap <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control barjas-form-control" id="barjas-nama" required>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">NIK (16 Digit) <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control barjas-form-control" id="barjas-nik" maxlength="16" required>
                                            </div>
                                        </div>
                                        
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Nomor WhatsApp</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control barjas-form-control" id="barjas-whatsapp">
                                                    <button type="button" class="btn btn-outline-secondary" id="barjas-btn-no-wa">
                                                        Tidak Ada WhatsApp
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Kelompok Nelayan</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control barjas-form-control" id="barjas-nama-kelompok" placeholder="Nama kelompok (jika ada)">
                                                    <button type="button" class="btn btn-outline-secondary" id="barjas-btn-bukan-kelompok">
                                                        Bukan Kelompok (Individu)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="row mb-3">
                                            <div class="col-md-4">
                                                <label class="barjas-form-label">Jabatan dalam Kelompok</label>
                                                <select class="form-select barjas-form-select" id="barjas-jabatan">
                                                    <option value="">Pilih Jabatan...</option>
                                                </select>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="barjas-form-label">Tahun Anggaran <span class="text-danger">*</span></label>
                                                <select class="form-select barjas-form-select" id="barjas-tahun-anggaran" required>
                                                </select>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="barjas-form-label">Tanggal Permohonan <span class="text-danger">*</span></label>
                                                <input type="date" class="form-control barjas-form-control" id="barjas-tanggal-terima" required>
                                            </div>
                                        </div>
                                        
                                        <!-- Data Lokasi -->
                                        <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">DATA LOKASI</h6>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Kecamatan <span class="text-danger">*</span></label>
                                                <select class="form-select barjas-form-select" id="barjas-kecamatan" required>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Desa/Kelurahan <span class="text-danger">*</span></label>
                                                <select class="form-select barjas-form-select" id="barjas-desa" required disabled>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="row mb-3">
                                            <div class="col-md-12">
                                                <label class="barjas-form-label">Alamat Lengkap</label>
                                                <textarea class="form-control barjas-form-control" id="barjas-alamat" rows="2"></textarea>
                                            </div>
                                        </div>
                                        
                                        <!-- Data Permohonan Bantuan -->
                                        <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">DATA PERMOHONAN BANTUAN</h6>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Jenis Bantuan <span class="text-danger">*</span></label>
                                                <select class="form-select barjas-form-select" id="barjas-jenis-bantuan" required>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Nama Bantuan <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control barjas-form-control" id="barjas-nama-bantuan" required>
                                            </div>
                                        </div>
                                        
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Jumlah <span class="text-danger">*</span></label>
                                                <input type="number" class="form-control barjas-form-control" id="barjas-jumlah-bantuan" required min="1">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Satuan <span class="text-danger">*</span></label>
                                                <select class="form-select barjas-form-select" id="barjas-satuan-bantuan" required>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <!-- Data Validasi -->
                                        <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">DATA VALIDASI</h6>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Nama Petugas <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control barjas-form-control" id="barjas-nama-petugas" required>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="barjas-form-label">Link Dokumen (Google Drive)</label>
                                                <input type="url" class="form-control barjas-form-control" id="barjas-drive-link">
                                            </div>
                                        </div>
                                        
                                        <div class="row mb-3">
                                            <div class="col-md-12">
                                                <label class="barjas-form-label">Kode Validasi <span class="text-danger">*</span></label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control barjas-form-control bg-light" id="barjas-kode-validasi" readonly required>
                                                    <button type="button" class="btn btn-warning barjas-btn" id="barjas-generate-kode-btn">
                                                        <i class="fas fa-key me-2"></i> Generate Kode
                                                    </button>
                                                </div>
                                                <small class="text-muted">Generate kode validasi setelah mengisi NIK</small>
                                            </div>
                                        </div>
                                        
                                        <div class="row mb-3">
                                            <div class="col-md-12">
                                                <label class="barjas-form-label">Keterangan Tambahan</label>
                                                <textarea class="form-control barjas-form-control" id="barjas-keterangan" rows="3"></textarea>
                                            </div>
                                        </div>
                                        
                                        <!-- Action Buttons -->
                                        <div class="d-flex justify-content-end border-top pt-3">
                                            <button type="reset" class="btn btn-light me-3">
                                                <i class="fas fa-redo me-2"></i> Reset Form
                                            </button>
                                            <button type="submit" class="btn btn-primary barjas-btn">
                                                <i class="fas fa-save me-2"></i> Simpan Data
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Data Tab -->
                        <div class="barjas-tab-content" id="barjas-data">
                            <h3 class="barjas-section-title">Database Permohonan Bantuan</h3>
                            <div class="barjas-card">
                                <div class="barjas-card-header">
                                    <div class="row align-items-center">
                                        <div class="col-md-6">
                                            <h6 class="mb-0"><i class="fas fa-list me-2"></i>Data Permohonan Terdaftar</h6>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <input type="text" class="form-control barjas-form-control" id="barjas-search-data" placeholder="Cari data...">
                                                <button class="btn btn-outline-secondary" type="button" id="barjas-clear-filter-btn">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <!-- Filter Row -->
                                    <div class="row mb-3">
                                        <div class="col-md-3">
                                            <label class="barjas-form-label small">Kecamatan</label>
                                            <select class="form-select form-select-sm barjas-form-select" id="barjas-filter-kecamatan">
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="barjas-form-label small">Desa</label>
                                            <select class="form-select form-select-sm barjas-form-select" id="barjas-filter-desa" disabled>
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="barjas-form-label small">Jenis Bantuan</label>
                                            <select class="form-select form-select-sm barjas-form-select" id="barjas-filter-jenis">
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="barjas-form-label small">Tahun</label>
                                            <select class="form-select form-select-sm barjas-form-select" id="barjas-filter-tahun">
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- Table -->
                                    <div class="table-responsive">
                                        <table class="table barjas-data-table">
                                            <thead>
                                                <tr>
                                                    <th width="50">No</th>
                                                    <th>Nama & Identitas</th>
                                                    <th>Lokasi & Kelompok</th>
                                                    <th>Jenis Bantuan</th>
                                                    <th>Detail Permohonan</th>
                                                    <th>Tanggal</th>
                                                    <th>Petugas</th>
                                                    <th width="120" class="text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody id="barjas-data-table-body">
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <!-- Pagination -->
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <div class="text-muted small" id="barjas-table-info">
                                            Menampilkan 0 dari 0 data
                                        </div>
                                        <nav>
                                            <ul class="pagination pagination-sm mb-0" id="barjas-pagination">
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Export Tab -->
                        <div class="barjas-tab-content" id="barjas-export">
                            <h3 class="barjas-section-title">Ekspor & Laporan</h3>
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="barjas-card text-center h-100 p-4">
                                        <div class="mb-3">
                                            <i class="fas fa-file-excel fa-4x text-success"></i>
                                        </div>
                                        <h5>Ekspor ke Excel</h5>
                                        <p class="text-muted small mb-4">
                                            Ekspor seluruh data permohonan bantuan nelayan ke format Excel untuk analisis lebih lanjut.
                                        </p>
                                        <button class="btn btn-success barjas-btn w-100" id="barjas-export-excel-btn">
                                            <i class="fas fa-download me-2"></i> Download Excel
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="barjas-card text-center h-100 p-4">
                                        <div class="mb-3">
                                            <i class="fas fa-file-pdf fa-4x text-danger"></i>
                                        </div>
                                        <h5>Cetak Laporan PDF</h5>
                                        <p class="text-muted small mb-4">
                                            Cetak laporan ringkasan data permohonan bantuan nelayan dalam format PDF resmi.
                                        </p>
                                        <button class="btn btn-danger barjas-btn w-100" id="barjas-export-pdf-btn">
                                            <i class="fas fa-print me-2"></i> Cetak Laporan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Settings Tab -->
                        <div class="barjas-tab-content" id="barjas-settings">
                            <h3 class="barjas-section-title">Pengaturan Sistem</h3>
                            <div class="barjas-card">
                                <div class="barjas-card-header">
                                    <i class="fas fa-cog me-2"></i> Konfigurasi Aplikasi
                                </div>
                                <div class="card-body">
                                    <div class="row mb-4">
                                        <div class="col-md-6">
                                            <label class="barjas-form-label">Tampilkan Data per Halaman</label>
                                            <select class="form-select barjas-form-select" id="barjas-items-per-page">
                                                <option value="10">10 Baris</option>
                                                <option value="25" selected>25 Baris</option>
                                                <option value="50">50 Baris</option>
                                                <option value="100">100 Baris</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="barjas-form-label">Mode Notifikasi</label>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="barjas-notifications-toggle" checked>
                                                <label class="form-check-label" for="barjas-notifications-toggle">
                                                    Aktifkan Notifikasi
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row mb-4">
                                        <div class="col-md-12">
                                            <label class="barjas-form-label">Mode Privasi (Sensor Data)</label>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" id="barjas-privacy-toggle">
                                                <label class="form-check-label" for="barjas-privacy-toggle">
                                                    Aktifkan Sensor Data Pribadi
                                                </label>
                                            </div>
                                            <small class="text-muted">
                                                Mode ini akan menyensor 4 digit terakhir NIK dan nomor WhatsApp untuk keamanan data.
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-12">
                                            <button class="btn btn-primary barjas-btn me-2" id="barjas-save-settings-btn">
                                                <i class="fas fa-save me-2"></i> Simpan Pengaturan
                                            </button>
                                            <button class="btn btn-outline-danger" id="barjas-reset-data-btn">
                                                <i class="fas fa-trash me-2"></i> Reset Semua Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Setup tab switching
            this.setupTabSwitching();
        },

        setupTabSwitching() {
            const menuLinks = document.querySelectorAll('.barjas-menu-link');
            const tabContents = document.querySelectorAll('.barjas-tab-content');
            
            menuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = link.getAttribute('data-target');
                    
                    // Update active menu link
                    menuLinks.forEach(menu => menu.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Show target tab content
                    tabContents.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.id === target) {
                            tab.classList.add('active');
                        }
                    });
                    
                    // Jika tab data, refresh tabel
                    if (target === 'barjas-data') {
                        BarjasTableView.renderTable();
                    }
                    
                    // Jika tab dashboard, refresh charts
                    if (target === 'barjas-dashboard') {
                        BarjasDashboard.updateDashboard();
                    }
                });
            });
        },

        setupEventListeners() {
            // Export buttons
            const exportExcelBtn = document.getElementById('barjas-export-excel-btn');
            if (exportExcelBtn) {
                exportExcelBtn.addEventListener('click', () => BarjasExportHandler.exportToExcel());
            }
            
            const exportPdfBtn = document.getElementById('barjas-export-pdf-btn');
            if (exportPdfBtn) {
                exportPdfBtn.addEventListener('click', () => BarjasExportHandler.exportToPDF());
            }
            
            // Settings
            const saveSettingsBtn = document.getElementById('barjas-save-settings-btn');
            if (saveSettingsBtn) {
                saveSettingsBtn.addEventListener('click', () => this.saveSettings());
            }
            
            const resetDataBtn = document.getElementById('barjas-reset-data-btn');
            if (resetDataBtn) {
                resetDataBtn.addEventListener('click', () => this.resetData());
            }
            
            const itemsPerPageSelect = document.getElementById('barjas-items-per-page');
            if (itemsPerPageSelect) {
                itemsPerPageSelect.value = barjasState.settings.itemsPerPage;
                itemsPerPageSelect.addEventListener('change', (e) => {
                    barjasState.settings.itemsPerPage = parseInt(e.target.value);
                    barjasState.currentPage = 1;
                    BarjasTableView.renderTable();
                });
            }
            
            const notificationsToggle = document.getElementById('barjas-notifications-toggle');
            if (notificationsToggle) {
                notificationsToggle.checked = barjasState.settings.notifications;
                notificationsToggle.addEventListener('change', (e) => {
                    barjasState.settings.notifications = e.target.checked;
                });
            }
            
            const privacyToggle = document.getElementById('barjas-privacy-toggle');
            if (privacyToggle) {
                privacyToggle.checked = barjasState.settings.privacyMode;
                privacyToggle.addEventListener('change', (e) => {
                    barjasState.settings.privacyMode = e.target.checked;
                    BarjasTableView.renderTable();
                });
            }
        },

        saveSettings() {
            if (BarjasStorage.saveSettings()) {
                BarjasUtils.showNotification('Pengaturan berhasil disimpan', 'success');
            }
        },

        resetData() {
            if (confirm('Apakah Anda yakin ingin menghapus SEMUA data BARJAS? Tindakan ini tidak dapat dibatalkan!')) {
                const pin = prompt('Masukkan PIN keamanan untuk konfirmasi:');
                if (pin === BARJAS_CONFIG.SECURITY_PIN) {
                    if (BarjasStorage.clearAll()) {
                        BarjasTableView.renderTable();
                        BarjasDashboard.updateDashboard();
                        BarjasUtils.showNotification('Semua data berhasil direset', 'success');
                    }
                } else {
                    BarjasUtils.showNotification('PIN salah! Data tidak direset', 'error');
                }
            }
        },

        showDetail(id) {
            const data = barjasState.data.find(item => item.id == id);
            if (!data) {
                BarjasUtils.showNotification('Data tidak ditemukan', 'error');
                return;
            }
            
            const modalHTML = `
                <div class="modal fade" id="barjasDetailModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content barjas-modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title">
                                    <i class="fas fa-id-card me-2"></i>Detail Data Permohonan
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Nama Lengkap</div>
                                        <div class="barjas-detail-modal-value">${data.nama || '-'}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">NIK</div>
                                        <div class="barjas-detail-modal-value font-monospace">${BarjasUtils.formatPrivacy(data.nik)}</div>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">WhatsApp</div>
                                        <div class="barjas-detail-modal-value">
                                            ${data.whatsapp ? BarjasUtils.formatPrivacy(data.whatsapp) : '<span class="text-muted">TIDAK ADA</span>'}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Kelompok & Jabatan</div>
                                        <div class="barjas-detail-modal-value">
                                            ${data.namaKelompok || '-'} (${data.jabatan || '-'})
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Lokasi</div>
                                        <div class="barjas-detail-modal-value">
                                            ${data.desa || '-'}, ${data.kecamatan || '-'}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Alamat</div>
                                        <div class="barjas-detail-modal-value">${data.alamat || '-'}</div>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <div class="barjas-detail-modal-label">Detail Permohonan Bantuan</div>
                                        <div class="barjas-detail-modal-value bg-warning bg-opacity-10">
                                            <div class="fw-bold">${data.namaBantuan || '-'}</div>
                                            <div class="small">
                                                Jenis: ${data.jenisBantuan || '-'} | 
                                                Jumlah: ${data.jumlahBantuan || '-'} ${data.satuanBantuan || ''} | 
                                                Tahun: ${data.tahunAnggaran || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Tanggal Permohonan</div>
                                        <div class="barjas-detail-modal-value">${BarjasUtils.formatDate(data.tanggalTerima)}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Petugas Validasi</div>
                                        <div class="barjas-detail-modal-value">${data.namaPetugas || '-'}</div>
                                    </div>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Kode Validasi</div>
                                        <div class="barjas-detail-modal-value font-monospace fw-bold">${data.kodeValidasi || '-'}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="barjas-detail-modal-label">Link Dokumen</div>
                                        <div class="barjas-detail-modal-value">
                                            ${data.driveLink 
                                                ? `<a href="${data.driveLink}" target="_blank" class="barjas-drive-link">${data.driveLink.substring(0, 40)}...</a>`
                                                : '<span class="text-muted">-</span>'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="barjas-detail-modal-label">Keterangan</div>
                                        <div class="barjas-detail-modal-value">${data.keterangan || '-'}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                <button type="button" class="btn btn-primary" onclick="window.BARJAS.buatPermohonan()">
                                    <i class="fas fa-file-pdf me-2"></i> Buat Permohonan PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Tambahkan modal ke DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            
            // Tampilkan modal
            const modalElement = document.getElementById('barjasDetailModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Hapus modal setelah ditutup
                modalElement.addEventListener('hidden.bs.modal', function() {
                    document.body.removeChild(modalContainer);
                });
            }
        },

        editData(id) {
            BarjasFormHandler.editData(id);
        },

        deleteData(id) {
            if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
            
            const index = barjasState.data.findIndex(item => item.id == id);
            if (index > -1) {
                barjasState.data.splice(index, 1);
                BarjasStorage.saveData();
                BarjasTableView.renderTable();
                BarjasDashboard.updateDashboard();
                BarjasUtils.showNotification('Data berhasil dihapus', 'success');
            }
        },

        changePage(page) {
            if (page < 1) return;
            const totalPages = Math.ceil(barjasState.data.length / barjasState.settings.itemsPerPage);
            if (page > totalPages && totalPages > 0) return;
            
            barjasState.currentPage = page;
            BarjasTableView.renderTable();
            
            // Scroll ke atas tabel
            const tableElement = document.querySelector('.barjas-data-table');
            if (tableElement) {
                tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        buatPermohonan() {
            if (!barjasState.lastSavedData) {
                BarjasUtils.showNotification('Tidak ada data yang disimpan untuk dibuat permohonan', 'error');
                return;
            }
            
            // Generate PDF
            BarjasPermohonan.generatePermohonanPDF(barjasState.lastSavedData);
        }
    };

    // --- INISIALISASI DAN EKSPOR KE GLOBAL SCOPE ---
    window.BARJAS_INITIALIZED = true;
    window.BARJAS = {
        init: (containerId) => BarjasApp.init(containerId),
        showDetail: (id) => BarjasApp.showDetail(id),
        editData: (id) => BarjasApp.editData(id),
        deleteData: (id) => BarjasApp.deleteData(id),
        changePage: (page) => BarjasApp.changePage(page),
        buatPermohonan: () => BarjasApp.buatPermohonan(),
        
        // Fungsi utilitas
        showNotification: (message, type) => BarjasUtils.showNotification(message, type),
        formatDate: (date) => BarjasUtils.formatDate(date),
        formatNumber: (num) => BarjasUtils.formatNumber(num),
        
        // Data getter
        getData: () => [...barjasState.data],
        getSettings: () => ({ ...barjasState.settings }),
        
        // Konfigurasi
        config: BARJAS_CONFIG,
        
        // Fungsi untuk refresh data
        refreshData: () => {
            BarjasTableView.renderTable();
            BarjasDashboard.updateDashboard();
        }
    };

    console.log('✅ Sistem BARJAS v' + BARJAS_CONFIG.VERSION + ' loaded successfully');
})();

// Auto-initialize jika ada container dengan id 'barjas-container'
document.addEventListener('DOMContentLoaded', function() {
    // Tunggu sebentar untuk memastikan DOM sudah siap
    setTimeout(() => {
        const barjasContainer = document.getElementById('barjas-container');
        if (barjasContainer && typeof BARJAS !== 'undefined') {
            console.log('Auto-initializing BARJAS in container...');
            BARJAS.init('barjas-container');
        }
    }, 1000);
});
