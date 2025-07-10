from flask import Flask, render_template, jsonify, request, redirect, url_for, session, flash
import pandas as pd
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'your_super_secret_key'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database', 'pharmacy.db')

# Fetch stock data
def get_stock_data():
    conn = sqlite3.connect(DB_PATH)
    query = "SELECT * FROM medicine_stock"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

# Home Page
@app.route('/')
def home():
    return render_template('home.html')

# Dashboard
@app.route('/dashboard')
def dashboard_page():
    return render_template('dashboard.html')

# API: Stock Data
@app.route('/api/stock-data')
def stock_data():
    stock_df = get_stock_data()
    data = stock_df.to_dict(orient='records')
    return jsonify(data)

# API: Low Stock Alerts
@app.route('/api/low-stock-alerts')
def low_stock_alerts():
    df = get_stock_data()
    alerts = df[df['Current_Stock'] < 50]
    alert_list = alerts['Medicine_Name'].tolist()
    return jsonify(alert_list)

# API: Add New Medicine
@app.route('/api/add-medicine', methods=['POST'])
def add_medicine():
    name = request.json.get('name')
    stock = request.json.get('stock')

    if not name or stock is None:
        return jsonify({'status': 'error', 'message': 'Missing name or stock value'}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO medicine_stock (Medicine_Name, Current_Stock) VALUES (?, ?)", (name, stock))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'status': 'error', 'message': f'Medicine {name} already exists'}), 409
    finally:
        conn.close()

    return jsonify({'status': 'success', 'message': f'{name} added with stock {stock}'})

# ✅ API: Delete Medicine
@app.route('/api/delete-medicine', methods=['POST'])
def delete_medicine():
    name = request.json.get('name')
    if not name:
        return jsonify({'status': 'error', 'message': 'Medicine name is required'}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM medicine_stock WHERE Medicine_Name=?", (name,))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'message': f'{name} deleted'})

# API: Change Password
@app.route('/api/change-password', methods=['POST'])
def change_password():
    username = session.get('username')
    old_password = request.json.get('old_password')
    new_password = request.json.get('new_password')

    if not username:
        return jsonify({'status': 'error', 'message': 'User not logged in'}), 403

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, old_password))
    user = cursor.fetchone()

    if user:
        cursor.execute("UPDATE users SET password=? WHERE username=?", (new_password, username))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'message': 'Password updated successfully'})
    else:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Incorrect old password'}), 400

# API: Update Threshold (demo placeholder)
@app.route('/api/update-threshold', methods=['POST'])
def update_threshold():
    new_threshold = request.json.get('threshold')
    print(f"New threshold set to: {new_threshold}")
    return jsonify({'status': 'success', 'message': f'Threshold updated to {new_threshold}'})

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['username'] = username
            return redirect(url_for('dashboard_page'))
        else:
            flash('Invalid credentials. Try again.', 'danger')
            return redirect(url_for('login'))

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            flash('User registered successfully!', 'success')
            return redirect(url_for('dashboard_page'))# corrected
        except sqlite3.IntegrityError:
            flash('Username already exists.', 'danger')
            return redirect(url_for('register'))
        finally:
            conn.close()

    return render_template('register.html')



@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


@app.route('/settings')
def settings_page():
    return render_template('settings.html')


@app.route('/api/reorder-medicine', methods=['POST'])
def reorder_medicine():
    data = request.get_json()
    name = data.get('name')
    quantity = data.get('quantity')

    if not name or quantity is None:
        return jsonify({'status': 'error', 'message': 'Invalid input'}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE medicine_stock SET Current_Stock = Current_Stock + ? WHERE Medicine_Name=?", (quantity, name))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'message': f'{quantity} units of {name} added to stock.'})

if __name__ == '__main__':
    app.run(debug=True)
