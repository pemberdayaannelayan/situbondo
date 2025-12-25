// ================================
// KODE UTAMA APLIKASI SIMATA - VERSI DIPERBAIKI
// ================================

// --- DATA CONSTANTS ---
const SITUBONDO_DATA = {
    "Arjasa": [
        "Arjasa", "Bayeman", "Curah Tatal", "Jatisari", "Kayumas", "Kedungdowo", "Ketowan", "Lamongan"
    ],
    "Asembagus": [
        "Asembagus", "Awar-awar", "Bantal", "Gudang", "Kedunglo", "Kertosari", "Mojosari", "Parante", "Trigonco", "Wringin Anom"
    ],
    "Banyuglugur": [
        "Banyuglugur", "Kalianget", "Kalisari", "Lubawang", "Selobanteng", "Telempong", "Tepos"
    ],
    "Banyuputih": [
        "Banyuputih", "Sumberanyar", "Sumberejo", "Sumberwaru", "Wonorejo"
    ],
    "Besuki": [
        "Besuki", "Blimbing", "Bloro", "Demung", "Jetis", "Kalimas", "Langkap", "Pesisir", "Sumberejo", "Widoropayung"
    ],
    "Bungatan": [
        "Bletok", "Bungatan", "Mlandingan Wetan", "Pasir Putih", "Patemon", "Selowogo", "Sumbertengah"
    ],
    "Jangkar": [
        "Agel", "Curah Kalak", "Gadingan", "Jangkar", "Kumbangsari", "Palangan", "Pesanggrahan", "Sopet"
    ],
    "Jatibanteng": [
        "Curahsuri", "Jatibanteng", "Kembangsari", "Pategalan", "Patemon", "Semambung", "Sumberanyar", "Wringinanom"
    ],
    "Kapongan": [
        "Curah Cottok Gebangan", "Kandang", "Kapongan", "Kesambi Rampak", "Landangan", "Peleyan", "Pokaan", "Seletreng", "Wonokoyo"
    ],
    "Kendit": [
        "Balung", "Bugeman", "Kendit", "Klatakan", "Kukusan", "Rajekwesi", "Tambak Ukir"
    ],
    "Mangaran": [
        "Mangaran", "Semiring", "Tanjung Glugur", "Tanjung Kamal", "Tanjung Pecinan", "Trebungan"
    ],
    "Mlandingan": [
        "Alas Bayur", "Campoan", "Mlandingan Kulon", "Selomukti", "Sumberanyar", "Sumber Pinang", "Trebungan"
    ],
    "Panarukan": [
        "Alasmalang", "Duwet", "Gelung", "Kilensari", "Paowan", "Peleyan", "Sumberkolak", "Wringinanom"
    ],
    "Panji": [
        "Ardirejo", "Mimbaan",
        "Battal", "Curah Jeru", "Juglangan", "Kayu Putih", "Klampokan", "Panji Kidul", "Panji Lor", "Sliwung", "Tenggir", "Tokelan"
    ],
    "Situbondo": [
        "Dawuhan", "Patokan",
        "Kalibagor", "Kotakan", "Olean", "Talkandang"
    ],
    "Suboh": [
        "Buduan", "Cemara", "Dawuan", "Gunung Malang", "Gunung Putri", "Ketah", "Mojodungkol", "Suboh"
    ],
    "Sumbermalang": [
        "Alastengah", "Baderan", "Kalirejo", "Plalangan", "Sumberargo", "Taman", "Tamankursi", "Tamansari", "Tlogosari"
    ]
};

const COORDINATES_DATA = {
    "Panarukan, Alasmalang": [-7.6970, 113.7687],
    "Panarukan, Duwet": [-7.6977, 113.7882],
    "Panarukan, Gelung": [-7.7134, 113.8028],
    "Panarukan, Kilensari": [-7.6843, 113.7656],
    "Panarukan, Paowan": [-7.7298, 113.7800],
    "Panarukan, Peleyan": [-7.6950, 113.8071],
    "Panarukan, Sumberkolak": [-7.7118, 113.7618],
    "Panarukan, Wringinanom": [-7.7061, 113.8256],
    
    "Panji, Battal": [-7.7099, 113.6780],
    "Panji, Curah Jeru": [-7.6941, 113.6958],
    "Panji, Juglangan": [-7.6946, 113.6653],
    "Panji, Kayu Putih": [-7.7025, 113.6737],
    "Panji, Klampokan": [-7.7272, 113.6482],
    "Panji, Panji Kidul": [-7.7126, 113.7038],
    "Panji, Panji Lor": [-7.7019, 113.7059],
    "Panji, Sliwung": [-7.7188, 113.6806],
    "Panji, Tenggir": [-7.7163, 113.6579],
    "Panji, Tokelan": [-7.7320, 113.6703],
    "Panji, Ardirejo": [-7.7155, 113.6944],
    "Panji, Mimbaan": [-7.7091, 113.6952],
    
    "Situbondo, Kalibagor": [-7.7082, 114.0061],
    "Situbondo, Kotakan": [-7.6814, 114.0225],
    "Situbondo, Olean": [-7.6819, 114.0367],
    "Situbondo, Talkandang": [-7.6681, 114.0475],
    "Situbondo, Dawuhan": [-7.6926, 113.9937],
    "Situbondo, Patokan": [-7.6729, 113.9771],
    
    "Suboh, Buduan": [-7.8523, 113.7659],
    "Suboh, Cemara": [-7.8267, 113.7425],
    "Suboh, Dawuan": [-7.8398, 113.7719],
    "Suboh, Gunung Malang": [-7.8708, 113.7489],
    "Suboh, Gunung Putri": [-7.8647, 113.7325],
    "Suboh, Ketah": [-7.8614, 113.7894],
    "Suboh, Mojodungkol": [-7.8360, 113.7829],
    "Suboh, Suboh": [-7.8475, 113.7580],
    
    "Sumbermalang, Alastengah": [-7.8771, 113.8437],
    "Sumbermalang, Baderan": [-7.8318, 113.8214],
    "Sumbermalang, Kalirejo": [-7.8203, 113.8525],
    "Sumbermalang, Plalangan": [-7.8630, 113.8629],
    "Sumbermalang, Sumberargo": [-7.8405, 113.8077],
    "Sumbermalang, Taman": [-7.8482, 113.8374],
    "Sumbermalang, Tamankursi": [-7.8641, 113.8256],
    "Sumbermalang, Tamansari": [-7.8618, 113.8125],
    "Sumbermalang, Tlogosari": [-7.8816, 113.8243]
};

const DEFAULT_COORDINATES = {
    "Arjasa": [-7.7825, 113.7900],
    "Asembagus": [-7.7533, 114.2500],
    "Banyuglugur": [-7.8000, 113.8667],
    "Banyuputih": [-7.7167, 114.0833],
    "Besuki": [-7.7333, 113.7000],
    "Bungatan": [-7.6500, 113.8833],
    "Jangkar": [-7.7667, 114.1667],
    "Jatibanteng": [-7.8000, 113.9333],
    "Kapongan": [-7.6833, 114.0667],
    "Kendit": [-7.7167, 113.9167],
    "Mangaran": [-7.6667, 114.0500],
    "Mlandingan": [-7.6667, 113.8667]
};

const FISH_TYPES = [
    "Lainnya", 
    "Ikan Tongkol", "Ikan Kembung", "Ikan Selar", "Ikan Tenggiri", "Ikan Layang", 
    "Cumi-cumi", "Ikan Teri", "Kakap Merah", "Ikan Barakuda", "Kepiting",
    "Ikan Layur", "Ikan Mangla", "Ikan Kurisi", "Ikan Cakalang", "Ikan Kerapu", "Ikan Lemuru"
];

const API_INFO = {
    "Pukat Cincin": "Alat tangkap berupa jaring besar berbentuk cincin yang ditarik mengelilingi gerombolan ikan. Efektif untuk menangkap ikan pelagis seperti tuna dan cakalang.",
    "Pukat Tarik": "Jaring yang ditarik oleh kapal untuk menangkap ikan di permukaan atau pertengahan air. Cocok untuk ikan pelagis kecil seperti teri dan lemuru.",
    "Pancing Ulur": "Pancing dengan sistem ulur (handline) yang dioperasikan secara manual. Digunakan untuk menangkap ikan dasar seperti kerapu dan kakap.",
    "Jaring Insang (gill net)": "Jaring yang dipasang diam di air, ikan yang berenang akan tersangkut insangnya. Cocok untuk berbagai jenis ikan.",
    "Jaring Angkat (lift net)": "Jaring berbentuk persegi yang diturunkan ke air lalu diangkat cepat. Efektif untuk ikan permukaan.",
    "Pancing": "Alat tangkap tradisional menggunakan mata pancing dan umpan. Fleksibel untuk berbagai jenis ikan.",
    "Perangkap Bubu": "Perangkap berbentuk kurungan untuk menjebak ikan. Umum untuk menangkap ikan karang dan udang.",
    "Lainnya": "Alat tangkap lain yang tidak termasuk dalam kategori di atas."
};

