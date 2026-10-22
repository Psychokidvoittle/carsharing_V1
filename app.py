import os
from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__, static_folder='static')

USERS = {"admin": "123", "user": "password"}

def get_cars():
    with open('cars.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_cars(cars):
    with open('cars.json', 'w', encoding='utf-8') as f:
        json.dump(cars, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    # Эта строка принудительно берёт index.html из той же папки, где лежит app.py
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if USERS.get(data.get('login')) == data.get('password'):
        return jsonify({"success": True, "login": data.get('login')})
    return jsonify({"success": False})

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
