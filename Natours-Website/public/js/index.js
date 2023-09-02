import "@babel/polyfill";
import { login, logout, sendOtp } from "./login";
import { displayMap } from "./mapbox";
import { updateSetting, enableSmsOtp } from "./updateSetting";
import { bookTour } from "./stripe";
import { signup } from "./signup";
import { sendForgotPassword, sendResetPassword } from "./forgotPassword";
import { sendReview } from "./review";
import { showAlert } from "./alert";
import { sendEmailConfirm } from "./emailConfirm";


//Dom elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".account-form");
const adminDataForm = document.querySelector(".password-form ");
const forgotPasswordForm = document.querySelector(".forgotPassword-form");
const resetPasswordForm = document.querySelector(".form.form--resetPassword");
const reviewForm = document.querySelector(".form--review");
const smsOTPForm = document.querySelector(".form--otp");
const securityOptionForm = document.querySelector(".account-form--security");
const bookBtn = document.getElementById("book-tour");
const emailConfirmBtn = document.getElementById("card-container__alert-button");

//Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  document.querySelector(".form--login").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameVal = document.getElementById("userName").value;
    const emailVal = document.getElementById("userEmail").value;
    const phoneNumbVal = document.getElementById("phoneNumber").value;
    const passwordVal = document.getElementById("userPassword").value;
    const passwordConfirmVal = document.getElementById(
      "userConfirmPassword"
    ).value;
    console.log("signup Form");
    const userData = {
      name: nameVal,
      email: emailVal,
      phoneNumber: phoneNumbVal,
      password: passwordVal,
      passwordConfirm: passwordConfirmVal,
    };

    console.log(userData);
    await signup(userData);
    console.log("senđone");
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("userName").value);
    form.append("email", document.getElementById("userEmail").value);
    form.append("photo", document.getElementById("fileInput").files[0]);
    console.log(form);
    updateSetting(form, "data");
  });
}
if (adminDataForm) {
  adminDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--savepassword").textContent = "Updating...";
    const passwordCurrent = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const passwordConfirm = document.getElementById("confirmPassword").value;

    await updateSetting(
      { passwordCurrent, newPassword, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--savepassword").textContent = "SAVE PASSWORD";
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
  });
}
if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    const radioContainer = document.querySelector(".facts__containerValue");
    const radioSelection = radioContainer.querySelector(
      'input[type="radio"]:checked'
    );
    if (radioSelection) {
      const dateSelection = radioSelection.dataset.value;
      bookTour(tourId, dateSelection, e);
    } else {
      radioContainer.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      showAlert("error", "Please choose your date");
      e.target.textContent = "Book tour now !";
    }
  });
}
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailForgot").value;
    const userMail = {
      email,
    };

    sendForgotPassword(userMail);
  });
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const url = window.location.href;
    const password = document.getElementById("userResetPassword").value;
    const passwordConfirm = document.getElementById(
      "userRConfirmResetPassword"
    ).value;
    const userResetPassword = {
      password,
      passwordConfirm,
    };
    sendResetPassword(userResetPassword, url);
  });
}
if (reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { tourid } = document.querySelector(".btn--review").dataset;
    const rating = document.getElementById("rating").value;
    const review = document.getElementById("review").value;
    const userReview = {
      rating,
      review,
    };

    sendReview(userReview, tourid);
  });
}
if (emailConfirmBtn) {
  emailConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendEmailConfirm();
  });
}
if (smsOTPForm) {
  smsOTPForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const smsOTPValue = document.getElementById("otp").value; //
    const userId = document.querySelector(".btn--otp").dataset.userid;
    sendOtp(smsOTPValue, userId);
  });
}
if (securityOptionForm) {
  securityOptionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const securityOptions = document.querySelector(
      ".account-form__securityOptions"
    );
    const securityOption =
      securityOptions.querySelector("option:checked").value;
    console.log(securityOption);
    await enableSmsOtp(securityOption);
  });
}
