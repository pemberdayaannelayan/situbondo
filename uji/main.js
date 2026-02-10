// =====================================================
// KODE UTAMA APLIKASI SIMPADAN TANGKAP - VERSI 6.1 FINAL REVISI
// DENGAN ID CARD GENERATOR YANG DISEMPURNAKAN
// REVISI: PERBAIKAN FORMAT PDF DAN INTEGRASI SENSOR DATA
// TAMBAHAN: FITUR ALAMAT SEBELUM KECAMATAN
// REVISI ID CARD: PERUBAHAN FORMAT PROFESI DAN ALAT TANGKAP
// PERBAIKAN: TAMBAHAN INFORMASI VALIDASI DI QRCODE ID CARD
// PERBAIKAN TAMBAHAN: 
// 1. FITUR FILTER DATA GANDA YANG LEBIH KETAT
// 2. INPUT OTOMATIS HURUF KAPITAL UNTUK NAMA DAN ALAMAT
// 3. FITUR MEMUAT DATA PER KECAMATAN
// REVISI CETAK PDF: MENGHAPUS KOLOM NAMA PERAHU DAN KODE VALIDASI
// PERBAIKAN CETAK PDF: TABEL TIDAK MELEBIHI BATAS HALAMAN
// PERBAIKAN KEAMANAN: TAMBAHAN PASSWORD UNTUK MENU INPUT DATA DAN DATA NELAYAN
// PERBAIKAN TAMBAHAN: FITUR SHOW/HIDE PASSWORD UNTUK SEMUA KODE KEAMANAN
// FITUR BARU: TOMBOL ON/OFF KODE KEAMANAN AKSES MENU
// PERBAIKAN: MODAL AUTH KEMBALI KE DASHBOARD SAAT DITUTUP
// =====================================================

// =====================================================
// BAGIAN 1: KONSTANTA DATA APLIKASI
// =====================================================

/**
 * DATA KATEGORI IKAN
 * Berisi daftar ikan berdasarkan kategori (Demersal, Pelagis Kecil, Pelagis Besar)
 */
const FISH_CATEGORIES = {
    "Demersal": [
        {name: "Ikan Mangla (Pomadasys spp.)", latin: "Pomadasys spp."},
        {name: "Ikan Sebelah (Pleuronectiformes)", latin: "Pleuronectiformes"},
        {name: "Ikan Lidah (Cynoglossus spp.)", latin: "Cynoglossus spp."},
        {name: "Ikan Petek (Leiognathus spp.)", latin: "Leiognathus spp."},
        {name: "Ikan Duri (Arius spp.)", latin: "Arius spp."},
        {name: "Ikan Kerapu (Epinephelus spp.)", latin: "Epinephelus spp."},
        {name: "Ikan Kakap Merah (Lutjanus spp.)", latin: "Lutjanus spp."},
        {name: "Ikan Sembilang (Plotosus canius)", latin: "Plotosus canius"},
        {name: "Ikan Biji Nangka (Upeneus spp.)", latin: "Upeneus spp."},
        {name: "Ikan Kurisi (Nemipterus spp.)", latin: "Nemipterus spp."},
        {name: "Ikan Togek / Mendut (Star Triggerfish)", latin: "Abalistes stellaris"}
    ],
    "Pelagis Kecil": [
        {name: "Ikan Tembang (Sardinella gibbosa)", latin: "Sardinella gibbosa"},
        {name: "Ikan Kembung Lelaki & Perempuan (Rastrelliger spp.)", latin: "Rastrelliger spp."},
        {name: "Ikan Selar Kuning (Selaroides leptolepis)", latin: "Selaroides leptolepis"},
        {name: "Ikan Layang (Decapterus spp.)", latin: "Decapterus spp."},
        {name: "Ikan Teri (Stolephorus spp.)", latin: "Stolephorus spp."},
        {name: "Ikan Japuh (Caranx spp.)", latin: "Caranx spp."},
        {name: "Ikan Lemuru (Sardinella lemuru)", latin: "Sardinella lemuru"},
        {name: "Ikan Bentong (Megalaspis cordyla)", latin: "Megalaspis cordyla"},
        {name: "Ikan Banyar (Carangoides spp.)", latin: "Carangoides spp."},
        {name: "Ikan Banyar Mata Besar (Megalaspis cordyla)", latin: "Megalaspis cordyla"}
    ],
    "Pelagis Besar": [
        {name: "Ikan Tongkol (Euthynnus affinis)", latin: "Euthynnus affinis"},
        {name: "Ikan Cakalang (Katsuwonus pelamis)", latin: "Katsuwonus pelamis"},
        {name: "Ikan Tenggiri (Scomberomorus commerson)", latin: "Scomberomorus commerson"},
        {name: "Ikan Tuna Sirip Kuning (Thunnus albacares)", latin: "Thunnus albacares"},
        {name: "Ikan Tuna Mata Besar (Thunnus obesus)", latin: "Thunnus obesus"},
        {name: "Ikan Layur (Trichiurus lepturus)", latin: "Trichiurus lepturus"},
        {name: "Ikan Todak (Xiphias gladius)", latin: "Xiphias gladius"},
        {name: "Ikan Lemadang (Coryphaena hippurus)", latin: "Coryphaena hippurus"},
        {name: "Ikan Marlin (Makaira spp.)", latin: "Makaira spp."},
        {name: "Ikan Cucut (Carcharhinus limbatus)", latin: "Carcharhinus limbatus"}
    ]
};

/**
 * MAPPING KAPAL DAN ALAT TANGKAP
 * Menentukan alat tangkap yang sesuai untuk setiap jenis kapal
 */
const KAPAL_API_MAPPING = {
    "Perahu Jukung": ["Pancing", "Pancing Ulur", "Perangkap Bubu", "Jaring Insang (gill net)", "Pancing Berjoran", "Jala Tebar"],
    "Perahu Mayang": ["Pukat Tarik", "Pancing", "Jaring Insang (gill net)", "Jaring Angkat (lift net)", "Cantrang"],
    "Perahu Slerek": ["Pukat Cincin", "Pukat Tarik", "Jaring Angkat (lift net)"],
    "Perahu Insang": ["Jaring Insang (gill net)", "Jaring Insang Hanyut", "Jaring Insang Kombinasi", "Jaring Insang Tetap"],
    "Perahu Jaring Angkat": ["Jaring Angkat (lift net)"],
    "Perahu Pancing": ["Pancing", "Pancing Ulur", "Pancing Berjoran", "Pancing Cumi"],
    "Perahu Pukat Tarik": ["Pukat Tarik", "Pancing", "Jaring Insang (gill net)", "Jaring Angkat (lift net)", "Cantrang"],
    "Kapal Motor": ["Pukat Cincin", "Pukat Tarik", "Pancing Ulur", "Jaring Insang (gill net)", "Jaring Angkat (lift net)", "Pancing", "Perangkap Bubu", "Rawai Dasar", "Jaring Insang Hanyut", "Huhate", "Pancing Berjoran", "Jala Tebar", "Cantrang", "Rawai Tuna", "Jaring Insang Kombinasi", "Jaring Insang Tetap", "Pancing Cumi", "Jaring Lingkar Tanpa Tali Kerut", "Lainnya"],
    "Kapal Motor Tempel": ["Pancing", "Pancing Ulur", "Perangkap Bubu", "Jaring Insang (gill net)", "Pancing Berjoran", "Jala Tebar", "Cantrang", "Pancing Cumi", "Lainnya"],
    "Lainnya": ["Pukat Cincin", "Pukat Tarik", "Pancing Ulur", "Jaring Insang (gill net)", "Jaring Angkat (lift net)", "Pancing", "Perangkap Bubu", "Rawai Dasar", "Jaring Insang Hanyut", "Huhate", "Pancing Berjoran", "Jala Tebar", "Cantrang", "Rawai Tuna", "Jaring Insang Kombinasi", "Jaring Insang Tetap", "Pancing Cumi", "Jaring Lingkar Tanpa Tali Kerut", "Lainnya"]
};

/**
 * MAPPING ALAT TANGKAP DAN KATEGORI IKAN
 * Menentukan kategori ikan yang bisa ditangkap dengan setiap alat tangkap
 */
const API_FISH_MAPPING = {
    "Pukat Cincin": ["Pelagis Besar", "Pelagis Kecil"],
    "Pukat Tarik": ["Pelagis Kecil", "Pelagis Besar", "Demersal"],
    "Pancing Ulur": ["Demersal", "Pelagis Besar"],
    "Rawai Dasar": ["Demersal"],
    "Jaring Insang (gill net)": ["Demersal", "Pelagis Kecil", "Pelagis Besar"],
    "Jaring Insang Hanyut": ["Pelagis Kecil", "Pelagis Besar"],
    "Huhate": ["Pelagis Besar"],
    "Pancing Berjoran": ["Demersal", "Pelagis Kecil", "Pelagis Besar"],
    "Jaring Angkat (lift net)": ["Pelagis Kecil", "Demersal"],
    "Pancing": ["Demersal", "Pelagis Kecil", "Pelagis Besar"],
    "Jala Tebar": ["Pelagis Kecil"],
    "Cantrang": ["Demersal", "Pelagis Kecil"],
    "Perangkap Bubu": ["Demersal", "Pelagis Kecil"],
    "Rawai Tuna": ["Pelagis Besar"],
    "Jaring Insang Kombinasi": ["Demersal", "Pelagis Kecil", "Pelagis Besar"],
    "Jaring Insang Tetap": ["Demersal", "Pelagis Kecil"],
    "Pancing Cumi": ["Demersal"],
    "Jaring Lingkar Tanpa Tali Kerut": ["Pelagis Kecil", "Pelagis Besar"],
    "Lainnya": ["Demersal", "Pelagis Kecil", "Pelagis Besar"]
};

/**
 * INFORMASI ALAT TANGKAP
 * Deskripsi singkat untuk setiap alat tangkap
 */
const API_INFO = {
    "Pukat Cincin": "Alat tangkap untuk ikan pelagis besar",
    "Pukat Tarik": "Alat tangkap untuk ikan pelagis kecil",
    "Pancing Ulur": "Alat tangkap untuk ikan dasar",
    "Rawai Dasar": "Alat tangkap dengan banyak mata pancing di dasar perairan",
    "Jaring Insang (gill net)": "Alat tangkap untuk berbagai jenis ikan",
    "Jaring Insang Hanyut": "Jaring insang yang dihanyutkan dengan arus",
    "Huhate": "Alat tangkap khusus untuk ikan tuna",
    "Pancing Berjoran": "Pancing dengan menggunakan joran",
    "Jaring Angkat (lift net)": "Alat tangkap untuk ikan permukaan",
    "Pancing": "Alat tangkap tradisional",
    "Jala Tebar": "Jala yang ditebar untuk menangkap ikan",
    "Cantrang": "Jaring tarik berukuran kecil",
    "Perangkap Bubu": "Alat tangkap berupa perangkap",
    "Rawai Tuna": "Rawai khusus untuk menangkap tuna",
    "Jaring Insang Kombinasi": "Jaring insang dengan berbagai ukuran mata",
    "Jaring Insang Tetap": "Jaring insang yang dipasang tetap",
    "Pancing Cumi": "Pancing khusus untuk cumi-cumi",
    "Jaring Lingkar Tanpa Tali Kerut": "Jaring lingkar tanpa sistem tali kerut",
    "Lainnya": "Alat tangkap lainnya"
};

/**
 * INFORMASI PERAHU
 * Deskripsi singkat untuk setiap jenis kapal/perahu
 */
const KAPAL_INFO = {
    "Perahu Jukung": "Perahu tradisional kecil",
    "Perahu Mayang": "Perahu tradisional sedang",
    "Perahu Slerek": "Perahu khas Situbondo",
    "Perahu Insang": "Perahu untuk jaring insang",
    "Perahu Jaring Angkat": "Perahu untuk jaring angkat",
    "Perahu Pancing": "Perahu untuk pancing",
    "Perahu Pukat Tarik": "Perahu untuk pukat tarik",
    "Kapal Motor": "Kapal dengan motor penggerak utama",
    "Kapal Motor Tempel": "Kapal dengan motor tempel sebagai penggerak",
    "Lainnya": "Jenis kapal lainnya"
};

/**
 * INFORMASI PROFESI
 * Deskripsi untuk setiap jenis profesi nelayan
 */
const PROFESI_INFO = {
    "Nelayan Penuh Waktu": "Nelayan yang bekerja sebagai penangkap ikan sebagai mata pencaharian utama",
    "Nelayan Sambilan Utama": "Nelayan yang bekerja sebagai penangkap ikan sebagai pekerjaan sampingan utama",
    "Nelayan Sambilan Tambahan": "Nelayan yang bekerja sebagai penangkap ikan sebagai pekerjaan tambahan"
};

/**
 * DATA WILAYAH SITUBONDO
 * Struktur data kecamatan dan desa di Kabupaten Situbondo
 */
const SITUBONDO_DATA = {
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
    "Panji": ["Ardirejo", "Mimbaan", "Battal", "Curah Jeru", "Juglangan", "Kayu Putih", "Klampokan", "Panji Kidul", "Panji Lor", "Sliwung", "Tenggir", "Tokelan"],
    "Situbondo": ["Dawuhan", "Patokan", "Kalibagor", "Kotakan", "Olean", "Talkandang"],
    "Suboh": ["Buduan", "Cemara", "Dawuan", "Gunung Malang", "Gunung Putri", "Ketah", "Mojodungkol", "Suboh"],
    "Sumbermalang": ["Alastengah", "Baderan", "Kalirejo", "Plalangan", "Sumberargo", "Taman", "Tamankursi", "Tamansari", "Tlogosari"]
};

/**
 * DAFTAR DESA UNTUK FITUR DATA WILAYAH
 * Daftar desa beserta file data JavaScript yang terkait
 */
const DESA_LIST = [
    { name: "Kilensari", file: "kilensari.js" },
    { name: "Klatakan", file: "klatakan.js" },
    { name: "Pasir Putih", file: "pasirputih.js" },
    { name: "Ketah", file: "ketah.js" },
    { name: "Demung", file: "demung.js" },
    { name: "Pesisir", file: "pesisir.js" },
    { name: "Besuki", file: "besuki.js" },
    { name: "Kalianget", file: "kalianget.js" },
    { name: "Sumberanyar", file: "sumberanyar.js" },
    { name: "Tanjung Pecinan", file: "tanjungpecinan.js" },
    { name: "Tanjung Kamal", file: "tanjungkamal.js" },
    { name: "Buduan", file: "buduan.js" },
    { name: "Lamongan", file: "lamongan.js" },
    { name: "Sumberwaru", file: "sumberwaru.js" },
    { name: "Duwet", file: "duwet.js" },
    { name: "Gelung", file: "gelung.js" },
    { name: "Peleyan", file: "peleyan.js" },
    { name: "Alasmalang", file: "alasmalang.js" },
    { name: "Wringinanom-Asembagus", file: "wringinanomasembagus.js" },
    { name: "Wringinanom-Panarukan", file: "wringinanompanarukan.js" },
    { name: "Sumberkolak", file: "sumberkolak.js" },
    { name: "Tanjung Glugur", file: "tanjungglugur.js" },
    { name: "Semiring", file: "semiring.js" },
    { name: "Arjasa", file: "arjasa.js" },
    { name: "Landangan", file: "landangan.js" },
    { name: "Seletreng", file: "seletreng.js" },
    { name: "Bungatan", file: "bungatan.js" },
    { name: "Blitok", file: "blitok.js" },
    { name: "Mlandingan Kulon", file: "mlandingankulon.js" },
    { name: "Selomukti", file: "selomukti.js" },
    { name: "Banyuglugur", file: "banyuglugur.js" },
    { name: "Wonorejo", file: "wonorejo.js" },
    { name: "Sumberejo", file: "sumberejo.js" },
    { name: "Jangkar", file: "jangkar.js" },
    { name: "Gadingan", file: "gadingan.js" },
    { name: "Kumbangsari", file: "kumbangsari.js" },
    { name: "Paowan", file: "paowan.js" }
];

/**
 * DAFTAR KECAMATAN UNTUK FITUR DATA KECAMATAN
 * Daftar kecamatan beserta file data JavaScript yang terkait
 */
const KECAMATAN_LIST = [
    { name: "Arjasa", file: "Kecamatan-Arjasa.js" },
    { name: "Asembagus", file: "Kecamatan-Asembagus.js" },
    { name: "Banyuglugur", file: "Kecamatan-Banyuglugur.js" },
    { name: "Banyuputih", file: "Kecamatan-Banyuputih.js" },
    { name: "Besuki", file: "Kecamatan-Besuki.js" },
    { name: "Bungatan", file: "Kecamatan-Bungatan.js" },
    { name: "Jangkar", file: "Kecamatan-Jangkar.js" },
    { name: "Jatibanteng", file: "Kecamatan-Jatibanteng.js" },
    { name: "Kapongan", file: "Kecamatan-Kapongan.js" },
    { name: "Kendit", file: "Kecamatan-Kendit.js" },
    { name: "Mangaran", file: "Kecamatan-Mangaran.js" },
    { name: "Mlandingan", file: "Kecamatan-Mlandingan.js" },
    { name: "Panarukan", file: "Kecamatan-Panarukan.js" },
    { name: "Panji", file: "Kecamatan-Panji.js" },
    { name: "Situbondo", file: "Kecamatan-Situbondo.js" },
    { name: "Suboh", file: "Kecamatan-Suboh.js" },
    { name: "Sumbermalang", file: "Kecamatan-Sumbermalang.js" }
];

/**
 * MAPPING PROFESI
 * Mapping untuk kompatibilitas dengan data lama
 */
const PROFESI_MAPPING = {
    "Penuh Waktu": "Nelayan Penuh Waktu",
    "Sambilan Utama": "Nelayan Sambilan Utama",
    "Sambilan Tambahan": "Nelayan Sambilan Tambahan"
};

// =====================================================
// BAGIAN 2: VARIABEL GLOBAL APLIKASI
// =====================================================

/**
 * DATA APLIKASI
 * Array untuk menyimpan data nelayan yang diinput
 */
let appData = [];

/**
 * PENGATURAN APLIKASI
 * Objek yang menyimpan semua pengaturan aplikasi
 */
let appSettings = {
    appName: 'SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP',
    appSubtitle: 'DINAS PERIKANAN KABUPATEN SITUBONDO',
    itemsPerPage: 5,
    privacyMode: true,
    securityCodeSensor: '97531',
    officialName: 'SUGENG PURWO PRIYANTO, S.E, M.M',
    officialNip: '19761103 200903 1 001',
    officialPosition: 'Kepala Bidang Pemberdayaan Nelayan',
    passwordInputData: '666666',
    passwordDataNelayan: '999999',
    securityMenuInputDataEnabled: true,
    securityMenuDataNelayanEnabled: true
};

/**
 * WILAYAH SEKARANG
 * Objek untuk melacak mode wilayah aktif (global, desa, kecamatan)
 */
let currentWilayah = {
    mode: 'global',
    desaName: null,
    kecamatanName: null,
    fileName: 'reload.js'
};

/**
 * VARIABEL STATUS APLIKASI
 * Variabel untuk melacak status aplikasi saat ini
 */
let currentPage = 1;
let duplicateCheckInterval = null;
let currentDetailId = null; 
let verifyDataResult = null;
let currentFilter = {};

/**
 * STATUS AUTHENTIKASI MENU
 * Status autentikasi untuk menu Input Data dan Data Nelayan
 */
let menuAuthStatus = {
    inputData: false,
    dataNelayan: false
};

/**
 * MODAL APLIKASI
 * Inisialisasi modal Bootstrap
 */
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
const loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
const modalDataWilayah = new bootstrap.Modal(document.getElementById('modalDataWilayah'));
let menuAuthModal = null;

/**
 * INISIALISASI DATA IKAN UNTUK KOMPATIBILITAS
 * Array dan objek untuk kompatibilitas dengan kode yang ada
 */
const FISH_TYPES = [];
const FISH_DETAILS = {};

