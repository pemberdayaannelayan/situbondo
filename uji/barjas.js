// barjas.js - Sistem Bantuan Nelayan Kab. Situbondo
// Professional Edition v2.2

// --- GLOBAL VARIABLES & CONSTANTS ---
let appData = [];
let appSettings = {
    securityCode: 'BidangPN1945',
    itemsPerPage: 25,
    notifications: true,
    appName: 'SISTEM BANTUAN NELAYAN',
    appSubtitle: 'Dinas Peternakan dan Perikanan Kab. Situbondo',
    defaultTahun: new Date().getFullYear(),
    lastBackupDate: '-',
    privacyMode: true
};
let currentPage = 1;
let filteredData = [];
let isFilterActive = false;
let loginAttempts = 0;
let isBlocked = false;
let blockTimeout;
let generatedCodes = {};
let mapDashboard = null; // Peta dashboard

const SECURITY_CONSTANTS = {
    PIN: '17081945',
    DEFAULT_PASS: 'BidangPN1945',
    EXTRACT_CODE: '19450817' // Kode keamanan untuk ekstrak data
};

let pendingSecurityAction = null;
let generatedPetaData = null; // Menyimpan data peta yang dihasilkan

// DATA DESA/KECAMATAN YANG DIPERBARUI SESUAI PERMINTAAN
const kecamatanList = [
    "Arjasa", "Asembagus", "Banyuglugur", "Banyuputih", "Besuki", 
    "Bungatan", "Jangkar", "Jatibanteng", "Kapongan", "Kendit", 
    "Mangaran", "Mlandingan", "Panarukan", "Panji", "Situbondo", 
    "Suboh", "Sumbermalang"
];

// Data desa per kecamatan yang DIPERBARUI SESUAI PERMINTAAN
const desaByKecamatan = {
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
};

// Gabungkan semua desa untuk dropdown
const desaList = Object.values(desaByKecamatan).flat().sort();

// ==================== DATABASE KOORDINAT YANG DIPERBARUI ====================
// Database koordinat kecamatan yang AKURAT untuk Kabupaten Situbondo (diperbarui)
const koordinatKecamatan = {
    "Arjasa": { lat: -7.71924, lng: 114.12254 },
    "Asembagus": { lat: -7.7541, lng: 114.2506 },
    "Banyuglugur": { lat: -7.7766, lng: 113.9008 },
    "Banyuputih": { lat: -7.7065, lng: 114.0108 },
    "Besuki": { lat: -7.7387, lng: 113.6976 },
    "Bungatan": { lat: -7.7032, lng: 113.8236 },
    "Jangkar": { lat: -7.7895, lng: 114.3619 },
    "Jatibanteng": { lat: -7.6865, lng: 113.9365 },
    "Kapongan": { lat: -7.7118, lng: 114.0581 },
    "Kendit": { lat: -7.7307, lng: 113.9243 },
    "Mangaran": { lat: -7.6545, lng: 114.0604 },
    "Mlandingan": { lat: -7.6644, lng: 113.8778 },
    "Panarukan": { lat: -7.6973, lng: 113.7690 },
    "Panji": { lat: -7.7102, lng: 113.6783 },
    "Situbondo": { lat: -7.7085, lng: 114.0064 },
    "Suboh": { lat: -7.8478, lng: 113.7583 },
    "Sumbermalang": { lat: -7.8774, lng: 113.8440 }
};

// Database koordinat desa yang DIPERBARUI
const koordinatDesa = {
    // ===== KECAMATAN ARJASA =====
    "Arjasa, Arjasa": { lat: -7.71924, lng: 114.12254 },
    "Bayeman, Arjasa": { lat: -7.7461, lng: 114.0762 },
    "Curah Tatal, Arjasa": { lat: -7.8194, lng: 114.0368 },
    "Jatisari, Arjasa": { lat: -7.7748, lng: 114.0797 },
    "Kayumas, Arjasa": { lat: -7.8057, lng: 114.1088 },
    "Kedungdowo, Arjasa": { lat: -7.7531, lng: 114.0657 },
    "Ketowan, Arjasa": { lat: -7.7447, lng: 114.0947 },
    "Lamongan, Arjasa": { lat: -7.726567, lng: 114.133433 },

    // ===== KECAMATAN ASEMBAGUS =====
    "Asembagus, Asembagus": { lat: -7.7541, lng: 114.2506 },
    "Awar-awar, Asembagus": { lat: -7.7265, lng: 114.2296 },
    "Bantal, Asembagus": { lat: -7.7481, lng: 114.3124 },
    "Gudang, Asembagus": { lat: -7.7266, lng: 114.2764 },
    "Kedunglo, Asembagus": { lat: -7.7988, lng: 114.2881 },
    "Kertosari, Asembagus": { lat: -7.8175, lng: 114.2651 },
    "Mojosari, Asembagus": { lat: -7.7914, lng: 114.3178 },
    "Parante, Asembagus": { lat: -7.7678, lng: 114.2255 },
    "Trigonco, Asembagus": { lat: -7.7722, lng: 114.2441 },
    "Wringin Anom, Asembagus": { lat: -7.7347, lng: 114.3050 },

    // ===== KECAMATAN BANYUGLUGUR =====
    "Banyuglugur, Banyuglugur": { lat: -7.7766, lng: 113.9008 },
    "Kalianget, Banyuglugur": { lat: -7.8058, lng: 113.9305 },
    "Kalisari, Banyuglugur": { lat: -7.8222, lng: 113.8993 },
    "Lubawang, Banyuglugur": { lat: -7.8048, lng: 113.8761 },
    "Selobanteng, Banyuglugur": { lat: -7.7394, lng: 113.9384 },
    "Telempong, Banyuglugur": { lat: -7.8109, lng: 113.9567 },
    "Tepos, Banyuglugur": { lat: -7.7683, lng: 113.8925 },

    // ===== KECAMATAN BANYUPUTIH =====
    "Banyuputih, Banyuputih": { lat: -7.7065, lng: 114.0108 },
    "Sumberanyar, Banyuputih": { lat: -7.7130, lng: 113.9708 },
    "Sumberejo, Banyuputih": { lat: -7.7240, lng: 113.9747 },
    "Sumberwaru, Banyuputih": { lat: -7.7365, lng: 113.9876 },
    "Wonorejo, Banyuputih": { lat: -7.6908, lng: 114.0023 },

    // ===== KECAMATAN BESUKI =====
    "Besuki, Besuki": { lat: -7.7387, lng: 113.6976 },
    "Blimbing, Besuki": { lat: -7.7528, lng: 113.7166 },
    "Bloro, Besuki": { lat: -7.7368, lng: 113.7585 },
    "Demung, Besuki": { lat: -7.7462, lng: 113.7414 },
    "Jetis, Besuki": { lat: -7.7170, lng: 113.7418 },
    "Kalimas, Besuki": { lat: -7.7617, lng: 113.7324 },
    "Langkap, Besuki": { lat: -7.7485, lng: 113.7243 },
    "Pesisir, Besuki": { lat: -7.728180, lng: 113.684984 },
    "Sumberejo, Besuki": { lat: -7.7358, lng: 113.7163 },
    "Widoropayung, Besuki": { lat: -7.7769, lng: 113.6975 },

    // ===== KECAMATAN BUNGATAN =====
    "Bletok, Bungatan": { lat: -7.732109, lng: 113.789552 },
    "Bungatan, Bungatan": { lat: -7.7032, lng: 113.8236 },
    "Mlandingan Wetan, Bungatan": { lat: -7.6726, lng: 113.8233 },
    "Pasir Putih, Bungatan": { lat: -7.7138, lng: 113.8772 },
    "Patemon, Bungatan": { lat: -7.7101, lng: 113.8187 },
    "Selowogo, Bungatan": { lat: -7.6781, lng: 113.9072 },
    "Sumbertengah, Bungatan": { lat: -7.7113, lng: 113.8429 },

    // ===== KECAMATAN JANGKAR =====
    "Agel, Jangkar": { lat: -7.8117, lng: 114.3519 },
    "Curah Kalak, Jangkar": { lat: -7.7614, lng: 114.3308 },
    "Gadingan, Jangkar": { lat: -7.8301, lng: 114.3728 },
    "Jangkar, Jangkar": { lat: -7.7895, lng: 114.3619 },
    "Kumbangsari, Jangkar": { lat: -7.8408, lng: 114.3942 },
    "Palangan, Jangkar": { lat: -7.7650, lng: 114.3784 },
    "Pesanggrahan, Jangkar": { lat: -7.7810, lng: 114.3866 },
    "Sopet, Jangkar": { lat: -7.8247, lng: 114.3484 },

    // ===== KECAMATAN JATIBANTENG =====
    "Curahsuri, Jatibanteng": { lat: -7.6585, lng: 113.9867 },
    "Jatibanteng, Jatibanteng": { lat: -7.6865, lng: 113.9365 },
    "Kembangsari, Jatibanteng": { lat: -7.6784, lng: 113.9283 },
    "Pategalan, Jatibanteng": { lat: -7.7112, lng: 113.9831 },
    "Patemon, Jatibanteng": { lat: -7.6633, lng: 113.9349 },
    "Semambung, Jatibanteng": { lat: -7.6560, lng: 113.9516 },
    "Sumberanyar, Jatibanteng": { lat: -7.6799, lng: 114.0128 },
    "Wringinanom, Jatibanteng": { lat: -7.6915, lng: 113.9905 },

    // ===== KECAMATAN KAPONGAN =====
    "Curah Cottok, Kapongan": { lat: -7.6982, lng: 114.0678 },
    "Gebangan, Kapongan": { lat: -7.7252, lng: 114.0447 },
    "Kandang, Kapongan": { lat: -7.7267, lng: 114.0933 },
    "Kapongan, Kapongan": { lat: -7.7118, lng: 114.0581 },
    "Kesambi Rampak, Kapongan": { lat: -7.7431, lng: 114.0696 },
    "Landangan, Kapongan": { lat: -7.6947, lng: 114.0411 },
    "Peleyan, Kapongan": { lat: -7.7053, lng: 114.0291 },
    "Pokaan, Kapongan": { lat: -7.7174, lng: 114.1146 },
    "Seletreng, Kapongan": { lat: -7.6781, lng: 114.1095 },
    "Wonokoyo, Kapongan": { lat: -7.7251, lng: 114.1111 },

    // ===== KECAMATAN KENDIT =====
    "Balung, Kendit": { lat: -7.7244, lng: 113.9056 },
    "Bugeman, Kendit": { lat: -7.7479, lng: 113.9122 },
    "Kendit, Kendit": { lat: -7.7307, lng: 113.9243 },
    "Klatakan, Kendit": { lat: -7.7478, lng: 113.8964 },
    "Kukusan, Kendit": { lat: -7.7637, lng: 113.9076 },
    "Rajekwesi, Kendit": { lat: -7.7605, lng: 113.8901 },
    "Tambak Ukir, Kendit": { lat: -7.7458, lng: 113.8779 },

    // ===== KECAMATAN MANGARAN =====
    "Mangaran, Mangaran": { lat: -7.6545, lng: 114.0604 },
    "Semiring, Mangaran": { lat: -7.629980, lng: 114.022293 },
    "Tanjung Glugur, Mangaran": { lat: -7.6686, lng: 114.0526 },
    "Tanjung Kamal, Mangaran": { lat: -7.66232, lng: 114.05351 },
    "Tanjung Pecinan, Mangaran": { lat: -7.63295, lng: 114.03352 },
    "Trebungan, Mangaran": { lat: -7.6624, lng: 114.0733 },

    // ===== KECAMATAN MLANDINGAN =====
    "Alas Bayur, Mlandingan": { lat: -7.6644, lng: 113.8778 },
    "Campoan, Mlandingan": { lat: -7.6439, lng: 113.8425 },
    "Mlandingan Kulon, Mlandingan": { lat: -7.75250, lng: 113.76926 },
    "Selomukti, Mlandingan": { lat: -7.75375, lng: 113.75871 },
    "Sumberanyar, Mlandingan": { lat: -7.6594, lng: 113.8946 },
    "Sumber Pinang, Mlandingan": { lat: -7.6743, lng: 113.8944 },
    "Trebungan, Mlandingan": { lat: -7.6436, lng: 113.8967 },

    // ===== KECAMATAN PANARUKAN =====
    "Alasmalang, Panarukan": { lat: -7.6973, lng: 113.7690 },
    "Duwet, Panarukan": { lat: -7.6980, lng: 113.7885 },
    "Gelung, Panarukan": { lat: -7.7137, lng: 113.8031 },
    "Kilensari, Panarukan": { lat: -7.696519, lng: 113.939523 },
    "Paowan, Panarukan": { lat: -7.7301, lng: 113.7803 },
    "Peleyan, Panarukan": { lat: -7.6953, lng: 113.8074 },
    "Sumberkolak, Panarukan": { lat: -7.7121, lng: 113.7621 },
    "Wringinanom, Panarukan": { lat: -7.7064, lng: 113.8259 },

    // ===== KECAMATAN PANJI =====
    "Battal, Panji": { lat: -7.7102, lng: 113.6783 },
    "Curah Jeru, Panji": { lat: -7.6944, lng: 113.6961 },
    "Juglangan, Panji": { lat: -7.6949, lng: 113.6656 },
    "Kayu Putih, Panji": { lat: -7.7028, lng: 113.6740 },
    "Klampokan, Panji": { lat: -7.7275, lng: 113.6485 },
    "Panji Kidul, Panji": { lat: -7.7129, lng: 113.7041 },
    "Panji Lor, Panji": { lat: -7.7022, lng: 113.7062 },
    "Sliwung, Panji": { lat: -7.7191, lng: 113.6809 },
    "Tenggir, Panji": { lat: -7.7166, lng: 113.6582 },
    "Tokelan, Panji": { lat: -7.7323, lng: 113.6706 },
    "Ardirejo, Panji": { lat: -7.7158, lng: 113.6947 },
    "Mimbaan, Panji": { lat: -7.7094, lng: 113.6955 },

    // ===== KECAMATAN SITUBONDO =====
    "Kalibagor, Situbondo": { lat: -7.7085, lng: 114.0064 },
    "Kotakan, Situbondo": { lat: -7.6817, lng: 114.0228 },
    "Olean, Situbondo": { lat: -7.6822, lng: 114.0370 },
    "Talkandang, Situbondo": { lat: -7.6684, lng: 114.0478 },
    "Dawuhan, Situbondo": { lat: -7.6929, lng: 113.9940 },
    "Patokan, Situbondo": { lat: -7.6732, lng: 113.9774 },

    // ===== KECAMATAN SUBOH =====
    "Buduan, Suboh": { lat: -7.8526, lng: 113.7662 },
    "Cemara, Suboh": { lat: -7.8270, lng: 113.7428 },
    "Dawuan, Suboh": { lat: -7.8401, lng: 113.7722 },
    "Gunung Malang, Suboh": { lat: -7.8711, lng: 113.7492 },
    "Gunung Putri, Suboh": { lat: -7.8650, lng: 113.7328 },
    "Ketah, Suboh": { lat: -7.8617, lng: 113.7897 },
    "Mojodungkol, Suboh": { lat: -7.8363, lng: 113.7832 },
    "Suboh, Suboh": { lat: -7.8478, lng: 113.7583 },

    // ===== KECAMATAN SUMBERMALANG =====
    "Alastengah, Sumbermalang": { lat: -7.8774, lng: 113.8440 },
    "Baderan, Sumbermalang": { lat: -7.8321, lng: 113.8217 },
    "Kalirejo, Sumbermalang": { lat: -7.8206, lng: 113.8528 },
    "Plalangan, Sumbermalang": { lat: -7.8633, lng: 113.8632 },
    "Sumberargo, Sumbermalang": { lat: -7.8408, lng: 113.8080 },
    "Taman, Sumbermalang": { lat: -7.8485, lng: 113.8377 },
    "Tamankursi, Sumbermalang": { lat: -7.8644, lng: 113.8259 },
    "Tamansari, Sumbermalang": { lat: -7.8621, lng: 113.8128 },
    "Tlogosari, Sumbermalang": { lat: -7.8819, lng: 113.8246 }
};

