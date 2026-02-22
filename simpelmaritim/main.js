// ===== GABUNGAN JAVASCRIPT =====
// ===== DATA JSON (Konten Pengetahuan & Wawasan) =====
const insightData = [
    {
        icon: "fas fa-sun",
        title: "Membaca Tanda Alam",
        items: [
            "Awan gelap di ufuk timur menandakan cuaca buruk dalam 6-12 jam.",
            "Burung camar terbang rendah menandakan angin kencang di permukaan.",
            "Air laut keruh kehijauan sering menandakan banyak plankton – tempat ikan berkumpul.",
            "Lumba-lumba muncul di permukaan pertanda adanya gerombolan ikan tuna/cakalang."
        ]
    },
    {
        icon: "fas fa-hand-holding-heart",
        title: "Teknik Mancing Dasar",
        items: [
            "Gunakan umpan segar (cumi, udang, ikan kecil) sesuai target ikan.",
            "Sesuaikan ukuran kail dan pemberat dengan arus dan kedalaman.",
            "Pancing dasar untuk ikan kakap/kerapu, pancing apung untuk ikan permukaan.",
            "Jangan biarkan umpan terlalu lama di air – ganti secara berkala."
        ]
    },
    {
        icon: "fas fa-utensils",
        title: "Pengolahan Hasil Tangkapan",
        items: [
            "Bersihkan ikan segera setelah ditangkap, simpan dalam cool box dengan es.",
            "Ikan bisa diolah menjadi ikan asin, pindang, atau bakso ikan untuk nilai tambah.",
            "Gunakan bagian ikan yang tidak terpakai untuk membuat pupuk organik.",
            "Pelajari teknik pengemasan vakum agar ikan lebih tahan lama."
        ]
    },
    {
        icon: "fas fa-chart-line",
        title: "Strategi Pemasaran Ikan",
        items: [
            "Jual langsung ke konsumen melalui media sosial atau pasar online.",
            "Bentuk kelompok nelayan untuk memasok ke restoran atau hotel.",
            "Dapatkan sertifikasi halal dan izin usaha untuk memperluas pasar.",
            "Ikuti pelatihan manajemen keuangan dan pemasaran dari dinas terkait."
        ]
    }
];

// ===== RENDER INSIGHT SECTION =====
function renderInsight() {
    const grid = document.getElementById('insightGrid');
    if (!grid) return;
    let html = '';
    insightData.forEach(item => {
        html += `
            <div class="insight-card">
                <div class="tip-icon-wrapper"><i class="${item.icon}"></i></div>
                <h3>${item.title}</h3>
                <ul class="insight-list">
        `;
        item.items.forEach(text => {
            html += `<li><i class="fas fa-angle-right"></i> ${text}</li>`;
        });
        html += `   </ul>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// ===== VARIABEL GLOBAL =====
let map, markerLayer, routingControl;
let markersData = JSON.parse(localStorage.getItem('nelayanMarkers')) || [];
let agendaList = JSON.parse(localStorage.getItem('nelayanAgenda')) || [];
let editingIndex = -1;
let particleAnimationFrame;
const LAT = -7.7, LON = 114.0; // Koordinat Situbondo

// ===== FUNGSI-FUNGSI =====

// Tanggal & Waktu
function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}

// Cuaca overlay
async function fetchOverlayWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&timezone=auto`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Gagal mengambil data cuaca');
        const data = await resp.json();
        if (data.current_weather) {
            const w = data.current_weather;
            document.getElementById('overlayTemp').innerHTML = w.temperature + '°C';
            const codes = {0:'Cerah',1:'Cerah berawan',2:'Berawan',3:'Berawan tebal',45:'Kabut',48:'Kabut beku',51:'Gerimis ringan',53:'Gerimis',55:'Gerimis deras',56:'Gerimis beku',57:'Gerimis beku deras',61:'Hujan ringan',63:'Hujan',65:'Hujan deras',66:'Hujan beku',67:'Hujan beku deras',71:'Salju ringan',73:'Salju',75:'Salju deras',77:'Butiran salju',80:'Hujan lokal',81:'Hujan lokal sedang',82:'Hujan lokal deras',85:'Salju ringan',86:'Salju deras',95:'Badai petir',96:'Badai petir hujan es',99:'Badai petir hujan es deras'};
            document.getElementById('overlayDesc').textContent = codes[w.weathercode] || 'Kondisi khusus';
        } else throw new Error('Data tidak lengkap');
    } catch (error) {
        console.warn('Gagal memuat cuaca overlay:', error);
        document.getElementById('overlayTemp').innerHTML = '--°C';
        document.getElementById('overlayDesc').textContent = 'Situbondo';
    }
}
function updateOverlayTime() {
    const now = new Date();
    document.getElementById('overlayTime').textContent = now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
    document.getElementById('overlayDate').textContent = now.toLocaleDateString('id-ID', { day:'2-digit', month:'2-digit', year:'numeric' });
}

// Login
function startApp() {
    stopParticles();
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    // Sembunyikan audio player container di header
    document.getElementById('audioPlayerContainer').style.display = 'none';
    fetchAllData();
    initMap();
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') Notification.requestPermission();
    showFloatingNotification();
}

document.getElementById('nantiSajaBtn').addEventListener('click', startApp);

document.getElementById('putarAudioBtn').addEventListener('click', function() {
    const audio = document.getElementById('loginAudio');
    // Pindahkan audio ke body agar tetap berjalan setelah overlay di-hidden
    document.body.appendChild(audio);
    audio.play().then(() => {
        startApp();
    }).catch(() => startApp());
});

// Peta
function initMap() {
    if (map) return;
    map = L.map('map').setView([LAT, LON], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    markersData.forEach(m => addMarkerToMap(m.lat, m.lng, m.keterangan, false));
    map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        const keterangan = prompt('Masukkan keterangan untuk titik ini:');
        if (keterangan && keterangan.trim() !== '') addMarkerToMap(lat, lng, keterangan, true);
    });
    window.addEventListener('resize', function() { if (map) setTimeout(() => map.invalidateSize(), 100); });
}