// Isi array FISH_TYPES dan objek FISH_DETAILS
for (const category in FISH_CATEGORIES) {
    FISH_CATEGORIES[category].forEach(fish => {
        FISH_TYPES.push(fish.name);
        FISH_DETAILS[fish.name] = {
            latin: fish.latin,
            category: category
        };
    });
}
FISH_TYPES.push("Lainnya");

// Ekspos variabel ke window untuk akses dari file lain
window.appData = appData;
window.appSettings = appSettings;
window.currentWilayah = currentWilayah;

// =====================================================
// BAGIAN 3: FUNGSI LOADING EFFECT
// =====================================================

/**
 * MENAMPILKAN LOADING EFFECT
 * @param {string} title - Judul loading
 * @param {string} message - Pesan loading
 */
function showLoading(title = "Memproses Data", message = "Mohon tunggu, sistem sedang memproses permintaan Anda. Proses ini mungkin memerlukan waktu beberapa saat tergantung jumlah data yang tersedia.") {
    document.getElementById('loadingTitle').textContent = title;
    document.getElementById('loadingMessage').textContent = message;
    document.getElementById('loadingModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * MENYEMBUNYIKAN LOADING EFFECT
 */
function hideLoading() {
    document.getElementById('loadingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// =====================================================
// BAGIAN 4: FUNGSI SHOW/HIDE PASSWORD
// =====================================================

/**
 * SETUP TOGGLE PASSWORD VISIBILITY
 * @param {string} inputId - ID input password
 * @param {string} buttonId - ID tombol toggle
 */
function setupPasswordToggle(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);
    
    if (!passwordInput || !toggleButton) return;
    
    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            this.title = "Tampilkan password";
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            this.title = "Sembunyikan password";
        }
    });
}

/**
 * SETUP SEMUA TOGGLE PASSWORD
 * Setup untuk semua input password di aplikasi
 */
function setupAllPasswordToggles() {
    // Setup untuk login form
    setupPasswordToggle('securityCode', 'passwordToggle');
    
    // Setup untuk sensor code form
    const sensorForm = document.getElementById('sensorCodeForm');
    if (sensorForm) {
        const inputs = [
            { id: 'currentSensorCode', btnId: 'currentSensorCodeToggle' },
            { id: 'newSensorCode', btnId: 'newSensorCodeToggle' },
            { id: 'confirmSensorCode', btnId: 'confirmSensorCodeToggle' }
        ];
        
        inputs.forEach(input => {
            const inputElement = document.getElementById(input.id);
            if (inputElement && !inputElement.parentElement.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                inputElement.parentNode.insertBefore(wrapper, inputElement);
                wrapper.appendChild(inputElement);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = input.btnId;
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle(input.id, input.btnId);
            }
        });
    }
}

// =====================================================
// BAGIAN 5: FUNGSI KEAMANAN MENU
// =====================================================

/**
 * INISIALISASI MODAL AUTHENTIKASI MENU
 * Membuat modal autentikasi dinamis
 */
