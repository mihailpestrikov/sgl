(function () {
    function displayPerformanceStats() {
        const performanceData = performance.getEntriesByType("navigation")[0];
        const totalPageLoadTime = performanceData.loadEventEnd - performanceData.startTime;

        const statsContainer = document.querySelector(".footer__stats");
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            Общее время загрузки страницы: ${totalPageLoadTime.toFixed(2)} мс
        `;
    }

    window.addEventListener("load", function () {
        setTimeout(displayPerformanceStats, 0);
    });
})();