function addMarkerToMap(lat, lng, keterangan, saveToLocal = true) {
    const marker = L.marker([lat, lng]).addTo(markerLayer);
    const popupContent = `
        <b>Keterangan:</b> ${keterangan}<br>
        <b>Koordinat:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)}<br>
        <div style="display:flex; gap:5px; margin-top:8px; flex-wrap:wrap;">
            <button onclick="setAsStart(${lat}, ${lng})" style="padding:5px 10px;background:#27ae60;color:white;border:none;border-radius:20px;cursor:pointer;"><i class="fas fa-play"></i> Awal</button>
            <button onclick="setAsEnd(${lat}, ${lng})" style="padding:5px 10px;background:#f39c12;color:white;border:none;border-radius:20px;cursor:pointer;"><i class="fas fa-flag-checkered"></i> Tujuan</button>
            <button onclick="deleteMarker(this, ${lat}, ${lng})" style="padding:5px 10px;background:#ff6b6b;color:white;border:none;border-radius:20px;cursor:pointer;"><i class="fas fa-trash"></i> Hapus</button>
        </div>
    `;
    marker.bindPopup(popupContent);
    if (saveToLocal) {
        markersData.push({ lat, lng, keterangan });
        localStorage.setItem('nelayanMarkers', JSON.stringify(markersData));
    }
}

window.setAsStart = function(lat, lng) {
    document.getElementById('startLat').value = lat.toFixed(5);
    document.getElementById('startLon').value = lng.toFixed(5);
    alert('Titik awal telah diisi.');
};
window.setAsEnd = function(lat, lng) {
    document.getElementById('endLat').value = lat.toFixed(5);
    document.getElementById('endLon').value = lng.toFixed(5);
    alert('Titik tujuan telah diisi.');
};
window.deleteMarker = function(btn, lat, lng) {
    markerLayer.eachLayer(layer => { if (layer.getLatLng && layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) markerLayer.removeLayer(layer); });
    markersData = markersData.filter(m => !(m.lat === lat && m.lng === lng));
    localStorage.setItem('nelayanMarkers', JSON.stringify(markersData));
};
document.getElementById('clearMarkersBtn').addEventListener('click', function() {
    if (confirm('Hapus semua marker?')) { markerLayer.clearLayers(); markersData = []; localStorage.removeItem('nelayanMarkers'); }
});

