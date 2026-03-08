let questions;
async function getQuestions() {
  const res = await fetch("../questions.json");
  questions = await res.json();
}
const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
const questionElem = document.querySelector(".question");
const choicesListElem = document.querySelector(".answers ul");
function displayQuestion(index) {
  const questionObj = questions[index];
  questionElem.textContent = `${currentIndex + 1}: ${questionObj.question}`;
  choicesListElem.innerHTML = "";

  questionObj.answers.forEach((answer) => {
    const answersListElem = document.createElement("li");
    answersListElem.textContent = answer.text;
    const savedSelection = userAnswers.find((a) => {
      return a.question == questionObj.question;
    });
    if (savedSelection && savedSelection.selected == answer.text)
      answersListElem.classList.add("selected");

    answersListElem.addEventListener("click", (e) => {
      document
        .querySelectorAll(".answers li")
        .forEach((il) => il.classList.remove("selected"));
      answersListElem.classList.add("selected");
      const changeAnswer = userAnswers.find(
        (q) => q.question == questionObj.question,
      );
      if (changeAnswer) {
        changeAnswer.selected = answer.text;
        changeAnswer.isCorrect = answer.isCorrect;
      } else {
        userAnswers.push({
          question: questionObj.question,
          selected: answer.text,
          isCorrect: answer.isCorrect,
        });
      }
      localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    });
    choicesListElem.appendChild(answersListElem);
  });
  displayFlagIcon();
}
let currentIndex = Number(localStorage.getItem("currentIndex")) || 0;
const flaggedQuestions =
  JSON.parse(localStorage.getItem("flaggedQuestions")) || [];
const flagListElem = document.querySelector(".marked-question ul");
function displayFlagList() {
  flagListElem.innerHTML = "";
  flaggedQuestions.forEach((index) => {
    const li = document.createElement("li");
    li.textContent = `Q: ${index + 1}`;
    li.addEventListener("click", () => {
      currentIndex = index;
      localStorage.setItem("currentIndex", currentIndex);
      displayQuestion(currentIndex);

      displayButtons();
      // displayFlagIcon()
    });
    flagListElem.appendChild(li);
  });
}

const flagIcon = document.querySelector(".flag-btn i");
function displayFlagIcon() {
  if (flaggedQuestions.includes(currentIndex)) {
    flagIcon.classList.add("flagged", "fa-solid");
    flagIcon.classList.remove("fa-regular");
  } else {
    flagIcon.classList.remove("flagged", "fa-solid");
    flagIcon.classList.add("fa-regular");
  }
}
const flagBtn = document.querySelector(".flag-btn");
flagBtn.addEventListener("click", () => {
  const flagIndex = flaggedQuestions.indexOf(currentIndex);
  if (flagIndex == -1) {
    flaggedQuestions.push(currentIndex);
  } else {
    flaggedQuestions.splice(flagIndex, 1);
  }
  localStorage.setItem("flaggedQuestions", JSON.stringify(flaggedQuestions));
  displayFlagList();
  displayFlagIcon();
});

let timerInterval;
function setTimer() {
  const timerElem = document.querySelector("#timer");
  let totalTime = Number(localStorage.getItem("remainingTime")) || 15 * 60;
  displayTimer();
  timerInterval = setInterval(() => {
    displayTimer();
    if (totalTime <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
  function displayTimer() {
    let minutes = Math.floor(totalTime / 60);
    let sec = totalTime % 60;
    timerElem.textContent = `${minutes}: ${sec < 10 ? "0" + sec : sec}`;
    totalTime--;
    localStorage.setItem("remainingTime", totalTime);
  }
}

function timeUp() {
  var theRightAnswer = userAnswers.filter((a) => a.isCorrect).length;
  localStorage.setItem("quizScore", theRightAnswer);
  localStorage.setItem("totalQuestions", questions.length);

  localStorage.removeItem("currentIndex");
  localStorage.removeItem("remainingTime");
  localStorage.removeItem("flaggedQustions");
  localStorage.removeItem("userAnswers");

  window.location.href = "../result page/result.html";
}

const nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", function () {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    localStorage.setItem("currentIndex", currentIndex);
    if (currentIndex > 0) prevBtn.style.display = "block";
    if (currentIndex == questions.length - 1) nextBtn.style.display = "none";
    displayQuestion(currentIndex);
  }

  if (currentIndex === questions.length - 1) {
    document.getElementById("submitBtn").style.display = "block";
  }
});

const prevBtn = document.getElementById("prevBtn");
prevBtn.addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
    localStorage.setItem("currentIndex", currentIndex);
    if (currentIndex < questions.length - 1) nextBtn.style.display = "block";
    if (currentIndex == 0) prevBtn.style.display = "none";
    displayQuestion(currentIndex);
  }

  if (currentIndex < questions.length - 1) {
    document.getElementById("submitBtn").style.display = "none";
  }
});

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", function () {
  clearInterval(timerInterval);
  var theRightAnswer = userAnswers.filter((a) => a.isCorrect).length;
  localStorage.removeItem("currentIndex");
  localStorage.removeItem("remainingTime");
  localStorage.removeItem("flaggedQuestions");
  localStorage.removeItem("userAnswers");

  localStorage.setItem("quizScore", theRightAnswer);
  localStorage.setItem("totalQuestions", questions.length);
  localStorage.setItem("timeUp", "no");
  window.location.href = "../result page/result.html";
});
function displayButtons() {
  if (currentIndex == questions.length - 1) nextBtn.style.display = "none";
  if (currentIndex == questions.length - 1) submitBtn.style.display = "block";
  if (currentIndex == 0) prevBtn.style.display = "none";
}
async function main() {
  await getQuestions();
  displayButtons();
  setTimer();
  displayFlagList();
  displayQuestion(currentIndex);
}

main();