// ==================== DATA CONTOH UNTUK PETA STATISTIK ====================
const SAMPLE_DATA = {
    metadata: {
        lastUpdate: "9 Desember 2025 pukul 23.35",
        totalDesa: 136,
        totalPenerima: 2487,
        generatedAt: "2025-12-09T23:35:00.000Z",
        timestamp: 1733772900000,
        sumber: "Sistem Bantuan Nelayan Kab. Situbondo",
        instansi: "Dinas Peternakan dan Perikanan Kab. Situbondo",
        bidang: "Pemberdayaan Nelayan",
        versi: "2.0"
    },
    summary: {
        totalBantuanBarang: 3150,
        totalBantuanUang: 1850000000,
        totalBantuanJasa: 420,
        desaTerbanyak: ["Panarukan, Panarukan", 145]
    },
    data: [
        {
            id: "1",
            desa: "Panarukan",
            kecamatan: "Panarukan",
            jumlahPenerima: 145,
            totalBantuanBarang: 180,
            totalBantuanUang: 85000000,
            totalBantuanJasa: 25,
            rataBantuan: 1.24,
            koordinat: { lat: -7.7069, lng: 113.6347 },
            tahunDistribusi: [
                { tahun: "2023", jumlah: 65 },
                { tahun: "2024", jumlah: 80 }
            ],
            jenisBantuan: [
                { jenis: "Jaring", jumlah: 85 },
                { jenis: "Perahu", jumlah: 15 },
                { jenis: "Mesin", jumlah: 45 },
                { jenis: "Uang Tunai", jumlah: 35 },
                { jenis: "Pelatihan", jumlah: 25 }
            ],
            kelompokDistribusi: [
                { kelompok: "Nelayan Tradisional", jumlah: 95 },
                { kelompok: "Nelayan Modern", jumlah: 35 },
                { kelompok: "Individu", jumlah: 15 }
            ],
            statistik: {
                uang: { jumlah: 35, nilai: 85000000 },
                barang: { jumlah: 145, nilai: 180 },
                jasa: { jumlah: 25, nilai: 25 }
            },
            detailPenerima: [],
            warnaIntensitas: 1.0,
            popupContent: "<strong>Panarukan, Panarukan</strong><br>Jumlah Penerima: 145<br>Total Bantuan: Rp 85.000.000 + 180 unit + 25 paket<br>Uang: 35 penerima (Rp 85.000.000)<br>Barang: 145 penerima (180 unit)<br>Jasa: 25 penerima (25 paket)"
        }
    ]
};

// --- APPLICATION LIFECYCLE ---
document.addEventListener('DOMContentLoaded', function() {
    // Cek jika ada error di console
    if (typeof console !== 'undefined') {
        console.log('Aplikasi Sistem Bantuan Nelayan Kab. Situbondo diinisialisasi');
    }
    
    initializeApp();
    setupEventListeners();
    
    // Tampilkan modal login
    try {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    } catch (error) {
        console.error('Error menampilkan modal login:', error);
    }
});

function initializeApp() {
    loadSettings();
    loadData();
    
    fillYearDropdowns();
    fillKecamatanDropdown();
    initializeDesaDropdown();
    
    // Fill filter dropdowns for data table
    fillFilterDropdownsForDataTable();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggalTerima').value = today;
    
    initializeCharts();
    setupBrowserInfo();
    updateDashboard();
    applySettingsToUI();
    
    // Initialize map when dashboard tab is active
    setTimeout(initializeMapDashboard, 500);
}

function setupEventListeners() {
    // Login & Auth
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Welcome Modal
    document.getElementById('welcomeReloadBtn').addEventListener('click', handleWelcomeReload);
    document.getElementById('skipReloadBtn').addEventListener('click', handleSkipReload);
    
    // Password Visibility Toggles
    const toggleHandlers = [
        { btn: '.toggle-password', input: 'securityCode' },
        { btn: '.toggle-password-settings', input: 'settingSecurityCode' },
        { btn: '.toggle-password-privacy', input: 'privacyPasswordInput' }
    ];
    
    toggleHandlers.forEach(handler => {
        const btn = document.querySelector(handler.btn);
        if (btn) {
            btn.addEventListener('click', function() {
                togglePasswordVisibility(this, handler.input);
            });
        }
    });
    
    // Main Input Form
    document.getElementById('inputForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('inputForm').addEventListener('reset', resetForm);
    
    // Tombol "Tidak Ada" WhatsApp
    const btnTidakAdaWhatsapp = document.getElementById('btnTidakAdaWhatsapp');
    if (btnTidakAdaWhatsapp) {
        btnTidakAdaWhatsapp.addEventListener('click', setTidakAdaWhatsapp);
    }
    
    const btnBukanKelompok = document.getElementById('btnBukanKelompok');
    if (btnBukanKelompok) {
        btnBukanKelompok.addEventListener('click', setBukanKelompok);
    }
    
    const generateKodeBtn = document.getElementById('generateKodeBtn');
    if (generateKodeBtn) {
        generateKodeBtn.addEventListener('click', generateKodeValidasi);
    }
    
    const jabatanSelect = document.getElementById('jabatan');
    if (jabatanSelect) {
        jabatanSelect.addEventListener('change', handleJabatanChange);
    }
    
    const nikInput = document.getElementById('nik');
    if (nikInput) {
        nikInput.addEventListener('input', () => {
            document.getElementById('kodeValidasi').value = '';
            checkNikForGeneratedCode();
        });
    }

    // Form Live Validation
    ['nama', 'nik', 'whatsapp', 'namaPetugas', 'namaBantuan', 'jumlahBantuan', 'driveLink', 'kodeValidasi', 'kecamatan', 'desa', 'tanggalTerima'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => clearError(id));
        }
    });
    
    // Data Table & Search
    const searchData = document.getElementById('searchData');
    if (searchData) {
        searchData.addEventListener('input', handleSearch);
    }
    
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
    }
    
    // Filter for Data Table
    const filterKecamatanData = document.getElementById('filterKecamatanData');
    if (filterKecamatanData) {
        filterKecamatanData.addEventListener('change', handleDataTableFilter);
    }
    
    const filterDesaData = document.getElementById('filterDesaData');
    if (filterDesaData) {
        filterDesaData.addEventListener('change', handleDataTableFilter);
    }
    
    // Advanced Filter
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilter);
    }
    
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilter);
    }
    
    // Print & Export Actions
    const printPdfBtn = document.getElementById('printPdfBtn');
    if (printPdfBtn) {
        printPdfBtn.addEventListener('click', printToPdf);
    }
    
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', showPreview);
    }
    
    // Export buttons
    const exportButtons = {
        'exportExcelBtn': () => exportData('excel'),
        'exportCsvBtn': () => exportData('csv'),
        'exportJsonBtn': () => exportData('json'),
        'exportPdfBtn': () => exportData('pdf')
    };
    
    Object.keys(exportButtons).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', exportButtons[id]);
        }
    });
    
    // System Management
    const backupDataBtn = document.getElementById('backupDataBtn');
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
    }
    
    const restoreFileInput = document.getElementById('restoreFileInput');
    if (restoreFileInput) {
        restoreFileInput.addEventListener('change', enableRestoreButton);
    }
    
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    if (restoreDataBtn) {
        restoreDataBtn.addEventListener('click', restoreData);
    }
    
    const resetConfirmationInput = document.getElementById('resetConfirmationInput');
    if (resetConfirmationInput) {
        resetConfirmationInput.addEventListener('input', enableResetButton);
    }
    
    // Refactored Reset Listener (Double Security)
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', function() {
            const inputVal = document.getElementById('resetConfirmationInput').value;
            if (inputVal === 'RESET') {
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmResetModal'));
                if (modal) modal.hide();
                
                requestHighSecurityAction(() => {
                    performFactoryReset();
                });
            }
        });
    }
    
    // Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSaveSettings);
    }
    
    // Privacy Toggle Logic
    const privacyToggle = document.getElementById('privacyToggle');
    if (privacyToggle) {
        privacyToggle.addEventListener('click', handlePrivacyToggle);
    }
    
    const submitPrivacyAuth = document.getElementById('submitPrivacyAuth');
    if (submitPrivacyAuth) {
        submitPrivacyAuth.addEventListener('click', checkPrivacyPassword);
    }
    
    const closePrivacyModal = document.getElementById('closePrivacyModal');
    if (closePrivacyModal) {
        closePrivacyModal.addEventListener('click', cancelPrivacyChange);
    }
    
    // Universal PIN Logic
    const submitUniversalPin = document.getElementById('submitUniversalPin');
    if (submitUniversalPin) {
        submitUniversalPin.addEventListener('click', handleUniversalPinSubmit);
    }
    
    // UI Helpers
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleMobileMenu);
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && document.getElementById('sidebarMenu').classList.contains('mobile-show')) {
                toggleMobileMenu();
            }
            
            // Initialize map when dashboard tab is clicked
            if (link.id === 'v-pills-dashboard-tab') {
                setTimeout(initializeMapDashboard, 300);
            }
        });
    });

    const fabBtn = document.getElementById('fabBtn');
    if (fabBtn) {
        fabBtn.addEventListener('click', () => {
            const inputTab = document.getElementById('v-pills-input-tab');
            if (inputTab) inputTab.click();
        });
    }
    
    const jenisBantuan = document.getElementById('jenisBantuan');
    if (jenisBantuan) {
        jenisBantuan.addEventListener('change', updateSatuanBantuan);
    }
    
    const printFromPreviewBtn = document.getElementById('printFromPreviewBtn');
    if (printFromPreviewBtn) {
        printFromPreviewBtn.addEventListener('click', () => window.print());
    }
    
    const logoutTab = document.getElementById('v-pills-logout-tab');
    if (logoutTab) {
        logoutTab.addEventListener('click', logout);
    }
    
    const reloadRepoBtn = document.getElementById('btn-reload-repo');
    if (reloadRepoBtn) {
        reloadRepoBtn.addEventListener('click', handleReloadFromRepo);
    }

    // Smart Menu Logic
    setupSmartMenu();

    // FITUR BARU: Ekstrak Data
    const generateDataPetaBtn = document.getElementById('generateDataPetaBtn');
    if (generateDataPetaBtn) {
        generateDataPetaBtn.addEventListener('click', generateDataPeta);
    }
    
    const downloadDataPetaBtn = document.getElementById('downloadDataPetaBtn');
    if (downloadDataPetaBtn) {
        downloadDataPetaBtn.addEventListener('click', downloadDataPeta);
    }

    window.addEventListener('beforeunload', autoBackupData);
    
    // PERBAIKAN: Event listener untuk dropdown kecamatan di form input
    const kecamatanSelect = document.getElementById('kecamatan');
    if (kecamatanSelect) {
        kecamatanSelect.addEventListener('change', function() {
            updateDesaDropdown(this.value);
        });
    }
}