function initMenuAuthModal() {
    if (!document.getElementById('menuAuthModal')) {
        const modalHTML = `
        <div class="modal fade" id="menuAuthModal" tabindex="-1" aria-labelledby="menuAuthModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="menuAuthModalLabel">Autentikasi Menu</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="menuAuthPassword" class="form-label">Masukkan Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="menuAuthPassword" placeholder="Password" autocomplete="off">
                                <button class="btn btn-outline-secondary" type="button" id="menuAuthPasswordToggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Masukkan password untuk mengakses menu ini.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="menuAuthCancelBtn">Batal</button>
                        <button type="button" class="btn btn-primary" id="menuAuthSubmit">Masuk</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        document.getElementById('menuAuthSubmit').addEventListener('click', handleMenuAuthSubmit);
        document.getElementById('menuAuthCancelBtn').addEventListener('click', redirectToDashboard);
        
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', redirectToDashboard);
        }
        
        setupPasswordToggle('menuAuthPassword', 'menuAuthPasswordToggle');
        
        document.getElementById('menuAuthPassword').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMenuAuthSubmit();
            }
        });
    } else {
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            modalElement.removeEventListener('hidden.bs.modal', redirectToDashboard);
            modalElement.addEventListener('hidden.bs.modal', redirectToDashboard);
        }
    }
}

/**
 * REDIRECT KE DASHBOARD
 * Mengarahkan pengguna ke menu dashboard
 */
function redirectToDashboard() {
    const dashboardTab = document.getElementById('v-pills-dashboard-tab');
    if (dashboardTab) {
        dashboardTab.click();
    }
}

/**
 * MENAMPILKAN MODAL AUTHENTIKASI MENU
 * @param {string} menuType - Jenis menu ('input' atau 'data')
 * @param {string} menuName - Nama menu untuk ditampilkan
 */
function showMenuAuth(menuType, menuName) {
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        document.getElementById('v-pills-input-tab').click();
        return;
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        document.getElementById('v-pills-data-tab').click();
        return;
    }
    
    document.getElementById('menuAuthModal').setAttribute('data-menu-type', menuType);
    document.getElementById('menuAuthModal').setAttribute('data-menu-name', menuName);
    
    document.getElementById('menuAuthModalLabel').textContent = `Autentikasi Menu ${menuName}`;
    document.getElementById('menuAuthPassword').value = '';
    document.getElementById('menuAuthPassword').type = 'password';
    
    const toggleIcon = document.querySelector('#menuAuthPasswordToggle i');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
    
    menuAuthModal.show();
    
    setTimeout(() => {
        document.getElementById('menuAuthPassword').focus();
    }, 500);
}

/**
 * HANDLE SUBMIT AUTHENTIKASI MENU
 * Memproses autentikasi password menu
 */
function handleMenuAuthSubmit() {
    const password = document.getElementById('menuAuthPassword').value;
    const menuType = document.getElementById('menuAuthModal').getAttribute('data-menu-type');
    const menuName = document.getElementById('menuAuthModal').getAttribute('data-menu-name');
    
    let correctPassword = '';
    if (menuType === 'input') {
        correctPassword = appSettings.passwordInputData;
    } else if (menuType === 'data') {
        correctPassword = appSettings.passwordDataNelayan;
    }
    
    if (password === correctPassword) {
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        sessionStorage.setItem(`menu_auth_${menuType}`, 'true');
        
        menuAuthModal.hide();
        showNotification(`Autentikasi berhasil! Mengakses menu ${menuName}`, 'success');
        
        if (menuType === 'input') {
            document.getElementById('v-pills-input-tab').click();
        } else if (menuType === 'data') {
            document.getElementById('v-pills-data-tab').click();
        }
    } else {
        showNotification('Password salah! Silakan coba lagi.', 'error');
        document.getElementById('menuAuthPassword').value = '';
        document.getElementById('menuAuthPassword').focus();
    }
}

/**
 * CEK STATUS AUTHENTIKASI MENU
 * @param {string} menuType - Jenis menu ('input' atau 'data')
 * @returns {boolean} Status autentikasi
 */
function checkMenuAuth(menuType) {
    const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
    if (!isSessionActive) {
        return false;
    }
    
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        return true;
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        return true;
    }
    
    if (menuType === 'input' && menuAuthStatus.inputData) {
        return true;
    }
    if (menuType === 'data' && menuAuthStatus.dataNelayan) {
        return true;
    }
    
    const sessionAuth = sessionStorage.getItem(`menu_auth_${menuType}`);
    if (sessionAuth === 'true') {
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        return true;
    }
    
    return false;
}

/**
 * SETUP EVENT LISTENER UNTUK AUTHENTIKASI MENU
 */
function setupMenuAuthListeners() {
    const inputDataTab = document.getElementById('v-pills-input-tab');
    if (inputDataTab) {
        inputDataTab.addEventListener('click', function(e) {
            if (!checkMenuAuth('input')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('input', 'Input Data');
            }
        });
    }
    
    const dataNelayanTab = document.getElementById('v-pills-data-tab');
    if (dataNelayanTab) {
        dataNelayanTab.addEventListener('click', function(e) {
            if (!checkMenuAuth('data')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('data', 'Data Nelayan');
            }
        });
    }
}

/**
 * RESET STATUS AUTHENTIKASI MENU
 */
function resetMenuAuth() {
    menuAuthStatus.inputData = false;
    menuAuthStatus.dataNelayan = false;
    
    sessionStorage.removeItem('menu_auth_input');
    sessionStorage.removeItem('menu_auth_data');
}

// =====================================================
// BAGIAN 6: FUNGSI TOGGLE KEAMANAN MENU ON/OFF
// =====================================================

/**
 * INISIALISASI TOGGLE KEAMANAN MENU
 * Setup toggle untuk mengaktifkan/nonaktifkan kode keamanan menu
 */
function initMenuSecurityToggles() {
    const toggleInputData = document.getElementById('toggleSecurityMenuInputData');
    if (toggleInputData) {
        toggleInputData.checked = appSettings.securityMenuInputDataEnabled;
        updateMenuSecurityToggleUI('input', appSettings.securityMenuInputDataEnabled);
    }
    
    const toggleDataNelayan = document.getElementById('toggleSecurityMenuDataNelayan');
    if (toggleDataNelayan) {
        toggleDataNelayan.checked = appSettings.securityMenuDataNelayanEnabled;
        updateMenuSecurityToggleUI('data', appSettings.securityMenuDataNelayanEnabled);
    }
    
    setupMenuSecurityToggleListeners();
}

/**
 * UPDATE UI TOGGLE KEAMANAN MENU
 * @param {string} menuType - Jenis menu ('input' atau 'data')
 * @param {boolean} isEnabled - Status toggle
 */
function updateMenuSecurityToggleUI(menuType, isEnabled) {
    const toggleElement = document.getElementById(`toggleSecurityMenu${menuType === 'input' ? 'InputData' : 'DataNelayan'}`);
    const statusElement = document.getElementById(`securityMenu${menuType === 'input' ? 'InputData' : 'DataNelayan'}Status`);
    
    if (!toggleElement || !statusElement) return;
    
    if (isEnabled) {
        statusElement.innerHTML = `<span class="text-success fw-bold">ON (Aktif)</span>`;
        statusElement.className = "mt-2 small fw-bold text-success";
        toggleElement.checked = true;
    } else {
        statusElement.innerHTML = `<span class="text-danger fw-bold">OFF (Non-Aktif)</span>`;
        statusElement.className = "mt-2 small fw-bold text-danger";
        toggleElement.checked = false;
    }
}

/**
 * SETUP EVENT LISTENERS UNTUK TOGGLE KEAMANAN MENU
 */
function setupMenuSecurityToggleListeners() {
    const toggleInputData = document.getElementById('toggleSecurityMenuInputData');
    if (toggleInputData) {
        toggleInputData.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStatus = appSettings.securityMenuInputDataEnabled;
            
            if (currentStatus === true) {
                const code = prompt("MASUKKAN KODE KEAMANAN SENSOR untuk menonaktifkan kode keamanan menu Input Data:");
                if (code === appSettings.securityCodeSensor) {
                    appSettings.securityMenuInputDataEnabled = false;
                    saveSettings();
                    updateMenuSecurityToggleUI('input', false);
                    showNotification('Kode keamanan menu Input Data dinonaktifkan.', 'warning');
                } else { 
                    alert("Kode Keamanan Sensor Salah!"); 
                    this.checked = true;
                }
            } else {
                appSettings.securityMenuInputDataEnabled = true;
                saveSettings();
                updateMenuSecurityToggleUI('input', true);
                showNotification('Kode keamanan menu Input Data diaktifkan.', 'success');
            }
        });
    }
    
    const toggleDataNelayan = document.getElementById('toggleSecurityMenuDataNelayan');
    if (toggleDataNelayan) {
        toggleDataNelayan.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStatus = appSettings.securityMenuDataNelayanEnabled;
            
            if (currentStatus === true) {
                const code = prompt("MASUKKAN KODE KEAMANAN SENSOR untuk menonaktifkan kode keamanan menu Data Nelayan:");
                if (code === appSettings.securityCodeSensor) {
                    appSettings.securityMenuDataNelayanEnabled = false;
                    saveSettings();
                    updateMenuSecurityToggleUI('data', false);
                    showNotification('Kode keamanan menu Data Nelayan dinonaktifkan.', 'warning');
                } else { 
                    alert("Kode Keamanan Sensor Salah!"); 
                    this.checked = true;
                }
            } else {
                appSettings.securityMenuDataNelayanEnabled = true;
                saveSettings();
                updateMenuSecurityToggleUI('data', true);
                showNotification('Kode keamanan menu Data Nelayan diaktifkan.', 'success');
            }
        });
    }
}

// =====================================================
// BAGIAN 7: FUNGSI UTILITAS UTAMA
// =====================================================

/**
 * MENDAPATKAN LABEL PROFESI
 * @param {string} profesi - Kode profesi
 * @returns {string} Label profesi lengkap
 */
function getProfesiLabel(profesi) {
    return PROFESI_MAPPING[profesi] || profesi;
}

/**
 * MIGRASI DATA LAMA
 * Update struktur data lama ke format baru
 */
function migrateOldData() {
    appData.forEach(item => {
        if (PROFESI_MAPPING[item.profesi]) {
            item.profesi = PROFESI_MAPPING[item.profesi];
        }
        if (!item.hasOwnProperty('alamat')) {
            item.alamat = '';
        }
    });
    saveData();
}

/**
 * GENERATE KODE KEAMANAN HARIAN
 * @returns {string} Kode keamanan berdasarkan tanggal
 */
function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * MENAMPILKAN TANGGAL SEKARANG
 */
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    document.getElementById('passwordHint').innerHTML = `Masukkan kode keamanan untuk mengakses sistem`;
}

/**
 * MASK DATA SENSITIF
 * @param {string} data - Data yang akan dimask
 * @param {boolean} force - Paksa masking meski privacy mode off
 * @returns {string} Data yang sudah dimask
 */
function maskData(data, force = false) {
    if (!data) return "-";
    if (data === '00000000') return "Tidak Ada";
    if (!appSettings.privacyMode && !force) return data.toString();
    
    let str = data.toString();
    if (str.length <= 4) return str;
    
    const maskedLength = Math.min(4, str.length);
    const visiblePart = str.slice(0, -maskedLength);
    const maskedPart = '*'.repeat(maskedLength);
    return visiblePart + maskedPart;
}

/**
 * MENDAPATKAN ICON CLASS UNTUK IKAN
 * @param {string} fishName - Nama ikan
 * @returns {string} Class FontAwesome untuk ikan
 */
function getFishIconClass(fishName) {
    const lower = fishName.toLowerCase();
    if (lower.includes('cumi')) return 'fa-ghost'; 
    if (lower.includes('kepiting')) return 'fa-spider'; 
    if (lower.includes('togek') || lower.includes('mendut')) return 'fa-star'; 
    return 'fa-fish';
}

// =====================================================
// BAGIAN 8: FUNGSI DATA WILAYAH
// =====================================================

/**
 * INISIALISASI DATA WILAYAH
 * Setup data desa dan kecamatan
 */
function initDataWilayah() {
    initDesaCards();
    initKecamatanCards();
    
    document.getElementById('totalDesaCount').textContent = DESA_LIST.length;
    document.getElementById('totalKecamatanCount').textContent = KECAMATAN_LIST.length;
    
    updateWilayahStatusIndicator();
}

/**
 * INISIALISASI KARTU DESA
 * Membuat kartu untuk setiap desa
 */
function initDesaCards() {
    const desaContainer = document.getElementById('wilayahDesaCardsContainer');
    if (!desaContainer) return;
    
    desaContainer.innerHTML = '';
    const sortedDesa = [...DESA_LIST].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedDesa.forEach(desa => {
        const card = document.createElement('div');
        card.className = 'wilayah-card';
        
        if (currentWilayah.mode === 'desa' && currentWilayah.desaName === desa.name) {
            card.classList.add('active');
        }
        
        card.innerHTML = `
            <div class="wilayah-card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-map-marker-alt me-2"></i>
                        <strong>${desa.name}</strong>
                    </div>
                    ${currentWilayah.mode === 'desa' && currentWilayah.desaName === desa.name ? 
                        '<span class="badge bg-success">Aktif</span>' : ''}
                </div>
            </div>
            <div class="wilayah-card-body">
                <div class="wilayah-info-badge">
                    <i class="fas fa-database me-1"></i> Data Tersedia
                </div>
                
                <div class="wilayah-actions">
                    <button class="btn wilayah-btn wilayah-btn-load" onclick="loadDataByDesa('${desa.name}', '${desa.file}')">
                        <i class="fas fa-database"></i>
                        <span>Muat Data</span>
                    </button>
                    <button class="btn wilayah-btn wilayah-btn-input" onclick="setupInputForDesa('${desa.name}')">
                        <i class="fas fa-plus"></i>
                        <span>Input Data</span>
                    </button>
                </div>
            </div>
        `;
        
        desaContainer.appendChild(card);
    });
}

/**
 * INISIALISASI KARTU KECAMATAN
 * Membuat kartu untuk setiap kecamatan
 */
function initKecamatanCards() {
    const kecamatanContainer = document.getElementById('wilayahKecamatanCardsContainer');
    if (!kecamatanContainer) return;
    
    kecamatanContainer.innerHTML = '';
    const sortedKecamatan = [...KECAMATAN_LIST].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedKecamatan.forEach(kecamatan => {
        const card = document.createElement('div');
        card.className = 'wilayah-card kecamatan-card';
        
        if (currentWilayah.mode === 'kecamatan' && currentWilayah.kecamatanName === kecamatan.name) {
            card.classList.add('active');
        }
        
        const desaCount = SITUBONDO_DATA[kecamatan.name] ? SITUBONDO_DATA[kecamatan.name].length : 0;
        
        card.innerHTML = `
            <div class="wilayah-card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-map me-2"></i>
                        <strong>KEC. ${kecamatan.name.toUpperCase()}</strong>
                    </div>
                    ${currentWilayah.mode === 'kecamatan' && currentWilayah.kecamatanName === kecamatan.name ? 
                        '<span class="badge bg-success">Aktif</span>' : ''}
                </div>
            </div>
            <div class="wilayah-card-body">
                <div class="wilayah-info-badge">
                    <i class="fas fa-database me-1"></i> ${desaCount} Desa
                </div>
                
                <div class="wilayah-actions">
                    <button class="btn wilayah-btn wilayah-btn-load" onclick="loadDataByKecamatan('${kecamatan.name}', '${kecamatan.file}')">
                        <i class="fas fa-database"></i>
                        <span>Muat Data</span>
                    </button>
                    <button class="btn wilayah-btn wilayah-btn-input" onclick="setupInputForKecamatan('${kecamatan.name}')">
                        <i class="fas fa-plus"></i>
                        <span>Input Data</span>
                    </button>
                </div>
            </div>
        `;
        
        kecamatanContainer.appendChild(card);
    });
}

/**
 * MENDAPATKAN KECAMATAN DARI NAMA DESA
 * @param {string} desaName - Nama desa
 * @returns {string|null} Nama kecamatan atau null
 */
function getKecamatanByDesa(desaName) {
    for (const kec in SITUBONDO_DATA) {
        if (SITUBONDO_DATA[kec].includes(desaName)) {
            return kec;
        }
    }
    return null;
}

/**
 * SETUP INPUT DATA UNTUK DESA TERTENTU
 * @param {string} desaName - Nama desa
 */
function setupInputForDesa(desaName) {
    modalDataWilayah.hide();
    
    const kecamatan = getKecamatanByDesa(desaName);
    
    currentWilayah.mode = 'desa';
    currentWilayah.desaName = desaName;
    currentWilayah.kecamatanName = null;
    currentWilayah.fileName = DESA_LIST.find(d => d.name === desaName)?.file || `${desaName.toLowerCase()}.js`;
    
    updateWilayahUI();
    updateWilayahStatusIndicator();
    
    if (checkMenuAuth('input')) {
        document.getElementById('v-pills-input-tab').click();
    } else {
        showMenuAuth('input', 'Input Data');
    }
    
    if (kecamatan) {
        const kecSelect = document.getElementById('kecamatan');
        if (kecSelect) {
            kecSelect.value = kecamatan;
            kecSelect.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                const desaSelect = document.getElementById('desa');
                if (desaSelect) {
                    desaSelect.value = desaName;
                }
                
                document.getElementById('nama').focus();
                
                showNotification(`Mode input data untuk Desa ${desaName} telah diaktifkan. Data yang diinput akan otomatis tersimpan untuk desa ini.`, 'success');
            }, 500);
        }
    } else {
        showNotification(`Desa ${desaName} tidak ditemukan dalam data kecamatan.`, 'warning');
    }
}

/**
 * SETUP INPUT DATA UNTUK KECAMATAN TERTENTU
 * @param {string} kecamatanName - Nama kecamatan
 */
function setupInputForKecamatan(kecamatanName) {
    modalDataWilayah.hide();
    
    currentWilayah.mode = 'kecamatan';
    currentWilayah.kecamatanName = kecamatanName;
    currentWilayah.desaName = null;
    currentWilayah.fileName = KECAMATAN_LIST.find(k => k.name === kecamatanName)?.file || `Kecamatan-${kecamatanName}.js`;
    
    updateWilayahUI();
    updateWilayahStatusIndicator();
    
    if (checkMenuAuth('input')) {
        document.getElementById('v-pills-input-tab').click();
    } else {
        showMenuAuth('input', 'Input Data');
    }
    
    const kecSelect = document.getElementById('kecamatan');
    if (kecSelect) {
        kecSelect.value = kecamatanName;
        kecSelect.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            document.getElementById('nama').focus();
            showNotification(`Mode input data untuk Kecamatan ${kecamatanName} telah diaktifkan. Data yang diinput akan otomatis tersimpan untuk kecamatan ini.`, 'success');
        }, 500);
    }
}

/**
 * MEMUAT DATA BERDASARKAN DESA
 * @param {string} desaName - Nama desa
 * @param {string} fileName - Nama file data
 */
function loadDataByDesa(desaName, fileName) {
    if (confirm(`Anda akan memuat data dari Desa ${desaName}. Data saat ini akan digantikan. Lanjutkan?`)) {
        showLoading("Memuat Data Desa", `Sedang memproses data dari Desa ${desaName}. Mohon tunggu...`);
        
        currentWilayah.mode = 'desa';
        currentWilayah.desaName = desaName;
        currentWilayah.kecamatanName = null;
        currentWilayah.fileName = fileName;
        
        updateWilayahUI();
        updateWilayahStatusIndicator();
        
        const script = document.createElement('script');
        script.src = fileName + '?t=' + new Date().getTime();
        
        script.onload = function() {
            setTimeout(() => {
                if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                    try {
                        appData = window.SIMATA_BACKUP_DATA;
                        saveData();
                        renderDataTable();
                        updateDashboard();
                        
                        hideLoading();
                        showNotification(`Data dari Desa ${desaName} berhasil dimuat (${appData.length} data)`, 'success');
                        modalDataWilayah.hide();
                        
                        updateFilterDesaOptions();
                        
                    } catch (error) {
                        console.error('Error memuat data desa:', error);
                        hideLoading();
                        showNotification('Gagal memuat data dari desa. Format data tidak valid.', 'error');
                    }
                } else {
                    hideLoading();
                    showNotification(`Tidak ada data yang ditemukan di file ${fileName}`, 'warning');
                }
            }, 500);
        };
        
        script.onerror = function() {
            console.error(`Gagal memuat file ${fileName}`);
            hideLoading();
            showNotification(`Maaf, Desa ${desaName} Masih Belum Ada Data Di SIMPADAN TANGKAP`, 'error');
        };
        
        document.head.appendChild(script);
    }
}

/**
 * MEMUAT DATA BERDASARKAN KECAMATAN
 * @param {string} kecamatanName - Nama kecamatan
 * @param {string} fileName - Nama file data
 */
function loadDataByKecamatan(kecamatanName, fileName) {
    if (confirm(`Anda akan memuat data dari Kecamatan ${kecamatanName}. Data saat ini akan digantikan. Lanjutkan?`)) {
        showLoading("Memuat Data Kecamatan", `Sedang memproses data dari Kecamatan ${kecamatanName}. Mohon tunggu...`);
        
        currentWilayah.mode = 'kecamatan';
        currentWilayah.kecamatanName = kecamatanName;
        currentWilayah.desaName = null;
        currentWilayah.fileName = fileName;
        
        updateWilayahUI();
        updateWilayahStatusIndicator();
        
        const script = document.createElement('script');
        script.src = fileName + '?t=' + new Date().getTime();
        
        script.onload = function() {
            setTimeout(() => {
                if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                    try {
                        appData = window.SIMATA_BACKUP_DATA;
                        saveData();
                        renderDataTable();
                        updateDashboard();
                        
                        hideLoading();
                        showNotification(`Data dari Kecamatan ${kecamatanName} berhasil dimuat (${appData.length} data)`, 'success');
                        modalDataWilayah.hide();
                        
                        updateFilterDesaOptions();
                        
                    } catch (error) {
                        console.error('Error memuat data kecamatan:', error);
                        hideLoading();
                        showNotification('Gagal memuat data dari kecamatan. Format data tidak valid.', 'error');
                    }
                } else {
                    hideLoading();
                    showNotification(`Data Nelayan Tidak Tersedia di Kecamatan ${kecamatanName}`, 'warning');
                }
            }, 500);
        };
        
        script.onerror = function() {
            console.error(`Gagal memuat file ${fileName}`);
            hideLoading();
            showNotification(`Maaf, Data Tidak Ditemukan Di SIMPADAN TANGKAP untuk Kecamatan ${kecamatanName}`, 'error');
        };
        
        document.head.appendChild(script);
    }
}

/**
 * SET INPUT MODE GLOBAL
 * Mengaktifkan mode input global
 */
function setInputGlobalMode() {
    if (confirm('Anda akan beralih ke mode Input Global. Data saat ini akan tetap tersimpan. Lanjutkan?')) {
        currentWilayah.mode = 'global';
        currentWilayah.desaName = null;
        currentWilayah.kecamatanName = null;
        currentWilayah.fileName = 'reload.js';
        
        handleReloadRepo();
        updateWilayahUI();
        updateWilayahStatusIndicator();
        showNotification('Mode Input Global diaktifkan. Data dari reload.js akan dimuat.', 'info');
    }
}

/**
 * UPDATE UI WILAYAH
 * Update tampilan status wilayah
 */
function updateWilayahUI() {
    const badge = document.getElementById('currentWilayahBadge');
    const info = document.getElementById('wilayahInfo');
    const inputModeBadge = document.getElementById('inputModeBadge');
    const desaWarning = document.getElementById('desaWarning');
    const submitFormBtn = document.getElementById('submitFormBtn');
    
    if (currentWilayah.mode === 'desa') {
        if (badge) {
            badge.innerHTML = `Wilayah: Desa ${currentWilayah.desaName}`;
            badge.className = 'badge bg-info';
        }
        if (info) info.textContent = `Mode Desa: Data dari ${currentWilayah.fileName}. Input data hanya untuk desa ${currentWilayah.desaName}.`;
        if (inputModeBadge) {
            inputModeBadge.textContent = `Mode: Desa ${currentWilayah.desaName}`;
            inputModeBadge.className = 'badge bg-info float-end';
        }
        if (desaWarning) desaWarning.classList.remove('d-none');
        if (submitFormBtn) submitFormBtn.disabled = false;
    } else if (currentWilayah.mode === 'kecamatan') {
        if (badge) {
            badge.innerHTML = `Wilayah: Kecamatan ${currentWilayah.kecamatanName}`;
            badge.className = 'badge bg-success';
        }
        if (info) info.textContent = `Mode Kecamatan: Data dari ${currentWilayah.fileName}. Input data untuk kecamatan ${currentWilayah.kecamatanName}.`;
        if (inputModeBadge) {
            inputModeBadge.textContent = `Mode: Kecamatan ${currentWilayah.kecamatanName}`;
            inputModeBadge.className = 'badge bg-success float-end';
        }
        if (desaWarning) desaWarning.classList.add('d-none');
        if (submitFormBtn) submitFormBtn.disabled = false;
    } else {
        if (badge) {
            badge.innerHTML = 'Wilayah: Global (reload.js)';
            badge.className = 'badge bg-primary';
        }
        if (info) info.textContent = 'Mode Global: Data dari reload.js. Input data bebas tanpa batasan desa.';
        if (inputModeBadge) {
            inputModeBadge.textContent = 'Mode: Global';
            inputModeBadge.className = 'badge bg-warning float-end';
        }
        if (desaWarning) desaWarning.classList.add('d-none');
        if (submitFormBtn) submitFormBtn.disabled = false;
    }
}

/**
 * UPDATE STATUS INDIKATOR WILAYAH
 * Update indikator status wilayah di modal
 */
function updateWilayahStatusIndicator() {
    const indicator = document.getElementById('wilayahStatusIndicator');
    if (!indicator) return;
    
    if (currentWilayah.mode === 'desa') {
        indicator.className = 'wilayah-status-indicator wilayah-status-desa';
        indicator.innerHTML = `<i class="fas fa-village"></i><span>Mode Desa: ${currentWilayah.desaName || '-'}</span>`;
    } else if (currentWilayah.mode === 'kecamatan') {
        indicator.className = 'wilayah-status-indicator wilayah-status-kecamatan';
        indicator.innerHTML = `<i class="fas fa-map"></i><span>Mode Kecamatan: ${currentWilayah.kecamatanName || '-'}</span>`;
    } else {
        indicator.className = 'wilayah-status-indicator wilayah-status-global';
        indicator.innerHTML = `<i class="fas fa-globe"></i><span>Mode Global</span>`;
    }
}

// =====================================================
// BAGIAN 9: FUNGSI BACKUP DAN RESTORE DATA
// =====================================================

/**
 * BACKUP DATA
 * Membuat backup data ke file JavaScript
 */
function backupData() {
    try {
        showLoading("Membuat Backup", "Sedang menyimpan data ke file backup. Mohon tunggu...");
        
        setTimeout(() => {
            let dataToBackup = appData;
            let backupFileName = 'reload.js';
            let backupContent = '';
            
            if (currentWilayah.mode === 'desa' && currentWilayah.desaName) {
                backupFileName = currentWilayah.fileName;
                dataToBackup = appData.filter(d => d.desa === currentWilayah.desaName);
                
                backupContent = `// DATA NELAYAN DESA ${currentWilayah.desaName.toUpperCase()}
// File: ${backupFileName}
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            } else if (currentWilayah.mode === 'kecamatan' && currentWilayah.kecamatanName) {
                backupFileName = currentWilayah.fileName;
                dataToBackup = appData.filter(d => d.kecamatan === currentWilayah.kecamatanName);
                
                backupContent = `// DATA NELAYAN KECAMATAN ${currentWilayah.kecamatanName.toUpperCase()}
// File: ${backupFileName}
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            } else {
                backupContent = `// DATA NELAYAN GLOBAL - SISTEM PEMETAAN NELAYAN
// File: reload.js
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            }
            
            const blob = new Blob([backupContent], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = backupFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            hideLoading();
            showNotification(`Backup berhasil: ${backupFileName} (${dataToBackup.length} data)`, 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Backup error:', error);
        hideLoading();
        showNotification('Gagal membuat backup. Silakan coba lagi.', 'error');
    }
}

/**
 * RESTORE DATA
 * Memulihkan data dari file backup
 */
function restoreData() {
    const fileInput = document.getElementById('restoreFileInput');
    if (!fileInput.files.length) return;
    
    showLoading("Restore Data", "Sedang memproses restore data. Mohon tunggu, proses ini mungkin memerlukan waktu beberapa saat...");
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let restoredData = [];
            
            try {
                restoredData = JSON.parse(content);
            } catch (jsonError) {
                if (content.includes('SIMATA_BACKUP_DATA')) {
                    const match = content.match(/window\.SIMATA_BACKUP_DATA\s*=\s*(\[.*?\]);/s);
                    if (match) {
                        restoredData = JSON.parse(match[1]);
                    } else {
                        throw new Error('Format data tidak dikenali');
                    }
                } else {
                    throw new Error('File tidak berisi data SIMATA yang valid');
                }
            }
            
            if (!Array.isArray(restoredData)) {
                throw new Error('Data harus berupa array');
            }
            
            if (restoredData.length === 0) {
                hideLoading();
                showNotification('File tidak berisi data', 'warning');
                return;
            }
            
            const duplicateCheck = validateDataDuplicates(restoredData);
            if (duplicateCheck.hasDuplicates) {
                const confirmed = confirm(
                    `Ditemukan ${duplicateCheck.duplicateCount} data duplikat dalam file restore.\n` +
                    `Duplikat berdasarkan NIK dan nama yang sama akan ditolak.\n` +
                    `Lanjutkan restore dengan melewatkan data duplikat?`
                );
                
                if (!confirmed) {
                    hideLoading();
                    showNotification('Restore dibatalkan oleh pengguna', 'warning');
                    return;
                }
                
                const uniqueData = filterDuplicateData(restoredData);
                restoredData = uniqueData.filteredData;
                
                showNotification(
                    `${duplicateCheck.duplicateCount} data duplikat telah difilter. ` +
                    `Akan di-restore ${restoredData.length} data unik.`, 
                    'warning'
                );
            }
            
            const existingData = appData;
            const mergedData = mergeDataWithDuplicateCheck(existingData, restoredData);
            
            const newCount = restoredData.length;
            const existingCount = existingData.length;
            const mergedCount = mergedData.length;
            const replacedCount = existingCount + newCount - mergedCount;
            const addedCount = mergedCount - existingCount;
            
            appData = mergedData;
            saveData();
            renderDataTable();
            updateDashboard();
            updateFilterDesaOptions();
            
            let message = '';
            if (replacedCount > 0 && addedCount > 0) {
                message = `Restore berhasil: ${replacedCount} data diperbarui, ${addedCount} data baru ditambahkan`;
            } else if (replacedCount > 0) {
                message = `Restore berhasil: ${replacedCount} data diperbarui`;
            } else if (addedCount > 0) {
                message = `Restore berhasil: ${addedCount} data baru ditambahkan`;
            } else {
                message = 'Tidak ada data baru untuk di-restore';
            }
            
            hideLoading();
            showNotification(message, 'success');
            fileInput.value = '';
            document.getElementById('restoreDataBtn').disabled = true;
            
        } catch (error) {
            console.error('Restore error:', error);
            hideLoading();
            showNotification(`Gagal restore: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        hideLoading();
        showNotification('Gagal membaca file', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * RELOAD DATA DARI SERVER
 * Sinkronisasi data dengan file reload.js
 */
function handleReloadRepo() {
    showLoading("Sinkronisasi Data", "Sedang melakukan sinkronisasi data dari server. Mohon tunggu, proses ini mungkin memerlukan waktu beberapa saat...");
    
    const fileName = currentWilayah.mode === 'desa' ? currentWilayah.fileName : 
                    currentWilayah.mode === 'kecamatan' ? currentWilayah.fileName : 'reload.js';
    
    const script = document.createElement('script');
    script.src = fileName + '?t=' + new Date().getTime();
    
    script.onload = function() {
        setTimeout(() => {
            if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                try {
                    const duplicateCheck = validateDataDuplicates(window.SIMATA_BACKUP_DATA);
                    if (duplicateCheck.hasDuplicates) {
                        console.warn(`File ${fileName} mengandung ${duplicateCheck.duplicateCount} data duplikat`);
                        showNotification(`Peringatan: File mengandung data duplikat. Data duplikat akan difilter.`, 'warning');
                    }
                    
                    const uniqueData = filterDuplicateData(window.SIMATA_BACKUP_DATA);
                    
                    appData = uniqueData.filteredData;
                    saveData();
                    renderDataTable();
                    updateDashboard();
                    updateFilterDesaOptions();
                    
                    hideLoading();
                    showNotification(`Data berhasil disinkronisasi dari ${fileName} (${appData.length} data, ${uniqueData.removedCount} duplikat difilter)`, 'success');
                    
                } catch (error) {
                    console.error('Reload error:', error);
                    hideLoading();
                    showNotification('Gagal memuat data. Format data tidak valid.', 'error');
                }
            } else {
                hideLoading();
                showNotification(`Data Nelayan Tidak Tersedia`, 'warning');
            }
        }, 500);
    };
    
    script.onerror = function() {
        console.error(`Gagal memuat file ${fileName}`);
        hideLoading();
        showNotification(`Maaf, Data Tidak Ditemukan Di SIMPADAN TANGKAP`, 'error');
    };
    
    document.head.appendChild(script);
}

// =====================================================
// BAGIAN 10: FUNGSI VALIDASI DATA GANDA
// =====================================================

/**
 * VALIDASI DATA GANDA
 * @param {Array} dataArray - Array data yang akan divalidasi
 * @returns {Object} Hasil validasi dengan informasi duplikat
 */
function validateDataDuplicates(dataArray) {
    const seen = new Set();
    const duplicates = [];
    
    dataArray.forEach((item, index) => {
        const key = `${item.nik}_${item.nama ? item.nama.toUpperCase().trim() : ''}`;
        
        if (seen.has(key)) {
            duplicates.push({
                index: index,
                nik: item.nik,
                nama: item.nama,
                key: key
            });
        } else {
            seen.add(key);
        }
    });
    
    return {
        hasDuplicates: duplicates.length > 0,
        duplicateCount: duplicates.length,
        duplicates: duplicates
    };
}

/**
 * FILTER DATA GANDA
 * @param {Array} dataArray - Array data yang akan difilter
 * @returns {Object} Data unik dan informasi data yang dihapus
 */
function filterDuplicateData(dataArray) {
    const seen = new Set();
    const filteredData = [];
    const removedDuplicates = [];
    
    dataArray.forEach(item => {
        const key = `${item.nik}_${item.nama ? item.nama.toUpperCase().trim() : ''}`;
        
        if (!seen.has(key)) {
            seen.add(key);
            filteredData.push(item);
        } else {
            removedDuplicates.push({
                nik: item.nik,
                nama: item.nama,
                key: key
            });
        }
    });
    
    return {
        filteredData: filteredData,
        removedCount: removedDuplicates.length,
        removedDuplicates: removedDuplicates
    };
}

/**
 * MERGE DATA DENGAN VALIDASI DUPLIKAT
 * @param {Array} existingData - Data yang sudah ada
 * @param {Array} newData - Data baru yang akan dimerge
 * @returns {Array} Data yang sudah dimerge
 */
function mergeDataWithDuplicateCheck(existingData, newData) {
    const dataMap = new Map();
    
    existingData.forEach(item => {
        const key = `${item.nik}_${item.nama ? item.nama.toUpperCase().trim() : ''}`;
        dataMap.set(key, item);
    });
    
    const skippedData = [];
    newData.forEach(item => {
        const key = `${item.nik}_${item.nama ? item.nama.toUpperCase().trim() : ''}`;
        if (!dataMap.has(key)) {
            dataMap.set(key, item);
        } else {
            skippedData.push({
                nik: item.nik,
                nama: item.nama,
                reason: 'Data dengan NIK dan nama yang sama sudah ada'
            });
        }
    });
    
    if (skippedData.length > 0) {
        console.log('Data yang dilewati saat merge:', skippedData);
    }
    
    return Array.from(dataMap.values());
}

/**
 * MERGE DATA (UNTUK KOMPATIBILITAS)
 * @param {Array} existingData - Data yang sudah ada
 * @param {Array} newData - Data baru yang akan dimerge
 * @returns {Array} Data yang sudah dimerge
 */
function mergeData(existingData, newData) {
    return mergeDataWithDuplicateCheck(existingData, newData);
}

// =====================================================
// BAGIAN 11: FUNGSI VERIFIKASI KIN
// =====================================================

/**
 * VERIFIKASI KODE VALIDASI (KIN) ATAU NIK
 * @param {string} input - Kode validasi atau NIK
 * @returns {Object} Hasil verifikasi
 */
function verifyKIN(input) {
    if (!input || input.trim() === '') {
        return { success: false, message: "Masukkan Kode Validasi (KIN) atau NIK untuk verifikasi" };
    }
    
    const cleanInput = input.trim().toUpperCase();
    
    const byKodeValidasi = appData.find(d => d.kodeValidasi && d.kodeValidasi.toUpperCase() === cleanInput);
    if (byKodeValidasi) {
        return { 
            success: true, 
            data: byKodeValidasi,
            type: 'kin',
            message: "Data ditemukan berdasarkan Kode Validasi (KIN)"
        };
    }
    
    const byNIK = appData.find(d => d.nik === cleanInput);
    if (byNIK) {
        return { 
            success: true, 
            data: byNIK,
            type: 'nik',
            message: "Data ditemukan berdasarkan NIK"
        };
    }
    
    if (cleanInput.startsWith('VLD-')) {
        const withoutPrefix = cleanInput.substring(4);
        const byKodeWithoutPrefix = appData.find(d => d.kodeValidasi && d.kodeValidasi.toUpperCase().endsWith(withoutPrefix));
        if (byKodeWithoutPrefix) {
            return { 
                success: true, 
                data: byKodeWithoutPrefix,
                type: 'kin',
                message: "Data ditemukan berdasarkan Kode Validasi (tanpa prefix VLD-)"
            };
        }
    }
    
    return { 
        success: false, 
        message: "Data tidak ditemukan. Pastikan Kode Validasi (KIN) atau NIK yang dimasukkan benar."
    };
}

/**
 * TAMPILKAN HASIL VERIFIKASI
 * @param {Object} result - Hasil verifikasi dari fungsi verifyKIN
 */
function displayVerifyResult(result) {
    const card = document.getElementById('verifyResultCard');
    const header = document.getElementById('verifyResultHeader');
    const icon = document.getElementById('verifyResultIcon');
    const title = document.getElementById('verifyResultTitle');
    const subtitle = document.getElementById('verifyResultSubtitle');
    const content = document.getElementById('verifyResultContent');
    const detailBtn = document.getElementById('verifyDetailBtn');
    const idCardBtn = document.getElementById('verifyIdCardBtn');
    const allKinCard = document.getElementById('allKinCard');
    
    if (allKinCard) allKinCard.style.display = 'none';
    
    if (result.success) {
        const data = result.data;
        verifyDataResult = data;
        
        card.className = 'card shadow-sm border-0 mb-4 verify-success';
        header.className = 'verify-result-header p-4 bg-success text-white';
        icon.innerHTML = '<i class="fas fa-check-circle fa-3x"></i>';
        title.textContent = 'VERIFIKASI BERHASIL';
        subtitle.textContent = result.message;
        
        content.innerHTML = `
            <div class="col-md-6">
                <div class="verify-result-item">
                    <div class="verify-result-label">Nama Lengkap</div>
                    <div class="verify-result-value fw-bold">${data.nama}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">NIK</div>
                    <div class="verify-result-value font-monospace">${maskData(data.nik)}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Kode Validasi (KIN)</div>
                    <div class="verify-result-value">
                        <span class="kin-badge">${data.kodeValidasi || 'Tidak Ada'}</span>
                    </div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Alamat Lengkap</div>
                    <div class="verify-result-value">${data.alamat || '-'}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Domisili</div>
                    <div class="verify-result-value">${data.desa}, ${data.kecamatan}</div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="verify-result-item">
                    <div class="verify-result-label">Profesi</div>
                    <div class="verify-result-value">
                        <span class="badge ${data.profesi === 'Nelayan Penuh Waktu' ? 'badge-profesi-penuh' : data.profesi === 'Nelayan Sambilan Utama' ? 'badge-profesi-sambilan-utama' : 'badge-profesi-sambilan-tambahan'}">
                            ${data.profesi}
                        </span>
                    </div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Status</div>
                    <div class="verify-result-value">
                        <span class="badge ${data.status === 'Pemilik Kapal' ? 'bg-info' : 'bg-secondary'}">
                            ${data.status}
                        </span>
                    </div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Alat Tangkap (API)</div>
                    <div class="verify-result-value">${data.alatTangkap}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">Tanggal Validasi</div>
                    <div class="verify-result-value">${data.tanggalValidasi} oleh ${data.validator}</div>
                </div>
            </div>
        `;
        
        detailBtn.style.display = 'inline-block';
        detailBtn.onclick = () => {
            viewDetail(data.id);
            detailModal.show();
        };
        
        idCardBtn.style.display = 'inline-block';
        idCardBtn.onclick = () => {
            safeGenerateIDCard(data.id);
        };
        
    } else {
        card.className = 'card shadow-sm border-0 mb-4 verify-error';
        header.className = 'verify-result-header p-4 bg-danger text-white';
        icon.innerHTML = '<i class="fas fa-times-circle fa-3x"></i>';
        title.textContent = 'VERIFIKASI GAGAL';
        subtitle.textContent = result.message;
        
        content.innerHTML = `
            <div class="col-md-12 text-center py-4">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Data Tidak Ditemukan</h5>
                <p class="text-muted">Kode Validasi (KIN) atau NIK yang dimasukkan tidak terdaftar dalam database.</p>
                <div class="alert alert-warning mt-3">
                    <i class="fas fa-lightbulb me-2"></i>
                    <strong>Saran:</strong> Periksa kembali ketikan atau gunakan fitur "Tampilkan Semua KIN" untuk melihat daftar kode validasi yang terdaftar.
                </div>
            </div>
        `;
        
        detailBtn.style.display = 'none';
        idCardBtn.style.display = 'none';
    }
    
    card.style.display = 'block';
    
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * SET CONTOH VERIFIKASI
 * @param {string} type - Jenis contoh ('kin', 'nik', 'all')
 */
function setVerifyExample(type) {
    const input = document.getElementById('verifyInput');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    breadcrumbItems.forEach(item => item.classList.remove('active'));
    
    if (type === 'kin') {
        input.value = 'VLD-';
        input.placeholder = 'Masukkan Kode Validasi (contoh: VLD-ABC123)';
        input.focus();
        breadcrumbItems[0].classList.add('active');
    } else if (type === 'nik') {
        input.value = '';
        input.placeholder = 'Masukkan NIK 16 digit';
        input.focus();
        breadcrumbItems[1].classList.add('active');
    } else if (type === 'all') {
        breadcrumbItems[2].classList.add('active');
        showAllKIN();
    }
}

/**
 * TAMPILKAN SEMUA KODE VALIDASI (KIN)
 */
function showAllKIN() {
    const allKinCard = document.getElementById('allKinCard');
    const tbody = document.getElementById('allKinTableBody');
    const totalKinCount = document.getElementById('totalKinCount');
    const verifyResultCard = document.getElementById('verifyResultCard');
    
    if (verifyResultCard) verifyResultCard.style.display = 'none';
    
    const dataWithKIN = appData.filter(d => d.kodeValidasi && d.kodeValidasi.trim() !== '');
    
    totalKinCount.textContent = dataWithKIN.length;
    
    if (dataWithKIN.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="fas fa-info-circle me-2"></i>
                    Tidak ada data dengan Kode Validasi (KIN) yang terdaftar
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = '';
        dataWithKIN.sort((a, b) => a.kodeValidasi.localeCompare(b.kodeValidasi)).forEach((d, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <span class="kin-badge">${d.kodeValidasi}</span>
                    </td>
                    <td>
                        <div class="fw-bold">${d.nama}</div>
                        <small class="text-muted">${d.usia} Tahun</small>
                    </td>
                    <td class="font-monospace">${maskData(d.nik)}</td>
                    <td>
                        <div class="small">${d.alamat || '-'}</div>
                        <div class="small">${d.desa}</div>
                        <div class="small text-muted">${d.kecamatan}</div>
                    </td>
                    <td>
                        <span class="badge ${d.status === 'Pemilik Kapal' ? 'bg-info' : 'bg-secondary'}">
                            ${d.status}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="verifyKINAndShow('${d.kodeValidasi}')" title="Verifikasi">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-outline-info" onclick="viewDetail('${d.id}')" title="Detail">
                                <i class="fas fa-eye"></i></button>
                            <button class="btn btn-outline-success" onclick="safeGenerateIDCard('${d.id}')" title="ID Card">
                                <i class="fas fa-id-card"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }
    
    allKinCard.style.display = 'block';
    allKinCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * VERIFIKASI DAN TAMPILKAN HASIL
 * @param {string} input - Kode validasi atau NIK
 */
function verifyKINAndShow(input) {
    const result = verifyKIN(input);
    displayVerifyResult(result);
    
    document.getElementById('verifyInput').value = input;
}

/**
 * RESET FORM VERIFIKASI
 */
function resetVerifyForm() {
    document.getElementById('verifyInput').value = '';
    document.getElementById('verifyInput').focus();
    document.getElementById('verifyResultCard').style.display = 'none';
    document.getElementById('allKinCard').style.display = 'none';
    
    setVerifyExample('kin');
}

// =====================================================
// BAGIAN 12: FUNGSI FORM INPUT
// =====================================================

/**
 * SETUP INPUT OTOMATIS HURUF KAPITAL
 * Konversi input nama dan alamat ke huruf kapital otomatis
 */
function setupAutoUppercaseInputs() {
    const namaInput = document.getElementById('nama');
    if (namaInput) {
        namaInput.addEventListener('input', function() {
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.toUpperCase();
            this.setSelectionRange(start, end);
        });
        
        namaInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                this.value = this.value.toUpperCase();
            }, 10);
        });
    }
    
    const alamatInput = document.getElementById('alamat');
    if (alamatInput) {
        alamatInput.addEventListener('input', function() {
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.toUpperCase();
            this.setSelectionRange(start, end);
        });
        
        alamatInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                this.value = this.value.toUpperCase();
            }, 10);
        });
    }
}

/**
 * UPDATE ALAT TANGKAP BERDASARKAN JENIS KAPAL
 * Filter alat tangkap berdasarkan jenis kapal yang dipilih
 */
function updateAlatTangkapByKapal() {
    const jenisKapal = document.getElementById('jenisKapal').value;
    const alatTangkapSelect = document.getElementById('alatTangkap');
    const apiMappingInfo = document.getElementById('apiMappingInfo');
    
    if (!jenisKapal) {
        apiMappingInfo.style.display = 'none';
        return;
    }
    
    const availableAPIs = KAPAL_API_MAPPING[jenisKapal] || Object.keys(API_INFO);
    const currentAPI = alatTangkapSelect.value;
    
    alatTangkapSelect.innerHTML = '<option value="">Pilih Alat Penangkapan Ikan...</option>';
    availableAPIs.forEach(api => {
        const option = document.createElement('option');
        option.value = api;
        option.textContent = api;
        if (api === currentAPI) option.selected = true;
        alatTangkapSelect.appendChild(option);
    });
    
    apiMappingInfo.innerHTML = `<strong>${jenisKapal}</strong> biasanya digunakan untuk: ${availableAPIs.join(', ')}`;
    apiMappingInfo.style.display = 'block';
    
    if (currentAPI && availableAPIs.includes(currentAPI)) {
        updateFishOptionsByAPI(currentAPI);
    } else {
        updateFishOptionsByAPI('');
    }
}

/**
 * UPDATE PILIHAN IKAN BERDASARKAN ALAT TANGKAP
 * @param {string} api - Alat tangkap yang dipilih
 */
function updateFishOptionsByAPI(api) {
    const fishContainer = document.getElementById('fishCheckboxContainer');
    if (!fishContainer) return;
    
    fishContainer.innerHTML = '';
    
    let fishList = [];
    if (api && API_FISH_MAPPING[api]) {
        API_FISH_MAPPING[api].forEach(category => {
            if (FISH_CATEGORIES[category]) {
                FISH_CATEGORIES[category].forEach(fish => {
                    fishList.push(fish);
                });
            }
        });
    } else {
        for (const category in FISH_CATEGORIES) {
            FISH_CATEGORIES[category].forEach(fish => {
                fishList.push(fish);
            });
        }
    }
    
    fishList.push("Lainnya");
    
    fishList.forEach(fish => {
        const id = 'fish_' + fish.replace(/\s/g, '');
        const fishInfo = FISH_DETAILS[fish] || {};
        const category = fishInfo.category || '';
        
        const infoButton = category && fish !== "Lainnya" ? 
            `<button class="btn btn-sm btn-outline-info fish-info-btn ms-2" onclick="showFishInfo('${category}')" title="Lihat informasi jenis ikan">
                <i class="fas fa-info-circle"></i>
            </button>` : '';
        
        const html = `
        <label class="fish-option-box d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <input type="checkbox" class="form-check-input me-2 fish-checkbox" value="${fish}" id="${id}">
                <span>${fish}</span>
                ${infoButton}
            </div>
            ${fishInfo.latin ? `
            <div class="fish-info-box">
                <div class="fish-info-title">${fish}</div>
                <div class="fish-info-latin">${fishInfo.latin}</div>
                ${category ? `<div class="fish-info-category">Kategori: ${category}</div>` : ''}
            </div>
            ` : ''}
        </label>`;
        fishContainer.innerHTML += html;
    });
    
    const lainCheckbox = document.getElementById('fish_Lainnya');
    if (lainCheckbox) {
        lainCheckbox.addEventListener('change', function() {
            const inputLain = document.getElementById('jenisIkanLainnya');
            if(this.checked) {
                inputLain.style.display = 'block';
                inputLain.setAttribute('required', 'required');
            } else {
                inputLain.style.display = 'none';
                inputLain.value = '';
                inputLain.removeAttribute('required');
            }
        });
    }
}

/**
 * TAMPILKAN INFORMASI JENIS IKAN
 * @param {string} category - Kategori ikan
 */
function showFishInfo(category) {
    let modal = document.getElementById('fishInfoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'fishInfoModal';
        modal.className = 'modal fade';
        modal.tabIndex = '-1';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Informasi Jenis Ikan - Kategori ${category}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${FISH_CATEGORY_IMAGES[category]}" class="img-fluid" alt="Informasi Jenis Ikan ${category}">
                        <div class="mt-3">
                            <p class="text-muted">Kategori: <strong>${category}</strong></p>
                            <p class="small">Gambar referensi jenis-jenis ikan dalam kategori ${category}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const modalImg = modal.querySelector('img');
    if (modalImg) {
        modalImg.src = FISH_CATEGORY_IMAGES[category];
        modalImg.alt = `Informasi Jenis Ikan ${category}`;
    }
    
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Informasi Jenis Ikan - Kategori ${category}`;
    }
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * HANDLE SUBMIT FORM INPUT DATA
 * @param {Event} e - Event submit
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('inputForm');
    if (!form) return;
    
    if (currentWilayah.mode === 'desa') {
        const selectedDesa = document.getElementById('desa').value;
        if (selectedDesa !== currentWilayah.desaName) {
            showNotification(`Anda harus memilih Desa ${currentWilayah.desaName} untuk input data di mode ini!`, 'error');
            return;
        }
    }
    
    if (currentWilayah.mode === 'kecamatan') {
        const selectedKecamatan = document.getElementById('kecamatan').value;
        if (selectedKecamatan !== currentWilayah.kecamatanName) {
            showNotification(`Anda harus memilih Kecamatan ${currentWilayah.kecamatanName} untuk input data di mode ini!`, 'error');
            return;
        }
    }
    
    const kodeVal = document.getElementById('kodeValidasi').value;
    if (!kodeVal || kodeVal.trim() === '') {
        showNotification('Anda WAJIB melakukan GENERATE KODE VALIDASI terlebih dahulu!', 'error');
        const generateBtn = document.getElementById('generateKodeBtn');
        if (generateBtn) generateBtn.focus();
        return;
    }
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.reportValidity(); 
        return;
    }

    const nik = document.getElementById('nik').value;
    const whatsapp = document.getElementById('whatsapp').value;
    if(nik.length !== 16) return showNotification('NIK harus 16 digit', 'error');
    if(!whatsapp.match(/^\d+$/)) return showNotification('WhatsApp hanya angka', 'error');

    let selectedFish = [];
    document.querySelectorAll('.fish-checkbox:checked').forEach(cb => {
        if(cb.value === "Lainnya") {
            const otherVal = document.getElementById('jenisIkanLainnya').value.trim();
            if(otherVal) selectedFish.push(otherVal);
        } else {
            selectedFish.push(cb.value);
        }
    });
    if(selectedFish.length === 0) return showNotification('Pilih minimal satu jenis ikan!', 'error');

    const editId = form.getAttribute('data-edit-id');
    const nama = document.getElementById('nama').value.toUpperCase();
    
    const duplicateCheck = appData.find(d => 
        d.nik === nik && 
        d.nama.toUpperCase() === nama && 
        (!editId || d.id != editId)
    );
    
    if (duplicateCheck) {
        return showNotification(
            `GAGAL: Data dengan NIK ${nik} dan nama ${nama} sudah terdaftar dalam sistem!\n` +
            `Pemilik: ${duplicateCheck.nama} - ${duplicateCheck.desa}, ${duplicateCheck.kecamatan}`, 
            'error'
        );
    }

    const isOwner = document.getElementById('statusNelayan').value === 'Pemilik Kapal';
    
    const formData = {
        id: editId || Date.now(),
        nama: nama,
        nik: nik,
        whatsapp: whatsapp,
        profesi: document.getElementById('profesi').value,
        status: document.getElementById('statusNelayan').value,
        tahunLahir: document.getElementById('tahunLahir').value,
        usia: document.getElementById('usia').value,
        alamat: document.getElementById('alamat').value.toUpperCase(),
        kecamatan: document.getElementById('kecamatan').value,
        desa: document.getElementById('desa').value,
        alatTangkap: document.getElementById('alatTangkap').value,
        namaKapal: isOwner ? document.getElementById('namaKapal').value : '-',
        jenisKapal: isOwner ? document.getElementById('jenisKapal').value : '-',
        jenisIkan: selectedFish.join(", "),
        usahaSampingan: document.getElementById('usahaSampingan').value,
        tanggalValidasi: document.getElementById('tanggalValidasi').value,
        validator: document.getElementById('validator').value,
        driveLink: document.getElementById('driveLink').value,
        kodeValidasi: document.getElementById('kodeValidasi').value,
        keterangan: document.getElementById('keterangan').value
    };

    if (editId) {
        const index = appData.findIndex(item => item.id == editId);
        appData[index] = formData;
        form.removeAttribute('data-edit-id');
        showNotification('Data berhasil diperbarui', 'success');
    } else {
        appData.push(formData);
        showNotification('Data berhasil disimpan', 'success');
    }

    saveData();
    form.reset();
    const ownerFields = document.getElementById('ownerFields');
    const desaSelect = document.getElementById('desa');
    const jenisIkanLainnya = document.getElementById('jenisIkanLainnya');
    const alamatInput = document.getElementById('alamat');
    
    if (ownerFields) ownerFields.style.display = 'none';
    if (alamatInput) alamatInput.value = '';
    if (desaSelect) {
        desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
        desaSelect.disabled = true;
    }
    if (jenisIkanLainnya) {
        jenisIkanLainnya.style.display = 'none';
    }
    
    const today = new Date().toISOString().split('T')[0];
    const tanggalValidasi = document.getElementById('tanggalValidasi');
    if (tanggalValidasi) tanggalValidasi.value = today;
    
    const apiInfo = document.getElementById('apiInfo');
    const kapalInfo = document.getElementById('kapalInfo');
    const profesiHelp = document.getElementById('profesiHelp');
    const apiMappingInfo = document.getElementById('apiMappingInfo');

    if (apiInfo) apiInfo.style.display = 'none';
    if (kapalInfo) kapalInfo.style.display = 'none';
    if (profesiHelp) profesiHelp.innerHTML = '';
    if (apiMappingInfo) apiMappingInfo.style.display = 'none';

    updateDashboard(); 
    renderDataTable();
    updateFilterDesaOptions();
    const dataTab = document.getElementById('v-pills-data-tab');
    if (dataTab) dataTab.click();
    checkGlobalDuplicates();
}

