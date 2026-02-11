// =====================================================
// KODE UTAMA APLIKASI SIMPADAN TANGKAP - VERSI 6.1 FINAL REVISI

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

// TAMBAHKAN FUNGSI UNTUK MENAMPILKAN GAMBAR INFORMASI JENIS IKAN
function showFishInfo(category) {
    // Cek apakah modal sudah ada
    let modal = document.getElementById('fishInfoModal');
    if (!modal) {
        // Buat modal baru
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
    
    // Update gambar berdasarkan kategori
    const modalImg = modal.querySelector('img');
    if (modalImg) {
        modalImg.src = FISH_CATEGORY_IMAGES[category];
        modalImg.alt = `Informasi Jenis Ikan ${category}`;
    }
    
    // Update judul modal
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Informasi Jenis Ikan - Kategori ${category}`;
    }
    
    // Tampilkan modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

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

// =====================================================
// REVISI LOGIN: DATA PENGGUNA SISTEM
// =====================================================
// Array pengguna yang dapat mengakses sistem
// Format: { username: '', password: '', fullName: '', role: '' }
// Dapat ditambahkan secara manual sesuai kebutuhan
const SYSTEM_USERS = [
    {
        username: 'BIDANGPN',
        password: '@12345',
        fullName: 'BIDANG PEMBERDAYAAN NELAYAN',
        role: 'Administrator'
    },
    {
        username: 'BIDANGPB',
        password: '@123456',
        fullName: 'BIDANG PENANGKAPAN IKAN',
        role: 'Operator'
    },
    {
        username: 'BIDANGP4',
        password: '@1234567',
        fullName: 'BIDANG PENGOLAHAN DAN PEMASARAN',
        role: 'Operator'
    },
    {
        username: 'BIDANGKESWAN',
        password: '@12345678',
        fullName: 'BIDANG KESEHATAN IKAN DAN LINGKUNGAN',
        role: 'Operator'
    }
    // Tambahkan pengguna lain di sini secara manual:
    // {
    //     username: 'NAMAPENGGUNA',
    //     password: 'PASSWORDNYA',
    //     fullName: 'NAMA LENGKAP PENGGUNA',
    //     role: 'Operator/Administrator'
    // },
];

// Fungsi untuk memvalidasi pengguna
function validateUser(username, password) {
    return SYSTEM_USERS.find(user => 
        user.username === username && user.password === password
    );
}

// Fungsi untuk menambahkan pengguna baru (secara manual di kode)
function addSystemUser(username, password, fullName, role = 'Operator') {
    // Cek apakah username sudah ada
    const existingUser = SYSTEM_USERS.find(user => user.username === username);
    if (existingUser) {
        return { success: false, message: 'Username sudah terdaftar' };
    }
    
    // Tambahkan pengguna baru
    SYSTEM_USERS.push({
        username: username,
        password: password,
        fullName: fullName,
        role: role
    });
    
    return { success: true, message: 'Pengguna berhasil ditambahkan' };
}

// Mapping antara Jenis Kapal dan Alat Tangkap yang sesuai
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

// Mapping antara Alat Tangkap dan Kategori Ikan yang bisa ditangkap
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

// Mapping informasi alat tangkap (disingkat)
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

// Mapping informasi perahu (disingkat)
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

// =====================================================
// REVISI LOGIN: VARIABEL UNTUK MANAJEMEN SESSION
// =====================================================
let currentUser = null; // Menyimpan informasi pengguna yang login

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
    officialPosition: 'Kepala Bidang Pemberdayaan Nelayan',
    // Password baru untuk keamanan menu - PERBAIKAN: Default sesuai permintaan
    passwordInputData: '666666',
    passwordDataNelayan: '999999',
    // Fitur baru: ON/OFF kode keamanan akses menu
    securityMenuInputDataEnabled: true,
    securityMenuDataNelayanEnabled: true
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

// Modal untuk autentikasi menu (akan dibuat secara dinamis)
let menuAuthModal = null;

const PROFESI_MAPPING = {
    "Penuh Waktu": "Nelayan Penuh Waktu",
    "Sambilan Utama": "Nelayan Sambilan Utama",
    "Sambilan Tambahan": "Nelayan Sambilan Tambahan"
};

// Status autentikasi menu
let menuAuthStatus = {
    inputData: false,
    dataNelayan: false
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

// =====================================================
// REVISI LOGIN: FUNGSI SHOW/HIDE PASSWORD UNTUK LOGIN
// =====================================================
function setupLoginPasswordToggle() {
    const passwordInput = document.getElementById('loginPassword');
    const toggleButton = document.getElementById('loginPasswordToggle');
    
    if (!passwordInput || !toggleButton) return;
    
    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Ganti icon
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

// --- FUNGSI SHOW/HIDE PASSWORD YANG DISEMPURNAKAN ---
function setupPasswordToggle(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);
    
    if (!passwordInput || !toggleButton) return;
    
    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Ganti icon
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

// --- FUNGSI KEAMANAN MENU BARU ---
function initMenuAuthModal() {
    // Cek apakah modal sudah ada
    if (!document.getElementById('menuAuthModal')) {
        // Buat modal autentikasi menu
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
        
        // Tambahkan modal ke body
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv);
        
        // Inisialisasi modal Bootstrap
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        // Setup event listener untuk tombol submit
        document.getElementById('menuAuthSubmit').addEventListener('click', handleMenuAuthSubmit);
        
        // Setup event listener untuk tombol batal
        document.getElementById('menuAuthCancelBtn').addEventListener('click', function() {
            // Arahkan ke menu Dashboard saat tombol batal diklik
            redirectToDashboard();
        });
        
        // PERBAIKAN: Tambahkan event listener untuk ketika modal ditutup (close button atau klik di luar)
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', function() {
                // Arahkan ke menu Dashboard saat modal ditutup
                redirectToDashboard();
            });
        }
        
        // Setup event listener untuk tombol show/hide password
        setupPasswordToggle('menuAuthPassword', 'menuAuthPasswordToggle');
        
        // Setup event listener untuk tekan Enter di input password
        document.getElementById('menuAuthPassword').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMenuAuthSubmit();
            }
        });
    } else {
        // Modal sudah ada, inisialisasi ulang
        menuAuthModal = new bootstrap.Modal(document.getElementById('menuAuthModal'));
        
        // PERBAIKAN: Pastikan event listener untuk modal hidden sudah ada
        const modalElement = document.getElementById('menuAuthModal');
        if (modalElement) {
            // Hapus event listener yang mungkin sudah ada
            modalElement.removeEventListener('hidden.bs.modal', redirectToDashboard);
            // Tambahkan kembali event listener
            modalElement.addEventListener('hidden.bs.modal', function() {
                redirectToDashboard();
            });
        }
    }
}

// PERBAIKAN: Fungsi untuk mengarahkan ke dashboard
function redirectToDashboard() {
    const dashboardTab = document.getElementById('v-pills-dashboard-tab');
    if (dashboardTab) {
        dashboardTab.click();
    }
}

function showMenuAuth(menuType, menuName) {
    // PERBAIKAN: Cek apakah kode keamanan untuk menu ini diaktifkan
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        // Jika kode keamanan dinonaktifkan, langsung buka menu
        document.getElementById('v-pills-input-tab').click();
        return;
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        // Jika kode keamanan dinonaktifkan, langsung buka menu
        document.getElementById('v-pills-data-tab').click();
        return;
    }
    
    // Simpan tipe menu yang diminta
    document.getElementById('menuAuthModal').setAttribute('data-menu-type', menuType);
    document.getElementById('menuAuthModal').setAttribute('data-menu-name', menuName);
    
    // Update judul modal
    document.getElementById('menuAuthModalLabel').textContent = `Autentikasi Menu ${menuName}`;
    
    // Reset input password
    document.getElementById('menuAuthPassword').value = '';
    document.getElementById('menuAuthPassword').type = 'password';
    
    // Reset icon toggle
    const toggleIcon = document.querySelector('#menuAuthPasswordToggle i');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
    
    // Tampilkan modal
    menuAuthModal.show();
    
    // Focus ke input password
    setTimeout(() => {
        document.getElementById('menuAuthPassword').focus();
    }, 500);
}

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
        // Autentikasi berhasil
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        
        // Simpan di sessionStorage agar bertahan selama sesi browser
        sessionStorage.setItem(`menu_auth_${menuType}`, 'true');
        
        // Tutup modal
        menuAuthModal.hide();
        
        // Tampilkan notifikasi
        showNotification(`Autentikasi berhasil! Mengakses menu ${menuName}`, 'success');
        
        // Buka menu yang dimaksud
        if (menuType === 'input') {
            // Buka tab Input Data
            document.getElementById('v-pills-input-tab').click();
        } else if (menuType === 'data') {
            // Buka tab Data Nelayan
            document.getElementById('v-pills-data-tab').click();
        }
    } else {
        // Password salah
        showNotification('Password salah! Silakan coba lagi.', 'error');
        document.getElementById('menuAuthPassword').value = '';
        document.getElementById('menuAuthPassword').focus();
    }
}

function checkMenuAuth(menuType) {
    // Cek apakah sudah login ke sistem
    const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
    if (!isSessionActive) {
        return false;
    }
    
    // PERBAIKAN: Cek apakah kode keamanan untuk menu ini diaktifkan
    if (menuType === 'input' && !appSettings.securityMenuInputDataEnabled) {
        return true; // Langsung izinkan akses jika kode keamanan dinonaktifkan
    }
    
    if (menuType === 'data' && !appSettings.securityMenuDataNelayanEnabled) {
        return true; // Langsung izinkan akses jika kode keamanan dinonaktifkan
    }
    
    // Cek apakah sudah terautentikasi untuk menu ini
    if (menuType === 'input' && menuAuthStatus.inputData) {
        return true;
    }
    if (menuType === 'data' && menuAuthStatus.dataNelayan) {
        return true;
    }
    
    // Cek sessionStorage
    const sessionAuth = sessionStorage.getItem(`menu_auth_${menuType}`);
    if (sessionAuth === 'true') {
        menuAuthStatus[menuType === 'input' ? 'inputData' : 'dataNelayan'] = true;
        return true;
    }
    
    return false;
}

function setupMenuAuthListeners() {
    // Event listener untuk menu Input Data
    const inputDataTab = document.getElementById('v-pills-input-tab');
    if (inputDataTab) {
        inputDataTab.addEventListener('click', function(e) {
            // Cek apakah sudah terautentikasi
            if (!checkMenuAuth('input')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('input', 'Input Data');
            }
        });
    }
    
    // Event listener untuk menu Data Nelayan
    const dataNelayanTab = document.getElementById('v-pills-data-tab');
    if (dataNelayanTab) {
        dataNelayanTab.addEventListener('click', function(e) {
            // Cek apakah sudah terautentikasi
            if (!checkMenuAuth('data')) {
                e.preventDefault();
                e.stopPropagation();
                showMenuAuth('data', 'Data Nelayan');
            }
        });
    }
}

function resetMenuAuth() {
    // Reset status autentikasi menu
    menuAuthStatus.inputData = false;
    menuAuthStatus.dataNelayan = false;
    
    // Hapus dari sessionStorage
    sessionStorage.removeItem('menu_auth_input');
    sessionStorage.removeItem('menu_auth_data');
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

// =====================================================
// REVISI LOGIN: FUNGSI DISPLAY CURRENT DATE DIPERBARUI
// =====================================================
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    document.getElementById('passwordHint').innerHTML = `Masukkan username dan password untuk mengakses sistem`;
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


//=============================================================code disembunyikan tidak ada perubahan=========================================================//





//=============================================================code disembunyikan tidak ada perubahan=========================================================//

// =====================================================
// REVISI LOGIN: INITIALIZATION DIPERBARUI
// =====================================================
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
            
            // Periksa autentikasi menu dari sessionStorage saat aplikasi dimuat
            if (sessionStorage.getItem('menu_auth_input') === 'true') {
                menuAuthStatus.inputData = true;
            }
            if (sessionStorage.getItem('menu_auth_data') === 'true') {
                menuAuthStatus.dataNelayan = true;
            }
        } else {
            setTimeout(() => {
                document.getElementById('loginModal').style.display = 'flex';
                // Set focus ke input username saat modal login muncul
                const usernameInput = document.getElementById('loginUsername');
                if (usernameInput) {
                    setTimeout(() => usernameInput.focus(), 300);
                }
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
    
    // Inisialisasi modal autentikasi menu
    initMenuAuthModal();
    
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
    
    // Setup event listener untuk autentikasi menu
    setupMenuAuthListeners();
    
    // Setup password toggle untuk semua input password
    setupAllPasswordToggles();
    
    // Setup password toggle untuk login form
    setupLoginPasswordToggle();
    
    // PERBAIKAN BARU: Inisialisasi toggle untuk kode keamanan menu
    initMenuSecurityToggles();
}

// --- FUNGSI BARU: INISIALISASI TOGGLE UNTUK KODE KEAMANAN MENU ---
function initMenuSecurityToggles() {
    // Load toggle state untuk menu Input Data
    const toggleInputData = document.getElementById('toggleSecurityMenuInputData');
    if (toggleInputData) {
        toggleInputData.checked = appSettings.securityMenuInputDataEnabled;
        updateMenuSecurityToggleUI('input', appSettings.securityMenuInputDataEnabled);
    }
    
    // Load toggle state untuk menu Data Nelayan
    const toggleDataNelayan = document.getElementById('toggleSecurityMenuDataNelayan');
    if (toggleDataNelayan) {
        toggleDataNelayan.checked = appSettings.securityMenuDataNelayanEnabled;
        updateMenuSecurityToggleUI('data', appSettings.securityMenuDataNelayanEnabled);
    }
    
    // Setup event listeners untuk toggle
    setupMenuSecurityToggleListeners();
}

// --- FUNGSI BARU: UPDATE UI TOGGLE KEAMANAN MENU ---
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

// --- FUNGSI BARU: SETUP EVENT LISTENERS UNTUK TOGGLE KEAMANAN MENU ---
function setupMenuSecurityToggleListeners() {
    // Toggle untuk menu Input Data
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
    
    // Toggle untuk menu Data Nelayan
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

// --- FUNGSI PERBAIKAN: SETUP SHOW/HIDE PASSWORD UNTUK SEMUA INPUT ---
function setupAllPasswordToggles() {
    // Setup untuk login form - REVISI: sudah dihandle oleh setupLoginPasswordToggle()
    
    // Setup untuk sensor code form (jika ada)
    const sensorForm = document.getElementById('sensorCodeForm');
    if (sensorForm) {
        // Tambahkan toggle button untuk current sensor code
        const currentCodeInput = document.getElementById('currentSensorCode');
        if (currentCodeInput) {
            const parent = currentCodeInput.parentElement;
            if (!parent.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                currentCodeInput.parentNode.insertBefore(wrapper, currentCodeInput);
                wrapper.appendChild(currentCodeInput);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = 'currentSensorCodeToggle';
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle('currentSensorCode', 'currentSensorCodeToggle');
            }
        }
        
        // Tambahkan toggle button untuk new sensor code
        const newCodeInput = document.getElementById('newSensorCode');
        if (newCodeInput) {
            const parent = newCodeInput.parentElement;
            if (!parent.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                newCodeInput.parentNode.insertBefore(wrapper, newCodeInput);
                wrapper.appendChild(newCodeInput);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = 'newSensorCodeToggle';
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle('newSensorCode', 'newSensorCodeToggle');
            }
        }
        
        // Tambahkan toggle button untuk confirm sensor code
        const confirmCodeInput = document.getElementById('confirmSensorCode');
        if (confirmCodeInput) {
            const parent = confirmCodeInput.parentElement;
            if (!parent.classList.contains('input-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-group';
                confirmCodeInput.parentNode.insertBefore(wrapper, confirmCodeInput);
                wrapper.appendChild(confirmCodeInput);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'btn btn-outline-secondary';
                toggleButton.type = 'button';
                toggleButton.id = 'confirmSensorCodeToggle';
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
                wrapper.appendChild(toggleButton);
                
                setupPasswordToggle('confirmSensorCode', 'confirmSensorCodeToggle');
            }
        }
    }
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

// =====================================================
// REVISI LOGIN: EVENT LISTENERS DIPERBARUI
// =====================================================
function setupEventListeners() {
    // Setup login password toggle - REVISI: sudah dihandle oleh setupLoginPasswordToggle()
    
    // Login Form - REVISI: menggunakan username dan password
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('loginButton');
            const spinner = document.getElementById('loginSpinner');
            const inputUsername = document.getElementById('loginUsername').value;
            const inputPassword = document.getElementById('loginPassword').value;
            
            if (!btn || !spinner) return;
            
            // Validasi input
            if (!inputUsername || !inputPassword) {
                showNotification('Harap isi username dan password!', 'error');
                return;
            }
            
            // Validasi pengguna
            const user = validateUser(inputUsername, inputPassword);
            
            if (!user) {
                showNotification('Username atau password salah! Periksa kembali atau hubungi administrator.', 'error');
                return;
            }
            
            btn.disabled = true;
            spinner.classList.remove('d-none');
            btn.innerHTML = 'MEMBUKA SISTEM... <span class="spinner-border spinner-border-sm ms-2"></span>';
            
            setTimeout(() => {
                // Simpan session dan informasi pengguna
                sessionStorage.setItem('simata_session', 'active');
                sessionStorage.setItem('simata_user', JSON.stringify(user));
                
                // Simpan ke variabel currentUser
                currentUser = user;
                
                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('appContent').style.display = 'block';
                initializeCharts();
                updateDashboard();
                renderDataTable();
                loginSuccessModal.show();
                btn.disabled = false;
                spinner.classList.add('d-none');
                btn.innerHTML = 'BUKA DASHBOARD';
                
                // Tampilkan notifikasi login berhasil
                showNotification(`Login berhasil! Selamat datang ${user.fullName} (${user.role})`, 'success');
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
//==================================================================code saya sembunyikan karena tidak ada perubahan==================================================================//


    


//========================================================code saya sembunyikan karena tidak ada perubahan==============================================================//
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
            // Load password untuk menu jika ada - PERBAIKAN: Default sesuai permintaan
            if (!loadedSettings.passwordInputData) {
                loadedSettings.passwordInputData = '666666';
            }
            if (!loadedSettings.passwordDataNelayan) {
                loadedSettings.passwordDataNelayan = '999999';
            }
            // Load pengaturan keamanan menu jika ada
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

// Ekspos fungsi-fungsi baru untuk login
window.validateUser = validateUser;
window.addSystemUser = addSystemUser;
window.currentUser = currentUser;

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
