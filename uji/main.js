// =====================================================
// MAIN.JS - KODE UTAMA APLIKASI SIMATA
// =====================================================

// Data ikan yang diperbarui dan dilengkapi - DITAMBAHKAN IKAN TOGEK
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

// Mapping informasi alat tangkap - DIPERBAIKI DAN DILENGKAPI
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

// Mapping informasi perahu - DIPERBAIKI DAN DITAMBAH PERAHU PUKAT TARIK
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

// Data wilayah Situbondo untuk dropdown (tetap diperlukan untuk form input)
const SITUBONDO_DATA = {
    "Arjasa": ["Arjasa", "Bayeman", "Curah Tatal", "Jatisari", "Kayumas", "Kedungdowo", "Ketowan", "Lamongan"],
    "Asembagus": ["Asembagus", "Awar-awar", "Bantal", "Gudang", "Kedunglo", "Kertosari", "Mojosari", "Parante", "Trigonco", "Wringin Anom"],
    "Banyuglugur": ["Banyuglugur", "Kalianget", "Kalisari", "Lubawang", "Selobanteng", "Telempong", "Tepos"],
    "Banyuputih": ["Banyuputih", "Sumberanyar", "Sumberejo", "Sumberwaru", "Wonorejo"],
    "Besuki": ["Besuki", "Blimbing", "Bloro", "Demung", "Jetis", "Kalimas", "Langkap", "Pesisir", "Sumberejo", "Widoropayung"],
    "Bungatan": ["Bletok", "Bungatan", "Mlandingan Wetan", "Pasir Putih", "Patemon", "Selowogo", "Sumbertengah"],
    "Jangkar": ["Agel", "Curah Kalak", "Gadingan", "Jangkar", "Kumbangsari", "Palangan", "Pesanggrahan", "Sopet"],
    "Jatibanteng": ["Curahsuri", "Jatibanteng", "Kembangsari", "Pategalan", "Patemon", "Semambung", "Sumberanyar", "Wringinanom"],
    "Kapongan": ["Curah Cottok Gebangan", "Kandang", "Kapongan", "Kesambi Rampak", "Landangan", "Peleyan", "Pokaan", "Seletreng", "Wonokoyo"],
    "Kendit": ["Balung", "Bugeman", "Kendit", "Klatakan", "Kukusan", "Rajekwesi", "Tambak Ukir"],
    "Mangaran": ["Mangaran", "Semiring", "Tanjung Glugur", "Tanjung Kamal", "Tanjung Pecinan", "Trebungan"],
    "Mlandingan": ["Alas Bayur", "Campoan", "Mlandingan Kulon", "Selomukti", "Sumberanyar", "Sumber Pinang", "Trebungan"],
    "Panarukan": ["Alasmalang", "Duwet", "Gelung", "Kilensari", "Paowan", "Peleyan", "Sumberkolak", "Wringinanom"],
    "Panji": ["Ardirejo", "Mimbaan", "Battal", "Curah Jeru", "Juglangan", "Kayu Putih", "Klampokan", "Panji Kidul", "Panji Lor", "Sliwung", "Tenggir", "Tokelan"],
    "Situbondo": ["Dawuhan", "Patokan", "Kalibagor", "Kotakan", "Olean", "Talkandang"],
    "Suboh": ["Buduan", "Cemara", "Dawuan", "Gunung Malang", "Gunung Putri", "Ketah", "Mojodungkol", "Suboh"],
    "Sumbermalang": ["Alastengah", "Baderan", "Kalirejo", "Plalangan", "Sumberargo", "Taman", "Tamankursi", "Tamansari", "Tlogosari"]
};

// --- GLOBAL VARIABLES ---
let appData = [];
let appSettings = {
    appName: 'SISTEM PEMETAAN DATA NELAYAN',
    appSubtitle: 'DINAS PERIKANAN KABUPATEN SITUBONDO',
    itemsPerPage: 5, // DIUBAH DARI 10 MENJADI 5 (DEFAULT)
    privacyMode: true,
    securityCodeSensor: '987654321',
    // TAMBAHAN: Data pejabat default
    officialName: 'SUGENG PURWO PRIYANTO, S.E, M.M',
    officialNip: '19761103 200903 1 001',
    officialPosition: 'Kepala Bidang Pemberdayaan Nelayan'
};
let currentPage = 1;
let duplicateCheckInterval = null;
let currentDetailId = null; 
let verifyDataResult = null;
let currentFilter = {}; // Variabel untuk menyimpan filter aktif
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
const loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
const fishInfoModal = new bootstrap.Modal(document.getElementById('fishInfoModal'));

const PROFESI_MAPPING = {
    "Penuh Waktu": "Nelayan Penuh Waktu",
    "Sambilan Utama": "Nelayan Sambilan Utama",
    "Sambilan Tambahan": "Nelayan Sambilan Tambahan"
};

// Ekspos variabel ke window untuk akses dari file lain
window.appData = appData;
window.appSettings = appSettings;

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

// Fungsi untuk mengecek apakah user adalah tamu
function isGuestUser() {
    return sessionStorage.getItem('simata_user_mode') === 'guest';
}

// Fungsi untuk menonaktifkan menu dan tombol untuk user tamu
function disableGuestFeatures() {
    if (!isGuestUser()) return;
    
    // Tampilkan badge mode tamu
    const userModeBadge = document.getElementById('userModeBadge');
    if (userModeBadge) {
        userModeBadge.style.display = 'inline-block';
    }
    
    // Nonaktifkan menu yang tidak boleh diakses tamu
    const restrictedMenus = [
        'v-pills-input-tab',
        'v-pills-backup-tab',
        'v-pills-settings-tab'
    ];
    
    restrictedMenus.forEach(menuId => {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = 'none';
        }
    });
    
    // Nonaktifkan tombol-tombol aksi di tabel
    const actionButtons = ['bulkDeleteBtn', 'btnUnduhTabelPdf', 'btnUnduhFilteredPdf', 'printPdfBtn', 
                          'exportExcelBtn', 'exportReloadJsBtn', 'sendWaBtn', 'backupDataBtn', 
                          'restoreDataBtn', 'btnDownloadDetailPdf'];
    
    actionButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.style.display = 'none';
        }
    });
    
    // Nonaktifkan form input
    const inputForm = document.getElementById('inputForm');
    if (inputForm) {
        inputForm.style.display = 'none';
        const inputCard = document.querySelector('#v-pills-input .card');
        if (inputCard) {
            inputCard.innerHTML = `
                <div class="card-header bg-white py-3 border-bottom">
                    <i class="fas fa-file-alt me-2 text-primary"></i> Mode Tamu
                </div>
                <div class="card-body p-5 text-center">
                    <i class="fas fa-user-lock fa-4x text-muted mb-3"></i>
                    <h5 class="text-muted">Akses Dibatasi</h5>
                    <p class="text-muted">Fitur input data hanya tersedia untuk pengguna terotorisasi.</p>
                    <button class="btn btn-outline-primary" onclick="location.reload()">
                        <i class="fas fa-sign-in-alt me-2"></i>Login Sebagai Admin
                    </button>
                </div>
            `;
        }
    }
    
    // Nonaktifkan menu pengaturan
    const settingsContent = document.querySelector('#v-pills-settings .card');
    if (settingsContent && isGuestUser()) {
        settingsContent.innerHTML = `
            <div class="card-header bg-white py-3 border-bottom">
                <i class="fas fa-cog me-2 text-primary"></i> Mode Tamu
            </div>
            <div class="card-body p-5 text-center">
                <i class="fas fa-user-lock fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Akses Dibatasi</h5>
                <p class="text-muted">Fitur pengaturan hanya tersedia untuk pengguna terotorisasi.</p>
                <button class="btn btn-outline-primary" onclick="location.reload()">
                    <i class="fas fa-sign-in-alt me-2"></i>Login Sebagai Admin
                </button>
            </div>
        `;
    }
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

