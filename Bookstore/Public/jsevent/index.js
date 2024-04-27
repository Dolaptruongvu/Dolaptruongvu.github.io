import "@babel/polyfill";
import { login, logout } from "./login";
import { signup } from "../../views/component/signup";
// import { showAlert } from "./alert";

//Dom elements
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const signupForm = document.querySelector(".form--signup");

if (loginForm) {
  console.log("hi");
}

// if (loginForm) {
//     document.querySelector(".login-form").addEventListener("submit", (e) => {
//       e.preventDefault();
//       const email = document.getElementById("email").value;
//       const password = document.getElementById("password").value;
//       login(email, password);
//     });
//   }
//   if (signupForm) {
//     signupForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const nameVal = document.getElementById("userName").value;
//       const emailVal = document.getElementById("userEmail").value;
//       const passwordVal = document.getElementById("userPassword").value;
//       const passwordConfirmVal = document.getElementById(
//         "userConfirmPassword"
//       ).value;

//       const userData = {
//         name: nameVal,
//         email: emailVal,
//         password: passwordVal,
//         passwordConfirm: passwordConfirmVal,
//       };

//       await signup(userData);
//     });
//   }

//   if (logOutBtn) logOutBtn.addEventListener("click", logout);
//   if (userDataForm) {
//     userDataForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const form = new FormData();
//       form.append("name", document.getElementById("userName").value);
//       form.append("email", document.getElementById("userEmail").value);
//       form.append("photo", document.getElementById("fileInput").files[0]);
//       updateSetting(form, "data");
//     });
//   }
