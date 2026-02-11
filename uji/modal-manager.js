/**
 * MODAL MANAGER
 * Mengelola modal gambar ikan dan kapal
 * Versi: 1.0.0
 */

class ModalManager {
    constructor() {
        this.fishModal = null;
        this.boatModal = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.preloadImages();
        this.ensureGlobalFunctions();
    }

    setupEventListeners() {
        // Tombol info ikan
        const fishInfoBtn = document.querySelector('.fish-info-btn');
        if (fishInfoBtn) {
            fishInfoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFishModal();
            });
        }

        // Tombol info kapal
        const boatInfoBtn = document.querySelector('.boat-info-btn');
        if (boatInfoBtn) {
            boatInfoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showBoatModal();
            });
        }

        // Event listener untuk modal fishInfoModal
        const fishInfoModal = document.getElementById('fishInfoModal');
        if (fishInfoModal) {
            fishInfoModal.addEventListener('show.bs.modal', () => this.onFishModalShow());
            fishInfoModal.addEventListener('hidden.bs.modal', () => this.cleanupModal());
        }

        // Event listener untuk modal boatInfoModal
        const boatInfoModal = document.getElementById('boatInfoModal');
        if (boatInfoModal) {
            boatInfoModal.addEventListener('show.bs.modal', () => this.onBoatModalShow());
            boatInfoModal.addEventListener('hidden.bs.modal', () => this.cleanupModal());
        }

        // Event listener untuk tombol close di modal fishInfoModal
        const fishModalCloseBtns = document.querySelectorAll('#fishInfoModal .btn-close, #fishInfoModal .btn-secondary');
        fishModalCloseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeFishModalSafely();
            });
        });

        // Event listener untuk tombol close di modal boatInfoModal
        const boatModalCloseBtns = document.querySelectorAll('#boatInfoModal .btn-close, #boatInfoModal .btn-secondary');
        boatModalCloseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeBoatModalSafely();
            });
        });
    }

    ensureGlobalFunctions() {
        // Ensure global functions exist for backward compatibility
        if (typeof window.showFishInfoModal === 'undefined') {
            window.showFishInfoModal = () => this.showFishModal();
        }
        
        if (typeof window.showBoatInfoModal === 'undefined') {
            window.showBoatInfoModal = () => this.showBoatModal();
        }
        
        if (typeof window.closeFishInfoModalSafely === 'undefined') {
            window.closeFishInfoModalSafely = () => this.closeFishModalSafely();
        }
        
        if (typeof window.closeBoatInfoModalSafely === 'undefined') {
            window.closeBoatInfoModalSafely = () => this.closeBoatModalSafely();
        }
        
        if (typeof window.goToInputDataAfterModal === 'undefined') {
            window.goToInputDataAfterModal = () => this.goToInputDataAfterModal();
        }
        
        if (typeof window.showSpecificFishImage === 'undefined') {
            window.showSpecificFishImage = (num) => this.showSpecificFishImage(num);
        }
        
        if (typeof window.showSpecificBoatImage === 'undefined') {
            window.showSpecificBoatImage = (num) => this.showSpecificBoatImage(num);
        }
    }

    preloadImages() {
        this.preloadFishImages();
        this.preloadBoatImages();
    }

    preloadFishImages() {
        const imageUrls = [
            'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/simpadan/hasil-tangkapan/info-jenis-ikan-tangkapan-1.jpg',
            'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/simpadan/hasil-tangkapan/info-jenis-ikan-tangkapan-2.jpg',
            'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/simpadan/hasil-tangkapan/info-jenis-ikan-tangkapan-3.jpg'
        ];

        imageUrls.forEach((url, index) => {
            this.loadImageWithFallback(url, `fishImage${index + 1}`, `Gambar referensi ikan ${index + 1} tidak tersedia`);
        });
    }

    preloadBoatImages() {
        const imageUrls = [
            'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/simpadan/hasil-tangkapan/jenis-perahu-1.png',
            'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/simpadan/hasil-tangkapan/jenis-perahu-2.png',
            'https://raw.githubusercontent.com/pemberdayaannelayan/situbondo/refs/heads/main/simpadan/hasil-tangkapan/jenis-perahu-3.png'
        ];

        imageUrls.forEach((url, index) => {
            this.loadImageWithFallback(url, `boatImage${index + 1}`, `Gambar referensi kapal ${index + 1} tidak tersedia`);
        });
    }

    loadImageWithFallback(url, elementId, altText) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            console.log(`Gambar ${elementId} berhasil dimuat`);
        };
        img.onerror = () => {
            console.error(`Gagal memuat gambar: ${url}`);
            const imgElement = document.getElementById(elementId);
            if (imgElement) {
                imgElement.src = this.createPlaceholderSVG();
                imgElement.alt = altText;
            }
        };
    }

    createPlaceholderSVG() {
        return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f8f9fa"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%236c757d">Gambar tidak tersedia</text></svg>';
    }

    showFishModal() {
        try {
            this.cleanupBackdrop();
            document.body.classList.remove('modal-open');
            
            this.fishModal = new bootstrap.Modal(document.getElementById('fishInfoModal'), {
                backdrop: true,
                keyboard: true
            });
            this.fishModal.show();
        } catch (error) {
            console.error('Gagal membuka modal info ikan:', error);
            this.showErrorAlert('Modal informasi ikan tidak dapat dibuka. Silakan coba lagi.');
        }
    }

    showBoatModal() {
        try {
            this.cleanupBackdrop();
            document.body.classList.remove('modal-open');
            
            this.boatModal = new bootstrap.Modal(document.getElementById('boatInfoModal'), {
                backdrop: true,
                keyboard: true
            });
            this.boatModal.show();
        } catch (error) {
            console.error('Gagal membuka modal info kapal:', error);
            this.showErrorAlert('Modal informasi kapal tidak dapat dibuka. Silakan coba lagi.');
        }
    }

    onFishModalShow() {
        // Pastikan gambar dimuat dengan benar saat modal dibuka
        setTimeout(() => {
            const images = document.querySelectorAll('#fishInfoModal img');
            images.forEach(img => {
                if (img.complete && img.naturalHeight === 0) {
                    img.src = img.src; // Coba muat ulang jika gagal
                }
            });
        }, 100);
    }

    onBoatModalShow() {
        // Pastikan gambar dimuat dengan benar saat modal dibuka
        setTimeout(() => {
            const images = document.querySelectorAll('#boatInfoModal img');
            images.forEach(img => {
                if (img.complete && img.naturalHeight === 0) {
                    img.src = img.src; // Coba muat ulang jika gagal
                }
            });
        }, 100);
    }

    cleanupBackdrop() {
        const existingBackdrops = document.querySelectorAll('.modal-backdrop');
        existingBackdrops.forEach(backdrop => backdrop.remove());
    }

    cleanupModal() {
        setTimeout(() => {
            this.cleanupBackdrop();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 300);
    }

    closeFishModalSafely() {
        if (this.fishModal) {
            this.fishModal.hide();
        }
        this.cleanupModal();
    }

    closeBoatModalSafely() {
        if (this.boatModal) {
            this.boatModal.hide();
        }
        this.cleanupModal();
    }

    goToInputDataAfterModal() {
        this.closeFishModalSafely();
        this.closeBoatModalSafely();
        
        setTimeout(() => {
            try {
                const inputTab = document.getElementById('v-pills-input-tab');
                if (inputTab) {
                    inputTab.click();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    const namaInput = document.getElementById('nama');
                    if (namaInput) {
                        setTimeout(() => namaInput.focus(), 100);
                    }
                }
            } catch (error) {
                console.error('Error navigating to input tab:', error);
            }
        }, 400);
    }

    showSpecificFishImage(imageNumber) {
        this.showFishModal();
        setTimeout(() => {
            const imageElement = document.getElementById(`fishImage${imageNumber}`);
            if (imageElement) {
                imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }

    showSpecificBoatImage(imageNumber) {
        this.showBoatModal();
        setTimeout(() => {
            const imageElement = document.getElementById(`boatImage${imageNumber}`);
            if (imageElement) {
                imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }

    showErrorAlert(message) {
        alert(message);
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
    
    // Log initialization
    console.log('Modal Manager initialized successfully');
});