const KAPAL_INFO = {
    "Perahu Jukung": "Perahu tradisional kayu kecil, umumnya tanpa mesin atau bermesin kecil. Cocok untuk perairan tenang dan dekat pantai.",
    "Perahu Mayang": "Perahu tradisional yang lebih besar dari jukung, biasanya bermesin tempel. Untuk penangkapan di perairan sedang.",
    "Perahu Slerek": "Perahu khas Situbondo dengan bentuk ramping, biasanya menggunakan layar atau mesin kecil. Untuk operasi dekat pantai.",
    "Perahu Insang": "Perahu khusus untuk operasi jaring insang (gill net), dilengkapi dengan sistem pemasangan jaring.",
    "Perahu Jaring Angkat": "Perahu dengan sistem derek untuk mengoperasikan jaring angkat (lift net).",
    "Perahu Pancing": "Perahu yang didesain khusus untuk operasi pancing, baik handline maupun rawai.",
    "Lainnya": "Jenis kapal lain yang tidak termasuk dalam kategori di atas."
};

const PROFESI_INFO = {
    "Nelayan Penuh Waktu": "Nelayan yang bekerja sebagai penangkap ikan sebagai mata pencaharian utama dan tidak memiliki pekerjaan lain.",
    "Nelayan Sambilan Utama": "Nelayan yang bekerja sebagai penangkap ikan sebagai pekerjaan sampingan namun memberikan kontribusi pendapatan yang signifikan.",
    "Nelayan Sambilan Tambahan": "Nelayan yang bekerja sebagai penangkap ikan hanya pada musim tertentu atau sebagai pekerjaan tambahan."
};

// --- GLOBAL VARIABLES ---
let appData = [];
let appSettings = {
    appName: 'SISTEM PEMETAAN DATA NELAYAN',
    appSubtitle: 'DINAS PERIKANAN KABUPATEN SITUBONDO',
    itemsPerPage: 10,
    privacyMode: true,
    securityCodeSensor: '987654321'
};
let currentPage = 1;
let duplicateCheckInterval = null;
let currentDetailId = null; 
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
const loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));

// Variabel untuk peta
let map = null;
let markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: 15
});
let currentMarkers = [];
let mapView = 'all';

const PROFESI_MAPPING = {
    "Penuh Waktu": "Nelayan Penuh Waktu",
    "Sambilan Utama": "Nelayan Sambilan Utama",
    "Sambilan Tambahan": "Nelayan Sambilan Tambahan"
};

// Variabel untuk upload Excel
let currentExcelData = null;
let currentExcelFile = null;

// --- FUNGSI GENERATE KODE KEAMANAN DINAMIS (PERIODE TERBALIK: DDMMYYYY) ---
function generateSecurityCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Format terbalik: DDMMYYYY
    return `${day}${month}${year}`;
}

// --- FUNGSI UNTUK MENAMPILKAN TANGGAL SEKARANG ---
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateDisplay').innerHTML = `<i class="fas fa-calendar-day me-2"></i>${dateString}`;
    
    document.getElementById('passwordHint').innerHTML = `Kode keamanan berubah setiap hari berdasarkan tanggal (Format: DDMMYYYY).`;
}

// --- FUNGSI UNTUK MENDAPATKAN KOORDINAT BERDASARKAN DESA ---
function getCoordinatesForLocation(kecamatan, desa) {
    const key = `${kecamatan}, ${desa}`;
    
    if (COORDINATES_DATA[key]) {
        return COORDINATES_DATA[key];
    }
    
    if (DEFAULT_COORDINATES[kecamatan]) {
        return DEFAULT_COORDINATES[kecamatan];
    }
    
    return [-7.7068, 113.9142];
}