// =====================================================
// BAGIAN 13: FUNGSI TABEL DAN PAGINATION
// =====================================================

/**
 * UPDATE OPTION FILTER DESA
 * Update dropdown filter desa berdasarkan data yang ada
 */
function updateFilterDesaOptions() {
    const filterDesa = document.getElementById('filterDesa');
    if (!filterDesa) return;
    
    const desaSet = new Set();
    appData.forEach(d => {
        if (d.desa && d.desa.trim() !== '') {
            desaSet.add(d.desa);
        }
    });
    
    const desaList = Array.from(desaSet).sort();
    
    filterDesa.innerHTML = '<option value="">Semua Desa</option>';
    desaList.forEach(desa => {
        filterDesa.add(new Option(desa, desa));
    });
}

/**
 * GET FILTERED DATA
 * Mendapatkan data yang sudah difilter
 * @returns {Array} Data yang sudah difilter
 */
function getFilteredData() {
    const search = document.getElementById('searchData').value.toLowerCase();
    
    let filtered = appData;
    
    if (Object.keys(currentFilter).length > 0) {
        filtered = filtered.filter(d => {
            const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
            const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
            const matchStatus = !currentFilter.status || d.status === currentFilter.status;
            
            let matchJenis = true;
            if (currentFilter.jenisKapal) {
                if (d.status === 'Pemilik Kapal') {
                    matchJenis = d.jenisKapal === currentFilter.jenisKapal;
                } else {
                    matchJenis = false;
                }
            }
            
            const matchAlatTangkap = !currentFilter.alatTangkap || d.alatTangkap === currentFilter.alatTangkap;
            const matchUsaha = !currentFilter.usaha || 
                (currentFilter.usaha === 'Ada' ? 
                    (d.usahaSampingan && d.usahaSampingan.trim() !== '' && d.usahaSampingan !== '-') : 
                    (!d.usahaSampingan || d.usahaSampingan.trim() === '' || d.usahaSampingan === '-'));
            
            return matchDesa && matchProfesi && matchStatus && matchJenis && matchAlatTangkap && matchUsaha;
        });
    }
    
    if (search) {
        filtered = filtered.filter(d => 
            d.nama.toLowerCase().includes(search) || 
            d.nik.includes(search) || 
            (d.namaKapal && d.namaKapal.toLowerCase().includes(search)) ||
            d.desa.toLowerCase().includes(search) ||
            d.kecamatan.toLowerCase().includes(search) ||
            (d.alamat && d.alamat.toLowerCase().includes(search))
        );
    }
    
    return filtered;
}

