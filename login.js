const loginfrom = document.getElementById("sign-in-form");

loginfrom.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("inputEmail");
  const password = document.getElementById("inputPassword");

  const emailerror = document.getElementById("emailError");
  const passworderror = document.getElementById("passwordError");

  emailerror.style.display = "none";
  passworderror.style.display = "none";

  const emailregex = /^[A-Za-z]{2,20}$/;
  let isvalid = true;

  if (email.value.trim() === "") {
    isvalid = false;
    emailerror.textContent = "email is required";
    emailerror.style.display = "block";
  } else if (emailregex.test(email.value.trim())) {
    isvalid = false;
    emailerror.textContent = "invalid email format";
    emailerror.style.display = "block";
  }

  if (password.value.trim() === "") {
    isvalid = false;
    passworderror.textContent = "password is required";
    passworderror.style.display = "block";
  }

  if (!isvalid) return;

  const users = JSON.parse(localStorage.getItem("users"));
  if (!users) return;

  const user = users.find(
    (u) => u.email == inputEmail.value && u.password == inputPassword.value,
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "../Exam page/exam.html";
  } else {
    passworderror.textContent = "invalid email or password";
    passworderror.style.display = "block";
  }
});
