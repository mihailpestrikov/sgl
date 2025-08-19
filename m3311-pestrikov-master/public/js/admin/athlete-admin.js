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

  loadUniversities();
  loadUniversitiesForFilter();
  loadTeams();

  if (document.getElementById('list-athletes-btn')) {
    document.getElementById('list-athletes-btn').addEventListener('click', listAthletes);
  }

  if (document.getElementById('create-athlete-form')) {
    document.getElementById('create-athlete-form').addEventListener('submit', createAthlete);

    // Добавляем выпадающий список спортивных званий для формы создания
    const sportTitleSelect = document.getElementById('sportTitle');
    if (sportTitleSelect) {
      populateSportTitles(sportTitleSelect);
    }
  }

  if (document.getElementById('load-athlete-btn')) {
    document.getElementById('load-athlete-btn').addEventListener('click', loadAthleteDetails);
  }

  if (document.getElementById('delete-athlete-btn')) {
    document.getElementById('delete-athlete-btn').addEventListener('click', deleteAthlete);
  }
});

function populateSportTitles(selectElement) {
  const sportTitles = [
    "",
    "Мастер спорта России международного класса",
    "Мастер спорта России",
    "Кандидат в мастера спорта",
    "I спортивный разряд",
    "II спортивный разряд",
    "III спортивный разряд",
    "I юношеский разряд",
    "II юношеский разряд",
    "III юношеский разряд"
  ];

  selectElement.innerHTML = '';

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Не указано';
  selectElement.appendChild(emptyOption);

  sportTitles.forEach(title => {
    if (title) {
      const option = document.createElement('option');
      option.value = title;
      option.textContent = title;
      selectElement.appendChild(option);
    }
  });
}

