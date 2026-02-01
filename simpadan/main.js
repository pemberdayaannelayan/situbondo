// =====================================================
// KODE UTAMA APLIKASI SIMPADAN TANGKAP - VERSI 6.0 FINAL REVISI
// DENGAN ID CARD GENERATOR YANG DISEMPURNAKAN
// REVISI: PERBAIKAN FORMAT PDF DAN INTEGRASI SENSOR DATA
// TAMBAHAN: FITUR ALAMAT SEBELUM KECAMATAN
// REVISI ID CARD: PERUBAHAN FORMAT PROFESI DAN ALAT TANGKAP
// PERBAIKAN: TAMBAHAN INFORMASI VALIDASI DI QRCODE ID CARD
// PERBAIKAN TAMBAHAN: 
// 1. FITUR FILTER DATA GANDA YANG LEBIH KETAT
// 2. INPUT OTOMATIS HURUF KAPITAL UNTUK NAMA DAN ALAMAT
// 3. FITUR MEMUAT DATA PER KECAMATAN
// =====================================================

// Data ikan yang diperbarui dan disederhanakan (tanpa deskripsi detail)
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

// Array untuk kompatibilitas
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

// Mapping antara Jenis Kapal dan Alat Tangkap yang sesuai
const KAPAL_API_MAPPING = {
    "Perahu Jukung": ["Pancing", "Pancing Ulur", "Perangkap Bubu", "Jaring Insang (gill net)"],
    "Perahu Mayang": ["Pukat Tarik", "Pancing", "Jaring Insang (gill net)", "Jaring Angkat (lift net)"],
    "Perahu Slerek": ["Pukat Cincin", "Pukat Tarik", "Jaring Angkat (lift net)"],
    "Perahu Insang": ["Jaring Insang (gill net)"],
    "Perahu Jaring Angkat": ["Jaring Angkat (lift net)"],
    "Perahu Pancing": ["Pancing", "Pancing Ulur"],
    "Perahu Pukat Tarik": ["Pukat Tarik", "Pancing", "Jaring Insang (gill net)", "Jaring Angkat (lift net)"],
    "Lainnya": ["Pukat Cincin", "Pukat Tarik", "Pancing Ulur", "Jaring Insang (gill net)", "Jaring Angkat (lift net)", "Pancing", "Perangkap Bubu", "Lainnya"]
};

// Mapping antara Alat Tangkap dan Kategori Ikan yang bisa ditangkap
const API_FISH_MAPPING = {
    "Pukat Cincin": ["Pelagis Besar", "Pelagis Kecil"],
    "Pukat Tarik": ["Pelagis Kecil", "Pelagis Besar", "Demersal"],
    "Pancing Ulur": ["Demersal", "Pelagis Besar"],
    "Jaring Insang (gill net)": ["Demersal", "Pelagis Kecil", "Pelagis Besar"],
    "Jaring Angkat (lift net)": ["Pelagis Kecil", "Demersal"],
    "Pancing": ["Demersal", "Pelagis Kecil", "Pelagis Besar"],
    "Perangkap Bubu": ["Demersal", "Pelagis Kecil"],
    "Lainnya": ["Demersal", "Pelagis Kecil", "Pelagis Besar"]
};

// Mapping informasi alat tangkap (disingkat)
const API_INFO = {
    "Pukat Cincin": "Alat tangkap untuk ikan pelagis besar",
    "Pukat Tarik": "Alat tangkap untuk ikan pelagis kecil",
    "Pancing Ulur": "Alat tangkap untuk ikan dasar",
    "Jaring Insang (gill net)": "Alat tangkap untuk berbagai jenis ikan",
    "Jaring Angkat (lift net)": "Alat tangkap untuk ikan permukaan",
    "Pancing": "Alat tangkap tradisional",
    "Perangkap Bubu": "Alat tangkap berupa perangkap",
    "Lainnya": "Alat tangkap lainnya"
};

// Mapping informasi perahu (disingkat)
const KAPAL_INFO = {
    "Perahu Jukung": "Perahu tradisional kecil",
    "Perahu Mayang": "Perahu tradisional sedang",
    "Perahu Slerek": "Perahu khas Situbondo",
    "Perahu Insang": "Perahu untuk jaring insang",
    "Perahu Jaring Angkat": "Perahu untuk jaring angkat",
    "Perahu Pancing": "Perahu untuk pancing",
    "Perahu Pukat Tarik": "Perahu untuk pukat tarik",
    "Lainnya": "Jenis kapal lainnya"
};

const PROFESI_INFO = {
    "Nelayan Penuh Waktu": "Nelayan yang bekerja sebagai penangkap ikan sebagai mata pencaharian utama",
    "Nelayan Sambilan Utama": "Nelayan yang bekerja sebagai penangkap ikan sebagai pekerjaan sampingan utama",
    "Nelayan Sambilan Tambahan": "Nelayan yang bekerja sebagai penangkap ikan sebagai pekerjaan tambahan"
};

// Data wilayah Situbondo untuk dropdown
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

// Daftar desa untuk fitur Data Wilayah - DIPERBARUI dengan desa baru
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

// Daftar kecamatan untuk fitur Data Kecamatan
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

// --- GLOBAL VARIABLES ---
let appData = [];
let appSettings = {
    appName: 'SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP',
    appSubtitle: 'DINAS PERIKANAN KABUPATEN SITUBONDO',
    itemsPerPage: 5,
    privacyMode: true,
    securityCodeSensor: '97531',
    officialName: 'SUGENG PURWO PRIYANTO, S.E, M.M',
    officialNip: '19761103 200903 1 001',
    officialPosition: 'Kepala Bidang Pemberdayaan Nelayan'
};

// Variabel baru untuk fitur Data Wilayah
let currentWilayah = {
    mode: 'global', // 'global', 'desa', atau 'kecamatan'
    desaName: null,
    kecamatanName: null,
    fileName: 'reload.js'
};

let currentPage = 1;
let duplicateCheckInterval = null;
let currentDetailId = null; 
let verifyDataResult = null;
let currentFilter = {};
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
const loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
const modalDataWilayah = new bootstrap.Modal(document.getElementById('modalDataWilayah'));

const PROFESI_MAPPING = {
    "Penuh Waktu": "Nelayan Penuh Waktu",
    "Sambilan Utama": "Nelayan Sambilan Utama",
    "Sambilan Tambahan": "Nelayan Sambilan Tambahan"
};

// Ekspos variabel ke window untuk akses dari file lain
window.appData = appData;
window.appSettings = appSettings;
window.currentWilayah = currentWilayah;

