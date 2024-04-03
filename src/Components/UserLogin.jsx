import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoggedInPage from "./LoggedInPage"; // Import the LoggedInPage component
import "./Styles/UserLogin.css";

const UserLogin = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // State to track if user is logged in
  const [userEmail, setUserEmail] = useState(""); // State to store the logged-in user's email

  const handleForgetPasswordClick = () => {
    setShowForgetPassword(true);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = (userEmail) => {
    setUserEmail(userEmail); // Store the logged-in user's email
    setLoggedIn(true); // Update loggedIn state to true after successful login
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://nodejs-day-5-task-backend-ameu.onrender.com/Users/login",
        {
          Email,
          Password,
        }
      );
      console.log("Sign in successful:", response.data);
      toast.success("Login successful!");

      // Call the handleLogin function with userEmail when login is successful
      handleLogin();
      setUserEmail(Email);

      // Clear form after successful login
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Log In failed:", error.response.data);
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password.");
      } else if (error.response && error.response.status === 500) {
        toast.error("Internal Server Error. Please try again later.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  // If user is logged in, redirect to LoggedInPage component
  if (loggedIn) {
    return <LoggedInPage userEmail={userEmail} />; // Pass userEmail as a prop to LoggedInPage
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="mb-4">Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Email" className="mb-1 py-2">
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Email:
            </label>
            <input
              type="email"
              id="Email"
              value={Email}
              onChange={handleEmailChange}
              className="form-control"
              placeholder="Enter your Email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Password" className="mb-1 py-2">
              <FontAwesomeIcon icon={faLock} className="me-2" />
              Password:
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                value={Password}
                onChange={handlePasswordChange}
                className="form-control"
                placeholder="Enter your Password"
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-toggle-icon mt-1 py-1"
                onClick={handleTogglePassword}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Sign In
          </button>
        </form>
        <Link
          to="/forget-password"
          onClick={handleForgetPasswordClick}
          className="forget-password-link"
        >
          Forgot Password?
        </Link>
        {showForgetPassword && <ForgetPassword />}
        <div className="text-center mt-3">
          <p className=" text-muted">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserLogin;
