console.log("JS Loaded");

// Load stock data table
function loadStockData() {
  fetch('/api/stock-data')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('stockTableBody');
      tableBody.innerHTML = '';

      data.forEach(item => {
        let statusBadge = '';
        let statusClass = '';

        if (item.Current_Stock >= 100) {
          statusBadge = '🟢 Sufficient';
          statusClass = 'bg-success';
        } else if (item.Current_Stock >= 50) {
          statusBadge = '🟡 Moderate';
          statusClass = 'bg-warning';
        } else {
          statusBadge = '🔴 Low';
          statusClass = 'bg-danger';
        }

        const row = `
          <tr>
            <td>${item.Medicine_Name}</td>
            <td>
              <div class="progress">
                <div class="progress-bar ${statusClass}" role="progressbar"
                  style="width: ${item.Current_Stock > 200 ? 200 : item.Current_Stock}%"
                  aria-valuenow="${item.Current_Stock}" aria-valuemin="0" aria-valuemax="200">
                  ${item.Current_Stock}
                </div>
              </div>
            </td>
            <td>${item.Predicted_Demand}</td>
            <td><span class="badge ${statusClass}">${statusBadge}</span></td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => console.error('Error fetching stock data:', error));
} 

function loadStockLevels() {
  fetch('/api/stock-data')
    .then(response => response.json())
    .then(data => {
      let tbody = document.getElementById("stockTableBody");
      tbody.innerHTML = "";

      data.forEach(item => {
        let row = `<tr>
          <td>${item.Medicine_Name}</td>
          <td>${item.Current_Stock}</td>
          <td>${Math.floor(Math.random() * 50) + 30}</td>
          <td>${item.Current_Stock < 50 ? "⚠️ Low" : "✅ OK"}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteMedicine('${item.Medicine_Name}')">Delete</button>
            <button class="btn btn-sm btn-primary ms-2" onclick="reorderMedicine('${item.Medicine_Name}')">Reorder</button>
          </td>
        </tr>`;
        tbody.innerHTML += row;
      });
    });
}


// Load stock distribution bar chart
function loadStockChart() {
  fetch('/api/stock-data')
    .then(response => response.json())
    .then(data => {
      const medicineNames = data.map(item => item.Medicine_Name);
      const stockValues = data.map(item => item.Current_Stock);

      const ctx = document.getElementById('stockChart').getContext('2d');

      if (window.stockChartInstance) {
        window.stockChartInstance.destroy();
      }

      window.stockChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: medicineNames,
          datasets: [{
            label: 'Current Stock',
            data: stockValues,
            backgroundColor: '#4caf50'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    })
    .catch(error => console.error('Error loading stock chart:', error));
}

// Low stock alerts and reorder suggestions
function loadLowStockAlerts() {
  fetch('/api/low-stock-alerts')
    .then(response => response.json())
    .then(alerts => {
      // Toast notification
      if (alerts.length > 0) {
        document.getElementById('toastBody').innerText =
          `Low stock for: ${alerts.join(', ')}`;
        const toast = new bootstrap.Toast(document.getElementById('liveToast'));
        toast.show();
      }

      // Low stock alerts section
      const alertSection = document.getElementById('lowStockAlerts');
      alertSection.innerHTML = '';

      alerts.forEach(med => {
        alertSection.innerHTML += `
          <div class="alert alert-danger d-flex justify-content-between align-items-center">
            <span>⚠️ ${med} is running low!</span>
            <button class="btn btn-sm btn-light" onclick="alert('Order placed for ${med}')">Reorder</button>
          </div>
        `;
      });

      // Reorder suggestions
      const reorderSection = document.getElementById('reorderSuggestions');
      reorderSection.innerHTML = '';

      if (alerts.length > 0) {
        alerts.forEach(med => {
          reorderSection.innerHTML += `
            <p>📦 Suggestion: Order +100 units of <strong>${med}</strong></p>
          `;
        });
      } else {
        reorderSection.innerHTML = '<p>✅ All stock levels are sufficient.</p>';
      }
    })
    .catch(error => console.error('Error fetching low stock alerts:', error));
}

// Update low stock threshold
function updateThreshold() {
  const newThreshold = document.getElementById("thresholdInput").value;
  fetch('/api/update-threshold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threshold: newThreshold })
  })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error updating threshold:', error));
}

// Add new medicine
function addMedicine() {
  const name = document.getElementById("newMedicineName").value;
  const stock = document.getElementById("newMedicineStock").value;

  if (!name || stock === '') {
    alert("Please enter both medicine name and stock value.");
    return;
  }

  fetch('/api/add-medicine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, stock: stock })
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      loadStockData();
      loadStockChart();
      loadLowStockAlerts();
    })
    .catch(error => console.error('Error adding medicine:', error));
}

// Change user password
function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  if (!oldPassword || !newPassword) {
    alert("Please enter both current and new passwords.");
    return;
  }

  fetch('/api/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
  })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error changing password:', error));
}

// Load everything when page is ready
document.addEventListener("DOMContentLoaded", () => {
  loadStockData();
  loadStockChart();
  loadLowStockAlerts();
});

function promptReorder(medName) {
  const quantity = prompt(`Enter reorder quantity for ${medName}:`);
  if (quantity && !isNaN(quantity)) {
    fetch('/api/reorder-medicine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: medName, amount: parseInt(quantity) })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(err => console.error(err));
  }
}

function deleteMedicine(name) {
  if (confirm(`Are you sure you want to delete ${name}?`)) {
    fetch('/api/delete-medicine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      loadStockTable(); // refresh table
    });
  }
}

function reorderMedicine(name) {
  const quantity = prompt(`Enter quantity to reorder for ${name}:`);
  if (quantity && !isNaN(quantity)) {
    fetch('/api/reorder-medicine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, quantity: parseInt(quantity) })
    })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      loadStockTable(); // refresh table
    });
  }
}


function loadStockTable() {
  fetch('/api/stock-data')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('stockTableBody');
      tableBody.innerHTML = ''; // Clear previous

      data.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${item.Medicine_Name}</td>
          <td>
            <div class="progress">
              <div class="progress-bar ${getStockClass(item.Current_Stock)}" role="progressbar"
                   style="width: ${item.Current_Stock > 500 ? 100 : item.Current_Stock / 5}%;"
                   aria-valuenow="${item.Current_Stock}" aria-valuemin="0" aria-valuemax="500">
                ${item.Current_Stock}
              </div>
            </div>
          </td>
          <td>undefined</td>
          <td><span class="badge ${getStockBadge(item.Current_Stock)}">${getStockStatus(item.Current_Stock)}</span></td>
          <td>
            <button class="btn btn-sm btn-warning me-1" onclick="reorderMedicine('${item.Medicine_Name}')">Reorder</button>
            <button class="btn btn-sm btn-danger" onclick="deleteMedicine('${item.Medicine_Name}')">Delete</button>
          </td>
        `;

        tableBody.appendChild(row);
      });
    });
}

// Helper functions for stock status visuals
function getStockClass(stock) {
  if (stock < 50) return 'bg-danger';
  if (stock < 100) return 'bg-warning';
  return 'bg-success';
}

function getStockBadge(stock) {
  if (stock < 50) return 'bg-danger';
  if (stock < 100) return 'bg-warning';
  return 'bg-success';
}

function getStockStatus(stock) {
  if (stock < 50) return 'Low';
  if (stock < 100) return 'Moderate';
  return 'Sufficient';
}

document.addEventListener('DOMContentLoaded', loadStockTable);