// --- FUNGSI BARU: MAP DASHBOARD ---
function initializeMapDashboard() {
    const mapElement = document.getElementById('mapDashboard');
    if (!mapElement || !appData || appData.length === 0) return;
    
    // Remove existing map if exists
    if (mapDashboard) {
        mapDashboard.remove();
        mapDashboard = null;
    }
    
    // Create new map
    mapDashboard = L.map('mapDashboard').setView([-7.7062, 113.9603], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(mapDashboard);
    
    // Group markers by desa/kecamatan for better visualization
    const markersByLocation = {};
    
    appData.forEach((data, index) => {
        const locationKey = `${data.desa}, ${data.kecamatan}`;
        if (!markersByLocation[locationKey]) {
            markersByLocation[locationKey] = {
                location: locationKey,
                data: [],
                coordinates: data.koordinat || getKoordinatDesa(data.desa, data.kecamatan)
            };
        }
        markersByLocation[locationKey].data.push(data);
    });
    
    // Add cluster markers
    Object.values(markersByLocation).forEach(locationData => {
        if (locationData.coordinates && locationData.data.length > 0) {
            const jumlahPenerima = locationData.data.length;
            const jenisBantuan = locationData.data.reduce((acc, d) => {
                acc[d.jenisBantuan] = (acc[d.jenisBantuan] || 0) + 1;
                return acc;
            }, {});
            
            const jenisBantuanStr = Object.entries(jenisBantuan)
                .map(([jenis, count]) => `${jenis}: ${count}`)
                .join(', ');
            
            const totalBantuan = locationData.data.reduce((sum, d) => sum + (parseFloat(d.jumlahBantuan) || 0), 0);
            
            // Create popup content
            const popupContent = `
                <div class="map-marker-popup">
                    <div class="popup-title">${locationData.location}</div>
                    <div class="popup-item"><strong>Jumlah Penerima:</strong> ${jumlahPenerima}</div>
                    <div class="popup-item"><strong>Jenis Bantuan:</strong> ${jenisBantuanStr}</div>
                    <div class="popup-item"><strong>Total Bantuan:</strong> ${formatNumber(totalBantuan)}</div>
                    <div class="popup-item"><strong>Koordinat:</strong> ${locationData.coordinates.lat.toFixed(6)}, ${locationData.coordinates.lng.toFixed(6)}</div>
                    <hr>
                    <div class="small text-muted">Klik untuk melihat detail penerima</div>
                </div>
            `;
            
            // Create marker with different colors based on jumlah penerima
            let markerColor = 'blue';
            if (jumlahPenerima > 10) markerColor = 'red';
            else if (jumlahPenerima > 5) markerColor = 'orange';
            else if (jumlahPenerima > 2) markerColor = 'green';
            
            const marker = L.marker([locationData.coordinates.lat, locationData.coordinates.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(mapDashboard);
            
            // Add popup with detailed information
            marker.bindPopup(popupContent);
            
            // Add click event to show detailed list
            marker.on('click', function() {
                const detailList = locationData.data.map((d, i) => `
                    <div class="popup-item small">
                        <strong>${i+1}. ${d.nama}</strong><br>
                        ${d.jenisBantuan}: ${formatNumber(d.jumlahBantuan)} ${d.satuanBantuan}<br>
                        ${formatDate(d.tanggalTerima)}
                    </div>
                `).join('');
                
                const detailedPopup = `
                    <div class="map-marker-popup">
                        <div class="popup-title">Detail Penerima - ${locationData.location}</div>
                        <div style="max-height: 200px; overflow-y: auto;">
                            ${detailList}
                        </div>
                        <div class="small text-muted mt-2">Total: ${jumlahPenerima} penerima</div>
                    </div>
                `;
                
                marker.setPopupContent(detailedPopup);
            });
        }
    });
    
    // Fit bounds to show all markers
    const markerBounds = L.latLngBounds(
        Object.values(markersByLocation).map(loc => [loc.coordinates.lat, loc.coordinates.lng])
    );
    
    if (Object.values(markersByLocation).length > 1) {
        mapDashboard.fitBounds(markerBounds, { padding: [50, 50] });
    }
    
    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        div.innerHTML = `
            <h6 style="margin-top: 0; margin-bottom: 8px;"><strong>Legenda Marker</strong></h6>
            <div><span style="display: inline-block; width: 12px; height: 12px; background: red; border-radius: 50%; margin-right: 5px;"></span> > 10 penerima</div>
            <div><span style="display: inline-block; width: 12px; height: 12px; background: orange; border-radius: 50%; margin-right: 5px;"></span> 5-10 penerima</div>
            <div><span style="display: inline-block; width: 12px; height: 12px; background: green; border-radius: 50%; margin-right: 5px;"></span> 2-5 penerima</div>
            <div><span style="display: inline-block; width: 12px; height: 12px; background: blue; border-radius: 50%; margin-right: 5px;"></span> 1 penerima</div>
        `;
        return div;
    };
    legend.addTo(mapDashboard);
}

// --- SMART MENU LOGIC ---
function setupSmartMenu() {
    const smartMenuToggle = document.getElementById('smartMenuToggle');
    const smartMenuContainer = document.getElementById('smartMenu');
    
    if (!smartMenuToggle || !smartMenuContainer) return;
    
    smartMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        smartMenuContainer.classList.toggle('active');
    });

    // Close smart menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!smartMenuContainer.contains(e.target)) {
            smartMenuToggle.classList.remove('active');
            smartMenuContainer.classList.remove('active');
        }
    });
}

function triggerSmartMenu(targetId) {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
        targetEl.click();
        // Close menu after selection
        const smartMenuToggle = document.getElementById('smartMenuToggle');
        const smartMenu = document.getElementById('smartMenu');
        if (smartMenuToggle) smartMenuToggle.classList.remove('active');
        if (smartMenu) smartMenu.classList.remove('active');
    }
}

function fillYearDropdowns() {
    const yearSelects = ['tahunAnggaran', 'filterTahun', 'printTahun', 'exportTahun', 'defaultTahun'];
    const currentYear = new Date().getFullYear();

    yearSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '';
        
        if (!['tahunAnggaran', 'defaultTahun'].includes(selectId)) {
            select.add(new Option('Semua Tahun', ''));
        }
        
        for (let year = 2020; year <= 2090; year++) {
            select.add(new Option(year, year));
        }
        
        select.value = (selectId === 'tahunAnggaran') ? currentYear : (selectId === 'defaultTahun' ? appSettings.defaultTahun : '');
    });
}

function fillKecamatanDropdown() {
    ['kecamatan', 'filterKecamatan', 'printKecamatan', 'exportKecamatan'].forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '';
        const defaultText = selectId === 'kecamatan' ? 'Pilih Kecamatan' : 'Semua Kecamatan';
        select.add(new Option(defaultText, ''));
        kecamatanList.forEach(kec => select.add(new Option(kec, kec)));
    });
}

function initializeDesaDropdown() {
    // Inisialisasi dropdown desa dengan status disabled
    const desaSelect = document.getElementById('desa');
    if (desaSelect) {
        desaSelect.innerHTML = '<option value="">Pilih Kecamatan terlebih dahulu</option>';
        desaSelect.disabled = true;
    }
    
    // Untuk filter dropdowns (yang tidak tergantung pada kecamatan)
    ['filterDesa'].forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '';
        select.add(new Option('Semua Desa', ''));
        desaList.forEach(desa => select.add(new Option(desa, desa)));
    });
}

function updateDesaDropdown(kecamatan) {
    const desaSelect = document.getElementById('desa');
    if (!desaSelect) return;
    
    // Reset dropdown
    desaSelect.innerHTML = '';
    
    if (!kecamatan || kecamatan === '') {
        desaSelect.add(new Option('Pilih Kecamatan terlebih dahulu', ''));
        desaSelect.disabled = true;
        return;
    }
    
    // Enable dropdown
    desaSelect.disabled = false;
    desaSelect.add(new Option('Pilih Desa', ''));
    
    // Tambahkan desa sesuai kecamatan
    if (desaByKecamatan[kecamatan]) {
        desaByKecamatan[kecamatan].forEach(desa => {
            desaSelect.add(new Option(desa, desa));
        });
    }
}

function fillFilterDropdownsForDataTable() {
    // Fill kecamatan filter for data table
    const kecFilter = document.getElementById('filterKecamatanData');
    if (kecFilter) {
        kecFilter.innerHTML = '';
        kecFilter.add(new Option('Semua Kecamatan', ''));
        kecamatanList.forEach(kec => kecFilter.add(new Option(kec, kec)));
    }
    
    // Fill desa filter for data table
    const desaFilter = document.getElementById('filterDesaData');
    if (desaFilter) {
        desaFilter.innerHTML = '';
        desaFilter.add(new Option('Semua Desa', ''));
        desaList.forEach(desa => desaFilter.add(new Option(desa, desa)));
    }
}

// --- AUTHENTICATION ---
function handleLogin(e) {
    e.preventDefault();
    if (isBlocked) return showNotification('Akses diblokir sementara karena terlalu banyak percobaan.', 'error');
    
    const securityCodeInput = document.getElementById('securityCode').value;
    const loginButton = document.getElementById('loginButton');
    
    if (!loginButton) return;
    
    loginButton.disabled = true;
    const loginSpinner = document.getElementById('loginSpinner');
    if (loginSpinner) loginSpinner.classList.remove('d-none');
    
    const loginButtonText = document.querySelector('.login-button-text');
    if (loginButtonText) loginButtonText.textContent = 'Memverifikasi...';
    
    setTimeout(() => {
        if (securityCodeInput === appSettings.securityCode) {
            try {
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                if (loginModal) loginModal.hide();
                
                showWelcomeMessage();
            } catch (error) {
                console.error('Error hiding login modal:', error);
            }
        } else {
            loginAttempts++;
            updateAttemptsCount();
            
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.classList.add('login-shake');
                setTimeout(() => loginForm.classList.remove('login-shake'), 600);
            }
            
            if (loginAttempts >= 3) {
                blockAccess();
            } else {
                showNotification(`Kode keamanan salah. Sisa percobaan: ${3 - loginAttempts}.`, 'error');
            }
        }

        loginButton.disabled = false;
        if (loginSpinner) loginSpinner.classList.add('d-none');
        if (loginButtonText) loginButtonText.textContent = 'MASUK SISTEM';
    }, 500);
}

function showWelcomeMessage() {
    try {
        const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        if (!welcomeMessage) return;
        
        const hours = new Date().getHours();
        let greeting = '';
        if (hours < 11) greeting = 'Pagi';
        else if (hours < 15) greeting = 'Siang';
        else if (hours < 19) greeting = 'Sore';
        else greeting = 'Malam';
        
        welcomeMessage.innerHTML = `
            <strong>Selamat ${greeting}!</strong><br>
            Selamat datang di Sistem Bantuan Nelayan Kabupaten Situbondo.<br>
            <small class="text-white-75">Login sebagai Administrator - Akses penuh</small>
        `;
        
        welcomeModal.show();
    } catch (error) {
        console.error('Error showing welcome modal:', error);
    }
}

function handleWelcomeReload() {
    try {
        const welcomeModal = bootstrap.Modal.getInstance(document.getElementById('welcomeModal'));
        if (welcomeModal) welcomeModal.hide();
        
        handleReloadFromRepo();
        
        setTimeout(() => {
            document.getElementById('appContent').style.display = 'block';
            showNotification('Selamat datang! Sistem siap digunakan.', 'success');
        }, 1000);
    } catch (error) {
        console.error('Error in welcome reload:', error);
    }
}

function handleSkipReload() {
    try {
        const welcomeModal = bootstrap.Modal.getInstance(document.getElementById('welcomeModal'));
        if (welcomeModal) welcomeModal.hide();
        
        document.getElementById('appContent').style.display = 'block';
        showNotification('Selamat datang! Sistem siap digunakan.', 'success');
    } catch (error) {
        console.error('Error in skip reload:', error);
    }
}

