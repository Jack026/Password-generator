// Light/Dark Theme Toggle Logic
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
      body.classList.add('night-mode');
      toggle.checked = true;
    } else {
      body.classList.add('day-mode');
      toggle.checked = false;
    }
    toggle.addEventListener('change', function() {
      if (toggle.checked) {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
        localStorage.setItem('theme', 'night');
      } else {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
        localStorage.setItem('theme', 'day');
      }
    });
  });