// --- FUNGSI UNTUK INISIALISASI PETA ---
function initializeMap() {
    if (map) {
        map.remove();
        markers.clearLayers();
        currentMarkers = [];
    }
    
    map = L.map('map').setView([-7.7068, 113.9142], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    markers.addTo(map);
    
    renderMapMarkers();
    
    updateMapStatistics();
}

// --- FUNGSI UNTUK RENDER MARKER PADA PETA ---
function renderMapMarkers() {
    if (!map || !markers) return;
    
    markers.clearLayers();
    currentMarkers = [];
    
    const kecamatanCount = {};
    const desaCount = {};
    let pemilikKapalCount = 0;
    
    appData.forEach((nelayan, index) => {
        kecamatanCount[nelayan.kecamatan] = (kecamatanCount[nelayan.kecamatan] || 0) + 1;
        desaCount[nelayan.desa] = (desaCount[nelayan.desa] || 0) + 1;
        if (nelayan.status === 'Pemilik Kapal') pemilikKapalCount++;
        
        const coordinates = getCoordinatesForLocation(nelayan.kecamatan, nelayan.desa);
        
        let markerColor = '#0c2461';
        let markerClass = 'marker-penuh';
        
        if (nelayan.profesi === 'Nelayan Sambilan Utama') {
            markerColor = '#e58e26';
            markerClass = 'marker-sambilan-utama';
        } else if (nelayan.profesi === 'Nelayan Sambilan Tambahan') {
            markerColor = '#27ae60';
            markerClass = 'marker-sambilan-tambahan';
        }
        
        let iconClass = 'fa-user';
        if (nelayan.status === 'Pemilik Kapal') {
            markerColor = '#0984e3';
            markerClass = 'marker-pemilik';
            iconClass = 'fa-ship';
        } else if (nelayan.status === 'Anak Buah Kapal') {
            markerColor = '#a55eea';
            markerClass = 'marker-abk';
            iconClass = 'fa-users';
        }
        
        const customIcon = L.divIcon({
            html: `<div class="marker-icon ${markerClass}" style="
                background-color: ${markerColor};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
            ">
                <i class="fas ${iconClass}"></i>
            </div>`,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
        
        const popupContent = `
            <div class="leaflet-popup-content">
                <h4>${nelayan.nama}</h4>
                <div class="popup-detail">
                    <span class="popup-label">NIK:</span>
                    <span class="popup-value">${maskData(nelayan.nik)}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Usia:</span>
                    <span class="popup-value">${nelayan.usia} Tahun</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Profesi:</span>
                    <span class="popup-value">${nelayan.profesi}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Status:</span>
                    <span class="popup-value">${nelayan.status}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Domisili:</span>
                    <span class="popup-value">${nelayan.desa}, ${nelayan.kecamatan}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Alat Tangkap:</span>
                    <span class="popup-value">${nelayan.alatTangkap}</span>
                </div>
                <div class="popup-detail">
                    <button class="btn btn-sm btn-primary w-100 mt-2" onclick="viewDetail('${nelayan.id}')">
                        <i class="fas fa-info-circle me-1"></i> Lihat Detail
                    </button>
                </div>
            </div>
        `;
        
        const marker = L.marker(coordinates, { icon: customIcon })
            .bindPopup(popupContent)
            .on('click', function() {
                this.openPopup();
            });
        
        markers.addLayer(marker);
        currentMarkers.push(marker);
    });
    
    document.getElementById('map-total-points').textContent = appData.length;
    document.getElementById('map-total-kecamatan').textContent = Object.keys(kecamatanCount).length;
    document.getElementById('map-total-desa').textContent = Object.keys(desaCount).length;
    document.getElementById('map-total-kapal').textContent = pemilikKapalCount;
}

// --- FUNGSI UNTUK UPDATE STATISTIK PETA ---
function updateMapStatistics() {
    if (appData.length === 0) return;
    
    const kecamatanCount = {};
    const desaCount = {};
    let pemilikKapalCount = 0;
    
    appData.forEach(nelayan => {
        kecamatanCount[nelayan.kecamatan] = (kecamatanCount[nelayan.kecamatan] || 0) + 1;
        desaCount[nelayan.desa] = (desaCount[nelayan.desa] || 0) + 1;
        if (nelayan.status === 'Pemilik Kapal') pemilikKapalCount++;
    });
    
    document.getElementById('map-total-points').textContent = appData.length;
    document.getElementById('map-total-kecamatan').textContent = Object.keys(kecamatanCount).length;
    document.getElementById('map-total-desa').textContent = Object.keys(desaCount).length;
    document.getElementById('map-total-kapal').textContent = pemilikKapalCount;
}

// --- FUNGSI UNTUK SWITCH VIEW PETA ---
function switchMapView(view) {
    mapView = view;
    
    document.querySelectorAll('.map-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderMapMarkers();
    
    let viewName = 'Semua Data';
    if (view === 'profesi') viewName = 'Berdasarkan Profesi';
    else if (view === 'kecamatan') viewName = 'Berdasarkan Kecamatan';
    
    showNotification(`Peta ditampilkan dengan view: ${viewName}`, 'info');
}

// --- FUNGSI UNTUK RESET VIEW PETA ---
function resetMapView() {
    if (map) {
        map.setView([-7.7068, 113.9142], 11);
        showNotification('Peta direset ke view awal', 'info');
    }
}

// --- FUNGSI UNTUK ZOOM KE SEMUA MARKER ---
function zoomToAllMarkers() {
    if (map && currentMarkers.length > 0) {
        const group = L.featureGroup(currentMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
        showNotification('Zoom ke semua marker', 'info');
    }
}

// --- FUNGSI UNTUK TOGGLE CLUSTER MARKER ---
function toggleCluster() {
    const showCluster = document.getElementById('showCluster').checked;
    
    if (showCluster) {
        markers.addTo(map);
        showNotification('Mode grup marker diaktifkan', 'info');
    } else {
        map.removeLayer(markers);
        currentMarkers.forEach(marker => {
            marker.addTo(map);
        });
        showNotification('Mode grup marker dinonaktifkan', 'info');
    }
}

// --- FUNGSI UNTUK GENERATE ID CARD DENGAN ERROR HANDLING ---
function safeGenerateIDCard(id) {
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

// --- FUNGSI UNTUK MIGRASI DATA LAMA ---
function migrateOldData() {
    appData.forEach(item => {
        if (PROFESI_MAPPING[item.profesi]) {
            item.profesi = PROFESI_MAPPING[item.profesi];
        }
    });
    saveData();
}

function getProfesiLabel(profesi) {
    return PROFESI_MAPPING[profesi] || profesi;
}

// --- FUNGSI MASK DATA YANG DIPERBAIKI ---
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
    return 'fa-fish';
}

// --- FUNGSI UNTUK NOTIFIKASI ---
function showNotification(message, type = 'info') {
    const toast = document.querySelector('.notification-toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    let title = 'Notifikasi';
    let bgClass = 'bg-primary';
    
    switch(type) {
        case 'success':
            title = 'Sukses!';
            bgClass = 'bg-success';
            break;
        case 'error':
            title = 'Error!';
            bgClass = 'bg-danger';
            break;
        case 'warning':
            title = 'Peringatan!';
            bgClass = 'bg-warning';
            break;
        case 'info':
            title = 'Informasi';
            bgClass = 'bg-primary';
            break;
    }
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    toast.querySelector('.toast-header').className = `toast-header ${bgClass} text-white`;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
        setupEventListeners();
        initFishOptions();
        
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
            setTimeout(() => {
                initializeMap();
            }, 500);
        } else {
            setTimeout(() => {
                document.getElementById('loginModal').style.display = 'flex';
            }, 100);
        }

        // Handle hash routing untuk verifikasi
        handleHashRouting();

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

    const kecSelect = document.getElementById('kecamatan');
    kecSelect.innerHTML = `<option value="">Pilih Kecamatan</option>`;
    Object.keys(SITUBONDO_DATA).sort().forEach(kec => kecSelect.add(new Option(kec, kec)));
    
    const allDesas = new Set();
    Object.values(SITUBONDO_DATA).forEach(list => list.forEach(d => allDesas.add(d)));
    const filterDesaSelect = document.getElementById('filterDesa');
    filterDesaSelect.innerHTML = `<option value="">Semua Desa</option>`;
    [...allDesas].sort().forEach(d => filterDesaSelect.add(new Option(d, d)));
    
    const filterAlatTangkap = document.getElementById('filterAlatTangkap');
    filterAlatTangkap.innerHTML = `<option value="">Semua</option>`;
    Object.keys(API_INFO).forEach(api => filterAlatTangkap.add(new Option(api, api)));
    
    updateAppIdentity();
    updatePrivacyUI();
    
    startDuplicateChecker();
    
    setupInfoTooltips();
    setupProfesiInfo();
}

function initFishOptions() {
    const container = document.getElementById('fishCheckboxContainer');
    container.innerHTML = '';
    FISH_TYPES.forEach(fish => {
        const id = 'fish_' + fish.replace(/\s/g, '');
        const html = `
        <label class="fish-option-box">
            <input type="checkbox" class="form-check-input me-2 fish-checkbox" value="${fish}" id="${id}">
            <span>${fish}</span>
        </label>`;
        container.innerHTML += html;
    });

    document.getElementById('fish_Lainnya').addEventListener('change', function() {
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

function setupInfoTooltips() {
    const alatTangkapSelect = document.getElementById('alatTangkap');
    const apiInfoDiv = document.getElementById('apiInfo');
    
    alatTangkapSelect.addEventListener('change', function() {
        const selected = this.value;
        if (selected && API_INFO[selected]) {
            apiInfoDiv.style.display = 'block';
            apiInfoDiv.innerHTML = `<strong>${selected}:</strong> ${API_INFO[selected]}`;
        } else {
            apiInfoDiv.style.display = 'none';
        }
    });

    const jenisKapalSelect = document.getElementById('jenisKapal');
    const kapalInfoDiv = document.getElementById('kapalInfo');
    
    jenisKapalSelect.addEventListener('change', function() {
        const selected = this.value;
        if (selected && KAPAL_INFO[selected]) {
            kapalInfoDiv.style.display = 'block';
            kapalInfoDiv.innerHTML = `<strong>${selected}:</strong> ${KAPAL_INFO[selected]}`;
        } else {
            kapalInfoDiv.style.display = 'none';
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

// ========================================
// FUNGSI UNTUK INPUT CEPAT EXCEL
// ========================================

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    currentExcelFile = file;
    
    // Validasi ukuran file
    if (file.size > 10 * 1024 * 1024) {
        showNotification('Ukuran file terlalu besar. Maksimal 10MB.', 'error');
        document.getElementById('excelFileInput').value = '';
        currentExcelFile = null;
        return;
    }
    
    // Validasi ekstensi
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
        showNotification('Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv.', 'error');
        document.getElementById('excelFileInput').value = '';
        currentExcelFile = null;
        return;
    }
    
    // Tampilkan nama file
    const dropZone = document.getElementById('dropZone');
    dropZone.innerHTML = `
        <div class="upload-excel-icon text-success">
            <i class="fas fa-file-excel"></i>
        </div>
        <div class="upload-excel-text">${file.name}</div>
        <div class="upload-excel-hint">
            Ukuran: ${(file.size / 1024 / 1024).toFixed(2)} MB<br>
            Siap untuk diproses
        </div>
    `;
    
    // Aktifkan tombol proses
    document.getElementById('processBtn').disabled = false;
    
    // Baca file untuk preview
    readExcelFile(file);
}

function readExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            // Simpan data untuk diproses nanti
            currentExcelData = jsonData;
            
            // Tampilkan preview
            showDataPreview(jsonData);
            
        } catch (error) {
            console.error('Error reading Excel file:', error);
            showNotification('Gagal membaca file. Pastikan format file benar.', 'error');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function showDataPreview(data) {
    const resultBody = document.getElementById('uploadResultBody');
    const uploadResult = document.getElementById('uploadResult');
    
    if (!data || data.length === 0) {
        resultBody.innerHTML = '<div class="alert alert-warning">File kosong atau tidak dapat dibaca.</div>';
        uploadResult.style.display = 'block';
        return;
    }
    
    const skipHeader = document.getElementById('skipFirstRow').checked;
    const rows = skipHeader ? data.slice(1) : data;
    
    if (rows.length === 0) {
        resultBody.innerHTML = '<div class="alert alert-warning">Tidak ada data setelah header.</div>';
        uploadResult.style.display = 'block';
        return;
    }
    
    // Tampilkan statistik
    const previewRows = rows.slice(0, 5); // Preview 5 baris pertama
    let previewHTML = `
        <div class="alert alert-info">
            <strong>Preview Data (${previewRows.length} dari ${rows.length} baris):</strong>
        </div>
        <div class="table-responsive">
            <table class="table table-sm table-bordered upload-preview-table">
                <thead>
                    <tr>
                        ${data[0].map((col, idx) => `<th>${col || `Kolom ${idx+1}`}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${previewRows.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell || ''}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <div class="upload-result-item">
                <span class="upload-result-label">Total Baris:</span>
                <span class="upload-result-value">${rows.length}</span>
            </div>
            <div class="upload-result-item">
                <span class="upload-result-label">Total Kolom:</span>
                <span class="upload-result-value">${data[0] ? data[0].length : 0}</span>
            </div>
            <div class="upload-result-item">
                <span class="upload-result-label">File:</span>
                <span class="upload-result-value">${currentExcelFile.name}</span>
            </div>
        </div>
    `;
    
    resultBody.innerHTML = previewHTML;
    uploadResult.style.display = 'block';
}

function processExcelFile() {
    if (!currentExcelData || !currentExcelFile) {
        showNotification('Tidak ada file yang dipilih.', 'error');
        return;
    }
    
    const skipHeader = document.getElementById('skipFirstRow').checked;
    const updateExisting = document.getElementById('updateExisting').checked;
    
    let rows = currentExcelData;
    if (skipHeader) {
        rows = rows.slice(1);
    }
    
    if (rows.length === 0) {
        showNotification('Tidak ada data yang dapat diproses.', 'error');
        return;
    }
    
    // Tampilkan loading
    const processBtn = document.getElementById('processBtn');
    const originalText = processBtn.innerHTML;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> MEMPROSES...';
    processBtn.disabled = true;
    
    setTimeout(() => {
        try {
            const result = importExcelData(rows, updateExisting);
            showImportResult(result);
        } catch (error) {
            console.error('Error processing Excel file:', error);
            showNotification('Terjadi kesalahan saat memproses file.', 'error');
        } finally {
            processBtn.innerHTML = originalText;
            processBtn.disabled = false;
        }
    }, 500);
}

function importExcelData(rows, updateExisting = true) {
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    let errors = [];
    
    // Mapping kolom yang diharapkan
    const columnMapping = {
        'id': 0, 'nama': 1, 'nik': 2, 'whatsapp': 3, 'profesi': 4, 'status': 5,
        'tahunLahir': 6, 'usia': 7, 'kecamatan': 8, 'desa': 9, 'alatTangkap': 10,
        'namaKapal': 11, 'jenisKapal': 12, 'jenisIkan': 13, 'usahaSampingan': 14,
        'tanggalValidasi': 15, 'validator': 16, 'driveLink': 17, 'kodeValidasi': 18,
        'keterangan': 19
    };
    
    rows.forEach((row, index) => {
        try {
            // Skip baris kosong
            if (!row || row.length < 5) {
                skipped++;
                return;
            }
            
            // Ekstrak data berdasarkan mapping kolom
            const rowData = {};
            Object.entries(columnMapping).forEach(([key, colIndex]) => {
                if (colIndex < row.length) {
                    rowData[key] = row[colIndex] !== undefined ? String(row[colIndex]).trim() : '';
                } else {
                    rowData[key] = '';
                }
            });
            
            // Validasi data wajib
            if (!rowData.nama || !rowData.nik) {
                errors.push(`Baris ${index + 1}: Nama dan NIK wajib diisi`);
                skipped++;
                return;
            }
            
            // Validasi NIK (harus 16 digit angka)
            if (rowData.nik.length !== 16 || !/^\d+$/.test(rowData.nik)) {
                errors.push(`Baris ${index + 1}: NIK harus 16 digit angka`);
                skipped++;
                return;
            }
            
            // Cek apakah NIK sudah ada
            const existingIndex = appData.findIndex(item => item.nik === rowData.nik);
            
            if (existingIndex >= 0) {
                // Update data yang sudah ada
                if (updateExisting) {
                    // Generate ID baru jika tidak ada
                    if (!rowData.id || rowData.id === '') {
                        rowData.id = Date.now() + Math.random();
                    }
                    
                    // Update data yang ada
                    appData[existingIndex] = {
                        ...appData[existingIndex],
                        ...rowData,
                        id: appData[existingIndex].id // Pertahankan ID lama
                    };
                    updated++;
                } else {
                    skipped++;
                }
            } else {
                // Tambah data baru
                // Generate ID jika tidak ada
                if (!rowData.id || rowData.id === '') {
                    rowData.id = Date.now() + Math.random();
                }
                
                // Tambah data baru
                appData.push(rowData);
                imported++;
            }
            
        } catch (error) {
            console.error(`Error processing row ${index + 1}:`, error);
            errors.push(`Baris ${index + 1}: ${error.message}`);
            skipped++;
        }
    });
    
    // Simpan data jika ada perubahan
    if (imported > 0 || updated > 0) {
        saveData();
        updateDashboard();
        renderDataTable();
        if (map) {
            renderMapMarkers();
            updateMapStatistics();
        }
    }
    
    return {
        imported,
        updated,
        skipped,
        errors,
        total: rows.length
    };
}

function showImportResult(result) {
    const resultBody = document.getElementById('uploadResultBody');
    const uploadResult = document.getElementById('uploadResult');
    
    let resultHTML = `
        <div class="alert alert-success">
            <h6><i class="fas fa-check-circle me-2"></i> Proses Import Selesai!</h6>
            <p>Data berhasil diimport ke database.</p>
        </div>
        
        <div class="upload-result-item">
            <span class="upload-result-label">Total Data Diproses:</span>
            <span class="upload-result-value">${result.total}</span>
        </div>
        
        <div class="upload-result-item">
            <span class="upload-result-label">Data Baru Ditambahkan:</span>
            <span class="upload-result-value upload-success">${result.imported}</span>
        </div>
        
        <div class="upload-result-item">
            <span class="upload-result-label">Data Diperbarui:</span>
            <span class="upload-result-value upload-warning">${result.updated}</span>
        </div>
        
        <div class="upload-result-item">
            <span class="upload-result-label">Data Dilewati:</span>
            <span class="upload-result-value">${result.skipped}</span>
        </div>
        
        <div class="upload-result-item">
            <span class="upload-result-label">Error:</span>
            <span class="upload-result-value upload-error">${result.errors.length}</span>
        </div>
    `;
    
    if (result.errors.length > 0) {
        resultHTML += `
            <div class="alert alert-danger mt-3">
                <h6><i class="fas fa-exclamation-triangle me-2"></i> Detail Error:</h6>
                <div style="max-height: 150px; overflow-y: auto;">
                    <ul class="mb-0">
                        ${result.errors.map(error => `<li class="small">${error}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    resultBody.innerHTML = resultHTML;
    uploadResult.style.display = 'block';
    
    // Scroll ke hasil
    uploadResult.scrollIntoView({ behavior: 'smooth' });
    
    // Tampilkan notifikasi
    showNotification(`Import selesai: ${result.imported} baru, ${result.updated} diperbarui, ${result.errors.length} error.`, 'success');
}

function downloadTemplate() {
    // Buat data contoh untuk template
    const templateData = [
        ['id', 'nama', 'nik', 'whatsapp', 'profesi', 'status', 'tahunLahir', 'usia', 'kecamatan', 'desa', 'alatTangkap', 'namaKapal', 'jenisKapal', 'jenisIkan', 'usahaSampingan', 'tanggalValidasi', 'validator', 'driveLink', 'kodeValidasi', 'keterangan'],
        ['auto', 'John Doe', '1234567890123456', '81234567890', 'Nelayan Penuh Waktu', 'Pemilik Kapal', '1980', '44', 'Panarukan', 'Alasmalang', 'Pukat Cincin', 'Jaya Selalu', 'Perahu Jukung', 'Ikan Tongkol, Ikan Kembung', 'Warung', '2024-01-01', 'Petugas Validator', 'https://drive.google.com', 'VLD-ABC123', 'Keterangan contoh'],
        ['auto', 'Jane Smith', '2345678901234567', '82345678901', 'Nelayan Sambilan Utama', 'Anak Buah Kapal', '1990', '34', 'Situbondo', 'Kalibagor', 'Pancing', '', '', 'Ikan Tenggiri', 'Ternak Ayam', '2024-01-01', 'Petugas Validator', '', 'VLD-DEF456', '')
    ];
    
    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Data Nelayan");
    
    // Download file
    XLSX.writeFile(wb, "Template_Data_Nelayan_SIMATA.xlsx");
    
    showNotification('Template berhasil diunduh.', 'success');
}

// ========================================
// FUNGSI UNTUK RELOAD DATA YANG DIPERBAIKI
// ========================================

function handleReloadRepo() {
    showNotification('Memuat data dari repository...', 'info');
    
    // Coba load file reload.js
    const script = document.createElement('script');
    script.src = 'reload.js?t=' + new Date().getTime();
    
    script.onload = function() {
        if (typeof window.SIMATA_BACKUP_ENCRYPTED !== 'undefined') {
            const backupData = window.SIMATA_BACKUP_ENCRYPTED;
            
            if (Array.isArray(backupData)) {
                // Proses merge data
                const oldLength = appData.length;
                let added = 0;
                let updated = 0;
                
                backupData.forEach(newItem => {
                    const existingIndex = appData.findIndex(item => item.nik === newItem.nik);
                    
                    if (existingIndex >= 0) {
                        // Update data yang sudah ada
                        appData[existingIndex] = { ...appData[existingIndex], ...newItem };
                        updated++;
                    } else {
                        // Tambah data baru
                        appData.push(newItem);
                        added++;
                    }
                });
                
                saveData();
                updateDashboard();
                renderDataTable();
                
                if (map) {
                    renderMapMarkers();
                    updateMapStatistics();
                }
                
                showNotification(`Reload berhasil! ${added} data baru ditambahkan, ${updated} data diperbarui.`, 'success');
                
                // Cek duplikasi setelah reload
                checkGlobalDuplicates();
                
            } else {
                showNotification('Format data dalam reload.js tidak valid.', 'error');
            }
        } else {
            showNotification('Tidak ada data backup di reload.js.', 'info');
        }
    };
    
    script.onerror = function() {
        showNotification('Gagal memuat file reload.js. Pastikan file tersedia di server.', 'error');
    };
    
    document.head.appendChild(script);
}

// ========================================
// FUNGSI VERIFIKASI KIN (TANPA SCAN QRCODE)
// ========================================

function verifyKIN() {
    const verifyInput = document.getElementById('verifyInput').value.trim();
    const verifyLoading = document.getElementById('verifyLoading');
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const verifyButton = document.getElementById('verifyButton');
    
    if (!verifyInput) {
        showNotification('Masukkan NIK atau kode validasi terlebih dahulu!', 'error');
        return;
    }
    
    // Tampilkan loading
    verifyLoading.style.display = 'block';
    verifyButton.disabled = true;
    
    // Simulasi loading
    setTimeout(() => {
        // Cari nelayan berdasarkan NIK atau kode validasi
        let foundNelayan = null;
        
        if (verifyInput.length === 16 && /^\d+$/.test(verifyInput)) {
            // Jika input 16 digit angka, cari berdasarkan NIK
            foundNelayan = appData.find(n => n.nik === verifyInput);
        } else {
            // Jika tidak, cari berdasarkan kode validasi
            foundNelayan = appData.find(n => n.kodeValidasi === verifyInput);
        }
        
        // Sembunyikan loading
        verifyLoading.style.display = 'none';
        verifyButton.disabled = false;
        
        // Tampilkan hasil verifikasi
        if (foundNelayan) {
            showVerificationResult(foundNelayan, true);
        } else {
            showVerificationResult(null, false, verifyInput);
        }
    }, 1500);
}

function showVerificationResult(nelayanData, isValid, input = '') {
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    // Update breadcrumb
    breadcrumbItems[0].classList.remove('active');
    breadcrumbItems[1].classList.add('active');
    
    if (isValid && nelayanData) {
        // Format timestamp
        const now = new Date();
        const timestamp = now.toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Tampilkan hasil valid
        verifyResultContainer.innerHTML = `
            <div class="verify-result-card verify-result-success">
                <div class="verify-icon-container verify-success-icon verify-success-animation">
                    <i class="fas fa-check"></i>
                </div>
                
                <h3 class="verify-result-title">✅ KARTU IDENTITAS NELAYAN VALID</h3>
                
                <div class="verify-result-message">
                    <p class="mb-3">Sistem telah memverifikasi bahwa <strong>${nelayanData.nama}</strong> tercatat sebagai nelayan resmi yang terdaftar di Sistem Informasi Pemetaan Data Nelayan Terpadu (SIMATA) Dinas Perikanan Kabupaten Situbondo.</p>
                    
                    <div class="alert alert-success mb-0">
                        <i class="fas fa-certificate me-2"></i>
                        <strong>STATUS VERIFIKASI:</strong> BERHASIL - Data sesuai dan tervalidasi
                    </div>
                </div>
                
                <div class="verify-details">
                    <h6 class="fw-bold text-primary mb-3">DETAIL IDENTITAS NELAYAN</h6>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Nama Lengkap</span>
                        <span class="verify-detail-value">${nelayanData.nama}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">NIK</span>
                        <span class="verify-detail-value">${nelayanData.nik}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Domisili</span>
                        <span class="verify-detail-value">${nelayanData.desa}, ${nelayanData.kecamatan}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Profesi</span>
                        <span class="verify-detail-value">
                            <span class="badge ${nelayanData.profesi === 'Nelayan Penuh Waktu' ? 'badge-profesi-penuh' : nelayanData.profesi === 'Nelayan Sambilan Utama' ? 'badge-profesi-sambilan-utama' : 'badge-profesi-sambilan-tambahan'}">${nelayanData.profesi}</span>
                        </span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Status</span>
                        <span class="verify-detail-value">${nelayanData.status}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Kode Validasi</span>
                        <span class="verify-detail-value fw-bold text-primary">${nelayanData.kodeValidasi || 'Tidak tersedia'}</span>
                    </div>
                    <div class="verify-detail-row">
                        <span class="verify-detail-label">Tanggal Validasi</span>
                        <span class="verify-detail-value">${nelayanData.tanggalValidasi}</span>
                    </div>
                </div>
                
                <div class="verify-timestamp">
                    <i class="fas fa-clock me-1"></i> Waktu Verifikasi: ${timestamp}
                </div>
                
                <div class="verify-actions">
                    <button type="button" class="btn btn-outline-primary verify-action-btn" onclick="viewDetail('${nelayanData.id}')">
                        <i class="fas fa-eye me-1"></i> Lihat Detail Lengkap
                    </button>
                    <button type="button" class="btn btn-outline-secondary verify-action-btn" onclick="resetVerification()">
                        <i class="fas fa-redo me-1"></i> Verifikasi Lagi
                    </button>
                </div>
            </div>
        `;
        
        // Scroll ke hasil
        verifyResultContainer.scrollIntoView({ behavior: 'smooth' });
        
    } else {
        // Tampilkan hasil tidak valid
        verifyResultContainer.innerHTML = `
            <div class="verify-result-card verify-result-error verify-error-animation">
                <div class="verify-icon-container verify-error-icon">
                    <i class="fas fa-times"></i>
                </div>
                
                <h3 class="verify-result-title">❌ KARTU IDENTITAS TIDAK TERDAFTAR</h3>
                
                <div class="verify-result-message">
                    <p class="mb-3">Sistem <strong>TIDAK DAPAT</strong> menemukan data nelayan dengan identitas <strong>"${input}"</strong> dalam database Sistem Informasi Pemetaan Data Nelayan Terpadu (SIMATA) Dinas Perikanan Kabupaten Situbondo.</p>
                    
                    <div class="alert alert-danger mb-0">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>STATUS VERIFIKASI:</strong> GAGAL - Data tidak ditemukan dalam sistem
                    </div>
                </div>
                
                <div class="verify-details">
                    <h6 class="fw-bold text-danger mb-3">KEMUNGKINAN PENYEBAB</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> NIK atau kode validasi salah</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Data belum terdaftar dalam sistem</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Kartu identitas tidak valid atau kadaluarsa</li>
                        <li class="list-group-item bg-transparent"><i class="fas fa-times text-danger me-2"></i> Kesalahan input data</li>
                    </ul>
                </div>
                
                <div class="verify-timestamp">
                    <i class="fas fa-clock me-1"></i> Waktu Verifikasi: ${new Date().toLocaleString('id-ID')}
                </div>
                
                <div class="verify-actions">
                    <button type="button" class="btn btn-danger verify-action-btn" onclick="resetVerification()">
                        <i class="fas fa-redo me-1"></i> Coba Lagi
                    </button>
                    <button type="button" class="btn btn-outline-secondary verify-action-btn" onclick="document.getElementById('v-pills-input-tab').click()">
                        <i class="fas fa-user-plus me-1"></i> Daftarkan Nelayan Baru
                    </button>
                </div>
            </div>
        `;
        
        // Scroll ke hasil
        verifyResultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    verifyResultContainer.style.display = 'block';
}

function resetVerification() {
    const verifyInput = document.getElementById('verifyInput');
    const verifyResultContainer = document.getElementById('verifyResultContainer');
    const breadcrumbItems = document.querySelectorAll('.verify-breadcrumb-item');
    
    // Reset input
    verifyInput.value = '';
    
    // Sembunyikan hasil
    verifyResultContainer.style.display = 'none';
    verifyResultContainer.innerHTML = '';
    
    // Reset breadcrumb
    breadcrumbItems[0].classList.add('active');
    breadcrumbItems[1].classList.remove('active');
    
    // Fokus ke input
    verifyInput.focus();
}

function toggleFAQ(id) {
    const answer = document.getElementById(`faqAnswer${id}`);
    const icon = document.querySelector(`#faqAnswer${id}`).parentElement.querySelector('i');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

// ========================================
// FUNGSI EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Login form - FIXED: Kode keamanan yang benar
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('loginButton');
        const spinner = document.getElementById('loginSpinner');
        const inputCode = document.getElementById('securityCode').value.trim();
        const correctCode = generateSecurityCode();
        
        // Debug: Tampilkan kode yang benar di console (untuk testing)
        console.log('Kode yang dimasukkan:', inputCode);
        console.log('Kode yang benar:', correctCode);
        
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
            setTimeout(() => {
                initializeMap();
            }, 500);
            
            loginSuccessModal.show();
            
            btn.disabled = false;
            spinner.classList.add('d-none');
            btn.innerHTML = 'BUKA DASHBOARD';
        }, 1200);
    });

    // Password toggle
    document.getElementById('passwordToggle').addEventListener('click', function() {
        const passwordInput = document.getElementById('securityCode');
        const icon = document.getElementById('passwordToggleIcon');
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

    // Continue to dashboard
    document.getElementById('btnContinueDashboard').addEventListener('click', function() {
        loginSuccessModal.hide();
        setTimeout(() => {
            welcomeModal.show();
        }, 300);
    });

    // Welcome modal reload
    document.getElementById('btnWelcomeReload').addEventListener('click', function() {
        welcomeModal.hide();
        handleReloadRepo();
    });

    // Input form
    document.getElementById('inputForm').addEventListener('submit', handleFormSubmit);
    
    // Kecamatan change event
    document.getElementById('kecamatan').addEventListener('change', function() {
        const selectedKec = this.value;
        const desaSelect = document.getElementById('desa');
        desaSelect.innerHTML = `<option value="">Pilih Desa / Kelurahan</option>`;
        if (selectedKec && SITUBONDO_DATA[selectedKec]) {
            desaSelect.disabled = false;
            SITUBONDO_DATA[selectedKec].sort().forEach(desa => desaSelect.add(new Option(desa, desa)));
        } else {
            desaSelect.disabled = true;
            desaSelect.innerHTML = `<option value="">-- Pilih Kecamatan Terlebih Dahulu --</option>`;
        }
    });

    // Status nelayan change event
    document.getElementById('statusNelayan').addEventListener('change', function() {
        const isOwner = this.value === 'Pemilik Kapal';
        const ownerFields = document.getElementById('ownerFields');
        ownerFields.style.display = isOwner ? 'block' : 'none';
        if(!isOwner) {
            document.getElementById('namaKapal').value = '';
            document.getElementById('jenisKapal').value = '';
            document.getElementById('kapalInfo').style.display = 'none';
        }
    });

    // Tahun lahir input event
    document.getElementById('tahunLahir').addEventListener('input', function() {
        const year = parseInt(this.value);
        const currentYear = new Date().getFullYear();
        if(year && this.value.length === 4 && year <= currentYear && year >= 1900) {
            document.getElementById('usia').value = currentYear - year;
        }
    });

    // Generate kode button
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

    // Mobile menu
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
            backupData('reload.js');
            setTimeout(() => location.reload(), 2000);
        }
    });

    // Search data
    document.getElementById('searchData').addEventListener('input', renderDataTable);
    
    // Filter
    document.getElementById('applyFilterBtn').addEventListener('click', renderFilterTable);
    document.getElementById('btnCekGanda').addEventListener('click', showDuplicateDataInFilter);
    
    // Bulk operations
    document.getElementById('selectAllCheckbox').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
        toggleBulkDeleteBtn();
    });
    document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDeleteData);

    // Verifikasi KIN
    document.getElementById('verifyButton').addEventListener('click', verifyKIN);
    document.getElementById('verifyInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyKIN();
        }
    });

    // Print and export
    document.getElementById('printPdfBtn').addEventListener('click', printData);
    document.getElementById('exportExcelBtn').addEventListener('click', () => exportData('xlsx'));
    document.getElementById('exportReloadJsBtn').addEventListener('click', () => backupData('reload.js'));
    document.getElementById('sendWaBtn').addEventListener('click', sendDataToWhatsapp);
    document.getElementById('backupDataBtn').addEventListener('click', () => backupData());
    document.getElementById('restoreFileInput').addEventListener('change', function() {
        document.getElementById('restoreDataBtn').disabled = !this.files.length;
    });
    document.getElementById('restoreDataBtn').addEventListener('click', restoreData);
    
    // Reload repo
    document.getElementById('btn-reload-repo').addEventListener('click', handleReloadRepo);
    
    // Detail modal PDF download
    document.getElementById('btnDownloadDetailPdf').addEventListener('click', () => {
        downloadSinglePdf(currentDetailId);
    });

    // Settings form
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
        appSettings.appSubtitle = document.getElementById('appSubtitle').value;
        appSettings.itemsPerPage = parseInt(document.getElementById('itemsPerPageSelect').value);
        saveSettings(); 
        updateAppIdentity(); 
        renderDataTable();
        showNotification('Pengaturan tersimpan! Nama instansi berhasil diperbarui.', 'success');
    });

    // Sensor code form
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

    // Privacy toggle
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

    // No WA button
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

    // Setup floating menu
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
        'fabUpload': 'v-pills-upload-tab',
        'fabFilter': 'v-pills-filter-tab', 
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

// ========================================
// FUNGSI CORE LOGIC
// ========================================

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
    
    // Validasi WhatsApp: jika bukan '00000000', maka harus 10-14 digit
    if(whatsapp !== '00000000' && (whatsapp.length < 10 || whatsapp.length > 14)) {
        return showNotification('WhatsApp harus 10-14 digit angka (atau pilih "Tidak Ada")', 'error');
    }
    
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
    document.querySelectorAll('.fish-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('jenisIkanLainnya').style.display = 'none';
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggalValidasi').value = today;
    
    document.getElementById('apiInfo').style.display = 'none';
    document.getElementById('kapalInfo').style.display = 'none';
    document.getElementById('profesiHelp').innerHTML = '';

    updateDashboard(); 
    renderDataTable();
    if (map) {
        renderMapMarkers();
        updateMapStatistics();
    }
    document.getElementById('v-pills-data-tab').click();
    checkGlobalDuplicates();
}

function renderDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    const search = document.getElementById('searchData').value.toLowerCase();
    let filtered = appData.filter(d => JSON.stringify(d).toLowerCase().includes(search));
    const nikCounts = {};
    appData.forEach(d => nikCounts[d.nik] = (nikCounts[d.nik] || 0) + 1);

    const totalItems = filtered.length;
    const start = (currentPage - 1) * appSettings.itemsPerPage;
    const pageData = filtered.slice(start, start + appSettings.itemsPerPage);

    tableBody.innerHTML = '';
    if(pageData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">Data tidak ditemukan</td></tr>`;
        toggleBulkDeleteBtn();
        return;
    }

    pageData.forEach((d, i) => {
        const kapalInfo = d.status === 'Pemilik Kapal' ? `<div class="text-truncate-2 small fw-bold text-primary">${d.namaKapal}</div><div class="small text-muted">${d.jenisKapal}</div>` : '-';
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
        tableBody.appendChild(document.createElement('tbody')).innerHTML = row;
    });
    document.getElementById('tableInfo').textContent = `Menampilkan ${pageData.length} dari ${totalItems} data (Limit: ${appSettings.itemsPerPage})`;
    updatePagination(totalItems);
    toggleBulkDeleteBtn();
}

