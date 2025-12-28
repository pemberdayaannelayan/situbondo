// koordinatpeta.js
// Data koordinat dan fungsi peta untuk SIMATA - VERSI DIPERBAIKI

// Data wilayah Situbondo (LENGKAP)
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

// Data koordinat spesifik lengkap untuk semua desa
const COORDINATES_DATA = {
    // Arjasa
    "Arjasa, Arjasa": [-7.7825, 113.7900],
    "Arjasa, Bayeman": [-7.7722, 113.8123],
    "Arjasa, Curah Tatal": [-7.7921, 113.8024],
    "Arjasa, Jatisari": [-7.7754, 113.7856],
    "Arjasa, Kayumas": [-7.7658, 113.7987],
    "Arjasa, Kedungdowo": [-7.7812, 113.8156],
    "Arjasa, Ketowan": [-7.7955, 113.7921],
    "Arjasa, Lamongan": [-7.8032, 113.8054],
    
    // Asembagus
    "Asembagus, Asembagus": [-7.7533, 114.2500],
    "Asembagus, Awar-awar": [-7.7689, 114.2367],
    "Asembagus, Bantal": [-7.7421, 114.2412],
    "Asembagus, Gudang": [-7.7315, 114.2556],
    "Asembagus, Kedunglo": [-7.7254, 114.2298],
    "Asembagus, Kertosari": [-7.7612, 114.2214],
    "Asembagus, Mojosari": [-7.7398, 114.2189],
    "Asembagus, Parante": [-7.7521, 114.2334],
    "Asembagus, Trigonco": [-7.7445, 114.2456],
    "Asembagus, Wringin Anom": [-7.7367, 114.2289],
    
    // Banyuglugur
    "Banyuglugur, Banyuglugur": [-7.8000, 113.8667],
    "Banyuglugur, Kalianget": [-7.8123, 113.8545],
    "Banyuglugur, Kalisari": [-7.7987, 113.8790],
    "Banyuglugur, Lubawang": [-7.8156, 113.8712],
    "Banyuglugur, Selobanteng": [-7.8254, 113.8614],
    "Banyuglugur, Telempong": [-7.8112, 113.8456],
    "Banyuglugur, Tepos": [-7.8045, 113.8321],
    
    // Banyuputih
    "Banyuputih, Banyuputih": [-7.7167, 114.0833],
    "Banyuputih, Sumberanyar": [-7.7289, 114.0912],
    "Banyuputih, Sumberejo": [-7.7123, 114.0754],
    "Banyuputih, Sumberwaru": [-7.7056, 114.0987],
    "Banyuputih, Wonorejo": [-7.7245, 114.0689],
    
    // Besuki
    "Besuki, Besuki": [-7.7333, 113.7000],
    "Besuki, Blimbing": [-7.7256, 113.7123],
    "Besuki, Bloro": [-7.7412, 113.6954],
    "Besuki, Demung": [-7.7189, 113.6887],
    "Besuki, Jetis": [-7.7521, 113.7056],
    "Besuki, Kalimas": [-7.7367, 113.7189],
    "Besuki, Langkap": [-7.7456, 113.7321],
    "Besuki, Pesisir": [-7.7123, 113.7254],
    "Besuki, Sumberejo": [-7.7298, 113.7412],
    "Besuki, Widoropayung": [-7.7045, 113.7387],
    
    // Bungatan
    "Bungatan, Bletok": [-7.6500, 113.8833],
    "Bungatan, Bungatan": [-7.6612, 113.8754],
    "Bungatan, Mlandingan Wetan": [-7.6456, 113.8912],
    "Bungatan, Pasir Putih": [-7.6321, 113.9056],
    "Bungatan, Patemon": [-7.6754, 113.8987],
    "Bungatan, Selowogo": [-7.6589, 113.9123],
    "Bungatan, Sumbertengah": [-7.6414, 113.9256],
    
    // Jangkar
    "Jangkar, Agel": [-7.7667, 114.1667],
    "Jangkar, Curah Kalak": [-7.7754, 114.1521],
    "Jangkar, Gadingan": [-7.7889, 114.1687],
    "Jangkar, Jangkar": [-7.7912, 114.1756],
    "Jangkar, Kumbangsari": [-7.7687, 114.1423],
    "Jangkar, Palangan": [-7.7521, 114.1589],
    "Jangkar, Pesanggrahan": [-7.7414, 114.1656],
    "Jangkar, Sopet": [-7.7345, 114.1721],
    
    // Jatibanteng
    "Jatibanteng, Curahsuri": [-7.8000, 113.9333],
    "Jatibanteng, Jatibanteng": [-7.8123, 113.9456],
    "Jatibanteng, Kembangsari": [-7.7987, 113.9254],
    "Jatibanteng, Pategalan": [-7.8156, 113.9123],
    "Jatibanteng, Patemon": [-7.7912, 113.9589],
    "Jatibanteng, Semambung": [-7.8254, 113.9312],
    "Jatibanteng, Sumberanyar": [-7.8045, 113.9687],
    "Jatibanteng, Wringinanom": [-7.8367, 113.9456],
    
    // Kapongan
    "Kapongan, Curah Cottok Gebangan": [-7.6833, 114.0667],
    "Kapongan, Kandang": [-7.6721, 114.0589],
    "Kapongan, Kapongan": [-7.6956, 114.0723],
    "Kapongan, Kesambi Rampak": [-7.6887, 114.0456],
    "Kapongan, Landangan": [-7.7123, 114.0612],
    "Kapongan, Peleyan": [-7.7045, 114.0789],
    "Kapongan, Pokaan": [-7.6754, 114.0912],
    "Kapongan, Seletreng": [-7.6912, 114.1056],
    "Kapongan, Wonokoyo": [-7.6589, 114.0721],
    
    // Kendit
    "Kendit, Balung": [-7.7167, 113.9167],
    "Kendit, Bugeman": [-7.7056, 113.9289],
    "Kendit, Kendit": [-7.7321, 113.9054],
    "Kendit, Klatakan": [-7.7245, 113.9412],
    "Kendit, Kukusan": [-7.7123, 113.9587],
    "Kendit, Rajekwesi": [-7.6912, 113.9356],
    "Kendit, Tambak Ukir": [-7.6754, 113.9123],
    
    // Mangaran
    "Mangaran, Mangaran": [-7.6667, 114.0500],
    "Mangaran, Semiring": [-7.6521, 114.0612],
    "Mangaran, Tanjung Glugur": [-7.6789, 114.0456],
    "Mangaran, Tanjung Kamal": [-7.6645, 114.0723],
    "Mangaran, Tanjung Pecinan": [-7.6912, 114.0589],
    "Mangaran, Trebungan": [-7.7045, 114.0312],
    
    // Mlandingan
    "Mlandingan, Alas Bayur": [-7.6667, 113.8667],
    "Mlandingan, Campoan": [-7.6521, 113.8789],
    "Mlandingan, Mlandingan Kulon": [-7.6789, 113.8456],
    "Mlandingan, Selomukti": [-7.6912, 113.9123],
    "Mlandingan, Sumberanyar": [-7.7045, 113.8954],
    "Mlandingan, Sumber Pinang": [-7.7254, 113.8821],
    "Mlandingan, Trebungan": [-7.6589, 113.9312],
    
    // Panarukan
    "Panarukan, Alasmalang": [-7.6970, 113.7687],
    "Panarukan, Duwet": [-7.6977, 113.7882],
    "Panarukan, Gelung": [-7.7134, 113.8028],
    "Panarukan, Kilensari": [-7.6843, 113.7656],
    "Panarukan, Paowan": [-7.7298, 113.7800],
    "Panarukan, Peleyan": [-7.6950, 113.8071],
    "Panarukan, Sumberkolak": [-7.7118, 113.7618],
    "Panarukan, Wringinanom": [-7.7061, 113.8256],
    
    // Panji
    "Panji, Ardirejo": [-7.7155, 113.6944],
    "Panji, Mimbaan": [-7.7091, 113.6952],
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
    
    // Situbondo
    "Situbondo, Dawuhan": [-7.6926, 113.9937],
    "Situbondo, Patokan": [-7.6729, 113.9771],
    "Situbondo, Kalibagor": [-7.7082, 114.0061],
    "Situbondo, Kotakan": [-7.6814, 114.0225],
    "Situbondo, Olean": [-7.6819, 114.0367],
    "Situbondo, Talkandang": [-7.6681, 114.0475],
    
    // Suboh
    "Suboh, Buduan": [-7.8523, 113.7659],
    "Suboh, Cemara": [-7.8267, 113.7425],
    "Suboh, Dawuan": [-7.8398, 113.7719],
    "Suboh, Gunung Malang": [-7.8708, 113.7489],
    "Suboh, Gunung Putri": [-7.8647, 113.7325],
    "Suboh, Ketah": [-7.8614, 113.7894],
    "Suboh, Mojodungkol": [-7.8360, 113.7829],
    "Suboh, Suboh": [-7.8475, 113.7580],
    
    // Sumbermalang
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

// Data koordinat default untuk kecamatan yang belum lengkap
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
    
    // Cari koordinat spesifik
    if (COORDINATES_DATA[key]) {
        return COORDINATES_DATA[key];
    }
    
    // Jika tidak ditemukan, gunakan koordinat default kecamatan
    if (DEFAULT_COORDINATES[kecamatan]) {
        return DEFAULT_COORDINATES[kecamatan];
    }
    
    // Default fallback: pusat Situbondo
    return [-7.7068, 113.9142];
}

