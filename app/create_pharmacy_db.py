import sqlite3
import os

# Ensure database folder exists
if not os.path.exists('database'):
    os.makedirs('database')

# Connect to the database (creates it if not exists)
conn = sqlite3.connect('database/pharmacy.db')
cursor = conn.cursor()

# Create medicine_stock table with UNIQUE constraint on Medicine_Name
cursor.execute('''
CREATE TABLE IF NOT EXISTS medicine_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Medicine_Name TEXT NOT NULL UNIQUE,
    Current_Stock INTEGER NOT NULL
)
''')

# Insert sample medicine stock (skip if already exists)
cursor.execute("INSERT OR IGNORE INTO medicine_stock (Medicine_Name, Current_Stock) VALUES ('Paracetamol', 150)")
cursor.execute("INSERT OR IGNORE INTO medicine_stock (Medicine_Name, Current_Stock) VALUES ('Ibuprofen', 120)")
cursor.execute("INSERT OR IGNORE INTO medicine_stock (Medicine_Name, Current_Stock) VALUES ('Amoxicillin', 80)")

# Create users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
''')

# Insert default admin user
cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ('admin', 'password123'))

# Commit and close
conn.commit()
conn.close()

print("pharmacy.db created with medicine_stock and users tables.")