/**
 * RENDER DATA TABLE
 * Menampilkan data dalam tabel dengan pagination
 */
function renderDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    const search = document.getElementById('searchData').value.toLowerCase();
    
    let filtered = appData;
    
    if (Object.keys(currentFilter).length > 0) {
        filtered = filtered.filter(d => {
            const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
            const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
            const matchStatus = !currentFilter.status || d.status === currentFilter.status;
            
            let matchJenis = true;
            if (currentFilter.jenisKapal) {
                if (d.status === 'Pemilik Kapal') {
                    matchJenis = d.jenisKapal === currentFilter.jenisKapal;
                } else {
                    matchJenis = false;
                }
            }
            
            const matchAlatTangkap = !currentFilter.alatTangkap || d.alatTangkap === currentFilter.alatTangkap;
            const matchUsaha = !currentFilter.usaha || 
                (currentFilter.usaha === 'Ada' ? 
                    (d.usahaSampingan && d.usahaSampingan.trim() !== '' && d.usahaSampingan !== '-') : 
                    (!d.usahaSampingan || d.usahaSampingan.trim() === '' || d.usahaSampingan === '-'));
            
            return matchDesa && matchProfesi && matchStatus && matchJenis && matchAlatTangkap && matchUsaha;
        });
    }
    
    if (search) {
        filtered = filtered.filter(d => 
            d.nama.toLowerCase().includes(search) || 
            d.nik.includes(search) || 
            (d.namaKapal && d.namaKapal.toLowerCase().includes(search)) ||
            d.desa.toLowerCase().includes(search) ||
            d.kecamatan.toLowerCase().includes(search) ||
            (d.alamat && d.alamat.toLowerCase().includes(search))
        );
    }
    
    const nikCounts = {};
    appData.forEach(d => nikCounts[d.nik] = (nikCounts[d.nik] || 0) + 1);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / appSettings.itemsPerPage));
    
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalItems === 0) {
        currentPage = 1;
    }
    
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filtered.slice(start, end);

    tableBody.innerHTML = '';
    
    if (totalItems === 0) {
        const row = `<tr>
            <td colspan="8" class="text-center py-5 text-muted">
                <i class="fas fa-database fa-2x mb-3"></i>
                <p>Tidak ada data ditemukan</p>
                ${search || Object.keys(currentFilter).length > 0 ? '<small>Coba dengan kata kunci pencarian atau filter yang berbeda</small>' : ''}
            </td>
        </tr>`;
        tableBody.innerHTML = row;
    } else if (pageData.length === 0) {
        const row = `<tr>
            <td colspan="8" class="text-center py-5 text-muted">
                <i class="fas fa-exclamation-circle fa-2x mb-3"></i>
                <p>Data untuk halaman ini tidak ditemukan</p>
            </td>
        </tr>`;
        tableBody.innerHTML = row;
    } else {
        pageData.forEach((d, i) => {
            const kapalInfo = d.status === 'Pemilik Kapal' ? 
                `<div class="text-truncate-2 small fw-bold text-primary">${d.namaKapal}</div><div class="small text-muted">${d.jenisKapal}</div>` : 
                '-';
            
            const isDuplicate = nikCounts[d.nik] > 1;
            const rowClass = isDuplicate ? 'table-danger' : '';
            
            let badgeClass = 'bg-secondary';
            if(d.profesi === 'Nelayan Penuh Waktu') badgeClass = 'badge-profesi-penuh';
            else if(d.profesi === 'Nelayan Sambilan Utama') badgeClass = 'badge-profesi-sambilan-utama';
            else if(d.profesi === 'Nelayan Sambilan Tambahan') badgeClass = 'badge-profesi-sambilan-tambahan';
            
            const displayNik = maskData(d.nik);
            const displayWaRaw = maskData(d.whatsapp);
            
            let contactDisplay = '';
            if(displayWaRaw === "Tidak Ada") {
                contactDisplay = `<span class="badge bg-light text-muted border">Tidak Ada</span>`;
            } else {
                if (appSettings.privacyMode) {
                    contactDisplay = `<div class="small"><i class="fas fa-phone-alt text-secondary me-1"></i> ${displayWaRaw}</div>`;
                } else {
                    let cleanNum = d.whatsapp;
                    if(cleanNum.startsWith('0')) cleanNum = '62' + cleanNum.substring(1);
                    contactDisplay = `<div class="d-flex align-items-center gap-1"><a href="https://wa.me/${cleanNum}" target="_blank" class="btn btn-sm btn-success py-0 px-1" title="Chat WhatsApp"><i class="fab fa-whatsapp"></i></a><span class="small font-monospace ms-1">${d.whatsapp}</span></div>`;
                }
            }

            const row = `<tr class="${rowClass}">
                <td class="text-center"><input type="checkbox" class="row-checkbox" value="${d.id}" onchange="toggleBulkDeleteBtn()"></td>
                <td class="text-center">${start + i + 1}</td>
                <td onclick="viewDetail('${d.id}')" class="clickable-name col-id-cell">
                    <div class="fw-bold text-dark text-wrap">${d.nama}</div>
                    <div class="small font-monospace text-muted">${displayNik} ${isDuplicate ? '<span class="text-danger fw-bold ms-1">(!)</span>' : ''}</div>
                    <div class="small text-muted text-wrap mt-1"><i class="fas fa-map-marker-alt me-1"></i>${d.kecamatan}, ${d.desa}</div>
                    ${d.alamat ? `<div class="small text-muted text-wrap mt-1"><i class="fas fa-home me-1"></i>${d.alamat.substring(0, 50)}${d.alamat.length > 50 ? '...' : ''}</div>` : ''}
                </td>
                <td class="col-contact-cell">${contactDisplay}</td>
                <td class="col-status-cell"><span class="badge ${badgeClass} border">${d.profesi}</span><br><small class="text-muted">${d.status}</small></td>
                <td class="col-status-cell">${kapalInfo}</td>
                <td style="white-space:nowrap;"><span class="badge bg-info text-white">${d.alatTangkap}</span></td>
                <td class="col-action sticky-col-right">
                    <div class="btn-group shadow-sm" role="group">
                        <button class="btn btn-sm btn-info text-white" onclick="viewDetail('${d.id}')" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-warning text-white" onclick="editData('${d.id}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-sm btn-idcard" onclick="safeGenerateIDCard('${d.id}')" title="Cetak ID Card"><i class="fas fa-id-card"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteData('${d.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }
    
    const startItem = totalItems > 0 ? start + 1 : 0;
    const endItem = Math.min(start + appSettings.itemsPerPage, totalItems);
    document.getElementById('tableInfo').textContent = `Menampilkan ${startItem}-${endItem} dari ${totalItems} data`;
    
    updatePagination(totalItems);
    toggleBulkDeleteBtn();
}

/**
 * UPDATE PAGINATION
 * @param {number} totalItems - Total jumlah data
 */
function updatePagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / appSettings.itemsPerPage));
    const ul = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
    
    ul.innerHTML = '';
    
    if (totalPages <= 1) {
        paginationInfo.textContent = `Halaman 1 dari 1 (Total: ${totalItems} data)`;
        return;
    }
    
    paginationInfo.textContent = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems} data)`;
    
    const first = document.createElement('li');
    first.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    first.innerHTML = `<a class="page-link" href="#" onclick="goToPage(1); return false;" title="Halaman Pertama">&laquo;</a>`;
    ul.appendChild(first);
    
    const prev = document.createElement('li');
    prev.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prev.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage-1}); return false;" title="Halaman Sebelumnya">&lt;</a>`;
    ul.appendChild(prev);
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>`;
        ul.appendChild(li);
    }
    
    const next = document.createElement('li');
    next.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    next.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage+1}); return false;" title="Halaman Berikutnya">&gt;</a>`;
    ul.appendChild(next);
    
    const last = document.createElement('li');
    last.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    last.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${totalPages}); return false;" title="Halaman Terakhir">&raquo;</a>`;
    ul.appendChild(last);
}

/**
 * PERGI KE HALAMAN TERTENTU
 * @param {number} page - Nomor halaman
 */
function goToPage(page) {
    currentPage = page;
    renderDataTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// BAGIAN 14: FUNGSI FILTER DATA
// =====================================================

/**
 * APPLY FILTER
 * Menerapkan filter yang dipilih
 */
function applyFilter() {
    currentFilter = {
        desa: document.getElementById('filterDesa').value,
        profesi: document.getElementById('filterProfesi').value,
        status: document.getElementById('filterStatus').value,
        jenisKapal: document.getElementById('filterJenisKapal').value,
        alatTangkap: document.getElementById('filterAlatTangkap').value,
        usaha: document.getElementById('filterUsaha').value
    };
    
    currentPage = 1;
    renderDataTable();
    
    const filteredCount = appData.filter(d => {
        const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
        const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
        const matchStatus = !currentFilter.status || d.status === currentFilter.status;
        
        let matchJenis = true;
        if (currentFilter.jenisKapal) {
            if (d.status === 'Pemilik Kapal') {
                matchJenis = d.jenisKapal === currentFilter.jenisKapal;
            } else {
                matchJenis = false;
            }
        }
        
        const matchAlatTangkap = !currentFilter.alatTangkap || d.alatTangkap === currentFilter.alatTangkap;
        const matchUsaha = !currentFilter.usaha || 
            (currentFilter.usaha === 'Ada' ? 
                (d.usahaSampingan && d.usahaSampingan.trim() !== '' && d.usahaSampingan !== '-') : 
                (!d.usahaSampingan || d.usahaSampingan.trim() === '' || d.usahaSampingan === '-'));
        
        return matchDesa && matchProfesi && matchStatus && matchJenis && matchAlatTangkap && matchUsaha;
    }).length;
    
    showNotification(`Filter diterapkan: ${filteredCount} data ditemukan`, 'success');
}

/**
 * RESET FILTER
 * Mereset semua filter ke kondisi awal
 */
function resetFilter() {
    document.getElementById('filterDesa').value = '';
    document.getElementById('filterProfesi').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterJenisKapal').value = '';
    document.getElementById('filterAlatTangkap').value = '';
    document.getElementById('filterUsaha').value = '';
    
    currentFilter = {};
    currentPage = 1;
    
    renderDataTable();
    
    showNotification('Filter direset, menampilkan semua data', 'info');
}

/**
 * TAMPILKAN DATA DUPLIKAT
 * Menampilkan data dengan NIK dan nama ganda
 */
function showDuplicateDataInFilter() {
    const duplicateMap = new Map();
    const duplicates = [];
    
    appData.forEach(d => {
        const key = `${d.nik}_${d.nama ? d.nama.toUpperCase().trim() : ''}`;
        if (duplicateMap.has(key)) {
            duplicateMap.get(key).push(d);
        } else {
            duplicateMap.set(key, [d]);
        }
    });
    
    duplicateMap.forEach((items, key) => {
        if (items.length > 1) {
            duplicates.push(...items);
        }
    });
    
    if (duplicates.length === 0) {
        showNotification('Tidak ditemukan data NIK dan nama ganda. Data sudah bersih!', 'success');
        return;
    }
    
    currentFilter = { duplicate: true };
    currentPage = 1;
    
    window.duplicateDataForDisplay = duplicates;
    
    renderDataTable();
    
    showNotification(`Ditemukan ${duplicates.length} data dengan NIK dan nama ganda`, 'warning');
}

// =====================================================
// BAGIAN 15: FUNGSI BULK OPERATIONS
// =====================================================

/**
 * TOGGLE TOMBOL BULK DELETE
 * Menampilkan/menyembunyikan tombol bulk delete berdasarkan checkbox
 */
function toggleBulkDeleteBtn() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length > 0;
    const btn = document.getElementById('bulkDeleteBtn');
    if(btn) {
        if(checked) btn.classList.remove('d-none'); else btn.classList.add('d-none');
    }
}

/**
 * BULK DELETE DATA
 * Menghapus beberapa data sekaligus
 */
function bulkDeleteData() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    if(checkedBoxes.length === 0) return;
    
    showLoading("Menghapus Data", `Sedang menghapus ${checkedBoxes.length} data terpilih. Mohon tunggu...`);
    
    setTimeout(() => {
        const userCode = prompt(`Anda akan menghapus ${checkedBoxes.length} data.\nMasukkan KODE KEAMANAN SENSOR:`);
        if(userCode === appSettings.securityCodeSensor) {
            const idsToDelete = Array.from(checkedBoxes).map(cb => cb.value);
            appData = appData.filter(d => !idsToDelete.includes(d.id.toString()));
            saveData(); 
            currentPage = 1;
            renderDataTable(); 
            updateDashboard();
            updateFilterDesaOptions();
            hideLoading();
            showNotification(`${idsToDelete.length} data berhasil dihapus`, 'success');
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            if (selectAllCheckbox) selectAllCheckbox.checked = false;
            checkGlobalDuplicates();
        } else if (userCode !== null) {
            hideLoading();
            alert("Kode keamanan sensor SALAH!");
        } else {
            hideLoading();
        }
    }, 500);
}

// =====================================================
// BAGIAN 16: FUNGSI CRUD DATA
// =====================================================

/**
 * VIEW DETAIL DATA
 * @param {string|number} id - ID data yang akan dilihat
 */
function viewDetail(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    currentDetailId = id;
    
    const displayNik = maskData(d.nik);
    const displayWa = maskData(d.whatsapp);
    
    document.getElementById('d_nama').innerText = d.nama;
    document.getElementById('d_nik').innerText = displayNik; 
    document.getElementById('d_usia').innerText = `${d.usia} Tahun (${d.tahunLahir})`;
    document.getElementById('d_wa').innerText = displayWa;
    document.getElementById('d_alamat').innerText = d.alamat || '-';
    document.getElementById('d_domisili').innerText = `${d.desa}, ${d.kecamatan}`;
    
    const profBadge = document.getElementById('d_profesi');
    profBadge.innerText = d.profesi;
    
    let badgeClass = 'bg-primary';
    if(d.profesi === 'Nelayan Penuh Waktu') badgeClass = 'badge-profesi-penuh';
    else if(d.profesi === 'Nelayan Sambilan Utama') badgeClass = 'badge-profesi-sambilan-utama';
    else if(d.profesi === 'Nelayan Sambilan Tambahan') badgeClass = 'badge-profesi-sambilan-tambahan';
    profBadge.className = `badge ${badgeClass}`;

    document.getElementById('d_status').innerText = d.status;
    document.getElementById('d_alatTangkap').innerText = d.alatTangkap;
    document.getElementById('d_usaha').innerText = d.usahaSampingan || '-';
    
    const fishContainer = document.getElementById('d_ikan');
    fishContainer.innerHTML = '';
    if(d.jenisIkan) {
        d.jenisIkan.split(', ').forEach(fish => {
            const iconClass = getFishIconClass(fish);
            fishContainer.innerHTML += `<span class="badge bg-light text-dark border me-1 mb-1"><i class="fas ${iconClass} me-1"></i>${fish}</span>`;
        });
    }
    
    const kapalCard = document.getElementById('d_kapal_card');
    if(d.status === 'Pemilik Kapal') {
        if (kapalCard) kapalCard.style.display = 'block';
        document.getElementById('d_namaKapal').innerText = d.namaKapal;
        document.getElementById('d_jenisKapal').innerText = d.jenisKapal;
    } else {
        if (kapalCard) kapalCard.style.display = 'none';
    }
    document.getElementById('d_tgl_valid').innerText = d.tanggalValidasi;
    document.getElementById('d_validator').innerText = d.validator;
    detailModal.show();
}

/**
 * EDIT DATA
 * @param {string|number} id - ID data yang akan diedit
 */
function editData(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    const form = document.getElementById('inputForm');
    if (!form) return;
    
    form.setAttribute('data-edit-id', id);
    
    ['nama', 'nik', 'whatsapp', 'profesi', 'tahunLahir', 'usia', 'alamat', 'alatTangkap', 'usahaSampingan', 'tanggalValidasi', 'validator', 'driveLink', 'kodeValidasi', 'keterangan']
     .forEach(key => {
         const element = document.getElementById(key);
         if (element) element.value = d[key] || '';
     });

    const waInput = document.getElementById('whatsapp');
    const btnWa = document.getElementById('btnNoWA');
    if(d.whatsapp === '00000000') {
        if (waInput) {
            waInput.setAttribute('readonly', true);
            waInput.removeAttribute('required');
        }
        if (btnWa) {
            btnWa.classList.add('active', 'btn-secondary');
            btnWa.textContent = "Batal";
        }
    } else {
        if (waInput) {
            waInput.removeAttribute('readonly');
            waInput.setAttribute('required', 'required');
        }
        if (btnWa) {
            btnWa.classList.remove('active', 'btn-secondary');
            btnWa.textContent = "Tidak Ada";
        }
    }

    const jenisIkanLainnya = document.getElementById('jenisIkanLainnya');
    if (jenisIkanLainnya) {
        jenisIkanLainnya.style.display = 'none';
        jenisIkanLainnya.value = '';
    }
    
    const alatTangkap = document.getElementById('alatTangkap');
    if (alatTangkap) {
        alatTangkap.value = d.alatTangkap;
        updateFishOptionsByAPI(d.alatTangkap);
    }
    
    setTimeout(() => {
        if(d.jenisIkan) {
            const savedFish = d.jenisIkan.split(', ');
            savedFish.forEach(fish => {
                let found = false;
                document.querySelectorAll('.fish-checkbox').forEach(cb => {
                    if(cb.value === fish) { 
                        cb.checked = true; 
                        found = true; 
                    }
                });
                if(!found) {
                    const cbLain = document.getElementById('fish_Lainnya');
                    if (cbLain) {
                        cbLain.checked = true;
                        const inputLain = document.getElementById('jenisIkanLainnya');
                        if (inputLain) {
                            inputLain.style.display = 'block';
                            inputLain.value = fish;
                        }
                    }
                }
            });
        }
    }, 100);

    const kecSelect = document.getElementById('kecamatan');
    if (kecSelect) {
        kecSelect.value = d.kecamatan;
        kecSelect.dispatchEvent(new Event('change'));
    }
    
    const desaSelect = document.getElementById('desa');
    if (desaSelect) desaSelect.value = d.desa;

    const statusSelect = document.getElementById('statusNelayan');
    if (statusSelect) {
        statusSelect.value = d.status;
        statusSelect.dispatchEvent(new Event('change'));
    }

    if(d.status === 'Pemilik Kapal') {
        ['namaKapal', 'jenisKapal'].forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = d[key] || '';
        });
        
        if(d.jenisKapal && KAPAL_INFO[d.jenisKapal]) {
            const kapalInfo = document.getElementById('kapalInfo');
            if (kapalInfo) {
                kapalInfo.style.display = 'block';
                kapalInfo.innerHTML = `<strong>${d.jenisKapal}:</strong> ${KAPAL_INFO[d.jenisKapal]}`;
                updateAlatTangkapByKapal();
            }
        }
    }

    if(d.alatTangkap && API_INFO[d.alatTangkap]) {
        const apiInfo = document.getElementById('apiInfo');
        if (apiInfo) {
            apiInfo.style.display = 'block';
            apiInfo.innerHTML = `<strong>${d.alatTangkap}:</strong> ${API_INFO[d.alatTangkap]}`;
        }
    }

    const inputTab = document.getElementById('v-pills-input-tab');
    if (inputTab) inputTab.click();
    window.scrollTo(0,0);
}

