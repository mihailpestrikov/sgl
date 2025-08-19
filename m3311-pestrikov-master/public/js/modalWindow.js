document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const caption = document.getElementById('caption');
    const closeButton = document.getElementsByClassName('close')[0];
    const downloadButton = document.getElementsByClassName('download-button')[0];

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImage.src = this.src; 
            caption.textContent = this.src.split('/').pop();
        });
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    downloadButton.addEventListener('click', function() {
        const downloadLink = document.createElement('a');
        downloadLink.href = modalImage.src;
        downloadLink.download = modalImage.src.split('/').pop();
        downloadLink.click(); 
    });
});
