document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu__list .link");

    const logoItem = document.querySelectorAll(".nav__title .link");

    
    const allItems = [...menuItems, ...logoItem];

    allItems.forEach((link) => {
        const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');

        if (currentPath !== '') {
            if (link.getAttribute("href").includes(currentPath.split('/').pop())) {
                const menuItem = link.querySelector(".menu__item");
                const navTitle = link.querySelector("#nav__title1");

                if (menuItem) {
                    menuItem.classList.add("active-underline");
                }

                if (navTitle) {
                    navTitle.classList.add("active-underline");
                }
            }
        }
    });
});
