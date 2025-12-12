// ===================== Helper: Pick Random Questions =====================
function pickRandomQuestions(bank, count) {
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ===================== MAIN APP LOGIC =====================
document.addEventListener("DOMContentLoaded", () => {

  // ========================================================
  // 0. THEME TOGGLE (DARK / LIGHT MODE)
  // ========================================================
  const themeToggleBtn = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem("theme", theme);

    if (themeToggleBtn) {
      // Simple text toggle, you can add emojis if you want
      themeToggleBtn.textContent =
        theme === "light" ? "Dark mode" : "Light mode";
    }
  }

  // Initial theme from localStorage or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-mode");
      applyTheme(isLight ? "dark" : "light");
    });
  }

  // ========================================================
  // 1. 60-SECOND RISK CHECK (HOME PAGE)
  // ========================================================
  const riskForm = document.getElementById("riskForm");
  if (riskForm) {
    riskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(riskForm);
      const answers = [
        formData.get("q1"),
        formData.get("q2"),
        formData.get("q3")
      ];

      const score = answers.filter(a => a === "yes").length;
      const resultText =
        score === 0
          ? "Low Risk – You're practicing strong cyber hygiene."
          : score === 1
          ? "Medium Risk – Fix your weak spots to stay protected."
          : "High Risk – You’re vulnerable. Start with Module 1 & 2 immediately.";

      const modalResult = document.getElementById("riskOutput");
      const cardResult = document.getElementById("riskResult");

      if (modalResult) modalResult.textContent = resultText;
      if (cardResult) cardResult.textContent = resultText;
    });
  }

  // ========================================================
  // 2. PASSWORD MODULE
  // ========================================================
  const passwordInput = document.getElementById("passwordInput");
  if (passwordInput) {

    const strengthSpan = document.getElementById("passwordStrength");
    const tipsDiv = document.getElementById("passwordTips");

    // ---------- Password Strength Checker ----------
    passwordInput.addEventListener("input", () => {
      const pwd = passwordInput.value;
      let score = 0;
      let tips = [];

      if (pwd.length >= 12) score++;
      else tips.push("Use at least 12 characters.");

      if (/[A-Z]/.test(pwd)) score++;
      else tips.push("Add at least one uppercase letter.");

      if (/[a-z]/.test(pwd)) score++;
      else tips.push("Add at least one lowercase letter.");

      if (/[0-9]/.test(pwd)) score++;
      else tips.push("Add at least one number.");

      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      else tips.push("Add at least one symbol (e.g. !, @, ?)");

      const labels = ["Very weak", "Weak", "Okay", "Strong", "Very strong"];
      strengthSpan.textContent = pwd ? labels[Math.max(0, score - 1)] : "–";
      tipsDiv.innerHTML = tips.length
        ? "Suggestions:<br>" + tips.map(t => "- " + t).join("<br>")
        : "Nice. This is a strong structure.";
    });

    // ---------- PASSWORD QUIZ QUESTION BANK (10 QUESTIONS) ----------
    const passwordBank = [
      {
        question: "Which password is the safest?",
        options: ["Jeb123", "Password2024", "my-dog-runs-fast!2024", "12345678"],
        correctIndex: 2
      },
      {
        question: "What makes a strong password?",
        options: [
          "Short and complex",
          "Long and memorable passphrase",
          "Your name plus birthday",
          "Just add '123' at the end"
        ],
        correctIndex: 1
      },
      {
        question: "Best way to store many passwords?",
        options: ["Notes app", "Password manager", "Use the same password everywhere", "Email them to yourself"],
        correctIndex: 1
      },
      {
        question: "Which is a weak password?",
        options: ["Blue-turtle-dances!2025", "Qw!7pZ9@Lm", "ilovebinus", "MyCatRunsFast2024!"],
        correctIndex: 2
      },
      {
        question: "Why is reusing passwords risky?",
        options: [
          "Websites don't allow it",
          "If one site gets hacked, all your accounts are exposed",
          "It makes typing slower",
          "It lowers Wi-Fi speed"
        ],
        correctIndex: 1
      },
      {
        question: "Safest way to share a password?",
        options: [
          "Send via WhatsApp",
          "Say it loudly",
          "Use secure temporary sharing from a password manager",
          "Write it on paper"
        ],
        correctIndex: 2
      },
      {
        question: "What should you do after a breach?",
        options: ["Ignore it", "Change passwords + enable MFA", "Restart router", "Delete browser"],
        correctIndex: 1
      },
      {
        question: "What does MFA add?",
        options: [
          "A second verification factor",
          "Faster internet",
          "A new username",
          "Free VPN"
        ],
        correctIndex: 0
      },
      {
        question: "Which is a good passphrase?",
        options: [
          "12345678",
          "PasswordPassword",
          "blue-turtle-dances!2025",
          "JebJebJebJeb"
        ],
        correctIndex: 2
      },
      {
        question: "Where should you avoid typing passwords?",
        options: ["Own laptop", "Phone", "Public/shared computers", "Home WiFi"],
        correctIndex: 2
      }
    ];

    function loadPasswordQuiz() {
      const randomQuestions = pickRandomQuestions(passwordBank, 3);
      renderQuiz("passwordQuiz", randomQuestions);
    }

    loadPasswordQuiz();

    const reloadPasswordBtn = document.getElementById("reloadPasswordQuiz");
    if (reloadPasswordBtn) {
      reloadPasswordBtn.addEventListener("click", loadPasswordQuiz);
    }
  }

  // ========================================================
  // 3. PHISHING MODULE
  // ========================================================
  const inboxDiv = document.getElementById("inbox");
  if (inboxDiv) {

    // ---------- FAKE INBOX SIMULATION ----------
    const emails = [
      {
        subject: "Your account will be closed in 24 hours",
        sender: "support@paypaI.com",
        preview: "Click here to verify your account.",
        isPhish: true,
        reason: "Fake domain + urgent tone."
      },
      {
        subject: "Your timetable for next semester",
        sender: "admin@campus.ac.id",
        preview: "Log in to the official portal to view updates.",
        isPhish: false,
        reason: "Legit context and domain."
      },
      {
        subject: "You won a free iPhone!",
        sender: "promo@lucky-prize.win",
        preview: "Claim your gift now.",
        isPhish: true,
        reason: "Too good to be true + suspicious domain."
      }
    ];

    inboxDiv.innerHTML = emails
      .map(
        (email, index) => `
      <button class="list-group-item list-group-item-action"
              data-email-index="${index}">
        <div class="d-flex justify-content-between">
          <h5>${email.subject}</h5>
          <small>${email.sender}</small>
        </div>
        <p>${email.preview}</p>
      </button>
    `
      )
      .join("");

    const feedbackDiv = document.getElementById("phishingFeedback");

    inboxDiv.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-email-index]");
      if (!btn) return;

      const idx = parseInt(btn.getAttribute("data-email-index"), 10);
      const email = emails[idx];

      const choice = confirm("Is this phishing? OK = Yes, Cancel = No");
      const isCorrect = choice === email.isPhish;

      alert((isCorrect ? "Correct: " : "Incorrect: ") + email.reason);

      btn.classList.add("disabled");
      if (feedbackDiv && inboxDiv.querySelectorAll(".disabled").length === emails.length) {
        feedbackDiv.textContent = "All emails reviewed!";
      }
    });

    // ---------- PHISHING QUESTION BANK (10 QUESTIONS) ----------
    const phishingBank = [
      {
        question: "Which is a common sign of phishing?",
        options: ["Urgent tone", "Perfect grammar", "From your friend", "Long email"],
        correctIndex: 0
      },
      {
        question: "Safest action if you're unsure about an email?",
        options: ["Click link", "Reply", "Check official website instead", "Forward it"],
        correctIndex: 2
      },
      {
        question: "Why do scammers use fake login pages?",
        options: ["To steal credentials", "To improve your security", "To fix your device", "To update Chrome"],
        correctIndex: 0
      },
      {
        question: "Which link is most suspicious?",
        options: [
          "https://bank.com/login",
          "https://secure.bank.com",
          "https://bank-login-secure.xyz/verify",
          "https://app.bank.com"
        ],
        correctIndex: 2
      },
      {
        question: "What should you do after accidentally clicking a phishing link?",
        options: ["Ignore it", "Change password + enable MFA", "Restart phone", "Delete photos"],
        correctIndex: 1
      },
      {
        question: "Why is phishing so effective?",
        options: ["Users trust things too easily", "Emails never get filtered", "Phones break", "Internet slow"],
        correctIndex: 0
      },
      {
        question: "What data do phishing emails usually target?",
        options: ["Favorite color", "Credentials and card info", "Screen brightness", "Battery level"],
        correctIndex: 1
      },
      {
        question: "What should you check before clicking a link?",
        options: ["Font size", "URL domain", "Sender mood", "Email color theme"],
        correctIndex: 1
      },
      {
        question: "Is a message saying 'You won free money' suspicious?",
        options: ["No", "Maybe", "Yes", "Only at night"],
        correctIndex: 2
      },
      {
        question: "Best way to verify a suspicious message?",
        options: ["Check official website/app", "Click immediately", "Forward to group chat", "Screenshot it"],
        correctIndex: 0
      }
    ];

    function loadPhishingQuiz() {
      const randomQuestions = pickRandomQuestions(phishingBank, 3);
      renderQuiz("phishingQuiz", randomQuestions);
    }

    loadPhishingQuiz();

    const reloadPhishingBtn = document.getElementById("reloadPhishingQuiz");
    if (reloadPhishingBtn) {
      reloadPhishingBtn.addEventListener("click", loadPhishingQuiz);
    }
  }

  // ========================================================
  // 4. ETHICAL HACKING SCENARIOS
  // ========================================================
  const ethicalDiv = document.getElementById("ethicalScenarios");
  if (ethicalDiv) {
    const scenarios = [
      {
        text: "You test your own home Wi-Fi for weak passwords.",
        isEthical: true,
        explanation: "You own the network and have permission."
      },
      {
        text: "You scan your university network without permission.",
        isEthical: false,
        explanation: "No permission means unethical and illegal."
      },
      {
        text: "You find a bug and report it responsibly.",
        isEthical: true,
        explanation: "This is ethical responsible disclosure."
      },
      {
        text: "You try logging into accounts from leaked password databases.",
        isEthical: false,
        explanation: "Accessing accounts without consent is illegal."
      }
    ];

    ethicalDiv.innerHTML = scenarios
      .map(
        (s, i) => `
      <div class="card mb-3">
        <div class="card-body">
          <p>${s.text}</p>
          <button class="btn btn-success btn-sm me-2" data-index="${i}" data-answer="true">Ethical</button>
          <button class="btn btn-danger btn-sm" data-index="${i}" data-answer="false">Not Ethical</button>
        </div>
      </div>
    `
      )
      .join("");

    const ethicalResult = document.getElementById("ethicalResult");

    ethicalDiv.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-index]");
      if (!btn) return;

      const idx = parseInt(btn.getAttribute("data-index"), 10);
      const userAns = btn.getAttribute("data-answer") === "true";
      const scenario = scenarios[idx];

      ethicalResult.textContent =
        userAns === scenario.isEthical
          ? "Correct: " + scenario.explanation
          : "Incorrect: " + scenario.explanation;
    });
  }

    // ========================================================
  // 5. EMAIL SCAM CHECKER MODULE
  // ========================================================
  const analyzeBtn = document.getElementById("analyzeEmailBtn");
  if (analyzeBtn) {
    const senderInput = document.getElementById("emailSender");
    const subjectInput = document.getElementById("emailSubject");
    const bodyInput = document.getElementById("emailBody");
    const linkInput = document.getElementById("emailLink");

    const scoreSpan = document.getElementById("emailRiskScore");
    const bar = document.getElementById("emailRiskBar");
    const reasonsList = document.getElementById("emailRiskReasons");

    analyzeBtn.addEventListener("click", () => {
      const sender = (senderInput.value || "").toLowerCase();
      const subject = (subjectInput.value || "").toLowerCase();
      const body = (bodyInput.value || "").toLowerCase();
      const link = (linkInput.value || "").toLowerCase();

      let score = 0;
      const reasons = [];

      // --- Rule 1: suspicious domain in sender or link ---
      const suspiciousTlds = [".xyz", ".win", ".top", ".click", ".loan", ".vip"];
      const allText = sender + " " + link;
      if (suspiciousTlds.some(tld => allText.includes(tld))) {
        score += 20;
        reasons.push("Uses a suspicious or uncommon domain extension.");
      }

      // --- Rule 2: sender name vs known brands spelled weirdly ---
      if (sender.includes("paypai") || sender.includes("paypaI") || sender.includes("netfIix")) {
        score += 15;
        reasons.push("Sender looks like a spoof of a known brand (typo or replaced letters).");
      }

      // --- Rule 3: urgent language in subject/body ---
      const urgencyWords = ["24 hours", "immediately", "urgent", "suspend", "suspended", "last chance"];
      if (urgencyWords.some(w => subject.includes(w) || body.includes(w))) {
        score += 15;
        reasons.push("Uses urgent language to pressure you into acting quickly.");
      }

      // --- Rule 4: prize / too good to be true ---
      const prizeWords = ["you won", "winner", "free iphone", "gift card", "lottery"];
      if (prizeWords.some(w => subject.includes(w) || body.includes(w))) {
        score += 20;
        reasons.push("Promises unrealistic rewards or prizes.");
      }

      // --- Rule 5: asks for credentials or payment info ---
      const credentialWords = ["password", "login", "otp", "one-time code", "credit card", "bank account"];
      if (credentialWords.some(w => body.includes(w))) {
        score += 20;
        reasons.push("Asks for passwords, OTPs, or sensitive financial details.");
      }

      // --- Rule 6: link mismatch style pattern ---
      if (link && link.includes("http") && (link.includes("@") || link.split(".").length > 5)) {
        score += 10;
        reasons.push("Link structure looks unusual (multiple dots, @ symbol, or long subdomain).");
      }

      // Clamp score 0–100
      if (score > 100) score = 100;

      let label = "";
      if (score < 30) label = "Low risk – likely safe, but stay alert.";
      else if (score < 60) label = "Medium risk – be cautious and verify via official channels.";
      else label = "High risk – strong signs of a scam. Do not click links or share data.";

      // Update UI
      if (scoreSpan) scoreSpan.textContent = `${score}% (${label})`;
      if (bar) {
        bar.style.width = `${score}%`;
        bar.textContent = `${score}%`;
        bar.classList.remove("bg-success", "bg-warning", "bg-danger");
        if (score < 30) bar.classList.add("bg-success");
        else if (score < 60) bar.classList.add("bg-warning");
        else bar.classList.add("bg-danger");
      }

      if (reasonsList) {
        reasonsList.innerHTML = "";
        if (reasons.length === 0) {
          const li = document.createElement("li");
          li.textContent = "No obvious red flags detected, but always double-check suspicious messages.";
          reasonsList.appendChild(li);
        } else {
          reasons.forEach(r => {
            const li = document.createElement("li");
            li.textContent = r;
            reasonsList.appendChild(li);
          });
        }
      }
    });
  }

  // ========================================================
  // 5. MODULE COMPLETION TRACKING
  // ========================================================
  const completeBtn = document.getElementById("completeModule");
  if (completeBtn) {
    const moduleKey = completeBtn.getAttribute("data-module");
    const storedProgress = JSON.parse(localStorage.getItem("progress") || "{}");

    if (storedProgress[moduleKey]) {
      completeBtn.textContent = "Module completed";
      completeBtn.disabled = true;
    }

    completeBtn.addEventListener("click", () => {
      const progress = JSON.parse(localStorage.getItem("progress") || "{}");
      progress[moduleKey] = true;
      localStorage.setItem("progress", JSON.stringify(progress));

      completeBtn.textContent = "Module completed";
      completeBtn.disabled = true;
      alert("Module marked as completed!");
    });
  }
});