/**
 * DELETE DATA
 * @param {string|number} id - ID data yang akan dihapus
 */
function deleteData(id) {
    showLoading("Menghapus Data", "Sedang memproses penghapusan data. Mohon tunggu...");
    
    setTimeout(() => {
        const userCode = prompt("Masukkan KODE KEAMANAN SENSOR untuk menghapus data:");
        if(userCode === appSettings.securityCodeSensor) {
            if(confirm('Yakin menghapus data ini secara permanen?')) {
                appData = appData.filter(d => d.id != id);
                saveData(); 
                
                const totalItems = appData.length;
                const totalPages = Math.ceil(totalItems / appSettings.itemsPerPage);
                if (currentPage > totalPages && totalPages > 0) {
                    currentPage = totalPages;
                }
                
                renderDataTable(); 
                updateDashboard();
                updateFilterDesaOptions();
                hideLoading();
                showNotification('Data berhasil dihapus', 'success');
                checkGlobalDuplicates();
            } else {
                hideLoading();
            }
        } else if (userCode !== null) {
            hideLoading();
            alert("Kode keamanan sensor SALAH!");
        } else {
            hideLoading();
        }
    }, 500);
}

// =====================================================
// BAGIAN 17: FUNGSI PDF DAN CETAK
// =====================================================

/**
 * GENERATE TABEL PDF
 * Membuat PDF dari tabel data di halaman saat ini
 */
function generateTabelPdf() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }
    
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    const printId = 'SIMPADAN-TANGKAP-TABEL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

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

            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('LAPORAN TABEL DATA NELAYAN', pageWidth/2, 48, { align: 'center' });
            
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
            
            filterInfo += ` | Halaman: ${currentPage}, Jumlah Baris: ${appSettings.itemsPerPage}`;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(filterInfo, pageWidth/2, 54, { align: 'center' });
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('TABEL DATA NELAYAN', pageWidth/2, 60, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, 66, { align: 'center' });

            const tableRows = pageData.map((d, index) => [
                index + 1,
                d.nama,
                d.whatsapp === '00000000' || !d.whatsapp ? '-' : maskData(d.whatsapp),
                maskData(d.nik),
                d.alamat || '-',
                d.desa,
                d.kecamatan
            ]);

            const columnWidths = [15, 55, 30, 35, 65, 35, 32];

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Alamat', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Desa', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Kecamatan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}}
                ]],
                body: tableRows,
                startY: 72,
                theme: 'grid',
                margin: { left: 15, right: 15 },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 8,
                    cellPadding: 2,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 7,
                    fillColor: [255, 255, 255],
                    cellPadding: 2,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 2,
                    fontSize: 7,
                    valign: 'middle',
                    halign: 'left'
                },
                columnStyles: {
                    0: {cellWidth: columnWidths[0], halign: 'center'},
                    1: {cellWidth: columnWidths[1], halign: 'left'},
                    2: {cellWidth: columnWidths[2], halign: 'center'},
                    3: {cellWidth: columnWidths[3], halign: 'center'},
                    4: {cellWidth: columnWidths[4], halign: 'left'},
                    5: {cellWidth: columnWidths[5], halign: 'left'},
                    6: {cellWidth: columnWidths[6], halign: 'left'}
                }
            });

            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

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

            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Data: ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} records | Baris/halaman: ${appSettings.itemsPerPage}`, pageWidth / 2, footerY + 5, { align: 'center' });

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

/**
 * GENERATE FILTERED PDF
 * Membuat PDF dari data yang sudah difilter
 */
function generateFilteredPdf() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }
    
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filteredData.slice(start, end);

    const tableRows = pageData.map((d, index) => [
        index + 1, 
        d.nama,
        d.whatsapp === '00000000' || !d.whatsapp ? '-' : maskData(d.whatsapp),
        maskData(d.nik),
        d.alamat || '-',
        d.desa,
        d.kecamatan
    ]);

    const printId = 'SIMPADAN-TANGKAP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

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

            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('LAPORAN DATA NELAYAN TERFILTER', pageWidth/2, 48, { align: 'center' });
            
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
            
            filterInfo += ` | Halaman: ${currentPage}, Jumlah Baris: ${appSettings.itemsPerPage}`;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(filterInfo, pageWidth/2, 54, { align: 'center' });
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('TABEL DATA NELAYAN', pageWidth/2, 60, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, 66, { align: 'center' });

            const columnWidths = [15, 55, 30, 35, 65, 35, 32];
            
            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Alamat', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Desa', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}},
                    {content: 'Kecamatan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center'}}
                ]],
                body: tableRows,
                startY: 72,
                theme: 'grid',
                margin: { left: 15, right: 15 },
                headStyles: { 
                    fillColor: [12, 36, 97],
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold', 
                    halign: 'center',
                    fontSize: 8,
                    cellPadding: 2,
                    lineWidth: 0.5,
                    lineColor: [255, 255, 255]
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 7,
                    fillColor: [255, 255, 255],
                    cellPadding: 2,
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200]
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                styles: {
                    overflow: 'linebreak',
                    cellPadding: 2,
                    fontSize: 7,
                    valign: 'middle',
                    halign: 'left'
                },
                columnStyles: {
                    0: {cellWidth: columnWidths[0], halign: 'center'},
                    1: {cellWidth: columnWidths[1], halign: 'left'},
                    2: {cellWidth: columnWidths[2], halign: 'center'},
                    3: {cellWidth: columnWidths[3], halign: 'center'},
                    4: {cellWidth: columnWidths[4], halign: 'left'},
                    5: {cellWidth: columnWidths[5], halign: 'left'},
                    6: {cellWidth: columnWidths[6], halign: 'left'}
                }
            });

            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

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

            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Data: ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} records | Baris/halaman: ${appSettings.itemsPerPage}`, pageWidth / 2, footerY + 5, { align: 'center' });

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

/**
 * PRINT DATA REKAPITULASI
 * Membuat PDF rekap data per desa
 */
function printData() {
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }

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

    const totalCount = tableRows.reduce((sum, row) => sum + row[2], 0);
    const totalOwner = tableRows.reduce((sum, row) => sum + row[3], 0);
    const totalAbk = tableRows.reduce((sum, row) => sum + row[4], 0);
    const totalPenuhWaktu = tableRows.reduce((sum, row) => sum + row[5], 0);
    const totalSambilanUtama = tableRows.reduce((sum, row) => sum + row[6], 0);
    const totalSambilanTambahan = tableRows.reduce((sum, row) => sum + row[7], 0);

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

    const printId = 'SIMPADAN-TANGKAP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

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

            doc.setFillColor(12, 36, 97);
            doc.rect(10, 10, pageWidth - 20, 28, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('LAPORAN REKAPITULASI DATA NELAYAN', pageWidth/2, 48, { align: 'center' });
            
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
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(filterInfo, pageWidth/2, 54, { align: 'center' });
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('REKAPITULASI PER DESA / KELURAHAN', pageWidth/2, 60, { align: 'center' });
    
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'});
            doc.text(`Dicetak pada: ${dateString}`, pageWidth/2, 66, { align: 'center' });

            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;

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
                startY: 72,
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
                    if (data.row.index === tableRows.length - 1) {
                        data.cell.styles.fillColor = [255, 235, 59];
                        data.cell.styles.textColor = [0, 0, 0];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.lineWidth = 0.5;
                        data.cell.styles.lineColor = [12, 36, 97];
                    }
                }
            });

            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

            const separatorY = finalY + 10;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, separatorY, pageWidth - 20, separatorY);

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

            const rightX = pageWidth - 85;
            const rightY = separatorY + 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'});
            doc.text(`Situbondo, ${formattedDate}`, rightX + 32, rightY, {align: 'center'});
            
            doc.text(appSettings.officialPosition, rightX + 32, rightY + 6, {align: 'center'});

            const qrRightCanvas = document.querySelector('#qr-right canvas');
            if(qrRightCanvas) {
                try {
                    const imgRight = qrRightCanvas.toDataURL("image/png");
                    doc.addImage(imgRight, 'PNG', rightX + 19, rightY + 10, 25, 25);
                } catch (error) {
                    console.error("Error adding QR code image:", error);
                }
            }
            
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(rightX + 5, rightY + 40, rightX + 60, rightY + 40);
            
            const nameY = rightY + 45;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(appSettings.officialName, rightX + 32, nameY, {align: 'center'});
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`NIP. ${appSettings.officialNip}`, rightX + 32, nameY + 5, {align: 'center'});

            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            doc.setFontSize(7);
            const printTime = new Date().toLocaleString('id-ID');
            doc.text(`Dicetak : ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Total Data Terfilter: ${filteredData.length} records`, pageWidth / 2, footerY + 5, { align: 'center' });

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