async function loadUniversitiesForFilter() {
  const universityFilterSelect = document.getElementById('universityFilter');
  if (!universityFilterSelect) return;

  try {
    const response = await fetch('/admin/api/universities');
    const data = await response.json();

    if (response.ok && data.items) {
      universityFilterSelect.innerHTML = '<option value="">Все ВУЗы</option>';

      data.items.forEach(university => {
        const option = document.createElement('option');
        option.value = university.id;
        option.textContent = university.shortName || university.name;
        universityFilterSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки университетов для фильтра:', error);
  }
}

async function listAthletes() {
  const page = document.getElementById('page').value || 1;
  const limit = document.getElementById('limit').value || 10;
  const search = document.getElementById('search').value || '';
  const universityFilter = document.getElementById('universityFilter').value || '';
  const resultDisplay = document.getElementById('athletes-list-result');

  resultDisplay.innerHTML = 'Загрузка...';

  try {
    let url = `/admin/api/athletes?page=${page}&limit=${limit}`;

    const searchParams = [];

    if (search) {
      searchParams.push(`name=${encodeURIComponent(search)}`);
    }

    if (universityFilter) {
      searchParams.push(`universityId=${encodeURIComponent(universityFilter)}`);
    }

    if (searchParams.length > 0) {
      url = `/admin/api/athletes/search?${searchParams.join('&')}&page=${page}&limit=${limit}`;
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
              <th>ФИО</th>
              <th>Пол</th>
              <th>Роль</th>
              <th>ВУЗ</th>
              <th colspan="2">Действия</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.items.forEach(athlete => {
        html += `
          <tr>
            <td>${athlete.id}</td>
            <td>${athlete.name}</td>
            <td>${athlete.gender}</td>
            <td>${athlete.role}</td>
            <td>${athlete.university?.shortName || athlete.university?.name || 'Не указан'}</td>
            <td><button class="edit-btn" onclick="loadAthleteForEdit('${athlete.id}')">Ред.</button></td>
            <td><button class="delete-btn" onclick="confirmDelete('${athlete.id}', '${athlete.name}')">Удалить</button></td>
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
      resultDisplay.innerHTML = `Ошибка: ${data.message || 'Не удалось загрузить данные'}`;
    }
  } catch (error) {
    resultDisplay.innerHTML = `Ошибка: ${error.message}`;
  }
}

async function loadUniversities() {
  const universitySelect = document.getElementById('universityId');
  if (!universitySelect) return;

  try {
    const response = await fetch('/admin/api/universities');
    const data = await response.json();

    if (response.ok && data.items) {
      universitySelect.innerHTML = '';

      data.items.forEach(university => {
        const option = document.createElement('option');
        option.value = university.id;
        option.textContent = university.shortName || university.name;
        universitySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки университетов:', error);
  }
}

async function loadTeams() {
  const teamSelect = document.getElementById('teamId');
  if (!teamSelect) return;

  try {
    const response = await fetch('/admin/api/teams');
    const data = await response.json();

    if (response.ok && data.items) {
      const firstOption = teamSelect.options[0];
      teamSelect.innerHTML = '';
      teamSelect.appendChild(firstOption);

      data.items.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = `${team.name} (${team.university.shortName || team.university.name})`;
        teamSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки команд:', error);
  }
}

async function createAthlete(event) {
  event.preventDefault();
  const form = event.target;
  const resultDisplay = document.getElementById('create-athlete-result');

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.height = parseInt(data.height);
  data.weight = parseInt(data.weight);
  data.birthYear = parseInt(data.birthYear);

  if (data.teamId === '') {
    delete data.teamId;
  }

  resultDisplay.innerHTML = 'Отправка данных...';

  try {
    const response = await fetch('/admin/api/athletes', {
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
          Спортсмен успешно создан!
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
      form.reset();
    } else {
      resultDisplay.innerHTML = `
        <div style="color: red">
          Ошибка: ${responseData.message || 'Не удалось создать спортсмена'}
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    }
  } catch (error) {
    resultDisplay.innerHTML = `Ошибка: ${error.message}`;
  }
}

async function loadAthleteDetails() {
  const athleteId = document.getElementById('update-athlete-id').value;
  const resultDisplay = document.getElementById('update-athlete-result');
  const form = document.getElementById('update-athlete-form');

  if (!athleteId) {
    resultDisplay.innerHTML = 'Введите ID спортсмена';
    return;
  }

  resultDisplay.innerHTML = 'Загрузка данных...';

  try {
    const response = await fetch(`/admin/api/athletes/${athleteId}`);
    const athlete = await response.json();

    if (response.ok) {
      form.innerHTML = `
        <input type="hidden" name="id" value="${athlete.id}">
        <div class="form-group">
          <label for="update-name">ФИО:</label>
          <input type="text" id="update-name" name="name" value="${athlete.name}" required>
        </div>
        <div class="form-group">
          <label for="update-role">Роль:</label>
          <input type="text" id="update-role" name="role" value="${athlete.role}" required>
        </div>
        <div class="form-group">
          <label for="update-gender">Пол:</label>
          <select id="update-gender" name="gender" required>
            <option value="Мужской" ${athlete.gender === 'Мужской' ? 'selected' : ''}>Мужской</option>
            <option value="Женский" ${athlete.gender === 'Женский' ? 'selected' : ''}>Женский</option>
          </select>
        </div>
        <div class="form-group">
          <label for="update-height">Рост (см):</label>
          <input type="number" id="update-height" name="height" min="100" max="250" value="${athlete.height}" required>
        </div>
        <div class="form-group">
          <label for="update-weight">Вес (кг):</label>
          <input type="number" id="update-weight" name="weight" min="40" max="150" value="${athlete.weight}" required>
        </div>
        <div class="form-group">
          <label for="update-birthYear">Год рождения:</label>
          <input type="number" id="update-birthYear" name="birthYear" min="1980" max="2010" value="${athlete.birthYear}" required>
        </div>
        <div class="form-group">
          <label for="update-sportTitle">Спортивное звание:</label>
          <select id="update-sportTitle" name="sportTitle">
          </select>
        </div>
        <div class="form-group">
          <label for="update-universityId">ВУЗ:</label>
          <select id="update-universityId" name="universityId" required>
          </select>
        </div>
        <div class="form-group">
          <label for="update-teamId">Команда:</label>
          <select id="update-teamId" name="teamId">
            <option value="">Нет команды</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit">Обновить</button>
        </div>
      `;

      const sportTitleSelect = document.getElementById('update-sportTitle');
      populateSportTitles(sportTitleSelect);

      if (athlete.sportTitle) {
        const options = sportTitleSelect.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === athlete.sportTitle) {
            options[i].selected = true;
            break;
          }
        }
      }

      await loadUpdateFormSelects(athlete.universityId, athlete.teamId);

      form.addEventListener('submit', updateAthlete);

      resultDisplay.innerHTML = '';
    } else {
      resultDisplay.innerHTML = `Ошибка: ${athlete.message || 'Спортсмен не найден'}`;
      form.innerHTML = '';
    }
  } catch (error) {
    resultDisplay.innerHTML = `Ошибка: ${error.message}`;
    form.innerHTML = '';
  }
}

async function loadUpdateFormSelects(universityId, teamId) {
  const universitySelect = document.getElementById('update-universityId');
  const teamSelect = document.getElementById('update-teamId');

  try {
    const uniResponse = await fetch('/admin/api/universities');
    const uniData = await uniResponse.json();

    if (uniResponse.ok && uniData.items) {
      universitySelect.innerHTML = '';

      uniData.items.forEach(university => {
        const option = document.createElement('option');
        option.value = university.id;
        option.textContent = university.shortName || university.name;
        if (university.id === universityId) {
          option.selected = true;
        }
        universitySelect.appendChild(option);
      });
    }

    const teamResponse = await fetch('/admin/api/teams');
    const teamData = await teamResponse.json();

    if (teamResponse.ok && teamData.items) {
      const firstOption = teamSelect.options[0];
      teamSelect.innerHTML = '';
      teamSelect.appendChild(firstOption);

      teamData.items.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = `${team.name} (${team.university.shortName || team.university.name})`;
        if (team.id === teamId) {
          option.selected = true;
        }
        teamSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки списков:', error);
  }
}

async function updateAthlete(event) {
  event.preventDefault();
  const form = event.target;
  const athleteId = form.querySelector('[name="id"]').value;
  const resultDisplay = document.getElementById('update-athlete-result');

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.height = parseInt(data.height);
  data.weight = parseInt(data.weight);
  data.birthYear = parseInt(data.birthYear);

  delete data.id;

  if (data.teamId === '') {
    delete data.teamId;
  }

  if (data.sportTitle === '') {
    data.sportTitle = null;
  }

  resultDisplay.innerHTML = 'Отправка данных...';

  try {
    const response = await fetch(`/admin/api/athletes/${athleteId}`, {
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
          Данные спортсмена успешно обновлены!
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    } else {
      resultDisplay.innerHTML = `
        <div style="color: red">
          Ошибка: ${responseData.message || 'Не удалось обновить данные спортсмена'}
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    }
  } catch (error) {
    resultDisplay.innerHTML = `Ошибка: ${error.message}`;
  }
}

async function deleteAthlete() {
  const athleteId = document.getElementById('delete-athlete-id').value;
  const resultDisplay = document.getElementById('delete-athlete-result');

  if (!athleteId) {
    resultDisplay.innerHTML = 'Введите ID спортсмена';
    return;
  }

  if (!confirm('Вы уверены, что хотите удалить этого спортсмена? Это действие нельзя отменить.')) {
    return;
  }

  resultDisplay.innerHTML = 'Удаление...';

  try {
    const response = await fetch(`/admin/api/athletes/${athleteId}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      resultDisplay.innerHTML = `
        <div style="color: green">
          Спортсмен успешно удален!
        </div>
      `;
      document.getElementById('delete-athlete-id').value = '';
    } else {
      const responseData = await response.json();
      resultDisplay.innerHTML = `
        <div style="color: red">
          Ошибка: ${responseData.message || 'Не удалось удалить спортсмена'}
        </div>
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      `;
    }
  } catch (error) {
    resultDisplay.innerHTML = `<div style="color: red">Ошибка: ${error.message}</div>`;
  }
}

function loadAthleteForEdit(athleteId) {
  document.querySelector('[data-tab="update"]').click();

  document.getElementById('update-athlete-id').value = athleteId;
  document.getElementById('load-athlete-btn').click();
}

function confirmDelete(athleteId, athleteName) {
  if (confirm(`Вы уверены, что хотите удалить спортсмена "${athleteName}"?`)) {
    document.querySelector('[data-tab="delete"]').click();

    document.getElementById('delete-athlete-id').value = athleteId;
    document.getElementById('delete-athlete-btn').click();
  }
}