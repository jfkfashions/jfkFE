import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, Link } from "react-router-dom";
import image from "../images/signin.webp";
import "../styles/global.css";
import "../styles/LoginPage.css";
import { COLORS, SELECTED_FONT } from "../utils/constants";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${backendUrl}/api/users/verify/`, {
        username,
        password,
      });

      // Save JWT token and role in localStorage
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", username);

      // Navigate based on the role
      if (response.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/client-home");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid username or password"
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div
      className="page login-page"
      style={{
        backgroundImage: `url(${image})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="container-login">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBackHome}
          className="button button-secondary back-button"
          aria-label="Go back to home page"
          style={{
            background: COLORS.SECONDARY_RED,
            color: COLORS.TEXT_WHITE,
            alignSelf: "flex-start",
            marginBottom: "20px",
          }}
        >
          ← Back Home
        </button>

        {/* Login header */}
        <div className="login-header">
          <h2 className="heading-login">Welcome Back</h2>
          <p className="login-subtitle">
            Please enter your credentials to access your account
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage("");
              }}
              className="input login-input"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              className="input login-input"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <div
              className="error-message"
              role="alert"
              aria-live="assertive"
              style={{
                color: COLORS.ERROR,
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Forgot password link */}
          <div className="form-options">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="button button-primary login-button"
            disabled={isLoading}
            style={{
              background: COLORS.BUTTON_ACTIVE,
              color: COLORS.TEXT_WHITE,
              width: "100%",
              marginTop: "20px",
            }}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Sign up link */}
        <div className="signup-link-container">
          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
