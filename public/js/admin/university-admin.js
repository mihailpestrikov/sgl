document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.admin-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });

  if (document.getElementById('list-universities-btn')) {
    document.getElementById('list-universities-btn').addEventListener('click', listUniversities);
  }

  if (document.getElementById('create-university-form')) {
    document.getElementById('create-university-form').addEventListener('submit', createUniversity);
  }

  if (document.getElementById('load-university-btn')) {
    document.getElementById('load-university-btn').addEventListener('click', loadUniversityDetails);
  }

  if (document.getElementById('delete-university-btn')) {
    document.getElementById('delete-university-btn').addEventListener('click', deleteUniversity);
  }
});

async function listUniversities() {
  const page = document.getElementById('page').value || 1;
  const limit = document.getElementById('limit').value || 10;
  const search = document.getElementById('search').value || '';
  const resultDisplay = document.getElementById('universities-list-result');

  resultDisplay.innerHTML = 'Загрузка...';

  try {
    let url = `/admin/api/universities?page=${page}&limit=${limit}`;
    if (search) {
      url = `/admin/api/universities/search?name=${encodeURIComponent(search)}&page=${page}&limit=${limit}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      let html = `
        <h4>Всего: ${data.total}</h4>
        <table class="result-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Сокращение</th>
              <th>Год вступления в СГЛ</th>
              <th colspan="2">Действия</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.items.forEach(university => {
        html += `
          <tr>
            <td>${university.id}</td>
            <td>${university.name}</td>
            <td>${university.shortName || '-'}</td>
            <td>${university.sglJoinYear}</td>
            <td><button class="edit-btn" onclick="loadUniversityForEdit('${university.id}')">Ред.</button></td>
            <td><button class="delete-btn" onclick="confirmDeleteUniversity('${university.id}', '${university.name}')">Удалить</button></td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
        <div class="pagination">
          Страница ${data.page} из ${data.totalPages}
        </div>
      `;

      resultDisplay.innerHTML = html;
    } else {
      resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${data.message || 'Не удалось загрузить данные'}</div>`;
    }
  } catch (error) {
    resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${error.message}</div>`;
  }
}

async function createUniversity(event) {
  event.preventDefault();
  const form = event.target;
  const resultDisplay = document.getElementById('create-university-result');

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.sglJoinYear = parseInt(data.sglJoinYear);

  resultDisplay.innerHTML = 'Отправка данных...';

  try {
    const response = await fetch('/admin/api/universities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok) {
      resultDisplay.innerHTML = `
        <div style="color: green">
          Университет успешно создан!
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
      form.reset();
    } else {
      resultDisplay.innerHTML = `
        <div style="color: red">
          Ошибка: ${responseData.message || 'Не удалось создать университет'}
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    }
  } catch (error) {
    resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${error.message}</div>`;
  }
}

async function loadUniversityDetails() {
  const universityId = document.getElementById('update-university-id').value;
  const resultDisplay = document.getElementById('update-university-result');
  const form = document.getElementById('update-university-form');

  if (!universityId) {
    resultDisplay.innerHTML = 'Введите ID университета';
    return;
  }

  resultDisplay.innerHTML = 'Загрузка данных...';

  try {
    const response = await fetch(`/admin/api/universities/${universityId}`);
    const university = await response.json();

    if (response.ok) {
      form.innerHTML = `
        <input type="hidden" name="id" value="${university.id}">
        <div class="form-group">
          <label for="update-name">Полное название:</label>
          <input type="text" id="update-name" name="name" value="${university.name}" required>
        </div>
        <div class="form-group">
          <label for="update-shortName">Сокращенное название:</label>
          <input type="text" id="update-shortName" name="shortName" value="${university.shortName || ''}">
        </div>
        <div class="form-group">
          <label for="update-foundationDate">Дата основания:</label>
          <input type="text" id="update-foundationDate" name="foundationDate" value="${university.foundationDate}" required>
        </div>
        <div class="form-group">
          <label for="update-sglJoinYear">Год вступления в СГЛ:</label>
          <input type="number" id="update-sglJoinYear" name="sglJoinYear" min="1900" max="2025" value="${university.sglJoinYear}" required>
        </div>
        <div class="form-group">
          <label for="update-achievements">Достижения:</label>
          <input type="text" id="update-achievements" name="achievements" value="${university.achievements || ''}">
        </div>
        <div class="form-group">
          <label for="update-description">Описание:</label>
          <textarea id="update-description" name="description" rows="5" required>${university.description}</textarea>
        </div>
        <div class="form-group">
          <label for="update-headerImage">URL баннера:</label>
          <input type="text" id="update-headerImage" name="headerImage" value="${university.headerImage || ''}">
        </div>
        <div class="form-group">
          <label for="update-logo">URL логотипа:</label>
          <input type="text" id="update-logo" name="logo" value="${university.logo || ''}">
        </div>
        <div class="form-buttons">
          <button type="submit">Обновить</button>
        </div>
      `;

      form.addEventListener('submit', updateUniversity);

      resultDisplay.innerHTML = '';
    } else {
      resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${university.message || 'Университет не найден'}</div>`;
      form.innerHTML = '';
    }
  } catch (error) {
    resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${error.message}</div>`;
    form.innerHTML = '';
  }
}

async function updateUniversity(event) {
  event.preventDefault();
  const form = event.target;
  const universityId = form.querySelector('[name="id"]').value;
  const resultDisplay = document.getElementById('update-university-result');

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.sglJoinYear = parseInt(data.sglJoinYear);

  delete data.id;

  resultDisplay.innerHTML = 'Отправка данных...';

  try {
    const response = await fetch(`/admin/api/universities/${universityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok) {
      resultDisplay.innerHTML = `
        <div style="color: green">
          Данные университета успешно обновлены!
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    } else {
      resultDisplay.innerHTML = `
        <div style="color: red">
          Ошибка: ${responseData.message || 'Не удалось обновить данные университета'}
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    }
  } catch (error) {
    resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${error.message}</div>`;
  }
}

async function deleteUniversity() {
  const universityId = document.getElementById('delete-university-id').value;
  const resultDisplay = document.getElementById('delete-university-result');

  if (!universityId) {
    resultDisplay.innerHTML = 'Введите ID университета';
    return;
  }

  if (!confirm('Вы уверены, что хотите удалить этот университет? Это действие нельзя отменить.')) {
    return;
  }

  resultDisplay.innerHTML = 'Удаление...';

  try {
    const response = await fetch(`/admin/api/universities/${universityId}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      resultDisplay.innerHTML = `
        <div style="color: green">
          Университет успешно удален!
        </div>
      `;
      document.getElementById('delete-university-id').value = '';
    } else {
      const responseData = await response.json();
      resultDisplay.innerHTML = `
        <div style="color: red">
          Ошибка: ${responseData.message || 'Не удалось удалить университет'}
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    }
  } catch (error) {
    resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${error.message}</div>`;
  }
}

function loadUniversityForEdit(universityId) {
  document.querySelector('[data-tab="update"]').click();

  document.getElementById('update-university-id').value = universityId;
  document.getElementById('load-university-btn').click();
}

function confirmDeleteUniversity(universityId, universityName) {
  if (confirm(`Вы уверены, что хотите удалить университет "${universityName}"?`)) {
    document.querySelector('[data-tab="delete"]').click();

    document.getElementById('delete-university-id').value = universityId;
    document.getElementById('delete-university-btn').click();
  }
}