// =====================================================
// FILE: main.js - FUNGSI UTAMA APLIKASI
// =====================================================

// Data ikan yang diperbarui dan dilengkapi
const FISH_CATEGORIES = {
    "Demersal": [
        {name: "Ikan Mangla (Pomadasys spp.)", latin: "Pomadasys spp.", desc: "Ikan demersal yang hidup di dasar berpasir, sering ditemukan di perairan tropis. Dagingnya putih dan gurih."},
        {name: "Ikan Sebelah (Pleuronectiformes)", latin: "Pleuronectiformes", desc: "Ikan pipih dengan kedua mata di satu sisi tubuh. Hidup di dasar laut berpasir atau berlumpur."},
        {name: "Ikan Lidah (Cynoglossus spp.)", latin: "Cynoglossus spp.", desc: "Bentuk pipih memanjang seperti lidah, hidup di dasar berlumpur. Populer untuk konsumsi lokal."},
        {name: "Ikan Petek (Leiognathus spp.)", latin: "Leiognathus spp.", desc: "Ikan kecil berwarna keperakan, hidup di dasar perairan dangkal. Sering digunakan sebagai umpan."},
        {name: "Ikan Duri (Arius spp.)", latin: "Arius spp.", desc: "Memiliki duri tajam di siripnya. Hidup di dasar berlumpur, dagingnya lembut bertekstur."},
        {name: "Ikan Kerapu (Epinephelus spp.)", latin: "Epinephelus spp.", desc: "Ikan demersal yang hidup di karang. Bernilai ekonomi tinggi dengan daging padat."},
        {name: "Ikan Kakap Merah (Lutjanus spp.)", latin: "Lutjanus spp.", desc: "Ikan demersal berwarna merah, hidup di karang. Salah satu ikan komersial penting."},
        {name: "Ikan Sembilang (Plotosus canius)", latin: "Plotosus canius", desc: "Ikan demersal bertubuh panjang, hidup di dasar berlumpur. Memiliki bisa pada duri siripnya."},
        {name: "Ikan Biji Nangka (Upeneus spp.)", latin: "Upeneus spp.", desc: "Ikan demersal kecil dengan sungut di mulut. Hidup di dasar berpasir."},
        {name: "Ikan Kurisi (Nemipterus spp.)", latin: "Nemipterus spp.", desc: "Ikan demersal dengan ekor bercabang, hidup di dasar berpasir. Warna tubuh merah muda."},
        {name: "Ikan Togek / Mendut (Star Triggerfish)", latin: "Abalistes stellaris", desc: "Ikan demersal dengan tubuh pipih dan sirip punggung yang khas. Hidup di dasar berpasir atau berlumpur, sering ditemukan di perairan tropis. Dikenal dengan pola bintang di tubuhnya."}
    ],
    "Pelagis Kecil": [
        {name: "Ikan Tembang (Sardinella gibbosa)", latin: "Sardinella gibbosa", desc: "Ikan pelagis kecil yang hidup dalam kawanan besar. Tubuh ramping, sering diawetkan."},
        {name: "Ikan Kembung Lelaki & Perempuan (Rastrelliger spp.)", latin: "Rastrelliger spp.", desc: "Ikan pelagis kecil dengan tubuh pipih. Salah satu ikan ekonomis penting di Indonesia."},
        {name: "Ikan Selar Kuning (Selaroides leptolepis)", latin: "Selaroides leptolepis", desc: "Ikan kecil berwarna kuning keperakan. Hidup dalam gerombolan di perairan pantai."},
        {name: "Ikan Layang (Decapterus spp.)", latin: "Decapterus spp.", desc: "Ikan pelagis kecil dengan tubuh memanjang. Sering digunakan untuk pindang dan kalengan."},
        {name: "Ikan Teri (Stolephorus spp.)", latin: "Stolephorus spp.", desc: "Ikan terkecil dalam kelompok pelagis. Biasanya dikeringkan atau diolah menjadi terasi."},
        {name: "Ikan Japuh (Caranx spp.)", latin: "Caranx spp.", desc: "Ikan pelagis kecil dengan tubuh agak tinggi. Hidup dalam kawanan di perairan pantai."},
        {name: "Ikan Lemuru (Sardinella lemuru)", latin: "Sardinella lemuru", desc: "Ikan pelagis kecil khusus di Selat Bali. Bahan utama industri pengalengan."},
        {name: "Ikan Bentong (Megalaspis cordyla)", latin: "Megalaspis cordyla", desc: "Ikan pelagis kecil dengan tubuh pipih. Cepat berenang dalam kawanan besar."},
        {name: "Ikan Banyar (Carangoides spp.)", latin: "Carangoides spp.", desc: "Ikan pelagis kecil dengan bentuk tubuh ramping. Hidup di perairan pantai."},
        {name: "Ikan Banyar Mata Besar (Megalaspis cordyla)", latin: "Megalaspis cordyla", desc: "Ikan pelagis kecil dengan mata besar. Aktif pada malam hari."}
    ],
    "Pelagis Besar": [
        {name: "Ikan Tongkol (Euthynnus affinis)", latin: "Euthynnus affinis", desc: "Ikan pelagis besar yang bermigrasi. Dagingnya padat, sering dibuat abon atau pindang."},
        {name: "Ikan Cakalang (Katsuwonus pelamis)", latin: "Katsuwonus pelamis", desc: "Ikan pelagis besar berwarna biru metalik. Bahan utama tuna kalengan."},
        {name: "Ikan Tenggiri (Scomberomorus commerson)", latin: "Scomberomorus commerson", desc: "Ikan pelagis besar dengan tubuh memanjang. Dagingnya lembut untuk pempek."},
        {name: "Ikan Tuna Sirip Kuning (Thunnus albacares)", latin: "Thunnus albacares", desc: "Ikan pelagis besar bernilai tinggi. Siripnya berwarna kuning cerah."},
        {name: "Ikan Tuna Mata Besar (Thunnus obesus)", latin: "Thunnus obesus", desc: "Ikan pelagis besar dengan mata besar. Hidup di perairan dalam."},
        {name: "Ikan Layur (Trichiurus lepturus)", latin: "Trichiurus lepturus", desc: "Ikan pelagis besar bertubuh panjang seperti pita. Dagingnya renyah."},
        {name: "Ikan Todak (Xiphias gladius)", latin: "Xiphias gladius", desc: "Ikan pelagis besar dengan moncong panjang seperti pedang. Perenang cepat."},
        {name: "Ikan Lemadang (Coryphaena hippurus)", latin: "Coryphaena hippurus", desc: "Ikan pelagis besar dengan warna tubuh cerah. Sering ditemukan di perairan hangat."},
        {name: "Ikan Marlin (Makaira spp.)", latin: "Makaira spp.", desc: "Ikan pelagis besar dengan moncong panjang. Target favorit pemancing olahraga."},
        {name: "Ikan Cucut (Carcharhinus limbatus)", latin: "Carcharhinus limbatus", desc: "Hiu permukaan dengan sirip hitam. Hidup di perairan pantai."}
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
            desc: fish.desc,
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

// Mapping informasi alat tangkap
const API_INFO = {
    "Pukat Cincin": "Alat tangkap berupa jaring besar berbentuk cincin yang ditarik mengelilingi gerombolan ikan. Efektif untuk menangkap ikan pelagis besar seperti tuna, cakalang, dan tongkol. Biasanya dioperasikan oleh kapal berukuran sedang hingga besar.",
    "Pukat Tarik": "Jaring berbentuk kerucut yang ditarik oleh kapal di permukaan atau pertengahan air. Cocok untuk menangkap ikan pelagis kecil seperti teri, lemuru, dan kembung. Memerlukan kapal dengan mesin yang kuat.",
    "Pancing Ulur": "Pancing dengan sistem ulur (handline) yang dioperasikan secara manual. Digunakan untuk menangkap ikan dasar seperti kerapu, kakap, dan ikan demersal lainnya. Cocok untuk perairan karang.",
    "Jaring Insang (gill net)": "Jaring yang dipasang diam di air, ikan yang berenang akan tersangkut insangnya. Cocok untuk berbagai jenis ikan mulai dari demersal hingga pelagis kecil. Efektif di perairan tenang.",
    "Jaring Angkat (lift net)": "Jaring berbentuk persegi yang diturunkan ke air lalu diangkat cepat. Efektif untuk ikan permukaan seperti teri dan ikan pelagis kecil. Biasanya menggunakan lampu untuk menarik ikan.",
    "Pancing": "Alat tangkap tradisional menggunakan mata pancing dan umpan. Fleksibel untuk berbagai jenis ikan. Termasuk pancing tonda, pancing rawai, dan pancing tangan.",
    "Perangkap Bubu": "Perangkap berbentuk kurungan untuk menjebak ikan. Umum untuk menangkap ikan karang, udang, dan kepiting. Terbuat dari bambu atau jaring.",
    "Lainnya": "Alat tangkap lain yang tidak termasuk dalam kategori di atas seperti sero, jermal, atau alat tradisional setempat."
};

// Mapping informasi perahu
const KAPAL_INFO = {
    "Perahu Jukung": "Perahu tradisional kayu kecil, umumnya tanpa mesin atau bermesin kecil (5-15 PK). Cocok untuk perairan tenang dan dekat pantai (0-5 mil). Biasanya digunakan untuk pancing, perangkap bubu, dan jaring insang. Kapasitas 1-3 orang.",
    "Perahu Mayang": "Perahu tradisional yang lebih besar dari jukung, biasanya bermesin tempel (15-40 PK). Untuk penangkapan di perairan sedang (5-12 mil). Cocok untuk pukat tarik, jaring insang, dan jaring angkat. Kapasitas 3-5 orang.",
    "Perahu Slerek": "Perahu khas Situbondo dengan bentuk ramping, biasanya menggunakan layar atau mesin kecil (10-30 PK). Untuk operasi dekat pantai (0-8 mil). Cocok untuk pukat cincin dan jaring angkat. Kapasitas 2-4 orang.",
    "Perahu Insang": "Perahu khusus untuk operasi jaring insang (gill net), dilengkapi dengan sistem pemasangan jaring. Mesin 20-50 PK. Untuk perairan pantai hingga sedang (5-15 mil). Kapasitas 2-3 orang.",
    "Perahu Jaring Angkat": "Perahu dengan sistem derek untuk mengoperasikan jaring angkat (lift net). Biasanya memiliki lampu untuk menarik ikan. Mesin 30-60 PK. Untuk perairan pantai (0-10 mil). Kapasitas 3-6 orang.",
    "Perahu Pancing": "Perahu yang didesain khusus untuk operasi pancing, baik handline maupun rawai. Dilengkapi dengan tempat pancing dan penyimpanan hasil. Mesin 15-40 PK. Untuk berbagai jenis perairan. Kapasitas 2-4 orang.",
    "Perahu Pukat Tarik": "Perahu yang dilengkapi dengan sistem penarik pukat (trawl net) untuk menangkap ikan di dasar laut. Biasanya berukuran sedang hingga besar dengan mesin yang kuat (40-100 PK). Untuk perairan sedang hingga lepas pantai (10-30 mil). Kapasitas 4-8 orang.",
    "Lainnya": "Jenis kapal lain yang tidak termasuk dalam kategori di atas seperti kapal motor besar, perahu fiberglass modern, atau kapal dengan spesifikasi khusus."
};

const PROFESI_INFO = {
    "Nelayan Penuh Waktu": "Nelayan yang bekerja sebagai penangkap ikan sebagai mata pencaharian utama dan tidak memiliki pekerjaan lain. Biasanya melaut setiap hari atau sesuai musim tangkap.",
    "Nelayan Sambilan Utama": "Nelayan yang bekerja sebagai penangkap ikan sebagai pekerjaan sampingan namun memberikan kontribusi pendapatan yang signifikan (lebih dari 50% pendapatan).",
    "Nelayan Sambilan Tambahan": "Nelayan yang bekerja sebagai penangkap ikan hanya pada musim tertentu atau sebagai pekerjaan tambahan (kurang dari 50% pendapatan)."
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
    { name: "Sumberejo", file: "sumberrejo.js" },
    { name: "Jangkar", file: "jangkar.js" },
    { name: "Gadingan", file: "gadingan.js" },
    { name: "Kumbangsari", file: "kumbangsari.js" },
    { name: "Paowan", file: "paowan.js" }
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
    mode: 'global', // 'global' atau 'desa'
    desaName: null,
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
const fishInfoModal = new bootstrap.Modal(document.getElementById('fishInfoModal'));
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
        
        // HAPUS TEKS NAMA FILE .js dari template kartu
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
        
        container.appendChild(card);
    });
    
    // Update total desa count
    document.getElementById('totalDesaCount').textContent = sortedDesa.length;
    
    // Update status indicator
    updateWilayahStatusIndicator();
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

function loadDataByDesa(desaName, fileName) {
    if (confirm(`Anda akan memuat data dari Desa ${desaName}. Data saat ini akan digantikan. Lanjutkan?`)) {
        showLoading("Memuat Data Desa", `Sedang memproses data dari Desa ${desaName}. Mohon tunggu...`);
        
        // Reset currentWilayah
        currentWilayah.mode = 'desa';
        currentWilayah.desaName = desaName;
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
            showNotification(`Maaf, Desa Tersebut Masih Belum Ada Data Di SIMPADAN TANGKAP`, 'error');
        };
        
        document.head.appendChild(script);
    }
}

