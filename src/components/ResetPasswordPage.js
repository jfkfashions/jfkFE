import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { backendUrl } from "../globalContext/constant";
import { COLORS, SELECTED_FONT } from "../utils/constants";
import image from "../images/signin.webp";
import "../styles/ForgotPassword.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!token) {
      setErrorMessage("Reset token is missing or invalid.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/reset-password/`,
        {
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
      );

      setStatusMessage(
        response.data?.message || "Password has been reset successfully.",
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const apiMessage = error.response?.data?.error;
      setErrorMessage(
        apiMessage || "Unable to reset password. Please try again.",
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
          <h2 className="auth-title">Set a new password</h2>
          <p className="auth-subtitle">
            Your new password must be at least 8 characters and include an
            uppercase letter, a number, and a special character.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input auth-input"
            placeholder="Enter new password"
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          <label className="form-label" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input auth-input"
            placeholder="Confirm new password"
            required
            disabled={isLoading}
            autoComplete="new-password"
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
            {isLoading ? "Updating..." : "Update password"}
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

export default ResetPasswordPage;
