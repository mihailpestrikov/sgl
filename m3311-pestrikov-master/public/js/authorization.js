const loginFormContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const logoutContainer = document.getElementById('logout-container');
const logoutButton = document.getElementById('logout-button');

let isAuthenticated = false;

async function login() {
  event.preventDefault();
  isAuthenticated = true;
  updateUI();
}

async function logout() {
  isAuthenticated = false;
  updateUI();
}

function showForm(type) {
  document.getElementById('login-form').classList.toggle('hidden', type !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', type !== 'register');

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[onclick="showForm('${type}')"]`).classList.add('active');
}


function updateUI() {
  if (isAuthenticated) {
    loginFormContainer.classList.add('hidden');
    logoutContainer.classList.remove('hidden');
  } else {
    loginFormContainer.classList.remove('hidden');
    logoutContainer.classList.add('hidden');
  }
}

loginForm.addEventListener('submit', login);
logoutButton.addEventListener('click', logout);

updateUI();