// --- FUNGSI UNTUK INISIALISASI PETA ---
function initializeMap() {
    console.log('🔄 Inisialisasi peta...');
    
    if (map) {
        try {
            map.remove();
        } catch (e) {
            console.log('Peta sudah dihapus');
        }
    }
    
    if (markers) {
        try {
            markers.clearLayers();
        } catch (e) {
            console.log('Marker cluster sudah dihapus');
        }
    }
    
    currentMarkers = [];
    
    // Tunggu elemen map tersedia
    setTimeout(() => {
        try {
            map = L.map('map', {
                preferCanvas: true,
                zoomControl: true,
                scrollWheelZoom: true
            }).setView([-7.7068, 113.9142], 11);
            
            // Tambahkan tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                minZoom: 9
            }).addTo(map);
            
            // Inisialisasi marker cluster
            markers = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 50,
                spiderfyOnMaxZoom: true,
                disableClusteringAtZoom: 16,
                chunkedLoading: true
            });
            
            markers.addTo(map);
            
            // Render marker setelah peta siap
            setTimeout(() => {
                renderMapMarkers();
                updateMapStatistics();
                console.log('✅ Peta berhasil diinisialisasi');
            }, 500);
            
        } catch (error) {
            console.error('❌ Error inisialisasi peta:', error);
        }
    }, 100);
}

