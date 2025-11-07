document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector(".burger");
    const menuList = document.querySelector(".menu__list");

    if (burger && menuList && !burger.dataset.initialized) {
        burger.dataset.initialized = 'true';

        burger.addEventListener("click", function () {
            menuList.classList.toggle("active");
        });
    }
});
