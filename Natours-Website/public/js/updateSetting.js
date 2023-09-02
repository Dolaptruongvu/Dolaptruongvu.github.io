import axios from "axios";
import { showAlert } from "./alert";

exports.updateSetting = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:3000/api/v1/users/updatePassword"
        : "http://127.0.0.1:3000/api/v1/users/updateMe";
    const res = await axios({
      method: "patch",
      url,
      data,
    });
    if (res.data.status === "success") {
      showAlert(
        "success",
        `${type.toUpperCase()} has been updated successfully`
      );
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.enableSmsOtp = async (type) => {
  try {
    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:3000/api/v1/users/security/${type}`,
    });
  } catch (err) {
    if (err.response.status === 303 && err.response.data.data.url)
      location.assign(err.response.data.data.url);
  }
};
