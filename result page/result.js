const user = JSON.parse(localStorage.getItem("currentUser"));
const username = `${user.firstName} ${user.lastName}`;

const examtitle = document.getElementById("examTitle");
examtitle.textContent = `welcome, ${username}`;

const total = Number(localStorage.getItem("totalQuestions"));
const score = Number(localStorage.getItem("quizScore"));

const wronganswers = total - score;
const percentage = Math.round((score / total) * 100);

document.getElementById("correctVal").textContent = score;
document.getElementById("incorrectVal").textContent = wronganswers;

const scoreelement = document.getElementById("scoreText");

if (score === total) {
  scoreelement.textContent = `perfect! you scored ${score}/${total}`;
} else if (score >= total / 2) {
  scoreelement.textContent = `good! you scored ${score}/${total}`;
} else {
  scoreelement.textContent = `you failed! you scored ${score}/${total}`;
}

const circle = document.getElementById("percentCircle");

circle.style.setProperty("--p", percentage);

circle.innerHTML = `
  <span style="position: relative; z-index: 2;">
    ${percentage}%
  </span>
`;