function togglePasswordVisibility(btn, inputId) {
    const passwordInput = document.getElementById(inputId);
    if (!passwordInput) return;
    
    const icon = btn.querySelector('i');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('fa-eye', !isPassword);
    icon.classList.toggle('fa-eye-slash', isPassword);
}

function updateAttemptsCount() {
    const attemptsEl = document.getElementById('attemptsCount');
    const blockedMessage = document.getElementById('blockedMessage');
    
    if (attemptsEl) {
        attemptsEl.style.display = loginAttempts > 0 && !isBlocked ? 'block' : 'none';
        attemptsEl.textContent = `Percobaan gagal: ${loginAttempts}/3`;
    }
    
    if (blockedMessage) {
        blockedMessage.classList.toggle('d-none', !isBlocked);
    }
}

function blockAccess() {
    isBlocked = true;
    updateAttemptsCount();
    showNotification('Akses diblokir selama 30 detik.', 'error');
    
    let countdown = 30;
    const countdownElement = document.getElementById('countdown');
    
    blockTimeout = setInterval(() => {
        countdown--;
        if (countdownElement) countdownElement.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(blockTimeout);
            isBlocked = false;
            loginAttempts = 0;
            updateAttemptsCount();
        }
    }, 1000);
}

function logout() {
    autoBackupData();
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        document.getElementById('appContent').style.display = 'none';
        const securityCodeInput = document.getElementById('securityCode');
        if (securityCodeInput) securityCodeInput.value = '';
        
        try {
            new bootstrap.Modal(document.getElementById('loginModal')).show();
        } catch (error) {
            console.error('Error showing login modal:', error);
        }
        
        showNotification('Anda telah berhasil logout.', 'info');
    }
}

// --- SECURITY & PRIVACY LOGIC ---
function requestHighSecurityAction(callback) {
    pendingSecurityAction = callback;
    const universalPinInput = document.getElementById('universalPinInput');
    const universalPinError = document.getElementById('universalPinError');
    
    if (universalPinInput) universalPinInput.value = '';
    if (universalPinError) universalPinError.style.display = 'none';
    
    try {
        new bootstrap.Modal(document.getElementById('universalPinModal')).show();
    } catch (error) {
        console.error('Error showing universal pin modal:', error);
    }
}

function handleUniversalPinSubmit() {
    const pinInput = document.getElementById('universalPinInput');
    const pinError = document.getElementById('universalPinError');
    
    if (!pinInput || !pinError) return;
    
    const pin = pinInput.value;
    if (pin === SECURITY_CONSTANTS.PIN) {
        try {
            const modal = bootstrap.Modal.getInstance(document.getElementById('universalPinModal'));
            if (modal) modal.hide();
            
            if (pendingSecurityAction) {
                pendingSecurityAction();
                pendingSecurityAction = null;
            }
        } catch (error) {
            console.error('Error hiding universal pin modal:', error);
        }
    } else {
        pinError.style.display = 'block';
        pinInput.classList.add('is-invalid');
    }
}

function handlePrivacyToggle(e) {
    const toggle = e.target;
    
    // Jika user baru saja meng-uncheck (ingin mematikan sensor)
    if (!toggle.checked) {
        // Tahan dulu secara visual (tetapkan kembali ke true sampai password benar)
        toggle.checked = true;
        
        // Buka modal minta password
        const privacyPasswordInput = document.getElementById('privacyPasswordInput');
        const privacyError = document.getElementById('privacyError');
        
        if (privacyPasswordInput) privacyPasswordInput.value = '';
        if (privacyError) privacyError.style.display = 'none';
        
        try {
            const authModal = new bootstrap.Modal(document.getElementById('privacyAuthModal'));
            authModal.show();
        } catch (error) {
            console.error('Error showing privacy auth modal:', error);
        }
    } else {
        // Jika user baru saja men-check (ingin menyalakan sensor)
        appSettings.privacyMode = true;
        saveSettings();
        renderDataTable();
        renderFilterTable();
        showNotification('Sensor Data diaktifkan.', 'success');
    }
}

function checkPrivacyPassword() {
    const input = document.getElementById('privacyPasswordInput');
    const errorElement = document.getElementById('privacyError');
    
    if (!input || !errorElement) return;
    
    const password = input.value;
    
    if (password === SECURITY_CONSTANTS.PIN) { 
        appSettings.privacyMode = false;
        saveSettings();
        
        const privacyToggle = document.getElementById('privacyToggle');
        if (privacyToggle) privacyToggle.checked = false;
        
        try {
            const modalEl = document.getElementById('privacyAuthModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        } catch (error) {
            console.error('Error hiding privacy auth modal:', error);
        }
        
        renderDataTable();
        renderFilterTable();
        showNotification('Sensor Data dinonaktifkan. NIK dan No HP terlihat.', 'warning');
    } else {
        errorElement.style.display = 'block';
        input.classList.add('is-invalid');
    }
}

function cancelPrivacyChange() {
    const privacyToggle = document.getElementById('privacyToggle');
    if (privacyToggle) privacyToggle.checked = true;
}

function formatPrivacy(value) {
    if (!appSettings.privacyMode) return value;
    if (!value) return '-';
    const str = String(value);
    if (str.length <= 4) return '****';
    return str.slice(0, -4) + '****';
}

// --- FITUR DETAIL DATA ---
function showDetailData(id) {
    const data = appData.find(item => item.id === id);
    if (!data) return;
    
    // Apply privacy mode
    const nikDisplay = formatPrivacy(data.nik);
    const whatsappRaw = data.whatsapp ? `0${data.whatsapp}` : '-';
    const whatsappDisplay = formatPrivacy(whatsappRaw);
    
    // Fill modal with data
    const elements = {
        'detailNama': data.nama || '-',
        'detailNik': nikDisplay,
        'detailWhatsapp': whatsappDisplay,
        'detailKelompok': data.namaKelompok || '-',
        'detailJabatan': data.jabatan || '-',
        'detailTahun': data.tahunAnggaran || '-',
        'detailKecamatan': data.kecamatan || '-',
        'detailDesa': data.desa || '-',
        'detailAlamat': data.alamat || '-',
        'detailJenisBantuan': data.jenisBantuan || '-',
        'detailNamaBantuan': data.namaBantuan || '-',
        'detailJumlahBantuan': `${formatNumber(data.jumlahBantuan)} ${data.satuanBantuan}`,
        'detailTanggal': formatDate(data.tanggalTerima) || '-',
        'detailPetugas': data.namaPetugas || '-',
        'detailKodeValidasi': data.kodeValidasi || '-',
        'detailKeterangan': data.keterangan || '-'
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = elements[id];
    });
    
    // Handle Google Drive link
    const driveLink = data.driveLink || '-';
    const driveLinkElement = document.getElementById('detailDriveLink');
    if (driveLinkElement) {
        if (driveLink !== '-' && driveLink.startsWith('http')) {
            driveLinkElement.innerHTML = `<a href="${driveLink}" target="_blank" class="drive-link">${driveLink}</a>`;
        } else {
            driveLinkElement.textContent = driveLink;
        }
    }
    
    // Show modal
    try {
        const detailModal = new bootstrap.Modal(document.getElementById('detailDataModal'));
        detailModal.show();
    } catch (error) {
        console.error('Error showing detail modal:', error);
    }
}

// --- FORM HANDLING & VALIDATION ---
function setTidakAdaWhatsapp() {
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.value = 'TIDAK ADA';
        whatsappInput.disabled = true;
        clearError('whatsapp');
    }
}

function checkNikForGeneratedCode() {
    const nikInput = document.getElementById('nik');
    const kodeValidasiInput = document.getElementById('kodeValidasi');
    const generateKodeBtn = document.getElementById('generateKodeBtn');
    
    if (!nikInput || !kodeValidasiInput || !generateKodeBtn) return;
    
    const nik = nikInput.value.trim();
    
    // Check if NIK already has a generated code
    if (generatedCodes[nik] && generatedCodes[nik].kode) {
        kodeValidasiInput.value = generatedCodes[nik].kode;
        generateKodeBtn.disabled = true;
        generateKodeBtn.classList.add('generate-code-disabled');
        generateKodeBtn.innerHTML = '<i class="fas fa-lock me-1"></i> Sudah Digenerate';
        showNotification('Kode validasi untuk NIK ini sudah digenerate sebelumnya.', 'info');
        return true;
    }
    
    // Enable button if NIK is valid and doesn't have code yet
    if (/^\d{16}$/.test(nik)) {
        generateKodeBtn.disabled = false;
        generateKodeBtn.classList.remove('generate-code-disabled');
        generateKodeBtn.innerHTML = 'Generate';
    } else {
        generateKodeBtn.disabled = true;
        generateKodeBtn.classList.add('generate-code-disabled');
        generateKodeBtn.innerHTML = 'Generate';
    }
    
    return false;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('Harap perbaiki data yang salah pada formulir.', 'error');
        return;
    }
    
    const editId = document.getElementById('inputForm').getAttribute('data-edit-id');
    const isEditing = !!editId;

    const formData = {
        id: isEditing ? parseInt(editId) : Date.now(),
        nama: document.getElementById('nama').value.trim(),
        nik: document.getElementById('nik').value.trim(),
        whatsapp: document.getElementById('whatsapp').value === 'TIDAK ADA' ? '' : document.getElementById('whatsapp').value.replace(/\D/g, ''),
        namaKelompok: document.getElementById('namaKelompok').value.trim() || 'Individu',
        jabatan: document.getElementById('jabatan').value,
        tahunAnggaran: document.getElementById('tahunAnggaran').value,
        kecamatan: document.getElementById('kecamatan').value,
        desa: document.getElementById('desa').value,
        alamat: document.getElementById('alamat').value.trim(),
        jenisBantuan: document.getElementById('jenisBantuan').value,
        namaBantuan: document.getElementById('namaBantuan').value.trim(),
        jumlahBantuan: document.getElementById('jumlahBantuan').value,
        satuanBantuan: document.getElementById('satuanBantuan').value,
        tanggalTerima: document.getElementById('tanggalTerima').value,
        namaPetugas: document.getElementById('namaPetugas').value.trim(),
        driveLink: document.getElementById('driveLink').value.trim(),
        kodeValidasi: document.getElementById('kodeValidasi').value,
        keterangan: document.getElementById('keterangan').value.trim(),
        tanggalInput: isEditing 
            ? appData.find(item => item.id === parseInt(editId))?.tanggalInput 
            : new Date().toISOString(),
        koordinat: getKoordinatDesa(document.getElementById('desa').value, document.getElementById('kecamatan').value)
    };
    
    // Save generated code to storage
    if (!isEditing && formData.kodeValidasi && formData.nik) {
        generatedCodes[formData.nik] = {
            kode: formData.kodeValidasi,
            tanggal: new Date().toISOString()
        };
        saveData();
    }
    
    if (isEditing) {
        const index = appData.findIndex(item => item.id === parseInt(editId));
        if (index > -1) {
            appData[index] = formData;
            showNotification('Data berhasil diperbarui!', 'success');
        }
    } else {
        appData.push(formData);
        showNotification('Data berhasil disimpan!', 'success');
    }
    
    saveData();
    resetForm();
    updateDashboard();
    renderDataTable();
    
    // Update map if exists
    if (mapDashboard) {
        initializeMapDashboard();
    }
    
    try {
        new bootstrap.Tab(document.getElementById('v-pills-data-tab')).show();
    } catch (error) {
        console.error('Error switching to data tab:', error);
    }
}

function getKoordinatDesa(desa, kecamatan) {
    const key = `${desa}, ${kecamatan}`;
    return koordinatDesa[key] || koordinatKecamatan[kecamatan] || { lat: -7.7062, lng: 113.9603 };
}

function resetForm() {
    document.getElementById('inputForm').reset();
    document.getElementById('inputForm').removeAttribute('data-edit-id');
    
    const elements = {
        'jabatan': 'Individu',
        'namaKelompok': '',
        'tahunAnggaran': appSettings.defaultTahun,
        'tanggalTerima': new Date().toISOString().split('T')[0],
        'kodeValidasi': ''
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = elements[id];
    });
    
    // Reset desa dropdown ke kondisi awal
    const desaSelect = document.getElementById('desa');
    if (desaSelect) {
        desaSelect.innerHTML = '<option value="">Pilih Kecamatan terlebih dahulu</option>';
        desaSelect.disabled = true;
    }
    
    // Reset WhatsApp input
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.disabled = false;
        whatsappInput.value = '';
    }
    
    // Reset generate button
    const generateKodeBtn = document.getElementById('generateKodeBtn');
    if (generateKodeBtn) {
        generateKodeBtn.disabled = false;
        generateKodeBtn.classList.remove('generate-code-disabled');
        generateKodeBtn.innerHTML = 'Generate';
    }
    
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
}

