import axios from "axios";
import { showAlert } from "./alert";

export const sendReview = async (userReview, tourID) => {
  try {
    await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/tours/${tourID}/reviews`,
      data: userReview,
    });
    showAlert("success", "Review successfully");
    location.reload();
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
