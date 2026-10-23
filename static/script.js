// === Переключение форм ===
function showRegister() {
    document.getElementById('loginBlock').style.display = 'none';
    document.getElementById('registerBlock').style.display = 'block';
    document.getElementById('regError').style.display = 'none';
}

function showLogin() {
    document.getElementById('registerBlock').style.display = 'none';
    document.getElementById('loginBlock').style.display = 'block';
    document.getElementById('loginError').style.display = 'none';
}

// === Регистрация ===
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();

    const login = document.getElementById('regLogin').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const errorBlock = document.getElementById('regError');

    const res = await fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ login, password })
    });

    const data = await res.json();

    if (data.success) {
        alert(data.message);
        document.getElementById('registerForm').reset();
        showLogin();
    } else {
        errorBlock.style.display = 'block';
        errorBlock.textContent = data.message;
    }
};

// === Логин ===
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const errorBlock = document.getElementById('loginError');

    const res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ login, password })
    });

    const data = await res.json();

    if (data.success) {
        document.getElementById('loginBlock').style.display = 'none';
        document.getElementById('bookBlock').style.display = 'block';
        document.getElementById('usernameDisplay').textContent = data.login;
        errorBlock.style.display = 'none';
        await loadCars();
    } else {
        errorBlock.style.display = 'block';
        errorBlock.textContent = 'Неверный логин или пароль';
    }
};

// === Выход ===
function logout() {
    location.reload();
}

// === Загрузка машин ===
async function loadCars() {
    const res = await fetch('/cars');
    const cars = await res.json();
    const select = document.getElementById('carSelect');

    select.innerHTML = '<option value="">-- Выберите автомобиль --</option>';

    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.name} — ${car.price} у.е.`;
        select.appendChild(option);
    });
}

// === Бронирование ===
document.getElementById('bookForm').onsubmit = async (e) => {
    e.preventDefault();

    const carId = parseInt(document.getElementById('carSelect').value);
    const msgElement = document.getElementById('message');

    if (!carId) {
        msgElement.textContent = 'Сначала выберите машину';
        msgElement.style.color = 'red';
        return;
    }

    msgElement.textContent = 'Обработка...';
    msgElement.style.color = 'gray';

    const res = await fetch('/book', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ car_id: carId })
    });

    const data = await res.json();
    msgElement.textContent = data.message;
    msgElement.style.color = data.success ? 'green' : 'red';

    if (data.success) {
        await loadCars();
    }
};