// --- FUNGSI LOADING EFFECT ---
function showLoading(title = "Memproses Data", message = "Mohon tunggu, sistem sedang memproses permintaan Anda. Proses ini mungkin memerlukan waktu beberapa saat tergantung jumlah data yang tersedia.") {
    document.getElementById('loadingTitle').textContent = title;
    document.getElementById('loadingMessage').textContent = message;
    document.getElementById('loadingModal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Mencegah scroll saat loading
}

function hideLoading() {
    document.getElementById('loadingModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Mengembalikan scroll
}

// --- FUNGSI UTAMA ---
function getProfesiLabel(profesi) {
    return PROFESI_MAPPING[profesi] || profesi;
}

function migrateOldData() {
    appData.forEach(item => {
        if (PROFESI_MAPPING[item.profesi]) {
            item.profesi = PROFESI_MAPPING[item.profesi];
        }
        // Tambahkan field alamat jika belum ada
        if (!item.hasOwnProperty('alamat')) {
            item.alamat = '';
        }
    });
    saveData();
}

function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    document.getElementById('passwordHint').innerHTML = `Masukkan kode keamanan untuk mengakses sistem`;
}

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

function getFishIconClass(fishName) {
    const lower = fishName.toLowerCase();
    if (lower.includes('cumi')) return 'fa-ghost'; 
    if (lower.includes('kepiting')) return 'fa-spider'; 
    if (lower.includes('togek') || lower.includes('mendut')) return 'fa-star'; 
    return 'fa-fish';
}

// --- FUNGSI DATA WILAYAH YANG DISEMPURNAKAN ---
function initDataWilayah() {
    const container = document.getElementById('wilayahCardsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Tambahkan tab untuk memilih antara Desa dan Kecamatan
    const tabContainer = document.createElement('div');
    tabContainer.className = 'wilayah-tab-container mb-4';
    tabContainer.innerHTML = `
        <div class="btn-group w-100" role="group">
            <button type="button" class="btn btn-outline-primary active" id="tabDesa">
                <i class="fas fa-village"></i> Data Desa
            </button>
            <button type="button" class="btn btn-outline-success" id="tabKecamatan">
                <i class="fas fa-map"></i> Data Kecamatan
            </button>
        </div>
    `;
    
    container.appendChild(tabContainer);
    
    // Container untuk desa
    const desaContainer = document.createElement('div');
    desaContainer.id = 'desaContainer';
    desaContainer.className = 'wilayah-content-container active';
    
    // Container untuk kecamatan
    const kecamatanContainer = document.createElement('div');
    kecamatanContainer.id = 'kecamatanContainer';
    kecamatanContainer.className = 'wilayah-content-container';
    kecamatanContainer.style.display = 'none';
    
    container.appendChild(desaContainer);
    container.appendChild(kecamatanContainer);
    
    // Inisialisasi data desa
    initDesaCards();
    
    // Inisialisasi data kecamatan
    initKecamatanCards();
    
    // Event listener untuk tab
    document.getElementById('tabDesa').addEventListener('click', function() {
        document.getElementById('tabDesa').classList.add('active');
        document.getElementById('tabKecamatan').classList.remove('active');
        document.getElementById('desaContainer').style.display = 'block';
        document.getElementById('kecamatanContainer').style.display = 'none';
    });
    
    document.getElementById('tabKecamatan').addEventListener('click', function() {
        document.getElementById('tabKecamatan').classList.add('active');
        document.getElementById('tabDesa').classList.remove('active');
        document.getElementById('desaContainer').style.display = 'none';
        document.getElementById('kecamatanContainer').style.display = 'block';
    });
    
    // Update total desa dan kecamatan count
    document.getElementById('totalDesaCount').textContent = DESA_LIST.length;
    document.getElementById('totalKecamatanCount').textContent = KECAMATAN_LIST.length;
    
    // Update status indicator
    updateWilayahStatusIndicator();
}

// Fungsi untuk inisialisasi kartu desa
function initDesaCards() {
    const desaContainer = document.getElementById('desaContainer');
    if (!desaContainer) return;
    
    desaContainer.innerHTML = '';
    
    // Urutkan desa berdasarkan nama
    const sortedDesa = [...DESA_LIST].sort((a, b) => a.name.localeCompare(b.name));
    
    // Tambahkan kartu untuk setiap desa
    sortedDesa.forEach(desa => {
        const card = document.createElement('div');
        card.className = 'wilayah-card';
        
        // Cek jika ini desa yang sedang aktif
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

// Fungsi untuk inisialisasi kartu kecamatan
function initKecamatanCards() {
    const kecamatanContainer = document.getElementById('kecamatanContainer');
    if (!kecamatanContainer) return;
    
    kecamatanContainer.innerHTML = '';
    
    // Urutkan kecamatan berdasarkan nama
    const sortedKecamatan = [...KECAMATAN_LIST].sort((a, b) => a.name.localeCompare(b.name));
    
    // Tambahkan kartu untuk setiap kecamatan
    sortedKecamatan.forEach(kecamatan => {
        const card = document.createElement('div');
        card.className = 'wilayah-card kecamatan-card';
        
        // Cek jika ini kecamatan yang sedang aktif
        if (currentWilayah.mode === 'kecamatan' && currentWilayah.kecamatanName === kecamatan.name) {
            card.classList.add('active');
        }
        
        // Hitung jumlah desa dalam kecamatan ini
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

// Fungsi untuk mendapatkan kecamatan dari nama desa
function getKecamatanByDesa(desaName) {
    for (const kec in SITUBONDO_DATA) {
        if (SITUBONDO_DATA[kec].includes(desaName)) {
            return kec;
        }
    }
    return null;
}

// Fungsi untuk setup input data berdasarkan desa
function setupInputForDesa(desaName) {
    // Tutup modal Data Wilayah
    modalDataWilayah.hide();
    
    // Cari kecamatan dari desa ini
    const kecamatan = getKecamatanByDesa(desaName);
    
    // Set mode wilayah ke desa
    currentWilayah.mode = 'desa';
    currentWilayah.desaName = desaName;
    currentWilayah.kecamatanName = null;
    currentWilayah.fileName = DESA_LIST.find(d => d.name === desaName)?.file || `${desaName.toLowerCase()}.js`;
    
    // Update UI wilayah
    updateWilayahUI();
    updateWilayahStatusIndicator();
    
    // Buka tab Input Data
    document.getElementById('v-pills-input-tab').click();
    
    // Atur dropdown kecamatan dan desa
    if (kecamatan) {
        const kecSelect = document.getElementById('kecamatan');
        if (kecSelect) {
            kecSelect.value = kecamatan;
            // Trigger change event untuk memuat desa
            kecSelect.dispatchEvent(new Event('change'));
            
            // Setelah dropdown desa terisi, atur desa
            setTimeout(() => {
                const desaSelect = document.getElementById('desa');
                if (desaSelect) {
                    desaSelect.value = desaName;
                }
                
                // Focus ke field nama
                document.getElementById('nama').focus();
                
                showNotification(`Mode input data untuk Desa ${desaName} telah diaktifkan. Data yang diinput akan otomatis tersimpan untuk desa ini.`, 'success');
            }, 500);
        }
    } else {
        showNotification(`Desa ${desaName} tidak ditemukan dalam data kecamatan.`, 'warning');
    }
}

// Fungsi untuk setup input data berdasarkan kecamatan
function setupInputForKecamatan(kecamatanName) {
    // Tutup modal Data Wilayah
    modalDataWilayah.hide();
    
    // Set mode wilayah ke kecamatan
    currentWilayah.mode = 'kecamatan';
    currentWilayah.kecamatanName = kecamatanName;
    currentWilayah.desaName = null;
    currentWilayah.fileName = KECAMATAN_LIST.find(k => k.name === kecamatanName)?.file || `Kecamatan-${kecamatanName}.js`;
    
    // Update UI wilayah
    updateWilayahUI();
    updateWilayahStatusIndicator();
    
    // Buka tab Input Data
    document.getElementById('v-pills-input-tab').click();
    
    // Atur dropdown kecamatan
    const kecSelect = document.getElementById('kecamatan');
    if (kecSelect) {
        kecSelect.value = kecamatanName;
        // Trigger change event untuk memuat desa
        kecSelect.dispatchEvent(new Event('change'));
        
        // Focus ke field nama
        setTimeout(() => {
            document.getElementById('nama').focus();
            showNotification(`Mode input data untuk Kecamatan ${kecamatanName} telah diaktifkan. Data yang diinput akan otomatis tersimpan untuk kecamatan ini.`, 'success');
        }, 500);
    }
}

// Fungsi untuk memuat data berdasarkan desa
function loadDataByDesa(desaName, fileName) {
    if (confirm(`Anda akan memuat data dari Desa ${desaName}. Data saat ini akan digantikan. Lanjutkan?`)) {
        showLoading("Memuat Data Desa", `Sedang memproses data dari Desa ${desaName}. Mohon tunggu...`);
        
        // Reset currentWilayah
        currentWilayah.mode = 'desa';
        currentWilayah.desaName = desaName;
        currentWilayah.kecamatanName = null;
        currentWilayah.fileName = fileName;
        
        // Update UI
        updateWilayahUI();
        updateWilayahStatusIndicator();
        
        // Load data dari file JavaScript
        const script = document.createElement('script');
        script.src = fileName + '?t=' + new Date().getTime();
        
        script.onload = function() {
            console.log(`File ${fileName} berhasil dimuat`);
            
            // Beri waktu untuk pemrosesan
            setTimeout(() => {
                if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                    try {
                        // Ganti data dengan data baru dari desa
                        appData = window.SIMATA_BACKUP_DATA;
                        saveData();
                        renderDataTable();
                        updateDashboard();
                        
                        hideLoading();
                        showNotification(`Data dari Desa ${desaName} berhasil dimuat (${appData.length} data)`, 'success');
                        modalDataWilayah.hide();
                        
                        // Update filter desa
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

// Fungsi untuk memuat data berdasarkan kecamatan
function loadDataByKecamatan(kecamatanName, fileName) {
    if (confirm(`Anda akan memuat data dari Kecamatan ${kecamatanName}. Data saat ini akan digantikan. Lanjutkan?`)) {
        showLoading("Memuat Data Kecamatan", `Sedang memproses data dari Kecamatan ${kecamatanName}. Mohon tunggu...`);
        
        // Reset currentWilayah
        currentWilayah.mode = 'kecamatan';
        currentWilayah.kecamatanName = kecamatanName;
        currentWilayah.desaName = null;
        currentWilayah.fileName = fileName;
        
        // Update UI
        updateWilayahUI();
        updateWilayahStatusIndicator();
        
        // Load data dari file JavaScript
        const script = document.createElement('script');
        script.src = fileName + '?t=' + new Date().getTime();
        
        script.onload = function() {
            console.log(`File ${fileName} berhasil dimuat`);
            
            // Beri waktu untuk pemrosesan
            setTimeout(() => {
                if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                    try {
                        // Ganti data dengan data baru dari kecamatan
                        appData = window.SIMATA_BACKUP_DATA;
                        saveData();
                        renderDataTable();
                        updateDashboard();
                        
                        hideLoading();
                        showNotification(`Data dari Kecamatan ${kecamatanName} berhasil dimuat (${appData.length} data)`, 'success');
                        modalDataWilayah.hide();
                        
                        // Update filter desa
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

function setInputGlobalMode() {
    if (confirm('Anda akan beralih ke mode Input Global. Data saat ini akan tetap tersimpan. Lanjutkan?')) {
        currentWilayah.mode = 'global';
        currentWilayah.desaName = null;
        currentWilayah.kecamatanName = null;
        currentWilayah.fileName = 'reload.js';
        
        // Reload data dari reload.js
        handleReloadRepo();
        updateWilayahUI();
        updateWilayahStatusIndicator();
        showNotification('Mode Input Global diaktifkan. Data dari reload.js akan dimuat.', 'info');
    }
}

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

// Fungsi untuk update status indicator di modal
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

function updateFilterDesaOptions() {
    const filterDesa = document.getElementById('filterDesa');
    if (!filterDesa) return;
    
    // Dapatkan daftar desa unik dari data
    const desaSet = new Set();
    appData.forEach(d => {
        if (d.desa && d.desa.trim() !== '') {
            desaSet.add(d.desa);
        }
    });
    
    // Urutkan desa
    const desaList = Array.from(desaSet).sort();
    
    // Update opsi filter
    filterDesa.innerHTML = '<option value="">Semua Desa</option>';
    desaList.forEach(desa => {
        filterDesa.add(new Option(desa, desa));
    });
}

// --- FUNGSI BACKUP DATA YANG DISEMPURNAKAN (DENGAN LOADING EFFECT) ---
function backupData() {
    try {
        showLoading("Membuat Backup", "Sedang menyimpan data ke file backup. Mohon tunggu...");
        
        setTimeout(() => {
            let dataToBackup = appData;
            let backupFileName = 'reload.js';
            let backupContent = '';
            
            // Tentukan nama file berdasarkan mode
            if (currentWilayah.mode === 'desa' && currentWilayah.desaName) {
                backupFileName = currentWilayah.fileName;
                
                // Filter data hanya untuk desa yang dipilih
                dataToBackup = appData.filter(d => d.desa === currentWilayah.desaName);
                
                backupContent = `// DATA NELAYAN DESA ${currentWilayah.desaName.toUpperCase()}
// File: ${backupFileName}
// Dibuat: ${new Date().toLocaleString('id-ID')}
// Jumlah Data: ${dataToBackup.length}

window.SIMATA_BACKUP_DATA = ${JSON.stringify(dataToBackup, null, 2)};`;
            } else if (currentWilayah.mode === 'kecamatan' && currentWilayah.kecamatanName) {
                backupFileName = currentWilayah.fileName;
                
                // Filter data hanya untuk kecamatan yang dipilih
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
            
            // Buat dan download file
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

// --- FUNGSI RESTORE DATA YANG DISEMPURNAKAN (DENGAN LOADING EFFECT) ---
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
            
            // Coba parse sebagai JSON langsung
            try {
                restoredData = JSON.parse(content);
            } catch (jsonError) {
                // Jika bukan JSON, coba ekstrak dari JavaScript
                if (content.includes('SIMATA_BACKUP_DATA')) {
                    // Ekstrak data dari window.SIMATA_BACKUP_DATA
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
            
            // --- PERBAIKAN: VALIDASI DATA GANDA YANG LEBIH KETAT ---
            // Cek duplikasi NIK dan nama dalam data yang akan di-restore
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
                
                // Filter data duplikat dari restoredData
                const uniqueData = filterDuplicateData(restoredData);
                restoredData = uniqueData.filteredData;
                
                showNotification(
                    `${duplicateCheck.duplicateCount} data duplikat telah difilter. ` +
                    `Akan di-restore ${restoredData.length} data unik.`, 
                    'warning'
                );
            }
            
            // Merge data lama dengan data baru (hanya data unik)
            const existingData = appData;
            const mergedData = mergeDataWithDuplicateCheck(existingData, restoredData);
            
            const newCount = restoredData.length;
            const existingCount = existingData.length;
            const mergedCount = mergedData.length;
            const replacedCount = existingCount + newCount - mergedCount;
            const addedCount = mergedCount - existingCount;
            
            // Simpan data yang telah dimerge
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

//---------------------------------------------------------------sebagian code saya sengaja sembunyikan----------------------------------------------------------------------//



// --- FUNGSI PERBAIKAN: FILTER DATA GANDA YANG LEBIH KETAT ---
function showDuplicateDataInFilter() {
    // Hitung data duplikat berdasarkan NIK dan NAMA (uppercase)
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
    
    // Filter hanya yang memiliki lebih dari 1 data (duplikat)
    duplicateMap.forEach((items, key) => {
        if (items.length > 1) {
            duplicates.push(...items);
        }
    });
    
    if (duplicates.length === 0) {
        showNotification('Tidak ditemukan data NIK dan nama ganda. Data sudah bersih!', 'success');
        return;
    }
    
    // Set filter untuk menampilkan hanya data duplikat
    currentFilter = { duplicate: true };
    currentPage = 1;
    
    // Simpan data duplikat untuk ditampilkan
    window.duplicateDataForDisplay = duplicates;
    
    // Render ulang tabel
    renderDataTable();
    
    showNotification(`Ditemukan ${duplicates.length} data dengan NIK dan nama ganda`, 'warning');
}

// --- FUNGSI GENERATE PDF UNTUK DATA TERFILTER ---
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
        d.alamat || '-',
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
            
            // Judul utama
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
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

            // Tabel Data
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 15}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 45}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Alamat', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 50}},
                    {content: 'Desa', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kecamatan', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Nama Perahu', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
                    {content: 'Kode Validasi', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}}
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
                    4: {cellWidth: 50, halign: 'left'},
                    5: {cellWidth: 35, halign: 'left'},
                    6: {cellWidth: 35, halign: 'left'},
                    7: {cellWidth: 35, halign: 'left'},
                    8: {cellWidth: 30, halign: 'center'}
                }
            });

            // Setelah autoTable, kita atur footer
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

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

// --- FUNGSI PRINT DATA ---
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
            
            // Judul utama
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', pageWidth/2, 20, { align: 'center' });
            
            // Subjudul
            doc.setFontSize(12);
            doc.text('DINAS PERIKANAN KABUPATEN SITUBONDO', pageWidth/2, 26, { align: 'center' });

            // Slogan dengan warna oranye
            doc.setTextColor(246, 185, 59);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.text('"Situbondo Naik Kelas"', pageWidth/2, 32, { align: 'center' });

            // Garis bawah header dengan warna aksen
            doc.setDrawColor(246, 185, 59);
            doc.setLineWidth(1.5);
            doc.line(20, 38, pageWidth - 20, 38);

            // Judul Laporan dengan informasi filter
            doc.setTextColor(12, 36, 97);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
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

            // Tabel Data dengan kolom baru
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
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;

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

// --- INITIALIZATION ---
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

function initializeApp() {
    loadData();
    loadSettings();
    migrateOldData();
    
    // Inisialisasi Data Wilayah yang disempurnakan
    initDataWilayah();
    
    if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
        console.log("Data backup terdeteksi. Ready untuk merge/sync.");
    }

    // Inisialisasi dropdown kecamatan
    const kecSelect = document.getElementById('kecamatan');
    if (kecSelect) {
        kecSelect.innerHTML = `<option value="">Pilih Kecamatan</option>`;
        if (typeof SITUBONDO_DATA !== 'undefined') {
            Object.keys(SITUBONDO_DATA).sort().forEach(kec => kecSelect.add(new Option(kec, kec)));
        }
    }
    
    // Inisialisasi dropdown filter desa
    const allDesas = new Set();
    if (typeof SITUBONDO_DATA !== 'undefined') {
        Object.values(SITUBONDO_DATA).forEach(list => list.forEach(d => allDesas.add(d)));
    }
    const filterDesaSelect = document.getElementById('filterDesa');
    if (filterDesaSelect) {
        filterDesaSelect.innerHTML = `<option value="">Semua Desa</option>`;
        [...allDesas].sort().forEach(d => filterDesaSelect.add(new Option(d, d)));
    }
    
    // Inisialisasi dropdown filter alat tangkap
    const filterAlatTangkap = document.getElementById('filterAlatTangkap');
    if (filterAlatTangkap) {
        filterAlatTangkap.innerHTML = `<option value="">Semua</option>`;
        Object.keys(API_INFO).forEach(api => filterAlatTangkap.add(new Option(api, api)));
    }
    
    // Inisialisasi dropdown filter jenis kapal
    const filterJenisKapal = document.getElementById('filterJenisKapal');
    if (filterJenisKapal) {
        filterJenisKapal.innerHTML = `<option value="">Semua</option>`;
        Object.keys(KAPAL_INFO).forEach(kapal => filterJenisKapal.add(new Option(kapal, kapal)));
    }
    
    // Inisialisasi dropdown jenis kapal di form input
    const jenisKapalSelect = document.getElementById('jenisKapal');
    if (jenisKapalSelect) {
        jenisKapalSelect.innerHTML = '<option value="">Pilih Jenis...</option>';
        Object.keys(KAPAL_INFO).forEach(kapal => {
            jenisKapalSelect.add(new Option(kapal, kapal));
        });
    }
    
    // Inisialisasi dropdown alat tangkap di form input
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
    
    // Inisialisasi daftar ikan
    updateFishOptionsByAPI('');
    
    // Inisialisasi form pengaturan pejabat
    loadOfficialData();
    
    // --- PERBAIKAN: INISIALISASI INPUT OTOMATIS HURUF KAPITAL ---
    setupAutoUppercaseInputs();
}

// --- FUNGSI PERBAIKAN: SETUP INPUT OTOMATIS HURUF KAPITAL ---
function setupAutoUppercaseInputs() {
    // Input Nama - otomatis huruf kapital
    const namaInput = document.getElementById('nama');
    if (namaInput) {
        namaInput.addEventListener('input', function() {
            // Simpan posisi cursor
            const start = this.selectionStart;
            const end = this.selectionEnd;
            
            // Ubah ke huruf kapital
            this.value = this.value.toUpperCase();
            
            // Kembalikan posisi cursor
            this.setSelectionRange(start, end);
        });
        
        // Juga untuk event paste
        namaInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                this.value = this.value.toUpperCase();
            }, 10);
        });
    }
    
    // Input Alamat - otomatis huruf kapital
    const alamatInput = document.getElementById('alamat');
    if (alamatInput) {
        alamatInput.addEventListener('input', function() {
            // Simpan posisi cursor
            const start = this.selectionStart;
            const end = this.selectionEnd;
            
            // Ubah ke huruf kapital
            this.value = this.value.toUpperCase();
            
            // Kembalikan posisi cursor
            this.setSelectionRange(start, end);
        });
        
        // Juga untuk event paste
        alamatInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                this.value = this.value.toUpperCase();
            }, 10);
        });
    }
}

function loadOfficialData() {
    // Load data pejabat dari appSettings ke form
    const officialName = document.getElementById('officialName');
    const officialNip = document.getElementById('officialNip');
    const officialPosition = document.getElementById('officialPosition');
    
    if (officialName) officialName.value = appSettings.officialName || 'SUGENG PURWO PRIYANTO, S.E, M.M';
    if (officialNip) officialNip.value = appSettings.officialNip || '19761103 200903 1 001';
    if (officialPosition) officialPosition.value = appSettings.officialPosition || 'Kepala Bidang Pemberdayaan Nelayan';
}

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

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Password Toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('securityCode');
            const icon = document.getElementById('passwordToggleIcon');
            if (!passwordInput || !icon) return;
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.title = "Sembunyikan kode";
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.title = "Lihat kode";
            }
        });
    }

    // Login Form
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

    // Continue to Dashboard
    const continueBtn = document.getElementById('btnContinueDashboard');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            loginSuccessModal.hide();
            setTimeout(() => {
                welcomeModal.show();
            }, 300);
        });
    }

    // Welcome Modal Reload
    const welcomeReloadBtn = document.getElementById('btnWelcomeReload');
    if (welcomeReloadBtn) {
        welcomeReloadBtn.addEventListener('click', function() {
            welcomeModal.hide();
            handleReloadRepo();
        });
    }

    // No WhatsApp Button
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

    // Privacy Toggle
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

    // Kecamatan Change
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

    // Form Submit - DIPERBAIKI untuk validasi mode desa dan kecamatan
    const inputForm = document.getElementById('inputForm');
    if (inputForm) {
        inputForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Form Reset
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
                
                // Reset daftar ikan ke semua opsi
                updateFishOptionsByAPI('');
            }, 100);
        });
    }
    
    // Status Nelayan Change
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

    // Tahun Lahir Input
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

    // Generate Kode Button
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

    // Tombol Data Wilayah
    const btnDataWilayah = document.getElementById('btnDataWilayah');
    if (btnDataWilayah) {
        btnDataWilayah.addEventListener('click', function() {
            modalDataWilayah.show();
        });
    }

    // Tombol Input Global
    const btnInputGlobal = document.getElementById('btnInputGlobal');
    if (btnInputGlobal) {
        btnInputGlobal.addEventListener('click', setInputGlobalMode);
    }

    // Tombol Input Global di Modal
    const btnInputGlobalModal = document.getElementById('btnInputGlobalModal');
    if (btnInputGlobalModal) {
        btnInputGlobalModal.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    // Tombol Global Mode di modal
    const btnGlobalMode = document.getElementById('btnGlobalMode');
    if (btnGlobalMode) {
        btnGlobalMode.addEventListener('click', function() {
            modalDataWilayah.hide();
            setInputGlobalMode();
        });
    }

    // Search wilayah di modal
    const searchWilayah = document.getElementById('searchWilayah');
    if (searchWilayah) {
        searchWilayah.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.wilayah-card');
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
            
            const emptyState = document.getElementById('wilayahEmptyState');
            const desaContainer = document.getElementById('desaContainer');
            const kecamatanContainer = document.getElementById('kecamatanContainer');
            
            if (visibleCount === 0 && searchTerm.trim() !== '') {
                if (emptyState) emptyState.classList.remove('d-none');
                if (desaContainer) desaContainer.classList.add('d-none');
                if (kecamatanContainer) kecamatanContainer.classList.add('d-none');
            } else {
                if (emptyState) emptyState.classList.add('d-none');
                if (desaContainer) desaContainer.classList.remove('d-none');
                if (kecamatanContainer) kecamatanContainer.classList.remove('d-none');
            }
        });
    }

    // Verifikasi KIN
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

    // Refresh Halaman Button
    const refreshBtn = document.getElementById('btn-refresh-page');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshPage);
    }

    // Mobile Menu
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
    
    // Logout
    const logoutBtn = document.getElementById('v-pills-logout-tab');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm('Apakah Anda yakin ingin keluar? Sistem akan mengunduh data backup secara otomatis.')) {
                showLoading("Membuat Backup", "Sedang membuat backup data sebelum keluar. Mohon tunggu...");
                setTimeout(() => {
                    sessionStorage.removeItem('simata_session');
                    backupData();
                    setTimeout(() => {
                        hideLoading();
                        location.reload();
                    }, 2000);
                }, 500);
            }
        });
    }

    // Search and Filter
    const searchInput = document.getElementById('searchData');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1; // Reset ke halaman pertama saat mencari
            renderDataTable();
        });
    }
    
    // Filter & Validasi Data
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
    
    // Download PDF Terfilter
    const unduhFilteredPdfBtn = document.getElementById('btnUnduhFilteredPdf');
    if (unduhFilteredPdfBtn) unduhFilteredPdfBtn.addEventListener('click', generateFilteredPdf);
    
    // Download PDF Tabel Data
    const unduhTabelPdfBtn = document.getElementById('btnUnduhTabelPdf');
    if (unduhTabelPdfBtn) unduhTabelPdfBtn.addEventListener('click', generateTabelPdf);

    // Print and Export
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
    
    // Event listener untuk tombol Reload Data
    const reloadRepoBtn = document.getElementById('btn-reload-repo');
    if (reloadRepoBtn) {
        reloadRepoBtn.addEventListener('click', handleReloadRepo);
    }
    
    // Detail PDF
    const downloadDetailPdfBtn = document.getElementById('btnDownloadDetailPdf');
    if (downloadDetailPdfBtn) {
        downloadDetailPdfBtn.addEventListener('click', () => {
            downloadSinglePdf(currentDetailId);
        });
    }

    // Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            appSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
            
            const appSubtitleInput = document.getElementById('appSubtitle');
            const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
            
            if (appSubtitleInput) appSettings.appSubtitle = appSubtitleInput.value;
            
            // Baca nilai dari input number dengan validasi
            if (itemsPerPageSelect) {
                let itemsPerPage = parseInt(itemsPerPageSelect.value);
                if (isNaN(itemsPerPage) || itemsPerPage < 1) {
                    itemsPerPage = 5; // Default jika nilai tidak valid
                }
                appSettings.itemsPerPage = itemsPerPage;
            }
            
            saveSettings(); 
            updateAppIdentity(); 
            renderDataTable();
            showNotification('Pengaturan tersimpan! Nama instansi dan jumlah baris per halaman berhasil diperbarui.', 'success');
        });
    }

    // Form Pengaturan Pejabat
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

    // Sensor Code Form
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

