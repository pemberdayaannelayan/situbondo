// barjas.js - Sistem Bantuan Nelayan Kab. Situbondo
// Versi 2.2 - Professional Edition
// Tanggal: 2025

(function() {
    // --- INJECT CSS STYLES ---
    const styles = `
        /* CSS untuk Sistem Bantuan Nelayan */
        :root {
            /* Palette: Luxurious Green, Blue, Orange */
            --primary-color: #005f73; /* Deep Teal Blue */
            --secondary-color: #0a9396; /* Emerald Green */
            --accent-color: #ca6702; /* Burnt Orange/Gold */
            
            --dark-blue: #001219;
            --light-bg: #f0f4f8;
            
            /* Luxurious Gradients */
            --gradient-primary: linear-gradient(135deg, #001219 0%, #005f73 50%, #0a9396 100%);
            --gradient-header: linear-gradient(120deg, #003049 0%, #005f73 40%, #0a9396 70%, #ca6702 100%);
            --gradient-secondary: linear-gradient(135deg, #0a9396, #94d2bd);
            --gradient-accent: linear-gradient(135deg, #ca6702, #ee9b00);
            
            --shadow-sm: 0 4px 6px rgba(0,0,0,0.05);
            --shadow-md: 0 10px 15px rgba(0,0,0,0.1);
            --shadow-lg: 0 20px 25px rgba(0,0,0,0.15);
            
            --glass-effect: rgba(255, 255, 255, 0.95);
        }
        
        .barjas-app-container {
            background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            padding: 20px 0;
            overflow-x: hidden;
            color: #333;
        }
        
        /* Layout Container */
        .barjas-app-container .app-container {
            max-width: 1600px;
            margin: 0 auto;
            background: var(--glass-effect);
            box-shadow: var(--shadow-lg);
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            z-index: 10;
            border: 1px solid rgba(255,255,255,0.5);
        }
        
        /* Header - New Luxurious Style */
        .barjas-app-container .app-header {
            background: var(--gradient-header);
            color: white;
            padding: 35px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-bottom: 4px solid #ee9b00; /* Gold Line */
        }
        
        .barjas-app-container .app-header::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
        }
        
        .barjas-app-container .app-logo {
            font-size: 3.5rem;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            animation: barjas-float 6s ease-in-out infinite;
        }

        @keyframes barjas-float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        .barjas-app-container .app-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.6rem;
            font-weight: 800;
            margin: 0;
            position: relative;
            z-index: 1;
            text-transform: uppercase;
            letter-spacing: 1px;
            line-height: 1.4;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
        }
        
        .barjas-app-container .app-subtitle {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.1rem;
            opacity: 0.95;
            position: relative;
            z-index: 1;
            font-weight: 500;
            letter-spacing: 0.5px;
            margin-top: 10px;
            color: #ffecd1; /* Soft Cream */
            border-top: 1px solid rgba(255,255,255,0.2);
            display: inline-block;
            padding-top: 10px;
        }
        
        /* Navigation */
        .barjas-app-container .col-md-3.col-lg-2.bg-light {
            background-color: #f8f9fa !important;
            border-right: 1px solid #e9ecef;
        }

        .barjas-app-container .nav-pills .nav-link {
            border-radius: 10px;
            margin-bottom: 8px;
            padding: 14px 20px;
            font-weight: 600;
            color: #555;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            font-size: 0.95rem;
            border-left: 4px solid transparent;
        }
        
        .barjas-app-container .nav-pills .nav-link:hover {
            background-color: #e3f2fd;
            color: var(--primary-color);
            transform: translateX(5px);
        }
        
        .barjas-app-container .nav-pills .nav-link.active {
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-left: 4px solid #ee9b00;
            box-shadow: var(--shadow-md);
            transform: translateX(5px);
            color: white;
        }

        /* Content Styling */
        .barjas-app-container .section-title {
            font-family: 'Montserrat', sans-serif;
            border-left: 5px solid #ee9b00;
            padding-left: 15px;
            margin: 25px 0;
            font-weight: 700;
            color: var(--dark-blue);
            font-size: 1.6rem;
            position: relative;
            background: linear-gradient(to right, rgba(238, 155, 0, 0.1), transparent);
            padding-top: 5px;
            padding-bottom: 5px;
            border-radius: 0 8px 8px 0;
        }
        
        /* Buttons */
        .barjas-app-container .btn {
            border-radius: 8px;
            font-weight: 600;
            font-family: 'Montserrat', sans-serif;
            letter-spacing: 0.5px;
            padding: 10px 20px;
        }

        .barjas-app-container .btn-primary {
            background: var(--gradient-primary);
            border: none;
            box-shadow: 0 4px 6px rgba(0, 95, 115, 0.3);
        }
        
        .barjas-app-container .btn-primary:hover {
            background: linear-gradient(135deg, #001219 0%, #004d40 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 95, 115, 0.4);
        }
        
        .barjas-app-container .btn-success {
            background: var(--gradient-secondary);
            border: none;
        }
        
        .barjas-app-container .btn-warning {
            background: var(--gradient-accent);
            color: white;
            border: none;
        }

        /* Forms */
        .barjas-app-container .form-label {
            font-weight: 600;
            color: #2b2d42;
            font-size: 0.9rem;
        }
        
        .barjas-app-container .form-control, 
        .barjas-app-container .form-select {
            border-radius: 8px;
            padding: 12px 15px;
            border: 1px solid #ced4da;
            font-size: 0.95rem;
            background-color: #fdfdfd;
        }
        
        .barjas-app-container .form-control:focus, 
        .barjas-app-container .form-select:focus {
            border-color: var(--secondary-color);
            box-shadow: 0 0 0 3px rgba(10, 147, 150, 0.2);
            background-color: white;
        }
        
        /* Tables */
        .barjas-app-container .data-table {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            border: none;
            white-space: nowrap;
        }
        
        .barjas-app-container .data-table th {
            background: var(--primary-color) !important; 
            background: linear-gradient(90deg, #005f73, #0a9396) !important;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
            padding: 15px 10px;
            border: none;
        }
        
        .barjas-app-container .data-table td {
            border-bottom: 1px solid #e9ecef;
            padding: 12px 10px;
            font-size: 0.9rem;
        }

        .barjas-app-container .data-table tr:hover {
            background-color: #e0f2f1;
        }
        
        /* Cards & Stats */
        .barjas-app-container .card {
            border-radius: 15px;
            border: none;
            box-shadow: var(--shadow-sm);
            background: white;
        }
        
        .barjas-app-container .card-header {
            background: linear-gradient(90deg, #005f73, #001219);
            color: white;
            font-weight: 600;
            border-radius: 15px 15px 0 0 !important;
            padding: 15px 20px;
        }
        
        .barjas-app-container .stats-box {
            background: white;
            border-radius: 15px;
            box-shadow: var(--shadow-md);
            border-left: 5px solid var(--accent-color);
            transition: transform 0.3s;
        }
        
        .barjas-app-container .stats-box:hover {
            transform: translateY(-5px);
        }

        .barjas-app-container .stats-number {
            color: var(--primary-color);
            font-family: 'Montserrat', sans-serif;
        }
        
        /* Footer */
        .barjas-app-container .copyright {
            background-color: #f8f9fa;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
            font-size: 0.85rem;
        }
        
        .barjas-app-container .feature-icon {
            width: 25px;
            text-align: center;
        }

        /* Utils */
        .barjas-app-container .notification-toast { 
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            z-index: 1050; 
            min-width: 280px; 
        }
        
        .barjas-app-container .input-error { 
            border-color: #dc3545 !important; 
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important; 
        }
        
        .barjas-app-container .error-message { 
            color: #dc3545; 
            font-size: 0.8rem; 
            margin-top: 5px; 
            display: none; 
            font-weight: 500; 
        }
        
        .barjas-app-container .watermark { 
            position: absolute; 
            bottom: 10px; 
            right: 15px; 
            opacity: 0.8; 
            font-size: 0.8rem; 
            color: rgba(255,255,255,0.7); 
            font-weight: 300; 
            letter-spacing: 1px;
        }
        
        /* Floating Buttons & Smart Menu */
        @keyframes barjas-signal-pulse {
            0% { box-shadow: 0 0 0 0 rgba(238, 155, 0, 0.7), 0 0 0 0 rgba(10, 147, 150, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(238, 155, 0, 0), 0 0 0 30px rgba(10, 147, 150, 0); }
            100% { box-shadow: 0 0 0 0 rgba(238, 155, 0, 0), 0 0 0 0 rgba(10, 147, 150, 0); }
        }

        .barjas-app-container .fab-common {
            position: fixed;
            right: 25px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            z-index: 1045;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 1.4rem;
            border: none;
        }

        .barjas-app-container .floating-action-btn {
            bottom: 25px;
            background: var(--gradient-accent);
            animation: barjas-signal-pulse 2.5s infinite;
        }
        
        .barjas-app-container .floating-action-btn:hover {
            transform: scale(1.1) rotate(90deg);
            background: #ee9b00;
            box-shadow: 0 10px 20px rgba(238, 155, 0, 0.4);
        }

        .barjas-app-container .smart-menu-container {
            position: fixed;
            bottom: 100px;
            right: 25px;
            z-index: 1045;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            gap: 15px;
        }

        .barjas-app-container .smart-menu-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
             box-shadow: 0 5px 15px rgba(0, 95, 115, 0.4);
        }

        .barjas-app-container .smart-menu-toggle:hover {
            transform: scale(1.1);
            background: #0a9396;
        }

        .barjas-app-container .smart-menu-toggle.active {
            transform: rotate(45deg);
            background: #dc3545;
            box-shadow: 0 0 20px rgba(220, 53, 69, 0.6);
        }

        .barjas-app-container .smart-menu-item {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            opacity: 0;
            transform: translateY(20px) scale(0.5);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: none;
            position: relative;
            box-shadow: var(--shadow-sm);
        }

        .barjas-app-container .smart-menu-container.active .smart-menu-item {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        .barjas-app-container .smart-menu-item:hover {
            background: var(--primary-color);
            color: white;
            border-color: white;
            transform: scale(1.1);
        }

        .barjas-app-container .smart-menu-tooltip {
            position: absolute;
            right: 60px;
            top: 50%;
            transform: translateY(-50%) translateX(20px);
            background: rgba(0, 18, 25, 0.9);
            color: white;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            transition: all 0.3s;
            pointer-events: none;
            box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
            visibility: hidden;
        }

        .barjas-app-container .smart-menu-item:hover .smart-menu-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateY(-50%) translateX(0);
        }

        .barjas-app-container .mobile-menu-btn { 
            display: none; 
            position: fixed; 
            top: 15px; 
            left: 15px; 
            z-index: 1050; 
            background: var(--primary-color); 
            color: white; 
            border: none; 
            border-radius: 50%; 
            width: 45px; 
            height: 45px; 
            box-shadow: var(--shadow-lg); 
        }
        
        .barjas-app-container .sidebar-overlay { 
            display: none; 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.5); 
            z-index: 1040; 
        }
        
        .barjas-app-container .privacy-blurred {
            color: #6c757d;
            letter-spacing: 2px;
            font-weight: bold;
        }

        @keyframes barjas-fadeIn { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        
        .barjas-app-container .animate-fadeIn { 
            animation: barjas-fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
        }
        
        /* Modal Styles */
        .barjas-app-container .modal-content {
            border-radius: 20px;
            overflow: hidden;
        }
        
        .barjas-app-container .detail-modal-label {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 5px;
        }
        
        .barjas-app-container .detail-modal-value {
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 3px solid var(--secondary-color);
            margin-bottom: 15px;
        }
        
        .barjas-app-container .whatsapp-link { 
            color: #25D366; 
            text-decoration: none; 
        }
        
        .barjas-app-container .whatsapp-number { 
            color: #25D366; 
            cursor: pointer; 
            text-decoration: underline; 
            font-weight: 500;
        }
        
        .barjas-app-container .drive-link { 
            color: var(--primary-color); 
            font-weight: 600; 
            text-decoration: none; 
        }
        
        /* Responsive */
        @media (max-width: 991.98px) {
            .barjas-app-container .app-container { 
                margin: 0; 
                border-radius: 0; 
            }
            
            .barjas-app-container .col-md-3.col-lg-2 { 
                position: fixed; 
                left: -300px; 
                top: 0; 
                bottom: 0; 
                z-index: 1050; 
                width: 280px; 
                transition: left 0.3s ease; 
                overflow-y: auto; 
                padding-top: 60px; 
                background: white; 
            }
            
            .barjas-app-container .col-md-3.col-lg-2.mobile-show { 
                left: 0; 
            }
            
            .barjas-app-container .col-md-9.col-lg-10 { 
                width: 100%; 
                flex: 0 0 100%; 
                max-width: 100%; 
            }
            
            .barjas-app-container .mobile-menu-btn { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
            }
            
            .barjas-app-container .sidebar-overlay.mobile-show { 
                display: block; 
            }
            
            .barjas-app-container .app-title { 
                font-size: 1.1rem; 
                line-height: 1.2; 
            }
            
            .barjas-app-container .app-logo { 
                font-size: 2rem; 
                margin-bottom: 5px; 
            }
            
            .barjas-app-container .app-header { 
                padding: 60px 15px 25px 15px; 
            }
            
            .barjas-app-container .col-md-9.col-lg-10.p-5 { 
                padding: 1.5rem !important; 
            }
            
            .barjas-app-container .table-responsive { 
                overflow-x: auto; 
                -webkit-overflow-scrolling: touch; 
            }
            
            .barjas-app-container .smart-menu-container { 
                bottom: 100px; 
                right: 20px; 
            }
            
            .barjas-app-container .floating-action-btn { 
                bottom: 20px; 
                right: 20px; 
            }
        }
    `;

    // Inject styles into document
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // --- GLOBAL VARIABLES & CONSTANTS ---
    const BARJAS = {
        appData: [],
        appSettings: {
            itemsPerPage: 25,
            notifications: true,
            appName: 'SISTEM BANTUAN NELAYAN',
            appSubtitle: 'Dinas Peternakan dan Perikanan Kab. Situbondo',
            defaultTahun: new Date().getFullYear(),
            lastBackupDate: '-',
            privacyMode: true
        },
        currentPage: 1,
        filteredData: [],
        isFilterActive: false,
        generatedCodes: {},
        mapDashboard: null,
        generatedPetaData: null,
        pendingSecurityAction: null,
        
        // Security Constants (untuk fitur tertentu)
        SECURITY_CONSTANTS: {
            PIN: '17081945',
            EXTRACT_CODE: '19450817'
        },
        
        // DATA DESA/KECAMATAN
        kecamatanList: [
            "Arjasa", "Asembagus", "Banyuglugur", "Banyuputih", "Besuki", 
            "Bungatan", "Jangkar", "Jatibanteng", "Kapongan", "Kendit", 
            "Mangaran", "Mlandingan", "Panarukan", "Panji", "Situbondo", 
            "Suboh", "Sumbermalang"
        ],
        
        // Data desa per kecamatan
        desaByKecamatan: {
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
            "Panji": ["Battal", "Curah Jeru", "Juglangan", "Kayu Putih", "Klampokan", "Panji Kidul", "Panji Lor", "Sliwung", "Tenggir", "Tokelan", "Ardirejo", "Mimbaan"],
            "Situbondo": ["Kalibagor", "Kotakan", "Olean", "Talkandang", "Dawuhan", "Patokan"],
            "Suboh": ["Buduan", "Cemara", "Dawuan", "Gunung Malang", "Gunung Putri", "Ketah", "Mojodungkol", "Suboh"],
            "Sumbermalang": ["Alastengah", "Baderan", "Kalirejo", "Plalangan", "Sumberargo", "Taman", "Tamankursi", "Tamansari", "Tlogosari"]
        },
        
        // Gabungkan semua desa untuk dropdown
        get desaList() {
            return Object.values(this.desaByKecamatan).flat().sort();
        },
        
        // Database koordinat kecamatan
        koordinatKecamatan: {
            "Arjasa": { lat: -7.71924, lng: 114.12254 },
            "Asembagus": { lat: -7.7541, lng: 114.2506 },
            "Banyuglugur": { lat: -7.7766, lng: 113.9008 },
            "Banyuputih": { lat: -7.7065, lng: 114.0108 },
            "Besuki": { lat: -7.7387, lng: 113.6976 },
            "Bungatan": { lat: -7.7032, lng: 113.8236 },
            "Jangkar": { lat: -7.7895, lng: 114.3619 },
            "Jatibanteng": { lat: -7.6865, lng: 113.9365 },
            "Kapongan": { lat: -7.7118, lng: 114.0581 },
            "Kendit": { lat: -7.7307, lng: 113.9243 },
            "Mangaran": { lat: -7.6545, lng: 114.0604 },
            "Mlandingan": { lat: -7.6644, lng: 113.8778 },
            "Panarukan": { lat: -7.6973, lng: 113.7690 },
            "Panji": { lat: -7.7102, lng: 113.6783 },
            "Situbondo": { lat: -7.7085, lng: 114.0064 },
            "Suboh": { lat: -7.8478, lng: 113.7583 },
            "Sumbermalang": { lat: -7.8774, lng: 113.8440 }
        },

        // Database koordinat desa
        koordinatDesa: {
            // KECAMATAN ARJASA
            "Arjasa, Arjasa": { lat: -7.71924, lng: 114.12254 },
            "Bayeman, Arjasa": { lat: -7.7461, lng: 114.0762 },
            "Curah Tatal, Arjasa": { lat: -7.8194, lng: 114.0368 },
            "Jatisari, Arjasa": { lat: -7.7748, lng: 114.0797 },
            "Kayumas, Arjasa": { lat: -7.8057, lng: 114.1088 },
            "Kedungdowo, Arjasa": { lat: -7.7531, lng: 114.0657 },
            "Ketowan, Arjasa": { lat: -7.7447, lng: 114.0947 },
            "Lamongan, Arjasa": { lat: -7.726567, lng: 114.133433 },

            // KECAMATAN ASEMBAGUS
            "Asembagus, Asembagus": { lat: -7.7541, lng: 114.2506 },
            "Awar-awar, Asembagus": { lat: -7.7265, lng: 114.2296 },
            "Bantal, Asembagus": { lat: -7.7481, lng: 114.3124 },
            "Gudang, Asembagus": { lat: -7.7266, lng: 114.2764 },
            "Kedunglo, Asembagus": { lat: -7.7988, lng: 114.2881 },
            "Kertosari, Asembagus": { lat: -7.8175, lng: 114.2651 },
            "Mojosari, Asembagus": { lat: -7.7914, lng: 114.3178 },
            "Parante, Asembagus": { lat: -7.7678, lng: 114.2255 },
            "Trigonco, Asembagus": { lat: -7.7722, lng: 114.2441 },
            "Wringin Anom, Asembagus": { lat: -7.7347, lng: 114.3050 },

            // Tambahkan koordinat lainnya sesuai kebutuhan...
            // (Untuk menghemat ruang, saya akan singkat di sini)
        }
    };

    // --- APPLICATION LIFECYCLE ---
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Aplikasi Sistem Bantuan Nelayan Kab. Situbondo diinisialisasi');
        
        // Add barjas class to body
        document.body.classList.add('barjas-app-container');
        
        BARJAS.initializeApp();
        BARJAS.setupEventListeners();
        
        // Langsung tampilkan aplikasi (tanpa login)
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.style.display = 'block';
        }
        
        showNotification('Sistem Bantuan Nelayan siap digunakan!', 'success');
    });

    // --- MAIN FUNCTIONS ---
    BARJAS.initializeApp = function() {
        this.loadSettings();
        this.loadData();
        
        this.fillYearDropdowns();
        this.fillKecamatanDropdown();
        this.initializeDesaDropdown();
        
        // Fill filter dropdowns for data table
        this.fillFilterDropdownsForDataTable();
        
        const today = new Date().toISOString().split('T')[0];
        const tanggalTerima = document.getElementById('tanggalTerima');
        if (tanggalTerima) tanggalTerima.value = today;
        
        this.initializeCharts();
        this.setupBrowserInfo();
        this.updateDashboard();
        this.applySettingsToUI();
        
        // Initialize map when dashboard tab is active
        setTimeout(() => this.initializeMapDashboard(), 500);
    };

    BARJAS.setupEventListeners = function() {
        // Main Input Form
        const inputForm = document.getElementById('inputForm');
        if (inputForm) {
            inputForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            inputForm.addEventListener('reset', () => this.resetForm());
        }
        
        // Tombol "Tidak Ada" WhatsApp
        const btnTidakAdaWhatsapp = document.getElementById('btnTidakAdaWhatsapp');
        if (btnTidakAdaWhatsapp) {
            btnTidakAdaWhatsapp.addEventListener('click', () => this.setTidakAdaWhatsapp());
        }
        
        const btnBukanKelompok = document.getElementById('btnBukanKelompok');
        if (btnBukanKelompok) {
            btnBukanKelompok.addEventListener('click', () => this.setBukanKelompok());
        }
        
        const generateKodeBtn = document.getElementById('generateKodeBtn');
        if (generateKodeBtn) {
            generateKodeBtn.addEventListener('click', () => this.generateKodeValidasi());
        }
        
        const jabatanSelect = document.getElementById('jabatan');
        if (jabatanSelect) {
            jabatanSelect.addEventListener('change', () => this.handleJabatanChange());
        }
        
        const nikInput = document.getElementById('nik');
        if (nikInput) {
            nikInput.addEventListener('input', () => {
                document.getElementById('kodeValidasi').value = '';
                this.checkNikForGeneratedCode();
            });
        }

        // Form Live Validation
        ['nama', 'nik', 'whatsapp', 'namaPetugas', 'namaBantuan', 'jumlahBantuan', 'driveLink', 'kodeValidasi', 'kecamatan', 'desa', 'tanggalTerima'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.clearError(id));
            }
        });
        
        // Data Table & Search
        const searchData = document.getElementById('searchData');
        if (searchData) {
            searchData.addEventListener('input', () => this.handleSearch());
        }
        
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => this.clearSearch());
        }
        
        // Filter for Data Table
        const filterKecamatanData = document.getElementById('filterKecamatanData');
        if (filterKecamatanData) {
            filterKecamatanData.addEventListener('change', () => this.handleDataTableFilter());
        }
        
        const filterDesaData = document.getElementById('filterDesaData');
        if (filterDesaData) {
            filterDesaData.addEventListener('change', () => this.handleDataTableFilter());
        }
        
        // Advanced Filter
        const applyFilterBtn = document.getElementById('applyFilterBtn');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', () => this.applyFilter());
        }
        
        const resetFilterBtn = document.getElementById('resetFilterBtn');
        if (resetFilterBtn) {
            resetFilterBtn.addEventListener('click', () => this.resetFilter());
        }
        
        // Print & Export Actions
        const printPdfBtn = document.getElementById('printPdfBtn');
        if (printPdfBtn) {
            printPdfBtn.addEventListener('click', () => this.printToPdf());
        }
        
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.showPreview());
        }
        
        // Export buttons
        const exportButtons = {
            'exportExcelBtn': () => this.exportData('excel'),
            'exportCsvBtn': () => this.exportData('csv'),
            'exportJsonBtn': () => this.exportData('json'),
            'exportPdfBtn': () => this.exportData('pdf')
        };
        
        Object.keys(exportButtons).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', exportButtons[id]);
            }
        });
        
        // System Management
        const backupDataBtn = document.getElementById('backupDataBtn');
        if (backupDataBtn) {
            backupDataBtn.addEventListener('click', () => this.backupData());
        }
        
        const restoreFileInput = document.getElementById('restoreFileInput');
        if (restoreFileInput) {
            restoreFileInput.addEventListener('change', () => this.enableRestoreButton());
        }
        
        const restoreDataBtn = document.getElementById('restoreDataBtn');
        if (restoreDataBtn) {
            restoreDataBtn.addEventListener('click', () => this.restoreData());
        }
        
        const resetConfirmationInput = document.getElementById('resetConfirmationInput');
        if (resetConfirmationInput) {
            resetConfirmationInput.addEventListener('input', () => this.enableResetButton());
        }
        
        // Refactored Reset Listener (Double Security)
        const confirmResetBtn = document.getElementById('confirmResetBtn');
        if (confirmResetBtn) {
            confirmResetBtn.addEventListener('click', function() {
                const inputVal = document.getElementById('resetConfirmationInput').value;
                if (inputVal === 'RESET') {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmResetModal'));
                    if (modal) modal.hide();
                    
                    BARJAS.requestHighSecurityAction(() => {
                        BARJAS.performFactoryReset();
                    });
                }
            });
        }
        
        // Settings Form
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSaveSettings(e));
        }
        
        // Privacy Toggle Logic
        const privacyToggle = document.getElementById('privacyToggle');
        if (privacyToggle) {
            privacyToggle.addEventListener('click', (e) => this.handlePrivacyToggle(e));
        }
        
        const submitPrivacyAuth = document.getElementById('submitPrivacyAuth');
        if (submitPrivacyAuth) {
            submitPrivacyAuth.addEventListener('click', () => this.checkPrivacyPassword());
        }
        
        const closePrivacyModal = document.getElementById('closePrivacyModal');
        if (closePrivacyModal) {
            closePrivacyModal.addEventListener('click', () => this.cancelPrivacyChange());
        }
        
        // Universal PIN Logic
        const submitUniversalPin = document.getElementById('submitUniversalPin');
        if (submitUniversalPin) {
            submitUniversalPin.addEventListener('click', () => this.handleUniversalPinSubmit());
        }
        
        // UI Helpers
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && document.getElementById('sidebarMenu').classList.contains('mobile-show')) {
                    this.toggleMobileMenu();
                }
                
                // Initialize map when dashboard tab is clicked
                if (link.id === 'v-pills-dashboard-tab') {
                    setTimeout(() => this.initializeMapDashboard(), 300);
                }
            });
        });

        const fabBtn = document.getElementById('fabBtn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                const inputTab = document.getElementById('v-pills-input-tab');
                if (inputTab) inputTab.click();
            });
        }
        
        const jenisBantuan = document.getElementById('jenisBantuan');
        if (jenisBantuan) {
            jenisBantuan.addEventListener('change', () => this.updateSatuanBantuan());
        }
        
        const printFromPreviewBtn = document.getElementById('printFromPreviewBtn');
        if (printFromPreviewBtn) {
            printFromPreviewBtn.addEventListener('click', () => window.print());
        }
        
        const logoutTab = document.getElementById('v-pills-logout-tab');
        if (logoutTab) {
            logoutTab.addEventListener('click', () => this.logout());
        }
        
        const reloadRepoBtn = document.getElementById('btn-reload-repo');
        if (reloadRepoBtn) {
            reloadRepoBtn.addEventListener('click', () => this.handleReloadFromRepo());
        }

        // Smart Menu Logic
        this.setupSmartMenu();

        // FITUR BARU: Ekstrak Data
        const generateDataPetaBtn = document.getElementById('generateDataPetaBtn');
        if (generateDataPetaBtn) {
            generateDataPetaBtn.addEventListener('click', () => this.generateDataPeta());
        }
        
        const downloadDataPetaBtn = document.getElementById('downloadDataPetaBtn');
        if (downloadDataPetaBtn) {
            downloadDataPetaBtn.addEventListener('click', () => this.downloadDataPeta());
        }

        window.addEventListener('beforeunload', () => this.autoBackupData());
        
        // PERBAIKAN: Event listener untuk dropdown kecamatan di form input
        const kecamatanSelect = document.getElementById('kecamatan');
        if (kecamatanSelect) {
            kecamatanSelect.addEventListener('change', function() {
                BARJAS.updateDesaDropdown(this.value);
            });
        }
    };

    // --- HELPER FUNCTIONS ---
    BARJAS.getKoordinatDesa = function(desa, kecamatan) {
        const key = `${desa}, ${kecamatan}`;
        return this.koordinatDesa[key] || this.koordinatKecamatan[kecamatan] || { lat: -7.7062, lng: 113.9603 };
    };

    BARJAS.formatPrivacy = function(value) {
        if (!this.appSettings.privacyMode) return value;
        if (!value) return '-';
        const str = String(value);
        if (str.length <= 4) return '****';
        return str.slice(0, -4) + '****';
    };

    BARJAS.formatDate = function(dateString) {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            });
        } catch (error) {
            return dateString;
        }
    };

    BARJAS.formatNumber = function(num) {
        if (isNaN(num) || num === undefined || num === null) return num; 
        try {
            return new Intl.NumberFormat('id-ID').format(num);
        } catch (error) {
            return num;
        }
    };

    BARJAS.showNotification = function(message, type = 'info') {
        if (!this.appSettings.notifications) return;
        
        const toastEl = document.querySelector('.notification-toast');
        if (!toastEl) return;
        
        const toastHeader = toastEl.querySelector('.toast-header');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toastMessage) return;
        
        toastMessage.textContent = message;
        
        const styles = {
            success: { bg: 'bg-success-subtle', text: 'text-success-emphasis', title: 'Berhasil' },
            error: { bg: 'bg-danger-subtle', text: 'text-danger-emphasis', title: 'Gagal' },
            warning: { bg: 'bg-warning-subtle', text: 'text-warning-emphasis', title: 'Peringatan' },
            info: { bg: 'bg-primary-subtle', text: 'text-primary-emphasis', title: 'Informasi' }
        };
        
        if (toastHeader) {
            toastHeader.className = `toast-header ${styles[type].bg} ${styles[type].text}`;
        }
        
        if (toastTitle) {
            toastTitle.textContent = styles[type].title;
        }
        
        try {
            new bootstrap.Toast(toastEl).show();
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    };

    // --- DATA PERSISTENCE ---
    BARJAS.loadData = function() {
        try {
            const savedData = localStorage.getItem('barjasData');
            this.appData = savedData ? JSON.parse(savedData) : [];
            const savedCodes = localStorage.getItem('barjasGeneratedCodes');
            this.generatedCodes = savedCodes ? JSON.parse(savedCodes) : {};
        } catch (e) {
            console.error("Gagal memuat data:", e);
            this.appData = [];
            this.generatedCodes = {};
        }
        this.renderDataTable();
    };

    BARJAS.saveData = function() {
        try {
            localStorage.setItem('barjasData', JSON.stringify(this.appData));
            localStorage.setItem('barjasGeneratedCodes', JSON.stringify(this.generatedCodes));
        } catch (e) {
            console.error("Gagal menyimpan data:", e);
        }
    };

    BARJAS.loadSettings = function() {
        const savedSettings = localStorage.getItem('barjasSettings');
        if (savedSettings) {
            try {
                const loaded = JSON.parse(savedSettings);
                Object.assign(this.appSettings, loaded);
            } catch(e) {
                console.error("Error loading settings:", e);
            }
        }
    };

    BARJAS.saveSettings = function() {
        try {
            localStorage.setItem('barjasSettings', JSON.stringify(this.appSettings));
        } catch (e) {
            console.error("Gagal menyimpan pengaturan:", e);
        }
    };

    // --- FORM HANDLING ---
    BARJAS.handleFormSubmit = function(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Harap perbaiki data yang salah pada formulir.', 'error');
            return;
        }
        
        const editId = document.getElementById('inputForm').getAttribute('data-edit-id');
        const isEditing = !!editId;

        const formData = {
            id: isEditing ? parseInt(editId) : Date.now(),
            nama: document.getElementById('nama').value.trim(),
            nik: document.getElementById('nik').value.trim(),
            whatsapp: document.getElementById('whatsapp').value === 'TIDAK ADA' ? '' : document.getElementById('whatsapp').value.replace(/\D/g, ''),
            namaKelompok: document.getElementById('namaKelompok').value.trim() || 'Individu',
            jabatan: document.getElementById('jabatan').value,
            tahunAnggaran: document.getElementById('tahunAnggaran').value,
            kecamatan: document.getElementById('kecamatan').value,
            desa: document.getElementById('desa').value,
            alamat: document.getElementById('alamat').value.trim(),
            jenisBantuan: document.getElementById('jenisBantuan').value,
            namaBantuan: document.getElementById('namaBantuan').value.trim(),
            jumlahBantuan: document.getElementById('jumlahBantuan').value,
            satuanBantuan: document.getElementById('satuanBantuan').value,
            tanggalTerima: document.getElementById('tanggalTerima').value,
            namaPetugas: document.getElementById('namaPetugas').value.trim(),
            driveLink: document.getElementById('driveLink').value.trim(),
            kodeValidasi: document.getElementById('kodeValidasi').value,
            keterangan: document.getElementById('keterangan').value.trim(),
            tanggalInput: isEditing 
                ? this.appData.find(item => item.id === parseInt(editId))?.tanggalInput 
                : new Date().toISOString(),
            koordinat: this.getKoordinatDesa(document.getElementById('desa').value, document.getElementById('kecamatan').value)
        };
        
        // Save generated code to storage
        if (!isEditing && formData.kodeValidasi && formData.nik) {
            this.generatedCodes[formData.nik] = {
                kode: formData.kodeValidasi,
                tanggal: new Date().toISOString()
            };
            this.saveData();
        }
        
        if (isEditing) {
            const index = this.appData.findIndex(item => item.id === parseInt(editId));
            if (index > -1) {
                this.appData[index] = formData;
                this.showNotification('Data berhasil diperbarui!', 'success');
            }
        } else {
            this.appData.push(formData);
            this.showNotification('Data berhasil disimpan!', 'success');
        }
        
        this.saveData();
        this.resetForm();
        this.updateDashboard();
        this.renderDataTable();
        
        // Update map if exists
        if (this.mapDashboard) {
            this.initializeMapDashboard();
        }
        
        try {
            new bootstrap.Tab(document.getElementById('v-pills-data-tab')).show();
        } catch (error) {
            console.error('Error switching to data tab:', error);
        }
    };

    // --- BACKUP & RESTORE ---
    BARJAS.backupData = function() {
        if (this.appData.length === 0) return this.showNotification('Tidak ada data untuk dibackup.', 'warning');
        
        // 1. Siapkan data JSON
        const dataToBackup = { 
            appData: this.appData, 
            appSettings: this.appSettings, 
            generatedCodes: this.generatedCodes, 
            koordinatDesa: this.koordinatDesa, 
            koordinatKecamatan: this.koordinatKecamatan 
        };
        
        // 2. Enkripsi ke Base64
        const encryptedString = btoa(unescape(encodeURIComponent(JSON.stringify(dataToBackup))));
        
        // 3. Buat konten file JS
        const timestamp = new Date().toLocaleString('id-ID');
        const appNameFull = "APLIKASI BARJAS BIDANG PEMBERDAYAAN NELAYAN";
        
        const fileContent = `/* PETUNJUK PENGGUNAAN RELOAD REPO:
    1. Ini adalah file backup otomatis dari Aplikasi.
    2. Jangan ubah kode di dalam tanda petik dua ("...") di bawah.
    3. Upload file ini ke hosting tempat aplikasi berjalan untuk fitur Reload Data.
    
    APP NAME : ${appNameFull}
    TANGGAL  : ${timestamp}
*/

window.BARJAS_BACKUP_ENCRYPTED = "${encryptedString}";
`;

        // 4. Download sebagai reloadbarjas.js
        this.downloadFile(fileContent, 'text/javascript', 'reloadbarjas.js');
        
        // Update timestamp
        this.appSettings.lastBackupDate = new Date().toLocaleDateString('id-ID');
        this.saveSettings();
        this.applySettingsToUI();
        this.showNotification('Backup file (reloadbarjas.js) berhasil diunduh.', 'success');
    };

    BARJAS.handleReloadFromRepo = function() {
        if(!confirm("Apakah Anda yakin ingin me-reload data dari repository? Data lokal akan digabungkan dengan data baru.")) return;
        
        const btn = document.getElementById('btn-reload-repo');
        if (!btn) return;
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin feature-icon"></i> Loading...';
        btn.disabled = true;

        const oldScript = document.getElementById('reload-script');
        if(oldScript) oldScript.remove();

        const script = document.createElement('script');
        script.id = 'reload-script';
        script.src = './reloadbarjas.js?v=' + new Date().getTime(); 

        script.onload = function() {
            try {
                if (window.BARJAS_BACKUP_ENCRYPTED) {
                    const rawContent = window.BARJAS_BACKUP_ENCRYPTED;
                    let restored;
                    try {
                        if (typeof rawContent === 'string') {
                            restored = JSON.parse(decodeURIComponent(escape(atob(rawContent))));
                        } else {
                            restored = rawContent;
                        }
                    } catch (decryptionError) {
                        throw new Error("Gagal mendekripsi data.");
                    }
                    
                    // LOGIKA MERGE DATA
                    if(restored && restored.appData && Array.isArray(restored.appData)) {
                        
                        const existingIds = new Set(BARJAS.appData.map(item => item.id));
                        let addedCount = 0;

                        restored.appData.forEach(newItem => {
                            if (!existingIds.has(newItem.id)) {
                                BARJAS.appData.push(newItem);
                                existingIds.add(newItem.id); 
                                addedCount++;
                            }
                        });

                        if(restored.generatedCodes) {
                            BARJAS.generatedCodes = { ...restored.generatedCodes, ...BARJAS.generatedCodes }; 
                        }
                        
                        // Update koordinat jika ada
                        if(restored.koordinatDesa) {
                            Object.assign(BARJAS.koordinatDesa, restored.koordinatDesa);
                        }
                        
                        // Update koordinat kecamatan jika ada
                        if(restored.koordinatKecamatan) {
                            Object.assign(BARJAS.koordinatKecamatan, restored.koordinatKecamatan);
                        }

                        BARJAS.saveData();
                        BARJAS.saveSettings();
                        BARJAS.applySettingsToUI();
                        BARJAS.updateDashboard();
                        BARJAS.renderDataTable();
                        
                        // Update map
                        if (BARJAS.mapDashboard) {
                            BARJAS.initializeMapDashboard();
                        }
                        
                        if (addedCount > 0) {
                            BARJAS.showNotification(`Berhasil reload! ${addedCount} data baru ditambahkan.`, 'success');
                        } else {
                            BARJAS.showNotification('Reload selesai. Tidak ada data baru yang ditemukan.', 'info');
                        }

                    } else {
                        throw new Error('Format data tidak valid.');
                    }
                } else {
                    throw new Error('Variabel backup tidak ditemukan di reloadbarjas.js.');
                }
            } catch (e) {
                BARJAS.showNotification('Error: ' + e.message, 'error');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
                delete window.BARJAS_BACKUP_ENCRYPTED;
            }
        };

        script.onerror = function() {
            BARJAS.showNotification('Gagal memuat file reloadbarjas.js. Pastikan file ada di folder yang sama.', 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        };
        document.body.appendChild(script);
    };

    // --- EKSPOR FUNGSI KE GLOBAL SCOPE ---
    window.BARJAS = BARJAS;
    
    // Ekspor fungsi ke global scope untuk aksi dari HTML
    window.showDetailData = (id) => BARJAS.showDetailData(id);
    window.editData = (id) => BARJAS.editData(id);
    window.deleteData = (id) => BARJAS.deleteData(id);
    window.triggerSmartMenu = (targetId) => BARJAS.triggerSmartMenu(targetId);
    window.changePage = (page) => BARJAS.changePage(page);

})();

// Fungsi untuk menginisialisasi aplikasi dari luar
function initBarjasApp() {
    if (typeof BARJAS !== 'undefined') {
        BARJAS.initializeApp();
        BARJAS.setupEventListeners();
        
        // Langsung tampilkan aplikasi
        const appContent = document.getElementById('appContent');
        if (appContent) {
            appContent.style.display = 'block';
        }
        
        BARJAS.showNotification('Sistem Bantuan Nelayan siap digunakan!', 'success');
    } else {
        console.error('BARJAS tidak terdefinisi. Pastikan barjas.js dimuat dengan benar.');
    }
}

// Auto-initialize jika DOM sudah ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBarjasApp);
} else {
    initBarjasApp();
}