// --- FUNGSI UNTUK RENDER MARKER PADA PETA ---
function renderMapMarkers() {
    console.log('🔄 Rendering marker peta...');
    
    if (!map || !markers) {
        console.warn('❌ Peta atau markers belum diinisialisasi');
        return;
    }
    
    // Clear existing markers
    markers.clearLayers();
    currentMarkers = [];
    
    // Dapatkan data dari appData global
    const appData = window.appData || [];
    
    if (!appData || appData.length === 0) {
        console.log('ℹ️ Tidak ada data nelayan untuk ditampilkan');
        return;
    }
    
    console.log(`📍 Akan render ${appData.length} marker`);
    
    const kecamatanCount = {};
    const desaCount = {};
    let pemilikKapalCount = 0;
    
    // Render setiap nelayan
    appData.forEach((nelayan, index) => {
        // Hitung statistik
        kecamatanCount[nelayan.kecamatan] = (kecamatanCount[nelayan.kecamatan] || 0) + 1;
        desaCount[nelayan.desa] = (desaCount[nelayan.desa] || 0) + 1;
        if (nelayan.status === 'Pemilik Kapal') pemilikKapalCount++;
        
        // Dapatkan koordinat
        let coordinates;
        try {
            coordinates = getCoordinatesForLocation(nelayan.kecamatan, nelayan.desa);
        } catch (error) {
            console.warn(`⚠️ Koordinat tidak ditemukan untuk ${nelayan.kecamatan}, ${nelayan.desa}`);
            coordinates = [-7.7068, 113.9142]; // Default
        }
        
        // Tentukan warna dan ikon berdasarkan profesi/status
        let markerColor = '#0c2461'; // Default: Penuh Waktu
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
            html: `
                <div class="marker-icon ${markerClass}" 
                     style="background-color: ${markerColor}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
                    <i class="fas ${iconClass}"></i>
                </div>
            `,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
        
        // Buat konten popup
        const maskData = window.maskData || function(data) { return data; };
        const displayNik = maskData(nelayan.nik);
        
        const popupContent = `
            <div class="leaflet-popup-content" style="min-width: 250px;">
                <h5 style="margin: 0 0 10px 0; color: #0c2461;">${nelayan.nama}</h5>
                <div style="font-size: 12px; color: #666;">
                    <div><strong>NIK:</strong> ${displayNik}</div>
                    <div><strong>Usia:</strong> ${nelayan.usia} Tahun</div>
                    <div><strong>Profesi:</strong> ${nelayan.profesi}</div>
                    <div><strong>Status:</strong> ${nelayan.status}</div>
                    <div><strong>Domisili:</strong> ${nelayan.desa}, ${nelayan.kecamatan}</div>
                    <div><strong>API:</strong> ${nelayan.alatTangkap}</div>
                    ${nelayan.status === 'Pemilik Kapal' ? `<div><strong>Kapal:</strong> ${nelayan.namaKapal || '-'} (${nelayan.jenisKapal || '-'})</div>` : ''}
                    <div style="margin-top: 10px;">
                        <button class="btn btn-sm btn-primary w-100" onclick="window.viewDetail && window.viewDetail('${nelayan.id}'); if (window.detailModal) { window.detailModal.hide(); }">
                            <i class="fas fa-info-circle me-1"></i> Lihat Detail Lengkap
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Buat marker
        try {
            const marker = L.marker(coordinates, { icon: customIcon })
                .bindPopup(popupContent)
                .on('click', function() {
                    this.openPopup();
                });
            
            markers.addLayer(marker);
            currentMarkers.push(marker);
        } catch (error) {
            console.error(`❌ Error membuat marker untuk ${nelayan.nama}:`, error);
        }
    });
    
    // Update statistik peta
    if (document.getElementById('map-total-points')) {
        document.getElementById('map-total-points').textContent = appData.length;
        document.getElementById('map-total-kecamatan').textContent = Object.keys(kecamatanCount).length;
        document.getElementById('map-total-desa').textContent = Object.keys(desaCount).length;
        document.getElementById('map-total-kapal').textContent = pemilikKapalCount;
    }
    
    // Fit bounds jika ada marker
    if (currentMarkers.length > 0) {
        const group = L.featureGroup(currentMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
    
    console.log(`✅ Berhasil render ${currentMarkers.length} marker`);
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
    
    // Update active tab
    document.querySelectorAll('.map-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter marker berdasarkan view
    renderMapMarkers();
    
    // Tampilkan notifikasi
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
    } else {
        if (window.showNotification) {
            window.showNotification('Tidak ada marker untuk di-zoom', 'warning');
        }
    }
}

// --- FUNGSI UNTUK TOGGLE CLUSTER MARKER ---
function toggleCluster() {
    const showCluster = document.getElementById('showCluster');
    if (!showCluster || !map) return;
    
    if (showCluster.checked) {
        map.removeLayer(markers);
        markers.clearLayers();
        markers.addTo(map);
        renderMapMarkers();
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

// --- FUNGSI UNTUK REFRESH PETA ---
function refreshMap() {
    console.log('🔄 Refresh peta...');
    if (map && markers) {
        renderMapMarkers();
        updateMapStatistics();
        if (window.showNotification) {
            window.showNotification('Peta berhasil direfresh', 'success');
        }
    }
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
window.refreshMap = refreshMap;

console.log('✅ SIMATA Peta & Koordinat module loaded successfully');
console.log(`📊 Data koordinat tersedia: ${Object.keys(COORDINATES_DATA).length} lokasi spesifik`);
console.log(`📍 Kecamatan tersedia: ${Object.keys(SITUBONDO_DATA).length} kecamatan`);
