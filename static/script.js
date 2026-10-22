// Переключение между формами
function showRegister() {
    document.getElementById('loginBlock').style.display = 'none';
    document.getElementById('registerBlock').style.display = 'block';
    document.getElementById('regError').style.display = 'none';
}

function showLogin() {
    document.getElementById('registerBlock').style.display = 'none';
    document.getElementById('loginBlock').style.display = 'block';
}

// Обработка регистрации
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const pass = document.getElementById('regPassword').value;
    const passConfirm = document.getElementById('regPasswordConfirm').value;
    const errorMsg = document.getElementById('regError');

    // Проверка совпадения паролей
    if (pass !== passConfirm) {
        errorMsg.textContent = 'Пароли не совпадают!';
        errorMsg.style.display = 'block';
        return;
    }

    // MVP: Имитация успешной регистрации (пока без отправки на сервер)
    // Когда "Человек 2" будет готов, он раскомментирует код ниже
    /*
    const res = await fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            password: pass
        })
    });
    const data = await res.json();
    if (!data.success) { alert('Ошибка регистрации'); return; }
    */

    alert('Регистрация успешна! Теперь войдите в систему.');
    document.getElementById('registerForm').reset();
    showLogin();
};

// Логин
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const loginInput = document.getElementById('login').value;
    
    const res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            login: loginInput,
            password: document.getElementById('password').value
        })
    });
    
    const data = await res.json();
    if (data.success) {
        document.getElementById('loginBlock').style.display = 'none';
        document.getElementById('bookBlock').style.display = 'block';
        document.getElementById('usernameDisplay').textContent = loginInput;
        loadCars();
    } else {
        alert('Неверный логин или пароль');
    }
};

// Загрузка списка свободных машин
async function loadCars() {
    const res = await fetch('/cars');
    const cars = await res.json();
    const select = document.getElementById('carSelect');
    select.innerHTML = '<option value="">-- Выберите автомобиль --</option>';
    
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.name} (ID: ${car.id}) — ${car.price} у.е.`;
        select.appendChild(option);
    });
}

// Бронирование
document.getElementById('bookForm').onsubmit = async (e) => {
    e.preventDefault();
    const carId = parseInt(document.getElementById('carSelect').value);
    const msgElement = document.getElementById('message');
    
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
        loadCars(); // Обновляем список
    }
};