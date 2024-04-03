import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/UserRegister.css";
import { Link } from "react-router-dom";

const UserRegister = () => {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please provide a valid email address.",
      }));
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const validatePassword = (value) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length < minLength) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: `Password must be at least ${minLength} characters long.`,
      }));
    } else if (!hasUpperCase) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one uppercase letter.",
      }));
    } else if (!hasLowerCase) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one lowercase letter.",
      }));
    } else if (!hasNumber) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one number.",
      }));
    } else if (!hasSpecialChar) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one special character.",
      }));
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (Password !== ConfirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const response = await axios.post(
        "https://nodejs-day-5-task-backend-ameu.onrender.com/Users/register",
        {
          Username,
          Email,
          Password,
        }
      );
      console.log("Registration successful:", response.data);
      toast.success("Registration successful!");
      // Optionally, you can redirect the user to another page after successful registration
      setTimeout(() => {
        toast.info("Login now!");
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login after 2 seconds
        }, 2000);
      }, 3000); // Show "Login now" toast after 3 seconds
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      if (error.response && error.response.status === 400) {
        if (error.response.data.error.includes("Username")) {
          toast.error("Please provide a valid username.");
        } else if (error.response.data.error.includes("Email")) {
          toast.error("Please provide a valid email address.");
        } else if (error.response.data.error.includes("Password")) {
          toast.error("Please provide a valid password.");
        }
      } else if (error.message === "Passwords do not match.") {
        toast.error("Passwords do not match.");
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match.",
        }));
      } else if (error.response && error.response.status === 409) {
        toast.error("User already exists. Please use a different email.");
      } else {
        toast.error("Registration failed. Please try again later.");
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h2 className="mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Username" className="form-label">
              <FontAwesomeIcon icon={faUser} className="icon" />
              Username:
            </label>
            <input
              type="text"
              id="Username"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Email" className="form-label">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              Email:
            </label>
            <input
              type="email"
              id="Email"
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
              required
            />
            {formErrors.email && (
              <div className="invalid-feedback">{formErrors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="Password" className="form-label">
              <FontAwesomeIcon icon={faLock} className="icon" />
              Password:
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                value={Password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className={`form-control ${
                  formErrors.password ? "is-invalid" : ""
                }`}
                required
              />
              {!formErrors.password && ( // Only render toggle icon if there are no password errors
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="password-toggle-icon"
                  onClick={handleTogglePassword}
                />
              )}
              {formErrors.password && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ConfirmPassword" className="form-label">
              <FontAwesomeIcon icon={faLock} className="icon" />
              Confirm Password:
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="ConfirmPassword"
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-control ${
                  formErrors.confirmPassword ? "is-invalid" : ""
                }`}
                required
              />
              {!formErrors.confirmPassword && ( // Only render toggle icon if there are no confirm password errors
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  className="password-toggle-icon"
                  onClick={handleToggleConfirmPassword}
                />
              )}
              {formErrors.confirmPassword && (
                <div className="invalid-feedback">
                  {formErrors.confirmPassword}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Register
          </button>
        </form>
        <br /> <br />
        <div className="text-center">
          <p className=" text-muted mt-3">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserRegister;
