📖 MediTrack AI — README


📌 OVERVIEW.





MediTrack AI is a pharmacy inventory management and demand forecasting system that leverages artificial intelligence to optimize medicine stock levels, minimize waste, and prevent shortages. This platform empowers pharmacy managers and healthcare facilities to make data-driven decisions for improved operational efficiency and patient care outcomes.

Built with a modern, responsive UI using HTML, CSS, Bootstrap, and JavaScript, and powered by a Python Flask backend with SQLite for data management, MediTrack AI integrates predictive analytics models to anticipate stock requirements based on historical data.



🌍 Sustainable Development Goal Alignment.





This project directly supports United Nations Sustainable Development Goal (SDG) 3: Good Health and Well-Being.
By ensuring consistent availability of essential medicines through AI-driven demand prediction and inventory tracking, MediTrack AI contributes to:

Target 3.8: Achieve universal health coverage, including access to safe, effective, quality, and affordable essential medicines and vaccines.

Target 3.D: Strengthen the capacity for early warning, risk reduction, and management of national and global health risks.
















⚙️ How It Works
Key Features:

📊 Dashboard: View stock levels, demand forecasts, and alerts.

📦 Inventory Management: Add, update, and track medicines with expiry monitoring.

📈 Demand Prediction: AI-powered forecasts based on historical stock movement and trends.

🔐 User Registration & Authentication: Secure access for pharmacists and administrators.

📑 Password Strength Meter: Ensures strong password practices during account creation.

Tech Stack:

Frontend: HTML, CSS, Bootstrap, FontAwesome, JavaScript

Backend: Python, Flask

Database: SQLite

AI Model: Supervised machine learning for demand forecasting (trained offline)

Flow Summary:

User registers and logs into the system.

Dashboard displays real-time inventory levels and AI-predicted stock requirements.

User can add, remove, or update medicine stock.

AI prediction model informs restocking decisions, reducing wastage and stockouts.












🌐 Live Demo
👉 https: https://meditrack-ai-4.onrender.com

Test Account Credentials:

Username: admin

Password: password123

Alternatively, you can create your own account with a custom username and password on the registration page.
















📑 Pitch Deck
View the project pitch deck detailing the problem statement, solution design, AI implementation, and expected impact:










👉 https:https://gamma.app/docs/MediTrack-AI-Smart-Medicine-Stock-Tracking-Platform-4kbnmtn2tdsxm7k











📌 Final Notes
MediTrack AI addresses a real healthcare logistics problem through AI-enhanced decision-making tools. It’s designed to be scalable for both small clinics and large pharmacy chains, improving the availability of essential medicines where and when they’re needed most.
⚠️ This project currently runs with the Flask development server. For production deployment, consider using a WSGI server like Gunicorn or Waitress.












📦 How to Run the Project Locally
Clone the repository and navigate into it:
git clone <repo-url>
cd mediTrack_ai

Create a virtual environment:
python -m venv venv
Activate the virtual environment:

On Windows:
venv\Scripts\activate
On Mac/Linux:
source venv/bin/activate

Install the dependencies:
pip install -r requirements.txt

Run the application:
python app/app.py

Open your browser and go to:
http://127.0.0.1:5000

📄 Requirements
Your requirements.txt should include:














Flask
Flask-SQLAlchemy
Werkzeug
Jinja2
itsdangerous
MarkupSafe
