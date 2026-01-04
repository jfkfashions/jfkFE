import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/OrderForm.css";
import { COLORS, SELECTED_FONT } from "../utils/constants";
import orderFormBackground from "../images/orderform.webp";

const OrderForm = () => {
  const [measurements, setMeasurements] = useState("");
  const [userStats, setUserStats] = useState({});
  const [comments, setComments] = useState("");
  const [success, setSuccess] = useState(false);
  const [client, setClient] = useState("");
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [material, setMaterial] = useState(false);
  const [preferredColor, setPreferredColor] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [maildata, setMaildata] = useState({
    message: "",
    subject: "",
    username: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/users/userprofile`);
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setError("Unable to load client profiles.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMeasurements = async (username) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/users/measurements/view/`,
        {
          params: { username },
        }
      );
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      setError("Unable to fetch measurements for this client.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    resetForm();
    const username = event.target.value;
    setSelectedProfile(username);
    setUsername(username);
    if (username) {
      fetchMeasurements(username);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchProfiles();
    } else if (role === "client") {
      const username = localStorage.getItem("username");
      setClient(username);
      setUsername(username);
      setSelectedProfile(username);
      fetchMeasurements(username);
    }
  }, [role]);

  const validateForm = () => {
    const errors = {};

    if (!measurements.trim()) {
      errors.measurements = "Measurements are required";
    }

    if (!expectedDate.trim()) {
      errors.expectedDate = "Expected delivery date is required";
    } else if (new Date(expectedDate) < new Date()) {
      errors.expectedDate = "Delivery date cannot be in the past";
    }

    if (!eventType.trim()) {
      errors.eventType = "Event type is required";
    }

    if (role === "admin" && !selectedProfile.trim()) {
      errors.client = "Please select a client";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        measurements,
        comments: comments.trim() || "No additional comments",
        expected_date: expectedDate,
        event_type: eventType,
        material,
        preferred_Color: preferredColor.trim() || "Not specified",
        username: selectedProfile || username,
        client: selectedProfile || username,
      };

      const orderresponse = await axios.post(
        `${backendUrl}/api/users/orders/new/`,
        orderData
      );

      maildata.message = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .email-container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                .email-header { background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px 20px; text-align: center; color: white; }
                .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                .order-details { padding: 30px; background: rgba(139, 69, 19, 0.05); border-radius: 8px; margin: 20px 0; }
                .detail-item { display: flex; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(139, 69, 19, 0.1); }
                .detail-label { font-weight: 600; color: #8B4513; min-width: 180px; }
                .detail-value { font-weight: 500; color: #222; }
                .footer { background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 25px; color: white; text-align: center; }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <div class="logo">JFK TAILOR SHOP</div>
                    <div>🎉 New Order Confirmation 🎉</div>
                </div>
                <div style="padding: 30px;">
                    <h2>Hello <strong>${
                      selectedProfile || username
                    }</strong>,</h2>
                    <p>We're excited to let you know that your new order has been successfully created!</p>
                    
                    <div class="order-details">
                        <div class="detail-item">
                            <span class="detail-label">Order Number:</span>
                            <span class="detail-value">${
                              orderresponse.data.id
                            }</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Expected Delivery:</span>
                            <span class="detail-value">${new Date(
                              expectedDate
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Event Type:</span>
                            <span class="detail-value">${eventType}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Preferred Colors:</span>
                            <span class="detail-value">${
                              preferredColor.trim() || "Not specified"
                            }</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Material Provided:</span>
                            <span class="detail-value">${
                              material ? "Yes" : "No"
                            }</span>
                        </div>
                    </div>
                    
                    <p style="margin: 20px 0;">
                        <strong>📋 Order Details:</strong><br/>
                        ${measurements
                          .split("\n")
                          .map(
                            (line) =>
                              `<div style="padding-left: 20px; margin: 5px 0;">• ${line}</div>`
                          )
                          .join("")}
                    </p>
                    
                    ${
                      comments.trim()
                        ? `<p style="margin: 20px 0;"><strong>📝 Additional Comments:</strong><br/>${comments}</p>`
                        : ""
                    }
                    
                    <p style="margin-top: 25px; text-align: center; font-size: 16px;">
                        We'll keep you updated on your order progress.<br/>
                        Thank you for choosing <strong style="color: #8B4513;">JFK Tailor Shop</strong>!
                    </p>
                </div>
                <div class="footer">
                    <p>JFK Tailor Shop | Where Excellence Meets Elegance</p>
                    <p>Need help? Contact us at support@jfktailorshop.com</p>
                    <p style="margin-top: 15px; font-style: italic;">Best regards,<br/>The JFK Tailor Shop Team</p>
                </div>
            </div>
        </body>
        </html>
      `;
      maildata.subject = `🎉 Your Order #${orderresponse.data.id} with JFK Tailor Shop`;
      maildata.username = orderresponse.data.client;

      setMaildata(maildata);

      await axios.post(`${backendUrl}/api/users/notifications/email`, maildata);
      setSuccess(true);
      setShowConfirmationModal(false);
      resetForm();
    } catch (error) {
      console.error("Error placing order:", error);
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setMeasurements("");
    setExpectedDate("");
    setEventType("");
    setMaterial(false);
    setPreferredColor("");
    setComments("");
    setUserStats({});
    setClient("");
    setError("");
    setValidationErrors({});
    if (role === "admin") {
      setSelectedProfile("");
    }
  };

  const handleBackHome = () => {
    navigate(role === "client" ? "/client-home" : "/admin/dashboard");
  };

  const closeModal = () => setSuccess(false);

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="order-form-page"
      style={{
        backgroundImage: `url(${orderFormBackground})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="order-form-container">
        {/* Header Section */}
        <div className="order-header">
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
            <h2 className="page-title">Place a New Order</h2>
            <p className="page-subtitle">
              {role === "admin"
                ? "Create order for a client"
                : "Create your custom tailoring order"}
            </p>
          </div>

          <div className="order-stats">
            <div className="stat-item">
              <span className="stat-label">Total Fields</span>
              <span className="stat-value">8</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Required</span>
              <span className="stat-value">5</span>
            </div>
          </div>
        </div>

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

        {/* Client Selection for Admin */}
        {role === "admin" && (
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">👤</span>
              Select Client
            </h3>
            <div className="form-group">
              <label className="form-label" htmlFor="client-select">
                Client *
                {validationErrors.client && (
                  <span className="field-error">
                    {" "}
                    {validationErrors.client}
                  </span>
                )}
              </label>
              <select
                id="client-select"
                value={selectedProfile}
                onChange={handleProfileChange}
                className={`form-select ${
                  validationErrors.client ? "input-error" : ""
                }`}
                disabled={loading}
              >
                <option value="" disabled>
                  Select a Client
                </option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.username}>
                    {profile.username} ({profile.firstname} {profile.lastname})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Measurements Comparison Table */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📏</span>
            Current Measurements
          </h3>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner-small"></div>
              <p>Loading measurements...</p>
            </div>
          ) : Object.keys(userStats).length > 0 ? (
            <div className="measurements-table-container">
              <table className="measurements-table">
                <thead>
                  <tr>
                    <th>Body Part</th>
                    <th>Current Measurement</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(userStats).map((key) => (
                    <tr key={key}>
                      <td className="body-part-cell">
                        {key
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </td>
                      <td className="measurement-cell">{userStats[key]} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="table-note">
                These are your current measurements on file. Please update if
                needed.
              </p>
            </div>
          ) : (
            <div className="no-measurements">
              <div className="warning-icon">⚠️</div>
              <p>
                No measurements found for this client. Please ensure
                measurements are recorded.
              </p>
            </div>
          )}
        </div>

        {/* Order Form */}
        <form onSubmit={handleConfirmOrder}>
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">✏️</span>
              Order Details
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="measurements">
                  Measurements *
                  {validationErrors.measurements && (
                    <span className="field-error">
                      {" "}
                      {validationErrors.measurements}
                    </span>
                  )}
                </label>
                <textarea
                  id="measurements"
                  value={measurements}
                  onChange={(e) => {
                    setMeasurements(e.target.value);
                    if (validationErrors.measurements) {
                      setValidationErrors({
                        ...validationErrors,
                        measurements: "",
                      });
                    }
                  }}
                  required
                  className={`form-textarea ${
                    validationErrors.measurements ? "input-error" : ""
                  }`}
                  placeholder="Enter custom measurements or modifications..."
                  rows="6"
                  disabled={loading || submitting}
                />
                <div className="character-count">
                  {measurements.length}/500 characters
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="comments">
                  Additional Comments
                  <span className="optional-label"> (Optional)</span>
                </label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="form-textarea"
                  placeholder="Enter any additional comments, special instructions, or requirements..."
                  rows="4"
                  disabled={loading || submitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="expectedDate">
                  Expected Delivery Date *
                  {validationErrors.expectedDate && (
                    <span className="field-error">
                      {" "}
                      {validationErrors.expectedDate}
                    </span>
                  )}
                </label>
                <input
                  id="expectedDate"
                  type="date"
                  value={expectedDate}
                  onChange={(e) => {
                    setExpectedDate(e.target.value);
                    if (validationErrors.expectedDate) {
                      setValidationErrors({
                        ...validationErrors,
                        expectedDate: "",
                      });
                    }
                  }}
                  className={`form-input ${
                    validationErrors.expectedDate ? "input-error" : ""
                  }`}
                  required
                  min={today}
                  disabled={loading || submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eventType">
                  Event Type *
                  {validationErrors.eventType && (
                    <span className="field-error">
                      {" "}
                      {validationErrors.eventType}
                    </span>
                  )}
                </label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => {
                    setEventType(e.target.value);
                    if (validationErrors.eventType) {
                      setValidationErrors({
                        ...validationErrors,
                        eventType: "",
                      });
                    }
                  }}
                  className={`form-input ${
                    validationErrors.eventType ? "input-error" : ""
                  }`}
                  required
                  disabled={loading || submitting}
                >
                  <option value="" disabled>
                    Select Event Type
                  </option>
                  <option value="Wedding">Wedding</option>
                  <option value="Business">Business/Formal</option>
                  <option value="Casual">Casual Wear</option>
                  <option value="Special Occasion">Special Occasion</option>
                  <option value="Traditional">Traditional Attire</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="preferredColor">
                  Preferred Color/Combinations
                  <span className="optional-label"> (Optional)</span>
                </label>
                <input
                  id="preferredColor"
                  type="text"
                  value={preferredColor}
                  onChange={(e) => setPreferredColor(e.target.value)}
                  className="form-input"
                  placeholder="e.g., Navy Blue with Gray, Burgundy, etc."
                  disabled={loading || submitting}
                />
              </div>

              <div className="form-group checkbox-group">
                <div className="checkbox-container">
                  <input
                    id="material"
                    type="checkbox"
                    checked={material}
                    onChange={(e) => setMaterial(e.target.checked)}
                    className="form-checkbox"
                    disabled={loading || submitting}
                  />
                  <label htmlFor="material" className="checkbox-label">
                    <span className="checkbox-custom"></span>
                    Will we provide material?
                  </label>
                </div>
                <p className="checkbox-description">
                  Check this if the tailor shop will provide the fabric/material
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={resetForm}
              className="button button-secondary reset-button"
              style={{
                background: COLORS.SECONDARY_RED,
                color: COLORS.TEXT_WHITE,
              }}
              disabled={loading || submitting}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="button button-primary submit-button"
              style={{
                background: COLORS.BUTTON_ACTIVE,
                color: COLORS.TEXT_WHITE,
              }}
              disabled={loading || submitting}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Processing...
                </>
              ) : (
                "Review & Place Order"
              )}
            </button>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            onClick={() => navigate("/orders")}
            className="quick-action-button"
            style={{
              background: "rgba(139, 69, 19, 0.1)",
              color: COLORS.PRIMARY_BROWN_1,
              border: `1px solid ${COLORS.PRIMARY_BROWN_1}`,
            }}
          >
            📦 View All Orders
          </button>
          <button
            onClick={handleBackHome}
            className="quick-action-button"
            style={{
              background: "rgba(220, 20, 60, 0.1)",
              color: COLORS.SECONDARY_RED,
              border: `1px solid ${COLORS.SECONDARY_RED}`,
            }}
          >
            🏠 Go to Dashboard
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="order-modal-overlay">
          <div className="order-modal-content">
            <div className="modal-header">
              <div className="modal-icon">📝</div>
              <h3 className="modal-title">Confirm Order Details</h3>
            </div>

            <div className="modal-body">
              <div className="order-summary">
                <div className="summary-item">
                  <span className="summary-label">Client:</span>
                  <span className="summary-value">
                    {selectedProfile || username}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Event Type:</span>
                  <span className="summary-value">{eventType}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Delivery Date:</span>
                  <span className="summary-value">
                    {new Date(expectedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Material Provided:</span>
                  <span className="summary-value">
                    {material ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <p className="confirmation-text">
                Please review your order details carefully. Once submitted,
                you'll receive a confirmation email.
              </p>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="button button-secondary"
                style={{
                  background: COLORS.SECONDARY_RED,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="button button-primary"
                style={{
                  background: COLORS.BUTTON_ACTIVE,
                  color: COLORS.TEXT_WHITE,
                }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Placing Order...
                  </>
                ) : (
                  "Confirm & Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Order Placed Successfully!</h3>
            <p className="success-message">
              Your order has been created and a confirmation email has been sent
              to the client.
            </p>
            <div className="success-actions">
              <button
                onClick={() => {
                  closeModal();
                  navigate("/orders");
                }}
                className="button button-primary"
                style={{
                  background: COLORS.BUTTON_ACTIVE,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                View Orders
              </button>
              <button
                onClick={() => {
                  closeModal();
                  resetForm();
                }}
                className="button button-secondary"
                style={{
                  background: COLORS.SECONDARY_RED,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                Create Another Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