function viewDetail(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;
    currentDetailId = id;
    document.getElementById('d_nama').innerText = d.nama;
    document.getElementById('d_nik').innerText = d.nik; 
    document.getElementById('d_usia').innerText = `${d.usia} Tahun (${d.tahunLahir})`;
    document.getElementById('d_wa').innerText = d.whatsapp;
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
    detailModal.show();
}

function updatePagination(total) {
    const pages = Math.ceil(total / appSettings.itemsPerPage);
    const ul = document.getElementById('pagination');
    ul.innerHTML = '';
    for(let i=1; i<=pages; i++) {
        ul.innerHTML += `<li class="page-item ${i===currentPage?'active':''}"><a class="page-link" href="#" onclick="currentPage=${i};renderDataTable()">${i}</a></li>`;
    }
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
        saveData(); renderDataTable(); updateDashboard();
        if (map) {
            renderMapMarkers();
            updateMapStatistics();
        }
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

    document.querySelectorAll('.fish-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('jenisIkanLainnya').style.display = 'none';
    document.getElementById('jenisIkanLainnya').value = '';
    
    if(d.jenisIkan) {
        const savedFish = d.jenisIkan.split(', ');
        savedFish.forEach(fish => {
            let found = false;
            document.querySelectorAll('.fish-checkbox').forEach(cb => {
                if(cb.value === fish) { cb.checked = true; found = true; }
            });
            if(!found) {
                const cbLain = document.getElementById('fish_Lainnya');
                cbLain.checked = true;
                const inputLain = document.getElementById('jenisIkanLainnya');
                inputLain.style.display = 'block';
                inputLain.value = fish;
            }
        });
    }

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
            saveData(); renderDataTable(); updateDashboard();
            if (map) {
                renderMapMarkers();
                updateMapStatistics();
            }
            showNotification('Data berhasil dihapus', 'success');
            checkGlobalDuplicates();
        }
    } else if (userCode !== null) alert("Kode keamanan sensor SALAH!");
}