function setInputGlobalMode() {
    if (confirm('Anda akan beralih ke mode Input Global. Data saat ini akan tetap tersimpan. Lanjutkan?')) {
        currentWilayah.mode = 'global';
        currentWilayah.desaName = null;
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
        indicator.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>Mode Desa: ${currentWilayah.desaName || '-'}</span>`;
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

// --- FUNGSI RELOAD DATA YANG DISEMPURNAKAN (DENGAN LOADING EFFECT) ---
function handleReloadRepo() {
    showLoading("Sinkronisasi Data", "Sedang melakukan sinkronisasi data dari server. Mohon tunggu, proses ini mungkin memerlukan waktu beberapa saat...");
    
    // Tentukan file yang akan dimuat berdasarkan mode
    const fileName = currentWilayah.mode === 'desa' ? currentWilayah.fileName : 'reload.js';
    
    // Coba load ulang file
    const script = document.createElement('script');
    script.src = fileName + '?t=' + new Date().getTime();
    
    script.onload = function() {
        console.log(`File ${fileName} berhasil dimuat ulang`);
        
        // Beri waktu untuk pemrosesan
        setTimeout(() => {
            if (typeof window.SIMATA_BACKUP_DATA !== 'undefined' && window.SIMATA_BACKUP_DATA) {
                try {
                    // Ganti data dengan data baru
                    appData = window.SIMATA_BACKUP_DATA;
                    saveData();
                    renderDataTable();
                    updateDashboard();
                    updateFilterDesaOptions();
                    
                    hideLoading();
                    showNotification(`Data berhasil disinkronisasi dari ${fileName} (${appData.length} data)`, 'success');
                    
                } catch (error) {
                    console.error('Reload error:', error);
                    hideLoading();
                    showNotification('Gagal memuat data. Format data tidak valid.', 'error');
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
        showNotification(`Maaf, Data Tidak Ditemukan Di SIMPADAN TANGKAP`, 'error');
    };
    
    document.head.appendChild(script);
}

// --- FUNGSI VERIFIKASI KIN ---
function verifyKIN(input) {
    if (!input || input.trim() === '') {
        return { success: false, message: "Masukkan Kode Validasi (KIN) atau NIK untuk verifikasi" };
    }
    
    const cleanInput = input.trim().toUpperCase();
    
    // Cari berdasarkan Kode Validasi (KIN)
    const byKodeValidasi = appData.find(d => d.kodeValidasi && d.kodeValidasi.toUpperCase() === cleanInput);
    if (byKodeValidasi) {
        return { 
            success: true, 
            data: byKodeValidasi,
            type: 'kin',
            message: "Data ditemukan berdasarkan Kode Validasi (KIN)"
        };
    }
    
    // Cari berdasarkan NIK
    const byNIK = appData.find(d => d.nik === cleanInput);
    if (byNIK) {
        return { 
            success: true, 
            data: byNIK,
            type: 'nik',
            message: "Data ditemukan berdasarkan NIK"
        };
    }
    
    // Coba tanpa prefix VLD-
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
    
    // Sembunyikan daftar semua KIN jika sedang ditampilkan
    if (allKinCard) allKinCard.style.display = 'none';
    
    if (result.success) {
        const data = result.data;
        verifyDataResult = data;
        
        // Update UI untuk hasil sukses
        card.className = 'card shadow-sm border-0 mb-4 verify-success';
        header.className = 'verify-result-header p-4 bg-success text-white';
        icon.innerHTML = '<i class="fas fa-check-circle fa-3x"></i>';
        title.textContent = 'VERIFIKASI BERHASIL';
        subtitle.textContent = result.message;
        
        // Isi konten
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
        
        // Tampilkan tombol aksi
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
        // Update UI untuk hasil gagal
        card.className = 'card shadow-sm border-0 mb-4 verify-error';
        header.className = 'verify-result-header p-4 bg-danger text-white';
        icon.innerHTML = '<i class="fas fa-times-circle fa-3x"></i>';
        title.textContent = 'VERIFIKASI GAGAL';
        subtitle.textContent = result.message;
        
        // Isi konten
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
        
        // Sembunyikan tombol aksi
        detailBtn.style.display = 'none';
        idCardBtn.style.display = 'none';
    }
    
    // Tampilkan kartu hasil
    card.style.display = 'block';
    
    // Scroll ke hasil dengan animasi smooth
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function setVerifyExample(type) {
    const input = document.getElementById('verifyInput');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    // Reset semua breadcrumb
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

function showAllKIN() {
    const allKinCard = document.getElementById('allKinCard');
    const tbody = document.getElementById('allKinTableBody');
    const totalKinCount = document.getElementById('totalKinCount');
    const verifyResultCard = document.getElementById('verifyResultCard');
    
    // Sembunyikan hasil verifikasi individual
    if (verifyResultCard) verifyResultCard.style.display = 'none';
    
    // Filter data yang memiliki kode validasi
    const dataWithKIN = appData.filter(d => d.kodeValidasi && d.kodeValidasi.trim() !== '');
    
    // Update count
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
    
    // Tampilkan kartu
    allKinCard.style.display = 'block';
    allKinCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function verifyKINAndShow(input) {
    const result = verifyKIN(input);
    displayVerifyResult(result);
    
    // Update input field
    document.getElementById('verifyInput').value = input;
}

function resetVerifyForm() {
    document.getElementById('verifyInput').value = '';
    document.getElementById('verifyInput').focus();
    document.getElementById('verifyResultCard').style.display = 'none';
    document.getElementById('allKinCard').style.display = 'none';
    
    // Reset breadcrumb ke pertama
    setVerifyExample('kin');
}

// Fungsi untuk menampilkan modal info ikan
function showFishInfoModal() {
    fishInfoModal.show();
}

// --- FUNGSI BARU: MAPPING KAPAL DAN ALAT TANGKAP ---
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
    
    // Update opsi alat tangkap
    alatTangkapSelect.innerHTML = '<option value="">Pilih Alat Penangkapan Ikan...</option>';
    availableAPIs.forEach(api => {
        const option = document.createElement('option');
        option.value = api;
        option.textContent = api;
        if (api === currentAPI) option.selected = true;
        alatTangkapSelect.appendChild(option);
    });
    
    // Tampilkan informasi mapping
    apiMappingInfo.innerHTML = `<strong>${jenisKapal}</strong> biasanya digunakan untuk: ${availableAPIs.join(', ')}`;
    apiMappingInfo.style.display = 'block';
    
    // Update daftar ikan jika alat tangkap sudah dipilih
    if (currentAPI && availableAPIs.includes(currentAPI)) {
        updateFishOptionsByAPI(currentAPI);
    } else {
        updateFishOptionsByAPI('');
    }
}

function updateFishOptionsByAPI(api) {
    const fishContainer = document.getElementById('fishCheckboxContainer');
    if (!fishContainer) return;
    
    fishContainer.innerHTML = '';
    
    let fishList = [];
    if (api && API_FISH_MAPPING[api]) {
        // Ambil ikan berdasarkan kategori yang sesuai
        API_FISH_MAPPING[api].forEach(category => {
            if (FISH_CATEGORIES[category]) {
                FISH_CATEGORIES[category].forEach(fish => {
                    fishList.push(fish.name);
                });
            }
        });
    } else {
        // Jika tidak ada API yang dipilih, tampilkan semua ikan
        for (const category in FISH_CATEGORIES) {
            FISH_CATEGORIES[category].forEach(fish => {
                fishList.push(fish.name);
            });
        }
    }
    
    // Tambahkan opsi "Lainnya"
    fishList.push("Lainnya");
    
    // Tampilkan checklist dengan informasi
    fishList.forEach(fish => {
        const id = 'fish_' + fish.replace(/\s/g, '');
        const fishInfo = FISH_DETAILS[fish] || {};
        const html = `
        <label class="fish-option-box">
            <input type="checkbox" class="form-check-input me-2 fish-checkbox" value="${fish}" id="${id}">
            <span>${fish}</span>
            ${fishInfo.latin ? `
            <div class="fish-info-box">
                <div class="fish-info-title">${fish}</div>
                <div class="fish-info-latin">${fishInfo.latin}</div>
                <div class="fish-info-desc">${fishInfo.desc || ''}</div>
            </div>
            ` : ''}
        </label>`;
        fishContainer.innerHTML += html;
    });
    
    // Event listener untuk "Lainnya"
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

// --- FUNGSI BARU: REFRESH HALAMAN ---
function refreshPage() {
    if (confirm('Apakah Anda yakin ingin me-refresh halaman? Semua perubahan yang belum disimpan akan hilang.')) {
        location.reload();
    }
}

// --- FUNGSI PAGINATION ---
function updatePagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / appSettings.itemsPerPage));
    const ul = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Validasi currentPage
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
    
    // Tombol pertama
    const first = document.createElement('li');
    first.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    first.innerHTML = `<a class="page-link" href="#" onclick="goToPage(1); return false;" title="Halaman Pertama">&laquo;</a>`;
    ul.appendChild(first);
    
    // Tombol sebelumnya
    const prev = document.createElement('li');
    prev.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prev.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage-1}); return false;" title="Halaman Sebelumnya">&lt;</a>`;
    ul.appendChild(prev);
    
    // Tampilkan beberapa halaman sekitar currentPage
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Pastikan kita selalu menampilkan 5 halaman jika memungkinkan
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
    
    // Tombol berikutnya
    const next = document.createElement('li');
    next.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    next.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPage+1}); return false;" title="Halaman Berikutnya">&gt;</a>`;
    ul.appendChild(next);
    
    // Tombol terakhir
    const last = document.createElement('li');
    last.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    last.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${totalPages}); return false;" title="Halaman Terakhir">&raquo;</a>`;
    ul.appendChild(last);
}

