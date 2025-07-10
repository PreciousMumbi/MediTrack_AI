import pandas as pd
from prophet import Prophet
import os

# Set absolute path to data directory
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(base_dir, 'data', 'pharmacy_stock.csv')

# Load your pharmacy stock data
df = pd.read_csv(data_path)

# Filter for Paracetamol
paracetamol_df = df[df['Medicine_Name'] == 'Paracetamol']

# Group by date and sum the quantity dispensed
daily_demand = paracetamol_df.groupby('Date')['Quantity_Dispensed'].sum().reset_index()

# Rename columns for Prophet
daily_demand.columns = ['ds', 'y']

# Initialize Prophet model
model = Prophet(daily_seasonality=True)
model.fit(daily_demand)

# Create future dates dataframe
future = model.make_future_dataframe(periods=30)

# Predict future demand
forecast = model.predict(future)

# Extract relevant columns
output = forecast[['ds', 'yhat']].tail(30)
output.columns = ['Date', 'Paracetamol']

# Save forecast output CSV
output_path = os.path.join(base_dir, 'data', 'forecast_output.csv')
output.to_csv(output_path, index=False)

print("Forecast complete. CSV saved at", output_path)
