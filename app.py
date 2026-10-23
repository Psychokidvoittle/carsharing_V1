from flask import Flask, request, jsonify, render_template
import json
import os

app = Flask(__name__, static_folder='static')

# === Работа с пользователями ===
def load_users():
    if not os.path.exists('users.json'):
        return {"admin": "123", "user": "password", "ivan": "ivan123"}
    with open('users.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_users(users):
    with open('users.json', 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

# === Работа с машинами ===
def get_cars():
    with open('cars.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_cars(cars):
    with open('cars.json', 'w', encoding='utf-8') as f:
        json.dump(cars, f, ensure_ascii=False, indent=2)

# === Страницы ===
@app.route('/')
def index():
    return render_template('index.html')

# === Логин ===
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    users = load_users()
    login = data.get('login')
    password = data.get('password')

    if users.get(login) == password:
        return jsonify({"success": True, "login": login})
    return jsonify({"success": False})

# === Регистрация ===
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    login = data.get('login', '').strip()
    password = data.get('password', '').strip()

    if not login or not password:
        return jsonify({"success": False, "message": "Заполните все поля"})

    users = load_users()

    if login in users:
        return jsonify({"success": False, "message": "Такой логин уже существует"})

    users[login] = password
    save_users(users)

    return jsonify({"success": True, "message": "Регистрация успешна! Теперь войдите."})

# === Машины ===
@app.route('/cars')
def get_cars_list():
    cars = get_cars()
    return jsonify([c for c in cars if c['free']])

@app.route('/book', methods=['POST'])
def book():
    cars = get_cars()
    car_id = int(request.json.get('car_id', 0))

    for car in cars:
        if car['id'] == car_id and car['free']:
            car['free'] = False
            save_cars(cars)
            return jsonify({"success": True, "message": f"{car['name']} забронирована!"})

    return jsonify({"success": False, "message": "Машина уже занята"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)