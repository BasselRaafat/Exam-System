function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  sessionStorage.setItem("shuffled", true);
  return array;
}
let questions;
async function getQuestions() {
  let isShuffled =
    Boolean(sessionStorage.getItem("shuffled")) || false;
  if (isShuffled) {
    questions = JSON.parse(sessionStorage.getItem("questions"));
    return;
  }
  const res = await fetch("../questions.json");
  questions = await res.json();
  questions = shuffle(questions);
  sessionStorage.setItem("questions", JSON.stringify(questions));
}
const userAnswers = JSON.parse(sessionStorage.getItem("userAnswers")) || [];
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
      sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    });
    choicesListElem.appendChild(answersListElem);
  });
  displayFlagIcon();
}
let currentIndex = Number(sessionStorage.getItem("currentIndex")) || 0;
const flaggedQuestions =
  JSON.parse(sessionStorage.getItem("flaggedQuestions")) || [];
const flagListElem = document.querySelector(".marked-question ul");
function displayFlagList() {
  flagListElem.innerHTML = "";
  flaggedQuestions.forEach((index) => {
    const li = document.createElement("li");
    li.textContent = `Q: ${index + 1}`;
    li.addEventListener("click", () => {
      currentIndex = index;
      sessionStorage.setItem("currentIndex", currentIndex);
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
  sessionStorage.setItem("flaggedQuestions", JSON.stringify(flaggedQuestions));
  displayFlagList();
  displayFlagIcon();
});

let timerInterval;
function setTimer() {
  const timerElem = document.querySelector("#timer");
  // let totalTime = Number(localStorage.getItem("remainingTime")) || 15 * 60;
  let totalTime = Number(sessionStorage.getItem("remainingTime")) || 15 * 60;
  displayTimer();
  timerInterval = setInterval(() => {
    displayTimer();
    if (totalTime <= 0) {
      timeUp();
    }
  }, 1000);
  function displayTimer() {
    let minutes = Math.floor(totalTime / 60);
    let sec = totalTime % 60;
    timerElem.textContent = `${minutes}: ${sec < 10 ? "0" + sec : sec}`;
    totalTime--;
    // localStorage.setItem("remainingTime", totalTime);
  }
}

function timeUp() {
  submit();
}

const nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", function () {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    sessionStorage.setItem("currentIndex", currentIndex);
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
    sessionStorage.setItem("currentIndex", currentIndex);
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
  submit();
});

function submit() {
  clearInterval(timerInterval);
  var theRightAnswer = userAnswers.filter((a) => a.isCorrect).length;
  sessionStorage.removeItem("currentIndex");
  sessionStorage.removeItem("flaggedQuestions");
  sessionStorage.removeItem("questions");
  sessionStorage.removeItem("shuffled");
  sessionStorage.removeItem("userAnswers");

  localStorage.setItem("quizScore", theRightAnswer);
  localStorage.setItem("totalQuestions", questions.length);
  window.location.replace("../result page/result.html");
}
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
