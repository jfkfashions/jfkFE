import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, useParams } from "react-router-dom";
import image from "../images/createmeasure.webp";
import "../styles/global.css";
import "../styles/CreateMeasurement.css";
import { COLORS, SELECTED_FONT } from "../utils/constants";

const CreateMeasurement = () => {
  const [userData, setUserData] = useState({
    username: "",
    neck: "",
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeve: "",
    armhole: "",
    bicep: "",
    wrist: "",
    inseam: "",
    outseam: "",
    thigh: "",
    rise: "",
    bodylength: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingMeasurements, setExistingMeasurements] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { username } = useParams();
  const role = localStorage.getItem("role");

  useEffect(() => {
    setUserData((prevData) => ({
      ...prevData,
      username: username,
    }));

    // Check if measurements already exist
    checkExistingMeasurements();
  }, [username]);

  const checkExistingMeasurements = async () => {
    try {
      console.log("Checking for existing measurements for username:", username);
      const response = await axios.get(
        `${backendUrl}/api/users/measurements/view/`,
        {
          params: { username },
        },
      );
      console.log("Existing measurements response:", response.data);

      if (response.data && Object.keys(response.data).length > 0) {
        setExistingMeasurements(response.data);
        // Pre-fill form with existing data
        const filledData = {};
        Object.keys(response.data).forEach((key) => {
          if (key !== "username" && key !== "id") {
            const value = response.data[key];
            filledData[key] =
              value !== null && value !== undefined ? value.toString() : "";
          }
        });
        console.log("Filled data from existing measurements:", filledData);
        setUserData((prev) => ({
          ...prev,
          ...filledData,
          username: username,
        }));
      } else {
        console.log("No existing measurements found - response data is empty");
      }
    } catch (error) {
      // No existing measurements is fine
      console.log("No existing measurements found - API error:", error.message);
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["neck", "chest", "waist", "hip", "shoulder"];

    for (let field of requiredFields) {
      const value = userData[field];
      if (!value || value.toString().trim() === "") {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      } else if (isNaN(value) || parseFloat(value) <= 0) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must be a positive number`;
      }
    }

    // Validate all numeric fields
    const allFields = Object.keys(userData).filter((key) => key !== "username");
    allFields.forEach((field) => {
      const value = userData[field];
      if (
        value &&
        value.toString().trim() !== "" &&
        (isNaN(value) || parseFloat(value) <= 0)
      ) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must be a positive number`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show confirmation dialog before saving
    const confirmed = window.confirm(
      "Please confirm your details again, click okay if very sure",
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      // Prepare measurement data
      const measurementData = {
        username: username,
      };

      // Add all measurement fields, converting to numbers where possible
      const measurementFields = [
        "neck",
        "chest",
        "waist",
        "hip",
        "shoulder",
        "sleeve",
        "armhole",
        "bicep",
        "wrist",
        "inseam",
        "outseam",
        "thigh",
        "rise",
        "bodylength",
      ];

      measurementFields.forEach((field) => {
        const value = userData[field];
        if (value && value.toString().trim() !== "") {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && numValue > 0) {
            measurementData[field] = numValue;
          }
        }
      });

      console.log("Sending measurement data:", measurementData);

      // Always use POST to the original endpoint
      const response = await axios.post(
        `${backendUrl}/api/users/measurements/new/`,
        measurementData,
      );

      console.log("API Response:", response.data);

      setSuccessMessage("Measurements saved successfully!");
      setShowPreview(false);

      // Reset form but keep username
      setUserData({
        username: username,
        neck: "",
        chest: "",
        waist: "",
        hip: "",
        shoulder: "",
        sleeve: "",
        armhole: "",
        bicep: "",
        wrist: "",
        inseam: "",
        outseam: "",
        thigh: "",
        rise: "",
        bodylength: "",
      });

      // Refresh existing measurements
      checkExistingMeasurements();

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error during measurement creation:", error);

      let errorMessage = "Failed to save measurements. Please try again.";

      if (error.response) {
        console.error("Error data:", error.response.data);

        if (error.response.status === 404) {
          errorMessage = `API endpoint not found. Please make sure the backend server is running on ${backendUrl}`;
        } else if (error.response.data) {
          if (typeof error.response.data === "string") {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          }
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check if the backend is running.";
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }

    // Clear any general error
    if (error) setError("");
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const closeModal = () => {
    setShowPreview(false);
  };

  const handleBackHome = () => {
    if (role === "client") {
      navigate("/client-home");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear all measurements?")) {
      setUserData({
        username: username,
        neck: "",
        chest: "",
        waist: "",
        hip: "",
        shoulder: "",
        sleeve: "",
        armhole: "",
        bicep: "",
        wrist: "",
        inseam: "",
        outseam: "",
        thigh: "",
        rise: "",
        bodylength: "",
      });
      setValidationErrors({});
      setError("");
    }
  };

  // Get filled field count
  const filledCount = Object.keys(userData).filter(
    (key) =>
      key !== "username" &&
      userData[key] !== "" &&
      userData[key] !== null &&
      userData[key] !== undefined,
  ).length;
  const totalFields = 14; // Excluding username

  return (
    <div
      className="create-measurement-page"
      style={{
        backgroundImage: `url(${image})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="measurement-container">
        {/* Header Section */}
        <div className="measurement-header">
          <button
            type="button"
            onClick={handleBackHome}
            className="button button-secondary back-button"
            style={{
              background: COLORS.SECONDARY_RED,
              color: COLORS.TEXT_WHITE,
            }}
          >
            ← Back to Dashboard
          </button>

          <div className="header-content">
            <h1 className="page-title">
              {existingMeasurements ? "Update" : "Create"} Measurements
            </h1>
            <p className="page-subtitle">
              {existingMeasurements
                ? `Updating measurements for ${username}`
                : `Creating measurements for ${username}`}
            </p>
          </div>

          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-label">Fields Filled</span>
              <span className="stat-value">
                {filledCount}/{totalFields}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Required</span>
              <span className="stat-value">5</span>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
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

        {successMessage && (
          <div
            className="success-message"
            role="alert"
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              borderLeft: "3px solid #10B981",
            }}
          >
            <span className="success-icon">✓</span>
            {successMessage}
          </div>
        )}

        {/* Existing Measurements Notice */}
        {existingMeasurements && (
          <div className="existing-notice">
            <div className="notice-icon">📏</div>
            <div className="notice-content">
              <h4>Existing Measurements Found</h4>
              <p>
                Your measurements are now readonly. To make changes, please use
                the View/Update Measurements page.
              </p>
            </div>
          </div>
        )}

        {/* Measurement Form */}
        <form onSubmit={handleSubmit} className="measurement-form">
          {/* Upper Body Measurements */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              Upper Body Measurements
            </h2>
            <div className="measurement-grid">
              <div className="measurement-group">
                <label className="measurement-label" htmlFor="neck">
                  Neck *
                  {validationErrors.neck && (
                    <span className="field-error">
                      {" "}
                      {validationErrors.neck}
                    </span>
                  )}
                </label>
                <div className="input-with-unit">
                  <input
                    id="neck"
                    type="number"
                    name="neck"
                    value={userData.neck}
                    onChange={handleChange}
                    className={`measurement-input ${
                      validationErrors.neck ? "input-error" : ""
                    }`}
                    placeholder="Enter neck measurement"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="chest">
                  Chest *
                  {validationErrors.chest && (
                    <span className="field-error">
                      {" "}
                      {validationErrors.chest}
                    </span>
                  )}
                </label>
                <div className="input-with-unit">
                  <input
                    id="chest"
                    type="number"
                    name="chest"
                    value={userData.chest}
                    onChange={handleChange}
                    className={`measurement-input ${
                      validationErrors.chest ? "input-error" : ""
                    }`}
                    placeholder="Enter chest measurement"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="shoulder">
                  Shoulder *
                  {validationErrors.shoulder && (
                    <span className="field-error">
                      {" "}
                      {validationErrors.shoulder}
                    </span>
                  )}
                </label>
                <div className="input-with-unit">
                  <input
                    id="shoulder"
                    type="number"
                    name="shoulder"
                    value={userData.shoulder}
                    onChange={handleChange}
                    className={`measurement-input ${
                      validationErrors.shoulder ? "input-error" : ""
                    }`}
                    placeholder="Enter shoulder width"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Torso Measurements */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">👕</span>
              Torso Measurements
            </h2>
            <div className="measurement-grid">
              <div className="measurement-group">
                <label className="measurement-label" htmlFor="waist">
                  Waist *
                  {validationErrors.waist && (
                    <span className="field-error">
                      {" "}
                      {validationErrors.waist}
                    </span>
                  )}
                </label>
                <div className="input-with-unit">
                  <input
                    id="waist"
                    type="number"
                    name="waist"
                    value={userData.waist}
                    onChange={handleChange}
                    className={`measurement-input ${
                      validationErrors.waist ? "input-error" : ""
                    }`}
                    placeholder="Enter waist measurement"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="hip">
                  Hip *
                  {validationErrors.hip && (
                    <span className="field-error"> {validationErrors.hip}</span>
                  )}
                </label>
                <div className="input-with-unit">
                  <input
                    id="hip"
                    type="number"
                    name="hip"
                    value={userData.hip}
                    onChange={handleChange}
                    className={`measurement-input ${
                      validationErrors.hip ? "input-error" : ""
                    }`}
                    placeholder="Enter hip measurement"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="bodylength">
                  Body Length
                </label>
                <div className="input-with-unit">
                  <input
                    id="bodylength"
                    type="number"
                    name="bodylength"
                    value={userData.bodylength}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter body length"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arm Measurements */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">💪</span>
              Arm Measurements
            </h2>
            <div className="measurement-grid">
              <div className="measurement-group">
                <label className="measurement-label" htmlFor="sleeve">
                  Sleeve Length
                </label>
                <div className="input-with-unit">
                  <input
                    id="sleeve"
                    type="number"
                    name="sleeve"
                    value={userData.sleeve}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter sleeve length"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="armhole">
                  Armhole
                </label>
                <div className="input-with-unit">
                  <input
                    id="armhole"
                    type="number"
                    name="armhole"
                    value={userData.armhole}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter armhole"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="bicep">
                  Bicep
                </label>
                <div className="input-with-unit">
                  <input
                    id="bicep"
                    type="number"
                    name="bicep"
                    value={userData.bicep}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter bicep measurement"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="wrist">
                  Wrist
                </label>
                <div className="input-with-unit">
                  <input
                    id="wrist"
                    type="number"
                    name="wrist"
                    value={userData.wrist}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter wrist measurement"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leg Measurements */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">👖</span>
              Leg Measurements
            </h2>
            <div className="measurement-grid">
              <div className="measurement-group">
                <label className="measurement-label" htmlFor="inseam">
                  Inseam
                </label>
                <div className="input-with-unit">
                  <input
                    id="inseam"
                    type="number"
                    name="inseam"
                    value={userData.inseam}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter inseam"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="outseam">
                  Outseam
                </label>
                <div className="input-with-unit">
                  <input
                    id="outseam"
                    type="number"
                    name="outseam"
                    value={userData.outseam}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter outseam"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="thigh">
                  Thigh
                </label>
                <div className="input-with-unit">
                  <input
                    id="thigh"
                    type="number"
                    name="thigh"
                    value={userData.thigh}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter thigh measurement"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>

              <div className="measurement-group">
                <label className="measurement-label" htmlFor="rise">
                  Rise
                </label>
                <div className="input-with-unit">
                  <input
                    id="rise"
                    type="number"
                    name="rise"
                    value={userData.rise}
                    onChange={handleChange}
                    className="measurement-input"
                    placeholder="Enter rise"
                    step="0.1"
                    min="0"
                    disabled={isSubmitting || !!existingMeasurements}
                  />
                  <span className="unit-label">in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClearForm}
              className="button button-secondary clear-button"
              style={{
                background: COLORS.SECONDARY_RED,
                color: COLORS.TEXT_WHITE,
              }}
              disabled={isSubmitting || existingMeasurements}
            >
              Clear All
            </button>

            {!existingMeasurements && (
              <button
                type="button"
                onClick={togglePreview}
                className="button preview-button"
                style={{
                  background: "rgba(139, 69, 19, 0.1)",
                  color: COLORS.PRIMARY_BROWN_1,
                  border: `1px solid ${COLORS.PRIMARY_BROWN_1}`,
                }}
                disabled={isSubmitting}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal-overlay">
          <div className="preview-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Measurement Preview</h3>
              <button onClick={closeModal} className="modal-close">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="preview-grid">
                {Object.keys(userData)
                  .filter(
                    (key) =>
                      key !== "username" &&
                      userData[key] !== "" &&
                      userData[key] !== null &&
                      userData[key] !== undefined,
                  )
                  .map((key) => (
                    <div key={key} className="preview-item">
                      <span className="preview-label">
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                        :
                      </span>
                      <span className="preview-value">{userData[key]} in</span>
                    </div>
                  ))}
              </div>

              {filledCount === 0 && (
                <div className="empty-preview">
                  <div className="empty-icon">📏</div>
                  <p>No measurements entered yet</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={closeModal}
                className="button button-secondary"
                style={{
                  background: COLORS.SECONDARY_RED,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                Keep Editing
              </button>
              <button
                onClick={() => {
                  handleSubmit({ preventDefault: () => {} });
                }}
                className="button button-primary"
                style={{
                  background: COLORS.BUTTON_ACTIVE,
                  color: COLORS.TEXT_WHITE,
                }}
                disabled={isSubmitting || filledCount < 5}
              >
                Save Measurement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMeasurement;
