// assets/quiz.js

function renderQuiz(containerId, questions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = "";
  questions.forEach((q, index) => {
    html += `
      <div class="mb-3">
        <p><strong>Q${index + 1}.</strong> ${q.question}</p>
        ${q.options.map((opt, i) => `
          <div class="form-check">
            <input class="form-check-input" type="radio"
                   name="q${index}" value="${i}">
            <label class="form-check-label">${opt}</label>
          </div>
        `).join("")}
      </div>
    `;
  });

  html += `<button class="btn btn-success" id="submitQuiz">Submit Quiz</button>
           <div class="mt-3 fw-bold" id="quizResult"></div>`;

  container.innerHTML = html;

  document.getElementById('submitQuiz').addEventListener('click', () => {
    let score = 0;
    questions.forEach((q, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected && parseInt(selected.value, 10) === q.correctIndex) {
        score++;
      }
    });
    const resultDiv = document.getElementById('quizResult');
    resultDiv.textContent = `You scored ${score} / ${questions.length}.`;
  });
}