function goToPage(page) {
    currentPage = page;
    renderDataTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- FUNGSI GET FILTERED DATA UNTUK PDF ---
function getFilteredData() {
    const search = document.getElementById('searchData').value.toLowerCase();
    
    // Filter data berdasarkan pencarian dan filter
    let filtered = appData;
    
    // Terapkan filter jika ada
    if (Object.keys(currentFilter).length > 0) {
        filtered = filtered.filter(d => {
            const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
            const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
            const matchStatus = !currentFilter.status || d.status === currentFilter.status;
            
            // Filter jenis kapal hanya untuk pemilik kapal
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
    
    // Terapkan pencarian jika ada
    if (search) {
        filtered = filtered.filter(d => 
            d.nama.toLowerCase().includes(search) || 
            d.nik.includes(search) || 
            (d.namaKapal && d.namaKapal.toLowerCase().includes(search)) ||
            d.desa.toLowerCase().includes(search) ||
            d.kecamatan.toLowerCase().includes(search)
        );
    }
    
    return filtered;
}

// --- FUNGSI RENDER DATA TABLE ---
function renderDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    const search = document.getElementById('searchData').value.toLowerCase();
    
    // Filter data berdasarkan pencarian dan filter
    let filtered = appData;
    
    // Terapkan filter jika ada
    if (Object.keys(currentFilter).length > 0) {
        filtered = filtered.filter(d => {
            const matchDesa = !currentFilter.desa || d.desa === currentFilter.desa;
            const matchProfesi = !currentFilter.profesi || d.profesi === currentFilter.profesi;
            const matchStatus = !currentFilter.status || d.status === currentFilter.status;
            
            // Filter jenis kapal hanya untuk pemilik kapal
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
    
    // Terapkan pencarian jika ada
    if (search) {
        filtered = filtered.filter(d => 
            d.nama.toLowerCase().includes(search) || 
            d.nik.includes(search) || 
            (d.namaKapal && d.namaKapal.toLowerCase().includes(search)) ||
            d.desa.toLowerCase().includes(search) ||
            d.kecamatan.toLowerCase().includes(search)
        );
    }
    
    const nikCounts = {};
    appData.forEach(d => nikCounts[d.nik] = (nikCounts[d.nik] || 0) + 1);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / appSettings.itemsPerPage));
    
    // Validasi currentPage
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
    
    // Update informasi tabel
    const startItem = totalItems > 0 ? start + 1 : 0;
    const endItem = Math.min(start + appSettings.itemsPerPage, totalItems);
    document.getElementById('tableInfo').textContent = `Menampilkan ${startItem}-${endItem} dari ${totalItems} data`;
    
    // Update pagination
    updatePagination(totalItems);
    
    // Update tombol bulk delete
    toggleBulkDeleteBtn();
}

// --- FUNGSI FILTER ---
function applyFilter() {
    currentFilter = {
        desa: document.getElementById('filterDesa').value,
        profesi: document.getElementById('filterProfesi').value,
        status: document.getElementById('filterStatus').value,
        jenisKapal: document.getElementById('filterJenisKapal').value,
        alatTangkap: document.getElementById('filterAlatTangkap').value,
        usaha: document.getElementById('filterUsaha').value
    };
    
    currentPage = 1; // Reset ke halaman pertama saat filter diterapkan
    renderDataTable();
    
    // Hitung jumlah data yang difilter
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

function resetFilter() {
    // Reset semua dropdown filter
    document.getElementById('filterDesa').value = '';
    document.getElementById('filterProfesi').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterJenisKapal').value = '';
    document.getElementById('filterAlatTangkap').value = '';
    document.getElementById('filterUsaha').value = '';
    
    // Reset filter aktif
    currentFilter = {};
    currentPage = 1;
    
    // Render ulang tabel
    renderDataTable();
    
    showNotification('Filter direset, menampilkan semua data', 'info');
}

function showDuplicateDataInFilter() {
    // Hitung data duplikat
    const counts = {};
    appData.forEach(d => counts[d.nik] = (counts[d.nik] || 0) + 1);
    const duplicateData = appData.filter(d => counts[d.nik] > 1);
    
    if (duplicateData.length === 0) {
        showNotification('Tidak ditemukan data NIK ganda. Data sudah bersih!', 'success');
        return;
    }
    
    // Set filter untuk menampilkan hanya data duplikat
    currentFilter = { duplicate: true };
    currentPage = 1;
    
    // Render ulang tabel
    renderDataTable();
    
    showNotification(`Ditemukan ${duplicateData.length} data dengan NIK ganda`, 'warning');
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

// --- FUNGSI CORE LOGIC ---
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
    const duplicateCheck = appData.find(d => d.nik === nik);
    if (duplicateCheck && (!editId || duplicateCheck.id != editId)) {
        return showNotification('GAGAL: NIK sudah terdaftar dalam sistem!', 'error');
    }

    const isOwner = document.getElementById('statusNelayan').value === 'Pemilik Kapal';
    const formData = {
        id: editId || Date.now(),
        nama: document.getElementById('nama').value,
        nik: nik,
        whatsapp: whatsapp,
        profesi: document.getElementById('profesi').value,
        status: document.getElementById('statusNelayan').value,
        tahunLahir: document.getElementById('tahunLahir').value,
        usia: document.getElementById('usia').value,
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
    
    if (ownerFields) ownerFields.style.display = 'none';
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
    
    // Gunakan maskData untuk NIK dan WhatsApp jika privacyMode aktif
    const displayNik = appSettings.privacyMode ? maskData(d.nik) : d.nik;
    const displayWa = appSettings.privacyMode ? maskData(d.whatsapp) : d.whatsapp;
    
    document.getElementById('d_nama').innerText = d.nama;
    document.getElementById('d_nik').innerText = displayNik; 
    document.getElementById('d_usia').innerText = `${d.usia} Tahun (${d.tahunLahir})`;
    document.getElementById('d_wa').innerText = displayWa;
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

function editData(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    const form = document.getElementById('inputForm');
    if (!form) return;
    
    form.setAttribute('data-edit-id', id);
    
    ['nama', 'nik', 'whatsapp', 'profesi', 'tahunLahir', 'usia', 'alatTangkap', 'usahaSampingan', 'tanggalValidasi', 'validator', 'driveLink', 'kodeValidasi', 'keterangan']
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
    const counts = {};
    let hasDuplicate = false;
    for (const d of appData) {
        counts[d.nik] = (counts[d.nik] || 0) + 1;
        if (counts[d.nik] > 1) { hasDuplicate = true; break; }
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

    // Form Submit - DIPERBAIKI untuk validasi mode desa
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
                
                if (ownerFields) ownerFields.style.display = 'none';
                if (usiaInput) usiaInput.value = '';
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
                const desaName = card.querySelector('strong').textContent.toLowerCase();
                if (desaName.includes(searchTerm)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const emptyState = document.getElementById('wilayahEmptyState');
            const cardsContainer = document.getElementById('wilayahCardsContainer');
            
            if (visibleCount === 0 && searchTerm.trim() !== '') {
                emptyState.classList.remove('d-none');
                cardsContainer.classList.add('d-none');
            } else {
                emptyState.classList.add('d-none');
                cardsContainer.classList.remove('d-none');
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

// --- NOTIFICATION FUNCTION ---
function showNotification(message, type = 'info') {
    const toastEl = document.querySelector('.notification-toast');
    if (!toastEl) return;
    
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toastTitle && toastMessage) {
        toastTitle.textContent = type === 'success' ? 'Berhasil' : 
                                type === 'error' ? 'Error' : 
                                type === 'warning' ? 'Peringatan' : 'Info';
        
        toastMessage.textContent = message;
        
        // Set warna berdasarkan type
        const toastHeader = toastEl.querySelector('.toast-header');
        if (toastHeader) {
            if (type === 'success') {
                toastHeader.style.backgroundColor = '#d4edda';
                toastHeader.style.color = '#155724';
            } else if (type === 'error') {
                toastHeader.style.backgroundColor = '#f8d7da';
                toastHeader.style.color = '#721c24';
            } else if (type === 'warning') {
                toastHeader.style.backgroundColor = '#fff3cd';
                toastHeader.style.color = '#856404';
            } else {
                toastHeader.style.backgroundColor = '#d1ecf1';
                toastHeader.style.color = '#0c5460';
            }
        }
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
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
}
