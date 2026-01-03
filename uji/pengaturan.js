// =====================================================
// PENGATURAN SISTEM
// =====================================================

// --- FUNGSI LOAD DATA PEJABAT ---
function loadOfficialData() {
    // Load data pejabat dari appSettings ke form
    document.getElementById('officialName').value = appSettings.officialName || 'SUGENG PURWO PRIYANTO, S.E, M.M';
    document.getElementById('officialNip').value = appSettings.officialNip || '19761103 200903 1 001';
    document.getElementById('officialPosition').value = appSettings.officialPosition || 'Kepala Bidang Pemberdayaan Nelayan';
}

// --- FUNGSI UPDATE PRIVACY UI ---
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

// --- FUNGSI UPDATE APP IDENTITY ---
function updateAppIdentity() {
    appSettings.appName = "SISTEM PEMETAAN DATA NELAYAN";
    document.querySelector('.app-title').textContent = appSettings.appName;
    document.getElementById('dynamicSubtitle').textContent = appSettings.appSubtitle;
    document.getElementById('itemsPerPageSelect').value = appSettings.itemsPerPage;
    document.getElementById('appName').value = appSettings.appName;
    document.getElementById('appSubtitle').value = appSettings.appSubtitle;
}

// Inisialisasi event listeners untuk pengaturan
function initPengaturan() {
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
}

// Ekspos fungsi ke window
window.loadOfficialData = loadOfficialData;
window.updatePrivacyUI = updatePrivacyUI;
window.updateAppIdentity = updateAppIdentity;

console.log('✅ Modul Pengaturan berhasil dimuat');