function showRoute(startLat, startLon, endLat, endLon) {
    if (isNaN(startLat) || isNaN(startLon) || isNaN(endLat) || isNaN(endLon)) { alert('Koordinat tidak valid!'); return; }
    if (routingControl) map.removeControl(routingControl);
    routingControl = L.Routing.control({
        waypoints: [L.latLng(startLat, startLon), L.latLng(endLat, endLon)],
        routeWhileDragging: true, showAlternatives: true, fitSelectedRoutes: true,
        lineOptions: { styles: [{ color: '#f18f01', weight: 5 }] },
        createMarker: function() { return null; }
    }).addTo(map);
    routingControl.on('routesfound', function(e) {
        const route = e.routes[0];
        const distance = route.summary.totalDistance / 1000;
        const timeSeconds = route.summary.totalTime;
        const timeHours = timeSeconds / 3600;
        const hours = Math.floor(timeHours);
        const minutes = Math.round((timeHours - hours) * 60);
        const timeStr = hours > 0 ? `${hours} jam ${minutes} menit` : `${minutes} menit`;
        document.getElementById('routeInfo').innerHTML = `<i class="fas fa-info-circle"></i> Jarak: ${distance.toFixed(2)} km | Estimasi: ${timeStr}`;
        document.getElementById('routeInfo').classList.add('show');
    });
    routingControl.on('routingerror', function() {
        document.getElementById('routeInfo').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal menghitung rute.';
        document.getElementById('routeInfo').classList.add('show');
    });
}

document.getElementById('routeBtn').addEventListener('click', function() {
    const startLat = parseFloat(document.getElementById('startLat').value);
    const startLon = parseFloat(document.getElementById('startLon').value);
    const endLat = parseFloat(document.getElementById('endLat').value);
    const endLon = parseFloat(document.getElementById('endLon').value);
    showRoute(startLat, startLon, endLat, endLon);
});

// Geolokasi
function getCurrentPosition(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => callback(position.coords.latitude, position.coords.longitude),
            error => alert('Gagal: ' + error.message)
        );
    } else alert('Geolokasi tidak didukung.');
}
document.getElementById('myLocationBtn').addEventListener('click', function() {
    getCurrentPosition((lat, lon) => {
        const keterangan = prompt('Keterangan untuk lokasi Anda:');
        if (keterangan && keterangan.trim()) addMarkerToMap(lat, lon, keterangan, true);
        map.setView([lat, lon], 14);
    });
});
document.getElementById('setStartLocationBtn').addEventListener('click', function() {
    getCurrentPosition((lat, lon) => { document.getElementById('startLat').value = lat.toFixed(5); document.getElementById('startLon').value = lon.toFixed(5); alert('Koordinat awal diisi.'); });
});
document.getElementById('setEndLocationBtn').addEventListener('click', function() {
    getCurrentPosition((lat, lon) => { document.getElementById('endLat').value = lat.toFixed(5); document.getElementById('endLon').value = lon.toFixed(5); alert('Koordinat tujuan diisi.'); });
});
document.getElementById('checkRouteToDestinationBtn').addEventListener('click', function() {
    getCurrentPosition((lat, lon) => {
        document.getElementById('startLat').value = lat.toFixed(5);
        document.getElementById('startLon').value = lon.toFixed(5);
        const endLat = parseFloat(document.getElementById('endLat').value);
        const endLon = parseFloat(document.getElementById('endLon').value);
        if (isNaN(endLat) || isNaN(endLon)) { alert('Titik tujuan belum diisi.'); return; }
        showRoute(lat, lon, endLat, endLon);
    });
});

// Backup & Restore
window.backupData = function() {
    const data = { agenda: agendaList, markers: markersData };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simpelmaritim_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};
window.restoreData = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.agenda !== undefined && data.markers !== undefined) {
                localStorage.setItem('nelayanAgenda', JSON.stringify(data.agenda));
                localStorage.setItem('nelayanMarkers', JSON.stringify(data.markers));
                alert('Data dipulihkan! Halaman akan dimuat ulang.');
                location.reload();
            } else alert('File backup tidak valid.');
        } catch (err) { alert('Gagal membaca file: ' + err); }
    };
    reader.readAsText(file);
};

