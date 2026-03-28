const signUpForm = document.getElementById("sign-up-form");

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  document
    .querySelectorAll(".error-msg")
    .forEach((element) => (element.classList.remove("display")));

  const nameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRegex = /^[A-Za-z]{2,20}$/;
  const passwordRegx = /^[A-Za-z0-9]{6,}$/;
  let isValid = true;
  if (
    firstName.value.trim() === "" &&
    !nameRegex.test(firstName.value.trim())
  ) {
    firstNameError.classList.add("display")
    isValid = false;
  }
  if (lastName.value.trim() === "" && !nameRegex.test(lastName.value.trim())) {
    lastNameError.classList.add("display")
    isValid = false;
  }
  if (email.value.trim() === "" && !emailRegex.test(email.value.trim())) {
    emailError.classList.add("display")
    isValid = false;
  }
  if (
    password.value.trim() === "" &&
    !passwordRegx.test(password.value.trim())
  ) {
    passwordError.classList.add("display")
    isValid = false;
  }
  if (confirmPassword.value.trim() === "") {
    confirmPasswordError.classList.add("display")
    isValid = false;
  } else if (password.value.trim() != confirmPassword.value.trim()) {
    confirmPasswordError.textContent =
      "Passwrod and Confirm Password dosn't match";
    confirmPasswordError.classList.add("display")
    isValid = false;
  } else {
    confirmPasswordError.classList.remove("display")
    confirmPasswordError.textContent = "This field is requeired";
  }
  if (!isValid) return;

  const newUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  };

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (!Array.isArray(users)) {
    users = [users];
  }

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "../index.html";
});