// --- FUNGSI VERIFIKASI KIN YANG DISEMPURNAKAN ---
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
        
        // Sensor data jika privacy mode aktif
        const displayNik = appSettings.privacyMode ? maskData(data.nik, true) : data.nik;
        const displayWa = appSettings.privacyMode ? maskData(data.whatsapp, true) : data.whatsapp;
        
        // Isi konten
        content.innerHTML = `
            <div class="col-md-6">
                <div class="verify-result-item">
                    <div class="verify-result-label">Nama Lengkap</div>
                    <div class="verify-result-value fw-bold">${data.nama}</div>
                </div>
                <div class="verify-result-item">
                    <div class="verify-result-label">NIK</div>
                    <div class="verify-result-value font-monospace">${displayNik}</div>
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
        
        // Tampilkan tombol aksi (nonaktifkan untuk tamu)
        if (!isGuestUser()) {
            detailBtn.style.display = 'inline-block';
            detailBtn.onclick = () => {
                viewDetail(data.id);
                detailModal.show();
            };
            
            idCardBtn.style.display = 'inline-block';
            idCardBtn.onclick = () => {
                safeGenerateIDCard(data.id);
            };
        }
        
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
            // Sensor NIK jika privacy mode aktif
            const displayNik = appSettings.privacyMode ? maskData(d.nik, true) : d.nik;
            
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
                    <td class="font-monospace">${displayNik}</td>
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
                            ${!isGuestUser() ? `
                            <button class="btn btn-outline-success" onclick="safeGenerateIDCard('${d.id}')" title="ID Card">
                                <i class="fas fa-id-card"></i>
                            </button>
                            ` : ''}
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

// --- FUNGSI DETAIL DENGAN SENSOR ---
function viewDetail(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    currentDetailId = id;
    
    // Sensor NIK dan WhatsApp jika privacy mode aktif
    const displayNik = appSettings.privacyMode ? maskData(d.nik, true) : d.nik;
    const displayWa = appSettings.privacyMode ? maskData(d.whatsapp, true) : d.whatsapp;
    
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
    if(d.status === 'Pemilik Kapal') {
        document.getElementById('d_kapal_card').style.display = 'block';
        document.getElementById('d_namaKapal').innerText = d.namaKapal;
        document.getElementById('d_jenisKapal').innerText = d.jenisKapal;
    } else {
        document.getElementById('d_kapal_card').style.display = 'none';
    }
    document.getElementById('d_tgl_valid').innerText = d.tanggalValidasi;
    document.getElementById('d_validator').innerText = d.validator;
    
    // Nonaktifkan tombol unduh PDF untuk tamu
    const downloadBtn = document.getElementById('btnDownloadDetailPdf');
    if (isGuestUser() && downloadBtn) {
        downloadBtn.style.display = 'none';
    } else if (downloadBtn) {
        downloadBtn.style.display = 'inline-block';
    }
    
    detailModal.show();
}

// --- FUNGSI RENDER DATA TABLE YANG DISEMPURNAKAN ---
function renderDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    const search = document.getElementById('searchData').value.toLowerCase();
    const isGuest = isGuestUser();
    
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

            // Tombol aksi berdasarkan mode user
            let actionButtons = '';
            if (isGuest) {
                actionButtons = `
                    <div class="btn-group shadow-sm" role="group">
                        <button class="btn btn-sm btn-info text-white" onclick="viewDetail('${d.id}')" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                    </div>
                `;
            } else {
                actionButtons = `
                    <div class="btn-group shadow-sm" role="group">
                        <button class="btn btn-sm btn-info text-white" onclick="viewDetail('${d.id}')" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-warning text-white" onclick="editData('${d.id}')" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-sm btn-idcard" onclick="safeGenerateIDCard('${d.id}')" title="Cetak ID Card"><i class="fas fa-id-card"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteData('${d.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            }

            const row = `<tr class="${rowClass}">
                <td class="text-center">${!isGuest ? `<input type="checkbox" class="row-checkbox" value="${d.id}" onchange="toggleBulkDeleteBtn()">` : ''}</td>
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
                    ${actionButtons}
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
    
    // Update tombol bulk delete (nonaktif untuk tamu)
    if (!isGuest) {
        toggleBulkDeleteBtn();
    } else {
        document.getElementById('bulkDeleteBtn').style.display = 'none';
        document.getElementById('selectAllCheckbox').style.display = 'none';
    }
}

// --- FUNGSI PAGINATION YANG DISEMPURNAKAN ---
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
    
    // Tambahkan ellipsis di awal jika diperlukan
    if (startPage > 1) {
        const ellipsis1 = document.createElement('li');
        ellipsis1.className = 'page-item disabled';
        ellipsis1.innerHTML = `<span class="page-link">...</span>`;
        ul.appendChild(ellipsis1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>`;
        ul.appendChild(li);
    }
    
    // Tambahkan ellipsis di akhir jika diperlukan
    if (endPage < totalPages) {
        const ellipsis2 = document.createElement('li');
        ellipsis2.className = 'page-item disabled';
        ellipsis2.innerHTML = `<span class="page-link">...</span>`;
        ul.appendChild(ellipsis2);
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

// --- FUNGSI FILTER YANG DISEMPURNAKAN ---
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

// --- FUNGSI BARU: GENERATE PDF TABEL DATA NELAYAN YANG DIPERBAIKI ---
function generateTabelPdf() {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
    const filteredData = getFilteredData();
    
    if (filteredData.length === 0) {
        showNotification('Tidak ada data untuk dicetak!', 'error');
        return;
    }
    
    // Ambil data sesuai dengan halaman dan jumlah baris per halaman
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const end = start + appSettings.itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMATA-TABEL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan dengan warna biru muda (#4a69bd)
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd", // Biru muda
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
            doc.text('SISTEM INFORMASI PEMETAAN NELAYAN (SIMATA)', pageWidth/2, 20, { align: 'center' });
            
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
            doc.text('LAPORAN TABEL DATA NELAYAN', pageWidth/2, 48, { align: 'center' });
            
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

            // Siapkan data untuk tabel dengan kolom baru
            const tableRows = pageData.map((d, index) => [
                index + 1,
                d.nama,
                d.whatsapp === '00000000' || !d.whatsapp ? '-' : maskData(d.whatsapp),
                maskData(d.nik),
                d.desa,
                d.kecamatan,
                d.status === 'Pemilik Kapal' ? (d.namaKapal || '-') : '-',
                d.kodeValidasi || '-'
            ]);

            // Tabel Data
            const tableWidth = pageWidth - 40;
            const tableStartX = (pageWidth - tableWidth) / 2;

            doc.autoTable({
                head: [[
                    {content: 'No', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 15}},
                    {content: 'Nama', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 45}},
                    {content: 'Nomor HP', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 30}},
                    {content: 'NIK', styles: {fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', cellWidth: 35}},
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
                    4: {cellWidth: 35, halign: 'left'},
                    5: {cellWidth: 35, halign: 'left'},
                    6: {cellWidth: 35, halign: 'left'},
                    7: {cellWidth: 30, halign: 'center'}
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
            doc.text("SISTEM SATU DATA NELAYAN (SIMATA)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simata", leftX, leftY + 18);

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
            doc.text(`Dicetak dari SIMATA v5.5 - ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
            doc.text(`Data: ${start + 1}-${Math.min(end, filteredData.length)} dari ${filteredData.length} records | Baris/halaman: ${appSettings.itemsPerPage}`, pageWidth / 2, footerY + 5, { align: 'center' });

            // Simpan file PDF
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

// --- FUNGSI BARU: REFRESH HALAMAN ---
function refreshPage() {
    if (confirm('Apakah Anda yakin ingin me-refresh halaman? Semua perubahan yang belum disimpan akan hilang.')) {
        location.reload();
    }
}

// --- FUNGSI BACKUP DATA YANG DIPERBAIKI ---
function backupData(filename = 'reload.js') {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
    try {
        const encryptedData = btoa(JSON.stringify(appData));
        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID');
        const timeStr = now.toLocaleTimeString('id-ID');
        
        const backupContent = `/* PETUNJUK PENGGUNAAN RELOAD REPO:
1. Ini adalah file backup otomatis dari Aplikasi.
2. Jangan ubah kode di dalam tanda petik dua ("...") di bawah.
3. Upload file ini ke hosting tempat aplikasi berjalan untuk fitur Reload Data.

APP NAME : SISTEM PEMETAAN DATA NELAYAN
INSTANSI : DINAS PERIKANAN KABUPATEN SITUBONDO
TANGGAL  : ${dateStr}, ${timeStr}
*/

window.SIMATA_BACKUP_ENCRYPTED = '${encryptedData}';`;
        
        const blob = new Blob([backupContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(`Backup berhasil: ${filename}`, 'success');
    } catch (error) {
        console.error('Backup error:', error);
        showNotification('Gagal membuat backup. Silakan coba lagi.', 'error');
    }
}

// --- FUNGSI MERGE DATA UNTUK MENGHINDARI DUPLIKASI ---
function mergeData(existingData, newData) {
    // Buat map untuk data yang sudah ada dengan NIK sebagai key
    const dataMap = new Map();
    
    // Tambahkan data yang sudah ada ke map
    existingData.forEach(item => {
        dataMap.set(item.nik, item);
    });
    
    // Tambahkan atau timpa data baru (data baru akan menimpa data lama dengan NIK yang sama)
    newData.forEach(item => {
        dataMap.set(item.nik, item);
    });
    
    // Kembalikan sebagai array
    return Array.from(dataMap.values());
}

// --- FUNGSI RELOAD DATA YANG DIPERBAIKI ---
function handleReloadRepo() {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
    const reloadBtn = document.getElementById('btn-reload-repo');
    const spinner = document.getElementById('reloadSpinner');
    
    // Tampilkan spinner dan nonaktifkan tombol
    spinner.classList.add('active');
    reloadBtn.disabled = true;
    reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Memuat Data... <span class="spinner-border spinner-border-sm reload-spinner active" id="reloadSpinner"></span>';
    
    showNotification('Memulai sinkronisasi data dari server...', 'info');
    
    // Coba load ulang file reload.js
    const script = document.createElement('script');
    script.src = 'reload.js?t=' + new Date().getTime(); // Tambahkan timestamp untuk cache busting
    script.onload = function() {
        console.log('File reload.js berhasil dimuat ulang');
        
        // Beri waktu untuk pemrosesan
        setTimeout(() => {
            if (typeof window.SIMATA_BACKUP_ENCRYPTED !== 'undefined' && window.SIMATA_BACKUP_ENCRYPTED) {
                try {
                    const restoredData = JSON.parse(atob(window.SIMATA_BACKUP_ENCRYPTED));
                    
                    // Merge data lama dengan data baru (data baru menimpa data lama dengan NIK yang sama)
                    const existingData = appData;
                    const mergedData = mergeData(existingData, restoredData);
                    
                    // Hitung perubahan
                    const newCount = restoredData.length;
                    const existingCount = existingData.length;
                    const mergedCount = mergedData.length;
                    const replacedCount = existingCount + newCount - mergedCount;
                    const addedCount = mergedCount - existingCount;
                    
                    // Update data aplikasi
                    appData = mergedData;
                    saveData();
                    renderDataTable();
                    updateDashboard();
                    
                    // Tampilkan notifikasi yang informatif
                    let message = '';
                    if (replacedCount > 0 && addedCount > 0) {
                        message = `Data berhasil disinkronisasi: ${replacedCount} data diperbarui, ${addedCount} data baru ditambahkan`;
                    } else if (replacedCount > 0) {
                        message = `Data berhasil disinkronisasi: ${replacedCount} data diperbarui`;
                    } else if (addedCount > 0) {
                        message = `Data berhasil disinkronisasi: ${addedCount} data baru ditambahkan`;
                    } else {
                        message = 'Data sudah up-to-date. Tidak ada perubahan.';
                    }
                    
                    showNotification(message, 'success');
                    
                } catch (error) {
                    console.error('Reload error:', error);
                    showNotification('Gagal memuat data dari repository. Format data tidak valid.', 'error');
                }
            } else {
                showNotification('Tidak ada data repository yang tersedia untuk dimuat', 'warning');
            }
            
            // Reset tombol
            spinner.classList.remove('active');
            reloadBtn.disabled = false;
            reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Reload Data <span class="spinner-border spinner-border-sm reload-spinner" id="reloadSpinner"></span>';
        }, 500);
    };
    
    script.onerror = function() {
        console.error('Gagal memuat file reload.js');
        showNotification('Gagal memuat data dari server. Pastikan koneksi internet aktif.', 'error');
        
        // Reset tombol
        spinner.classList.remove('active');
        reloadBtn.disabled = false;
        reloadBtn.innerHTML = '<i class="fas fa-sync"></i> Reload Data <span class="spinner-border spinner-border-sm reload-spinner" id="reloadSpinner"></span>';
    };
    
    document.head.appendChild(script);
}

// --- FUNGSI RESTORE DATA YANG DIPERBAIKI ---
function restoreData() {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
    const fileInput = document.getElementById('restoreFileInput');
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            // Coba ekstrak data dari file JS
            let encryptedData = '';
            if (content.includes('SIMATA_BACKUP_ENCRYPTED')) {
                const match = content.match(/window\.SIMATA_BACKUP_ENCRYPTED\s*=\s*'([^']+)'/);
                if (match) encryptedData = match[1];
            } else if (content.startsWith('window.SIMATA_BACKUP_ENCRYPTED')) {
                const match = content.match(/='([^']+)'/);
                if (match) encryptedData = match[1];
            } else {
                // Coba parse sebagai JSON langsung
                try {
                    const restoredData = JSON.parse(content);
                    // Merge data lama dengan data baru
                    const existingData = appData;
                    const mergedData = mergeData(existingData, restoredData);
                    
                    const newCount = restoredData.length;
                    const existingCount = existingData.length;
                    const mergedCount = mergedData.length;
                    const replacedCount = existingCount + newCount - mergedCount;
                    const addedCount = mergedCount - existingCount;
                    
                    appData = mergedData;
                    saveData();
                    renderDataTable();
                    updateDashboard();
                    
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
                    
                    showNotification(message, 'success');
                    fileInput.value = '';
                    document.getElementById('restoreDataBtn').disabled = true;
                    return;
                } catch (jsonError) {
                    throw new Error('Format file tidak dikenali');
                }
            }
            
            if (!encryptedData) throw new Error('Data terenkripsi tidak ditemukan');
            
            const restoredData = JSON.parse(atob(encryptedData));
            
            // Merge data lama dengan data baru
            const existingData = appData;
            const mergedData = mergeData(existingData, restoredData);
            
            const newCount = restoredData.length;
            const existingCount = existingData.length;
            const mergedCount = mergedData.length;
            const replacedCount = existingCount + newCount - mergedCount;
            const addedCount = mergedCount - existingCount;
            
            if (newCount === 0) {
                showNotification('Tidak ada data baru untuk di-restore', 'warning');
                return;
            }
            
            appData = mergedData;
            saveData();
            renderDataTable();
            updateDashboard();
            
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
            
            showNotification(message, 'success');
            fileInput.value = '';
            document.getElementById('restoreDataBtn').disabled = true;
            
        } catch (error) {
            console.error('Restore error:', error);
            showNotification(`Gagal restore: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        showNotification('Gagal membaca file', 'error');
    };
    
    reader.readAsText(file);
}

// --- FUNGSI PRINT DATA YANG DIPERBAIKI DENGAN STRUKTUR YANG LEBIH BAIK ---
function printData() {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
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
    const printId = 'SIMATA-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan dengan warna biru muda (#4a69bd)
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd", // Biru muda
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
            doc.text('SISTEM INFORMASI PEMETAAN NELAYAN (SIMATA)', pageWidth/2, 20, { align: 'center' });
            
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
            doc.text("SISTEM SATU DATA NELAYAN (SIMATA)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simata", leftX, leftY + 18);

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
            doc.text(`Dicetak dari SIMATA v5.5 - ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
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

// --- FUNGSI GENERATE PDF UNTUK DATA TERFILTER DIPERBAIKI ---
function generateFilteredPdf() {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
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
        d.desa,
        d.kecamatan,
        d.status === 'Pemilik Kapal' ? (d.namaKapal || '-') : '-',
        d.kodeValidasi || '-'
    ]);

    // Hitung total dari data yang ditampilkan
    const totalCount = filteredData.length;
    const displayedCount = pageData.length;

    // Generate kode unik untuk setiap cetakan
    const printId = 'SIMATA-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Generate QR Code untuk tanda tangan dengan warna biru muda (#4a69bd)
    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `Dokumen Sah - Dinas Perikanan Kabupaten Situbondo\nNama: ${appSettings.officialName}\nJabatan: ${appSettings.officialPosition}\nNIP: ${appSettings.officialNip}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nID Dokumen: ${printId}`;
    
    try {
        new QRCode(document.getElementById("qr-right"), { 
            text: signatureText, 
            width: 120, 
            height: 120,
            colorDark: "#4a69bd", // Biru muda
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
            doc.text('SISTEM INFORMASI PEMETAAN NELAYAN (SIMATA)', pageWidth/2, 20, { align: 'center' });
            
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
                    4: {cellWidth: 35, halign: 'left'},
                    5: {cellWidth: 35, halign: 'left'},
                    6: {cellWidth: 35, halign: 'left'},
                    7: {cellWidth: 30, halign: 'center'}
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
            doc.text("SISTEM SATU DATA NELAYAN (SIMATA)", leftX, leftY + 8);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text("Dinas Perikanan Kabupaten Situbondo", leftX, leftY + 14);
            doc.setTextColor(230, 126, 34);
            doc.text("www.dinasperikanansitubondo.com/simata", leftX, leftY + 18);

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
            doc.text(`Dicetak dari SIMATA v5.5 - ${printTime} | ID Dokumen: ${printId}`, pageWidth / 2, footerY, { align: 'center' });
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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
        setupEventListeners();
        
        // Set tanggal validasi ke hari ini
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tanggalValidasi').value = today;
        
        // Cek session aktif
        const isSessionActive = sessionStorage.getItem('simata_session') === 'active';
        if (isSessionActive) {
            // Nonaktifkan fitur untuk tamu
            disableGuestFeatures();
            
            initializeCharts();
            updateDashboard();
            renderDataTable();
            
            // Tampilkan badge mode user
            const isGuest = isGuestUser();
            const userModeBadge = document.getElementById('userModeBadge');
            if (isGuest && userModeBadge) {
                userModeBadge.style.display = 'inline-block';
            }
        }

        if (typeof window.handleHashRouting === 'function') {
            window.handleHashRouting();
        }

    } catch (error) {
        console.error("Initialization Error:", error);
        alert("Terjadi kesalahan sistem saat memuat. Silakan refresh.");
    }
});

function initializeApp() {
    loadData();
    loadSettings();
    migrateOldData();
    
    if (typeof window.SIMATA_BACKUP_ENCRYPTED !== 'undefined' && window.SIMATA_BACKUP_ENCRYPTED) {
        console.log("Reload Repository detected. Ready to merge/sync.");
    }

    // Inisialisasi dropdown kecamatan
    const kecSelect = document.getElementById('kecamatan');
    kecSelect.innerHTML = `<option value="">Pilih Kecamatan</option>`;
    if (typeof SITUBONDO_DATA !== 'undefined') {
        Object.keys(SITUBONDO_DATA).sort().forEach(kec => kecSelect.add(new Option(kec, kec)));
    }
    
    // Inisialisasi dropdown filter desa
    const allDesas = new Set();
    if (typeof SITUBONDO_DATA !== 'undefined') {
        Object.values(SITUBONDO_DATA).forEach(list => list.forEach(d => allDesas.add(d)));
    }
    const filterDesaSelect = document.getElementById('filterDesa');
    filterDesaSelect.innerHTML = `<option value="">Semua Desa</option>`;
    [...allDesas].sort().forEach(d => filterDesaSelect.add(new Option(d, d)));
    
    // Inisialisasi dropdown filter alat tangkap
    const filterAlatTangkap = document.getElementById('filterAlatTangkap');
    filterAlatTangkap.innerHTML = `<option value="">Semua</option>`;
    Object.keys(API_INFO).forEach(api => filterAlatTangkap.add(new Option(api, api)));
    
    // Inisialisasi dropdown filter jenis kapal
    const filterJenisKapal = document.getElementById('filterJenisKapal');
    filterJenisKapal.innerHTML = `<option value="">Semua</option>`;
    Object.keys(KAPAL_INFO).forEach(kapal => filterJenisKapal.add(new Option(kapal, kapal)));
    
    // Inisialisasi dropdown jenis kapal di form input
    const jenisKapalSelect = document.getElementById('jenisKapal');
    jenisKapalSelect.innerHTML = '<option value="">Pilih Jenis...</option>';
    Object.keys(KAPAL_INFO).forEach(kapal => {
        jenisKapalSelect.add(new Option(kapal, kapal));
    });
    
    // Inisialisasi dropdown alat tangkap di form input
    const alatTangkapSelect = document.getElementById('alatTangkap');
    alatTangkapSelect.innerHTML = '<option value="">Pilih Alat Penangkapan Ikan...</option>';
    Object.keys(API_INFO).forEach(api => {
        alatTangkapSelect.add(new Option(api, api));
    });
    
    updateAppIdentity();
    updatePrivacyUI();
    startDuplicateChecker();
    setupInfoTooltips();
    setupProfesiInfo();
    
    // Inisialisasi daftar ikan
    updateFishOptionsByAPI('');
    
    // Inisialisasi form pengaturan pejabat
    loadOfficialData();
}

function loadOfficialData() {
    // Load data pejabat dari appSettings ke form
    document.getElementById('officialName').value = appSettings.officialName || 'SUGENG PURWO PRIYANTO, S.E, M.M';
    document.getElementById('officialNip').value = appSettings.officialNip || '19761103 200903 1 001';
    document.getElementById('officialPosition').value = appSettings.officialPosition || 'Kepala Bidang Pemberdayaan Nelayan';
}

function setupInfoTooltips() {
    const alatTangkapSelect = document.getElementById('alatTangkap');
    const apiInfoDiv = document.getElementById('apiInfo');
    
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

    const jenisKapalSelect = document.getElementById('jenisKapal');
    const kapalInfoDiv = document.getElementById('kapalInfo');
    
    jenisKapalSelect.addEventListener('change', function() {
        const selected = this.value;
        if (selected && KAPAL_INFO[selected]) {
            kapalInfoDiv.style.display = 'block';
            kapalInfoDiv.innerHTML = `<strong>${selected}:</strong> ${KAPAL_INFO[selected]}`;
            updateAlatTangkapByKapal();
        } else {
            kapalInfoDiv.style.display = 'none';
            document.getElementById('apiMappingInfo').style.display = 'none';
        }
    });
}

function setupProfesiInfo() {
    const profesiSelect = document.getElementById('profesi');
    const profesiHelp = document.getElementById('profesiHelp');
    
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

function updateAppIdentity() {
    appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
    document.querySelector('.app-title').textContent = appSettings.appName;
    document.getElementById('dynamicSubtitle').textContent = appSettings.appSubtitle;
    document.getElementById('itemsPerPageSelect').value = appSettings.itemsPerPage;
    document.getElementById('appName').value = appSettings.appName;
    document.getElementById('appSubtitle').value = appSettings.appSubtitle;
}

function updatePrivacyUI() {
    const toggle = document.getElementById('privacyToggle');
    const status = document.getElementById('privacyStatus');
    const sensorText = document.getElementById('sensorStatusText');
    
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

// --- EVENT LISTENERS YANG DISEMPURNAKAN ---
function setupEventListeners() {
    // No WhatsApp Button
    document.getElementById('btnNoWA').addEventListener('click', function() {
        const input = document.getElementById('whatsapp');
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

    // Privacy Toggle
    document.getElementById('privacyToggle').addEventListener('click', function(e) {
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

    // Kecamatan Change
    document.getElementById('kecamatan').addEventListener('change', function() {
        const selectedKec = this.value;
        const desaSelect = document.getElementById('desa');
        desaSelect.innerHTML = `<option value="">Pilih Desa / Kelurahan</option>`;
        if (selectedKec && SITUBONDO_DATA && SITUBONDO_DATA[selectedKec]) {
            desaSelect.disabled = false;
            SITUBONDO_DATA[selectedKec].sort().forEach(desa => desaSelect.add(new Option(desa, desa)));
        } else {
            desaSelect.disabled = true;
            desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
        }
    });

    // Form Submit
    document.getElementById('inputForm').addEventListener('submit', handleFormSubmit);
    
    // Form Reset
    document.getElementById('inputForm').addEventListener('reset', () => {
        setTimeout(() => {
            document.getElementById('ownerFields').style.display = 'none';
            document.getElementById('usia').value = '';
            document.getElementById('desa').disabled = true;
            document.getElementById('desa').innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
            document.getElementById('inputForm').removeAttribute('data-edit-id');
            document.getElementById('jenisIkanLainnya').style.display = 'none';
            const kv = document.getElementById('kodeValidasi');
            kv.value = '';
            kv.removeAttribute('readonly'); 
            const waInput = document.getElementById('whatsapp');
            waInput.removeAttribute('readonly');
            const btnWa = document.getElementById('btnNoWA');
            btnWa.classList.remove('active', 'btn-secondary');
            btnWa.classList.add('btn-outline-secondary');
            btnWa.textContent = "Tidak Ada";
            document.getElementById('apiInfo').style.display = 'none';
            document.getElementById('kapalInfo').style.display = 'none';
            document.getElementById('profesiHelp').innerHTML = '';
            document.getElementById('apiMappingInfo').style.display = 'none';
            
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('tanggalValidasi').value = today;
            
            // Reset daftar ikan ke semua opsi
            updateFishOptionsByAPI('');
        }, 100);
    });
    
    // Status Nelayan Change
    document.getElementById('statusNelayan').addEventListener('change', function() {
        const isOwner = this.value === 'Pemilik Kapal';
        const ownerFields = document.getElementById('ownerFields');
        ownerFields.style.display = isOwner ? 'block' : 'none';
        if(!isOwner) {
            document.getElementById('namaKapal').value = '';
            document.getElementById('jenisKapal').value = '';
            document.getElementById('kapalInfo').style.display = 'none';
            document.getElementById('apiMappingInfo').style.display = 'none';
        }
    });

    // Tahun Lahir Input
    document.getElementById('tahunLahir').addEventListener('input', function() {
        const year = parseInt(this.value);
        const currentYear = new Date().getFullYear();
        if(year && this.value.length === 4 && year <= currentYear && year >= 1900) {
            document.getElementById('usia').value = currentYear - year;
        }
    });

    // Generate Kode Button
    document.getElementById('generateKodeBtn').addEventListener('click', function() {
        const nik = document.getElementById('nik').value;
        const kodeInput = document.getElementById('kodeValidasi');
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

    // Verifikasi KIN
    document.getElementById('verifyBtn').addEventListener('click', function() {
        const input = document.getElementById('verifyInput').value;
        if (!input || input.trim() === '') {
            showNotification('Masukkan Kode Validasi (KIN) atau NIK untuk verifikasi', 'warning');
            return;
        }
        
        const result = verifyKIN(input);
        displayVerifyResult(result);
    });

    // Refresh Halaman Button
    document.getElementById('btn-refresh-page').addEventListener('click', refreshPage);

    // Mobile Menu
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('sidebarMenu');
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
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
    
    // Logout
    document.getElementById('v-pills-logout-tab').addEventListener('click', () => {
        if(confirm('Apakah Anda yakin ingin keluar? Sistem akan mengunduh data (reload.js) secara otomatis.')) {
            sessionStorage.removeItem('simata_session');
            sessionStorage.removeItem('simata_user_mode');
            if (!isGuestUser()) {
                backupData('reload.js');
            }
            setTimeout(() => location.reload(), 2000);
        }
    });

    // Search and Filter
    document.getElementById('searchData').addEventListener('input', function() {
        currentPage = 1; // Reset ke halaman pertama saat mencari
        renderDataTable();
    });
    
    // Filter & Validasi Data
    document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);
    document.getElementById('resetFilterBtn').addEventListener('click', resetFilter);
    document.getElementById('btnCekGanda').addEventListener('click', showDuplicateDataInFilter);
    document.getElementById('selectAllCheckbox').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
        toggleBulkDeleteBtn();
    });
    document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDeleteData);
    
    // Download PDF Terfilter
    document.getElementById('btnUnduhFilteredPdf').addEventListener('click', generateFilteredPdf);
    
    // Download PDF Tabel Data
    document.getElementById('btnUnduhTabelPdf').addEventListener('click', generateTabelPdf);

    // Print and Export
    document.getElementById('printPdfBtn').addEventListener('click', printData);
    document.getElementById('exportExcelBtn').addEventListener('click', () => exportData('xlsx'));
    document.getElementById('exportReloadJsBtn').addEventListener('click', () => backupData('reload.js'));
    document.getElementById('sendWaBtn').addEventListener('click', sendDataToWhatsapp);
    document.getElementById('backupDataBtn').addEventListener('click', () => backupData());
    document.getElementById('restoreFileInput').addEventListener('change', function() {
        document.getElementById('restoreDataBtn').disabled = !this.files.length;
    });
    document.getElementById('restoreDataBtn').addEventListener('click', restoreData);
    
    // Event listener untuk tombol Reload Data
    document.getElementById('btn-reload-repo').addEventListener('click', handleReloadRepo);
    
    // Detail PDF
    document.getElementById('btnDownloadDetailPdf').addEventListener('click', () => {
        downloadSinglePdf(currentDetailId);
    });

    // Settings Form
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
        appSettings.appSubtitle = document.getElementById('appSubtitle').value;
        
        // Baca nilai dari input number dengan validasi
        let itemsPerPage = parseInt(document.getElementById('itemsPerPageSelect').value);
        if (isNaN(itemsPerPage) || itemsPerPage < 1) {
            itemsPerPage = 5; // Default jika nilai tidak valid
        }
        appSettings.itemsPerPage = itemsPerPage;
        
        saveSettings(); 
        updateAppIdentity(); 
        renderDataTable();
        showNotification('Pengaturan tersimpan! Nama instansi dan jumlah baris per halaman berhasil diperbarui.', 'success');
    });

    // Form Pengaturan Pejabat
    document.getElementById('officialForm').addEventListener('submit', function(e) {
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

    // Sensor Code Form
    document.getElementById('sensorCodeForm').addEventListener('submit', function(e) {
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

    setupFloatingMenu();
}

function setupFloatingMenu() {
    const fabMain = document.getElementById('fabMainBtn');
    const container = document.getElementById('fabMenu');
    fabMain.addEventListener('click', () => {
        container.classList.toggle('open');
        const icon = fabMain.querySelector('i');
        if(container.classList.contains('open')){
            icon.classList.remove('fa-plus'); icon.classList.add('fa-times');
            fabMain.style.transform = "rotate(90deg)";
        } else {
            icon.classList.add('fa-plus'); icon.classList.remove('fa-times');
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
        document.getElementById(id).addEventListener('click', (e) => {
            e.preventDefault(); 
            document.getElementById(tabId).click(); 
            container.classList.remove('open');
        });
    }
    
    document.getElementById('fabReload').addEventListener('click', (e) => {
        e.preventDefault(); 
        handleReloadRepo();
    });
}

// --- CORE LOGIC FUNCTIONS ---
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('inputForm');
    const kodeVal = document.getElementById('kodeValidasi').value;
    if (!kodeVal || kodeVal.trim() === '') {
        showNotification('Anda WAJIB melakukan GENERATE KODE VALIDASI terlebih dahulu!', 'error');
        document.getElementById('generateKodeBtn').focus();
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
    document.getElementById('ownerFields').style.display = 'none';
    document.getElementById('desa').innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
    document.getElementById('desa').disabled = true;
    document.getElementById('jenisIkanLainnya').style.display = 'none';
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggalValidasi').value = today;
    
    document.getElementById('apiInfo').style.display = 'none';
    document.getElementById('kapalInfo').style.display = 'none';
    document.getElementById('profesiHelp').innerHTML = '';
    document.getElementById('apiMappingInfo').style.display = 'none';

    updateDashboard(); 
    renderDataTable();
    document.getElementById('v-pills-data-tab').click();
    checkGlobalDuplicates();
}

function toggleBulkDeleteBtn() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length > 0;
    const btn = document.getElementById('bulkDeleteBtn');
    if(checked) btn.classList.remove('d-none'); else btn.classList.add('d-none');
}

function bulkDeleteData() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    if(checkedBoxes.length === 0) return;
    
    const userCode = prompt(`Anda akan menghapus ${checkedBoxes.length} data.\nMasukkan KODE KEAMANAN SENSOR:`);
    if(userCode === appSettings.securityCodeSensor) {
        const idsToDelete = Array.from(checkedBoxes).map(cb => cb.value);
        appData = appData.filter(d => !idsToDelete.includes(d.id.toString()));
        saveData(); 
        currentPage = 1; // Reset ke halaman pertama setelah menghapus
        renderDataTable(); 
        updateDashboard();
        showNotification(`${idsToDelete.length} data berhasil dihapus`, 'success');
        document.getElementById('selectAllCheckbox').checked = false;
        checkGlobalDuplicates();
    } else if (userCode !== null) alert("Kode keamanan sensor SALAH!");
}

function editData(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    const form = document.getElementById('inputForm');
    form.setAttribute('data-edit-id', id);
    
    ['nama', 'nik', 'whatsapp', 'profesi', 'tahunLahir', 'usia', 'alatTangkap', 'usahaSampingan', 'tanggalValidasi', 'validator', 'driveLink', 'kodeValidasi', 'keterangan']
     .forEach(key => document.getElementById(key).value = d[key] || '');

    const waInput = document.getElementById('whatsapp');
    const btnWa = document.getElementById('btnNoWA');
    if(d.whatsapp === '00000000') {
        waInput.setAttribute('readonly', true);
        waInput.removeAttribute('required');
        btnWa.classList.add('active', 'btn-secondary');
        btnWa.textContent = "Batal";
    } else {
        waInput.removeAttribute('readonly');
        waInput.setAttribute('required', 'required');
        btnWa.classList.remove('active', 'btn-secondary');
        btnWa.textContent = "Tidak Ada";
    }

    document.getElementById('jenisIkanLainnya').style.display = 'none';
    document.getElementById('jenisIkanLainnya').value = '';
    
    // Set alat tangkap dan update daftar ikan
    document.getElementById('alatTangkap').value = d.alatTangkap;
    updateFishOptionsByAPI(d.alatTangkap);
    
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
                        inputLain.style.display = 'block';
                        inputLain.value = fish;
                    }
                }
            });
        }
    }, 100);

    const kecSelect = document.getElementById('kecamatan');
    kecSelect.value = d.kecamatan;
    kecSelect.dispatchEvent(new Event('change'));
    document.getElementById('desa').value = d.desa;

    const statusSelect = document.getElementById('statusNelayan');
    statusSelect.value = d.status;
    statusSelect.dispatchEvent(new Event('change'));

    if(d.status === 'Pemilik Kapal') {
        ['namaKapal', 'jenisKapal'].forEach(key => {
            document.getElementById(key).value = d[key] || '';
        });
        
        if(d.jenisKapal && KAPAL_INFO[d.jenisKapal]) {
            document.getElementById('kapalInfo').style.display = 'block';
            document.getElementById('kapalInfo').innerHTML = `<strong>${d.jenisKapal}:</strong> ${KAPAL_INFO[d.jenisKapal]}`;
            updateAlatTangkapByKapal();
        }
    }

    if(d.alatTangkap && API_INFO[d.alatTangkap]) {
        document.getElementById('apiInfo').style.display = 'block';
        document.getElementById('apiInfo').innerHTML = `<strong>${d.alatTangkap}:</strong> ${API_INFO[d.alatTangkap]}`;
    }

    document.getElementById('v-pills-input-tab').click();
    window.scrollTo(0,0);
}

function deleteData(id) {
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
            showNotification('Data berhasil dihapus', 'success');
            checkGlobalDuplicates();
        }
    } else if (userCode !== null) alert("Kode keamanan sensor SALAH!");
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
    document.getElementById('duplicateWarning').style.display = hasDuplicate ? 'block' : 'none';
}

function initializeCharts() {
    const profesiCtx = document.getElementById('profesiChart').getContext('2d');
    const kapalCtx = document.getElementById('kapalChart').getContext('2d');

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

    document.getElementById('totalPenerima').textContent = appData.length;
    const penuhWaktuCount = appData.filter(d => d.profesi === 'Nelayan Penuh Waktu').length;
    document.getElementById('totalPenuhWaktu').textContent = penuhWaktuCount;
    document.getElementById('totalPemilik').textContent = appData.filter(d => d.status === 'Pemilik Kapal').length;
    
    const sambilanUtamaCount = appData.filter(d => d.profesi === 'Nelayan Sambilan Utama').length;
    document.getElementById('totalSambilanUtama').textContent = sambilanUtamaCount;
    
    const sambilanTambahanCount = appData.filter(d => d.profesi === 'Nelayan Sambilan Tambahan').length;
    document.getElementById('totalSambilanTambahan').textContent = sambilanTambahanCount;
    
    const abkCount = appData.filter(d => d.status === 'Anak Buah Kapal').length;
    document.getElementById('totalABK').textContent = abkCount;

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
    appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
    localStorage.setItem('nelayanSettings', JSON.stringify(appSettings)); 
}

function loadData() { 
    const d = localStorage.getItem('nelayanData'); 
    if(d) appData = JSON.parse(d); 
}

function loadSettings() { 
    const s = localStorage.getItem('nelayanSettings'); 
    if(s) {
        const loadedSettings = JSON.parse(s);
        loadedSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
        if (!loadedSettings.securityCodeSensor) {
            loadedSettings.securityCodeSensor = '987654321';
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
    }
}

function exportData(type) {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
    if(appData.length === 0) return showNotification('Tidak ada data', 'error');
    const dataToExport = appData.map(d => ({
        ...d, nik: maskData(d.nik), whatsapp: maskData(d.whatsapp)
    }));
    const finalData = dataToExport.map(d => ({ ...d, NIK: `'${d.nik}`, WhatsApp: `'${d.whatsapp}` }));
    if(type === 'xlsx') {
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(finalData), "Data Nelayan");
        XLSX.writeFile(wb, `Nelayan_${appSettings.appSubtitle.slice(0,10)}_${Date.now()}.xlsx`);
        showNotification('Ekspor Excel berhasil.', 'success');
    }
}

function sendDataToWhatsapp() {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
    const message = `Yth. Administrator Dinas Perikanan Kabupaten Situbondo,\n\nBerikut kami lampirkan data pembaruan Sistem Satu Data Nelayan dari:\n*${appSettings.appSubtitle}*\n\nTanggal Laporan: ${new Date().toLocaleDateString('id-ID')}\nTotal Data: ${appData.length} Records\n\nFile lampiran (reload.js) telah kami sertakan pada pesan ini untuk proses sinkronisasi data.\n\nTerima Kasih.`;
    const url = `https://wa.me/6287865614222?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Fungsi untuk generate ID Card dengan error handling
function safeGenerateIDCard(id) {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
    const loadingEl = document.getElementById('idcardLoading');
    
    try {
        const d = appData.find(item => item.id == id);
        if(!d) {
            showNotification('Data nelayan tidak ditemukan!', 'error');
            return;
        }
        
        loadingEl.classList.add('active');
        
        if (typeof window.generateSimataIDCard === 'function') {
            setTimeout(() => {
                try {
                    window.generateSimataIDCard(d);
                } catch (error) {
                    console.error('Error in generateSimataIDCard:', error);
                    showNotification('Gagal membuat ID Card. Silakan coba lagi.', 'error');
                } finally {
                    loadingEl.classList.remove('active');
                }
            }, 100);
        } else {
            showNotification('Fitur ID Card sedang dimuat...', 'info');
            setTimeout(() => {
                if (typeof window.generateSimataIDCard === 'function') {
                    window.generateSimataIDCard(d);
                } else {
                    downloadSinglePdf(id);
                    showNotification('ID Card tidak tersedia, mengunduh PDF detail sebagai ganti.', 'warning');
                }
                loadingEl.classList.remove('active');
            }, 1000);
        }
    } catch (error) {
        console.error('Error in safeGenerateIDCard:', error);
        showNotification('Gagal membuat ID Card, coba lagi!', 'error');
        loadingEl.classList.remove('active');
    }
}

function downloadSinglePdf(id) {
    if (isGuestUser()) {
        showNotification('Fitur ini tidak tersedia untuk mode tamu', 'error');
        return;
    }
    
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
        doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        doc.text(appSettings.appName.toUpperCase(), 105, 22, { align: 'center' });
        doc.setFontSize(16);
        doc.text('DINAS PERIKANAN', 105, 29, { align: 'center' });
        doc.setTextColor(246, 185, 59);
        doc.setFont('times', 'italic'); doc.setFontSize(12);
        doc.text('"Situbondo Naik Kelas"', 105, 37, { align: 'center' });
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(appSettings.appSubtitle, 105, 45, { align: 'center' });
        
        doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
        doc.text('BIODATA NELAYAN TERDAFTAR', 105, 65, { align: 'center' });
        doc.setLineWidth(0.5); doc.line(70, 68, 140, 68);

        let y = 80;
        const lineHeight = 7;
        
        const checkPage = (heightNeeded) => {
            if (y + heightNeeded > 250) { 
                doc.addPage();
                doc.setDrawColor(12, 36, 97); doc.setLineWidth(1); doc.rect(10, 10, 190, 277);
                y = 30; 
            }
        };

        const printLine = (label, value) => {
            checkPage(lineHeight);
            doc.setFont('helvetica', 'normal'); doc.text(label, 25, y);
            doc.setFont('helvetica', 'bold'); 
            
            if (label === 'Domisili' || value.length > 50) {
                const splitText = doc.splitTextToSize(': ' + value, 110);
                doc.text(splitText, 80, y);
                y += (splitText.length * 6);
            } else {
                doc.text(': ' + value, 80, y);
                y += lineHeight;
            }
        };

        checkPage(30);
        doc.setFontSize(11); doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('I. IDENTITAS PRIBADI', 22, y); y += 12;
        
        doc.setFontSize(10);
        printLine('Nama Lengkap', d.nama);
        printLine('NIK', maskData(d.nik, true)); // Sensor NIK
        printLine('Tempat / Tgl Lahir', `${d.tahunLahir} (Usia: ${d.usia} Thn)`);
        printLine('Domisili', `${d.desa}, ${d.kecamatan}`);
        printLine('No. Handphone', maskData(d.whatsapp, true)); // Sensor WhatsApp
        y += 8;

        checkPage(30);
        doc.setFontSize(11); doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('II. PROFESI & EKONOMI', 22, y); y += 12;

        doc.setFontSize(10);
        printLine('Status Profesi', d.profesi);
        printLine('Posisi Kerja', d.status);
        printLine('Alat Penangkapan Ikan (API)', d.alatTangkap);
        printLine('Usaha Sampingan', d.usahaSampingan || '-');
        y += 8;

        checkPage(30);
        doc.setFontSize(11); doc.setFillColor(230, 230, 230);
        doc.rect(20, y-4, 170, 6, 'F');
        doc.text('III. JENIS IKAN TANGKAPAN UTAMA', 22, y); y += 12;

        doc.setFontSize(10);
        const fishList = d.jenisIkan ? d.jenisIkan.split(', ') : [];
        fishList.forEach((fish, idx) => {
            printLine(`Ikan ${idx + 1}`, fish);
        });
        y += 8;

        if(d.status === 'Pemilik Kapal') {
            checkPage(30);
            doc.setFontSize(11); doc.setFillColor(230, 230, 230);
            doc.rect(20, y-4, 170, 6, 'F');
            doc.text('IV. DATA ASET KAPAL', 22, y); y += 12;

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
        doc.text("SISTEM SATU DATA (SIMATA)", leftX + 35, footerY + 14, {align: 'center'});
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text("Dinas Perikanan Kabupaten Situbondo", leftX + 35, footerY + 20, {align: 'center'});
        doc.setTextColor(0, 0, 255);
        doc.text("www.dinasperikanansitubondo.com/simata", leftX + 35, footerY + 25, {align: 'center'});

        doc.setFontSize(10); doc.setTextColor(0,0,0); doc.setFont('helvetica', 'normal');
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

        doc.setFontSize(7); doc.setTextColor(150);
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} | Ref ID: ${d.kodeValidasi || '-'}`, 105, 285, {align:'center'});

        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Dokumen ini saling berhubungan - Halaman ${i} dari ${totalPages}`, 105, 292, { align: 'center' });
        }

        doc.save(`${d.nama}_${maskData(d.nik, true)}.pdf`);
        document.getElementById('qr-right').innerHTML = "";

    }, 500);
}

// Ekspos fungsi-fungsi penting ke window agar bisa diakses dari file lain
window.maskData = maskData;
window.viewDetail = viewDetail;
window.editData = editData;
window.deleteData = deleteData;
window.safeGenerateIDCard = safeGenerateIDCard;
window.showNotification = showNotification;
window.printData = printData;
window.verifyKIN = verifyKIN;
window.verifyKINAndShow = verifyKINAndShow;
window.showAllKIN = showAllKIN;
window.resetVerifyForm = resetVerifyForm;
window.showFishInfoModal = showFishInfoModal;
window.mergeData = mergeData;
window.backupData = backupData;
window.restoreData = restoreData;
window.updateAlatTangkapByKapal = updateAlatTangkapByKapal;
window.updateFishOptionsByAPI = updateFishOptionsByAPI;
window.renderDataTable = renderDataTable;
window.goToPage = goToPage;
window.applyFilter = applyFilter;
window.resetFilter = resetFilter;
window.showDuplicateDataInFilter = showDuplicateDataInFilter;
window.generateFilteredPdf = generateFilteredPdf;
window.generateTabelPdf = generateTabelPdf;
window.getFilteredData = getFilteredData;
window.refreshPage = refreshPage;
window.isGuestUser = isGuestUser;
window.handleReloadRepo = handleReloadRepo;

console.log('✅ SIMATA Application v5.5 FINAL initialized successfully');
console.log('✅ Fitur Login Tamu telah ditambahkan');
console.log('✅ Sensor NIK dan WhatsApp di detail ketika privacy mode aktif');
console.log('✅ Menu dan tombol dinonaktifkan untuk mode tamu');
console.log('✅ Semua fitur utama tetap berfungsi untuk admin');
console.log('✅ Refactoring berhasil: index.html, login.js, main.js');
