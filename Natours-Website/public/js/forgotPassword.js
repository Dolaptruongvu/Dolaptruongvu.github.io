import axios from "axios";
import { showAlert } from "./alert";

export const sendForgotPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/forgotPassword",
      data: email,
    });

    if (res.data.status === "success") {
      showAlert("success", "Your Reset Password Link has been sent");
    }
    window.setTimeout(() => {
      location.assign("/login/forgot-password/sentMailAlert");
    }, 2000);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const sendResetPassword = async (data, url) => {
  try {
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Your Password Has Been Reset");
      window.setTimeout(() => {
        location.assign("/");
      }, 2000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
