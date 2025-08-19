document.getElementById("saveTable").addEventListener("click", () => {
    const table = document.querySelector(".protocol-table");
    const theadRows = Array.from(table.querySelector("thead").rows).map(row =>
        Array.from(row.cells).map(cell => cell.textContent)
    );
    const tbodyRows = Array.from(table.querySelector("tbody").rows).map(row =>
        Array.from(row.cells).map(cell => cell.textContent)
    );
    const tableData = { thead: theadRows, tbody: tbodyRows };
    localStorage.setItem("protocolTable", JSON.stringify(tableData));
    alert("Таблица сохранена!");
});

document.getElementById("loadTable").addEventListener("click", () => {
    const tableData = JSON.parse(localStorage.getItem("protocolTable"));
    if (!tableData) {
        alert("Нет сохраненных данных.");
        return;
    }

    const table = document.createElement("table");
    table.classList.add("protocol-table");

    const thead = document.createElement("thead");
    tableData.thead.forEach((row, index) => {
        const tr = document.createElement("tr");
        row.forEach((cell, cellIndex) => {
            const th = document.createElement("th");
            th.textContent = cell;
            if (index === 0 && cellIndex === 0) {
                th.style.width = "15px";
            }

            if (index === 1 && cellIndex === 0) {
                th.setAttribute("colspan", "4");
                th.style.textAlign = "center";
            }
            tr.appendChild(th);
        });
        thead.appendChild(tr);
    });
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tableData.tbody.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            td.setAttribute("contenteditable", "true");
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
    updateProtocolFormHeight();
});



function updateProtocolFormHeight() {
    const tableHeight = tableContainer.scrollHeight;
    const bodyDiv = document.querySelector('.filler-height');
    const bodyHeight = bodyDiv.offsetHeight;
    const additionalFormPadding = 210;
    const additionalBodyPadding = 125;

    protocolFormContainer.style.height = `${tableHeight + additionalFormPadding}px`;

    if (tableHeight + additionalFormPadding > bodyHeight) {
        bodyDiv.style.height = `${tableHeight + additionalFormPadding + additionalBodyPadding}px`;
    }

    if (tableHeight + additionalFormPadding < bodyHeight) {
        bodyDiv.style.height = `1200px`;
    }
}
