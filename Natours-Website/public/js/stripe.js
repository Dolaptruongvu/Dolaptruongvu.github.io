import axios from "axios";
import { showAlert } from "./alert";

export const bookTour = async (tourId, dateSelection, e) => {
  const stripe = Stripe(
    "pk_test_51NefRuDno7xMeKTrHJyJParnyCentn0t6dmiX4hONCG3ZVjFrKtjZPBFNwMan8j6iNB2KEJs5w6U50miLAkyGIaX00WHltJnL3"
  );

  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId},${dateSelection}`
    );
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
    e.target.textContent = "Book tour now !";
  }
};
