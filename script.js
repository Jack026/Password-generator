// --- Toukoum.fr-style Gooey Blobs Background Animation ---

// Get SVG blobs
// --- Gooey Blobs Background Animation (Toukoum.fr Style) ---
// Ensure your HTML contains the SVG blob markup as described
// Place this code at the top of your script.js

// --- Gooey Liquid Blob Background (Toukoum.fr Style + Spreading/Splashing Effect) ---

// Get SVG blobs (should be <ellipse> for true liquid stretching)
// --- Super Blob Morphing + Particle Animations ---

const blobPath = document.getElementById('blobShape');
const superBlob = document.getElementById('superBlob');
const blobParticles = document.getElementById('blobParticles');

// Blob morph points
function getBlobPath(t, hover) {
  // Morphs between two shapes depending on hover
  const r1 = hover ? 150 : 130;
  const r2 = hover ? 100 : 120;
  const r3 = hover ? 128 : 110;
  return `
    M170,${170 - r1}
    C${170 + r2},${170 - r2} ${170 + r3},${170 + r2} ${170},${170 + r1}
    C${170 - r2},${170 + r2} ${170 - r3},${170 - r2} ${170},${170 - r1}
    Z
  `;
}

let blobHover = false;
let tStart = performance.now();

superBlob.addEventListener('mouseenter', () => { blobHover = true; });
superBlob.addEventListener('mouseleave', () => { blobHover = false; });

function animateSuperBlob(ts) {
  const t = (ts - tStart) / 1000;
  // Slight morphing animation
  const morph = Math.sin(t * 2.8) * (blobHover ? 16 : 8);

  // Morphing path
  const path = `
    M170,${170-130-morph}
    C${170+120+morph},${170-120-morph} ${170+110-morph},${170+120+morph} ${170},${170+130+morph}
    C${170-120-morph},${170+120+morph} ${170-110+morph},${170-120-morph} ${170},${170-130-morph}
    Z
  `;
  blobPath.setAttribute('d', path);

  requestAnimationFrame(animateSuperBlob);
}
animateSuperBlob();

// --- Floating Particles/Bubbles ---
function createParticle() {
  const p = document.createElement('div');
  const size = 8 + Math.random() * 20;
  p.style.position = 'absolute';
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.borderRadius = '50%';
  const colrs = ['#fffbe7', '#b16cff', '#6a6aff', '#ec38bc', '#fff35c'];
  p.style.background = colrs[Math.floor(Math.random() * colrs.length)];
  p.style.opacity = 0.09 + Math.random() * 0.27;
  p.style.left = `${120 + Math.random() * 95}px`;
  p.style.top = `${120 + Math.random() * 95}px`;
  p.style.pointerEvents = 'none';
  p.style.filter = 'blur(2.5px)';
  blobParticles.appendChild(p);

  // Animate up & fade out
  let y = parseFloat(p.style.top);
  let fade = 1;
  function float() {
    y -= 0.13 + Math.random() * 0.15;
    fade -= 0.005 + Math.random() * 0.004;
    p.style.top = `${y}px`;
    p.style.opacity = fade;
    if (fade > 0) requestAnimationFrame(float);
    else p.remove();
  }
  float();
}

// Auto-spawn particles
setInterval(() => {
  if (document.body.contains(blobParticles)) createParticle();
}, 200);

// Optionally: Make blob follow mouse for extra interactivity
document.addEventListener('mousemove', (e) => {
  superBlob.style.transform =
    `translate(${(e.clientX - window.innerWidth/2) * 0.08}px, ${(e.clientY - window.innerHeight/2) * 0.08}px)`;
});
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