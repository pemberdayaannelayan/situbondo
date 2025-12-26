// Data Koordinat dan Wilayah
const SITUBONDO_DATA = {
    "Arjasa": ["Arjasa", "Bayeman", "Curah Tatal", "Jatisari", "Kayumas", "Kedungdowo", "Ketowan", "Lamongan"],
    "Asembagus": ["Asembagus", "Awar-awar", "Bantal", "Gudang", "Kedunglo", "Kertosari", "Mojosari", "Parante", "Trigonco", "Wringin Anom"],
    // ... semua data kecamatan dan desa
};

const COORDINATES_DATA = {
    "Panarukan, Alasmalang": [-7.6970, 113.7687],
    "Panarukan, Duwet": [-7.6977, 113.7882],
    // ... semua koordinat
};

const DEFAULT_COORDINATES = {
    "Arjasa": [-7.7825, 113.7900],
    "Asembagus": [-7.7533, 114.2500],
    // ... default coordinates
};

const FISH_TYPES = [
    "Lainnya", "Ikan Tongkol", "Ikan Kembung", "Ikan Selar", "Ikan Tenggiri", "Ikan Layang", 
    "Cumi-cumi", "Ikan Teri", "Kakap Merah", "Ikan Barakuda", "Kepiting",
    "Ikan Layur", "Ikan Mangla", "Ikan Kurisi", "Ikan Cakalang", "Ikan Kerapu", "Ikan Lemuru"
];

const API_INFO = {
    "Pukat Cincin": "Alat tangkap berupa jaring besar berbentuk cincin yang ditarik mengelilingi gerombolan ikan...",
    // ... semua API info
};

const KAPAL_INFO = {
    "Perahu Jukung": "Perahu tradisional kayu kecil, umumnya tanpa mesin atau bermesin kecil...",
    // ... semua kapal info
};

const PROFESI_INFO = {
    "Nelayan Penuh Waktu": "Nelayan yang bekerja sebagai penangkap ikan sebagai mata pencaharian utama...",
    // ... semua profesi info
};

// Variabel Peta Global
let map = null;
let markers = null;
let currentMarkers = [];
let mapView = 'all';

// Fungsi untuk mendapatkan koordinat
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

