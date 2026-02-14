(function() {
    // Inisialisasi AOS
    AOS.init({ duration: 800, once: true, offset: 100 });
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Data Pegawai (sama dengan template)
    const pegawaiList = [
        { nama: "SUGENG PURWO PRIYANTO, S.E., M.M.", nip: "197611032009031001" },
        { nama: "MULYONO, S.H.", nip: "196901171990031002" },
        { nama: "FERI ZAINUR ROFIQ, S.Pi., M.Si.", nip: "198203062010011023" },
        { nama: "LEDY MATMIRA, S.Pi.", nip: "199806142022042002" },
        { nama: "ARSYA CHAIRUL FAJRI, S.Sos.", nip: "199511122025211087" },
        { nama: "FRANKY ARIS SANDI, S.Pd.", nip: "199211212025211100" },
        { nama: "SIRRY NURIL FIJRIYA, S.E.", nip: "199209242025212099" },
        { nama: "MUHAMMAD SALAM", nip: "198809122025211130" },
        { nama: "IMAM ARSIDI, S.E.", nip: "197107072007011021" },
        { nama: "AKHMAD FAUZI", nip: "196905052007011039" },
        { nama: "YUSUF PRIADI", nip: "198004082010011002" },
        { nama: "CHAIRUL IMAN TARYANTO", nip: "197604302014061001" },
        { nama: "ANDI FEBRIYANTO, A.Md.Pi.", nip: "199402262023211013" },
        { nama: "META HARIADI", nip: "197705142007011015" }
    ];

    // Global vars
    let maxAttempts = 3, currentAttempts = 0, lockoutTime = 0;
    const lockoutDuration = 5 * 60 * 1000;
    let captchaResult = 0;
    let isEditMode = false;
    const REPORT_URL = 'https://dinasperikanansitubondo.com/dokumentasi/2026/januari/koordinasi-simpadan-tangkap/';
    let currentPaperSize = 'A4';
    let historyStack = [], historyIndex = -1;
    let currentDocId = '', currentReportTitle = '';

    // Fungsi undo/redo
    function saveState() {
        if (!isEditMode) return;
        const preview = document.getElementById('pdfPreviewContent');
        if (!preview) return;
        const state = preview.innerHTML;
        if (historyIndex < historyStack.length - 1) historyStack = historyStack.slice(0, historyIndex + 1);
        historyStack.push(state);
        if (historyStack.length > 20) historyStack.shift();
        else historyIndex++;
    }
    window.undo = function() {
        if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
        if (historyIndex > 0) { historyIndex--; document.getElementById('pdfPreviewContent').innerHTML = historyStack[historyIndex]; drawQRCodeOnCanvas('qrCodeCanvas', REPORT_URL, 300); } 
        else alert('Tidak ada yang dapat di-undo.');
    };
    window.redo = function() {
        if (!isEditMode) { alert('Aktifkan mode edit terlebih dahulu.'); return; }
        if (historyIndex < historyStack.length - 1) { historyIndex++; document.getElementById('pdfPreviewContent').innerHTML = historyStack[historyIndex]; drawQRCodeOnCanvas('qrCodeCanvas', REPORT_URL, 300); }
        else alert('Tidak ada yang dapat di-redo.');
    };

    // Navbar scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) navbar.style.backgroundColor = 'rgba(255,255,255,0.98)';
        else navbar.style.backgroundColor = 'rgba(255,255,255,0.98)';
    });

    // Gallery modal
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const modalHTML = `
            <div class="modal fade" id="imageModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0">
                        <div class="modal-body p-0 position-relative">
                            <img src="${imgSrc}" class="img-fluid w-100 rounded" style="border-radius:16px;">
                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white rounded-circle p-2" style="width:40px; height:40px;" data-bs-dismiss="modal"></button>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            new bootstrap.Modal(document.getElementById('imageModal')).show();
            document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() { this.remove(); });
        });
    });

    // Share functions
    window.openShareModal = function() { document.getElementById('shareModal').style.display = 'flex'; };
    window.closeShareModal = function() { document.getElementById('shareModal').style.display = 'none'; };
    window.shareToWhatsApp = function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Koordinasi Inovasi Aplikasi SIMPADAN Tangkap - Dinas Perikanan Situbondo. Simak selengkapnya:');
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    };
    window.copyLink = function() {
        navigator.clipboard.writeText(window.location.href).then(() => { alert('Link berhasil disalin!'); closeShareModal(); });
    };
    document.getElementById('shareModal')?.addEventListener('click', function(e) { if (e.target === this) closeShareModal(); });

    // PDF Auth
    function generateSecurityCode() {
        const d = new Date();
        return String(d.getDate()).padStart(2,'0') + String(d.getMonth()+1).padStart(2,'0') + d.getFullYear();
    }
    function isLockedOut() {
        if (lockoutTime > 0 && new Date().getTime() < lockoutTime) {
            const rem = lockoutTime - new Date().getTime();
            return { locked: true, message: `Akses terkunci. Coba lagi dalam ${Math.floor(rem/60000)} menit ${Math.floor((rem%60000)/1000)} detik.` };
        }
        lockoutTime = 0; return { locked: false };
    }
    let isPasswordVisible = false;
    document.getElementById('passwordToggle')?.addEventListener('click', function() {
        const input = document.getElementById('securityCodeInput');
        const icon = this.querySelector('i');
        isPasswordVisible = !isPasswordVisible;
        input.type = isPasswordVisible ? 'text' : 'password';
        icon.className = isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
    window.openPdfAuthModal = function() {
        const lock = isLockedOut();
        if (lock.locked) { alert(lock.message); return; }
        document.getElementById('securityCodeInput').value = '';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('securityCodeInput').classList.remove('is-invalid');
        document.getElementById('attemptsLeft').textContent = maxAttempts - currentAttempts;
        document.getElementById('pdfAuthModal').style.display = 'flex';
        setTimeout(() => document.getElementById('securityCodeInput').focus(), 300);
    };
    window.closePdfAuthModal = function() { document.getElementById('pdfAuthModal').style.display = 'none'; };
    window.verifySecurityCode = function() {
        const lock = isLockedOut();
        if (lock.locked) {
            document.getElementById('errorText').textContent = lock.message;
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }
        const input = document.getElementById('securityCodeInput').value;
        const correct = generateSecurityCode();
        const errorMsg = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const inputEl = document.getElementById('securityCodeInput');
        if (!input || input.length !== 8) {
            errorText.textContent = 'Kode harus 8 digit angka.'; errorMsg.style.display = 'block'; inputEl.classList.add('is-invalid'); return;
        }
        if (input === correct) {
            currentAttempts = 0;
            closePdfAuthModal();
            openPdfDataFormModal();
        } else {
            currentAttempts++;
            document.getElementById('attemptsLeft').textContent = maxAttempts - currentAttempts;
            if (currentAttempts >= maxAttempts) {
                lockoutTime = new Date().getTime() + lockoutDuration;
                errorText.textContent = 'Terlalu banyak gagal. Akses terkunci 5 menit.';
            } else {
                errorText.textContent = `Kode salah. Percobaan ${currentAttempts} dari ${maxAttempts}.`;
            }
            errorMsg.style.display = 'block'; inputEl.classList.add('is-invalid');
            inputEl.value = ''; inputEl.focus();
        }
    };

    // Dropdown nama
    function populateSelectNama() {
        const select = document.getElementById('selectNamaPelapor');
        if (!select) return;
        select.innerHTML = '<option value="" selected disabled>-- Pilih Nama --</option>';
        pegawaiList.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.nip;
            opt.textContent = p.nama;
            select.appendChild(opt);
        });
    }
    document.getElementById('selectNamaPelapor')?.addEventListener('change', function(e) {
        const nip = this.value;
        if (!nip) { document.getElementById('namaPelapor').value = ''; document.getElementById('nipPelapor').value = ''; return; }
        const peg = pegawaiList.find(p => p.nip === nip);
        if (peg) {
            document.getElementById('namaPelapor').value = peg.nama;
            document.getElementById('nipPelapor').value = peg.nip;
        }
    });

    // QR Code
    function drawQRCodeOnCanvas(canvasId, text, size) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (typeof qrcode === 'undefined') {
            ctx.fillStyle = '#f0f0f0'; ctx.fillRect(0,0,size,size);
            ctx.fillStyle = '#1e3a8a'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'; ctx.fillText('QR Unavailable', size/2, size/2);
            return;
        }
        try {
            const qr = qrcode(0, 'H');
            qr.addData(text);
            qr.make();
            const mod = qr.getModuleCount();
            const cell = size / mod;
            for (let r=0; r<mod; r++) for (let c=0; c<mod; c++) {
                ctx.fillStyle = qr.isDark(r,c) ? '#1e3a8a' : '#ffffff';
                ctx.fillRect(c*cell, r*cell, cell, cell);
            }
        } catch(e) { console.error(e); }
    }

    // Generate document ID
    function generateDocumentId() {
        const d = new Date();
        return `SMP-${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${d.getFullYear()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
    }

    // Loading
    function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
    function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }

    // Form data pelapor
    window.openPdfDataFormModal = function() {
        populateSelectNama();
        const n1 = Math.floor(Math.random()*5)+3, n2 = Math.floor(Math.random()*5)+2;
        captchaResult = n1 + n2;
        document.getElementById('captchaQuestion').innerHTML = `${n1} + ${n2} = ?`;
        document.getElementById('pdfDataForm').reset();
        document.getElementById('pdfDataFormModal').style.display = 'flex';
    };
    window.closePdfDataFormModal = function() { document.getElementById('pdfDataFormModal').style.display = 'none'; };
    window.submitPdfDataForm = function() {
        const nama = document.getElementById('namaPelapor').value.trim();
        const nip = document.getElementById('nipPelapor').value.trim();
        const captcha = document.getElementById('captchaInput').value.trim();
        const agree = document.getElementById('agreementCheck').checked;
        let ok = true;
        if (!nama) { document.getElementById('namaPelapor').classList.add('is-invalid'); ok=false; }
        if (!nip || !/^\d{18}$/.test(nip)) { document.getElementById('nipPelapor').classList.add('is-invalid'); ok=false; }
        if (!captcha || parseInt(captcha)!==captchaResult) { document.getElementById('captchaInput').classList.add('is-invalid'); document.getElementById('captchaError').style.display='block'; ok=false; }
        if (!agree) { alert('Anda harus menyetujui pernyataan.'); ok=false; }
        if (!ok) return;
        closePdfDataFormModal();
        generatePDFReport(nama, nip);
    };

    // Generate PDF report (konten disesuaikan dengan kegiatan SIMPADAN)
    function generatePDFReport(namaPelapor, nipPelapor) {
        showLoading();
        const now = new Date();
        const tgl = now.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
        const docId = generateDocumentId();
        currentDocId = docId;
        const judul = document.getElementById('reportTitle')?.innerText.trim() || 'Koordinasi Inovasi Aplikasi SIMPADAN Tangkap';
        currentReportTitle = judul.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

        const kopSurat = `
            <div style="margin-bottom: 30px; text-align: center;">
                <img src="https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/kop-surat-resmi-dinas-peternakan-perikanan-situbondo.png" style="width:100%; max-width:100%; height:auto;" crossorigin="anonymous">
            </div>
        `;

        const konten = `
        <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: #333;">
            ${kopSurat}
            <div style="text-align:center; margin-bottom:25px;">
                <h3 style="font-size:14px; font-weight:bold; text-transform:uppercase;">LAPORAN KEGIATAN</h3>
                <h1 style="font-size:16px; font-weight:bold; text-decoration:underline; color:#1e3a8a;">${judul.toUpperCase()}</h1>
                <h2 style="font-size:15px; font-weight:bold; color:#1e3a8a;">DINAS PERIKANAN SITUBONDO</h2>
            </div>
            <div style="margin-bottom:25px;">
                <h4 style="font-size:13px; font-weight:bold; border-bottom:1px solid #ccc; padding-bottom:5px;">I. DASAR PELAKSANAAN</h4>
                <p style="text-align:justify; text-indent:30px; font-size:12px;">Kegiatan koordinasi ini dilaksanakan berdasarkan program inovasi digital Dinas Perikanan Situbondo dalam rangka pemberdayaan nelayan melalui aplikasi SIMPADAN Tangkap. Kegiatan menghadirkan Ketua BIPPD dan Plt. Kepala Dinas untuk mendapatkan arahan dan masukan strategis.</p>
                
                <h4 style="font-size:13px; font-weight:bold; border-bottom:1px solid #ccc; padding-bottom:5px;">II. WAKTU DAN TEMPAT</h4>
                <ul style="font-size:12px;">
                    <li>Hari/Tanggal : Kamis, 29 Januari 2026</li>
                    <li>Waktu        : 09.00 WIB – selesai</li>
                    <li>Tempat       : Kantor Dinas Perikanan Situbondo</li>
                </ul>
                
                <h4 style="font-size:13px; font-weight:bold; border-bottom:1px solid #ccc; padding-bottom:5px;">III. PESERTA</h4>
                <ul style="font-size:12px;">
                    <li>Marlutfi – Ketua BIPPD Situbondo</li>
                    <li>Ir. Muh Abdul Rahman, M.Si – Plt. Kepala Dinas Peternakan dan Perikanan</li>
                    <li>Sugeng Purwo Priyanto, S.E., M.M. – Kabid Pemberdayaan Nelayan</li>
                    <li>Muhammad S – Developer Aplikasi & Staf Bidang Pemberdayaan Nelayan</li>
                    <li>Staf dan Penyuluh Perikanan se-Kabupaten Situbondo</li>
                </ul>
                
                <h4 style="font-size:13px; font-weight:bold; border-bottom:1px solid #ccc; padding-bottom:5px;">IV. HASIL KEGIATAN</h4>
                <p style="text-align:justify; text-indent:30px; font-size:12px;">Koordinasi berjalan lancar. Aplikasi SIMPADAN Tangkap dipresentasikan dengan fitur utama: pendataan nelayan, pemantauan hasil tangkapan, dan integrasi UMKM. Ketua BIPPD memberikan apresiasi dan akan melaporkan kepada Bupati. Plt. Kepala Dinas mengarahkan agar aplikasi terus dikembangkan dengan memperhatikan keamanan data dan kemudahan akses bagi nelayan. Diskusi menghasilkan rencana integrasi sistem satu data nelayan dan pengembangan fitur pemasaran hasil perikanan.</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:40px;">
                <div style="width:60%;">
                    <p style="font-size:12px;">Situbondo, ${tgl}</p>
                    <p style="font-weight:bold; font-size:12px;">Pelapor,</p>
                    <p style="margin-top:40px; font-size:12px; font-weight:bold;">${namaPelapor || '______________________'}</p>
                    <p style="font-size:11px;">NIP. ${nipPelapor || '______________________'}</p>
                </div>
                <div style="width:35%;"></div>
            </div>
            <div class="pdf-footer" style="margin-top:30px; border-top:1px solid #ddd; padding-top:15px; display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:10px; color:#666;">
                    <p><strong>Dokumen elektronik resmi</strong></p>
                    <p>ID: ${docId} | Cetak: ${tgl}</p>
                </div>
                <div style="text-align:right;">
                    <canvas id="qrCodeCanvas" width="300" height="300" style="width:100px; height:100px;"></canvas>
                    <p style="font-size:8px;">Scan untuk akses daring</p>
                </div>
            </div>
        </div>
        `;

        const preview = document.getElementById('pdfPreviewContent');
        preview.innerHTML = konten;
        drawQRCodeOnCanvas('qrCodeCanvas', REPORT_URL, 300);
        preview.style.width = (currentPaperSize === 'A4' ? '210mm' : '216mm');
        if (isEditMode) toggleEditPreview();
        hideLoading();
        openPdfPreview();
    }

    // PDF Preview
    window.openPdfPreview = function() {
        document.getElementById('pdfPreviewModal').style.display = 'flex';
        if (historyStack.length === 0) saveState();
    };
    window.closePdfPreview = function() { document.getElementById('pdfPreviewModal').style.display = 'none'; if (isEditMode) toggleEditPreview(); };

    // Edit mode
    window.toggleEditPreview = function() {
        const preview = document.getElementById('pdfPreviewContent');
        const btn = document.getElementById('btnEditPreview');
        const toolbar = document.getElementById('pdfEditToolbar');
        isEditMode = !isEditMode;
        if (isEditMode) {
            preview.contentEditable = "true";
            preview.classList.add('editing-mode');
            btn.innerHTML = '<i class="fas fa-lock me-2"></i>Selesai Edit';
            toolbar.classList.add('show');
            historyStack = []; historyIndex = -1; saveState();
        } else {
            preview.contentEditable = "false";
            preview.classList.remove('editing-mode');
            btn.innerHTML = '<i class="fas fa-pencil-alt me-2"></i>Edit';
            toolbar.classList.remove('show');
        }
    };

    window.execEditCommand = function(cmd, val) {
        if (!isEditMode) { alert('Aktifkan mode edit.'); return; }
        document.getElementById('pdfPreviewContent').focus();
        document.execCommand(cmd, false, val);
        saveState();
    };
    window.setFontSize = function(s) { if(isEditMode) execEditCommand('fontSize', s+'px'); };
    window.setFontFamily = function(f) { if(isEditMode) execEditCommand('fontName', f); };
    window.setFontColor = function(c) { if(isEditMode) execEditCommand('foreColor', c); };
    window.setLineHeight = function(l) { if(isEditMode) execEditCommand('lineHeight', l); };
    document.getElementById('paperSizeSelect')?.addEventListener('change', function(e) {
        currentPaperSize = this.value;
        document.getElementById('pdfPreviewContent').style.width = (currentPaperSize==='A4'?'210mm':'216mm');
        saveState();
    });

    // Download PDF
    window.downloadPDF = async function() {
        showLoading();
        try {
            const { jsPDF } = window.jspdf;
            const format = currentPaperSize.toLowerCase();
            const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:format });
            const element = document.getElementById('pdfPreviewContent');
            if (!element) throw new Error('Preview tidak ditemukan');
            
            const origWidth = element.style.width;
            const origPadding = element.style.padding;
            element.style.width = format === 'a4' ? '210mm' : '216mm';
            element.style.padding = '10mm';
            element.style.backgroundColor = 'white';
            
            const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor:'#ffffff' });
            
            element.style.width = origWidth; element.style.padding = origPadding;
            
            const imgWidth = format === 'a4' ? 210 : 216;
            const pageHeight = 297;
            const margin = 15;
            const maxHeight = pageHeight - margin*2;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
            let position = 0, page = 1;
            
            while (position < imgHeight) {
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                pageCanvas.height = Math.min((maxHeight * canvas.height) / imgHeight, canvas.height - position * (canvas.height/imgHeight));
                const ctx = pageCanvas.getContext('2d');
                ctx.drawImage(canvas, 0, position * (canvas.height/imgHeight), canvas.width, pageCanvas.height, 0, 0, canvas.width, pageCanvas.height);
                const imgData = pageCanvas.toDataURL('image/png');
                if (position > 0) doc.addPage();
                doc.addImage(imgData, 'PNG', 0, margin, imgWidth, (pageCanvas.height * imgWidth) / canvas.width, undefined, 'FAST');
                doc.setFontSize(10); doc.text(`Halaman ${page}`, imgWidth-20, pageHeight-5);
                position += maxHeight;
                page++;
            }
            
            const fileName = `LAPORAN_${currentReportTitle}_${currentDocId}.pdf`;
            doc.save(fileName);
            hideLoading();
            closePdfPreview();
            alert('PDF berhasil diunduh!');
        } catch(e) { console.error(e); hideLoading(); alert('Gagal mengunduh PDF.'); }
    };

    // Audio & welcome
    function showWelcomeNotification() {
        if (sessionStorage.getItem('welcomeShown')) return;
        const notif = document.getElementById('welcomeNotification');
        if (!notif) return;
        notif.style.display = 'flex';
        document.getElementById('laterButton').onclick = function() { notif.style.display = 'none'; sessionStorage.setItem('welcomeShown','true'); };
        document.getElementById('playAudioButton').onclick = function() {
            notif.style.display = 'none';
            sessionStorage.setItem('welcomeShown','true');
            document.getElementById('audioPlayerContainer').style.display = 'block';
            document.getElementById('audioPlayer').play().catch(()=>{});
        };
    }
    window.closeAudioPlayer = function() {
        document.getElementById('audioPlayerContainer').style.display = 'none';
        document.getElementById('audioPlayer').pause();
    };

    // Init
    document.addEventListener('DOMContentLoaded', function() {
        populateSelectNama();
        document.getElementById('securityCodeInput')?.addEventListener('keypress', e => { if(e.key==='Enter') verifySecurityCode(); });
        document.getElementById('securityCodeInput')?.addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9]/g,''); });
        showWelcomeNotification();
    });

    // Expose to global
    window.verifySecurityCode = verifySecurityCode;
    window.openPdfAuthModal = openPdfAuthModal;
    window.closePdfAuthModal = closePdfAuthModal;
    window.openShareModal = openShareModal;
    window.closeShareModal = closeShareModal;
    window.shareToWhatsApp = shareToWhatsApp;
    window.copyLink = copyLink;
    window.submitPdfDataForm = submitPdfDataForm;
    window.closePdfDataFormModal = closePdfDataFormModal;
    window.toggleEditPreview = toggleEditPreview;
    window.downloadPDF = downloadPDF;
    window.closePdfPreview = closePdfPreview;
    window.execEditCommand = execEditCommand;
    window.setFontSize = setFontSize;
    window.setFontFamily = setFontFamily;
    window.setFontColor = setFontColor;
    window.setLineHeight = setLineHeight;
    window.undo = undo;
    window.redo = redo;
    window.closeAudioPlayer = closeAudioPlayer;
})();