/**
 * DOWNLOAD SINGLE PDF
 * Membuat PDF untuk data individu
 * @param {string|number} id - ID data yang akan dicetak
 */
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
        doc.setFontSize(12); 
        doc.setFont('helvetica', 'bold');
        
        const titleLines = doc.splitTextToSize('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', 180);
        let titleY = 18;
        
        for (let i = 0; i < titleLines.length; i++) {
            doc.text(titleLines[i], 105, titleY + (i * 6), { align: 'center' });
        }
        
        const titleEndY = titleY + (titleLines.length * 6);
        
        doc.setFontSize(14);
        doc.text('DINAS PERIKANAN', 105, titleEndY + 5, { align: 'center' });
        doc.setTextColor(246, 185, 59);
        doc.setFont('times', 'italic'); 
        doc.setFontSize(12);
        doc.text('"Situbondo Naik Kelas"', 105, titleEndY + 12, { align: 'center' });
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(appSettings.appSubtitle, 105, titleEndY + 18, { align: 'center' });
        
        doc.setTextColor(0, 0, 0); 
        doc.setFont('helvetica', 'bold'); 
        doc.setFontSize(14);
        doc.text('BIODATA NELAYAN TERDAFTAR', 105, titleEndY + 30, { align: 'center' });
        doc.setLineWidth(0.5); 
        doc.line(70, titleEndY + 33, 140, titleEndY + 33);

        let y = titleEndY + 40;
        const lineHeight = 7;
        
        const checkPage = (heightNeeded) => {
            if (y + heightNeeded > 250) { 
                doc.addPage();
                doc.setDrawColor(12, 36, 97); 
                doc.setLineWidth(1); 
                doc.rect(10, 10, 190, 277);
                y = 30; 
            }
        };

        const displayNik = maskData(d.nik);
        const displayWa = maskData(d.whatsapp);

        const printLine = (label, value) => {
            checkPage(lineHeight);
            doc.setFont('helvetica', 'normal'); 
            doc.text(label, 25, y);
            doc.setFont('helvetica', 'bold'); 
            
            if (label === 'Alamat' || label === 'Domisili' || value.length > 50) {
                const splitText = doc.splitTextToSize(': ' + value, 110);
                doc.text(splitText, 80, y);
                y += (splitText.length * 6);
            } else {
                doc.text(': ' + value, 80, y);
                y += lineHeight;
            }
        };

        checkPage(30);
        doc.setFontSize(11); 
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('I. IDENTITAS PRIBADI', 22, y); 
        y += 12;
        
        doc.setFontSize(10);
        printLine('Nama Lengkap', d.nama);
        printLine('NIK', displayNik);
        printLine('Tempat / Tgl Lahir', `${d.tahunLahir} (Usia: ${d.usia} Thn)`);
        printLine('Alamat Lengkap', d.alamat || '-');
        printLine('Domisili', `${d.desa}, ${d.kecamatan}`);
        printLine('No. Handphone', displayWa);
        y += 8;

        checkPage(30);
        doc.setFontSize(11); 
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('II. PROFESI & EKONOMI', 22, y); 
        y += 12;

        doc.setFontSize(10);
        printLine('Status Profesi', d.profesi);
        printLine('Posisi Kerja', d.status);
        printLine('Alat Penangkapan Ikan (API)', d.alatTangkap);
        printLine('Usaha Sampingan', d.usahaSampingan || '-');
        y += 8;

        checkPage(30);
        doc.setFontSize(11); 
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('III. JENIS IKAN TANGKAPAN UTAMA', 22, y); 
        y += 12;

        doc.setFontSize(10);
        const fishList = d.jenisIkan ? d.jenisIkan.split(', ') : [];
        fishList.forEach((fish, idx) => {
            printLine(`Ikan ${idx + 1}`, fish);
        });
        y += 8;

        if(d.status === 'Pemilik Kapal') {
            checkPage(30);
            doc.setFontSize(11); 
            doc.setFillColor(230, 230, 230);
            doc.rect(20, y-4, 170, 6, 'F');
            doc.text('IV. DATA ASET KAPAL', 22, y); 
            y += 12;

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

        doc.setFontSize(10); 
        doc.setTextColor(0,0,0); 
        doc.setFont('helvetica', 'normal');
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

        doc.setFontSize(7); 
        doc.setTextColor(150);
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

// =====================================================
// BAGIAN 18: FUNGSI ID CARD GENERATOR
// =====================================================

/**
 * GENERATE ID CARD
 * Membuat ID Card dalam format PDF
 * @param {string|number} id - ID data yang akan dibuat ID Card
 */
function generateIDCard(id) {
    const data = appData.find(item => item.id == id);
    if (!data) {
        alert('Data tidak ditemukan!');
        return;
    }

    const loadingEl = document.getElementById('idcardLoading');
    if (loadingEl) loadingEl.style.display = 'flex';

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54]
    });

    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 85.6, 54, 'F');

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(3.5, 3.5, 80.6, 49, 3, 3, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(12, 36, 97);
    doc.setLineWidth(0.5);
    doc.roundedRect(2.5, 2.5, 80.6, 49, 3, 3, 'FD');
    
    doc.setFillColor(74, 105, 189);
    doc.roundedRect(2.5, 2.5, 80.6, 10, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('DINAS PERIKANAN', 42.8, 6, { align: 'center' });
    doc.text('KABUPATEN SITUBONDO', 42.8, 8.5, { align: 'center' });

    doc.setDrawColor(246, 185, 59);
    doc.setLineWidth(0.5);
    doc.line(5, 11, 80, 11);

    doc.setTextColor(12, 36, 97);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('KARTU IDENTITAS NELAYAN TERDAFTAR', 42.8, 15, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(15, 16, 70, 16);

    const leftX = 5;
    const dataY = 20;
    const lineHeight = 3.2;

    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    
    const drawData = (label, value, y, isImportant = false) => {
        doc.text(label + ':', leftX, y);
        doc.setFont('helvetica', isImportant ? 'bold' : 'normal');
        
        let displayValue = value;
        if (value && value.length > 25) {
            displayValue = value.substring(0, 25) + '...';
        }
        
        doc.text(displayValue, leftX + 18, y);
        doc.setFont('helvetica', 'normal');
    };

    doc.setTextColor(100, 100, 100);
    
    drawData('Nama Lengkap', data.nama, dataY, true);
    
    const displayNik = maskData(data.nik);
    drawData('NIK', displayNik, dataY + lineHeight);
    
    drawData('TTL / Usia', `${data.tahunLahir} (${data.usia} Tahun)`, dataY + lineHeight * 2);
    
    doc.text('Alamat:', leftX, dataY + lineHeight * 3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    
    const alamatText = data.alamat || `${data.desa}, ${data.kecamatan}`;
    if (alamatText.length > 25) {
        const words = alamatText.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (const word of words) {
            if ((line1 + ' ' + word).length <= 25) {
                line1 += (line1 ? ' ' : '') + word;
            } else {
                line2 += (line2 ? ' ' : '') + word;
            }
        }
        
        doc.text(line1, leftX + 18, dataY + lineHeight * 3);
        if (line2) {
            doc.text(line2, leftX + 18, dataY + lineHeight * 3.7);
        }
    } else {
        doc.text(alamatText, leftX + 18, dataY + lineHeight * 3);
    }
    doc.setTextColor(100, 100, 100);

    doc.text('Domisili:', leftX, dataY + lineHeight * 4.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    doc.text(`${data.desa}, ${data.kecamatan}`, leftX + 18, dataY + lineHeight * 4.3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    doc.text('Status Pekerjaan:', leftX, dataY + lineHeight * 5.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    
    if (data.status === 'Pemilik Kapal') {
        doc.setTextColor(41, 128, 185);
    } else {
        doc.setTextColor(39, 174, 96);
    }
    
    doc.text(data.status, leftX + 18, dataY + lineHeight * 5.3);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    const kodeY = dataY + lineHeight * 6.3;
    doc.text('Kode Validasi:', leftX, kodeY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    
    doc.setFillColor(240, 245, 255);
    const textWidth = doc.getTextWidth(data.kodeValidasi || '-');
    doc.roundedRect(leftX + 18, kodeY - 1.5, textWidth + 2, 2.5, 1, 1, 'F');
    
    doc.text(data.kodeValidasi || '-', leftX + 19, kodeY);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');

    const qrSize = 16;
    const qrX = 85.6 - qrSize - 8;
    const qrY = 20;

    const qrCodeData = `SIMPADAN TANGKAP - ${data.kodeValidasi || data.nik}\nNama: ${data.nama}\nNIK: ${data.nik}\nAlamat: ${data.alamat || data.desa}\nDesa: ${data.desa}\nStatus: ${data.status}\nValidasi: ${data.tanggalValidasi}\n\n=== INFORMASI VALIDASI ===\nData ini VALID dan terdaftar secara resmi\npada Sistem Satu Data Nelayan (SIMPADAN TANGKAP)\nDinas Perikanan Kabupaten Situbondo\n\nUntuk verifikasi keaslian ID Card ini,\nkunjungi:\nwww.dinasperikanansitubondo.com/simpadan`;
    
    const qrContainer = document.createElement('div');
    qrContainer.id = 'temp-qr-container-idcard';
    qrContainer.style.width = qrSize + 'mm';
    qrContainer.style.height = qrSize + 'mm';
    qrContainer.style.position = 'absolute';
    qrContainer.style.left = '-1000px';
    qrContainer.style.top = '-1000px';
    document.body.appendChild(qrContainer);

    try {
        new QRCode(qrContainer, {
            text: qrCodeData,
            width: 160,
            height: 160,
            colorDark: "#0c2461",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        setTimeout(() => {
            const qrCanvas = qrContainer.querySelector('canvas');
            if (qrCanvas) {
                const imgData = qrCanvas.toDataURL('image/png');
                
                doc.setDrawColor(12, 36, 97);
                doc.setLineWidth(0.3);
                doc.roundedRect(qrX - 0.5, qrY - 0.5, qrSize + 1, qrSize + 1, 1, 1);
                
                doc.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);
                
                doc.setFontSize(4);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(100, 100, 100);
                doc.text('Pindai untuk verifikasi keaslian', qrX + qrSize/2, qrY + qrSize + 2, { align: 'center' });
            }

            document.body.removeChild(qrContainer);

            const separatorY = 44;
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.2);
            doc.line(5, separatorY, 80, separatorY);

            const footerY = separatorY + 2;
            doc.setFontSize(4);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(150, 150, 150);
            
            const footerText1 = 'Kartu ini diterbitkan secara elektronik oleh Sistem Satu Data Nelayan (SIMPADAN TANGKAP)';
            const footerText2 = `Validasi: ${data.tanggalValidasi} | ${data.validator}`;
            
            const splitFooter1 = doc.splitTextToSize(footerText1, 75);
            doc.text(splitFooter1, 42.8, footerY, { align: 'center' });
            
            const textHeight1 = splitFooter1.length * 1.5;
            doc.text(footerText2, 42.8, footerY + textHeight1 + 1, { align: 'center' });

            const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || data.nik.substring(0, 8)}.pdf`;
            doc.save(fileName);

            if (loadingEl) loadingEl.style.display = 'none';
            
            showNotification(`ID Card untuk ${data.nama} berhasil dibuat`, 'success');
        }, 500);
    } catch (error) {
        console.error("Error generating QR code:", error);
        
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(qrX, qrY, qrSize, qrSize, 1, 1, 'F');
        doc.setFontSize(4);
        doc.setTextColor(180, 180, 180);
        doc.text('QR Code', qrX + qrSize/2, qrY + qrSize/2 - 1, { align: 'center' });
        doc.text('tidak tersedia', qrX + qrSize/2, qrY + qrSize/2 + 1.5, { align: 'center' });

        const separatorY = 44;
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(5, separatorY, 80, separatorY);

        const footerY = separatorY + 2;
        doc.setFontSize(4);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        
        const footerText1 = 'Kartu ini diterbitkan secara elektronik oleh Sistem Satu Data Nelayan (SIMPADAN TANGKAP)';
        const footerText2 = `Validasi: ${data.tanggalValidasi} | ${data.validator}`;
        
        const splitFooter1 = doc.splitTextToSize(footerText1, 75);
        doc.text(splitFooter1, 42.8, footerY, { align: 'center' });
        
        const textHeight1 = splitFooter1.length * 1.5;
        doc.text(footerText2, 42.8, footerY + textHeight1 + 1, { align: 'center' });

        const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || data.nik.substring(0, 8)}.pdf`;
        doc.save(fileName);

        if (loadingEl) loadingEl.style.display = 'none';
        
        showNotification(`ID Card untuk ${data.nama} berhasil dibuat (tanpa QR Code)`, 'success');
        
        if (document.body.contains(qrContainer)) {
            document.body.removeChild(qrContainer);
        }
    }
}

/**
 * SAFE GENERATE ID CARD
 * Wrapper untuk generateIDCard yang aman
 * @param {string|number} id - ID data yang akan dibuat ID Card
 */
function safeGenerateIDCard(id) {
    generateIDCard(id);
}

// =====================================================
// BAGIAN 19: FUNGSI DASHBOARD DAN CHART
// =====================================================

/**
 * INITIALIZE CHARTS
 * Inisialisasi chart untuk dashboard
 */
function initializeCharts() {
    const profesiCanvas = document.getElementById('profesiChart');
    const kapalCanvas = document.getElementById('kapalChart');
    
    if (!profesiCanvas || !kapalCanvas) return;

    const profesiCtx = profesiCanvas.getContext('2d');
    const kapalCtx = kapalCanvas.getContext('2d');

    if (window.profesiChart instanceof Chart) window.profesiChart.destroy();
    if (window.kapalChart instanceof Chart) window.kapalChart.destroy();

    window.profesiChart = new Chart(profesiCtx, {
        type: 'doughnut', 
        data: { labels: [], datasets: [] },
        options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
    });

    window.kapalChart = new Chart(kapalCtx, {
        type: 'bar', 
        data: { labels: [], datasets: [] },
        options: { maintainAspectRatio: false, responsive: true, scales: { y: { beginAtZero: true } } }
    });
    
    updateDashboard();
}

/**
 * UPDATE DASHBOARD
 * Update data dan chart di dashboard
 */
function updateDashboard() {
    if (!window.profesiChart || !window.kapalChart) return; 

    const totalPenerima = document.getElementById('totalPenerima');
    const totalPenuhWaktu = document.getElementById('totalPenuhWaktu');
    const totalPemilik = document.getElementById('totalPemilik');
    const totalSambilanUtama = document.getElementById('totalSambilanUtama');
    const totalSambilanTambahan = document.getElementById('totalSambilanTambahan');
    const totalABK = document.getElementById('totalABK');
    
    if (totalPenerima) totalPenerima.textContent = appData.length;
    const penuhWaktuCount = appData.filter(d => d.profesi === 'Nelayan Penuh Waktu').length;
    if (totalPenuhWaktu) totalPenuhWaktu.textContent = penuhWaktuCount;
    if (totalPemilik) totalPemilik.textContent = appData.filter(d => d.status === 'Pemilik Kapal').length;
    
    const sambilanUtamaCount = appData.filter(d => d.profesi === 'Nelayan Sambilan Utama').length;
    if (totalSambilanUtama) totalSambilanUtama.textContent = sambilanUtamaCount;
    
    const sambilanTambahanCount = appData.filter(d => d.profesi === 'Nelayan Sambilan Tambahan').length;
    if (totalSambilanTambahan) totalSambilanTambahan.textContent = sambilanTambahanCount;
    
    const abkCount = appData.filter(d => d.status === 'Anak Buah Kapal').length;
    if (totalABK) totalABK.textContent = abkCount;

    const pData = {};
    appData.forEach(d => pData[d.profesi] = (pData[d.profesi] || 0) + 1);
    window.profesiChart.data = {
        labels: Object.keys(pData),
        datasets: [{ 
            data: Object.values(pData), 
            backgroundColor: ['#0c2461', '#e58e26', '#27ae60', '#4a69bd', '#f6b93b'] 
        }] 
    };
    window.profesiChart.update();

    const kData = {};
    appData.filter(d => d.status === 'Pemilik Kapal').forEach(d => kData[d.jenisKapal] = (kData[d.jenisKapal] || 0) + 1);
    window.kapalChart.data = {
        labels: Object.keys(kData),
        datasets: [{ label: 'Unit', data: Object.values(kData), backgroundColor: '#4a69bd' }]
    };
    window.kapalChart.update();
}

// =====================================================
// BAGIAN 20: FUNGSI LOCALSTORAGE
// =====================================================

/**
 * SAVE DATA
 * Menyimpan data ke localStorage
 */
function saveData() { 
    localStorage.setItem('nelayanData', JSON.stringify(appData)); 
}

/**
 * SAVE SETTINGS
 * Menyimpan pengaturan ke localStorage
 */
function saveSettings() { 
    appSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
    localStorage.setItem('nelayanSettings', JSON.stringify(appSettings)); 
}

/**
 * LOAD DATA
 * Memuat data dari localStorage
 */
function loadData() { 
    const d = localStorage.getItem('nelayanData'); 
    if(d) {
        try {
            appData = JSON.parse(d); 
        } catch (e) {
            console.error("Error loading data:", e);
            appData = [];
        }
    }
}

/**
 * LOAD SETTINGS
 * Memuat pengaturan dari localStorage
 */
function loadSettings() { 
    const s = localStorage.getItem('nelayanSettings'); 
    if(s) {
        try {
            const loadedSettings = JSON.parse(s);
            loadedSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
            if (!loadedSettings.securityCodeSensor) {
                loadedSettings.securityCodeSensor = '97531';
            }
            if (!loadedSettings.officialName) {
                loadedSettings.officialName = 'SUGENG PURWO PRIYANTO, S.E, M.M';
            }
            if (!loadedSettings.officialNip) {
                loadedSettings.officialNip = '19761103 200903 1 001';
            }
            if (!loadedSettings.officialPosition) {
                loadedSettings.officialPosition = 'Kepala Bidang Pemberdayaan Nelayan';
            }
            if (!loadedSettings.itemsPerPage || loadedSettings.itemsPerPage < 1) {
                loadedSettings.itemsPerPage = 5;
            }
            if (!loadedSettings.passwordInputData) {
                loadedSettings.passwordInputData = '666666';
            }
            if (!loadedSettings.passwordDataNelayan) {
                loadedSettings.passwordDataNelayan = '999999';
            }
            if (typeof loadedSettings.securityMenuInputDataEnabled === 'undefined') {
                loadedSettings.securityMenuInputDataEnabled = true;
            }
            if (typeof loadedSettings.securityMenuDataNelayanEnabled === 'undefined') {
                loadedSettings.securityMenuDataNelayanEnabled = true;
            }
            Object.assign(appSettings, loadedSettings);
        } catch (e) {
            console.error("Error loading settings:", e);
        }
    }
}

// =====================================================
// BAGIAN 21: FUNGSI LAINNYA
// =====================================================

/**
 * EXPORT DATA KE EXCEL
 * @param {string} type - Tipe export ('xlsx')
 */
function exportData(type) {
    if(appData.length === 0) {
        showNotification('Tidak ada data', 'error');
        return;
    }
    
    const dataToExport = appData.map(d => ({
        ...d, nik: maskData(d.nik), whatsapp: maskData(d.whatsapp)
    }));
    const finalData = dataToExport.map(d => ({ ...d, NIK: `'${d.nik}`, WhatsApp: `'${d.whatsapp}` }));
    
    if(type === 'xlsx') {
        try {
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(finalData), "Data Nelayan");
            XLSX.writeFile(wb, `Nelayan_${appSettings.appSubtitle.slice(0,10)}_${Date.now()}.xlsx`);
            showNotification('Ekspor Excel berhasil.', 'success');
        } catch (error) {
            console.error("Error exporting Excel:", error);
            showNotification('Gagal mengekspor data Excel', 'error');
        }
    }
}

/**
 * SEND DATA KE WHATSAPP
 * Mengirim data via WhatsApp
 */
function sendDataToWhatsapp() {
    const message = `Yth. Administrator Dinas Perikanan Kabupaten Situbondo,\n\nBerikut kami lampirkan data pembaruan Sistem Satu Data Nelayan dari:\n*${appSettings.appSubtitle}*\n\nTanggal Laporan: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nTotal Data: ${appData.length} nelayan\n\nData terlampir dalam format reload.js\n\nSalam,\nOperator SIMPADAN TANGKAP`;
    const url = `https://wa.me/6287865614222?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

/**
 * REFRESH HALAMAN
 * Me-refresh halaman aplikasi
 */
function refreshPage() {
    if (confirm('Apakah Anda yakin ingin me-refresh halaman? Semua perubahan yang belum disimpan akan hilang.')) {
        location.reload();
    }
}

/**
 * CHECK GLOBAL DUPLICATES
 * Memeriksa duplikat global di seluruh data
 */
function checkGlobalDuplicates() {
    const duplicateMap = new Map();
    let hasDuplicate = false;
    
    for (const d of appData) {
        const key = `${d.nik}_${d.nama.toUpperCase()}`;
        if (duplicateMap.has(key)) {
            hasDuplicate = true;
            break;
        } else {
            duplicateMap.set(key, d);
        }
    }
    
    const duplicateWarning = document.getElementById('duplicateWarning');
    if (duplicateWarning) {
        duplicateWarning.style.display = hasDuplicate ? 'block' : 'none';
    }
}

/**
 * START DUPLICATE CHECKER
 * Memulai interval pengecekan duplikat
 */
function startDuplicateChecker() {
    checkGlobalDuplicates();
    duplicateCheckInterval = setInterval(checkGlobalDuplicates, 15000);
}

/**
 * LOAD OFFICIAL DATA
 * Memuat data pejabat ke form pengaturan
 */
function loadOfficialData() {
    const officialName = document.getElementById('officialName');
    const officialNip = document.getElementById('officialNip');
    const officialPosition = document.getElementById('officialPosition');
    
    if (officialName) officialName.value = appSettings.officialName || 'SUGENG PURWO PRIYANTO, S.E, M.M';
    if (officialNip) officialNip.value = appSettings.officialNip || '19761103 200903 1 001';
    if (officialPosition) officialPosition.value = appSettings.officialPosition || 'Kepala Bidang Pemberdayaan Nelayan';
}

/**
 * UPDATE APP IDENTITY
 * Update identitas aplikasi di UI
 */
function updateAppIdentity() {
    appSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
    const appTitle = document.querySelector('.app-title');
    const dynamicSubtitle = document.getElementById('dynamicSubtitle');
    const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
    const appNameInput = document.getElementById('appName');
    const appSubtitleInput = document.getElementById('appSubtitle');
    
    if (appTitle) appTitle.textContent = appSettings.appName;
    if (dynamicSubtitle) dynamicSubtitle.textContent = appSettings.appSubtitle;
    if (itemsPerPageSelect) itemsPerPageSelect.value = appSettings.itemsPerPage;
    if (appNameInput) appNameInput.value = appSettings.appName;
    if (appSubtitleInput) appSubtitleInput.value = appSettings.appSubtitle;
}

/**
 * UPDATE PRIVACY UI
 * Update tampilan status privacy mode
 */
function updatePrivacyUI() {
    const toggle = document.getElementById('privacyToggle');
    const status = document.getElementById('privacyStatus');
    const sensorText = document.getElementById('sensorStatusText');
    
    if (!toggle || !status || !sensorText) return;
    
    toggle.checked = appSettings.privacyMode;
    if(appSettings.privacyMode) {
        status.innerHTML = "Status: <span class='text-success'>Sensor Aktif (Aman)</span>";
        status.className = "mt-2 small fw-bold";
        sensorText.innerHTML = "Sensor: ON";
        sensorText.className = "badge bg-success me-2";
    } else {
        status.innerHTML = "Status: <span class='text-danger'>Sensor Non-Aktif (Terbuka)</span>";
        status.className = "mt-2 small fw-bold";
        sensorText.innerHTML = "Sensor: OFF";
        sensorText.className = "badge bg-danger me-2";
    }
}

/**
 * SETUP INFO TOOLTIPS
 * Setup tooltip informasi untuk alat tangkap dan jenis kapal
 */
function setupInfoTooltips() {
    const alatTangkapSelect = document.getElementById('alatTangkap');
    const apiInfoDiv = document.getElementById('apiInfo');
    
    if (alatTangkapSelect) {
        alatTangkapSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected && API_INFO[selected]) {
                apiInfoDiv.style.display = 'block';
                apiInfoDiv.innerHTML = `<strong>${selected}:</strong> ${API_INFO[selected]}`;
                updateFishOptionsByAPI(selected);
            } else {
                apiInfoDiv.style.display = 'none';
                updateFishOptionsByAPI('');
            }
        });
    }

    const jenisKapalSelect = document.getElementById('jenisKapal');
    const kapalInfoDiv = document.getElementById('kapalInfo');
    
    if (jenisKapalSelect) {
        jenisKapalSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected && KAPAL_INFO[selected]) {
                kapalInfoDiv.style.display = 'block';
                kapalInfoDiv.innerHTML = `<strong>${selected}:</strong> ${KAPAL_INFO[selected]}`;
                updateAlatTangkapByKapal();
            } else {
                kapalInfoDiv.style.display = 'none';
                if (document.getElementById('apiMappingInfo')) {
                    document.getElementById('apiMappingInfo').style.display = 'none';
                }
            }
        });
    }
}

/**
 * SETUP PROFESI INFO
 * Setup informasi untuk dropdown profesi
 */
function setupProfesiInfo() {
    const profesiSelect = document.getElementById('profesi');
    const profesiHelp = document.getElementById('profesiHelp');
    
    if (profesiSelect) {
        profesiSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected && PROFESI_INFO[selected]) {
                profesiHelp.innerHTML = `
                    <div class="profesi-info-box">
                        <div class="profesi-info-title">${selected}</div>
                        <div class="profesi-info-desc">${PROFESI_INFO[selected]}</div>
                    </div>
                `;
            } else {
                profesiHelp.innerHTML = '';
            }
        });
    }
}

// =====================================================
// BAGIAN 22: NOTIFICATION FUNCTION
// =====================================================

/**
 * SHOW NOTIFICATION
 * Menampilkan notifikasi toast
 * @param {string} message - Pesan notifikasi
 * @param {string} type - Tipe notifikasi ('info', 'success', 'error', 'warning')
 */
function showNotification(message, type = 'info') {
    const toast = document.querySelector('.notification-toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastTitle || !toastMessage) return;
    
    switch(type) {
        case 'success':
            toastTitle.innerHTML = '<i class="fas fa-check-circle me-2 text-success"></i>Berhasil';
            break;
        case 'error':
            toastTitle.innerHTML = '<i class="fas fa-exclamation-circle me-2 text-danger"></i>Error';
            break;
        case 'warning':
            toastTitle.innerHTML = '<i class="fas fa-exclamation-triangle me-2 text-warning"></i>Peringatan';
            break;
        default:
            toastTitle.innerHTML = '<i class="fas fa-info-circle me-2 text-info"></i>Informasi';
    }
    
    toastMessage.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// =====================================================
// BAGIAN 23: FLOATING MENU
// =====================================================

/**
 * SETUP FLOATING MENU
 * Setup floating action button dan menu
 */
function setupFloatingMenu() {
    const fabMain = document.getElementById('fabMainBtn');
    const container = document.getElementById('fabMenu');
    if (!fabMain || !container) return;
    
    fabMain.addEventListener('click', () => {
        container.classList.toggle('open');
        const icon = fabMain.querySelector('i');
        if(container.classList.contains('open')){
            icon.classList.remove('fa-plus'); 
            icon.classList.add('fa-times');
            fabMain.style.transform = "rotate(90deg)";
        } else {
            icon.classList.add('fa-plus'); 
            icon.classList.remove('fa-times');
            fabMain.style.transform = "rotate(0deg)";
        }
    });
    
    const shortcuts = {
        'fabInput': 'v-pills-input-tab', 
        'fabFilter': 'v-pills-filter-tab',
        'fabVerify': 'v-pills-verify-tab',
        'fabExport': 'v-pills-export-tab', 
        'fabBackup': 'v-pills-backup-tab', 
        'fabSettings': 'v-pills-settings-tab'
    };
    
    for (const [id, tabId] of Object.entries(shortcuts)) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault(); 
                const tabElement = document.getElementById(tabId);
                if (tabElement) tabElement.click(); 
                container.classList.remove('open');
            });
        }
    }
    
    const fabReload = document.getElementById('fabReload');
    if (fabReload) {
        fabReload.addEventListener('click', (e) => {
            e.preventDefault(); 
            handleReloadRepo();
        });
    }
}

// =====================================================
// BAGIAN 24: INITIALIZATION
// =====================================================

/**
 * INITIALIZE APP
 * Inisialisasi seluruh aplikasi
 */
function initializeApp() {
    loadData();
    loadSettings();
    migrateOldData();
    
    initDataWilayah();
    initMenuAuthModal();
    
    if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
        console.log("Data backup terdeteksi. Ready untuk merge/sync.");
    }

    const kecSelect = document.getElementById('kecamatan');
    if (kecSelect) {
        kecSelect.innerHTML = `<option value="">Pilih Kecamatan</option>`;
        if (typeof SITUBONDO_DATA !== 'undefined') {
            Object.keys(SITUBONDO_DATA).sort().forEach(kec => kecSelect.add(new Option(kec, kec)));
        }
    }
    
    const filterDesaSelect = document.getElementById('filterDesa');
    if (filterDesaSelect) {
        filterDesaSelect.innerHTML = `<option value="">Semua Desa</option>`;
        const allDesas = new Set();
        if (typeof SITUBONDO_DATA !== 'undefined') {
            Object.values(SITUBONDO_DATA).forEach(list => list.forEach(d => allDesas.add(d)));
        }
        [...allDesas].sort().forEach(d => filterDesaSelect.add(new Option(d, d)));
    }
    
    const filterAlatTangkap = document.getElementById('filterAlatTangkap');
    if (filterAlatTangkap) {
        filterAlatTangkap.innerHTML = `<option value="">Semua</option>`;
        Object.keys(API_INFO).forEach(api => filterAlatTangkap.add(new Option(api, api)));
    }
    
    const filterJenisKapal = document.getElementById('filterJenisKapal');
    if (filterJenisKapal) {
        filterJenisKapal.innerHTML = `<option value="">Semua</option>`;
        Object.keys(KAPAL_INFO).forEach(kapal => filterJenisKapal.add(new Option(kapal, kapal)));
    }
    
    const jenisKapalSelect = document.getElementById('jenisKapal');
    if (jenisKapalSelect) {
        jenisKapalSelect.innerHTML = '<option value="">Pilih Jenis...</option>';
        Object.keys(KAPAL_INFO).forEach(kapal => {
            jenisKapalSelect.add(new Option(kapal, kapal));
        });
    }
    
    const alatTangkapSelect = document.getElementById('alatTangkap');
    if (alatTangkapSelect) {
        alatTangkapSelect.innerHTML = '<option value="">Pilih Alat Penangkapan Ikan...</option>';
        Object.keys(API_INFO).forEach(api => {
            alatTangkapSelect.add(new Option(api, api));
        });
    }
    
    updateAppIdentity();
    updatePrivacyUI();
    updateWilayahUI();
    updateWilayahStatusIndicator();
    startDuplicateChecker();
    setupInfoTooltips();
    setupProfesiInfo();
    
    updateFishOptionsByAPI('');
    loadOfficialData();
    setupAutoUppercaseInputs();
    setupMenuAuthListeners();
    setupAllPasswordToggles();
    initMenuSecurityToggles();
}

// =====================================================
// BAGIAN 25: MAIN EVENT LISTENERS
// =====================================================

/**
 * SETUP EVENT LISTENERS
 * Setup semua event listener untuk aplikasi
 */
function setupEventListeners() {
    setupAllPasswordToggles();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('loginButton');
            const spinner = document.getElementById('loginSpinner');
            const inputCode = document.getElementById('securityCode').value;
            const correctCode = generateSecurityCode();
            
            if (!btn || !spinner) return;
            
            if (inputCode !== correctCode) {
                showNotification('Kode keamanan salah! Periksa kembali atau hubungi administrator.', 'error');
                return;
            }
            
            btn.disabled = true;
            spinner.classList.remove('d-none');
            btn.innerHTML = 'MEMBUKA SISTEM... <span class="spinner-border spinner-border-sm ms-2"></span>';
            
            setTimeout(() => {
                sessionStorage.setItem('simata_session', 'active');
                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('appContent').style.display = 'block';
                initializeCharts();
                updateDashboard();
                renderDataTable();
                loginSuccessModal.show();
                btn.disabled = false;
                spinner.classList.add('d-none');
                btn.innerHTML = 'BUKA DASHBOARD';
            }, 1200);
        });
    }

    const continueBtn = document.getElementById('btnContinueDashboard');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            loginSuccessModal.hide();
            setTimeout(() => {
                welcomeModal.show();
            }, 300);
        });
    }

    const welcomeReloadBtn = document.getElementById('btnWelcomeReload');
    if (welcomeReloadBtn) {
        welcomeReloadBtn.addEventListener('click', function() {
            welcomeModal.hide();
            handleReloadRepo();
        });
    }

    const noWaBtn = document.getElementById('btnNoWA');
    if (noWaBtn) {
        noWaBtn.addEventListener('click', function() {
            const input = document.getElementById('whatsapp');
            if (!input) return;
            
            if (input.hasAttribute('readonly')) {
                input.removeAttribute('readonly');
                input.value = '';
                input.setAttribute('required', 'required');
                this.classList.remove('active', 'btn-secondary');
                this.classList.add('btn-outline-secondary');
                this.textContent = "Tidak Ada";
            } else {
                input.value = '00000000';
                input.setAttribute('readonly', true);
                input.removeAttribute('required'); 
                this.classList.add('active', 'btn-secondary');
                this.classList.remove('btn-outline-secondary');
                this.textContent = "Batal";
            }
        });
    }

    const privacyToggle = document.getElementById('privacyToggle');
    if (privacyToggle) {
        privacyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStatus = appSettings.privacyMode;
            
            if (currentStatus === true) {
                const code = prompt("MASUKKAN KODE KEAMANAN SENSOR untuk menonaktifkan sensor:");
                if (code === appSettings.securityCodeSensor) {
                    appSettings.privacyMode = false;
                    saveSettings(); 
                    updatePrivacyUI(); 
                    renderDataTable();
                    showNotification('Sensor Data dinonaktifkan.', 'warning');
                } else { 
                    alert("Kode Keamanan Sensor Salah!"); 
                    this.checked = true;
                }
            } else {
                appSettings.privacyMode = true;
                saveSettings(); 
                updatePrivacyUI(); 
                renderDataTable();
                showNotification('Sensor Data diaktifkan.', 'success');
            }
        });
    }

    const kecamatanSelect = document.getElementById('kecamatan');
    if (kecamatanSelect) {
        kecamatanSelect.addEventListener('change', function() {
            const selectedKec = this.value;
            const desaSelect = document.getElementById('desa');
            if (!desaSelect) return;
            
            desaSelect.innerHTML = `<option value="">Pilih Desa / Kelurahan</option>`;
            if (selectedKec && SITUBONDO_DATA && SITUBONDO_DATA[selectedKec]) {
                desaSelect.disabled = false;
                SITUBONDO_DATA[selectedKec].sort().forEach(desa => desaSelect.add(new Option(desa, desa)));
            } else {
                desaSelect.disabled = true;
                desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
            }
        });
    }

    const inputForm = document.getElementById('inputForm');
    if (inputForm) {
        inputForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (inputForm) {
        inputForm.addEventListener('reset', () => {
            setTimeout(() => {
                const ownerFields = document.getElementById('ownerFields');
                const usiaInput = document.getElementById('usia');
                const desaSelect = document.getElementById('desa');
                const jenisIkanLainnya = document.getElementById('jenisIkanLainnya');
                const waInput = document.getElementById('whatsapp');
                const btnWa = document.getElementById('btnNoWA');
                const alamatInput = document.getElementById('alamat');
                
                if (ownerFields) ownerFields.style.display = 'none';
                if (usiaInput) usiaInput.value = '';
                if (alamatInput) alamatInput.value = '';
                if (desaSelect) {
                    desaSelect.disabled = true;
                    desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
                }
                if (inputForm) inputForm.removeAttribute('data-edit-id');
                if (jenisIkanLainnya) {
                    jenisIkanLainnya.style.display = 'none';
                    jenisIkanLainnya.value = '';
                }
                
                const kv = document.getElementById('kodeValidasi');
                if (kv) {
                    kv.value = '';
                    kv.removeAttribute('readonly'); 
                }
                
                if (waInput) waInput.removeAttribute('readonly');
                if (btnWa) {
                    btnWa.classList.remove('active', 'btn-secondary');
                    btnWa.classList.add('btn-outline-secondary');
                    btnWa.textContent = "Tidak Ada";
                }
                
                const apiInfo = document.getElementById('apiInfo');
                const kapalInfo = document.getElementById('kapalInfo');
                const profesiHelp = document.getElementById('profesiHelp');
                const apiMappingInfo = document.getElementById('apiMappingInfo');
                
                if (apiInfo) apiInfo.style.display = 'none';
                if (kapalInfo) kapalInfo.style.display = 'none';
                if (profesiHelp) profesiHelp.innerHTML = '';
                if (apiMappingInfo) apiMappingInfo.style.display = 'none';
                
                const today = new Date().toISOString().split('T')[0];
                const tanggalValidasi = document.getElementById('tanggalValidasi');
                if (tanggalValidasi) tanggalValidasi.value = today;
                
                updateFishOptionsByAPI('');
            }, 100);
        });
    }
    
    const statusNelayan = document.getElementById('statusNelayan');
    if (statusNelayan) {
        statusNelayan.addEventListener('change', function() {
            const isOwner = this.value === 'Pemilik Kapal';
            const ownerFields = document.getElementById('ownerFields');
            if (ownerFields) {
                ownerFields.style.display = isOwner ? 'block' : 'none';
                if(!isOwner) {
                    const namaKapal = document.getElementById('namaKapal');
                    const jenisKapal = document.getElementById('jenisKapal');
                    const kapalInfo = document.getElementById('kapalInfo');
                    const apiMappingInfo = document.getElementById('apiMappingInfo');
                    
                    if (namaKapal) namaKapal.value = '';
                    if (jenisKapal) jenisKapal.value = '';
                    if (kapalInfo) kapalInfo.style.display = 'none';
                    if (apiMappingInfo) apiMappingInfo.style.display = 'none';
                }
            }
        });
    }

    const tahunLahirInput = document.getElementById('tahunLahir');
    if (tahunLahirInput) {
        tahunLahirInput.addEventListener('input', function() {
            const year = parseInt(this.value);
            const currentYear = new Date().getFullYear();
            const usiaInput = document.getElementById('usia');
            if (!usiaInput) return;
            
            if(year && this.value.length === 4 && year <= currentYear && year >= 1900) {
                usiaInput.value = currentYear - year;
            }
        });
    }

    const generateKodeBtn = document.getElementById('generateKodeBtn');
    if (generateKodeBtn) {
        generateKodeBtn.addEventListener('click', function() {
            const nik = document.getElementById('nik').value;
            const kodeInput = document.getElementById('kodeValidasi');
            if (!kodeInput) return;
            
            if (kodeInput.value && kodeInput.value.trim() !== '') {
                showNotification('Kode Validasi sudah digenerate dan bersifat permanen!', 'warning');
                return;
            }
            if(nik.length !== 16) {
                return showNotification('Isi NIK 16 digit terlebih dahulu!', 'error');
            }
            const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
            kodeInput.value = 'VLD-' + randomPart;
            showNotification('Kode Validasi berhasil dibuat dan terkunci.', 'success');
        });
    }

    const btnDataWilayah = document.getElementById('btnDataWilayah');
    if (btnDataWilayah) {
        btnDataWilayah.addEventListener('click', function() {
            modalDataWilayah.show();
        });
    }

    const btnInputGlobal = document.getElementById('btnInputGlobal');
    if (btnInputGlobal) {
        btnInputGlobal.addEventListener('click', setInputGlobalMode);
    }

    const btnInputGlobalModal = document.getElementById('btnInputGlobalModal');
    if (btnInputGlobalModal) {
        btnInputGlobalModal.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    const btnGlobalMode = document.getElementById('btnGlobalMode');
    if (btnGlobalMode) {
        btnGlobalMode.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    const btnGlobalModeKecamatan = document.getElementById('btnGlobalModeKecamatan');
    if (btnGlobalModeKecamatan) {
        btnGlobalModeKecamatan.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    const searchWilayah = document.getElementById('searchWilayah');
    if (searchWilayah) {
        searchWilayah.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            const activeTab = document.querySelector('#wilayahTabs .nav-link.active');
            if (!activeTab) return;
            
            let cardSelector, emptyStateId, containerId;
            
            if (activeTab.id === 'desa-tab') {
                cardSelector = '#wilayahDesaCardsContainer .wilayah-card';
                emptyStateId = 'wilayahDesaEmptyState';
                containerId = 'wilayahDesaCardsContainer';
            } else {
                cardSelector = '#wilayahKecamatanCardsContainer .wilayah-card';
                emptyStateId = 'wilayahKecamatanEmptyState';
                containerId = 'wilayahKecamatanCardsContainer';
            }
            
            const cards = document.querySelectorAll(cardSelector);
            let visibleCount = 0;
            
            cards.forEach(card => {
                const name = card.querySelector('strong').textContent.toLowerCase();
                if (name.includes(searchTerm)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const emptyState = document.getElementById(emptyStateId);
            const container = document.getElementById(containerId);
            
            if (visibleCount === 0 && searchTerm.trim() !== '') {
                if (emptyState) emptyState.classList.remove('d-none');
                if (container) container.classList.add('d-none');
            } else {
                if (emptyState) emptyState.classList.add('d-none');
                if (container) container.classList.remove('d-none');
            }
        });
    }

    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            const input = document.getElementById('verifyInput').value;
            if (!input || input.trim() === '') {
                showNotification('Masukkan Kode Validasi (KIN) atau NIK untuk verifikasi', 'warning');
                return;
            }
            
            const result = verifyKIN(input);
            displayVerifyResult(result);
        });
    }

    const refreshBtn = document.getElementById('btn-refresh-page');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshPage);
    }

    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebarMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenuBtn && overlay && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('mobile-show');
            overlay.classList.add('active');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-show');
            overlay.classList.remove('active');
        });
        
        document.querySelectorAll('#sidebarMenu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    sidebar.classList.remove('mobile-show');
                    overlay.classList.remove('active');
                }
            });
        });
    }
    
    const logoutBtn = document.getElementById('v-pills-logout-tab');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm('Apakah Anda yakin ingin keluar? Sistem akan mengunduh data backup secara otomatis.')) {
                showLoading("Membuat Backup", "Sedang membuat backup data sebelum keluar. Mohon tunggu...");
                setTimeout(() => {
                    sessionStorage.removeItem('simata_session');
                    resetMenuAuth();
                    backupData();
                    setTimeout(() => {
                        hideLoading();
                        location.reload();
                    }, 2000);
                }, 500);
            }
        });
    }

    const searchInput = document.getElementById('searchData');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            renderDataTable();
        });
    }
    
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const cekGandaBtn = document.getElementById('btnCekGanda');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    if (applyFilterBtn) applyFilterBtn.addEventListener('click', applyFilter);
    if (resetFilterBtn) resetFilterBtn.addEventListener('click', resetFilter);
    if (cekGandaBtn) cekGandaBtn.addEventListener('click', showDuplicateDataInFilter);
    if (selectAllCheckbox) selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
        toggleBulkDeleteBtn();
    });
    if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', bulkDeleteData);
    
    const unduhFilteredPdfBtn = document.getElementById('btnUnduhFilteredPdf');
    if (unduhFilteredPdfBtn) unduhFilteredPdfBtn.addEventListener('click', generateFilteredPdf);
    
    const unduhTabelPdfBtn = document.getElementById('btnUnduhTabelPdf');
    if (unduhTabelPdfBtn) unduhTabelPdfBtn.addEventListener('click', generateTabelPdf);

    const printPdfBtn = document.getElementById('printPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportReloadJsBtn = document.getElementById('exportReloadJsBtn');
    const sendWaBtn = document.getElementById('sendWaBtn');
    const backupDataBtn = document.getElementById('backupDataBtn');
    const restoreFileInput = document.getElementById('restoreFileInput');
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    
    if (printPdfBtn) printPdfBtn.addEventListener('click', printData);
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', () => exportData('xlsx'));
    if (exportReloadJsBtn) exportReloadJsBtn.addEventListener('click', () => backupData('reload.js'));
    if (sendWaBtn) sendWaBtn.addEventListener('click', sendDataToWhatsapp);
    if (backupDataBtn) backupDataBtn.addEventListener('click', () => backupData());
    if (restoreFileInput) {
        restoreFileInput.addEventListener('change', function() {
            if (restoreDataBtn) {
                restoreDataBtn.disabled = !this.files.length;
            }
        });
    }
    if (restoreDataBtn) restoreDataBtn.addEventListener('click', restoreData);
    
    const reloadRepoBtn = document.getElementById('btn-reload-repo');
    if (reloadRepoBtn) {
        reloadRepoBtn.addEventListener('click', handleReloadRepo);
    }
    
    const downloadDetailPdfBtn = document.getElementById('btnDownloadDetailPdf');
    if (downloadDetailPdfBtn) {
        downloadDetailPdfBtn.addEventListener('click', () => {
            downloadSinglePdf(currentDetailId);
        });
    }

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            appSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
            
            const appSubtitleInput = document.getElementById('appSubtitle');
            const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
            
            if (appSubtitleInput) appSettings.appSubtitle = appSubtitleInput.value;
            
            if (itemsPerPageSelect) {
                let itemsPerPage = parseInt(itemsPerPageSelect.value);
                if (isNaN(itemsPerPage) || itemsPerPage < 1) {
                    itemsPerPage = 5;
                }
                appSettings.itemsPerPage = itemsPerPage;
            }
            
            saveSettings(); 
            updateAppIdentity(); 
            renderDataTable();
            showNotification('Pengaturan tersimpan! Nama instansi dan jumlah baris per halaman berhasil diperbarui.', 'success');
        });
    }

    const officialForm = document.getElementById('officialForm');
    if (officialForm) {
        officialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const officialName = document.getElementById('officialName').value;
            const officialNip = document.getElementById('officialNip').value;
            const officialPosition = document.getElementById('officialPosition').value;
            
            if (!officialName || !officialNip || !officialPosition) {
                showNotification('Harap isi semua field data pejabat!', 'error');
                return;
            }
            
            appSettings.officialName = officialName;
            appSettings.officialNip = officialNip;
            appSettings.officialPosition = officialPosition;
            
            saveSettings();
            showNotification('Data pejabat penandatangan berhasil disimpan!', 'success');
        });
    }

    const sensorCodeForm = document.getElementById('sensorCodeForm');
    if (sensorCodeForm) {
        sensorCodeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentCode = document.getElementById('currentSensorCode').value;
            const newCode = document.getElementById('newSensorCode').value;
            const confirmCode = document.getElementById('confirmSensorCode').value;
            
            if (currentCode !== appSettings.securityCodeSensor) {
                showNotification('Kode keamanan sensor saat ini salah!', 'error');
                return;
            }
            
            if (newCode.length < 6) {
                showNotification('Kode keamanan baru minimal 6 digit!', 'error');
                return;
            }
            
            if (newCode !== confirmCode) {
                showNotification('Konfirmasi kode baru tidak cocok!', 'error');
                return;
            }
            
            appSettings.securityCodeSensor = newCode;
            saveSettings();
            document.getElementById('currentSensorCode').value = '';
            document.getElementById('newSensorCode').value = '';
            document.getElementById('confirmSensorCode').value = '';
            showNotification('Kode keamanan sensor berhasil diperbarui!', 'success');
        });
    }

    setupFloatingMenu();
}

// =====================================================
// BAGIAN 26: DOM CONTENT LOADED
// =====================================================

/**
 * DOM CONTENT LOADED
 * Event listener utama saat halaman selesai dimuat
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
        setupEventListeners();
        
        displayCurrentDate();
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tanggalValidasi').value = today;
        
        const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
        if (isSessionActive) {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('appContent').style.display = 'block';
            initializeCharts();
            updateDashboard();
            renderDataTable();
            
            if (sessionStorage.getItem('menu_auth_input') === 'true') {
                menuAuthStatus.inputData = true;
            }
            if (sessionStorage.getItem('menu_auth_data') === 'true') {
                menuAuthStatus.dataNelayan = true;
            }
        } else {
            setTimeout(() => {
                document.getElementById('loginModal').style.display = 'flex';
            }, 100);
        }

        if (typeof window.handleHashRouting === 'function') {
            window.handleHashRouting();
        }

    } catch (error) {
        console.error("Initialization Error:", error);
        showNotification("Terjadi kesalahan sistem saat memuat. Silakan refresh halaman.", 'error');
    }
});

// =====================================================
// BAGIAN 27: WINDOW EXPORTS
// =====================================================

// Ekspos fungsi-fungsi penting ke window untuk akses global
window.loadDataByDesa = loadDataByDesa;
window.loadDataByKecamatan = loadDataByKecamatan;
window.setupInputForDesa = setupInputForDesa;
window.setupInputForKecamatan = setupInputForKecamatan;
window.setInputGlobalMode = setInputGlobalMode;
window.setVerifyExample = setVerifyExample;
window.verifyKINAndShow = verifyKINAndShow;
window.verifyKIN = verifyKIN;
window.resetVerifyForm = resetVerifyForm;
window.viewDetail = viewDetail;
window.safeGenerateIDCard = safeGenerateIDCard;
window.editData = editData;
window.deleteData = deleteData;
window.goToPage = goToPage;
window.toggleBulkDeleteBtn = toggleBulkDeleteBtn;
window.showDuplicateDataInFilter = showDuplicateDataInFilter;
window.generateIDCard = generateIDCard;
