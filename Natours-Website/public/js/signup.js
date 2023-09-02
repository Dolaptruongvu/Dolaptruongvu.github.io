import axios from "axios";
import { showAlert } from "./alert";

export const signup = async (userData) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/signup",
      data: userData,
    });

    if (res.data.status === "success") {
      showAlert("success", "Signup Successfully");

      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.respone.data.message);
  }
};