function renderFilterTable() {
    const filters = {
        desa: document.getElementById('filterDesa').value,
        profesi: document.getElementById('filterProfesi').value,
        status: document.getElementById('filterStatus').value,
        jenisKapal: document.getElementById('filterJenisKapal').value,
        alatTangkap: document.getElementById('filterAlatTangkap').value,
        usaha: document.getElementById('filterUsaha').value
    };

    const filtered = appData.filter(d => {
        const matchDesa = !filters.desa || d.desa === filters.desa;
        const matchProfesi = !filters.profesi || d.profesi === filters.profesi;
        const matchStatus = !filters.status || d.status === filters.status;
        const matchJenis = !filters.jenisKapal || (d.status === 'Pemilik Kapal' && d.jenisKapal === filters.jenisKapal);
        const matchAlatTangkap = !filters.alatTangkap || d.alatTangkap === filters.alatTangkap;
        const matchUsaha = !filters.usaha || (filters.usaha === 'Ada' ? (d.usahaSampingan && d.usahaSampingan.length > 2) : (!d.usahaSampingan || d.usahaSampingan.length < 2));
        return matchDesa && matchProfesi && matchStatus && matchJenis && matchAlatTangkap && matchUsaha;
    });

    const tbody = document.getElementById('filterTableBody');
    tbody.innerHTML = '';
    if(filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada data yang cocok dengan filter</td></tr>`;
        return;
    }

    filtered.forEach((d, i) => {
        const displayNik = maskData(d.nik);
        let profesiBadge = 'bg-secondary';
        if(d.profesi === 'Nelayan Penuh Waktu') profesiBadge = 'badge-profesi-penuh';
        else if(d.profesi === 'Nelayan Sambilan Utama') profesiBadge = 'badge-profesi-sambilan-utama';
        else if(d.profesi === 'Nelayan Sambilan Tambahan') profesiBadge = 'badge-profesi-sambilan-tambahan';
        
        tbody.innerHTML += `<tr>
            <td>${i+1}</td>
            <td class="font-monospace small">${displayNik}</td>
            <td><div class="fw-bold text-truncate" style="max-width:200px;">${d.nama}</div><div class="small text-muted"><i class="fas fa-map-marker-alt me-1"></i>${d.kecamatan}, ${d.desa}</div></td>
            <td><span class="badge ${d.status === 'Pemilik Kapal' ? 'bg-info' : 'bg-secondary'}">${d.status}</span></td>
            <td><span class="badge bg-warning text-dark">${d.alatTangkap}</span></td>
            <td><span class="badge ${profesiBadge}">${d.profesi}</span></td>
            <td><div class="btn-group"><button class="btn btn-sm btn-info text-white" onclick="viewDetail('${d.id}')" title="Detail"><i class="fas fa-eye"></i></button><button class="btn btn-sm btn-warning" onclick="editData('${d.id}')" title="Edit"><i class="fas fa-pencil-alt"></i></button><button class="btn btn-sm btn-idcard" onclick="safeGenerateIDCard('${d.id}')" title="ID Card"><i class="fas fa-id-card"></i></button><button class="btn btn-sm btn-danger" onclick="deleteData('${d.id}')" title="Hapus"><i class="fas fa-trash"></i></button></div></td>
        </tr>`;
    });
    showNotification(`Filter berhasil: ${filtered.length} data ditemukan`, 'success');
}

function showDuplicateDataInFilter() {
    const counts = {};
    appData.forEach(d => counts[d.nik] = (counts[d.nik] || 0) + 1);
    const filtered = appData.filter(d => counts[d.nik] > 1);
    const tbody = document.getElementById('filterTableBody');
    tbody.innerHTML = '';
    
    if(filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-success"><i class="fas fa-check-circle me-2"></i>Hebat! Tidak ditemukan data NIK ganda.</td></tr>`;
        return;
    }
    filtered.sort((a,b) => a.nik.localeCompare(b.nik));
    filtered.forEach((d, i) => {
        const displayNik = maskData(d.nik);
        tbody.innerHTML += `<tr class="table-danger"><td>${i+1}</td><td class="fw-bold text-danger">${displayNik}</td><td><strong>${d.nama}</strong><br><small>${d.desa}</small></td><td>${d.status}</td><td>${d.alatTangkap}</td><td>${d.profesi}</td><td><div class="btn-group"><button class="btn btn-sm btn-warning" onclick="editData('${d.id}')"><i class="fas fa-pencil-alt"></i></button><button class="btn btn-sm btn-danger" onclick="deleteData('${d.id}')"><i class="fas fa-trash"></i></button></div></td></tr>`;
    });
    showNotification(`PERINGATAN: Ditemukan ${filtered.length} baris data ganda!`, 'error');
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
    const avgAge = appData.length ? Math.round(appData.reduce((acc, c) => acc + (parseInt(c.usia)||0), 0) / appData.length) : 0;
    document.getElementById('rataUsia').textContent = avgAge + " Thn";
    
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

// ========================================
// FUNGSI PERSISTENSI DATA
// ========================================

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
        Object.assign(appSettings, loadedSettings);
    }
}

