// --- Toukoum.fr-style Gooey Blobs Background Animation ---

// Get SVG blobs
// --- Gooey Blobs Background Animation (Toukoum.fr Style) ---
// Ensure your HTML contains the SVG blob markup as described
// Place this code at the top of your script.js

// --- Gooey Liquid Blob Background (Toukoum.fr Style + Spreading/Splashing Effect) ---

// Get SVG blobs (should be <ellipse> for true liquid stretching)
const blobs = [
    document.getElementById("blob1"),
    document.getElementById("blob2"),
    document.getElementById("blob3"),
    document.getElementById("blob4"),
  ];
  
  // Color palettes for cycling
  const colors = [
    ["#6a6aff", "#b16cff", "#ffd36e", "#ff6a6a"],
    ["#ffb6b9", "#6a6aff", "#fff35c", "#4caf50"],
    ["#00e1ff", "#ff00bd", "#ff9800", "#b16cff"],
  ];
  
  // Initial base positions (normalized: as a percentage of window width/height)
  let basePositions = [
    { x: 0.50, y: 0.50, r: 140 },
    { x: 0.55, y: 0.54, r: 120 },
    { x: 0.48, y: 0.53, r: 90 },
    { x: 0.53, y: 0.57, r: 70 },
  ];
  
  // Mouse and trailing positions
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let trailing = [
    { x: mouse.x, y: mouse.y },
    { x: mouse.x, y: mouse.y },
    { x: mouse.x, y: mouse.y },
    { x: mouse.x, y: mouse.y },
  ];
  
  // For liquid spreading: track mouse velocity
  let lastMouse = { x: mouse.x, y: mouse.y };
  let velocity = 0;
  
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Calculate velocity for spreading effect
    const dx = mouse.x - lastMouse.x;
    const dy = mouse.y - lastMouse.y;
    velocity = Math.min(Math.sqrt(dx * dx + dy * dy) / 12, 2.5); // Clamp velocity
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
  });
  
  window.addEventListener("resize", () => {
    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2;
  });
  
  let colorIndex = 0;
  let lastColorChange = 0;
  
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  
  function animateBlobs(ts = 0) {
    // Color cycling every 4 seconds
    if (ts - lastColorChange > 4000) {
      colorIndex = (colorIndex + 1) % colors.length;
      blobs.forEach((b, i) => b.setAttribute("fill", colors[colorIndex][i]));
      lastColorChange = ts;
    }
    // Animate trailing positions for blobs
    trailing[0].x = lerp(trailing[0].x, mouse.x, 0.13);
    trailing[0].y = lerp(trailing[0].y, mouse.y, 0.13);
    for (let i = 1; i < blobs.length; i++) {
      trailing[i].x = lerp(
        trailing[i].x,
        trailing[i - 1].x + (basePositions[i].x - 0.5) * window.innerWidth,
        0.12 + i * 0.03
      );
      trailing[i].y = lerp(
        trailing[i].y,
        trailing[i - 1].y + (basePositions[i].y - 0.5) * window.innerHeight,
        0.12 + i * 0.03
      );
    }
    // Animate blob morphing, stretching, and position
    blobs.forEach((blob, i) => {
      // Blob base radius pulses over time
      let rBase = basePositions[i].r * (1 + 0.16 * Math.sin(ts / (410 + i * 120)));
      // Stretch/splash horizontally according to velocity (liquid effect)
      let rX = rBase * (1 + velocity * (0.23 + 0.09 * i));
      let rY = rBase * (1 - velocity * 0.15);
      blob.setAttribute("cx", trailing[i].x);
      blob.setAttribute("cy", trailing[i].y);
      if (blob.tagName === "ellipse") {
        blob.setAttribute("rx", rX);
        blob.setAttribute("ry", rY);
      } else {
        // If using <circle>, fallback to circular radius (less liquid)
        blob.setAttribute("r", rX);
      }
    });
    requestAnimationFrame(animateBlobs);
  }
  animateBlobs();
  
  
  // --- Your other script.js code below (e.g., password generator, UI handlers, etc.) ---
  
  // --- Password Generator JS ---
  
  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };
  
  const passwordDisplay = document.getElementById('passwordDisplay');
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthValue = document.getElementById('lengthValue');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const strengthBar = document.getElementById('strengthBar');
  const strengthLabel = document.getElementById('strengthLabel');
  
  // Default settings
  let passwordLength = 16;
  
  function validateOptions() {
    return [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].some(cb => cb.checked);
  }
  
  function getSelectedSets() {
    return {
      uppercase: uppercaseCheckbox.checked,
      lowercase: lowercaseCheckbox.checked,
      numbers: numbersCheckbox.checked,
      symbols: symbolsCheckbox.checked
    };
  }
  
  function generatePassword() {
    if (!validateOptions()) {
      animatePassword('');
      updateStrengthBar('none');
      strengthLabel.textContent = 'Strength: Select Options!';
      return;
    }
    const sets = getSelectedSets();
    let charPool = '';
    Object.keys(sets).forEach(type => {
      if (sets[type]) charPool += characterSets[type];
    });
  
    // Ensure at least one char from each selected set
    let passwordArr = [];
    Object.keys(sets).forEach(type => {
      if (sets[type]) {
        passwordArr.push(
          characterSets[type][
            Math.floor(Math.random() * characterSets[type].length)
          ]
        );
      }
    });
  
    for (let i = passwordArr.length; i < passwordLength; i++) {
      passwordArr.push(charPool[Math.floor(Math.random() * charPool.length)]);
    }
  
    // Shuffle passwordArr
    for (let i = passwordArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
    }
  
    const password = passwordArr.join('');
    animatePassword(password);
    updateStrengthBar(calculateStrength(password, sets));
  }
  
  function calculateStrength(password, sets) {
    const length = password.length;
    const count = Object.values(sets).filter(Boolean).length;
    let strength = '';
    if (length < 8 || count <= 1) {
      strength = 'weak';
    } else if ((length >= 8 && length <= 12 && count >= 2) || (length >= 13 && count < 4)) {
      strength = 'medium';
    } else if (length >= 13 && count === 4) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
    return strength;
  }
  
  function updateStrengthBar(strength) {
    let width = 0, bg = '', label = '';
    switch(strength) {
      case 'none':
        width = 0;
        bg = 'transparent';
        label = 'Strength: Select Options!';
        break;
      case 'weak':
        width = '33%';
        bg = 'linear-gradient(90deg, var(--danger), #fffbe7 60%)';
        label = 'Strength: Weak';
        break;
      case 'medium':
        width = '67%';
        bg = 'linear-gradient(90deg, var(--warning), #fffbe7 60%)';
        label = 'Strength: Medium';
        break;
      case 'strong':
        width = '100%';
        bg = 'linear-gradient(90deg, var(--success), #e6ffee 60%)';
        label = 'Strength: Strong';
        break;
      default:
        width = 0;
        bg = 'transparent';
        label = 'Strength:';
    }
    strengthBar.style.width = width;
    strengthBar.style.background = bg;
    strengthLabel.textContent = label;
  }
  
  function updateLength() {
    passwordLength = parseInt(lengthSlider.value, 10);
    lengthValue.textContent = passwordLength;
  }
  
  function copyToClipboard() {
    if (!passwordDisplay.value) return;
    navigator.clipboard.writeText(passwordDisplay.value)
      .then(() => {
        showCopyFeedback('Copied!');
      })
      .catch(() => {
        showCopyFeedback('Copy failed!', true);
      });
  }
  
  function showCopyFeedback(msg, error = false) {
    copyFeedback.textContent = msg;
    copyFeedback.classList.add('active');
    copyFeedback.style.color = error ? 'var(--danger)' : 'var(--success)';
    setTimeout(() => {
      copyFeedback.classList.remove('active');
    }, 1700);
  }
  
  // Animated password reveal for "playful" effect
  function animatePassword(text) {
    passwordDisplay.value = '';
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      passwordDisplay.value = text.slice(0, i + 1);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 13);
  }
  
  // Event Listeners
  lengthSlider.addEventListener('input', () => {
    updateLength();
    generatePassword();
  });
  
  [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(cb => {
    cb.addEventListener('change', () => {
      generatePassword();
    });
  });
  
  generateBtn.addEventListener('click', generatePassword);
  
  copyBtn.addEventListener('click', copyToClipboard);
  
  // Auto-generate on page load
  window.addEventListener('DOMContentLoaded', () => {
    updateLength();
    generatePassword();
  });