// Inisialisasi Peta
function initializeMap() {
    if (map) {
        map.remove();
        if (markers) markers.clearLayers();
        currentMarkers = [];
    }
    
    map = L.map('map').setView([-7.7068, 113.9142], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
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

// Render Marker pada Peta
function renderMapMarkers() {
    if (!map || !markers) return;
    
    markers.clearLayers();
    currentMarkers = [];
    
    if (!window.appData || window.appData.length === 0) return;
    
    const kecamatanCount = {};
    const desaCount = {};
    let pemilikKapalCount = 0;
    
    window.appData.forEach((nelayan) => {
        kecamatanCount[nelayan.kecamatan] = (kecamatanCount[nelayan.kecamatan] || 0) + 1;
        desaCount[nelayan.desa] = (desaCount[nelayan.desa] || 0) + 1;
        if (nelayan.status === 'Pemilik Kapal') pemilikKapalCount++;
        
        const coordinates = getCoordinatesForLocation(nelayan.kecamatan, nelayan.desa);
        
        // Tentukan warna dan ikon berdasarkan profesi dan status
        let markerColor = '#0c2461';
        let markerClass = 'marker-penuh';
        let iconClass = 'fa-user';
        
        if (nelayan.profesi === 'Nelayan Sambilan Utama') {
            markerColor = '#e58e26';
            markerClass = 'marker-sambilan-utama';
        } else if (nelayan.profesi === 'Nelayan Sambilan Tambahan') {
            markerColor = '#27ae60';
            markerClass = 'marker-sambilan-tambahan';
        }
        
        if (nelayan.status === 'Pemilik Kapal') {
            markerColor = '#0984e3';
            markerClass = 'marker-pemilik';
            iconClass = 'fa-ship';
        } else if (nelayan.status === 'Anak Buah Kapal') {
            markerColor = '#a55eea';
            markerClass = 'marker-abk';
            iconClass = 'fa-users';
        }
        
        // Buat custom icon
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
        
        // Konten popup
        const popupContent = `
            <div class="leaflet-popup-content">
                <h4>${nelayan.nama}</h4>
                <div class="popup-detail">
                    <span class="popup-label">NIK:</span>
                    <span class="popup-value">${maskData ? maskData(nelayan.nik) : nelayan.nik}</span>
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
                    <span class="popup-label">Domisili:</span>
                    <span class="popup-value">${nelayan.desa}, ${nelayan.kecamatan}</span>
                </div>
                <div class="popup-detail">
                    <button class="btn btn-sm btn-primary w-100 mt-2" onclick="window.viewDetail('${nelayan.id}')">
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
    
    // Update statistik
    if (document.getElementById('map-total-points')) {
        document.getElementById('map-total-points').textContent = window.appData.length;
        document.getElementById('map-total-kecamatan').textContent = Object.keys(kecamatanCount).length;
        document.getElementById('map-total-desa').textContent = Object.keys(desaCount).length;
        document.getElementById('map-total-kapal').textContent = pemilikKapalCount;
    }
}

// Update Statistik Peta
function updateMapStatistics() {
    if (!window.appData || window.appData.length === 0) return;
    
    const kecamatanCount = {};
    const desaCount = {};
    let pemilikKapalCount = 0;
    
    window.appData.forEach(nelayan => {
        kecamatanCount[nelayan.kecamatan] = (kecamatanCount[nelayan.kecamatan] || 0) + 1;
        desaCount[nelayan.desa] = (desaCount[nelayan.desa] || 0) + 1;
        if (nelayan.status === 'Pemilik Kapal') pemilikKapalCount++;
    });
    
    if (document.getElementById('map-total-points')) {
        document.getElementById('map-total-points').textContent = window.appData.length;
        document.getElementById('map-total-kecamatan').textContent = Object.keys(kecamatanCount).length;
        document.getElementById('map-total-desa').textContent = Object.keys(desaCount).length;
        document.getElementById('map-total-kapal').textContent = pemilikKapalCount;
    }
}

// Fungsi untuk Switch View Peta
function switchMapView(view) {
    mapView = view;
    
    // Update tab aktif
    document.querySelectorAll('.map-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderMapMarkers();
    
    let viewName = 'Semua Data';
    if (view === 'profesi') viewName = 'Berdasarkan Profesi';
    else if (view === 'kecamatan') viewName = 'Berdasarkan Kecamatan';
    
    if (window.showNotification) {
        showNotification(`Peta ditampilkan dengan view: ${viewName}`, 'info');
    }
}

// Reset View Peta
function resetMapView() {
    if (map) {
        map.setView([-7.7068, 113.9142], 11);
        if (window.showNotification) {
            showNotification('Peta direset ke view awal', 'info');
        }
    }
}

// Zoom ke Semua Marker
function zoomToAllMarkers() {
    if (map && currentMarkers.length > 0) {
        const group = L.featureGroup(currentMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
        if (window.showNotification) {
            showNotification('Zoom ke semua marker', 'info');
        }
    }
}

// Toggle Cluster Marker
function toggleCluster() {
    const showCluster = document.getElementById('showCluster').checked;
    
    if (showCluster) {
        markers.addTo(map);
        if (window.showNotification) {
            showNotification('Mode grup marker diaktifkan', 'info');
        }
    } else {
        map.removeLayer(markers);
        currentMarkers.forEach(marker => {
            marker.addTo(map);
        });
        if (window.showNotification) {
            showNotification('Mode grup marker dinonaktifkan', 'info');
        }
    }
}

// Ekspor fungsi ke global scope
window.SITUBONDO_DATA = SITUBONDO_DATA;
window.FISH_TYPES = FISH_TYPES;
window.API_INFO = API_INFO;
window.KAPAL_INFO = KAPAL_INFO;
window.PROFESI_INFO = PROFESI_INFO;
window.getCoordinatesForLocation = getCoordinatesForLocation;
window.initializeMap = initializeMap;
window.renderMapMarkers = renderMapMarkers;
window.updateMapStatistics = updateMapStatistics;
window.switchMapView = switchMapView;
window.resetMapView = resetMapView;
window.zoomToAllMarkers = zoomToAllMarkers;
window.toggleCluster = toggleCluster;
