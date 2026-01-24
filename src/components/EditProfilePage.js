import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate } from "react-router-dom";
import background from "../images/editprofile.webp";
import "../styles/global.css";
import "../styles/EditProfilePage.css";
import { COLORS, SELECTED_FONT } from "../utils/constants";

const EditProfilePage = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    gender: "",
    birthdate: "",
    bio: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const username = localStorage.getItem("username");
        if (!username) {
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `${backendUrl}/api/users/profile/${username}`,
        );
        // Ensure bio is never null, convert to empty string if needed
        const userData = response.data;
        setProfile({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          phonenumber: userData.phonenumber || "",
          email: userData.email || "",
          gender: userData.gender || "",
          birthdate: userData.birthdate || "",
          bio: userData.bio || "", // Convert null to empty string
        });
      } catch (err) {
        setError("Unable to fetch profile information. Please try again.");
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const validateForm = () => {
    const errors = {};

    if (!profile.firstname.trim()) {
      errors.firstname = "First name is required";
    }

    if (!profile.lastname.trim()) {
      errors.lastname = "Last name is required";
    }

    if (!profile.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!profile.phonenumber.trim()) {
      errors.phonenumber = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{10,}$/.test(profile.phonenumber)) {
      errors.phonenumber = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value || "", // Ensure value is never null
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }

    // Clear any general error
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const username = localStorage.getItem("username");
      await axios.put(`${backendUrl}/api/users/profile/${username}/`, profile);
      setSuccess(true);

      // Store updated name in localStorage for immediate use
      localStorage.setItem("username", profile.username || username);

      setTimeout(() => {
        navigate("/client-home");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update profile. Please try again.",
      );
      console.error("Update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setSuccess(false);
    navigate("/client-home");
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost.",
      )
    ) {
      navigate("/client-home");
    }
  };

  // Get bio length safely
  const bioLength = profile.bio ? profile.bio.length : 0;

  if (isLoading) {
    return (
      <div
        className="edit-profile-page"
        style={{ fontFamily: SELECTED_FONT.family }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="edit-profile-page"
      style={{
        backgroundImage: `url(${background})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="edit-profile-container">
        {/* Header Section - Fixed layout */}
        <div className="profile-header">
          <div className="header-top-row">
            <button
              type="button"
              onClick={handleCancel}
              className="button button-secondary back-button"
              style={{
                background: COLORS.SECONDARY_RED,
                color: COLORS.TEXT_WHITE,
              }}
            >
              ← Back to Home
            </button>

            <div className="avatar-section">
              <div className="avatar-preview">
                <span className="avatar-text">
                  {profile.firstname?.charAt(0) || ""}
                  {profile.lastname?.charAt(0) || ""}
                </span>
              </div>
            </div>
          </div>

          <div className="header-content">
            <h1 className="page-title">Edit Your Profile</h1>
            <p className="page-subtitle">
              Update your personal information and preferences
            </p>
            <button
              type="button"
              className="avatar-change-btn"
              onClick={() => {
                /* Add avatar upload functionality */
              }}
            >
              Change Profile Photo
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          {error && (
            <div
              className="error-message"
              role="alert"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                borderLeft: `3px solid ${COLORS.ERROR}`,
              }}
            >
              {error}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              Personal Information
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname" className="form-label">
                  First Name *
                </label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  value={profile.firstname || ""}
                  onChange={handleChange}
                  className={`form-input ${
                    validationErrors.firstname ? "input-error" : ""
                  }`}
                  placeholder="Enter your first name"
                  required
                  disabled={isSaving}
                />
                {validationErrors.firstname && (
                  <span className="field-error">
                    {validationErrors.firstname}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastname" className="form-label">
                  Last Name *
                </label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  value={profile.lastname || ""}
                  onChange={handleChange}
                  className={`form-input ${
                    validationErrors.lastname ? "input-error" : ""
                  }`}
                  placeholder="Enter your last name"
                  required
                  disabled={isSaving}
                />
                {validationErrors.lastname && (
                  <span className="field-error">
                    {validationErrors.lastname}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">📱</span>
              Contact Information
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phonenumber" className="form-label">
                  Phone Number *
                </label>
                <input
                  id="phonenumber"
                  type="tel"
                  name="phonenumber"
                  value={profile.phonenumber || ""}
                  onChange={handleChange}
                  className={`form-input ${
                    validationErrors.phonenumber ? "input-error" : ""
                  }`}
                  placeholder="Enter your phone number"
                  required
                  disabled={isSaving}
                />
                {validationErrors.phonenumber && (
                  <span className="field-error">
                    {validationErrors.phonenumber}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={profile.email || ""}
                  className={`form-input ${
                    validationErrors.email ? "input-error" : ""
                  }`}
                  placeholder="Enter your email address"
                  required
                  disabled={true}
                  title="Email address cannot be changed after sign-up"
                />
                {validationErrors.email && (
                  <span className="field-error">{validationErrors.email}</span>
                )}
                <span className="field-hint">
                  Cannot be changed after sign-up
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information Section - Read Only */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">ℹ️</span>
              Additional Information
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <input
                  id="gender"
                  type="text"
                  name="gender"
                  value={profile.gender || ""}
                  className="form-input"
                  placeholder="Not provided"
                  disabled={true}
                  title="Gender cannot be changed after sign-up"
                />
                <span className="field-hint">
                  Cannot be changed after sign-up
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="birthdate" className="form-label">
                  Date of Birth
                </label>
                <input
                  id="birthdate"
                  type="text"
                  name="birthdate"
                  value={profile.birthdate || ""}
                  className="form-input"
                  placeholder="Not provided"
                  disabled={true}
                  title="Date of birth cannot be changed after sign-up"
                />
                <span className="field-hint">
                  Cannot be changed after sign-up
                </span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">📝</span>
              About You
            </h2>
            <div className="form-group full-width">
              <label htmlFor="bio" className="form-label">
                Bio
                <span className="optional-label"> (Optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us about yourself, your style preferences, or any special requirements..."
                rows="6"
                disabled={isSaving}
                maxLength="500"
              />
              <div className="character-count">{bioLength}/500 characters</div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="button button-secondary cancel-button"
              style={{
                background: COLORS.SECONDARY_RED,
                color: COLORS.TEXT_WHITE,
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary save-button"
              style={{
                background: COLORS.BUTTON_ACTIVE,
                color: COLORS.TEXT_WHITE,
              }}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Profile Updated Successfully!</h3>
            <p className="success-message">
              Your changes have been saved. You'll be redirected to your
              dashboard shortly.
            </p>
            <div className="success-details">
              <p>Updated information:</p>
              <ul>
                <li>
                  Name: {profile.firstname || ""} {profile.lastname || ""}
                </li>
                <li>Email: {profile.email || ""}</li>
                <li>Phone: {profile.phonenumber || ""}</li>
              </ul>
            </div>
            <button
              onClick={closeModal}
              className="button button-primary"
              style={{
                background: COLORS.BUTTON_ACTIVE,
                color: COLORS.TEXT_WHITE,
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