// Data maritim
window.fetchAllData = async function() {
    setLoadingState(true);
    await Promise.allSettled([ fetchSeaTemperature(), fetchWaveData(), fetchWeatherData(), calculateMoonPhase() ]);
    setLoadingState(false);
};
function setLoadingState(isLoading) {
    const refreshBtn = document.querySelector('.btn-refresh i');
    if(refreshBtn) refreshBtn.className = isLoading ? 'fas fa-spinner fa-pulse' : 'fas fa-sync-alt';
}
async function fetchSeaTemperature() {
    try {
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=sea_surface_temperature&timezone=auto&past_days=1&forecast_days=1`;
        const resp = await fetch(url); if(!resp.ok) throw new Error();
        const data = await resp.json();
        const times = data.hourly.time, temps = data.hourly.sea_surface_temperature;
        let idx = temps.length-1; while(idx>=0 && temps[idx]===null) idx--;
        if(idx>=0) {
            document.getElementById('suhuValueCard').innerHTML = temps[idx].toFixed(1)+' <span class="unit">°C</span>';
            document.getElementById('suhuTimeCard').innerHTML = '<i class="fas fa-clock"></i> '+new Date(times[idx]+'Z').toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
        } else throw new Error();
    } catch { 
        document.getElementById('suhuValueCard').innerHTML = '-- <span class="unit">°C</span>';
        document.getElementById('suhuTimeCard').innerHTML = '<i class="fas fa-clock"></i> Gagal memuat'; 
    }
}
async function fetchWaveData() {
    try {
        const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=wave_height,wave_direction,wave_period&models=ncep_gfswave025&timezone=auto&forecast_days=1`;
        const resp = await fetch(url); if(!resp.ok) throw new Error();
        const data = await resp.json();
        const times = data.hourly.time, heights = data.hourly.wave_height, dirs = data.hourly.wave_direction, pers = data.hourly.wave_period;
        let idx = heights.length-1; while(idx>=0 && heights[idx]===null) idx--;
        if(idx>=0) {
            document.getElementById('waveValueCard').innerHTML = (heights[idx] ? heights[idx].toFixed(1) : '--')+' <span class="unit">m</span>';
            document.getElementById('waveTimeCard').innerHTML = '<i class="fas fa-clock"></i> '+new Date(times[idx]+'Z').toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
            document.getElementById('waveDirection').textContent = dirs?.[idx]?.toFixed(0) || '--';
            document.getElementById('wavePeriod').textContent = pers?.[idx]?.toFixed(1) || '--';
        } else throw new Error();
    } catch { 
        document.getElementById('waveValueCard').innerHTML = '-- <span class="unit">m</span>';
        document.getElementById('waveTimeCard').innerHTML = '<i class="fas fa-clock"></i> Gagal';
        document.getElementById('waveDirection').textContent = '--';
        document.getElementById('wavePeriod').textContent = '--';
    }
}
async function fetchWeatherData() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&timezone=auto`;
        const resp = await fetch(url); if(!resp.ok) throw new Error();
        const data = await resp.json();
        if(data.current_weather) {
            const w = data.current_weather;
            document.getElementById('weatherTempCard').innerHTML = w.temperature+' <span class="unit">°C</span>';
            document.getElementById('weatherTimeCard').innerHTML = '<i class="fas fa-clock"></i> '+new Date(w.time+'Z').toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
            document.getElementById('windSpeed').textContent = w.windspeed;
            const codes = {0:'Cerah',1:'Cerah berawan',2:'Berawan',3:'Berawan tebal',45:'Kabut',48:'Kabut beku',51:'Gerimis ringan',53:'Gerimis',55:'Gerimis deras',56:'Gerimis beku',57:'Gerimis beku deras',61:'Hujan ringan',63:'Hujan',65:'Hujan deras',66:'Hujan beku',67:'Hujan beku deras',71:'Salju ringan',73:'Salju',75:'Salju deras',77:'Butiran salju',80:'Hujan lokal',81:'Hujan lokal sedang',82:'Hujan lokal deras',85:'Salju ringan',86:'Salju deras',95:'Badai petir',96:'Badai petir hujan es',99:'Badai petir hujan es deras'};
            document.getElementById('weatherDesc').textContent = codes[w.weathercode] || 'Kondisi khusus';
        } else throw new Error();
    } catch { 
        document.getElementById('weatherTempCard').innerHTML = '-- <span class="unit">°C</span>';
        document.getElementById('weatherTimeCard').innerHTML = '<i class="fas fa-clock"></i> Gagal';
        document.getElementById('windSpeed').textContent = '--';
        document.getElementById('weatherDesc').textContent = '--';
    }
}
function calculateMoonPhase() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth()+1, d = now.getDate();
    const yy = (m<=2) ? y-1 : y;
    const mm = (m<=2) ? m+12 : m;
    const A = Math.floor(yy/100);
    const B = 2 - A + Math.floor(A/4);
    const jd = Math.floor(365.25*(yy+4716)) + Math.floor(30.6001*(mm+1)) + d + B - 1524.5;
    const newMoonRef = 2451550.1;
    const days = jd - newMoonRef;
    const phase = (days / 29.53058867) % 1;
    let name, emoji;
    if(phase < 0.03 || phase >= 0.97) { name = 'Bulan Baru'; emoji = '🌑'; }
    else if(phase < 0.22) { name = 'Sabit Muda'; emoji = '🌒'; }
    else if(phase < 0.28) { name = 'Kuartal Pertama'; emoji = '🌓'; }
    else if(phase < 0.47) { name = 'Cembung Awal'; emoji = '🌔'; }
    else if(phase < 0.53) { name = 'Purnama'; emoji = '🌕'; }
    else if(phase < 0.72) { name = 'Cembung Akhir'; emoji = '🌖'; }
    else if(phase < 0.78) { name = 'Kuartal Akhir'; emoji = '🌗'; }
    else { name = 'Sabit Tua'; emoji = '🌘'; }
    document.getElementById('moonPhase').textContent = name;
    document.getElementById('moonEmoji').textContent = emoji;
}

// Agenda
function saveAgenda() { localStorage.setItem('nelayanAgenda', JSON.stringify(agendaList)); renderAgenda(); }
function renderAgenda() {
    const container = document.getElementById('agendaItems');
    const noAgenda = document.getElementById('noAgenda');
    if (agendaList.length === 0) { container.innerHTML = ''; noAgenda.style.display = 'block'; return; }
    noAgenda.style.display = 'none';
    agendaList.sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));
    let html = '';
    agendaList.forEach((item, index) => {
        const d = new Date(item.dateTime);
        const formatted = d.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
        html += `<div class="agenda-item"><div class="agenda-info"><h4>${item.title}</h4><p>${item.desc || ''}</p><small><i class="fas fa-clock"></i> ${formatted}</small></div><div class="agenda-actions"><button class="edit-agenda" onclick="editAgenda(${index})"><i class="fas fa-edit"></i></button><button class="delete-agenda" onclick="deleteAgenda(${index})"><i class="fas fa-trash"></i></button></div></div>`;
    });
    container.innerHTML = html;
}
window.deleteAgenda = function(index) { agendaList.splice(index, 1); saveAgenda(); };
window.editAgenda = function(index) {
    const item = agendaList[index];
    document.getElementById('agendaTitle').value = item.title;
    document.getElementById('agendaDateTime').value = item.dateTime.slice(0,16);
    document.getElementById('agendaDesc').value = item.desc || '';
    document.getElementById('agendaFormTitle').innerText = 'Edit Agenda';
    document.getElementById('addAgendaBtn').innerHTML = '<i class="fas fa-save"></i> Update';
    document.getElementById('cancelEditBtn').style.display = 'block';
    editingIndex = index;
};
window.cancelEdit = function() {
    document.getElementById('agendaTitle').value = '';
    document.getElementById('agendaDateTime').value = '';
    document.getElementById('agendaDesc').value = '';
    document.getElementById('agendaFormTitle').innerText = 'Tambah Agenda';
    document.getElementById('addAgendaBtn').innerHTML = '<i class="fas fa-plus-circle"></i> Simpan';
    document.getElementById('cancelEditBtn').style.display = 'none';
    editingIndex = -1;
};
document.getElementById('addAgendaBtn').addEventListener('click', function() {
    const title = document.getElementById('agendaTitle').value.trim();
    const dateTime = document.getElementById('agendaDateTime').value;
    const desc = document.getElementById('agendaDesc').value.trim();
    if (!title || !dateTime) { alert('Judul dan waktu harus diisi!'); return; }
    if (editingIndex === -1) agendaList.push({ title, dateTime, desc });
    else { agendaList[editingIndex] = { title, dateTime, desc }; cancelEdit(); }
    saveAgenda();
});
document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);

function checkAgendaNotifications() {
    const now = new Date();
    agendaList.forEach(item => {
        const itemTime = new Date(item.dateTime);
        const diffMs = itemTime - now;
        const diffMin = Math.round(diffMs / 60000);
        if (diffMin >= 0 && diffMin <= 15 && Notification.permission === 'granted') {
            new Notification('🔔 Agenda Nelayan', { body: `${item.title} - ${item.desc || ''}`, icon: 'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/simpelmaritim/logo_simpel_maritim.png' });
        }
    });
}

// Floating notif
function showFloatingNotification() {
    if (localStorage.getItem('floatingNotifDismissed') !== 'true') document.getElementById('floatingNotif').style.display = 'block';
}
document.getElementById('notifTidak').addEventListener('click', function() {
    document.getElementById('floatingNotif').style.display = 'none';
    localStorage.setItem('floatingNotifDismissed', 'true');
});
document.getElementById('notifIya').addEventListener('click', function() {
    window.open('https://nowcasting.bmkg.go.id/bs/jatim/', '_blank');
});

window.closeAudioPlayer = function() { document.getElementById('audioPlayerContainer').style.display = 'none'; };

// Particles
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    canvas.style.display = 'block';
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    function resize() { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; }
    function create(count = 150) {
        for(let i=0; i<count; i++) particles.push({
            x: Math.random()*w, y: Math.random()*h,
            r: Math.random()*3 + 1.5,
            sx: (Math.random()-0.5)*0.08,
            sy: (Math.random()-0.5)*0.04,
            opacity: Math.random()*0.6 + 0.4,
            speedOp: Math.random()*0.01 + 0.005,
            color: `rgba(255, 255, 200, 1)`
        });
    }
    function draw() {
        ctx.clearRect(0,0,w,h);
        for(let p of particles) {
            p.opacity += p.speedOp;
            if (p.opacity > 1 || p.opacity < 0.2) p.speedOp *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
            ctx.fillStyle = `rgba(255, 255, 200, ${p.opacity})`;
            ctx.shadowColor = 'rgba(255, 255, 180, 0.8)';
            ctx.shadowBlur = 15;
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }
    function update() {
        for(let p of particles) {
            if (mouse.x && mouse.y) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < mouse.radius) {
                    let angle = Math.atan2(dy, dx);
                    let force = (mouse.radius - dist) / mouse.radius;
                    p.x -= Math.cos(angle) * force * 2;
                    p.y -= Math.sin(angle) * force * 2;
                }
            }
            p.x += p.sx;
            p.y += p.sy;
            if(p.x < 0) p.x = w;
            if(p.x > w) p.x = 0;
            if(p.y < 0) p.y = h;
            if(p.y > h) p.y = 0;
        }
    }
    function animate() { update(); draw(); particleAnimationFrame = requestAnimationFrame(animate); }
    window.addEventListener('resize', ()=>{ resize(); particles = []; create(180); });
    resize(); create(180); animate();
}
function stopParticles() {
    if (particleAnimationFrame) cancelAnimationFrame(particleAnimationFrame);
    document.getElementById('particle-canvas').style.display = 'none';
}

// ===== INISIALISASI =====
window.addEventListener('load', function() {
    renderInsight();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    document.getElementById('mainContent').style.display = 'none';
    initParticles();
    renderAgenda();
    setInterval(checkAgendaNotifications, 60000);
    fetchOverlayWeather();
    updateOverlayTime();
    setInterval(updateOverlayTime, 1000);
    setInterval(fetchOverlayWeather, 600000); // refresh cuaca overlay setiap 10 menit
    setInterval(fetchAllData, 1800000);
});