function setError(id, message) {
    const element = document.getElementById(id);
    if (element) element.classList.add('input-error');
    
    const errorEl = document.getElementById(`${id}Error`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function clearError(id) {
    const element = document.getElementById(id);
    if (element) element.classList.remove('input-error');
    
    const errorEl = document.getElementById(`${id}Error`);
    if (errorEl) errorEl.style.display = 'none';
}

function validateForm() {
    let isValid = true;
    const requiredFields = ['nama', 'nik', 'namaPetugas', 'namaBantuan', 'jumlahBantuan', 'kodeValidasi', 'kecamatan', 'desa', 'tanggalTerima'];
    
    requiredFields.forEach(id => {
        const element = document.getElementById(id);
        if (element && !element.value.trim()) {
            setError(id, 'Kolom ini wajib diisi.');
            isValid = false;
        }
    });

    const nik = document.getElementById('nik').value.trim();
    const editId = document.getElementById('inputForm').getAttribute('data-edit-id');
    const isEditing = !!editId;
    
    if (nik && !/^\d{16}$/.test(nik)) {
        setError('nik', 'NIK harus terdiri dari 16 digit angka.');
        isValid = false;
    } else if (isNikExists(nik) && !isEditing) {
        setError('nik', 'NIK ini sudah terdaftar di sistem.');
        isValid = false;
    }

    const whatsapp = document.getElementById('whatsapp').value;
    if (whatsapp && whatsapp !== 'TIDAK ADA') {
        const whatsappNum = whatsapp.replace(/\D/g, '');
        if (!/^\d{9,13}$/.test(whatsappNum)) {
            setError('whatsapp', 'Nomor WhatsApp tidak valid (9-13 digit).');
            isValid = false;
        }
    }

    const driveLink = document.getElementById('driveLink').value.trim();
    if (driveLink && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(driveLink)) {
        setError('driveLink', 'Format URL Google Drive tidak valid.');
        isValid = false;
    }

    return isValid;
}

function isNikExists(nik) {
    const editId = document.getElementById('inputForm').getAttribute('data-edit-id');
    return appData.some(data => data.nik === nik && data.id !== (editId ? parseInt(editId) : null));
}

function setBukanKelompok() {
    const namaKelompok = document.getElementById('namaKelompok');
    const jabatan = document.getElementById('jabatan');
    
    if (namaKelompok) namaKelompok.value = 'Individu';
    if (jabatan) jabatan.value = 'Individu';
}

function handleJabatanChange() {
    const jabatan = document.getElementById('jabatan').value;
    const namaKelompok = document.getElementById('namaKelompok');
    if (jabatan === 'Individu') {
        if (namaKelompok) namaKelompok.value = 'Individu';
    } else if (namaKelompok && namaKelompok.value.toLowerCase() === 'individu') {
        namaKelompok.value = '';
    }
}

function generateKodeValidasi() {
    const nikInput = document.getElementById('nik');
    const nik = nikInput.value.trim();
    clearError('nik');

    if (!/^\d{16}$/.test(nik)) {
        setError('nik', 'Isi NIK dengan 16 digit angka sebelum generate kode.');
        showNotification('NIK tidak valid untuk generate kode.', 'error');
        return;
    }
    
    // Check if NIK already has generated code
    if (generatedCodes[nik] && generatedCodes[nik].kode) {
        const kodeValidasi = document.getElementById('kodeValidasi');
        if (kodeValidasi) kodeValidasi.value = generatedCodes[nik].kode;
        
        const generateKodeBtn = document.getElementById('generateKodeBtn');
        if (generateKodeBtn) {
            generateKodeBtn.disabled = true;
            generateKodeBtn.classList.add('generate-code-disabled');
            generateKodeBtn.innerHTML = '<i class="fas fa-lock me-1"></i> Sudah Digenerate';
        }
        
        showNotification('Kode validasi untuk NIK ini sudah digenerate sebelumnya.', 'info');
        return;
    }
    
    if (isNikExists(nik)) {
        setError('nik', 'NIK ini sudah terdaftar, tidak bisa generate kode baru.');
        showNotification('NIK sudah terdaftar.', 'error');
        return;
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const kodeValidasi = document.getElementById('kodeValidasi');
    if (kodeValidasi) kodeValidasi.value = result;
    
    // Save generated code
    generatedCodes[nik] = {
        kode: result,
        tanggal: new Date().toISOString()
    };
    
    // Disable button after generation
    const generateKodeBtn = document.getElementById('generateKodeBtn');
    if (generateKodeBtn) {
        generateKodeBtn.disabled = true;
        generateKodeBtn.classList.add('generate-code-disabled');
        generateKodeBtn.innerHTML = '<i class="fas fa-lock me-1"></i> Sudah Digenerate';
    }
    
    clearError('kodeValidasi');
    showNotification('Kode validasi berhasil digenerate dan dikunci untuk NIK ini.', 'success');
}

function updateSatuanBantuan() {
    const jenis = document.getElementById('jenisBantuan').value;
    const satuanSelect = document.getElementById('satuanBantuan');
    if (!satuanSelect) return;
    
    const options = {
        'Uang': ['Rupiah'],
        'Barang': ['Unit', 'Paket', 'Set', 'Buah', 'Ekor'],
        'Jasa': ['Jam', 'Hari', 'Paket', 'Kegiatan']
    };
    satuanSelect.innerHTML = (options[jenis] || []).map(opt => `<option value="${opt}">${opt}</option>`).join('');
}

// --- DATA PERSISTENCE ---
function loadData() {
    try {
        const savedData = localStorage.getItem('barjasData');
        appData = savedData ? JSON.parse(savedData) : [];
        const savedCodes = localStorage.getItem('barjasGeneratedCodes');
        generatedCodes = savedCodes ? JSON.parse(savedCodes) : {};
    } catch (e) {
        console.error("Gagal memuat data:", e);
        appData = [];
        generatedCodes = {};
    }
    renderDataTable();
}

function saveData() {
    try {
        localStorage.setItem('barjasData', JSON.stringify(appData));
        localStorage.setItem('barjasGeneratedCodes', JSON.stringify(generatedCodes));
    } catch (e) {
        console.error("Gagal menyimpan data:", e);
    }
}

function loadSettings() {
    const savedSettings = localStorage.getItem('barjasSettings');
    if (savedSettings) {
        try {
            const loaded = JSON.parse(savedSettings);
            Object.assign(appSettings, loaded);
            // SECURITY FIX: Jika kode keamanan kosong atau tidak valid, paksa kembali ke default
            if (!appSettings.securityCode || appSettings.securityCode.trim() === '') {
                appSettings.securityCode = SECURITY_CONSTANTS.DEFAULT_PASS;
                console.warn("Kode keamanan direset ke default karena kosong.");
            }
        } catch(e) {
             appSettings.securityCode = SECURITY_CONSTANTS.DEFAULT_PASS; // Force default on error
        }
    } else {
         appSettings.securityCode = SECURITY_CONSTANTS.DEFAULT_PASS; // Init default
    }
}

function saveSettings() {
    try {
        localStorage.setItem('barjasSettings', JSON.stringify(appSettings));
    } catch (e) {
        console.error("Gagal menyimpan pengaturan:", e);
    }
}

function applySettingsToUI() {
    const elements = {
        'itemsPerPage': appSettings.itemsPerPage,
        'notifications': appSettings.notifications,
        'appName': appSettings.appName,
        'appSubtitle': appSettings.appSubtitle,
        'defaultTahun': appSettings.defaultTahun,
        'privacyToggle': appSettings.privacyMode
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = elements[id];
            } else {
                element.value = elements[id];
            }
        }
    });
}

function handleSaveSettings(e) {
    e.preventDefault();
    
    const newSecurityCode = document.getElementById('settingSecurityCode').value;
    if (newSecurityCode && newSecurityCode.trim() !== "") {
        appSettings.securityCode = newSecurityCode;
    }
    
    appSettings.itemsPerPage = parseInt(document.getElementById('itemsPerPage').value) || 25;
    appSettings.notifications = document.getElementById('notifications').checked;
    appSettings.appName = document.getElementById('appName').value;
    appSettings.appSubtitle = document.getElementById('appSubtitle').value;
    appSettings.defaultTahun = document.getElementById('defaultTahun').value;

    saveSettings();
    applySettingsToUI();
    showNotification('Pengaturan berhasil disimpan.', 'success');
    renderDataTable();
    
    const appTitle = document.querySelector('.app-title');
    const appSubtitle = document.querySelector('.app-subtitle');
    
    if (appTitle) appTitle.innerHTML = appSettings.appName.replace(/\n/g, '<br>');
    if (appSubtitle) appSubtitle.textContent = appSettings.appSubtitle;
    
    // Clear password field for security
    const settingSecurityCode = document.getElementById('settingSecurityCode');
    if (settingSecurityCode) settingSecurityCode.value = '';
}

// --- DATA TABLE ---
function renderDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const dataToRender = isFilterActive ? filteredData : appData;
    const itemsPerPage = parseInt(appSettings.itemsPerPage) || 25;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, dataToRender.length);
    
    if (dataToRender.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="18" class="text-center py-4">Tidak ada data</td></tr>`;
        
        const tableInfo = document.getElementById('tableInfo');
        if (tableInfo) tableInfo.textContent = 'Menampilkan 0 dari 0 data';
        
        const pagination = document.getElementById('pagination');
        if (pagination) pagination.innerHTML = '';
        
        return;
    }
    
    for (let i = startIndex; i < endIndex; i++) {
        const data = dataToRender[i];
        const row = document.createElement('tr');
        
        const nikDisplay = formatPrivacy(data.nik);
        const whatsappRaw = data.whatsapp ? `0${data.whatsapp}` : '-';
        const whatsappDisplay = formatPrivacy(whatsappRaw);
        
        const whatsappLink = (appSettings.privacyMode || !data.whatsapp) ? 'javascript:void(0)' : `https://wa.me/62${data.whatsapp}`;
        const whatsappClass = (appSettings.privacyMode || !data.whatsapp) ? 'text-muted text-decoration-none' : 'whatsapp-number';
        const privacyClass = appSettings.privacyMode ? 'privacy-blurred' : '';
        
        // Tombol aksi
        let actionButtons = `
            <div class="btn-group btn-group-sm">
                <button class="btn btn-info text-white" onclick="showDetailData(${data.id})" title="Lihat Detail">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning text-white" onclick="editData(${data.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteData(${data.id})" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        row.innerHTML = `
            <td>${i + 1}</td>
            <td class="fw-bold text-primary">${data.nama}</td>
            <td class="${privacyClass}">${nikDisplay}</td>
            <td><a href="${whatsappLink}" target="${(appSettings.privacyMode || !data.whatsapp) ? '_self' : '_blank'}" class="${whatsappClass}">${whatsappDisplay}</a></td>
            <td>${data.namaKelompok || '-'}</td>
            <td>${data.jabatan || '-'}</td>
            <td>${data.tahunAnggaran}</td>
            <td>${data.kecamatan}</td>
            <td>${data.desa}</td>
            <td><span class="badge bg-info">${data.jenisBantuan}</span></td>
            <td>${data.namaBantuan || '-'}</td>
            <td class="fw-bold">${formatNumber(data.jumlahBantuan)} ${data.satuanBantuan}</td>
            <td>${formatDate(data.tanggalTerima)}</td>
            <td>${data.namaPetugas || '-'}</td>
            <td>${data.driveLink ? `<a href="${data.driveLink}" class="drive-link" target="_blank"><i class="fas fa-external-link-alt"></i> Buka</a>` : '-'}</td>
            <td><span class="badge bg-secondary">${data.kodeValidasi}</span></td>
            <td>${actionButtons}</td>
        `;
        tableBody.appendChild(row);
    }
    
    const tableInfo = document.getElementById('tableInfo');
    if (tableInfo) {
        tableInfo.textContent = `Menampilkan ${startIndex + 1} - ${endIndex} dari ${dataToRender.length} data`;
    }
    
    updatePagination(dataToRender.length);
}

function updatePagination(totalItems) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    const itemsPerPage = parseInt(appSettings.itemsPerPage) || 25;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationEl.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const createPageItem = (page, text, disabled = false, active = false) => {
        const li = document.createElement('li');
        li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${page}); return false;">${text}</a>`;
        return li;
    };

    paginationEl.appendChild(createPageItem(currentPage - 1, '<i class="fas fa-chevron-left"></i>', currentPage === 1));

    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationEl.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    paginationEl.appendChild(createPageItem(currentPage + 1, '<i class="fas fa-chevron-right"></i>', currentPage === totalPages));
}

function changePage(page) {
    const dataToRender = isFilterActive ? filteredData : appData;
    const totalPages = Math.ceil(dataToRender.length / (parseInt(appSettings.itemsPerPage) || 25));
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderDataTable();
    }
}

function handleSearch() {
    const searchTerm = document.getElementById('searchData').value.toLowerCase();
    const filterKecamatan = document.getElementById('filterKecamatanData').value;
    const filterDesa = document.getElementById('filterDesaData').value;
    
    isFilterActive = !!searchTerm || !!filterKecamatan || !!filterDesa;
    
    filteredData = appData.filter(d => {
        const matchesSearch = !searchTerm || Object.values(d).some(v => 
            String(v).toLowerCase().includes(searchTerm)
        );
        const matchesKecamatan = !filterKecamatan || d.kecamatan === filterKecamatan;
        const matchesDesa = !filterDesa || d.desa === filterDesa;
        
        return matchesSearch && matchesKecamatan && matchesDesa;
    });
    
    currentPage = 1;
    renderDataTable();
}

