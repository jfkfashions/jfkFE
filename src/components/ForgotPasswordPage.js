import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../globalContext/constant";
import { COLORS, SELECTED_FONT } from "../utils/constants";
import image from "../images/signin.webp";
import "../styles/ForgotPassword.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/forgot-password/`,
        {
          email,
        },
      );

      setStatusMessage(
        response.data?.message || "Reset link sent to your email",
      );
    } catch (error) {
      const apiMessage = error.response?.data?.error;
      setErrorMessage(
        apiMessage || "Unable to send reset email. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackHome = () => navigate("/");

  return (
    <div
      className="page forgot-page"
      style={{
        backgroundImage: `url(${image})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="auth-card">
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

        <div className="auth-header">
          <h2 className="auth-title">Forgot your password?</h2>
          <p className="auth-subtitle">
            Enter the email associated with your account and we will send you a
            reset link.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input auth-input"
            placeholder="you@example.com"
            required
            disabled={isLoading}
            autoComplete="email"
            onFocus={() => {
              setErrorMessage("");
              setStatusMessage("");
            }}
          />

          {statusMessage && (
            <div
              className="status-message success"
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </div>
          )}

          {errorMessage && (
            <div
              className="status-message error"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="button button-primary auth-button"
            disabled={isLoading}
            style={{
              background: COLORS.BUTTON_ACTIVE,
              color: COLORS.TEXT_WHITE,
            }}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="helper-links">
          <Link to="/login" className="helper-link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
