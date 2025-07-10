function toggleDarkMode() {
  document.body.classList.toggle('bg-dark');
  document.body.classList.toggle('text-white');
  localStorage.setItem('darkMode', document.body.classList.contains('bg-dark'));
}

window.onload = function() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('bg-dark', 'text-white');
  }
}

function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  fetch('/api/change-password', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({old_password: oldPassword, new_password: newPassword})
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error(err));
}

function deleteMedicine() {
  const name = document.getElementById("deleteMedicineName").value;
  fetch('/api/delete-medicine', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: name})
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error(err));
}

// Theme Selector
const themeOptions = document.querySelectorAll('.theme-option');
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const selectedTheme = option.getAttribute('data-theme');
        document.body.setAttribute('data-theme', selectedTheme);

        // Save theme preference to localStorage
        localStorage.setItem('theme', selectedTheme);
    });
});

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        document.querySelector(`.theme-option[data-theme="${savedTheme}"]`)?.classList.add('active');
    }
});

// Password Update Button
function updatePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    // Simulated password update logic
    alert("Password updated successfully!");
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Expose to global scope
window.updatePassword = updatePassword;