function handleDataTableFilter() {
    handleSearch();
}

function clearSearch() {
    const searchData = document.getElementById('searchData');
    const filterKecamatanData = document.getElementById('filterKecamatanData');
    const filterDesaData = document.getElementById('filterDesaData');
    
    if (searchData) searchData.value = '';
    if (filterKecamatanData) filterKecamatanData.value = '';
    if (filterDesaData) filterDesaData.value = '';
    
    handleSearch();
}

// --- FILTER ---
function applyFilter() {
    const filters = {
        tahun: document.getElementById('filterTahun')?.value || '',
        kecamatan: document.getElementById('filterKecamatan')?.value || '',
        desa: document.getElementById('filterDesa')?.value || '',
        jenis: document.getElementById('filterJenis')?.value || '',
    };
    
    filteredData = appData.filter(d => 
        (!filters.tahun || d.tahunAnggaran == filters.tahun) &&
        (!filters.kecamatan || d.kecamatan === filters.kecamatan) &&
        (!filters.desa || d.desa === filters.desa) &&
        (!filters.jenis || d.jenisBantuan === filters.jenis)
    );
    
    renderFilterTable();
    
    const filterResultCount = document.getElementById('filterResultCount');
    if (filterResultCount) {
        filterResultCount.textContent = `${filteredData.length} Data`;
    }
    
    showNotification(`Filter diterapkan. Ditemukan ${filteredData.length} data.`, 'success');
}

function resetFilter() {
    ['filterTahun', 'filterKecamatan', 'filterDesa', 'filterJenis'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    filteredData = [];
    renderFilterTable();
    
    const filterResultCount = document.getElementById('filterResultCount');
    if (filterResultCount) {
        filterResultCount.textContent = '0 Data';
    }
    
    showNotification('Filter direset.', 'info');
}

function renderFilterTable() {
    const tableBody = document.getElementById('filterTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="16" class="text-center py-4">Tidak ada data yang sesuai</td></tr>`;
        return;
    }
    
    filteredData.forEach((data, i) => {
        const nikDisplay = formatPrivacy(data.nik);
        const whatsappRaw = data.whatsapp ? `0${data.whatsapp}` : '-';
        const whatsappDisplay = formatPrivacy(whatsappRaw);
        const privacyClass = appSettings.privacyMode ? 'privacy-blurred' : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td> <td>${data.nama}</td> 
            <td class="${privacyClass}">${nikDisplay}</td> 
            <td>${whatsappDisplay}</td>
            <td>${data.namaKelompok || '-'}</td> <td>${data.jabatan || '-'}</td> <td>${data.tahunAnggaran}</td>
            <td>${data.kecamatan}</td> <td>${data.desa}</td> <td>${data.jenisBantuan}</td>
            <td>${data.namaBantuan || '-'}</td> <td>${formatNumber(data.jumlahBantuan)} ${data.satuanBantuan}</td>
            <td>${formatDate(data.tanggalTerima)}</td> <td>${data.namaPetugas || '-'}</td>
            <td>${data.driveLink ? 'Ya' : 'Tidak'}</td> <td>${data.kodeValidasi}</td>
        `;
        tableBody.appendChild(row);
    });
}

// --- CRUD ACTIONS ---
function editData(id) {
    const data = appData.find(item => item.id === id);
    if (!data) return;
    
    // Isi semua field form dengan data yang ada
    Object.keys(data).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.value = data[key];
    });

    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        if (data.whatsapp) {
            whatsappInput.value = data.whatsapp;
        } else {
            whatsappInput.value = 'TIDAK ADA';
            whatsappInput.disabled = true;
        }
    }
    
    // PERBAIKAN: Aktifkan dropdown desa dan isi dengan desa yang sesuai
    const desaSelect = document.getElementById('desa');
    if (desaSelect) {
        desaSelect.disabled = false;
        updateDesaDropdown(data.kecamatan);
        setTimeout(() => {
            desaSelect.value = data.desa;
        }, 100);
    }
    
    // Check generated code for NIK
    checkNikForGeneratedCode();
    
    document.getElementById('inputForm').setAttribute('data-edit-id', id);
    
    try {
        new bootstrap.Tab(document.getElementById('v-pills-input-tab')).show();
    } catch (error) {
        console.error('Error switching to input tab:', error);
    }
    
    window.scrollTo(0, 0);
    showNotification('Mode edit aktif. Klik "Simpan Data" setelah selesai.', 'info');
}

function deleteData(id) {
    if (confirm('Konfirmasi: Anda yakin ingin menghapus data ini?')) {
        requestHighSecurityAction(() => {
            appData = appData.filter(item => item.id !== id);
            saveData();
            showNotification('Data berhasil dihapus.', 'success');
            updateDashboard();
            renderDataTable();
            // Update map if exists
            if (mapDashboard) {
                initializeMapDashboard();
            }
        });
    }
}

// --- DASHBOARD ---
function updateDashboard() {
    const totalPenerima = document.getElementById('totalPenerima');
    const totalBantuan = document.getElementById('totalBantuan');
    const totalBarang = document.getElementById('totalBarang');
    const totalPaket = document.getElementById('totalPaket');
    const tahunAktif = document.getElementById('tahunAktif');
    const rataBantuan = document.getElementById('rataBantuan');
    const totalKecamatan = document.getElementById('totalKecamatan');
    const totalDesa = document.getElementById('totalDesa');
    
    if (totalPenerima) totalPenerima.textContent = formatNumber(appData.length);
    
    // Hitung total bantuan uang
    const uangData = appData.filter(d => d.jenisBantuan === 'Uang');
    const totalBantuanValue = uangData.reduce((sum, d) => sum + (parseFloat(d.jumlahBantuan) || 0), 0);
    
    if (totalBantuan) totalBantuan.textContent = `Rp ${formatNumber(totalBantuanValue)}`;
    
    // Hitung total bantuan barang
    const barangData = appData.filter(d => d.jenisBantuan === 'Barang');
    const totalBarangValue = barangData.reduce((sum, d) => sum + (parseFloat(d.jumlahBantuan) || 0), 0);
    
    if (totalBarang) totalBarang.textContent = formatNumber(totalBarangValue);
    
    // Hitung total bantuan paket/jasa
    const paketData = appData.filter(d => d.jenisBantuan === 'Jasa');
    const totalPaketValue = paketData.reduce((sum, d) => sum + (parseFloat(d.jumlahBantuan) || 0), 0);
    
    if (totalPaket) totalPaket.textContent = formatNumber(totalPaketValue);
    
    const tahunCount = appData.reduce((acc, d) => ({...acc, [d.tahunAnggaran]: (acc[d.tahunAnggaran] || 0) + 1}), {});
    const tahunAktifValue = Object.keys(tahunCount).reduce((a, b) => tahunCount[a] > tahunCount[b] ? a : b, appSettings.defaultTahun);
    
    if (tahunAktif) tahunAktif.textContent = tahunAktifValue;
    
    const rataBantuanValue = uangData.length > 0 ? totalBantuanValue / uangData.length : 0;
    
    if (rataBantuan) rataBantuan.textContent = `Rp ${formatNumber(rataBantuanValue.toFixed(0))}`;
    
    // Hitung total kecamatan dan desa unik
    const kecamatanUnik = [...new Set(appData.map(d => d.kecamatan))];
    const desaUnik = [...new Set(appData.map(d => d.desa))];
    
    if (totalKecamatan) totalKecamatan.textContent = kecamatanUnik.length;
    if (totalDesa) totalDesa.textContent = desaUnik.length;
    
    updateCharts();
    updateRecentData();
    
    // Update map if exists
    if (mapDashboard && document.getElementById('v-pills-dashboard').classList.contains('show')) {
        initializeMapDashboard();
    }
}

function updateRecentData() {
    const recentDataContainer = document.getElementById('recentData');
    if (!recentDataContainer) return;
    
    recentDataContainer.innerHTML = '';
    const recent = [...appData].sort((a, b) => new Date(b.tanggalInput) - new Date(a.tanggalInput)).slice(0, 5);
    
    if (recent.length === 0) {
        recentDataContainer.innerHTML = `<tr><td colspan="5" class="text-center">Tidak ada data</td></tr>`;
        return;
    }
    
    recent.forEach(d => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(d.tanggalInput)}</td> <td>${d.nama}</td> <td>${d.desa}</td>
            <td>${d.jenisBantuan}</td> <td>${formatNumber(d.jumlahBantuan)} ${d.satuanBantuan}</td>
        `;
        recentDataContainer.appendChild(row);
    });
}

function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js tidak tersedia');
        return;
    }
    
    Chart.defaults.font.family = "'Inter', sans-serif";
    const pieCtx = document.getElementById('kecamatanChart')?.getContext('2d');
    if (pieCtx) {
        window.kecamatanChart = new Chart(pieCtx, { 
            type: 'pie', 
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { 
                        position: 'right' 
                    } 
                } 
            } 
        });
    }
    
    const barCtx = document.getElementById('tahunChart')?.getContext('2d');
    if (barCtx) {
        window.tahunChart = new Chart(barCtx, { 
            type: 'bar', 
            options: { 
                responsive: true, 
                scales: { 
                    y: { 
                        beginAtZero: true 
                    } 
                } 
            } 
        });
    }
}

function updateCharts() {
    if (!appData || appData.length === 0) return;

    const kecamatanData = appData.reduce((acc, d) => ({...acc, [d.kecamatan]: (acc[d.kecamatan] || 0) + 1}), {});
    if (window.kecamatanChart) {
        window.kecamatanChart.data = {
            labels: Object.keys(kecamatanData),
            datasets: [{ 
                data: Object.values(kecamatanData), 
                backgroundColor: ['#005f73', '#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226'] 
            }]
        };
        window.kecamatanChart.update();
    }
    
    const tahunData = appData.reduce((acc, d) => ({...acc, [d.tahunAnggaran]: (acc[d.tahunAnggaran] || 0) + 1}), {});
    const sortedYears = Object.keys(tahunData).sort();
    if (window.tahunChart) {
        window.tahunChart.data = {
            labels: sortedYears,
            datasets: [{ 
                label: 'Jumlah Penerima', 
                data: sortedYears.map(year => tahunData[year]), 
                backgroundColor: '#0a9396' 
            }]
        };
        window.tahunChart.update();
    }
}

// --- PRINT & EXPORT ---
function getFilteredDataForExport(prefix) {
    const filters = {
        tahun: document.getElementById(`${prefix}Tahun`)?.value || '',
        kecamatan: document.getElementById(`${prefix}Kecamatan`)?.value || '',
        jenis: document.getElementById(`${prefix}Jenis`)?.value || '',
    };
    
    if (!filters.tahun && !filters.kecamatan && !filters.jenis) return appData;

    return appData.filter(d => 
        (!filters.tahun || d.tahunAnggaran == filters.tahun) &&
        (!filters.kecamatan || d.kecamatan === filters.kecamatan) &&
        (!filters.jenis || d.jenisBantuan === filters.jenis)
    );
}

