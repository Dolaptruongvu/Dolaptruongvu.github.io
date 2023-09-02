import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success" && res.status === 200) {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    if (err.response.status === 303) {
      location.assign(`${err.response.data.data.url}`);
    } else {
      showAlert("error", err.response.data.message);
    }
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if (res.data.status === "success") location.assign("/login");
  } catch (err) {
    showAlert("error", "Error logging out! Try again");
  }
};

export const sendOtp = async (smsOTPValue, userId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/users/2FA/${userId}`,
      data: {
        smsOTPValue,
      },
    });

    if (res.data.status === "success") location.assign("/");
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