// --- CORE LOGIC FUNCTIONS ---
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('inputForm');
    if (!form) return;
    
    // Validasi mode desa
    if (currentWilayah.mode === 'desa') {
        const selectedDesa = document.getElementById('desa').value;
        if (selectedDesa !== currentWilayah.desaName) {
            showNotification(`Anda harus memilih Desa ${currentWilayah.desaName} untuk input data di mode ini!`, 'error');
            return;
        }
    }
    
    // Validasi mode kecamatan
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
    
    // --- PERBAIKAN: VALIDASI DATA GANDA YANG LEBIH KETAT ---
    // Gunakan NIK dan NAMA (dalam uppercase) untuk pengecekan duplikasi
    const nama = document.getElementById('nama').value.toUpperCase();
    
    // Cari data dengan NIK dan NAMA yang sama
    const duplicateCheck = appData.find(d => 
        d.nik === nik && 
        d.nama.toUpperCase() === nama && 
        (!editId || d.id != editId) // Kecualikan data yang sedang diedit
    );
    
    if (duplicateCheck) {
        return showNotification(
            `GAGAL: Data dengan NIK ${nik} dan nama ${nama} sudah terdaftar dalam sistem!\n` +
            `Pemilik: ${duplicateCheck.nama} - ${duplicateCheck.desa}, ${duplicateCheck.kecamatan}`, 
            'error'
        );
    }

    const isOwner = document.getElementById('statusNelayan').value === 'Pemilik Kapal';
    
    // --- PERBAIKAN: SIMPAN NAMA DAN ALAMAT DALAM HURUF KAPITAL ---
    const formData = {
        id: editId || Date.now(),
        nama: nama, // Sudah dalam uppercase dari event listener
        nik: nik,
        whatsapp: whatsapp,
        profesi: document.getElementById('profesi').value,
        status: document.getElementById('statusNelayan').value,
        tahunLahir: document.getElementById('tahunLahir').value,
        usia: document.getElementById('usia').value,
        alamat: document.getElementById('alamat').value.toUpperCase(), // Konversi ke uppercase
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

function viewDetail(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    currentDetailId = id;
    
    // PERBAIKAN: Selalu gunakan maskData untuk NIK dan WhatsApp jika privacyMode aktif
    const displayNik = maskData(d.nik);
    const displayWa = maskData(d.whatsapp);
    
    document.getElementById('d_nama').innerText = d.nama;
    document.getElementById('d_nik').innerText = displayNik; 
    document.getElementById('d_usia').innerText = `${d.usia} Tahun (${d.tahunLahir})`;
    document.getElementById('d_wa').innerText = displayWa;
    document.getElementById('d_alamat').innerText = d.alamat || '-'; // TAMBAHAN: Tampilkan alamat
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
        
        // PERBAIKAN: Format teks judul agar tidak terpotong
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12); 
        doc.setFont('helvetica', 'bold');
        
        // Judul utama dibagi menjadi 2 baris
        const titleLines = doc.splitTextToSize('SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP', 180);
        let titleY = 18;
        
        // Tampilkan judul baris demi baris
        for (let i = 0; i < titleLines.length; i++) {
            doc.text(titleLines[i], 105, titleY + (i * 6), { align: 'center' });
        }
        
        // Hitung posisi Y setelah judul
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

        // PERBAIKAN: Gunakan maskData untuk NIK dan WhatsApp di PDF
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
        printLine('NIK', displayNik); // Gunakan NIK yang sudah disensor
        printLine('Tempat / Tgl Lahir', `${d.tahunLahir} (Usia: ${d.usia} Thn)`);
        printLine('Alamat Lengkap', d.alamat || '-'); // TAMBAHAN: Alamat
        printLine('Domisili', `${d.desa}, ${d.kecamatan}`);
        printLine('No. Handphone', displayWa); // Gunakan WhatsApp yang sudah disensor
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

function toggleBulkDeleteBtn() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length > 0;
    const btn = document.getElementById('bulkDeleteBtn');
    if(btn) {
        if(checked) btn.classList.remove('d-none'); else btn.classList.add('d-none');
    }
}

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
            currentPage = 1; // Reset ke halaman pertama setelah menghapus
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