function printToPdf() {
    const dataToPrint = getFilteredDataForExport('print');
    if (dataToPrint.length === 0) return showNotification('Tidak ada data untuk dicetak sesuai filter.', 'warning');
    
    if (typeof window.jspdf === 'undefined') {
        showNotification('Library jsPDF tidak tersedia.', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'pt', 'a4');
    
    doc.setFontSize(16);
    doc.text(appSettings.appName, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
    doc.setFontSize(12);
    doc.text(appSettings.appSubtitle, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
    
    const cols = ["No", "Nama", "NIK", "Desa", "Kecamatan", "Nama Bantuan", "Jumlah", "Tanggal"];
    const rows = dataToPrint.map((d, i) => [
        i + 1, d.nama, 
        formatPrivacy(d.nik), 
        d.desa, d.kecamatan, d.namaBantuan || '-',
        `${formatNumber(d.jumlahBantuan)} ${d.satuanBantuan}`, formatDate(d.tanggalTerima)
    ]);
    
    doc.autoTable({ 
        head: [cols], 
        body: rows, 
        startY: 80, 
        theme: 'grid', 
        headStyles: { 
            fillColor: [0, 95, 115] 
        } 
    });
    
    doc.save(`laporan_nelayan_${new Date().toISOString().slice(0,10)}.pdf`);
    showNotification('Laporan PDF berhasil diunduh.', 'success');
}

function showPreview() {
    const dataToPreview = getFilteredDataForExport('print');
    if (dataToPreview.length === 0) return showNotification('Tidak ada data untuk pratinjau sesuai filter.', 'warning');

    const previewModalTitle = document.getElementById('previewModalTitle');
    const previewContent = document.getElementById('previewContent');
    
    if (!previewModalTitle || !previewContent) return;
    
    previewModalTitle.textContent = `Pratinjau Laporan (${dataToPreview.length} data)`;
    
    let content = `
        <div class="print-header text-center mb-4">
            <h4>${appSettings.appName}</h4>
            <p class="mb-1">${appSettings.appSubtitle}</p>
            <p class="text-muted">Tanggal: ${formatDate(new Date().toISOString())}</p>
        </div>
        <table class="preview-table"><thead><tr>
            <th>No</th><th>Nama</th><th>NIK</th><th>Desa</th><th>Nama Bantuan</th><th>Jumlah</th><th>Tanggal</th>
        </tr></thead><tbody>`;

    dataToPreview.forEach((d, i) => {
        content += `<tr>
            <td>${i + 1}</td><td>${d.nama}</td><td>${formatPrivacy(d.nik)}</td><td>${d.desa}</td>
            <td>${d.namaBantuan}</td><td>${formatNumber(d.jumlahBantuan)} ${d.satuanBantuan}</td><td>${formatDate(d.tanggalTerima)}</td>
        </tr>`;
    });

    content += `</tbody></table>`;
    previewContent.innerHTML = content;
    
    try {
        new bootstrap.Modal(document.getElementById('previewModal')).show();
    } catch (error) {
        console.error('Error showing preview modal:', error);
    }
}

function exportData(format) {
    const dataToExport = getFilteredDataForExport('export');
    if (dataToExport.length === 0) return showNotification('Tidak ada data untuk diekspor sesuai filter.', 'warning');

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `data_nelayan_${timestamp}`;

    switch(format) {
        case 'excel':
            if (typeof XLSX === 'undefined') {
                showNotification('Library XLSX tidak tersedia.', 'error');
                return;
            }
            
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data');
            XLSX.writeFile(wb, `${filename}.xlsx`);
            break;
            
        case 'csv':
            if (typeof XLSX === 'undefined') {
                showNotification('Library XLSX tidak tersedia.', 'error');
                return;
            }
            
            const csvWs = XLSX.utils.json_to_sheet(dataToExport);
            const csv = XLSX.utils.sheet_to_csv(csvWs);
            downloadFile(csv, 'text/csv', `${filename}.csv`);
            break;
            
        case 'json':
            downloadFile(JSON.stringify(dataToExport, null, 2), 'application/json', `${filename}.json`);
            break;
            
        case 'pdf':
            if (typeof window.jspdf === 'undefined') {
                showNotification('Library jsPDF tidak tersedia.', 'error');
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape', 'pt', 'a4');
            doc.text('DATA BANTUAN NELAYAN', doc.internal.pageSize.getWidth()/2, 40, {align: 'center'});
            doc.autoTable({ 
                body: dataToExport, 
                startY: 60, 
                theme: 'grid', 
                headStyles: { 
                    fillColor: [0, 95, 115] 
                } 
            });
            doc.save(`${filename}.pdf`);
            break;
    }
    showNotification(`Data berhasil diekspor ke format ${format.toUpperCase()}.`, 'success');
}

function downloadFile(content, mimeType, filename) {
    try {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error downloading file:', error);
        showNotification('Gagal mengunduh file.', 'error');
    }
}

// --- FITUR BARU: EKSTRAK DATA UNTUK PETA STATISTIK ---
function generateDataPeta() {
    const securityCode = document.getElementById('extractSecurityCode').value;
    const errorElement = document.getElementById('extractSecurityCodeError');
    
    if (securityCode !== SECURITY_CONSTANTS.EXTRACT_CODE) {
        if (errorElement) errorElement.style.display = 'block';
        showNotification('Kode keamanan salah.', 'error');
        return;
    }
    
    if (errorElement) errorElement.style.display = 'none';
    
    if (appData.length === 0) {
        // Jika tidak ada data di appData, gunakan data contoh
        generatedPetaData = SAMPLE_DATA;
        
        // Tampilkan preview
        const extractPreviewSection = document.getElementById('extractPreviewSection');
        const extractPreview = document.getElementById('extractPreview');
        
        if (extractPreviewSection) extractPreviewSection.style.display = 'block';
        if (extractPreview) extractPreview.innerHTML = JSON.stringify(generatedPetaData, null, 2);
        
        showNotification('Menggunakan data contoh karena database kosong.', 'warning');
        return;
    }
    
    // Proses data untuk statistik per desa
    const dataByDesa = {};
    
    appData.forEach(item => {
        const key = `${item.desa}, ${item.kecamatan}`;
        
        if (!dataByDesa[key]) {
            dataByDesa[key] = {
                key: key, // Simpan key untuk referensi
                desa: item.desa,
                kecamatan: item.kecamatan,
                jumlahPenerima: 0,
                jenisBantuan: {},
                totalBantuanUang: 0,
                totalBantuanBarang: 0,
                totalBantuanJasa: 0,
                tahunDistribusi: {},
                kelompokDistribusi: {},
                detailPenerima: [],
                statistik: {
                    uang: { jumlah: 0, nilai: 0 },
                    barang: { jumlah: 0, nilai: 0 },
                    jasa: { jumlah: 0, nilai: 0 }
                },
                koordinat: item.koordinat || getKoordinatDesa(item.desa, item.kecamatan)
            };
        }
        
        // Update statistik
        dataByDesa[key].jumlahPenerima++;
        
        // Update jenis bantuan
        if (!dataByDesa[key].jenisBantuan[item.jenisBantuan]) {
            dataByDesa[key].jenisBantuan[item.jenisBantuan] = 0;
        }
        dataByDesa[key].jenisBantuan[item.jenisBantuan]++;
        
        // Update distribusi tahun
        if (!dataByDesa[key].tahunDistribusi[item.tahunAnggaran]) {
            dataByDesa[key].tahunDistribusi[item.tahunAnggaran] = 0;
        }
        dataByDesa[key].tahunDistribusi[item.tahunAnggaran]++;
        
        // Update distribusi kelompok
        const kelompok = item.namaKelompok || 'Individu';
        if (!dataByDesa[key].kelompokDistribusi[kelompok]) {
            dataByDesa[key].kelompokDistribusi[kelompok] = 0;
        }
        dataByDesa[key].kelompokDistribusi[kelompok]++;
        
        // Update statistik detail
        const jumlah = parseFloat(item.jumlahBantuan) || 0;
        if (item.jenisBantuan === 'Uang') {
            dataByDesa[key].totalBantuanUang += jumlah;
            dataByDesa[key].statistik.uang.jumlah++;
            dataByDesa[key].statistik.uang.nilai += jumlah;
        } else if (item.jenisBantuan === 'Barang') {
            dataByDesa[key].totalBantuanBarang += jumlah;
            dataByDesa[key].statistik.barang.jumlah++;
            dataByDesa[key].statistik.barang.nilai += jumlah;
        } else if (item.jenisBantuan === 'Jasa') {
            dataByDesa[key].totalBantuanJasa += jumlah;
            dataByDesa[key].statistik.jasa.jumlah++;
            dataByDesa[key].statistik.jasa.nilai += jumlah;
        }
        
        // Tambah detail penerima (tanpa data sensitif)
        dataByDesa[key].detailPenerima.push({
            nama: item.nama,
            nik: formatPrivacy(item.nik),
            whatsapp: formatPrivacy(item.whatsapp),
            jenisBantuan: item.jenisBantuan,
            namaBantuan: item.namaBantuan,
            jumlah: item.jumlahBantuan,
            satuan: item.satuanBantuan,
            tahun: item.tahunAnggaran,
            kelompok: item.namaKelompok || 'Individu',
            jabatan: item.jabatan || '-',
            tanggal: formatDate(item.tanggalTerima),
            petugas: item.namaPetugas,
            koordinat: item.koordinat || getKoordinatDesa(item.desa, item.kecamatan)
        });
    });
    
    // Konversi ke array dan format untuk peta
    const dataPeta = {
        metadata: {
            generatedAt: new Date().toISOString(),
            timestamp: Date.now(),
            totalDesa: Object.keys(dataByDesa).length,
            totalPenerima: appData.length,
            sumber: 'Sistem Bantuan Nelayan Kab. Situbondo',
            instansi: 'Dinas Peternakan dan Perikanan Kab. Situbondo',
            bidang: 'Pemberdayaan Nelayan',
            versi: '2.0',
            lastUpdate: new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        summary: {
            totalBantuanUang: Object.values(dataByDesa).reduce((sum, d) => sum + d.totalBantuanUang, 0),
            totalBantuanBarang: Object.values(dataByDesa).reduce((sum, d) => sum + d.totalBantuanBarang, 0),
            totalBantuanJasa: Object.values(dataByDesa).reduce((sum, d) => sum + d.totalBantuanJasa, 0),
            desaTerbanyak: Object.entries(dataByDesa).sort((a, b) => b[1].jumlahPenerima - a[1].jumlahPenerima)[0] || null
        },
        data: Object.values(dataByDesa).map(item => {
            // Format jenis bantuan untuk peta
            const jenisBantuanFormatted = Object.keys(item.jenisBantuan).map(jenis => ({
                jenis: jenis,
                jumlah: item.jenisBantuan[jenis]
            }));
            
            // Format tahun distribusi
            const tahunDistribusiFormatted = Object.keys(item.tahunDistribusi).map(tahun => ({
                tahun: tahun,
                jumlah: item.tahunDistribusi[tahun]
            }));
            
            // Format kelompok distribusi
            const kelompokDistribusiFormatted = Object.keys(item.kelompokDistribusi).map(kelompok => ({
                kelompok: kelompok,
                jumlah: item.kelompokDistribusi[kelompok]
            }));
            
            // Hitung total bantuan
            const totalBantuan = item.totalBantuanUang + item.totalBantuanBarang + item.totalBantuanJasa;
            const maxPenerima = Math.max(...Object.values(dataByDesa).map(d => d.jumlahPenerima));
            const warnaIntensitas = maxPenerima > 0 ? item.jumlahPenerima / maxPenerima : 0;
            
            // Buat ID unik dari desa dan kecamatan
            const id = item.key.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            
            return {
                id: id,
                desa: item.desa,
                kecamatan: item.kecamatan,
                jumlahPenerima: item.jumlahPenerima,
                totalBantuanBarang: item.totalBantuanBarang,
                totalBantuanUang: item.totalBantuanUang,
                totalBantuanJasa: item.totalBantuanJasa,
                totalBantuan: totalBantuan,
                rataBantuan: item.jumlahPenerima > 0 ? totalBantuan / item.jumlahPenerima : 0,
                koordinat: item.koordinat,
                tahunDistribusi: tahunDistribusiFormatted,
                jenisBantuan: jenisBantuanFormatted,
                kelompokDistribusi: kelompokDistribusiFormatted,
                statistik: item.statistik,
                detailPenerima: item.detailPenerima,
                warnaIntensitas: warnaIntensitas,
                popupContent: `
                    <strong>${item.desa}, ${item.kecamatan}</strong><br>
                    Jumlah Penerima: ${item.jumlahPenerima}<br>
                    Total Bantuan: Rp ${formatNumber(totalBantuan)}<br>
                    Uang: ${item.statistik.uang.jumlah} penerima (Rp ${formatNumber(item.totalBantuanUang)})<br>
                    Barang: ${item.statistik.barang.jumlah} penerima (${formatNumber(item.totalBantuanBarang)} unit)<br>
                    Jasa: ${item.statistik.jasa.jumlah} penerima (${formatNumber(item.totalBantuanJasa)} paket)<br>
                    Koordinat: ${item.koordinat.lat.toFixed(6)}, ${item.koordinat.lng.toFixed(6)}
                `
            };
        })
    };
    
    // Simpan data untuk preview dan download
    generatedPetaData = dataPeta;
    
    // Tampilkan preview
    const extractPreviewSection = document.getElementById('extractPreviewSection');
    const extractPreview = document.getElementById('extractPreview');
    
    if (extractPreviewSection) extractPreviewSection.style.display = 'block';
    if (extractPreview) extractPreview.innerHTML = JSON.stringify(dataPeta, null, 2);
    
    showNotification('Data peta berhasil digenerate!', 'success');
}

function downloadDataPeta() {
    if (!generatedPetaData) {
        showNotification('Generate data terlebih dahulu.', 'warning');
        return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileContent = `// DATA PETA STATISTIK NELAYAN KAB. SITUBONDO
// Generated: ${new Date().toLocaleString('id-ID')}
// Total Desa: ${generatedPetaData.metadata.totalDesa}
// Total Penerima: ${generatedPetaData.metadata.totalPenerima}
// Sumber: ${generatedPetaData.metadata.sumber}
// Last Update: ${generatedPetaData.metadata.lastUpdate}

window.DATA_PETA_STATISTIK = ${JSON.stringify(generatedPetaData, null, 2)};

// Fungsi untuk memuat data peta
function loadDataPetaStatistik() {
    if (typeof DATA_PETA_STATISTIK !== 'undefined') {
        console.log('Data peta statistik berhasil dimuat:', DATA_PETA_STATISTIK);
        return DATA_PETA_STATISTIK;
    }
    return null;
}

// Fungsi untuk mendapatkan data berdasarkan desa
function getDataByDesa(namaDesa, kecamatan) {
    if (!DATA_PETA_STATISTIK || !DATA_PETA_STATISTIK.data) return null;
    
    return DATA_PETA_STATISTIK.data.find(item => 
        item.desa === namaDesa && item.kecamatan === kecamatan
    );
}

// Fungsi untuk mendapatkan data berdasarkan kecamatan
function getDataByKecamatan(kecamatan) {
    if (!DATA_PETA_STATISTIK || !DATA_PETA_STATISTIK.data) return [];
    
    return DATA_PETA_STATISTIK.data.filter(item => item.kecamatan === kecamatan);
}

// Fungsi untuk mendapatkan semua data kecamatan
function getAllKecamatanData() {
    if (!DATA_PETA_STATISTIK || !DATA_PETA_STATISTIK.data) return {};
    
    const result = {};
    DATA_PETA_STATISTIK.data.forEach(item => {
        if (!result[item.kecamatan]) {
            result[item.kecamatan] = {
                kecamatan: item.kecamatan,
                jumlahDesa: 0,
                jumlahPenerima: 0,
                totalBantuan: 0,
                desa: []
            };
        }
        result[item.kecamatan].jumlahDesa++;
        result[item.kecamatan].jumlahPenerima += item.jumlahPenerima;
        result[item.kecamatan].totalBantuan += item.totalBantuan;
        result[item.kecamatan].desa.push(item);
    });
    
    return result;
}

// Fungsi untuk update data secara realtime
function updatePetaData(newData) {
    if (!DATA_PETA_STATISTIK || !newData) return false;
    
    // Logika update data
    console.log('Memperbarui data peta...');
    return true;
}

// Ekspor untuk penggunaan global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DATA_PETA_STATISTIK,
        loadDataPetaStatistik,
        getDataByDesa,
        getDataByKecamatan,
        getAllKecamatanData,
        updatePetaData
    };
}`;

    try {
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'datapeta.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Hapus preview data setelah download
        generatedPetaData = null;
        const extractPreviewSection = document.getElementById('extractPreviewSection');
        const extractPreview = document.getElementById('extractPreview');
        
        if (extractPreviewSection) extractPreviewSection.style.display = 'none';
        if (extractPreview) extractPreview.innerHTML = '';
        
        showNotification('File datapeta.js berhasil didownload! Preview data telah dihapus.', 'success');
    } catch (error) {
        console.error('Error downloading datapeta.js:', error);
        showNotification('Gagal mengunduh file datapeta.js.', 'error');
    }
}

// --- BACKUP (RELOAD.JS) & RESTORE ---
function autoBackupData() {
    if (appData.length === 0) return;
    appSettings.lastBackupDate = new Date().toLocaleDateString('id-ID');
    saveSettings();
}

function backupData() {
    if (appData.length === 0) return showNotification('Tidak ada data untuk dibackup.', 'warning');
    
    // 1. Siapkan data JSON
    const dataToBackup = { appData, appSettings, generatedCodes, koordinatDesa, koordinatKecamatan };
    
    // 2. Enkripsi ke Base64
    const encryptedString = btoa(unescape(encodeURIComponent(JSON.stringify(dataToBackup))));
    
    // 3. Buat konten file JS with NEW APP NAME
    const timestamp = new Date().toLocaleString('id-ID');
    const appNameFull = "APLIKASI BARJAS BIDANG PEMBERDAYAAN NELAYAN";
    
    const fileContent = `/* PETUNJUK PENGGUNAAN RELOAD REPO:
    1. Ini adalah file backup otomatis dari Aplikasi.
    2. Jangan ubah kode di dalam tanda petik dua ("...") di bawah.
    3. Upload file ini ke hosting tempat aplikasi berjalan untuk fitur Reload Data.
    
    APP NAME : ${appNameFull}
    TANGGAL  : ${timestamp}
*/

window.BARJAS_BACKUP_ENCRYPTED = "${encryptedString}";
`;

    // 4. Download sebagai reload.js
    downloadFile(fileContent, 'text/javascript', 'reload.js');
    
    // Update timestamp
    appSettings.lastBackupDate = new Date().toLocaleDateString('id-ID');
    saveSettings();
    applySettingsToUI();
    showNotification('Backup file (reload.js) berhasil diunduh.', 'success');
}

function handleReloadFromRepo() {
    if(!confirm("Apakah Anda yakin ingin me-reload data dari repository? Data lokal akan digabungkan dengan data baru.")) return;
    
    const btn = document.getElementById('btn-reload-repo');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin feature-icon"></i> Loading...';
    btn.disabled = true;

    const oldScript = document.getElementById('reload-script');
    if(oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'reload-script';
    script.src = './reload.js?v=' + new Date().getTime(); 

    script.onload = function() {
        try {
            if (window.BARJAS_BACKUP_ENCRYPTED) {
                const rawContent = window.BARJAS_BACKUP_ENCRYPTED;
                let restored;
                try {
                    if (typeof rawContent === 'string') {
                        restored = JSON.parse(decodeURIComponent(escape(atob(rawContent))));
                    } else {
                        restored = rawContent;
                    }
                } catch (decryptionError) {
                    throw new Error("Gagal mendekripsi data.");
                }
                
                // LOGIKA MERGE DATA
                if(restored && restored.appData && Array.isArray(restored.appData)) {
                    
                    const existingIds = new Set(appData.map(item => item.id));
                    let addedCount = 0;

                    restored.appData.forEach(newItem => {
                        if (!existingIds.has(newItem.id)) {
                            appData.push(newItem);
                            existingIds.add(newItem.id); 
                            addedCount++;
                        }
                    });

                    if(restored.generatedCodes) {
                        generatedCodes = { ...restored.generatedCodes, ...generatedCodes }; 
                    }
                    
                    // Update koordinat jika ada
                    if(restored.koordinatDesa) {
                        Object.assign(koordinatDesa, restored.koordinatDesa);
                    }
                    
                    // Update koordinat kecamatan jika ada
                    if(restored.koordinatKecamatan) {
                        Object.assign(koordinatKecamatan, restored.koordinatKecamatan);
                    }

                    saveData();
                    saveSettings();
                    applySettingsToUI();
                    updateDashboard();
                    renderDataTable();
                    
                    // Update map
                    if (mapDashboard) {
                        initializeMapDashboard();
                    }
                    
                    if (addedCount > 0) {
                        showNotification(`Berhasil reload! ${addedCount} data baru ditambahkan.`, 'success');
                    } else {
                        showNotification('Reload selesai. Tidak ada data baru yang ditemukan.', 'info');
                    }

                } else {
                    throw new Error('Format data tidak valid.');
                }
            } else {
                throw new Error('Variabel backup tidak ditemukan di reload.js.');
            }
        } catch (e) {
            showNotification('Error: ' + e.message, 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            delete window.BARJAS_BACKUP_ENCRYPTED;
        }
    };

    script.onerror = function() {
        showNotification('Gagal memuat file reload.js. Pastikan file ada di folder yang sama.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
    };
    document.body.appendChild(script);
}

function enableRestoreButton() {
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    if (restoreDataBtn) {
        restoreDataBtn.disabled = !this.files.length;
    }
}

function restoreData() {
    const file = document.getElementById('restoreFileInput').files[0];
    if (!file || !confirm('PENTING: Restore akan menimpa semua data. Lanjutkan?')) return;
    
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const content = e.target.result;
            let restored;
            
            // Cek apakah file reload.js (mengandung window.BARJAS...) atau JSON biasa
            if (content.includes('window.BARJAS_BACKUP_ENCRYPTED')) {
                // Extract string dalam tanda petik
                const match = content.match(/window\.BARJAS_BACKUP_ENCRYPTED\s*=\s*"([^"]+)"/);
                if (match && match[1]) {
                    restored = JSON.parse(decodeURIComponent(escape(atob(match[1]))));
                } else {
                    throw new Error("Format reload.js tidak valid.");
                }
            } else {
                // Coba parse sebagai JSON biasa (legacy backup)
                try {
                    restored = JSON.parse(decodeURIComponent(escape(atob(content))));
                } catch (err) {
                    restored = JSON.parse(content);
                }
            }

            if (restored && restored.appData && restored.appSettings) {
                appData = restored.appData;
                Object.assign(appSettings, restored.appSettings);
                
                // PASTIKAN KODE KEAMANAN TETAP DEFAULT JIKA KOSONG SETELAH RESTORE
                 if (!appSettings.securityCode || appSettings.securityCode.trim() === '') {
                     appSettings.securityCode = SECURITY_CONSTANTS.DEFAULT_PASS;
                 }

                generatedCodes = restored.generatedCodes || {};
                
                // Update koordinat jika ada
                if(restored.koordinatDesa) {
                    Object.assign(koordinatDesa, restored.koordinatDesa);
                }
                
                // Update koordinat kecamatan jika ada
                if(restored.koordinatKecamatan) {
                    Object.assign(koordinatKecamatan, restored.koordinatKecamatan);
                }
                
                saveData();
                saveSettings();
                applySettingsToUI();
                document.getElementById('restoreFileInput').value = '';
                
                const restoreDataBtn = document.getElementById('restoreDataBtn');
                if (restoreDataBtn) restoreDataBtn.disabled = true;
                
                updateDashboard();
                renderDataTable();
                
                // Update map
                if (mapDashboard) {
                    initializeMapDashboard();
                }
                
                showNotification('Data berhasil direstore.', 'success');
            } else {
                throw new Error("Struktur data tidak valid.");
            }
        } catch (error) {
            console.error(error);
            showNotification('Gagal merestore data. File mungkin rusak.', 'error');
        }
    };
    reader.readAsText(file);
}

function enableResetButton() {
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    if (confirmResetBtn) {
        confirmResetBtn.disabled = this.value !== 'RESET';
    }
}

function performFactoryReset() {
    appData = [];
    generatedCodes = {};
    // Reset Settings tapi pertahankan default password
    appSettings.securityCode = SECURITY_CONSTANTS.DEFAULT_PASS;
    saveData();
    saveSettings();
    
    const resetConfirmationInput = document.getElementById('resetConfirmationInput');
    if (resetConfirmationInput) resetConfirmationInput.value = '';
    
    updateDashboard();
    renderDataTable();
    
    // Update map
    if (mapDashboard) {
        initializeMapDashboard();
    }
    
    showNotification('Data telah direset!', 'warning');
}

// --- UTILS ---
function setupBrowserInfo() {
    const agent = navigator.userAgent;
    let browserName = "Unknown";
    if (agent.indexOf("Firefox") > -1) browserName = "Firefox";
    else if (agent.indexOf("Chrome") > -1) browserName = "Chrome";
    else if (agent.indexOf("Safari") > -1) browserName = "Safari";
    
    const browserInfo = document.getElementById('browserInfo');
    if (browserInfo) browserInfo.textContent = browserName;
    
    try {
        const usedStorage = (JSON.stringify(localStorage).length / 1024).toFixed(2);
        const storageInfo = document.getElementById('storageInfo');
        if (storageInfo) storageInfo.textContent = `${usedStorage} KB`;
    } catch (e) {
        const storageInfo = document.getElementById('storageInfo');
        if (storageInfo) storageInfo.textContent = 'Error';
    }
}

function toggleMobileMenu() {
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebarMenu) sidebarMenu.classList.toggle('mobile-show');
    if (sidebarOverlay) sidebarOverlay.classList.toggle('mobile-show');
}

function showNotification(message, type = 'info') {
    if (!appSettings.notifications) return;
    
    const toastEl = document.querySelector('.notification-toast');
    if (!toastEl) return;
    
    const toastHeader = toastEl.querySelector('.toast-header');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toastMessage) return;
    
    toastMessage.textContent = message;
    
    const styles = {
        success: { bg: 'bg-success-subtle', text: 'text-success-emphasis', title: 'Berhasil' },
        error: { bg: 'bg-danger-subtle', text: 'text-danger-emphasis', title: 'Gagal' },
        warning: { bg: 'bg-warning-subtle', text: 'text-warning-emphasis', title: 'Peringatan' },
        info: { bg: 'bg-primary-subtle', text: 'text-primary-emphasis', title: 'Informasi' }
    };
    
    if (toastHeader) {
        toastHeader.className = `toast-header ${styles[type].bg} ${styles[type].text}`;
    }
    
    if (toastTitle) {
        toastTitle.textContent = styles[type].title;
    }
    
    try {
        new bootstrap.Toast(toastEl).show();
    } catch (error) {
        console.error('Error showing toast:', error);
    }
}

function formatDate(dateString) {
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
}

function formatNumber(num) {
    if (isNaN(num) || num === undefined || num === null) return num; 
    try {
        return new Intl.NumberFormat('id-ID').format(num);
    } catch (error) {
        return num;
    }
}

// Ekspor fungsi ke global scope untuk aksi dari HTML
window.showDetailData = showDetailData;
window.editData = editData;
window.deleteData = deleteData;
window.triggerSmartMenu = triggerSmartMenu;
window.changePage = changePage;