document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu__item");

    if (menuItems.length > 0 && !document.body.dataset.hoverInitialized) {
        document.body.dataset.hoverInitialized = 'true';

        menuItems.forEach(item => {
            item.addEventListener("mouseenter", () => {
                item.style.color = "#1fa0eb";
                item.style.backgroundColor = "#041c36";
            });

            item.addEventListener("mouseleave", () => {
                item.style.color = "";
                item.style.backgroundColor = "";
            });
        });
    }
});