function editData(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    const form = document.getElementById('inputForm');
    if (!form) return;
    
    form.setAttribute('data-edit-id', id);
    
    // Set nilai form (nama dan alamat tetap dalam format asli)
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
    
    // Set alat tangkap dan update daftar ikan
    const alatTangkap = document.getElementById('alatTangkap');
    if (alatTangkap) {
        alatTangkap.value = d.alatTangkap;
        updateFishOptionsByAPI(d.alatTangkap);
    }
    
    // Set ikan yang sudah dipilih setelah daftar diupdate
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
                    // Jika ikan tidak ada dalam daftar, maka tambahkan ke opsi "Lainnya"
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

function deleteData(id) {
    showLoading("Menghapus Data", "Sedang memproses penghapusan data. Mohon tunggu...");
    
    setTimeout(() => {
        const userCode = prompt("Masukkan KODE KEAMANAN SENSOR untuk menghapus data:");
        if(userCode === appSettings.securityCodeSensor) {
            if(confirm('Yakin menghapus data ini secara permanen?')) {
                appData = appData.filter(d => d.id != id);
                saveData(); 
                
                // Periksa apakah halaman saat ini akan kosong setelah penghapusan
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

function startDuplicateChecker() {
    checkGlobalDuplicates();
    duplicateCheckInterval = setInterval(checkGlobalDuplicates, 15000);
}

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

function saveData() { 
    localStorage.setItem('nelayanData', JSON.stringify(appData)); 
}

function saveSettings() { 
    appSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
    localStorage.setItem('nelayanSettings', JSON.stringify(appSettings)); 
}

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

function loadSettings() { 
    const s = localStorage.getItem('nelayanSettings'); 
    if(s) {
        try {
            const loadedSettings = JSON.parse(s);
            loadedSettings.appName = "SISTEM MANAJEMEN & PEMETAAN DATA PEMBERDAYAAN NELAYAN TANGKAP";
            if (!loadedSettings.securityCodeSensor) {
                loadedSettings.securityCodeSensor = '97531';
            }
            // Load data pejabat jika ada
            if (!loadedSettings.officialName) {
                loadedSettings.officialName = 'SUGENG PURWO PRIYANTO, S.E, M.M';
            }
            if (!loadedSettings.officialNip) {
                loadedSettings.officialNip = '19761103 200903 1 001';
            }
            if (!loadedSettings.officialPosition) {
                loadedSettings.officialPosition = 'Kepala Bidang Pemberdayaan Nelayan';
            }
            // Pastikan itemsPerPage valid (minimal 1)
            if (!loadedSettings.itemsPerPage || loadedSettings.itemsPerPage < 1) {
                loadedSettings.itemsPerPage = 5;
            }
            Object.assign(appSettings, loadedSettings);
        } catch (e) {
            console.error("Error loading settings:", e);
        }
    }
}

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

function sendDataToWhatsapp() {
    const message = `Yth. Administrator Dinas Perikanan Kabupaten Situbondo,\n\nBerikut kami lampirkan data pembaruan Sistem Satu Data Nelayan dari:\n*${appSettings.appSubtitle}*\n\nTanggal Laporan: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nTotal Data: ${appData.length} nelayan\n\nData terlampir dalam format reload.js\n\nSalam,\nOperator SIMPADAN TANGKAP`;
    const url = `https://wa.me/6287865614222?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// --- FUNGSI NOTIFIKASI ---
function showNotification(message, type = 'info') {
    const toast = document.querySelector('.notification-toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastTitle || !toastMessage) return;
    
    // Atur warna berdasarkan tipe
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

// --- FUNGSI TAMBAHAN UNTUK KOMPATIBILITAS ---
function safeGenerateIDCard(id) {
    // Gunakan fungsi generateIDCard yang ada di main.js
    generateIDCard(id);
}

// --- FUNGSI ID CARD YANG DISEMPURNAKAN (REVISI PERBAIKAN) ---
function generateIDCard(id) {
    const data = appData.find(item => item.id == id);
    if (!data) {
        alert('Data tidak ditemukan!');
        return;
    }

    // Tampilkan loading
    const loadingEl = document.getElementById('idcardLoading');
    if (loadingEl) loadingEl.style.display = 'flex';

    // Buat PDF dengan ukuran ID Card (85.6mm x 54mm) - ukuran standar ID Card
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54]
    });

    // PERBAIKAN: Background warna abu-abu muda untuk halaman
    doc.setFillColor(240, 240, 240); // Abu-abu muda (#f0f0f0)
    doc.rect(0, 0, 85.6, 54, 'F');

    // Area putih untuk ID Card dengan bayangan
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    
    // Tambahkan efek bayangan
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(3.5, 3.5, 80.6, 49, 3, 3, 'F');
    
    // Area utama ID Card (putih)
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(12, 36, 97); // Biru tua untuk border
    doc.setLineWidth(0.5);
    doc.roundedRect(2.5, 2.5, 80.6, 49, 3, 3, 'FD'); // FD: Fill and Draw
    
    // Header ID Card dengan warna biru muda (#4a69bd)
    doc.setFillColor(74, 105, 189);  // Biru muda (#4a69bd)
    doc.roundedRect(2.5, 2.5, 80.6, 10, 3, 3, 'F');
    
    // Teks header dengan warna putih
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('DINAS PERIKANAN', 42.8, 6, { align: 'center' });
    doc.text('KABUPATEN SITUBONDO', 42.8, 8.5, { align: 'center' });

    // Garis pemisah dengan warna aksen oranye
    doc.setDrawColor(246, 185, 59);
    doc.setLineWidth(0.5);
    doc.line(5, 11, 80, 11);

    // PERBAIKAN: Judul ID Card diturunkan agar tidak tumpang tindih
    doc.setTextColor(12, 36, 97);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('KARTU IDENTITAS NELAYAN TERDAFTAR', 42.8, 15, { align: 'center' }); // Diturunkan dari 14 ke 15

    // Garis dekoratif tipis di bawah judul
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(15, 16, 70, 16); // Diturunkan dari 15 ke 16

    // Container untuk data pribadi (kiri) - posisi lebih ke bawah
    const leftX = 5;
    const dataY = 20; // Diturunkan dari 18 ke 20
    const lineHeight = 3.2;

    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    
    // Fungsi untuk menampilkan data dengan label yang lebih rapi
    const drawData = (label, value, y, isImportant = false) => {
        doc.text(label + ':', leftX, y);
        doc.setFont('helvetica', isImportant ? 'bold' : 'normal');
        
        // Potong teks jika terlalu panjang
        let displayValue = value;
        if (value && value.length > 25) {
            displayValue = value.substring(0, 25) + '...';
        }
        
        doc.text(displayValue, leftX + 18, y);
        doc.setFont('helvetica', 'normal');
    };

    // Data pribadi dengan warna yang berbeda untuk label dan nilai
    doc.setTextColor(100, 100, 100); // Abu-abu untuk label
    
    // Baris 1: Nama Lengkap
    drawData('Nama Lengkap', data.nama, dataY, true);
    
    // Baris 2: NIK (dengan mask data)
    const displayNik = maskData(data.nik);
    drawData('NIK', displayNik, dataY + lineHeight);
    
    // Baris 3: TTL / Usia
    drawData('TTL / Usia', `${data.tahunLahir} (${data.usia} Tahun)`, dataY + lineHeight * 2);
    
    // Baris 4: Alamat
    doc.text('Alamat:', leftX, dataY + lineHeight * 3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97); // Biru untuk nilai
    
    const alamatText = data.alamat || `${data.desa}, ${data.kecamatan}`;
    if (alamatText.length > 25) {
        // Split alamat menjadi dua baris
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
    doc.setTextColor(100, 100, 100); // Kembali ke abu-abu untuk label berikutnya

    // REVISI: Baris 5: Domisili (menggantikan Profesi)
    doc.text('Domisili:', leftX, dataY + lineHeight * 4.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    doc.text(`${data.desa}, ${data.kecamatan}`, leftX + 18, dataY + lineHeight * 4.3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    // REVISI: Baris 6: Status Pekerjaan (menggantikan Alat Tangkap)
    doc.text('Status Pekerjaan:', leftX, dataY + lineHeight * 5.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    
    // Tentukan warna berdasarkan status
    if (data.status === 'Pemilik Kapal') {
        doc.setTextColor(41, 128, 185); // Biru untuk Pemilik Kapal
    } else {
        doc.setTextColor(39, 174, 96); // Hijau untuk Anak Buah Kapal
    }
    
    doc.text(data.status, leftX + 18, dataY + lineHeight * 5.3);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    // Baris 7: Kode Validasi dengan styling khusus
    const kodeY = dataY + lineHeight * 6.3;
    doc.text('Kode Validasi:', leftX, kodeY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(12, 36, 97);
    
    // Background untuk kode validasi
    doc.setFillColor(240, 245, 255);
    const textWidth = doc.getTextWidth(data.kodeValidasi || '-');
    doc.roundedRect(leftX + 18, kodeY - 1.5, textWidth + 2, 2.5, 1, 1, 'F');
    
    doc.text(data.kodeValidasi || '-', leftX + 19, kodeY);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');

    // QR Code (kanan) - ukuran lebih kecil dan profesional
    const qrSize = 16; // QR Code 16x16 mm (lebih kecil)
    const qrX = 85.6 - qrSize - 8; // Posisi X: kanan dengan margin 8mm
    const qrY = 20; // Posisi Y: sejajar dengan data (diturunkan dari 18 ke 20)

    // PERBAIKAN: Generate QR Code dengan informasi validasi dan link website
    const qrCodeData = `SIMPADAN TANGKAP - ${data.kodeValidasi || data.nik}\nNama: ${data.nama}\nNIK: ${data.nik}\nAlamat: ${data.alamat || data.desa}\nDesa: ${data.desa}\nStatus: ${data.status}\nValidasi: ${data.tanggalValidasi}\n\n=== INFORMASI VALIDASI ===\nData ini VALID dan terdaftar secara resmi\npada Sistem Satu Data Nelayan (SIMPADAN TANGKAP)\nDinas Perikanan Kabupaten Situbondo\n\nUntuk verifikasi keaslian ID Card ini,\nkunjungi:\nwww.dinasperikanansitubondo.com/simpadan`;
    
    // Buat container sementara untuk QR Code
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
            width: 160, // Resolusi lebih tinggi untuk kualitas baik
            height: 160,
            colorDark: "#0c2461", // Warna biru yang sesuai dengan tema
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        // Tunggu QR Code selesai dibuat
        setTimeout(() => {
            const qrCanvas = qrContainer.querySelector('canvas');
            if (qrCanvas) {
                const imgData = qrCanvas.toDataURL('image/png');
                
                // Border biru di sekitar QR Code
                doc.setDrawColor(12, 36, 97);
                doc.setLineWidth(0.3);
                doc.roundedRect(qrX - 0.5, qrY - 0.5, qrSize + 1, qrSize + 1, 1, 1);
                
                // Tambahkan QR Code ke PDF
                doc.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);
                
                // PERBAIKAN: Label di bawah QR Code diperbarui
                doc.setFontSize(4);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(100, 100, 100);
                doc.text('Pindai untuk verifikasi keaslian', qrX + qrSize/2, qrY + qrSize + 2, { align: 'center' });
            }

            // Hapus elemen sementara
            document.body.removeChild(qrContainer);

            // PERBAIKAN: Garis pemisah horizontal antara data dan footer - DINAIIKAN ke atas
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.2);
            const separatorY = 44; // Dinaikkan dari 45 ke 44 (lebih ke atas)
            doc.line(5, separatorY, 80, separatorY);

            // PERBAIKAN: Footer dengan informasi validasi - DINAIIKAN ke atas
            const footerY = separatorY + 2; // Dinaikkan dari separatorY + 3 ke separatorY + 2
            doc.setFontSize(4);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(150, 150, 150);
            
            // Perbaikan: Teks footer diatur dengan wrap agar tidak keluar
            const footerText1 = 'Kartu ini diterbitkan secara elektronik oleh Sistem Satu Data Nelayan (SIMPADAN TANGKAP)';
            const footerText2 = `Validasi: ${data.tanggalValidasi} | ${data.validator}`;
            
            // Split teks jika terlalu panjang
            const splitFooter1 = doc.splitTextToSize(footerText1, 75);
            doc.text(splitFooter1, 42.8, footerY, { align: 'center' });
            
            // Hitung tinggi teks pertama untuk posisi teks kedua
            const textHeight1 = splitFooter1.length * 1.5;
            doc.text(footerText2, 42.8, footerY + textHeight1 + 1, { align: 'center' });

            // Simpan PDF
            const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || data.nik.substring(0, 8)}.pdf`;
            doc.save(fileName);

            // Sembunyikan loading
            if (loadingEl) loadingEl.style.display = 'none';
            
            showNotification(`ID Card untuk ${data.nama} berhasil dibuat`, 'success');
        }, 500);
    } catch (error) {
        console.error("Error generating QR code:", error);
        
        // Jika QR code error, buat placeholder yang lebih rapi
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(qrX, qrY, qrSize, qrSize, 1, 1, 'F');
        doc.setFontSize(4);
        doc.setTextColor(180, 180, 180);
        doc.text('QR Code', qrX + qrSize/2, qrY + qrSize/2 - 1, { align: 'center' });
        doc.text('tidak tersedia', qrX + qrSize/2, qrY + qrSize/2 + 1.5, { align: 'center' });

        // PERBAIKAN: Garis pemisah horizontal
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        const separatorY = 44; // Dinaikkan dari 45 ke 44
        doc.line(5, separatorY, 80, separatorY);

        // PERBAIKAN: Footer - DINAIIKAN ke atas
        const footerY = separatorY + 2;
        doc.setFontSize(4);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        
        // Perbaikan: Teks footer diatur dengan wrap agar tidak keluar
        const footerText1 = 'Kartu ini diterbitkan secara elektronik oleh Sistem Satu Data Nelayan (SIMPADAN TANGKAP)';
        const footerText2 = `Validasi: ${data.tanggalValidasi} | ${data.validator}`;
        
        // Split teks jika terlalu panjang
        const splitFooter1 = doc.splitTextToSize(footerText1, 75);
        doc.text(splitFooter1, 42.8, footerY, { align: 'center' });
        
        // Hitung tinggi teks pertama untuk posisi teks kedua
        const textHeight1 = splitFooter1.length * 1.5;
        doc.text(footerText2, 42.8, footerY + textHeight1 + 1, { align: 'center' });

        // Simpan PDF
        const fileName = `IDCard_${data.nama.replace(/\s+/g, '_')}_${data.kodeValidasi || data.nik.substring(0, 8)}.pdf`;
        doc.save(fileName);

        // Sembunyikan loading
        if (loadingEl) loadingEl.style.display = 'none';
        
        showNotification(`ID Card untuk ${data.nama} berhasil dibuat (tanpa QR Code)`, 'success');
        
        // Hapus elemen sementara
        if (document.body.contains(qrContainer)) {
            document.body.removeChild(qrContainer);
        }
    }
}

// Ekspos fungsi generateIDCard ke window
window.generateIDCard = generateIDCard;

// --- INISIALISASI TAMBAHAN ---
// Pastikan fungsi-fungsi yang dipanggil dari event sudah tersedia di scope global
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
