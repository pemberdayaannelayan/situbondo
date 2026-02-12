// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
});

// Gallery modal functionality
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const imgAlt = this.querySelector('img').alt;
        
        // Create modal
        const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0">
                    <div class="modal-body p-0 position-relative">
                        <img src="${imgSrc}" alt="${imgAlt}" class="img-fluid w-100 rounded">
                        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal"></button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
        
        // Remove modal when closed
        document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollTopBtn.className = 'btn btn-primary position-fixed bottom-3 end-3 rounded-circle shadow-lg';
scrollTopBtn.style.width = '50px';
scrollTopBtn.style.height = '50px';
scrollTopBtn.style.zIndex = '1000';
scrollTopBtn.style.display = 'none';
scrollTopBtn.style.background = 'linear-gradient(135deg, var(--conservation-teal), var(--eco-green))';
scrollTopBtn.style.border = 'none';

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.alignItems = 'center';
        scrollTopBtn.style.justifyContent = 'center';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== SHARE FUNCTIONS ==========

function openShareModal() {
    document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Penenggelaman Modul Rumah Ikan: Upaya Pelestarian Ekosistem Laut Situbondo\n\nProgram konservasi sumber daya kelautan melalui penenggelaman 15 unit modul rumah ikan (artificial reef) di Desa Kalianget dan Pasir Putih, Kabupaten Situbondo.\n\nBaca selengkapnya di:');
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link berhasil disalin ke clipboard!');
        closeShareModal();
    }).catch(err => {
        console.error('Gagal menyalin link: ', err);
        alert('Gagal menyalin link. Silakan coba lagi.');
    });
}

// ========== MODAL CLOSE HANDLERS ==========

// Share Modal
const shareModalEl = document.getElementById('shareModal');
if (shareModalEl) {
    shareModalEl.addEventListener('click', function(e) {
        if (e.target === this) {
            closeShareModal();
        }
    });
}

// Security Modal
const securityModalEl = document.getElementById('securityModal');
if (securityModalEl) {
    securityModalEl.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSecurityModal();
        }
    });
}

// PDF Preview Modal
const pdfPreviewModalEl = document.getElementById('pdfPreviewModal');
if (pdfPreviewModalEl) {
    pdfPreviewModalEl.addEventListener('click', function(e) {
        if (e.target === this) {
            closePdfPreview();
        }
    });
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeShareModal();
        closePdfPreview();
        closeSecurityModal();
    }
});

// ========== SECURITY FUNCTIONS ==========

// Generate security code based on current date (DDMMYYYY)
function generateSecurityCode() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return day + month + year;
}

// Toggle password visibility
const togglePasswordBtn = document.getElementById('togglePassword');
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', function() {
        const passwordInput = document.getElementById('securityCode');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

// Open security modal
function openSecurityModal() {
    const securityCodeInput = document.getElementById('securityCode');
    if (securityCodeInput) {
        securityCodeInput.value = '';
        securityCodeInput.type = 'password';
    }
    const toggleIcon = document.querySelector('#togglePassword i');
    if (toggleIcon) {
        toggleIcon.className = 'fas fa-eye';
    }
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    window.currentSecurityCode = generateSecurityCode();
    document.getElementById('securityModal').style.display = 'flex';
}

// Close security modal
function closeSecurityModal() {
    document.getElementById('securityModal').style.display = 'none';
    window.currentSecurityCode = null;
}

// Verify security code
function verifySecurityCode() {
    const enteredCode = document.getElementById('securityCode').value.trim();
    const errorElement = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (!enteredCode) {
        errorText.textContent = 'Harap masukkan kode keamanan!';
        errorElement.style.display = 'flex';
        return;
    }
    
    if (!/^\d{8}$/.test(enteredCode)) {
        errorText.textContent = 'Kode keamanan harus terdiri dari 8 digit angka!';
        errorElement.style.display = 'flex';
        return;
    }
    
    if (enteredCode === window.currentSecurityCode) {
        closeSecurityModal();
        generatePDFReport();
    } else {
        errorText.textContent = 'Kode keamanan tidak valid! Hubungi admin untuk mendapatkan kode yang benar.';
        errorElement.style.display = 'flex';
        document.getElementById('securityCode').value = '';
        document.getElementById('securityCode').focus();
    }
}

