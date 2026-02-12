// main.js – fitur interaktif (menu dan scroll) tetap dipertahankan
// Tidak ada penghapusan menu/fitur, hanya penambahan fungsi halus.

document.addEventListener('DOMContentLoaded', function() {

    // 1. SMOOTH SCROLL untuk navigasi internal (menu tetap utuh)
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. MENU AKTIF BERDASARKAN SCROLL (tanpa mengubah struktur menu)
    const sections = document.querySelectorAll('section');
    
    function setActiveMenu() {
        let current = '';
        const scrollPos = window.scrollY + 150; // offset
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1); // hapus #
            if (href === current) {
                link.classList.add('active');
            }
        });
    }
    
    // Panggil saat scroll dan saat halaman dimuat
    window.addEventListener('scroll', setActiveMenu);
    window.addEventListener('load', setActiveMenu);

    // 3. TAMBAHKAN CLASS ACTIVE PADA CSS (hiasan)
    // Style untuk menu aktif (sudah didefinisikan di CSS, pastikan ada)
    // Kita tambahkan style via JS jika belum ada (opsional)
    const style = document.createElement('style');
    style.textContent = `
        nav ul li a.active {
            color: #ffcc00 !important;
            border-bottom-color: #ffcc00 !important;
        }
    `;
    document.head.appendChild(style);
    
});
