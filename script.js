const resultEl = document.getElementById("result");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const lengthEl = document.getElementById("length");
const upperCaseEl = document.getElementById("upperCase");
const lowerCaseEl = document.getElementById("lowerCase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const noSimilarEl = document.getElementById("noSimilar");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const toggleModeBtn = document.getElementById("toggleMode");

const clickSound = new Audio("click.mp3");
const typeSound = new Audio("typewriter.mp3");
typeSound.volume = 0.3;

const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*(){}[]=<>/,.";
const similarChars = "O0Il1";

function generatePassword() {
  let chars = "";
  if (upperCaseEl.checked) chars += upper;
  if (lowerCaseEl.checked) chars += lower;
  if (numbersEl.checked) chars += numbers;
  if (symbolsEl.checked) chars += symbols;

  if (noSimilarEl.checked) {
    chars = chars.split("").filter(ch => !similarChars.includes(ch)).join("");
  }

  if (!chars) return "Select options!";

  let pass = "";
  for (let i = 0; i < lengthEl.value; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }

  saveToHistory(pass);
  checkStrength(pass);
  return pass;
}

function saveToHistory(pass) {
  let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];
  history.unshift({ password: pass, date: new Date().toLocaleString(), fav: false });
  if (history.length > 50) history.pop();
  localStorage.setItem("passwordHistory", JSON.stringify(history));
}

function checkStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let width = (score / 5) * 100;
  strengthBar.style.width = width + "%";
  strengthBar.style.background = score <= 2 ? "red" : score === 3 ? "orange" : "green";
  strengthText.textContent = score <= 2 ? "Weak" : score === 3 ? "Medium" : "Strong";
}

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

function typeWriterEffect(text, element) {
  element.textContent = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      typeSound.currentTime = 0;
      typeSound.play();
      setTimeout(typing, 40);
    }
  }
  typing();
}

generateBtn.addEventListener("click", () => {
  clickSound.play();
  const password = generatePassword();
  resultEl.classList.add("spark");
  typeWriterEffect(password, resultEl);
  setTimeout(() => resultEl.classList.remove("spark"), 800);
});

copyBtn.addEventListener("click", () => {
  if (resultEl.textContent) {
    navigator.clipboard.writeText(resultEl.textContent);
    clickSound.play();
    showToast("Password copied!");
  }
});

toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// auto regenerate on option change
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("change", () => {
    if (resultEl.textContent) {
      const password = generatePassword();
      resultEl.classList.add("spark");
      resultEl.textContent = password;
      setTimeout(() => resultEl.classList.remove("spark"), 800);
    }
  });
});