// ========================================
// FUNGSI EKSPOR DAN BACKUP
// ========================================

function exportData(type) {
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
    const message = `Yth. Administrator Dinas Perikanan Kabupaten Situbondo,\n\nBerikut kami lampirkan data pembaruan Sistem Satu Data Nelayan dari:\n*${appSettings.appSubtitle}*\n\nTanggal Laporan: ${new Date().toLocaleDateString('id-ID')}\nTotal Data: ${appData.length} Records\n\nFile lampiran (reload.js) telah kami sertakan pada pesan ini untuk proses sinkronisasi data.\n\nTerima Kasih.`;
    const url = `https://wa.me/6287865614222?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function backupData(filename = 'backup.json') {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = filename;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Backup data berhasil diunduh.', 'success');
}

function restoreData() {
    const fileInput = document.getElementById('restoreFileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Pilih file terlebih dahulu.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let backupData;
            
            // Coba parse sebagai JSON
            if (file.name.endsWith('.json') || file.name.endsWith('.txt')) {
                backupData = JSON.parse(content);
            } 
            // Coba parse sebagai JavaScript (reload.js)
            else if (file.name.endsWith('.js')) {
                // Ekstrak data dari file JS
                const match = content.match(/SIMATA_BACKUP_ENCRYPTED\s*=\s*(\[.*?\])/s);
                if (match && match[1]) {
                    backupData = JSON.parse(match[1]);
                } else {
                    throw new Error('Format file reload.js tidak valid');
                }
            } else {
                throw new Error('Format file tidak didukung');
            }
            
            if (!Array.isArray(backupData)) {
                throw new Error('Data backup harus berupa array');
            }
            
            // Konfirmasi restore
            if (confirm(`Anda akan menggabungkan ${backupData.length} data dari backup dengan ${appData.length} data yang ada. Lanjutkan?`)) {
                // Merge data
                const oldLength = appData.length;
                let added = 0;
                let updated = 0;
                
                backupData.forEach(newItem => {
                    const existingIndex = appData.findIndex(item => item.nik === newItem.nik);
                    
                    if (existingIndex >= 0) {
                        // Update data yang sudah ada
                        appData[existingIndex] = { ...appData[existingIndex], ...newItem };
                        updated++;
                    } else {
                        // Tambah data baru
                        appData.push(newItem);
                        added++;
                    }
                });
                
                saveData();
                updateDashboard();
                renderDataTable();
                
                if (map) {
                    renderMapMarkers();
                    updateMapStatistics();
                }
                
                showNotification(`Restore berhasil! ${added} data baru ditambahkan, ${updated} data diperbarui.`, 'success');
                
                // Reset file input
                fileInput.value = '';
                document.getElementById('restoreDataBtn').disabled = true;
                
                // Cek duplikasi setelah restore
                checkGlobalDuplicates();
            }
            
        } catch (error) {
            console.error('Error restoring data:', error);
            showNotification(`Gagal memproses file: ${error.message}`, 'error');
        }
    };
    
    reader.readAsText(file);
}

// ========================================
// FUNGSI PRINT PDF
// ========================================

function printData() {
    const desaStats = {};
    appData.forEach(d => {
        const desa = d.desa || "Tidak Diketahui";
        if (!desaStats[desa]) {
            desaStats[desa] = { count: 0, owner: 0, abk: 0, penuhWaktu: 0, sambilanUtama: 0, sambilanTambahan: 0 };
        }
        desaStats[desa].count++;
        if(d.status === 'Pemilik Kapal') desaStats[desa].owner++; else desaStats[desa].abk++;
        if(d.profesi === 'Nelayan Penuh Waktu') desaStats[desa].penuhWaktu++;
        else if(d.profesi === 'Nelayan Sambilan Utama') desaStats[desa].sambilanUtama++;
        else if(d.profesi === 'Nelayan Sambilan Tambahan') desaStats[desa].sambilanTambahan++;
    });

    const tableRows = Object.keys(desaStats).sort().map((desa, index) => [
        index + 1, desa, desaStats[desa].count, desaStats[desa].owner,
        desaStats[desa].abk, desaStats[desa].penuhWaktu, desaStats[desa].sambilanUtama,
        desaStats[desa].sambilanTambahan
    ]);

    const totalNelayan = appData.length;
    const totalPenuhWaktu = appData.filter(d => d.profesi === 'Nelayan Penuh Waktu').length;
    const totalSambilanUtama = appData.filter(d => d.profesi === 'Nelayan Sambilan Utama').length;
    const totalSambilanTambahan = appData.filter(d => d.profesi === 'Nelayan Sambilan Tambahan').length;
    
    document.getElementById('qr-right').innerHTML = "";
    const signText = `DOKUMEN REKAPITULASI RESMI\nDINAS PERIKANAN KAB. SITUBONDO\nInstansi: ${appSettings.appSubtitle}\nTotal Data: ${totalNelayan}\nTimestamp: ${new Date().toISOString()}`;
    new QRCode(document.getElementById("qr-right"), { 
        text: signText, width: 256, height: 256,
        colorDark: "#0984e3", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M
    });

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');

        doc.setFillColor(12, 36, 97);
        doc.rect(0, 0, 297, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16); doc.setFont('helvetica', 'bold');
        doc.text(appSettings.appName.toUpperCase(), 148.5, 12, { align: 'center' });
        doc.setFontSize(18);
        doc.text('DINAS PERIKANAN', 148.5, 20, { align: 'center' });
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(appSettings.appSubtitle, 148.5, 28, { align: 'center' });
        doc.setFont('times', 'italic'); doc.setFontSize(11); doc.setTextColor(246, 185, 59);
        doc.text('"Situbondo Naik Kelas - Sistem Satu Data Kelautan & Perikanan"', 148.5, 35, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
        doc.text(`LAPORAN REKAPITULASI DATA NELAYAN PER DESA`, 148.5, 50, { align: 'center' });
        doc.setFontSize(10); doc.setFont('helvetica', 'normal');
        doc.text(`Per Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric'})}`, 148.5, 55, { align: 'center' });

        doc.autoTable({
            head: [['No', 'Desa / Kelurahan', 'Jml Nelayan', 'Pemilik Kapal', 'ABK', 'Nelayan Penuh Waktu', 'Nelayan Sambilan Utama', 'Nelayan Sambilan Tambahan']],
            body: tableRows,
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [12, 36, 97], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
            columnStyles: {
                0: { halign: 'center' },
                2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' },
                5: { halign: 'center' }, 6: { halign: 'center' }, 7: { halign: 'center' }
            }
        });

        const qrRightCanvas = document.querySelector('#qr-right canvas');
        if(qrRightCanvas) {
            const imgRight = qrRightCanvas.toDataURL("image/png");
            doc.addImage(imgRight, 'PNG', 250, 180, 30, 30);
        }

        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Halaman ${i} dari ${totalPages}`, 148.5, 205, { align: 'center' });
        }

        doc.save(`Laporan_Data_Nelayan_${new Date().toISOString().slice(0,10)}.pdf`);
        document.getElementById('qr-right').innerHTML = "";

    }, 500);
}

function downloadSinglePdf(id) {
    const d = appData.find(item => item.id == id);
    if(!d) return;

    document.getElementById('qr-right').innerHTML = "";
    const signatureText = `DOKUMEN SAH\nNama: SUGENG PURWO PRIYANTO, S.E, M.M\nJabatan: Kabid Pemberdayaan Nelayan\nRef: ${d.kodeValidasi || 'N/A'}`;
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
        printLine('NIK', d.nik);
        printLine('Tempat / Tgl Lahir', `${d.tahunLahir} (Usia: ${d.usia} Thn)`);
        printLine('Domisili', `${d.desa}, ${d.kecamatan}`);
        printLine('No. Handphone', d.whatsapp);
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
        doc.text("www.disnakansitubondo.com/simata", leftX + 35, footerY + 25, {align: 'center'});

        doc.setFontSize(10); doc.setTextColor(0,0,0); doc.setFont('helvetica', 'normal');
        const dateStr = new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
        doc.text(`Situbondo, ${dateStr}`, sigCenterX, footerY - 5, {align: 'center'});
        doc.text('Diketahui Oleh :', sigCenterX, footerY, {align: 'center'});
        doc.setFont('helvetica', 'bold');
        doc.text('Kepala Bidang Pemberdayaan Nelayan', sigCenterX, footerY + 5, {align: 'center'});

        const qrRightCanvas = document.querySelector('#qr-right canvas');
        if(qrRightCanvas) {
            const imgRight = qrRightCanvas.toDataURL("image/png");
            doc.addImage(imgRight, 'PNG', sigCenterX - 12.5, footerY + 8, 25, 25); 
        }

        const nameY = footerY + 38; 
        doc.text('SUGENG PURWO PRIYANTO, S.E, M.M', sigCenterX, nameY, {align: 'center'});
        doc.setFont('helvetica', 'normal');
        doc.text('NIP. 19761103 200903 1 001', sigCenterX, nameY + 5, {align: 'center'});

        doc.setFontSize(7); doc.setTextColor(150);
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

// ========================================
// FUNGSI HANDLE HASH ROUTING
// ========================================

function handleHashRouting() {
    const hash = window.location.hash;
    
    if (hash === '#verifikasi') {
        // Aktifkan tab verifikasi
        document.getElementById('v-pills-verify-tab').click();
        
        // Scroll ke bagian verifikasi
        setTimeout(() => {
            document.getElementById('v-pills-verify').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

// ========================================
// EKSPOR FUNGSI KE GLOBAL SCOPE
// ========================================

window.verifyKIN = verifyKIN;
window.toggleFAQ = toggleFAQ;
window.resetVerification = resetVerification;
window.generateSimataIDCard = generateSimataIDCard;
window.previewIDCardHTML = previewIDCardHTML;
window.batchGenerateIDCards = batchGenerateIDCards;
window.showIDCardPreview = showIDCardPreview;
window.getProfesiColor = getProfesiColor;
window.getStatusColor = getStatusColor;
window.checkRequiredLibraries = checkRequiredLibraries;
window.switchMapView = switchMapView;
window.resetMapView = resetMapView;
window.zoomToAllMarkers = zoomToAllMarkers;
window.toggleCluster = toggleCluster;
window.safeGenerateIDCard = safeGenerateIDCard;
window.handleFileSelect = handleFileSelect;
window.processExcelFile = processExcelFile;
window.downloadTemplate = downloadTemplate;

console.log('✅ SIMATA v5.4 - Input Cepat Excel & Verifikasi KIN loaded successfully');
