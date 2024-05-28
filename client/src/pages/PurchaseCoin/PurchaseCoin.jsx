import React, { useState } from "react";
import axiosClient from "../../axios/axiosClient";
import { refetchedUserData } from "../../services/refetchedUserData";
import { saveState } from "../../middleware/sessionStorage";
import { loginUserSuccess } from "../../actions/actions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Assuming axiosClient is your custom Axios instance

const PurchaseCoin = () => {
  // State to track selected card and payment status
  const [selectedCard, setSelectedCard] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // Function to handle payment for selected card
  const handlePayment = async (coins, dollars) => {
    try {
      const amount = dollars;
      // Send payment request to the backend
      const response = await axiosClient.post("users/buy-coins", {
        amount,
      });
      // If payment is successful, update userCoins and set payment success status
      // console.log(response.data);
      if (response.data) {
        // Here you would update the user's coin count
        setPaymentSuccess(true);
        const response = await refetchedUserData(user?.accessToken);
        saveState(user?.data);
        dispatch(loginUserSuccess(response?.data));
        navigate("/recipe");
      } else {
        console.error("Payment failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Purchase Coin
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card for buying 100 coins */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              100 Coins
            </h3>
            <p className="text-gray-600">Spend $1</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => handlePayment(100, 1)}
            >
              Purchase
            </button>
          </div>
          {/* Card for buying 500 coins */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              500 Coins
            </h3>
            <p className="text-gray-600">Spend $5</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => handlePayment(500, 5)}
            >
              Purchase
            </button>
          </div>
          {/* Card for buying 1000 coins */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              1000 Coins
            </h3>
            <p className="text-gray-600">Spend $10</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => handlePayment(1000, 10)}
            >
              Purchase
            </button>
          </div>
        </div>
        {/* Display payment success message */}
        {paymentSuccess && (
          <p className="text-green-600 mt-4">Payment successful!</p>
        )}
      </div>
    </section>
  );
};

export default PurchaseCoin;
