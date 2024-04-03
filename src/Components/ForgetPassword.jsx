import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./Styles/ForgetPassword.css";

const ForgetPassword = () => {
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendResetLink = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://nodejs-day-5-task-backend-ameu.onrender.com/Users/forget-password",
        { Email: Email } // Modify the data structure to match backend
      );
      console.log("Forget password request successful:", response.data);
      toast.success("Reset link sent successfully.");
    } catch (error) {
      console.error("Forget password request failed:", error.message);
      toast.error(
        `${
          "Invalid Email Entered.  Please try again later." ||
          "An error occurred while sending reset link. Please try again later."
        }`
      );
    }

    setLoading(false);
  };

  return (
    <div className="forget-password-container mt-5 py-5">
      <h2 className="forget-password-title">Forget Password</h2>
      <div className="forget-password-form">
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={Email}
            onChange={handleEmailChange}
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
        <button
          onClick={handleSendResetLink}
          className="btn-send-reset-link"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <ToastContainer />
        {/* Back link to return to login component */}
        <Link to="/login" className="back-link">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
