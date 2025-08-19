document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector(".burger");
    const menuList = document.querySelector(".menu__list");


    burger.addEventListener("click", function () {
        menuList.classList.toggle("active");
    });
});
