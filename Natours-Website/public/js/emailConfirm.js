import axios from "axios";
import { showAlert } from "./alert";

export const sendEmailConfirm = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/sendConfirmEmail",
    });

    if (res.data.status === "success")
      location.assign("/me/confirmEmail/sentConfirmAlert");
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
