function setupModalWindow() {
    const modal = document.getElementById('modal');
    if (!modal) return;

    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.modal-close');
    const downloadBtn = document.querySelector('.modal-download');

    if (modal.dataset.initialized === 'true') return;
    modal.dataset.initialized = 'true';

    document.querySelectorAll('.gallery-image').forEach(img => {
        img.onclick = function() {
            modal.style.display = 'block';

            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            modalImg.src = this.src;
            captionText.innerHTML = this.alt || this.src.split('/').pop();

            document.body.style.overflow = 'hidden';
        }
    });

    function closeModal() {
        modal.classList.remove('show');

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    closeBtn.onclick = function(event) {
        event.stopPropagation();
        closeModal();
    };

    modal.addEventListener('click', function(event) {
        const clickedOnDownloadBtn = downloadBtn === event.target ||
          downloadBtn.contains(event.target);

        if (!modalImg.contains(event.target) && !clickedOnDownloadBtn) {
            closeModal();
        }
    });

    modalImg.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    if (captionText) {
        captionText.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function downloadImage(src) {
        const link = document.createElement('a');
        link.href = src;
        link.download = src.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        downloadImage(modalImg.src);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const swiperContainer = document.querySelector('.swiper-container');
    if (typeof Swiper !== 'undefined' && swiperContainer && !swiperContainer.swiper) {
        const swiper = new Swiper('.swiper-container', {
            speed: 800,
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    setupModalWindow();
});