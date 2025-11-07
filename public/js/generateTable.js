document.addEventListener("DOMContentLoaded", () => {
    const protocolFormContainer = document.getElementById("protocolFormContainer");
    const tableContainer = document.getElementById("tableContainer");
    const protocolForm = document.getElementById('protocolForm');

    if (!protocolForm || protocolForm.dataset.initialized) return;
    protocolForm.dataset.initialized = 'true';

    protocolForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const rowCount = parseInt(document.getElementById('rowCount').value, 10);
        const distance = document.getElementById('distance').value;
    
        if (isNaN(rowCount) || rowCount <= 0 || distance.trim() === '') {
            alert('Введите количество участников и дистанцию!');
            return;
        }
    
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = '';

        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('protocol-table-container');
        const table = document.createElement('table');
        table.classList.add('protocol-table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="width: 15px;">Место</th>
                <th>Участник</th>
                <th>Время</th>
                <th>ВУЗ</th>
            </tr>
            <tr>
                <th colspan="4" style="text-align: center;">Дистанция: ${distance} м</th>
            </tr>
        `;
        table.appendChild(thead);
    
        const tbody = document.createElement('tbody');
        for (let i = 1; i <= rowCount; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <tr>
                    <td contenteditable="true">${i}</td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                </tr>`;
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    
        tableWrapper.appendChild(table);
        tableContainer.appendChild(tableWrapper);
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
});
