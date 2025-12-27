// koordinatpeta.js
// Data koordinat dan fungsi peta untuk SIMATA

// Data wilayah Situbondo
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

// Data koordinat spesifik
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

// Data koordinat default
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

// Variabel global untuk peta
let map = null;
let markers = null;
let currentMarkers = [];
let mapView = 'all';

// --- FUNGSI UNTUK MENDAPATKAN KOORDINAT BERDASARKAN DESA ---
function getCoordinatesForLocation(kecamatan, desa) {
    const key = `${kecamatan}, ${desa}`;
    
    if (COORDINATES_DATA[key]) {
        return COORDINATES_DATA[key];
    }
    
    if (DEFAULT_COORDINATES[kecamatan]) {
        return DEFAULT_COORDINATES[kecamatan];
    }
    
    return [-7.7068, 113.9142]; // Koordinat default Situbondo
}

// --- FUNGSI UNTUK INISIALISASI PETA ---
function initializeMap() {
    if (map) {
        map.remove();
        if (markers) {
            markers.clearLayers();
        }
        currentMarkers = [];
    }
    
    map = L.map('map').setView([-7.7068, 113.9142], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 15
    });
    
    markers.addTo(map);
    
    renderMapMarkers();
    updateMapStatistics();
}

// --- FUNGSI UNTUK RENDER MARKER PADA PETA ---
function renderMapMarkers() {
    if (!map || !markers) return;
    
    markers.clearLayers();
    currentMarkers = [];
    
    // Pastikan appData tersedia di window
    const appData = window.appData || [];
    if (!appData || appData.length === 0) return;
    
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
                    <span class="popup-value">${window.maskData ? window.maskData(nelayan.nik) : nelayan.nik}</span>
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
                    <button class="btn btn-sm btn-primary w-100 mt-2" onclick="window.viewDetail && window.viewDetail('${nelayan.id}')">
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
    
    if (document.getElementById('map-total-points')) {
        document.getElementById('map-total-points').textContent = appData.length;
        document.getElementById('map-total-kecamatan').textContent = Object.keys(kecamatanCount).length;
        document.getElementById('map-total-desa').textContent = Object.keys(desaCount).length;
        document.getElementById('map-total-kapal').textContent = pemilikKapalCount;
    }
}

// --- FUNGSI UNTUK UPDATE STATISTIK PETA ---
function updateMapStatistics() {
    const appData = window.appData || [];
    if (appData.length === 0) return;
    
    const kecamatanCount = {};
    const desaCount = {};
    let pemilikKapalCount = 0;
    
    appData.forEach(nelayan => {
        kecamatanCount[nelayan.kecamatan] = (kecamatanCount[nelayan.kecamatan] || 0) + 1;
        desaCount[nelayan.desa] = (desaCount[nelayan.desa] || 0) + 1;
        if (nelayan.status === 'Pemilik Kapal') pemilikKapalCount++;
    });
    
    if (document.getElementById('map-total-points')) {
        document.getElementById('map-total-points').textContent = appData.length;
        document.getElementById('map-total-kecamatan').textContent = Object.keys(kecamatanCount).length;
        document.getElementById('map-total-desa').textContent = Object.keys(desaCount).length;
        document.getElementById('map-total-kapal').textContent = pemilikKapalCount;
    }
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
    
    if (window.showNotification) {
        window.showNotification(`Peta ditampilkan dengan view: ${viewName}`, 'info');
    }
}

// --- FUNGSI UNTUK RESET VIEW PETA ---
function resetMapView() {
    if (map) {
        map.setView([-7.7068, 113.9142], 11);
        if (window.showNotification) {
            window.showNotification('Peta direset ke view awal', 'info');
        }
    }
}

// --- FUNGSI UNTUK ZOOM KE SEMUA MARKER ---
function zoomToAllMarkers() {
    if (map && currentMarkers.length > 0) {
        const group = L.featureGroup(currentMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
        if (window.showNotification) {
            window.showNotification('Zoom ke semua marker', 'info');
        }
    }
}

// --- FUNGSI UNTUK TOGGLE CLUSTER MARKER ---
function toggleCluster() {
    const showCluster = document.getElementById('showCluster');
    if (!showCluster || !map) return;
    
    if (showCluster.checked) {
        markers.addTo(map);
        if (window.showNotification) {
            window.showNotification('Mode grup marker diaktifkan', 'info');
        }
    } else {
        map.removeLayer(markers);
        currentMarkers.forEach(marker => {
            marker.addTo(map);
        });
        if (window.showNotification) {
            window.showNotification('Mode grup marker dinonaktifkan', 'info');
        }
    }
}

// Fungsi untuk menampilkan kembali kontrol dan legenda peta
function showMapControls() {
    const controls = document.querySelector('.map-controls');
    const legend = document.querySelector('.map-legend');
    if (controls) controls.style.display = 'flex';
    if (legend) legend.style.display = 'block';
}

// Ekspos fungsi-fungsi ke window agar bisa diakses dari index.html
window.SITUBONDO_DATA = SITUBONDO_DATA;
window.COORDINATES_DATA = COORDINATES_DATA;
window.DEFAULT_COORDINATES = DEFAULT_COORDINATES;
window.getCoordinatesForLocation = getCoordinatesForLocation;
window.initializeMap = initializeMap;
window.renderMapMarkers = renderMapMarkers;
window.updateMapStatistics = updateMapStatistics;
window.switchMapView = switchMapView;
window.resetMapView = resetMapView;
window.zoomToAllMarkers = zoomToAllMarkers;
window.toggleCluster = toggleCluster;
window.showMapControls = showMapControls;

console.log('✅ SIMATA Peta & Koordinat module loaded successfully');