// Handle Enter key in security code input
const securityCodeInput = document.getElementById('securityCode');
if (securityCodeInput) {
    securityCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifySecurityCode();
        }
    });
}

// ========== PDF FUNCTIONS ==========

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function openPdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'flex';
}

function closePdfPreview() {
    document.getElementById('pdfPreviewModal').style.display = 'none';
}

// Placeholder logo untuk PDF (base64 - ikon ikan sederhana)
const placeholderLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzOCIgZmlsbD0iIzI3YWU2MCIvPjxwYXRoIGQ9Ik0yMCAzMGwxMCAxMEwyMCA1MHoiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTYwIDMwbC0xMCAxMCAxMCAxMHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+';

function generatePDFReport() {
    showLoading();
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const pdfContent = `
    <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #333;">
        <!-- Kop Surat -->
        <div style="margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 80px; vertical-align: middle; padding-top: 5px;">
                        <img src="${placeholderLogo}" 
                             alt="Logo Kabupaten Situbondo" 
                             style="width: 70px; height: 70px; object-fit: contain; display: block; border-radius: 0;">
                    </td>
                    <td style="vertical-align: middle; padding-left: 15px;">
                        <h2 style="margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">PEMERINTAH KABUPATEN SITUBONDO</h2>
                        <h1 style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1abc9c;">DINAS PETERNAKAN DAN PERIKANAN</h1>
                        <p style="margin: 0; font-size: 12px; letter-spacing: 0.3px; line-height: 1.5;">
                            Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664<br>
                            SITUBONDO 68312
                        </p>
                    </td>
                </tr>
            </table>
        </div>
        
        <!-- Judul Laporan -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: bold; color: #333;">LAPORAN KEGIATAN</h3>
            <h1 style="font-size: 16px; font-weight: bold; text-decoration: underline; color: #27ae60; line-height: 1.4;">
                PENENGGELAMAN MODUL RUMAH IKAN<br>
                UNTUK KONSERVASI EKOSISTEM LAUT SITUBONDO
            </h1>
        </div>
        
        <!-- Isi Laporan (sama seperti sebelumnya) -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1abc9c;">I. LATAR BELAKANG</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Dalam upaya pelestarian sumber daya ikan dan peningkatan produktivitas perairan, Dinas Kelautan dan Perikanan Provinsi Jawa Timur bersama Dinas Peternakan dan Perikanan Kabupaten Situbondo menyelenggarakan kegiatan penenggelaman modul rumah ikan (artificial reef). Kegiatan ini merupakan program strategis konservasi perairan yang dilaksanakan pada tanggal 20 & 26 November 2025 di Desa Kalianget dan Pasir Putih, Kabupaten Situbondo.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1abc9c;">II. TUJUAN KEGIATAN</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;">Mengurangi tekanan penangkapan di wilayah tangkap tradisional</li>
                <li style="margin-bottom: 10px;">Mendukung program konservasi sumber daya kelautan</li>
                <li style="margin-bottom: 10px;">Menciptakan habitat baru bagi biota laut untuk berkembang biak dan mencari makan</li>
                <li style="margin-bottom: 10px;">Meningkatkan produktivitas perairan dan hasil tangkapan nelayan</li>
                <li style="margin-bottom: 0;">Mendukung perikanan berkelanjutan di Kabupaten Situbondo</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1abc9c;">III. PELAKSANAAN KEGIATAN</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; line-height: 1.7;">
                <tr>
                    <td style="width: 35%; padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Waktu Pelaksanaan</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">20 & 26 November 2025</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Lokasi</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Desa Kalianget (Kec. Banyuglugur) & Desa Pasir Putih (Kec. Bungatan)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Jumlah Modul</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">15 Unit Rumah Ikan (Artificial Reef)</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">Kedalaman</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">± 50 meter dari permukaan laut</td>
                </tr>
            </table>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1abc9c;">IV. PENYELENGGARA</h4>
            <ol style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;">Dinas Kelautan dan Perikanan Provinsi Jawa Timur</li>
                <li style="margin-bottom: 10px;">Dinas Peternakan dan Perikanan Kabupaten Situbondo</li>
                <li style="margin-bottom: 0;">FORKOPIMKA (Forum Koordinasi Pimpinan Kecamatan) Setempat</li>
            </ol>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1abc9c;">V. MANFAAT DAN TUJUAN PROGRAM</h4>
            <ul style="margin-bottom: 20px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 10px;">Pelestarian Ekosistem: Menciptakan habitat baru bagi biota laut</li>
                <li style="margin-bottom: 10px;">Peningkatan Produktivitas: Meningkatkan hasil tangkapan nelayan tradisional</li>
                <li style="margin-bottom: 10px;">Pengurangan Tekanan Tangkap: Mengurangi beban penangkapan di wilayah tradisional</li>
                <li style="margin-bottom: 0;">Pemberdayaan Masyarakat: Melibatkan masyarakat nelayan dalam program konservasi</li>
            </ul>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1abc9c;">VI. HASIL KEGIATAN</h4>
            <p style="text-align: justify; margin-bottom: 20px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Kegiatan penenggelaman modul rumah ikan telah berhasil dilaksanakan dengan lancar dan aman. Sebanyak 15 unit modul rumah ikan telah ditenggelamkan di dua lokasi strategis dengan kedalaman optimal ± 50 meter. Masyarakat nelayan menyambut baik kegiatan ini dan siap menjaga serta memanfaatkan rumah ikan secara berkelanjutan. Partisipasi aktif masyarakat menjadi kunci keberhasilan program konservasi ini dalam jangka panjang.
            </p>
            
            <h4 style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #1abc9c;">VII. KESIMPULAN DAN REKOMENDASI</h4>
            <p style="text-align: justify; margin-bottom: 10px; font-size: 12px; line-height: 1.7; text-indent: 30px;">
                Program penenggelaman modul rumah ikan merupakan langkah strategis dalam upaya konservasi ekosistem laut di Kabupaten Situbondo. Untuk keberlanjutan program, disarankan:
            </p>
            <ol style="margin-bottom: 5px; padding-left: 25px; font-size: 12px; line-height: 1.7;">
                <li style="margin-bottom: 8px;">Melakukan monitoring berkala terhadap perkembangan ekosistem di sekitar modul</li>
                <li style="margin-bottom: 8px;">Melanjutkan program serupa di lokasi strategis lainnya</li>
                <li style="margin-bottom: 0;">Meningkatkan koordinasi dengan semua pihak terkait</li>
            </ol>
        </div>
        
        <!-- Tanda Tangan -->
        <div style="display: flex; justify-content: space-between; margin-top: 80px; align-items: flex-start;">
            <div style="width: 60%;">
                <div style="margin-bottom: 10px;">
                    <p style="margin-bottom: 5px; font-size: 12px;">Situbondo, ${formattedDate}</p>
                    <p style="font-weight: bold; font-size: 12px; margin-top: 40px;">Pelapor,</p>
                </div>
            </div>
            <div style="width: 35%;"></div>
        </div>
        
        <!-- Footer dengan garis dan QR code -->
        <div style="margin-top: 100px; border-top: 1px solid #ddd; padding-top: 15px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; font-size: 10px; color: #666; width: 70%;">
                    <p style="margin-bottom: 5px;">Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo</p>
                    <p>© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo</p>
                </div>
                <div style="text-align: right; width: 25%;">
                    <div class="qr-code" style="background: #ffffff; padding: 5px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); float: right;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=27ae60&bgcolor=ffffff" 
                             alt="QR Code Sumber Laporan" 
                             style="width: 70px; height: 70px; object-fit: contain;">
                    </div>
                    <p style="font-size: 9px; margin-top: 5px; color: #666; clear: both; text-align: right;">Scan untuk mengakses sumber laporan</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('pdfPreviewContent').innerHTML = pdfContent;
    hideLoading();
    openPdfPreview();
}

async function downloadPDF() {
    showLoading();
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const margin = 20;
        let yPos = margin;
        
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const logoWidth = 18;
        const logoHeight = 18;
        
        // Gunakan placeholder logo
        try {
            const placeholderImg = new Image();
            placeholderImg.src = placeholderLogo;
            await new Promise(resolve => { placeholderImg.onload = resolve; });
            doc.addImage(placeholderImg, 'PNG', margin, yPos, logoWidth, logoHeight);
        } catch (e) {
            console.log('Logo placeholder gagal dimuat, melanjutkan tanpa logo');
        }
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("PEMERINTAH KABUPATEN SITUBONDO", 105, yPos + 5, { align: 'center' });
        doc.setFontSize(12);
        doc.text("DINAS PETERNAKAN DAN PERIKANAN", 105, yPos + 11, { align: 'center' });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Jl. PB SUDIRMAN No 77c SITUBONDO TELP/FAX (0338) 672664", 105, yPos + 17, { align: 'center' });
        doc.text("SITUBONDO 68312", 105, yPos + 22, { align: 'center' });
        
        yPos += 30;
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LAPORAN KEGIATAN", 105, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setFontSize(14);
        const title1 = "PENENGGELAMAN MODUL RUMAH IKAN";
        const title2 = "UNTUK KONSERVASI EKOSISTEM LAUT SITUBONDO";
        
        const titleLines1 = doc.splitTextToSize(title1, 170);
        const titleLines2 = doc.splitTextToSize(title2, 170);
        
        titleLines1.forEach(line => {
            doc.text(line, 105, yPos, { align: 'center' });
            yPos += 7;
        });
        titleLines2.forEach(line => {
            doc.text(line, 105, yPos, { align: 'center' });
            yPos += 7;
        });
        yPos += 10;
        
        function addText(title, content, isList = false, isNumberedList = false) {
            if (yPos > 270) { doc.addPage(); yPos = margin; }
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(title, margin, yPos);
            yPos += 8;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            
            if (isList) {
                const items = content.split('\n');
                items.forEach((item, index) => {
                    if (yPos > 270) { doc.addPage(); yPos = margin + 8; }
                    const lines = doc.splitTextToSize(item, 160);
                    lines.forEach((line, lineIndex) => {
                        if (lineIndex === 0) {
                            if (isNumberedList) doc.text(`${index + 1}. ${line}`, margin + 5, yPos);
                            else doc.text(`• ${line}`, margin + 5, yPos);
                        } else doc.text(line, margin + 10, yPos);
                        yPos += 6;
                    });
                });
            } else {
                const lines = doc.splitTextToSize(content, 170);
                lines.forEach(line => {
                    if (yPos > 270) { doc.addPage(); yPos = margin + 8; }
                    doc.text(line, margin, yPos);
                    yPos += 6;
                });
            }
            yPos += 8;
        }
        
        addText("I. LATAR BELAKANG", 
            "Dalam upaya pelestarian sumber daya ikan dan peningkatan produktivitas perairan, Dinas Kelautan dan Perikanan Provinsi Jawa Timur bersama Dinas Peternakan dan Perikanan Kabupaten Situbondo menyelenggarakan kegiatan penenggelaman modul rumah ikan (artificial reef). Kegiatan ini merupakan program strategis konservasi perairan yang dilaksanakan pada tanggal 20 & 26 November 2025 di Desa Kalianget dan Pasir Putih, Kabupaten Situbondo.");
        addText("II. TUJUAN KEGIATAN", 
            "Mengurangi tekanan penangkapan di wilayah tangkap tradisional\nMendukung program konservasi sumber daya kelautan\nMenciptakan habitat baru bagi biota laut untuk berkembang biak dan mencari makan\nMeningkatkan produktivitas perairan dan hasil tangkapan nelayan\nMendukung perikanan berkelanjutan di Kabupaten Situbondo", true, true);
        addText("III. PELAKSANAAN KEGIATAN", 
            "Waktu Pelaksanaan: 20 & 26 November 2025\nLokasi: Desa Kalianget (Kec. Banyuglugur) & Desa Pasir Putih (Kec. Bungatan)\nJumlah Modul: 15 Unit Rumah Ikan (Artificial Reef)\nKedalaman: ± 50 meter dari permukaan laut", true);
        addText("IV. PENYELENGGARA", 
            "Dinas Kelautan dan Perikanan Provinsi Jawa Timur\nDinas Peternakan dan Perikanan Kabupaten Situbondo\nFORKOPIMKA (Forum Koordinasi Pimpinan Kecamatan) Setempat", true, true);
        addText("V. MANFAAT DAN TUJUAN PROGRAM", 
            "Pelestarian Ekosistem: Menciptakan habitat baru bagi biota laut\nPeningkatan Produktivitas: Meningkatkan hasil tangkapan nelayan tradisional\nPengurangan Tekanan Tangkap: Mengurangi beban penangkapan di wilayah tradisional\nPemberdayaan Masyarakat: Melibatkan masyarakat nelayan dalam program konservasi", true);
        addText("VI. HASIL KEGIATAN", 
            "Kegiatan penenggelaman modul rumah ikan telah berhasil dilaksanakan dengan lancar dan aman. Sebanyak 15 unit modul rumah ikan telah ditenggelamkan di dua lokasi strategis dengan kedalaman optimal ± 50 meter. Masyarakat nelayan menyambut baik kegiatan ini dan siap menjaga serta memanfaatkan rumah ikan secara berkelanjutan. Partisipasi aktif masyarakat menjadi kunci keberhasilan program konservasi ini dalam jangka panjang.");
        addText("VII. KESIMPULAN DAN REKOMENDASI", 
            "Program penenggelaman modul rumah ikan merupakan langkah strategis dalam upaya konservasi ekosistem laut di Kabupaten Situbondo. Untuk keberlanjutan program, disarankan:\nMelakukan monitoring berkala terhadap perkembangan ekosistem di sekitar modul\nMelanjutkan program serupa di lokasi strategis lainnya\nMeningkatkan koordinasi dengan semua pihak terkait", true);
        
        if (yPos > 250) { doc.addPage(); yPos = margin; }
        
        doc.setFontSize(11);
        doc.text(`Situbondo, ${formattedDate}`, margin, yPos);
        yPos += 12;
        doc.setFont("helvetica", "bold");
        doc.text("Pelapor,", margin, yPos);
        yPos += 25;
        
        doc.setLineWidth(0.1);
        doc.line(margin, yPos, 210 - margin, yPos);
        yPos += 5;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Laporan ini dibuat secara otomatis oleh sistem Dinas Perikanan Situbondo", margin, yPos);
        doc.text(`© ${currentDate.getFullYear()} Dinas Peternakan dan Perikanan Kabupaten Situbondo`, margin, yPos + 4);
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}&color=27ae60&bgcolor=ffffff`;
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'Anonymous';
            await new Promise(resolve => {
                qrImg.onload = resolve;
                qrImg.onerror = resolve;
                qrImg.src = qrCodeUrl;
            });
            const qrSize = 15;
            const qrX = 210 - margin - qrSize;
            const qrY = yPos - 9;
            if (qrImg.complete && qrImg.naturalHeight !== 0) {
                doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
                doc.setFontSize(6);
                doc.text("Scan untuk", qrX + qrSize/2, qrY + qrSize + 3, { align: 'center' });
                doc.text("mengakses", qrX + qrSize/2, qrY + qrSize + 6, { align: 'center' });
            }
        } catch (e) {
            console.log('QR code generation failed, continuing without it');
        }
        
        const fileName = `Laporan_Penenggelaman_Modul_Rumah_Ikan_Situbondo_${currentDate.getFullYear()}${String(currentDate.getMonth()+1).padStart(2,'0')}${String(currentDate.getDate()).padStart(2,'0')}.pdf`;
        doc.save(fileName);
        
        hideLoading();
        closePdfPreview();
        
        setTimeout(() => alert('Laporan PDF berhasil diunduh!'), 500);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
}

// Fix for footer positioning
function fixFooterPosition() {
    const footer = document.querySelector('.footer');
    const body = document.body;
    const html = document.documentElement;
    
    const bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowHeight = window.innerHeight;
    
    if (bodyHeight < windowHeight) {
        footer.style.position = 'absolute';
        footer.style.bottom = '0';
        footer.style.left = '0';
        footer.style.right = '0';
        body.style.position = 'relative';
        body.style.minHeight = '100vh';
    } else {
        footer.style.position = 'relative';
        footer.style.bottom = 'auto';
    }
}

window.addEventListener('load', fixFooterPosition);
window.addEventListener('resize', fixFooterPosition);

// Initial call in case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fixFooterPosition, 100);
} else {
    document.addEventListener('DOMContentLoaded', fixFooterPosition);
}
